#pragma once
#include <string>

class Scene;
class Renderer;
class Config;

class UI {
public:
    UI(Scene& scene, Renderer& renderer, Config& config);
    void draw();

private:
    void drawMenuBar();
    void drawSceneHierarchy();
    void drawProperties();
    void drawAIPanel();
    void drawCameraPanel();
    void drawSettingsPanel();
    void applyAIResponse(const std::string& response);

    Scene&    m_scene;
    Renderer& m_renderer;
    Config&   m_config;

    char        m_promptBuf[1024] = {};
    std::string m_lastAIResponse;
    std::string m_statusMsg;
    bool        m_busy = false;
    bool        m_showSettings = false;
};
