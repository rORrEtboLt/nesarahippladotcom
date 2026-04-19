#include "UI.h"
#include "../scene/Scene.h"
#include "../renderer/Renderer.h"
#include "../config/Config.h"
#include "../ai/MiniMaxClient.h"

#include <imgui.h>
#include <glm/gtc/type_ptr.hpp>
#include <algorithm>
#include <cstdlib>
#include <cstdio>
#include <cstring>
#include <thread>
#include <atomic>

static std::unique_ptr<MiniMaxClient> s_ai;
static std::string       s_asyncResponse;
static std::atomic<bool> s_responseReady{false};

static std::string buildSceneContext(const Scene& scene) {
    std::string ctx = "=== CURRENT SCENE STATE ===\n";
    const auto& objs = scene.objects();
    if (objs.empty()) {
        ctx += "Scene is empty.\n";
    } else {
        for (const auto& o : objs) {
            glm::vec3 pos(o.transform[3]);
            ctx += o.name + " | pos=(" + std::to_string(pos.x) + "," + std::to_string(pos.y) + "," + std::to_string(pos.z) + ")";
            ctx += " | color=(" + std::to_string(o.albedo.r) + "," + std::to_string(o.albedo.g) + "," + std::to_string(o.albedo.b) + ")";
            ctx += " | metallic=" + std::to_string(o.metallic) + " | roughness=" + std::to_string(o.roughness);
            if (o.selected) ctx += " [SELECTED]";
            ctx += "\n";
        }
    }
    ctx += "\n=== AVAILABLE ACTIONS ===\n";
    ctx += "- add: add a new primitive (cube/sphere/plane/cylinder) to the scene\n";
    ctx += "- remove: remove an object by name\n";
    ctx += "- modify: change an object's properties (color/albedo, metallic, roughness, position)\n";
    ctx += "\n=== RESPONSE FORMAT ===\n";
    ctx += "Always respond with a JSON object containing:\n";
    ctx += "- \"commands\": array of {action, target, property, value}\n";
    ctx += "- \"description\": brief human-readable summary\n";
    ctx += "Example: {\"commands\":[{\"action\":\"add\",\"target\":\"sphere\"},{\"action\":\"modify\",\"target\":\"Cube_0\",\"property\":\"color\",\"value\":\"0.8,0.2,0.3\"}],\"description\":\"Added a sphere and made Cube_0 red.\"}\n";
    ctx += "\n=== USER REQUEST ===\n";
    return ctx;
}

UI::UI(Scene& scene, Renderer& renderer, Config& config)
    : m_scene(scene), m_renderer(renderer), m_config(config) {
    s_ai = std::make_unique<MiniMaxClient>(
        config.getMiniMaxApiKey(),
        config.getMiniMaxGroupId(),
        config.getMiniMaxApiHost());
    s_ai->setModel(config.getMiniMaxModel());
}

