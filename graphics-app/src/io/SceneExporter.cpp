#include "SceneExporter.h"
#include "../scene/Scene.h"
#include "../renderer/Mesh.h"
#include <assimp/Exporter.hpp>
#include <assimp/scene.h>
#include <assimp/mesh.h>
#include <assimp/material.h>
#include <assimp/matrix4x4.h>
#include <assimpglm.h>
#include <glm/gtc/type_ptr.hpp>
#include <iostream>
#include <fstream>

using namespace Assimp;

struct SceneExporter::ExportMesh {
    std::string name;
    std::vector<Vertex> vertices;
    std::vector<uint32_t> indices;
};

static aiScene* sceneFromExportMeshes(const std::vector<SceneExporter::ExportMesh>& meshes) {
    aiScene* scene = new aiScene();
    scene->mNumMeshes = static_cast<unsigned int>(meshes.size());
    scene->mMeshes = new aiMesh*[meshes.size()];

    for (size_t i = 0; i < meshes.size(); ++i) {
        aiMesh* m = new aiMesh();
        m->mName = meshes[i].name.c_str();
        m->mNumVertices = static_cast<unsigned int>(meshes[i].vertices.size());
        m->mVertices = new aiVector3D[m->mNumVertices];
        m->mNormals = new aiVector3D[m->mNumVertices];
        m->mTextureCoords[0] = new aiVector3D[m->mNumVertices];
        m->mTangents = new aiVector3D[m->mNumVertices];

        for (size_t v = 0; v < meshes[i].vertices.size(); ++v) {
            const auto& vert = meshes[i].vertices[v];
            m->mVertices[v] = aiVector3D(vert.position.x, vert.position.y, vert.position.z);
            m->mNormals[v] = aiVector3D(vert.normal.x, vert.normal.y, vert.normal.z);
            m->mTextureCoords[0][v] = aiVector3D(vert.uv.x, vert.uv.y, 0.f);
            m->mTangents[v] = aiVector3D(vert.tangent.x, vert.tangent.y, vert.tangent.z);
        }

        m->mNumFaces = static_cast<unsigned int>(meshes[i].indices.size() / 3);
        m->mFaces = new aiFace[m->mNumFaces];
        for (unsigned int f = 0; f < m->mNumFaces; ++f) {
            m->mFaces[f].mNumIndices = 3;
            m->mFaces[f].mIndices = new unsigned int[3]{
                meshes[i].indices[f * 3 + 0],
                meshes[i].indices[f * 3 + 1],
                meshes[i].indices[f * 3 + 2]
            };
        }

        scene->mMeshes[i] = m;
    }

    scene->mRootNode = new aiNode();
    scene->mRootNode->mNumMeshes = scene->mNumMeshes;
    scene->mRootNode->mMeshes = new unsigned int[scene->mNumMeshes];
    for (unsigned int i = 0; i < scene->mNumMeshes; ++i)
        scene->mRootNode->mMeshes[i] = i;

    return scene;
}

bool SceneExporter::exportGLTF(const Scene& scene, const std::string& path) {
    std::vector<ExportMesh> meshes;
    for (const auto& obj : scene.objects()) {
        ExportMesh em;
        em.name = obj.name;
        if (auto vbo = obj.mesh->lockedVertices()) {
            em.vertices.assign(vbo.begin(), vbo.end());
        }
        if (auto ebo = obj.mesh->lockedIndices()) {
            em.indices.assign(ebo.begin(), ebo.end());
        }
        meshes.push_back(std::move(em));
    }

    aiScene* aiScenePtr = sceneFromExportMeshes(meshes);

    Exporter exporter;
    aiReturn ret = exporter.Export(aiScenePtr, "gltf2", path);
    delete aiScenePtr;

    if (ret != aiReturn_SUCCESS) {
        std::cerr << "Assimp export error: " << exporter.GetErrorString() << "\n";
        return false;
    }
    return true;
}

bool SceneExporter::exportOBJ(const Scene& scene, const std::string& path) {
    std::ofstream f(path);
    if (!f) return false;

    f << "# Exported by Design3D\n";
    f << "# " << scene.objects().size() << " objects\n\n";

    unsigned int globalVertOffset = 1;

    for (const auto& obj : scene.objects()) {
        f << "o " << obj.name << "\n";

        std::vector<Vertex> verts;
        std::vector<uint32_t> indices;
        if (auto vbo = obj.mesh->lockedVertices()) {
            verts.assign(vbo.begin(), vbo.end());
        }
        if (auto ebo = obj.mesh->lockedIndices()) {
            indices.assign(ebo.begin(), ebo.end());
        }

        for (const auto& v : verts) {
            f << "v " << v.position.x << " " << v.position.y << " " << v.position.z << "\n";
        }
        for (const auto& v : verts) {
            f << "vn " << v.normal.x << " " << v.normal.y << " " << v.normal.z << "\n";
        }
        for (const auto& v : verts) {
            f << "vt " << v.uv.x << " " << v.uv.y << "\n";
        }

        for (size_t i = 0; i < indices.size(); i += 3) {
            unsigned int a = indices[i] + globalVertOffset;
            unsigned int b = indices[i + 1] + globalVertOffset;
            unsigned int c = indices[i + 2] + globalVertOffset;
            f << "f " << a << "/" << a << "/" << a << " "
                     << b << "/" << b << "/" << b << " "
                     << c << "/" << c << "/" << c << "\n";
        }

        globalVertOffset += static_cast<unsigned int>(verts.size());
        f << "\n";
    }

    return true;
}
