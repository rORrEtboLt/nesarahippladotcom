#pragma once
#include <glad/glad.h>
#include <glm/glm.hpp>
#include <vector>

struct Vertex {
    glm::vec3 position;
    glm::vec3 normal;
    glm::vec2 uv;
    glm::vec3 tangent;
};

enum class CSGOperation { Union, Difference, Intersection };

class Mesh {
public:
    Mesh() = default;
    ~Mesh();
    Mesh(Mesh&&) noexcept;
    Mesh& operator=(Mesh&&) noexcept;
    Mesh(const Mesh&)            = delete;
    Mesh& operator=(const Mesh&) = delete;

    void upload(const std::vector<Vertex>& verts, const std::vector<uint32_t>& idx);
    void draw() const;

    static Mesh makeCube(float size = 1.0f);
    static Mesh makeSphere(float radius = 0.5f, int stacks = 32, int slices = 32);
    static Mesh makePlane(float size = 10.0f, int divs = 10);
    static Mesh makeCylinder(float radius = 0.5f, float height = 1.0f, int slices = 32);

    // CSG / mesh operations
    static Mesh CSG(const Mesh& a, const Mesh& b, CSGOperation op);

    uint32_t indexCount() const { return m_indexCount; }
    const std::vector<Vertex>& vertices() const { return m_vertices; }
    const std::vector<uint32_t>& indices() const { return m_indices; }

private:
    GLuint   m_vao = 0, m_vbo = 0, m_ebo = 0;
    uint32_t m_indexCount = 0;
    std::vector<Vertex>   m_vertices;
    std::vector<uint32_t> m_indices;
};
