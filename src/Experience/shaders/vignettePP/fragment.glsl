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
vec3 gaussianBlur(sampler2D tex, vec2 uv, float blurRadius, float strength) {
    vec4 color = vec4(0.0);
    // Directly use blurRadius to adjust the offset distances
    vec2 off1 = vec2(blurRadius, blurRadius);
    vec2 off2 = vec2(-blurRadius, blurRadius);
    vec2 off3 = vec2(blurRadius, -blurRadius);
    vec2 off4 = vec2(-blurRadius, -blurRadius);

    // Apply a base strength to all offsets to modulate the blur effect's intensity
    float baseStrength = 0.1193 * strength;
    float cornerStrength = 0.0484 * strength;

    color += texture2D(tex, uv) * 0.1962;
    color += texture2D(tex, uv + off1) * baseStrength;
    color += texture2D(tex, uv - off1) * baseStrength;
    color += texture2D(tex, uv + off2) * baseStrength;
    color += texture2D(tex, uv - off2) * baseStrength;
    color += texture2D(tex, uv + off3) * cornerStrength;
    color += texture2D(tex, uv - off3) * cornerStrength;
    color += texture2D(tex, uv + off4) * cornerStrength;
    color += texture2D(tex, uv - off4) * cornerStrength;
    return color.rgb;
}

void main() {
    vec2 coords = fract(vUv * vec2(1.0, 1.0));
    
    // Calculate the vignette effect with softened edges
    vec2 vignetteCoords = vUv * 2.0 - 1.0;
    float distanceFromCenter = length(vignetteCoords);
    
    float innerEdgeSoftness = 1.1; // Control the softness of the vignette's inner edge
    
    // Adjust the start and end points for a softer transition
    float outerEdgeStart = vignetteRadius * innerEdgeSoftness * vignetteRadius;

    // float outerEdgeEnd = vignetteRadius + innerEdgeSoftness * (1.0 + vignetteRadius);
    float outerEdgeEnd = 1.5;
    float vignetteAmount = smoothstep(outerEdgeStart, outerEdgeEnd, distanceFromCenter);
    vignetteAmount = 1.0 - vignetteAmount; // Invert the vignette amount

    

    
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

    // Apply the vignette effect with adjusted opacity
    float vignetteOpacity = 0.1; // Adjust this value as needed
    finalColor = mix(finalColor, vignetteColor, (1.0 - vignetteAmount) * vignetteOpacity);

    // Create a mask to apply the blur outside the vignette area
    float blurMask = smoothstep(vignetteRadius, vignetteRadius + 1.0, distanceFromCenter);

    // Calculate dynamic blur strength here, after blurMask is defined
    float dynamicBlurStrength = blurStrength * blurMask;


    // Apply the blur effect based on the dynamic blur strength
    vec3 blurredColor = gaussianBlur(tDiffuse, vUv, blurStrength, dynamicBlurStrength);


    finalColor = mix(finalColor, blurredColor, blurMask);

    // Generate and apply the film grain noise
    float noise = random(vUv * coords) * noiseIntensity;
    finalColor += noise;

    gl_FragColor = vec4(finalColor, 1.0);
}