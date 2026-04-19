#version 410 core

in  vec3 vWorldPos;
in  vec3 vNormal;
in  vec2 vUV;
out vec4 FragColor;

uniform vec3  lightDir;
uniform vec3  lightColor;
uniform vec3  cameraPos;
uniform vec3  albedo;
uniform float metallic;
uniform float roughness;
uniform float ao;

const float PI = 3.14159265359;

float distributionGGX(vec3 N, vec3 H, float r) {
    float a  = r * r;
    float a2 = a * a;
    float d  = max(dot(N, H), 0.0);
    float denom = d * d * (a2 - 1.0) + 1.0;
    return a2 / (PI * denom * denom);
}

float geometrySchlick(float NdV, float r) {
    float k = (r + 1.0) * (r + 1.0) / 8.0;
    return NdV / (NdV * (1.0 - k) + k);
}

float geometrySmith(vec3 N, vec3 V, vec3 L, float r) {
    return geometrySchlick(max(dot(N, V), 0.0), r)
         * geometrySchlick(max(dot(N, L), 0.0), r);
}

vec3 fresnelSchlick(float cosT, vec3 F0) {
    return F0 + (1.0 - F0) * pow(clamp(1.0 - cosT, 0.0, 1.0), 5.0);
}

void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(cameraPos - vWorldPos);
    vec3 L = normalize(lightDir);
    vec3 H = normalize(V + L);

    vec3 F0 = mix(vec3(0.04), albedo, metallic);

    float NDF = distributionGGX(N, H, roughness);
    float G   = geometrySmith(N, V, L, roughness);
    vec3  F   = fresnelSchlick(max(dot(H, V), 0.0), F0);

    vec3  num   = NDF * G * F;
    float denom = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0) + 0.0001;
    vec3  spec  = num / denom;

    vec3  kD  = (1.0 - F) * (1.0 - metallic);
    float NdL = max(dot(N, L), 0.0);
    vec3  Lo  = (kD * albedo / PI + spec) * lightColor * NdL;

    vec3 ambient = vec3(0.03) * albedo * ao;
    vec3 color   = ambient + Lo;

    // Reinhard tonemap + gamma
    color = color / (color + vec3(1.0));
    color = pow(color, vec3(1.0 / 2.2));

    FragColor = vec4(color, 1.0);
}
