uniform float time;
uniform float amplitude;
uniform vec2 frequency;
uniform float speed;

varying vec2 vUv;
varying float vWave;

void main() {
    vUv = uv;

    // Calculate the sine wave with some randomness
    float wave = amplitude * sin(position.x * frequency.x + time * speed) 
                 + amplitude * sin(position.y * frequency.y + time * speed);
    vWave = wave;

    // Apply the wave to the vertex position
    vec3 newPos = position + normal * wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
}
