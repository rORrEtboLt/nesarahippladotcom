#pragma once
#include <SDL.h>
#include <string>
#include <memory>

class Renderer;
class Scene;
class UI;

class App {
public:
    App(const std::string& title, int width, int height);
    ~App();

    bool init();
    void run();
    void shutdown();

    int width()  const { return m_width; }
    int height() const { return m_height; }

private:
    void processEvents();
    void update(float dt);
    void render();

    std::string   m_title;
    int           m_width, m_height;
    bool          m_running = false;
    SDL_Window*   m_window  = nullptr;
    SDL_GLContext m_glCtx   = nullptr;

    std::unique_ptr<Renderer> m_renderer;
    std::unique_ptr<Scene>    m_scene;
    std::unique_ptr<UI>       m_ui;
};
