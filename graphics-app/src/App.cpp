#include "App.h"
#include "renderer/Renderer.h"
#include "scene/Scene.h"
#include "ui/UI.h"

#include <glad/glad.h>
#include <SDL.h>
#include <imgui.h>
#include <imgui_impl_sdl2.h>
#include <imgui_impl_opengl3.h>

#include <iostream>
#include <chrono>

App::App(const std::string& title, int width, int height)
    : m_title(title), m_width(width), m_height(height) {}

App::~App() { shutdown(); }

bool App::init() {
    if (SDL_Init(SDL_INIT_VIDEO | SDL_INIT_EVENTS) != 0) {
        std::cerr << "SDL_Init: " << SDL_GetError() << "\n";
        return false;
    }

    SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 4);
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 1);
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_PROFILE_MASK, SDL_GL_CONTEXT_PROFILE_CORE);
    SDL_GL_SetAttribute(SDL_GL_DOUBLEBUFFER, 1);
    SDL_GL_SetAttribute(SDL_GL_DEPTH_SIZE, 24);
    SDL_GL_SetAttribute(SDL_GL_STENCIL_SIZE, 8);
    SDL_GL_SetAttribute(SDL_GL_MULTISAMPLEBUFFERS, 1);
    SDL_GL_SetAttribute(SDL_GL_MULTISAMPLESAMPLES, 4);

    m_window = SDL_CreateWindow(
        m_title.c_str(),
        SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED,
        m_width, m_height,
        SDL_WINDOW_OPENGL | SDL_WINDOW_RESIZABLE | SDL_WINDOW_ALLOW_HIGHDPI);
    if (!m_window) { std::cerr << "SDL_CreateWindow: " << SDL_GetError() << "\n"; return false; }

    m_glCtx = SDL_GL_CreateContext(m_window);
    if (!m_glCtx) { std::cerr << "SDL_GL_CreateContext: " << SDL_GetError() << "\n"; return false; }

    SDL_GL_MakeCurrent(m_window, m_glCtx);
    SDL_GL_SetSwapInterval(1);

    if (!gladLoadGLLoader((GLADloadproc)SDL_GL_GetProcAddress)) {
        std::cerr << "Failed to initialize GLAD\n";
        return false;
    }

    IMGUI_CHECKVERSION();
    ImGui::CreateContext();
    ImGuiIO& io = ImGui::GetIO();
    io.ConfigFlags |= ImGuiConfigFlags_NavEnableKeyboard;
    ImGui::StyleColorsDark();
    ImGui_ImplSDL2_InitForOpenGL(m_window, m_glCtx);
    ImGui_ImplOpenGL3_Init("#version 410");

    m_renderer = std::make_unique<Renderer>(m_width, m_height);
    if (!m_renderer->init()) return false;

    m_scene = std::make_unique<Scene>();
    m_scene->loadDefault();

    m_config.load();
    m_ui = std::make_unique<UI>(*m_scene, *m_renderer, m_config);
    m_running = true;
    return true;
}

void App::run() {
    auto prev = std::chrono::high_resolution_clock::now();
    while (m_running) {
        auto now = std::chrono::high_resolution_clock::now();
        float dt = std::chrono::duration<float>(now - prev).count();
        prev = now;
        processEvents();
        update(dt);
        render();
    }
}

void App::processEvents() {
    SDL_Event e;
    while (SDL_PollEvent(&e)) {
        ImGui_ImplSDL2_ProcessEvent(&e);
        if (e.type == SDL_QUIT) m_running = false;
        if (e.type == SDL_WINDOWEVENT && e.window.event == SDL_WINDOWEVENT_RESIZED) {
            m_width  = e.window.data1;
            m_height = e.window.data2;
            m_renderer->resize(m_width, m_height);
        }
        if (!ImGui::GetIO().WantCaptureMouse)
            m_scene->camera().processEvent(e);
    }
}

void App::update(float dt)  { m_scene->update(dt); }

void App::render() {
    ImGui_ImplOpenGL3_NewFrame();
    ImGui_ImplSDL2_NewFrame();
    ImGui::NewFrame();
    m_ui->draw();
    m_renderer->beginFrame();
    m_renderer->drawScene(*m_scene);
    m_renderer->endFrame();
    ImGui::Render();
    ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
    SDL_GL_SwapWindow(m_window);
}

void App::shutdown() {
    m_ui.reset();
    m_scene.reset();
    m_renderer.reset();
    ImGui_ImplOpenGL3_Shutdown();
    ImGui_ImplSDL2_Shutdown();
    ImGui::DestroyContext();
    if (m_glCtx) SDL_GL_DeleteContext(m_glCtx);
    if (m_window) SDL_DestroyWindow(m_window);
    SDL_Quit();
}
