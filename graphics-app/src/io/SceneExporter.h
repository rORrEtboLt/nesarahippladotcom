#pragma once
#include <string>
#include <vector>

class Scene;

class SceneExporter {
public:
    bool exportGLTF(const Scene& scene, const std::string& path);
    bool exportOBJ(const Scene& scene, const std::string& path);

private:
    struct ExportMesh;
    bool writeGLTF(const std::vector<ExportMesh>& meshes, const std::string& path);
};
