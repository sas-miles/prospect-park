uniform sampler2D tDiffuse;
uniform float noiseIntensity;
uniform vec3 vignetteColor;
uniform float vignetteRadius; // Controls the radius of the vignette effect
uniform float blurStrength; // Adjust the blur strength
varying vec2 vUv;

float inverseLerp(float v, float minValue, float maxValue) {
    return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
    float t = inverseLerp(v, inMin, inMax);
    return mix(outMin, outMax, t);
}

float random(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}


// Gaussian blur function
vec3 gaussianBlur(sampler2D tex, vec2 uv, float radius, float strength) {
    vec4 color = vec4(0.0);
    vec2 off1 = vec2(radius, radius);
    vec2 off2 = vec2(-radius, radius);
    vec2 off3 = vec2(radius, -radius);
    vec2 off4 = vec2(-radius, -radius);
    color += texture2D(tex, uv) * 0.1962;
    color += texture2D(tex, uv + off1 * strength) * 0.1193;
    color += texture2D(tex, uv - off1 * strength) * 0.1193;
    color += texture2D(tex, uv + off2 * strength) * 0.1193;
    color += texture2D(tex, uv - off2 * strength) * 0.1193;
    color += texture2D(tex, uv + off3 * strength) * 0.0484;
    color += texture2D(tex, uv - off3 * strength) * 0.0484;
    color += texture2D(tex, uv + off4 * strength) * 0.0484;
    color += texture2D(tex, uv - off4 * strength) * 0.0484;
    return color.rgb;
}

void main() {
    vec2 coords = fract(vUv * vec2(1.0, 1.0));
    
    // Calculate the vignette effect with softened edges
    vec2 vignetteCoords = vUv * 2.0 - 1.0;
    float distanceFromCenter = length(vignetteCoords);
    
    float innerEdgeSoftness = 0.4; // Control the softness of the vignette's inner edge
    
    // Adjust the start and end points for a softer transition
    float outerEdgeStart = vignetteRadius * innerEdgeSoftness * vignetteRadius;
    // float outerEdgeEnd = vignetteRadius + innerEdgeSoftness * (1.0 + vignetteRadius);
    float outerEdgeEnd = 2.0;
    float vignetteAmount = smoothstep(outerEdgeStart, outerEdgeEnd, distanceFromCenter);
    vignetteAmount = 1.0 - vignetteAmount; // Invert the vignette amount
    vignetteAmount = pow(vignetteAmount, 1.1); // Apply a power function to control the vignette amount

    
    // Original color
    vec3 color = texture2D(tDiffuse, vUv).xyz;

    // RGB shift effect
    float shiftAmount = 0.005;
    float scale = 1.5;
    float edgeIntensity = vignetteAmount * scale;

    vec2 redOffset = vec2(shiftAmount, 0.0) * edgeIntensity;
    vec2 greenOffset = vec2(-shiftAmount, 0.0) * edgeIntensity;
    vec2 blueOffset = vec2(0.0, shiftAmount) * edgeIntensity;

    float r = texture2D(tDiffuse, vUv + redOffset).r;
    float g = texture2D(tDiffuse, vUv + greenOffset).g;
    float b = texture2D(tDiffuse, vUv + blueOffset).b;

    // Combine the color with the RGB shift
    vec3 rgbShiftColor = vec3(r, g, b);

    // Blend original color and RGB shift color based on edgeIntensity
    vec3 finalColor = mix(rgbShiftColor, color, vignetteAmount);

    // Apply the vignette effect by darkening towards the edges
    finalColor = mix(finalColor, vignetteColor, 1.0 - vignetteAmount);

    // Create a mask to apply the blur outside the vignette area
    float blurMask = smoothstep(vignetteRadius, vignetteRadius + 1.0, distanceFromCenter);

    // Apply the blur effect based on the blur mask
    vec3 blurredColor = gaussianBlur(tDiffuse, vUv, blurStrength, 0.01);
    finalColor = mix(finalColor, blurredColor, blurMask);

    // Generate and apply the film grain noise
    float noise = random(vUv * coords) * noiseIntensity;
    finalColor += noise;

    gl_FragColor = vec4(finalColor, 1.0);
}