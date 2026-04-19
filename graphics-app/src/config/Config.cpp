#include "Config.h"
#include <SDL_filesystem.h>
#include <nlohmann/json.hpp>
#include <fstream>
#include <cstdlib>

using json = nlohmann::json;

static std::string prefPath() {
    char* base = SDL_GetPrefPath("Design3D", "config");
    if (!base) return {};
    std::string path = std::string(base) + "config.json";
    SDL_free(base);
    return path;
}

Config::Config()
    : m_path(prefPath())
    , m_model("MiniMax-M2.7")
    , m_apiHost("https://api.minimax.io") {}

void Config::load() {
    if (m_path.empty()) return;
    std::ifstream f(m_path);
    if (!f) {
        // Fallback to env vars on first load
        if (const char* k = std::getenv("MINIMAX_API_KEY"))
            m_apiKey = k;
        if (const char* g = std::getenv("MINIMAX_GROUP_ID"))
            m_groupId = g;
        if (const char* h = std::getenv("MINIMAX_API_HOST"))
            m_apiHost = h;
        return;
    }

    try {
        json j = json::parse(f);
        auto& mm = j["miniMax"];
        m_apiKey  = mm.value("apiKey", "");
        m_groupId = mm.value("groupId", "");
        m_model   = mm.value("model", "MiniMax-M2.7");
        m_apiHost = mm.value("apiHost", "https://api.minimax.io");
    } catch (...) {
        if (const char* k = std::getenv("MINIMAX_API_KEY"))
            m_apiKey = k;
        if (const char* g = std::getenv("MINIMAX_GROUP_ID"))
            m_groupId = g;
    }
}

bool Config::save() const {
    if (m_path.empty()) return false;
    try {
        json j;
        j["miniMax"]["apiKey"]  = m_apiKey;
        j["miniMax"]["groupId"] = m_groupId;
        j["miniMax"]["model"]   = m_model;
        j["miniMax"]["apiHost"] = m_apiHost;
        std::ofstream f(m_path);
        f << j.dump(2);
        return true;
    } catch (...) {
        return false;
    }
}

std::string Config::getMiniMaxApiKey()  const { return m_apiKey; }
std::string Config::getMiniMaxGroupId()  const { return m_groupId; }
std::string Config::getMiniMaxModel()    const { return m_model; }
std::string Config::getMiniMaxApiHost()  const { return m_apiHost; }

void Config::setMiniMaxApiKey(const std::string& v)  { m_apiKey = v; }
void Config::setMiniMaxGroupId(const std::string& v) { m_groupId = v; }
void Config::setMiniMaxModel(const std::string& v)  { m_model = v; }
void Config::setMiniMaxApiHost(const std::string& v) { m_apiHost = v; }
