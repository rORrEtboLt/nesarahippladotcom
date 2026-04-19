#pragma once
#include <string>

class Scene;
class Renderer;

class UI {
public:
    UI(Scene& scene, Renderer& renderer);
    void draw();

private:
    void drawMenuBar();
    void drawSceneHierarchy();
    void drawProperties();
    void drawAIPanel();
    void drawCameraPanel();
    void applyAIResponse(const std::string& response);

    Scene&    m_scene;
    Renderer& m_renderer;

    char        m_promptBuf[1024] = {};
    std::string m_lastAIResponse;
    std::string m_statusMsg;
    bool        m_busy = false;
};
