#version 410 core

in  vec3 vNear;
in  vec3 vFar;
in  mat4 vView;
in  mat4 vProj;
out vec4 FragColor;

uniform vec3 cameraPos;

float gridLine(vec2 p, float scale) {
    vec2 coord = p / scale;
    vec2 g     = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    return 1.0 - min(min(g.x, g.y), 1.0);
}

void main() {
    // Ray-plane (y=0) intersection
    float t = -vNear.y / (vFar.y - vNear.y);
    if (t < 0.0) discard;

    vec3 hit  = vNear + t * (vFar - vNear);
    float dist = length(cameraPos.xz - hit.xz);

    float g1  = gridLine(hit.xz, 1.0);
    float g10 = gridLine(hit.xz, 10.0);
    float fade = 1.0 - smoothstep(20.0, 70.0, dist);
    float grid = max(g1 * 0.35, g10 * 0.9) * fade;

    // Reconstruct depth for proper depth-buffer write
    vec4 clip     = vProj * vView * vec4(hit, 1.0);
    gl_FragDepth  = (clip.z / clip.w) * 0.5 + 0.5;

    vec3 col = mix(vec3(0.35), vec3(0.8, 0.3, 0.3), step(abs(hit.x), 0.02))
             + mix(vec3(0.0),  vec3(0.3, 0.3, 0.8), step(abs(hit.z), 0.02));
    col = max(col, vec3(0.35));

    FragColor = vec4(col, grid);
    if (FragColor.a < 0.01) discard;
}
