#pragma once
#include <glad/glad.h>
#include <glm/glm.hpp>
#include <string>

class Shader {
public:
    Shader() = default;
    ~Shader();

    bool loadFromFiles(const std::string& vertPath, const std::string& fragPath);
    bool loadFromSource(const std::string& vertSrc,  const std::string& fragSrc);

    void bind()   const;
    void unbind() const;

    void setInt  (const std::string& name, int v)              const;
    void setFloat(const std::string& name, float v)            const;
    void setVec2 (const std::string& name, const glm::vec2& v) const;
    void setVec3 (const std::string& name, const glm::vec3& v) const;
    void setVec4 (const std::string& name, const glm::vec4& v) const;
    void setMat3 (const std::string& name, const glm::mat3& m) const;
    void setMat4 (const std::string& name, const glm::mat4& m) const;

    GLuint id() const { return m_id; }

private:
    GLuint compile(GLenum type, const std::string& src);
    GLuint m_id = 0;
};
