#pragma once
#include <glm/glm.hpp>
#include <SDL.h>

class Camera {
public:
    Camera();

    void processEvent(const SDL_Event& e);
    void update(float dt);

    glm::mat4 viewMatrix() const;
    glm::mat4 projMatrix(float aspect, float fovDeg = 60.f,
                         float near = 0.1f, float far = 500.f) const;

    glm::vec3 position() const { return m_pos; }

    float     yaw    = 45.f;
    float     pitch  = 30.f;
    float     radius = 8.f;
    glm::vec3 target = {0.f, 0.f, 0.f};

private:
    void recalc();

    glm::vec3 m_pos     = {5.f, 5.f, 5.f};
    bool      m_drag    = false;
    int       m_lastX   = 0;
    int       m_lastY   = 0;
};
