#include "Camera.h"
#include <glm/gtc/matrix_transform.hpp>
#include <algorithm>
#include <cmath>

Camera::Camera() { recalc(); }

void Camera::recalc() {
    float p = glm::radians(pitch);
    float y = glm::radians(yaw);
    m_pos = target + glm::vec3(
        radius * cosf(p) * cosf(y),
        radius * sinf(p),
        radius * cosf(p) * sinf(y));
}

glm::mat4 Camera::viewMatrix() const {
    return glm::lookAt(m_pos, target, {0.f, 1.f, 0.f});
}

glm::mat4 Camera::projMatrix(float aspect, float fovDeg, float near, float far) const {
    return glm::perspective(glm::radians(fovDeg), aspect, near, far);
}

void Camera::processEvent(const SDL_Event& e) {
    if (e.type == SDL_MOUSEBUTTONDOWN &&
        (e.button.button == SDL_BUTTON_MIDDLE || e.button.button == SDL_BUTTON_RIGHT)) {
        m_drag = true;
        m_lastX = e.button.x;
        m_lastY = e.button.y;
    }
    if (e.type == SDL_MOUSEBUTTONUP) m_drag = false;
    if (e.type == SDL_MOUSEMOTION && m_drag) {
        yaw   += (e.motion.x - m_lastX) * 0.4f;
        pitch -= (e.motion.y - m_lastY) * 0.4f;
        pitch  = std::clamp(pitch, -89.f, 89.f);
        m_lastX = e.motion.x;
        m_lastY = e.motion.y;
        recalc();
    }
    if (e.type == SDL_MOUSEWHEEL) {
        radius = std::max(1.f, radius - e.wheel.y * 0.5f);
        recalc();
    }
}

void Camera::update(float /*dt*/) { recalc(); }
