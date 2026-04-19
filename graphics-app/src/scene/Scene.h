#pragma once
#include "../renderer/Mesh.h"
#include "Camera.h"
#include <glm/glm.hpp>
#include <memory>
#include <vector>
#include <string>

struct SceneObject {
    std::string            name;
    std::shared_ptr<Mesh>  mesh;
    glm::mat4              transform = glm::mat4(1.f);
    glm::vec3              albedo    = {0.8f, 0.8f, 0.8f};
    float                  metallic  = 0.0f;
    float                  roughness = 0.5f;
    bool                   selected  = false;
};

enum class PrimitiveType { Cube, Sphere, Plane, Cylinder };

class Scene {
public:
    Scene();

    void loadDefault();
    void update(float dt);

    void addObject(PrimitiveType type, const std::string& name = "");
    void removeSelected();
    void clearAll();

    Camera&       camera()       { return m_camera; }
    const Camera& camera() const { return m_camera; }

    std::vector<SceneObject>&       objects()       { return m_objects; }
    const std::vector<SceneObject>& objects() const { return m_objects; }

    SceneObject* selectedObject();

private:
    std::vector<SceneObject> m_objects;
    Camera                   m_camera;
    int                      m_nextId = 0;
};
