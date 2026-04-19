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
    explicit MiniMaxClient(const std::string& apiKey, const std::string& groupId = "");

    std::string              prompt(const std::string& userMessage);
    std::vector<DesignCommand> parseCommands(const std::string& aiResponse);

    bool isConfigured() const { return !m_apiKey.empty(); }

private:
    std::string buildSystemPrompt() const;

    std::string m_apiKey;
    std::string m_groupId;
    std::string m_model = "abab6.5s-chat";
};
