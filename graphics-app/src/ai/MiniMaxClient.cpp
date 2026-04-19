#include "MiniMaxClient.h"
#include <curl/curl.h>
#include <nlohmann/json.hpp>
#include <iostream>

using json = nlohmann::json;

static size_t curlWrite(char* ptr, size_t size, size_t nmemb, std::string* out) {
    out->append(ptr, size * nmemb);
    return size * nmemb;
}

MiniMaxClient::MiniMaxClient(const std::string& apiKey, const std::string& groupId)
    : m_apiKey(apiKey), m_groupId(groupId) {}

std::string MiniMaxClient::buildSystemPrompt() const {
    return R"(You are a 3D scene design assistant. Respond to the user's description with a JSON object containing:
- "commands": array of command objects, each with "action" (add/remove/modify), "target" (primitive: cube/sphere/plane/cylinder, or object name), "property" (color/position/metallic/roughness for modify), "value" (string)
- "description": a human-readable summary of what you did

Color values are "R,G,B" floats 0-1. Position values are "X,Y,Z" floats.

Example:
{"commands":[{"action":"add","target":"sphere","property":"","value":""},{"action":"modify","target":"Sphere_0","property":"color","value":"0.2,0.8,0.4"}],"description":"Added a green sphere."})";
}

std::string MiniMaxClient::prompt(const std::string& userMessage) {
    if (m_apiKey.empty()) return R"({"error":"MINIMAX_API_KEY not set"})";

    CURL* curl = curl_easy_init();
    if (!curl) return R"({"error":"curl init failed"})";

    json payload = {
        {"model", m_model},
        {"messages", json::array({
            {{"role", "system"}, {"content", buildSystemPrompt()}},
            {{"role", "user"},   {"content", userMessage}}
        })},
        {"temperature", 0.3},
        {"max_tokens", 512}
    };

    std::string body     = payload.dump();
    std::string response;

    struct curl_slist* headers = nullptr;
    headers = curl_slist_append(headers, ("Authorization: Bearer " + m_apiKey).c_str());
    headers = curl_slist_append(headers, "Content-Type: application/json");

    curl_easy_setopt(curl, CURLOPT_URL, "https://api.minimax.chat/v1/text/chatcompletion_v2");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, body.c_str());
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, curlWrite);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 30L);

    CURLcode res = curl_easy_perform(curl);
    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);

    if (res != CURLE_OK)
        return std::string(R"({"error":")") + curl_easy_strerror(res) + "\"}";

    try {
        auto root = json::parse(response);
        return root["choices"][0]["message"]["content"].get<std::string>();
    } catch (...) {
        return response;
    }
}

std::vector<DesignCommand> MiniMaxClient::parseCommands(const std::string& aiResponse) {
    std::vector<DesignCommand> result;
    try {
        auto root = json::parse(aiResponse);
        if (root.contains("commands")) {
            for (const auto& c : root["commands"]) {
                DesignCommand cmd;
                cmd.action   = c.value("action",   "");
                cmd.target   = c.value("target",   "");
                cmd.property = c.value("property", "");
                cmd.value    = c.value("value",    "");
                result.push_back(cmd);
            }
        }
    } catch (const std::exception& ex) {
        std::cerr << "parseCommands: " << ex.what() << "\n";
    }
    return result;
}
