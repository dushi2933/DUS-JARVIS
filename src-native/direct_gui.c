#define UNICODE
#define _UNICODE
#include <windows.h>
#include <shellapi.h>

#define APP_URL L"https://ais-dev-gctvtzkyny3y2dejmhtmr3-258016456798.asia-southeast1.run.app"

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    wchar_t edgeArgs[1024];
    wchar_t chromeArgs[1024];
    wsprintfW(edgeArgs, L"--app=\"%s\"", APP_URL);
    wsprintfW(chromeArgs, L"--app=\"%s\"", APP_URL);

    // Try Microsoft Edge in standalone app window
    HINSTANCE hRes = ShellExecuteW(NULL, L"open", L"msedge.exe", edgeArgs, NULL, SW_SHOWNORMAL);
    if ((INT_PTR)hRes > 32) return 0;

    // Try Google Chrome in standalone app window
    hRes = ShellExecuteW(NULL, L"open", L"chrome.exe", chromeArgs, NULL, SW_SHOWNORMAL);
    if ((INT_PTR)hRes > 32) return 0;

    // Fallback to default browser
    ShellExecuteW(NULL, L"open", APP_URL, NULL, NULL, SW_SHOWNORMAL);
    return 0;
}
