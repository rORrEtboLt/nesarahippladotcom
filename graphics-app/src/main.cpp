#include "App.h"
#include <iostream>

int main(int argc, char* argv[]) {
    App app("Design3D — AI-Powered 3D Designer", 1280, 720);
    if (!app.init()) {
        std::cerr << "Failed to initialize application\n";
        return 1;
    }
    app.run();
    return 0;
}
