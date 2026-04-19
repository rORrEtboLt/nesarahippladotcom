#include "UI.h"
#include "../scene/Scene.h"
#include "../renderer/Renderer.h"
#include "../ai/MiniMaxClient.h"

#include <imgui.h>
#include <glm/gtc/type_ptr.hpp>
#include <algorithm>
#include <cstdlib>
#include <cstdio>
#include <thread>
#include <atomic>

static std::unique_ptr<MiniMaxClient> s_ai;
static std::string       s_asyncResponse;
static std::atomic<bool> s_responseReady{false};

UI::UI(Scene& scene, Renderer& renderer) : m_scene(scene), m_renderer(renderer) {
    const char* key   = std::getenv("MINIMAX_API_KEY");
    const char* group = std::getenv("MINIMAX_GROUP_ID");
    s_ai = std::make_unique<MiniMaxClient>(key ? key : "", group ? group : "");
}

void UI::draw() {
    drawMenuBar();
    drawSceneHierarchy();
    drawProperties();
    drawAIPanel();
    drawCameraPanel();
}

void UI::drawMenuBar() {
    if (ImGui::BeginMainMenuBar()) {
        if (ImGui::BeginMenu("Add")) {
            if (ImGui::MenuItem("Cube"))     m_scene.addObject(PrimitiveType::Cube);
            if (ImGui::MenuItem("Sphere"))   m_scene.addObject(PrimitiveType::Sphere);
            if (ImGui::MenuItem("Plane"))    m_scene.addObject(PrimitiveType::Plane);
            if (ImGui::MenuItem("Cylinder")) m_scene.addObject(PrimitiveType::Cylinder);
            ImGui::EndMenu();
        }
        if (ImGui::BeginMenu("Scene")) {
            if (ImGui::MenuItem("Reset to Default")) { m_scene.clearAll(); m_scene.loadDefault(); }
            if (ImGui::MenuItem("Clear All"))         m_scene.clearAll();
            ImGui::EndMenu();
        }
        ImGui::EndMainMenuBar();
    }
}

void UI::drawSceneHierarchy() {
    ImGui::SetNextWindowPos({0, 20}, ImGuiCond_Always);
    ImGui::SetNextWindowSize({220, 380}, ImGuiCond_Always);
    ImGui::Begin("Scene Hierarchy", nullptr, ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoResize);

    auto& objs = m_scene.objects();
    for (int i = 0; i < (int)objs.size(); i++) {
        bool sel = objs[i].selected;
        if (ImGui::Selectable(objs[i].name.c_str(), sel)) {
            for (auto& o : objs) o.selected = false;
            objs[i].selected = true;
        }
    }
    ImGui::Separator();
    if (ImGui::Button("Delete Selected")) m_scene.removeSelected();
    ImGui::End();
}

void UI::drawProperties() {
    ImGui::SetNextWindowPos({0, 400}, ImGuiCond_Always);
    ImGui::SetNextWindowSize({220, 320}, ImGuiCond_Always);
    ImGui::Begin("Properties", nullptr, ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoResize);

    SceneObject* obj = m_scene.selectedObject();
    if (!obj) { ImGui::TextDisabled("No selection"); ImGui::End(); return; }

    ImGui::Text("%s", obj->name.c_str());
    ImGui::Separator();

    glm::vec3 pos(obj->transform[3]);
    if (ImGui::DragFloat3("Position", glm::value_ptr(pos), 0.05f))
        obj->transform[3] = glm::vec4(pos, 1.f);

    glm::vec3 scale{
        glm::length(glm::vec3(obj->transform[0])),
        glm::length(glm::vec3(obj->transform[1])),
        glm::length(glm::vec3(obj->transform[2]))};
    if (ImGui::DragFloat3("Scale", glm::value_ptr(scale), 0.01f, 0.01f, 50.f)) {
        for (int i = 0; i < 3; i++) {
            float len = glm::length(glm::vec3(obj->transform[i]));
            if (len > 0.0001f)
                obj->transform[i] = glm::vec4(glm::vec3(obj->transform[i]) / len * scale[i], 0.f);
        }
    }

    ImGui::Separator();
    ImGui::ColorEdit3("Albedo",    glm::value_ptr(obj->albedo));
    ImGui::SliderFloat("Metallic", &obj->metallic,  0.f, 1.f);
    ImGui::SliderFloat("Roughness",&obj->roughness, 0.02f, 1.f);
    ImGui::End();
}

