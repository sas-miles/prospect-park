uniform vec3 waterColor;
uniform float alpha;

varying vec2 vUv;
varying float vWave;

void main() {
    // Use vWave for some color variation
    float intensity = 0.5 + 0.5 * sin(vWave);
    vec3 color = mix(waterColor, vec3(1.0, 1.0, 1.0), intensity);

    gl_FragColor = vec4(color, alpha);
}
