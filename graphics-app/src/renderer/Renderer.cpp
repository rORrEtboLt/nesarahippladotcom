#include "Renderer.h"
#include "Shader.h"
#include "../scene/Scene.h"
#include "../scene/Camera.h"

#include <glad/glad.h>
#include <glm/gtc/matrix_transform.hpp>
#include <iostream>

Renderer::Renderer(int w, int h) : m_width(w), m_height(h) {}

Renderer::~Renderer() {
    if (m_gridVAO) glDeleteVertexArrays(1, &m_gridVAO);
}

bool Renderer::init() {
    glEnable(GL_DEPTH_TEST);
    glEnable(GL_MULTISAMPLE);
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    glClearColor(0.11f, 0.11f, 0.14f, 1.0f);

    m_pbrShader  = std::make_unique<Shader>();
    m_gridShader = std::make_unique<Shader>();

    if (!m_pbrShader->loadFromFiles("shaders/pbr.vert", "shaders/pbr.frag"))
        return false;
    if (!m_gridShader->loadFromFiles("shaders/grid.vert", "shaders/grid.frag"))
        return false;

    glGenVertexArrays(1, &m_gridVAO);
    return true;
}

void Renderer::resize(int w, int h) {
    m_width = w; m_height = h;
    glViewport(0, 0, w, h);
}

void Renderer::beginFrame() {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glViewport(0, 0, m_width, m_height);
}

void Renderer::drawScene(const Scene& scene) {
    const Camera& cam = scene.camera();
    float aspect = float(m_width) / float(m_height);
    glm::mat4 view = cam.viewMatrix();
    glm::mat4 proj = cam.projMatrix(aspect);

    // Infinite grid
    m_gridShader->bind();
    m_gridShader->setMat4("view", view);
    m_gridShader->setMat4("proj", proj);
    m_gridShader->setVec3("cameraPos", cam.position());
    glBindVertexArray(m_gridVAO);
    glDrawArrays(GL_TRIANGLES, 0, 6);

    // PBR scene objects
    m_pbrShader->bind();
    m_pbrShader->setMat4("view",      view);
    m_pbrShader->setMat4("proj",      proj);
    m_pbrShader->setVec3("lightDir",  m_lightDir);
    m_pbrShader->setVec3("lightColor",m_lightCol);
    m_pbrShader->setVec3("cameraPos", cam.position());

    for (const auto& obj : scene.objects()) {
        m_pbrShader->setMat4 ("model",     obj.transform);
        m_pbrShader->setVec3 ("albedo",    obj.albedo);
        m_pbrShader->setFloat("metallic",  obj.metallic);
        m_pbrShader->setFloat("roughness", obj.roughness);
        m_pbrShader->setFloat("ao",        1.0f);
        obj.mesh->draw();
    }
}

void Renderer::endFrame() {}
