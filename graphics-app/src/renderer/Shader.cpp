#include "Shader.h"
#include <glm/gtc/type_ptr.hpp>
#include <fstream>
#include <sstream>
#include <iostream>

Shader::~Shader() { if (m_id) glDeleteProgram(m_id); }

static std::string readFile(const std::string& path) {
    std::ifstream f(path);
    if (!f) throw std::runtime_error("Cannot open shader: " + path);
    std::ostringstream ss;
    ss << f.rdbuf();
    return ss.str();
}

bool Shader::loadFromFiles(const std::string& vp, const std::string& fp) {
    return loadFromSource(readFile(vp), readFile(fp));
}

bool Shader::loadFromSource(const std::string& vs, const std::string& fs) {
    GLuint v = compile(GL_VERTEX_SHADER,   vs);
    GLuint f = compile(GL_FRAGMENT_SHADER, fs);
    if (!v || !f) return false;

    m_id = glCreateProgram();
    glAttachShader(m_id, v);
    glAttachShader(m_id, f);
    glLinkProgram(m_id);

    GLint ok;
    glGetProgramiv(m_id, GL_LINK_STATUS, &ok);
    if (!ok) {
        char log[512]; glGetProgramInfoLog(m_id, 512, nullptr, log);
        std::cerr << "Shader link:\n" << log << "\n";
        glDeleteProgram(m_id); m_id = 0;
    }
    glDeleteShader(v); glDeleteShader(f);
    return m_id != 0;
}

GLuint Shader::compile(GLenum type, const std::string& src) {
    GLuint s = glCreateShader(type);
    const char* c = src.c_str();
    glShaderSource(s, 1, &c, nullptr);
    glCompileShader(s);
    GLint ok; glGetShaderiv(s, GL_COMPILE_STATUS, &ok);
    if (!ok) {
        char log[512]; glGetShaderInfoLog(s, 512, nullptr, log);
        std::cerr << "Shader compile:\n" << log << "\n";
        glDeleteShader(s); return 0;
    }
    return s;
}

void Shader::bind()   const { glUseProgram(m_id); }
void Shader::unbind() const { glUseProgram(0); }

void Shader::setInt  (const std::string& n, int v)             const { glUniform1i (glGetUniformLocation(m_id, n.c_str()), v); }
void Shader::setFloat(const std::string& n, float v)           const { glUniform1f (glGetUniformLocation(m_id, n.c_str()), v); }
void Shader::setVec2 (const std::string& n, const glm::vec2& v)const { glUniform2fv(glGetUniformLocation(m_id, n.c_str()), 1, glm::value_ptr(v)); }
void Shader::setVec3 (const std::string& n, const glm::vec3& v)const { glUniform3fv(glGetUniformLocation(m_id, n.c_str()), 1, glm::value_ptr(v)); }
void Shader::setVec4 (const std::string& n, const glm::vec4& v)const { glUniform4fv(glGetUniformLocation(m_id, n.c_str()), 1, glm::value_ptr(v)); }
void Shader::setMat3 (const std::string& n, const glm::mat3& m)const { glUniformMatrix3fv(glGetUniformLocation(m_id, n.c_str()), 1, GL_FALSE, glm::value_ptr(m)); }
void Shader::setMat4 (const std::string& n, const glm::mat4& m)const { glUniformMatrix4fv(glGetUniformLocation(m_id, n.c_str()), 1, GL_FALSE, glm::value_ptr(m)); }