void UI::draw() {
    drawMenuBar();
    drawSceneHierarchy();
    drawProperties();
    drawAIPanel();
    drawCameraPanel();
    if (m_showSettings)
        drawSettingsPanel();
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

    // Status + settings button in title bar
    ImGui::TextColored(s_ai->isConfigured() ? ImVec4(0.4f,0.9f,0.4f,1.f) : ImVec4(1.f,0.6f,0.f,1.f),
        "%s", s_ai->isConfigured() ? "Configured" : "Not configured");
    ImGui::SameLine();
    if (ImGui::SmallButton("Settings")) m_showSettings = !m_showSettings;

    // Prompt input with right-click context menu (copy/paste)
    ImGui::InputTextMultiline("##prompt", m_promptBuf, sizeof(m_promptBuf), {424, 80});
    if (ImGui::BeginPopupContextItem("##prompt_ctx")) {
        if (ImGui::MenuItem("Copy", "Ctrl+C", false, true))
            ImGui::SetClipboardText(m_promptBuf);
        if (ImGui::MenuItem("Paste", "Ctrl+V", false, true)) {
            const char* txt = ImGui::GetClipboardText();
            if (txt && strlen(m_promptBuf) + strlen(txt) < sizeof(m_promptBuf) - 1) {
                strncat(m_promptBuf, txt, sizeof(m_promptBuf) - strlen(m_promptBuf) - 1);
            }
        }
        ImGui::EndPopup();
    }

    if (s_responseReady.exchange(false)) {
        applyAIResponse(s_asyncResponse);
        m_lastAIResponse = s_asyncResponse;
        m_busy = false;
    }

    ImGui::BeginDisabled(m_busy || !s_ai->isConfigured());
    if (ImGui::Button("Send to AI")) {
        m_busy = true;
        m_statusMsg = "Waiting for MiniMax...";
        std::string sceneCtx = buildSceneContext(m_scene);
        std::string userPrompt = std::string(m_promptBuf);
        std::string fullPrompt = sceneCtx + userPrompt;
        std::thread([fullPrompt]() {
            s_asyncResponse = s_ai->prompt(fullPrompt);
            s_responseReady.store(true);
        }).detach();
    }
    ImGui::EndDisabled();

    ImGui::SameLine();
    ImGui::TextDisabled("%s", m_statusMsg.c_str());

    if (!m_lastAIResponse.empty()) {
        ImGui::Separator();
        ImGui::AlignTextToFramePadding();
        ImGui::Text("Response:"); ImGui::SameLine();
        if (ImGui::SmallButton("Copy")) {
            ImGui::SetClipboardText(m_lastAIResponse.c_str());
            m_statusMsg = "Response copied to clipboard.";
        }
        ImGui::Separator();
        std::string preview = m_lastAIResponse.substr(0, 500);
        ImGui::Selectable(preview.c_str(), false, 0, {424, 80});
        if (ImGui::BeginPopupContextItem("##resp_copy")) {
            if (ImGui::MenuItem("Copy Response", nullptr, false, true))
                ImGui::SetClipboardText(m_lastAIResponse.c_str());
            ImGui::EndPopup();
        }
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

void UI::drawSettingsPanel() {
    ImGui::SetNextWindowPos({400, 150}, ImGuiCond_Appearing);
    ImGui::SetNextWindowSize({420, 300}, ImGuiCond_Appearing);
    ImGui::Begin("MiniMax Settings", &m_showSettings);

    static char apiKeyBuf[256] = {};
    static char groupIdBuf[256] = {};
    static char modelBuf[64] = {};
    static char hostBuf[128] = {};
    static bool initialized = false;
    if (!initialized) {
        snprintf(apiKeyBuf,  sizeof(apiKeyBuf),  "%s", m_config.getMiniMaxApiKey().c_str());
        snprintf(groupIdBuf, sizeof(groupIdBuf), "%s", m_config.getMiniMaxGroupId().c_str());
        snprintf(modelBuf,   sizeof(modelBuf),   "%s", m_config.getMiniMaxModel().c_str());
        snprintf(hostBuf,    sizeof(hostBuf),    "%s", m_config.getMiniMaxApiHost().c_str());
        initialized = true;
    }

    ImGui::TextDisabled("API Host");
    ImGui::InputText("##host", hostBuf, sizeof(hostBuf));
    ImGui::TextDisabled("  https://api.minimax.io (global) | https://api.minimaxi.com (mainland CN)");

    ImGui::TextDisabled("API Key (minimax.chat account required)");
    ImGui::InputText("##apikey", apiKeyBuf, sizeof(apiKeyBuf),
        ImGuiInputTextFlags_Password);

    ImGui::TextDisabled("Group ID (optional, from MiniMax dashboard)");
    ImGui::InputText("##groupid", groupIdBuf, sizeof(groupIdBuf));

    ImGui::TextDisabled("Model");
    ImGui::InputText("##model", modelBuf, sizeof(modelBuf));
    ImGui::TextDisabled("  MiniMax-M2.7 | MiniMax-M2.5 | MiniMax-M2.1");

    if (ImGui::Button("Save")) {
        m_config.setMiniMaxApiHost(hostBuf);
        m_config.setMiniMaxApiKey(apiKeyBuf);
        m_config.setMiniMaxGroupId(groupIdBuf);
        m_config.setMiniMaxModel(modelBuf);
        if (m_config.save()) {
            s_ai->setApiHost(hostBuf);
            s_ai->setApiKey(apiKeyBuf);
            s_ai->setGroupId(groupIdBuf);
            s_ai->setModel(modelBuf);
            m_statusMsg = "Settings saved and applied.";
        } else {
            m_statusMsg = "Failed to save settings.";
        }
        initialized = false;
    }

    ImGui::SameLine();
    if (ImGui::Button("Close")) {
        m_showSettings = false;
        initialized = false;
    }

    ImGui::TextDisabled("Config: %s", m_config.configPath().c_str());
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
