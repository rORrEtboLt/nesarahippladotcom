#pragma once
#include <string>
#include <vector>

struct DesignCommand {
    std::string action;    // add | remove | modify | describe
    std::string target;    // primitive type or object name
    std::string property;  // color | position | scale | metallic | roughness
    std::string value;
};

class MiniMaxClient {
public:
    MiniMaxClient(const std::string& apiKey = "", const std::string& groupId = "",
                  const std::string& apiHost = "");

    std::string prompt(const std::string& userMessage);
    std::vector<DesignCommand> parseCommands(const std::string& aiResponse);

    bool isConfigured() const { return !m_apiKey.empty(); }
    void setApiKey(const std::string& k)   { m_apiKey = k; }
    void setGroupId(const std::string& g)  { m_groupId = g; }
    void setModel(const std::string& m)   { m_model = m; }
    void setApiHost(const std::string& h) { m_apiHost = h.empty() ? "https://api.minimax.io" : h; }

private:
    std::string buildSystemPrompt() const;
    std::string parseResponse(const std::string& raw) const;

    std::string m_apiKey;
    std::string m_groupId;
    std::string m_apiHost = "https://api.minimax.io";
    std::string m_model = "MiniMax-M2.7";
};
