#include "SceneImporter.h"
#include "../renderer/Mesh.h"
#include <assimp/Importer.hpp>
#include <assimp/scene.h>
#include <assimp/postprocess.h>
#include <assimp/matrix4x4.h>
#include <glm/gtc/type_ptr.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <iostream>

using namespace Assimp;

static glm::mat4 aiMat4ToGLM(const aiMatrix4x4& m) {
    return glm::mat4(
        m.a1, m.b1, m.c1, m.d1,
        m.a2, m.b2, m.c2, m.d2,
        m.a3, m.b3, m.c3, m.d3,
        m.a4, m.b4, m.c4, m.d4
    );
}

std::vector<ImportedMesh> SceneImporter::importFile(const std::string& path) {
    m_meshes.clear();

    Importer importer;
    unsigned int flags = aiProcess_Triangulate
                       | aiProcess_GenNormals
                       | aiProcess_CalcTangentSpace
                       | aiProcess_JoinIdenticalVertices
                       | aiProcess_SortByPType;

    const aiScene* scene = importer.ReadFile(path, flags);
    if (!scene) {
        std::cerr << "Assimp: " << importer.GetErrorString() << "\n";
        return {};
    }

    if (scene->mRootNode)
        processNode(scene->mRootNode, scene);

    return std::move(m_meshes);
}

void SceneImporter::processNode(aiNode* node, const aiScene* scene) {
    for (unsigned int i = 0; i < node->mNumMeshes; ++i) {
        unsigned int meshIdx = node->mMeshes[i];
        aiMesh* aiMesh = scene->mMeshes[meshIdx];
        auto mesh = processMesh(aiMesh, scene);
        if (mesh) {
            ImportedMesh im;
            im.name = aiMesh->mName.C_Str();
            if (im.name.empty()) im.name = "Imported_" + std::to_string(m_meshes.size());
            im.mesh = mesh;
            m_meshes.push_back(std::move(im));
        }
    }

    for (unsigned int i = 0; i < node->mNumChildren; ++i)
        processNode(node->mChildren[i], scene);
}

std::shared_ptr<Mesh> SceneImporter::processMesh(aiMesh* aiMesh, const aiScene* /*scene*/) {
    if (!aiMesh->HasPositions()) return nullptr;

    std::vector<Vertex> verts;
    verts.reserve(aiMesh->mNumVertices);

    for (unsigned int i = 0; i < aiMesh->mNumVertices; ++i) {
        Vertex v;
        v.position = {aiMesh->mVertices[i].x, aiMesh->mVertices[i].y, aiMesh->mVertices[i].z};

        if (aiMesh->HasNormals())
            v.normal = {aiMesh->mNormals[i].x, aiMesh->mNormals[i].y, aiMesh->mNormals[i].z};
        else
            v.normal = {0.f, 1.f, 0.f};

        if (aiMesh->HasTangentsAndBitangents())
            v.tangent = {aiMesh->mTangents[i].x, aiMesh->mTangents[i].y, aiMesh->mTangents[i].z};
        else
            v.tangent = {1.f, 0.f, 0.f};

        if (aiMesh->HasTextureCoords(0))
            v.uv = {aiMesh->mTextureCoords[0][i].x, aiMesh->mTextureCoords[0][i].y};
        else
            v.uv = {0.f, 0.f};

        verts.push_back(v);
    }

    std::vector<uint32_t> indices;
    for (unsigned int f = 0; f < aiMesh->mNumFaces; ++f) {
        const aiFace& face = aiMesh->mFaces[f];
        for (unsigned int j = 0; j < face.mNumIndices; ++j)
            indices.push_back(face.mIndices[j]);
    }

    auto mesh = std::make_shared<Mesh>();
    mesh->upload(verts, indices);
    return mesh;
}
