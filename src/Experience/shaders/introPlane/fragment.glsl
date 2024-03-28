uniform float uAlpha;
uniform float uTime;
uniform float seed;
uniform float scale;

varying vec2 vUv;

float random(vec2 co)
{
    highp float a = seed;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners porcentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main() {
    vec2 st = vUv * scale + vec2(uTime * 0.1, uTime * 0.1); // Animate the noise
    float n = noise(st);
    float smoothedN = smoothstep(0.2, 0.8, n); // Smoother noise impact

    // Light areas opaque, darker areas see-through
    float dynamicAlpha = mix(0.0, 1.0, smoothedN); // Darker areas more transparent

    float strength = distance(vUv, vec2(0.2)) * smoothedN;

    vec3 baseColor = vec3(0.93725, 0.96863, 0.83529);
    vec3 color = mix(baseColor * 0.8, baseColor, strength); 

    // Apply dynamic alpha
    gl_FragColor = vec4(color, dynamicAlpha * uAlpha); // Use dynamicAlpha modulated by uAlpha uniform
}



