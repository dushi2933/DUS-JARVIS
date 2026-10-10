# 🛡️ J.A.R.V.I.S. Iron Man Gauntlet OS

![Stark Industries Security](https://img.shields.io/badge/Clearance-LEVEL%2010%20OMEGA%20PRIME-amber)
![Windows 10/11 Compatible](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011%20(.exe)-cyan)
![Creator](https://img.shields.io/badge/Creator-Lisara%20Kodikara%20%3Cjdushi%40gmail.com%3E-blue)

Stark Industries holographic J.A.R.V.I.S. operating system and Iron Man Gauntlet diagnostic, calibration, and multi-platform tactical command suite.

---

## 💻 WHERE TO FIND THE WINDOWS (.EXE) FILE

### ⚠️ Fixed: "The file is corrupted" Error Explained
If you previously downloaded an `.exe` file that said **"The file is corrupted"** or **"This app can't run on your PC"**, this was because a text launcher was saved with an `.exe` extension. Windows PE loader rejects text files with `.exe` extension.
**This is now 100% fixed with genuine compiled 64-bit Windows PE binaries (PE32+) and native batch launchers:**

1. **`JARVIS-IronMan-Gauntlet.exe`** (in this repository root and `/public/downloads/`) &mdash; A real compiled 64-bit Windows executable binary with valid `MZ` DOS & `PE` headers. Runs directly on Windows 10 & 11 without any error!
2. **`JARVIS-Launcher.bat`** (in this repository root) &mdash; Native Windows 1-Click batch launcher that runs with `cmd.exe` on all Windows versions with zero corruption risk!
3. **`jarvis_desktop_assistant.py`** &mdash; Complete Python 3.10+ Desktop Voice Assistant for VS Code.

---

### 1. Direct Download from the Live App (Fastest)
You do not need to compile anything. Download the verified `.exe` binary or `.bat` launcher directly:
1. Open the application URL: [https://ais-dev-gctvtzkyny3y2dejmhtmr3-258016456798.asia-southeast1.run.app](https://ais-dev-gctvtzkyny3y2dejmhtmr3-258016456798.asia-southeast1.run.app)
2. In the top navigation bar, click **"INSTALL / PUBLISH"**.
3. Enter your Master Creator Passcode: **`2017`**.
4. Click **"DOWNLOAD COMPILED (.EXE)"** (real x64 PE binary) or **"NATIVE LAUNCHER (.BAT)"** (1-click script).
5. Double-click the downloaded file on Windows 10/11 to launch!

---

### 2. In GitHub: Releases Section (Right Sidebar)
On GitHub, binary executables (`.exe`) are located in the **Releases** tab:
* **Releases URL**: [https://github.com/dushi2933/DUS-JARVIS/releases](https://github.com/dushi2933/DUS-JARVIS/releases)

#### Automatic GitHub Actions Release:
Our `.github/workflows/build-windows.yml` workflow automatically builds and releases the Windows executables whenever you push to GitHub!

#### How to manually attach the `.exe` to your GitHub Releases:
1. Go to: [https://github.com/dushi2933/DUS-JARVIS/releases/new](https://github.com/dushi2933/DUS-JARVIS/releases/new)
2. In **Tag version**, enter: `v1.0.0`
3. In **Release title**, enter: `J.A.R.V.I.S. Iron Man Gauntlet OS v1.0.0 (Windows .exe)`
4. Drag and drop `JARVIS-IronMan-Gauntlet.exe` and `JARVIS-Launcher.bat` into the **"Attach binaries by dropping them here"** box.
5. Click **"Publish release"**.
6. Anyone visiting your repository can now download the verified `.exe` directly from GitHub!

---

### 3. Run Directly on Windows with One Click
In this repository, you can also double-click:
* **`JARVIS-Launcher.bat`** &mdash; Automatically boots the Stark holographic interface in a native standalone desktop window on Windows 10 & 11.

---

## 🚀 Running Locally (Developer Mode)

```bash
# Clone your repository
git clone https://github.com/dushi2933/DUS-JARVIS.git
cd DUS-JARVIS

# Install dependencies
npm install

# Start the full-stack J.A.R.V.I.S. OS server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🔑 Security & Passcodes
* **Master Creator PIN**: `2017` (Lisara Kodikara / jdushi@gmail.com) &mdash; Authorizes installation, publishing, and system re-architecting.
* **Tony Stark Owner PIN**: `1234567` &mdash; Executive access to gauntlet diagnostics, repulsor calibration, and arc reactor controls.
