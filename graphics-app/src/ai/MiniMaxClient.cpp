#include "MiniMaxClient.h"
#include <curl/curl.h>
#include <nlohmann/json.hpp>
#include <iostream>

using json = nlohmann::json;

static size_t curlWrite(char* ptr, size_t size, size_t nmemb, std::string* out) {
    out->append(ptr, size * nmemb);
    return size * nmemb;
}

MiniMaxClient::MiniMaxClient(const std::string& apiKey, const std::string& groupId,
                               const std::string& apiHost)
    : m_apiKey(apiKey), m_groupId(groupId)
    , m_apiHost(apiHost.empty() ? "https://api.minimax.io" : apiHost)
    , m_model("MiniMax-M2.7") {}

std::string MiniMaxClient::buildSystemPrompt() const {
    return R"(You are a 3D scene design assistant. Respond to the user's description with a JSON object containing:
- "commands": array of command objects, each with "action" (add/remove/modify), "target" (primitive: cube/sphere/plane/cylinder, or object name), "property" (color/position/scale/metallic/roughness for modify), "value" (string)
- "description": a human-readable summary of what you did

Color values are "R,G,B" floats 0-1. Position values are "X,Y,Z" floats in world units. Scale values are uniform floats.

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
        {"max_tokens", 1024},
        {"stream", false}
    };

    std::string body     = payload.dump();
    std::string response;

    struct curl_slist* headers = nullptr;
    headers = curl_slist_append(headers, ("Authorization: Bearer " + m_apiKey).c_str());
    headers = curl_slist_append(headers, "Content-Type: application/json");
    if (!m_groupId.empty()) {
        headers = curl_slist_append(headers, ("GroupId: " + m_groupId).c_str());
    }

    std::string url = m_apiHost + "/v1/text/chatcompletion_v2";

    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, body.c_str());
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, curlWrite);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 60L);

    CURLcode res = curl_easy_perform(curl);
    long httpCode = 0;
    curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &httpCode);
    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);

    if (res != CURLE_OK)
        return std::string(R"({"error":"curl: ")") + curl_easy_strerror(res) + "\"}";

    if (httpCode != 200 && httpCode != 0) {
        std::string snippet = response.empty() ? "(empty)" : response.substr(0, std::min<size_t>(200, response.size()));
        return json{{"error", "HTTP " + std::to_string(httpCode) + ": " + snippet}}.dump();
    }

    if (response.empty())
        return json{{"error", "Empty response from server"}}.dump();

    return parseResponse(response);
}

std::string MiniMaxClient::parseResponse(const std::string& raw) const {
    try {
        auto root = json::parse(raw);

        // Check for API-level errors
        if (root.contains("base_resp")) {
            int code = root["base_resp"].value("status_code", 0);
            if (code != 0) {
                std::string msg = root["base_resp"].value("status_msg", "unknown error");
                return json{{"error", "API error " + std::to_string(code) + ": " + msg}}.dump();
            }
        }

        // Check standard error field
        if (root.contains("error")) {
            if (root["error"].is_object()) {
                std::string msg = root["error"].value("message", "unknown");
                return json{{"error", msg}}.dump();
            }
            return json{{"error", root["error"].dump()}}.dump();
        }

        // Extract content from choices
        if (root.contains("choices") && root["choices"].is_array() && !root["choices"].empty()) {
            auto& choice = root["choices"][0];
            if (choice.contains("message")) {
                std::string content = choice["message"].value("content", "");
                if (!content.empty()) {
                    // Try to parse the content as JSON for commands
                    try {
                        auto parsed = json::parse(content);
                        if (parsed.contains("commands") || parsed.contains("description")) {
                            return content;
                        }
                    } catch (...) {
                        // Not JSON, return as-is wrapped
                    }
                    return content;
                }
            }
            if (choice.contains("finish_reason")) {
                std::string reason = choice["finish_reason"];
                if (reason == "length") {
                    return json{{"error", "Response truncated: max_tokens exceeded"}}.dump();
                }
            }
        }

        // Return full response for debugging
        return root.value("error", raw);

    } catch (const json::parse_error& ex) {
        return json{{"error", "Failed to parse response: " + std::string(ex.what())}}.dump();
    } catch (const std::exception& ex) {
        return json{{"error", std::string(ex.what())}}.dump();
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
