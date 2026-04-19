#pragma once
#include <glad/glad.h>
#include <glm/glm.hpp>
#include <memory>

class Scene;
class Shader;

class Renderer {
public:
    Renderer(int width, int height);
    ~Renderer();

    bool init();
    void resize(int w, int h);
    void beginFrame();
    void drawScene(const Scene& scene);
    void endFrame();

    int width()  const { return m_width; }
    int height() const { return m_height; }

private:
    int m_width, m_height;

    std::unique_ptr<Shader> m_pbrShader;
    std::unique_ptr<Shader> m_gridShader;

    GLuint    m_gridVAO  = 0;
    glm::vec3 m_lightDir = glm::normalize(glm::vec3(1.f, 2.f, 1.f));
    glm::vec3 m_lightCol = {1.0f, 0.95f, 0.85f};
};
