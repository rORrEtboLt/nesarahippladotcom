#pragma once
#include <string>
#include <vector>
#include <memory>

class Mesh;

struct ImportedMesh {
    std::string name;
    std::shared_ptr<Mesh> mesh;
};

class SceneImporter {
public:
    std::vector<ImportedMesh> importFile(const std::string& path);

private:
    void processNode(class aiNode* node, class aiScene* scene);
    std::shared_ptr<Mesh> processMesh(class aiMesh* mesh, const class aiScene* scene);

    std::vector<ImportedMesh> m_meshes;
};
