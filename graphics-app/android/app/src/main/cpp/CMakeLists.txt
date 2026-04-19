cmake_minimum_required(VERSION 3.20)
project(Design3D_Android)

set(CMAKE_CXX_STANDARD 17)

# SDL2 Android sources are provided via AAR; headers come from SDL2 Android project
# Point SDL2_ANDROID_DIR at your local SDL2 checkout
set(SDL2_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../../../../../../external/SDL2" CACHE PATH "SDL2 root")

file(GLOB_RECURSE APP_SOURCES
    "${CMAKE_CURRENT_SOURCE_DIR}/../../../../../src/*.cpp")

add_library(design3d SHARED ${APP_SOURCES})

target_include_directories(design3d PRIVATE
    ${SDL2_DIR}/include
    ${CMAKE_CURRENT_SOURCE_DIR}/../../../../../src)

find_library(log-lib log)
find_library(android-lib android)
find_library(EGL-lib EGL)
find_library(GLESv3-lib GLESv3)

target_link_libraries(design3d
    SDL2
    ${log-lib}
    ${android-lib}
    ${EGL-lib}
    ${GLESv3-lib})
