#define UNICODE
#define _UNICODE
#include <windows.h>
#include <shellapi.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define APP_URL L"https://ais-dev-gctvtzkyny3y2dejmhtmr3-258016456798.asia-southeast1.run.app"
#define REPO_URL L"https://github.com/dushi2933/DUS-JARVIS"

void set_cyan_color() {
    HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
    if (hConsole != INVALID_HANDLE_VALUE) {
        SetConsoleTextAttribute(hConsole, FOREGROUND_GREEN | FOREGROUND_BLUE | FOREGROUND_INTENSITY);
    }
}

void set_gold_color() {
    HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
    if (hConsole != INVALID_HANDLE_VALUE) {
        SetConsoleTextAttribute(hConsole, FOREGROUND_RED | FOREGROUND_GREEN | FOREGROUND_INTENSITY);
    }
}

void reset_color() {
    HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
    if (hConsole != INVALID_HANDLE_VALUE) {
        SetConsoleTextAttribute(hConsole, FOREGROUND_RED | FOREGROUND_GREEN | FOREGROUND_BLUE);
    }
}

int launch_native_app_window() {
    wchar_t edgeArgs[1024];
    wchar_t chromeArgs[1024];
    wsprintfW(edgeArgs, L"--app=\"%s\"", APP_URL);
    wsprintfW(chromeArgs, L"--app=\"%s\"", APP_URL);

    // Try Microsoft Edge in standalone app window
    HINSTANCE hRes = ShellExecuteW(NULL, L"open", L"msedge.exe", edgeArgs, NULL, SW_SHOWNORMAL);
    if ((INT_PTR)hRes > 32) return 1;

    // Try Google Chrome in standalone app window
    hRes = ShellExecuteW(NULL, L"open", L"chrome.exe", chromeArgs, NULL, SW_SHOWNORMAL);
    if ((INT_PTR)hRes > 32) return 1;

    // Fallback to default browser
    hRes = ShellExecuteW(NULL, L"open", APP_URL, NULL, NULL, SW_SHOWNORMAL);
    return ((INT_PTR)hRes > 32) ? 1 : 0;
}

int wmain(int argc, wchar_t* argv[]) {
    SetConsoleTitleW(L"STARK INDUSTRIES - J.A.R.V.I.S. GAUNTLET OS [ALPHA-1 AUTHORIZED]");

    set_cyan_color();
    wprintf(L"\n");
    wprintf(L"  =========================================================================\n");
    wprintf(L"            S T A R K   I N D U S T R I E S   ·   M A R K  L X X X V       \n");
    wprintf(L"                 J . A . R . V . I . S .   G A U N T L E T   O S           \n");
    wprintf(L"  =========================================================================\n\n");

    set_gold_color();
    wprintf(L"  [MASTER CLEARANCE] ALPHA-1 OMEGA PRIME CREATOR IDENTIFIED:\n");
    wprintf(L"  - Primary Engineer : Lisara Kodikara (Dushi)\n");
    wprintf(L"  - Clearance Account: jdushi@gmail.com\n");
    wprintf(L"  - Repository       : https://github.com/dushi2933/DUS-JARVIS\n\n");

    set_cyan_color();
    wprintf(L"  [SYSTEM INITIALIZATION]\n");
    wprintf(L"  [1/3] Calibrating Arc Reactor Matrix (Cold Fusion)...\n");
    wprintf(L"  [2/3] Linking Neural Voice Pipeline (Mode 1 & Mode 2 Full Screen)...\n");
    wprintf(L"  [3/3] Deploying High-Tech Standalone Holographic App Window...\n\n");

    int launched = launch_native_app_window();
    if (launched) {
        set_gold_color();
        wprintf(L"  [ONLINE] J.A.R.V.I.S. Gauntlet OS successfully launched on your desktop!\n");
        wprintf(L"  Enjoy your assistant, Mr. Stark.\n\n");
    } else {
        wprintf(L"  [NOTICE] Opening via default system web browser link...\n");
        ShellExecuteW(NULL, L"open", APP_URL, NULL, NULL, SW_SHOWNORMAL);
    }

    set_cyan_color();
    wprintf(L"  -------------------------------------------------------------------------\n");
    wprintf(L"  COMMAND OPTIONS:\n");
    wprintf(L"  [1] Re-launch J.A.R.V.I.S. Gauntlet OS (Standalone Window)\n");
    wprintf(L"  [2] Open GitHub Repository (dushi2933/DUS-JARVIS)\n");
    wprintf(L"  [3] Exit Launcher\n");
    wprintf(L"  -------------------------------------------------------------------------\n");

    reset_color();
    wprintf(L"  Select [1-3] or press Enter to keep running in background: ");

    char input[64];
    if (fgets(input, sizeof(input), stdin)) {
        if (input[0] == '2') {
            ShellExecuteW(NULL, L"open", REPO_URL, NULL, NULL, SW_SHOWNORMAL);
        } else if (input[0] == '1') {
            launch_native_app_window();
        }
    }

    return 0;
}
