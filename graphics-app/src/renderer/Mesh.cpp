#include "Mesh.h"
#include <cmath>
#include <utility>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

Mesh::~Mesh() {
    if (m_vao) glDeleteVertexArrays(1, &m_vao);
    if (m_vbo) glDeleteBuffers(1, &m_vbo);
    if (m_ebo) glDeleteBuffers(1, &m_ebo);
}

Mesh::Mesh(Mesh&& o) noexcept
    : m_vao(o.m_vao), m_vbo(o.m_vbo), m_ebo(o.m_ebo), m_indexCount(o.m_indexCount) {
    o.m_vao = o.m_vbo = o.m_ebo = 0;
}

Mesh& Mesh::operator=(Mesh&& o) noexcept {
    if (this != &o) {
        if (m_vao) glDeleteVertexArrays(1, &m_vao);
        if (m_vbo) glDeleteBuffers(1, &m_vbo);
        if (m_ebo) glDeleteBuffers(1, &m_ebo);
        m_vao = o.m_vao; m_vbo = o.m_vbo; m_ebo = o.m_ebo;
        m_indexCount = o.m_indexCount;
        o.m_vao = o.m_vbo = o.m_ebo = 0;
    }
    return *this;
}

void Mesh::upload(const std::vector<Vertex>& verts, const std::vector<uint32_t>& idx) {
    m_indexCount = static_cast<uint32_t>(idx.size());
    glGenVertexArrays(1, &m_vao);
    glGenBuffers(1, &m_vbo);
    glGenBuffers(1, &m_ebo);
    glBindVertexArray(m_vao);

    glBindBuffer(GL_ARRAY_BUFFER, m_vbo);
    glBufferData(GL_ARRAY_BUFFER, verts.size() * sizeof(Vertex), verts.data(), GL_STATIC_DRAW);

    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, m_ebo);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, idx.size() * sizeof(uint32_t), idx.data(), GL_STATIC_DRAW);

    glEnableVertexAttribArray(0);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)offsetof(Vertex, position));
    glEnableVertexAttribArray(1);
    glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)offsetof(Vertex, normal));
    glEnableVertexAttribArray(2);
    glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)offsetof(Vertex, uv));
    glEnableVertexAttribArray(3);
    glVertexAttribPointer(3, 3, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)offsetof(Vertex, tangent));

    glBindVertexArray(0);
}

void Mesh::draw() const {
    glBindVertexArray(m_vao);
    glDrawElements(GL_TRIANGLES, m_indexCount, GL_UNSIGNED_INT, nullptr);
    glBindVertexArray(0);
}

Mesh Mesh::makeCube(float s) {
    float h = s * 0.5f;
    std::vector<Vertex> v;
    std::vector<uint32_t> idx;

    auto face = [&](glm::vec3 n, glm::vec3 t, glm::vec3 b, glm::vec3 center) {
        uint32_t base = (uint32_t)v.size();
        for (int i = 0; i < 4; i++) {
            float s0 = (i & 1) ? 1.f : -1.f;
            float s1 = (i & 2) ? 1.f : -1.f;
            Vertex vt;
            vt.position = center + t*(h*s0) + b*(h*s1);
            vt.normal   = n;
            vt.uv       = {(s0+1)*0.5f, (s1+1)*0.5f};
            vt.tangent  = t;
            v.push_back(vt);
        }
        idx.insert(idx.end(), {base, base+1, base+2, base+1, base+3, base+2});
    };

    face({ 0,0, 1},{1,0,0},{0,1,0},{0,0, h});
    face({ 0,0,-1},{-1,0,0},{0,1,0},{0,0,-h});
    face({ 0, 1,0},{1,0,0},{0,0,-1},{0, h,0});
    face({ 0,-1,0},{1,0,0},{0,0, 1},{0,-h,0});
    face({ 1,0,0},{0,0,-1},{0,1,0},{ h,0,0});
    face({-1,0,0},{0,0, 1},{0,1,0},{-h,0,0});

    Mesh m; m.upload(v, idx); return m;
}

Mesh Mesh::makeSphere(float radius, int stacks, int slices) {
    std::vector<Vertex> verts;
    std::vector<uint32_t> idx;

    for (int i = 0; i <= stacks; i++) {
        float phi = float(i) / stacks * float(M_PI);
        for (int j = 0; j <= slices; j++) {
            float theta = float(j) / slices * 2.f * float(M_PI);
            Vertex v;
            v.normal   = {sinf(phi)*cosf(theta), cosf(phi), sinf(phi)*sinf(theta)};
            v.position = v.normal * radius;
            v.uv       = {float(j)/slices, float(i)/stacks};
            v.tangent  = {-sinf(theta), 0.f, cosf(theta)};
            verts.push_back(v);
        }
    }
    for (int i = 0; i < stacks; i++)
        for (int j = 0; j < slices; j++) {
            uint32_t a = i*(slices+1)+j, b = a+slices+1;
            idx.insert(idx.end(), {a, b, a+1, b, b+1, a+1});
        }
    Mesh m; m.upload(verts, idx); return m;
}

Mesh Mesh::makePlane(float size, int divs) {
    std::vector<Vertex> verts;
    std::vector<uint32_t> idx;
    float step = size / divs, half = size * 0.5f;

    for (int i = 0; i <= divs; i++)
        for (int j = 0; j <= divs; j++) {
            Vertex v;
            v.position = {-half + j*step, 0, -half + i*step};
            v.normal   = {0,1,0};
            v.uv       = {float(j)/divs, float(i)/divs};
            v.tangent  = {1,0,0};
            verts.push_back(v);
        }
    for (int i = 0; i < divs; i++)
        for (int j = 0; j < divs; j++) {
            uint32_t a = i*(divs+1)+j;
            idx.insert(idx.end(), {a, a+uint32_t(divs)+1, a+1, a+1, a+uint32_t(divs)+1, a+uint32_t(divs)+2});
        }
    Mesh m; m.upload(verts, idx); return m;
}

Mesh Mesh::makeCylinder(float radius, float height, int slices) {
    std::vector<Vertex> verts;
    std::vector<uint32_t> idx;

    for (int i = 0; i <= slices; i++) {
        float t = float(i)/slices * 2.f * float(M_PI);
        glm::vec3 n = {cosf(t), 0.f, sinf(t)};
        for (int top : {0,1}) {
            Vertex v;
            v.position = n*radius + glm::vec3(0, top ? height*0.5f : -height*0.5f, 0);
            v.normal   = n;
            v.uv       = {float(i)/slices, float(top)};
            v.tangent  = {-sinf(t), 0.f, cosf(t)};
            verts.push_back(v);
        }
    }
    for (int i = 0; i < slices; i++) {
        uint32_t a = i*2;
        idx.insert(idx.end(), {a, a+2, a+1, a+1, a+2, a+3});
    }
    Mesh m; m.upload(verts, idx); return m;
}
