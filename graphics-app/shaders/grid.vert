#version 410 core

uniform mat4 view;
uniform mat4 proj;

out vec3 vNear;
out vec3 vFar;
out mat4 vView;
out mat4 vProj;

// Full-screen triangle pair in NDC
const vec2 CORNERS[6] = vec2[6](
    vec2(-1,-1), vec2(1,-1), vec2(1,1),
    vec2(-1,-1), vec2(1,1),  vec2(-1,1)
);

vec3 unproject(vec2 ndc, float depth) {
    mat4 inv = inverse(proj * view);
    vec4 p   = inv * vec4(ndc, depth, 1.0);
    return p.xyz / p.w;
}

void main() {
    vec2 ndc    = CORNERS[gl_VertexID];
    vNear       = unproject(ndc, -1.0);
    vFar        = unproject(ndc,  1.0);
    vView       = view;
    vProj       = proj;
    gl_Position = vec4(ndc, 0.0, 1.0);
}
