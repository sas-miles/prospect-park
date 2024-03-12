uniform sampler2D tDiffuse;
uniform float noiseIntensity;
uniform vec3 vignetteColor;
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

void main() {
    vec2 coords = fract(vUv * vec2(1.0, 1.0));

    // Calculate the vignette effect
    vec2 vignetteCoords = fract(vUv);
    float v1 = smoothstep(2.2, 0.008, abs(vignetteCoords.x - 0.5));
    float v2 = smoothstep(1.2, 0.008, abs(vignetteCoords.y - 0.5));
    float vignetteAmount = v1 * v2; // Don't multiply by 4.0 to keep the outer edges dark

    // Original color
    vec3 color = texture2D(tDiffuse, vUv).xyz;

    // RGB shift effect
    float shiftAmount = 0.004; // Amount of RGB shift
    float edgeIntensity = 0.8 - vignetteAmount; // Apply the shift more on the edges, less in the center

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

    // Generate and apply the film grain noise
    float noise = random(vUv * coords) * noiseIntensity;
    finalColor += noise;

    gl_FragColor = vec4(finalColor, 1.0);
}
