#include "Scene.h"
#include <glm/gtc/matrix_transform.hpp>
#include <algorithm>

Scene::Scene() = default;

void Scene::loadDefault() {
    addObject(PrimitiveType::Plane, "Ground");
    m_objects.back().albedo    = {0.3f, 0.3f, 0.35f};
    m_objects.back().roughness = 0.9f;

    addObject(PrimitiveType::Sphere, "Sphere_0");
    m_objects.back().transform = glm::translate(glm::mat4(1.f), {0.f, 1.f, 0.f});
    m_objects.back().albedo    = {0.9f, 0.2f, 0.1f};
    m_objects.back().roughness = 0.3f;

    addObject(PrimitiveType::Cube, "Cube_0");
    m_objects.back().transform =
        glm::translate(glm::mat4(1.f), {2.5f, 0.5f, 0.f}) *
        glm::rotate(glm::mat4(1.f), glm::radians(30.f), {0.f, 1.f, 0.f});
    m_objects.back().albedo    = {0.2f, 0.5f, 0.9f};
    m_objects.back().metallic  = 0.8f;
    m_objects.back().roughness = 0.2f;

    addObject(PrimitiveType::Cylinder, "Cylinder_0");
    m_objects.back().transform = glm::translate(glm::mat4(1.f), {-2.5f, 0.5f, 0.f});
    m_objects.back().albedo    = {0.6f, 0.9f, 0.3f};
    m_objects.back().metallic  = 0.2f;
    m_objects.back().roughness = 0.6f;
}

void Scene::update(float dt) { m_camera.update(dt); }

static std::shared_ptr<Mesh> buildMesh(PrimitiveType t) {
    auto m = std::make_shared<Mesh>();
    switch (t) {
        case PrimitiveType::Cube:     *m = Mesh::makeCube();             break;
        case PrimitiveType::Sphere:   *m = Mesh::makeSphere();           break;
        case PrimitiveType::Plane:    *m = Mesh::makePlane(10.f, 10);    break;
        case PrimitiveType::Cylinder: *m = Mesh::makeCylinder();         break;
    }
    return m;
}

void Scene::addObject(PrimitiveType type, const std::string& name) {
    SceneObject obj;
    obj.name = name.empty() ? ("Object_" + std::to_string(m_nextId++)) : name;
    obj.mesh = buildMesh(type);
    m_objects.push_back(std::move(obj));
}

void Scene::removeSelected() {
    m_objects.erase(
        std::remove_if(m_objects.begin(), m_objects.end(),
            [](const SceneObject& o) { return o.selected; }),
        m_objects.end());
}

void Scene::clearAll() { m_objects.clear(); }

SceneObject* Scene::selectedObject() {
    for (auto& o : m_objects)
        if (o.selected) return &o;
    return nullptr;
}