void UI::drawAIPanel() {
    ImGuiIO& io = ImGui::GetIO();
    ImGui::SetNextWindowPos({0, io.DisplaySize.y - 220}, ImGuiCond_Always);
    ImGui::SetNextWindowSize({440, 220}, ImGuiCond_Always);
    ImGui::Begin("AI Design (MiniMax)", nullptr,
        ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoResize);

    if (!s_ai->isConfigured())
        ImGui::TextColored({1.f, 0.6f, 0.f, 1.f}, "Set MINIMAX_API_KEY to enable AI prompts.");

    ImGui::InputTextMultiline("##prompt", m_promptBuf, sizeof(m_promptBuf), {424, 80});

    if (s_responseReady.exchange(false)) {
        applyAIResponse(s_asyncResponse);
        m_lastAIResponse = s_asyncResponse;
        m_busy = false;
    }

    ImGui::BeginDisabled(m_busy || !s_ai->isConfigured());
    if (ImGui::Button("Send to AI")) {
        m_busy = true;
        m_statusMsg = "Waiting for MiniMax...";
        std::string msg(m_promptBuf);
        std::thread([msg]() {
            s_asyncResponse = s_ai->prompt(msg);
            s_responseReady.store(true);
        }).detach();
    }
    ImGui::EndDisabled();

    ImGui::SameLine();
    ImGui::TextDisabled("%s", m_statusMsg.c_str());

    if (!m_lastAIResponse.empty()) {
        ImGui::Separator();
        std::string preview = m_lastAIResponse.substr(0, 180);
        ImGui::TextWrapped("%s", preview.c_str());
    }
    ImGui::End();
}

void UI::drawCameraPanel() {
    ImGuiIO& io = ImGui::GetIO();
    ImGui::SetNextWindowPos({io.DisplaySize.x - 230, 20}, ImGuiCond_Always);
    ImGui::SetNextWindowSize({230, 130}, ImGuiCond_Always);
    ImGui::Begin("Camera", nullptr, ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoResize);
    auto& cam = m_scene.camera();
    ImGui::SliderFloat("Yaw",    &cam.yaw,   -180.f, 180.f);
    ImGui::SliderFloat("Pitch",  &cam.pitch,  -89.f,  89.f);
    ImGui::SliderFloat("Radius", &cam.radius,   1.f,  80.f);
    ImGui::TextDisabled("Right-drag or middle-drag to orbit");
    ImGui::TextDisabled("Scroll to zoom");
    ImGui::End();
}

void UI::applyAIResponse(const std::string& response) {
    auto cmds = s_ai->parseCommands(response);
    if (cmds.empty()) { m_statusMsg = "No commands parsed."; return; }

    for (const auto& cmd : cmds) {
        if (cmd.action == "add") {
            PrimitiveType t = PrimitiveType::Cube;
            if (cmd.target == "sphere")   t = PrimitiveType::Sphere;
            if (cmd.target == "plane")    t = PrimitiveType::Plane;
            if (cmd.target == "cylinder") t = PrimitiveType::Cylinder;
            m_scene.addObject(t);

        } else if (cmd.action == "remove") {
            auto& objs = m_scene.objects();
            objs.erase(std::remove_if(objs.begin(), objs.end(),
                [&](const SceneObject& o) { return o.name == cmd.target; }), objs.end());

        } else if (cmd.action == "modify") {
            for (auto& obj : m_scene.objects()) {
                if (obj.name != cmd.target) continue;
                if (cmd.property == "color" || cmd.property == "albedo") {
                    float r,g,b;
                    if (std::sscanf(cmd.value.c_str(), "%f,%f,%f", &r, &g, &b) == 3)
                        obj.albedo = {r,g,b};
                } else if (cmd.property == "metallic") {
                    obj.metallic  = std::stof(cmd.value);
                } else if (cmd.property == "roughness") {
                    obj.roughness = std::stof(cmd.value);
                } else if (cmd.property == "position") {
                    float x,y,z;
                    if (std::sscanf(cmd.value.c_str(), "%f,%f,%f", &x, &y, &z) == 3)
                        obj.transform[3] = {x, y, z, 1.f};
                }
            }
        }
    }
    m_statusMsg = "Applied " + std::to_string(cmds.size()) + " command(s).";
}
