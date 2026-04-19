#pragma once
#include <string>

class Config {
public:
    Config();

    void load();
    bool save() const;

    std::string getMiniMaxApiKey()  const;
    std::string getMiniMaxGroupId()  const;
    std::string getMiniMaxModel()    const;
    std::string getMiniMaxApiHost()  const;

    void setMiniMaxApiKey(const std::string& v);
    void setMiniMaxGroupId(const std::string& v);
    void setMiniMaxModel(const std::string& v);
    void setMiniMaxApiHost(const std::string& v);

    const std::string& configPath() const { return m_path; }

private:
    std::string m_path;
    std::string m_apiKey;
    std::string m_groupId;
    std::string m_model;
    std::string m_apiHost;
    bool        m_dirty = false;
};
