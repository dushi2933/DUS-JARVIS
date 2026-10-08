import React, { useState } from 'react';
import { 
  Laptop, 
  Terminal, 
  ShieldAlert, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  FileCode, 
  Sparkles, 
  Layers, 
  Cpu, 
  Apple, 
  FolderDown,
  Scale,
  Lock,
  Unlock,
  KeyRound,
  Globe,
  Smartphone,
  Github,
  Package,
  CheckCircle2
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { useOwnerAuth } from '../context/OwnerAuthContext';
import { useToast } from '../context/ToastContext';

export const PublishingCommandCenter: React.FC = () => {
  const { isMasterPublishUnlocked, requireMasterPublishAccess, lockMasterPublish } = useOwnerAuth();
  const { addToast } = useToast();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeOsTab, setActiveOsTab] = useState<'windows' | 'macos' | 'linux' | 'android' | 'pwa'>('windows');

  const GITHUB_REPO_URL = 'https://github.com/dushi2933/DUS-JARVIS';
  const GITHUB_RELEASES_URL = 'https://github.com/dushi2933/DUS-JARVIS/releases';
  const EXE_SETUP_DOWNLOAD_URL = 'https://github.com/dushi2933/DUS-JARVIS/releases/latest/download/JARVIS-IronMan-Gauntlet-Setup.exe';
  const EXE_PORTABLE_DOWNLOAD_URL = 'https://github.com/dushi2933/DUS-JARVIS/releases/latest/download/JARVIS-IronMan-Gauntlet-Portable.exe';

  const copyToClipboard = (text: string, sectionId: string) => {
    requireMasterPublishAccess(() => {
      soundFx.playHudBeep('confirm');
      navigator.clipboard.writeText(text);
      setCopiedSection(sectionId);
      setTimeout(() => setCopiedSection(null), 2500);
      addToast({
        title: 'Copied to Clipboard',
        message: 'Snippet copied for deployment.',
        type: 'protocol',
      });
    });
  };

  const handleDownloadExe = (type: 'setup' | 'portable') => {
    requireMasterPublishAccess(() => {
      soundFx.playArcReactorPulse();
      const filename = type === 'setup' ? 'JARVIS-IronMan-Gauntlet-Setup.exe' : 'JARVIS-IronMan-Gauntlet-Portable.exe';
      
      // Trigger download from server route
      const link = document.createElement('a');
      link.href = '/api/download/jarvis-gauntlet-setup.exe';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast({
        title: 'Windows Executable (.exe) Downloading',
        message: `Beginning direct download of ${filename} (v1.0.0 for Windows 10/11)!`,
        type: 'status',
      });
    });
  };

  const handleDownloadSourceZip = () => {
    requireMasterPublishAccess(() => {
      soundFx.playArcReactorPulse();
      const link = document.createElement('a');
      link.href = '/api/download/project-source.zip';
      link.download = 'jarvis-ironman-gauntlet-source.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast({
        title: 'Project Source Code (.ZIP) Downloading',
        message: 'Beginning download of complete J.A.R.V.I.S. source code repository archive!',
        type: 'status',
      });
    });
  };

  const handleOpenGithub = () => {
    requireMasterPublishAccess(() => {
      soundFx.playHudBeep('confirm');
      window.open(GITHUB_REPO_URL, '_blank');
      addToast({
        title: 'GitHub Repository Opened',
        message: 'Redirecting to dushi2933/DUS-JARVIS repository on GitHub.',
        type: 'status',
      });
    });
  };

  const electronPackageJsonSnippet = `{
  "name": "jarvis-ironman-os",
  "version": "1.0.0",
  "description": "J.A.R.V.I.S. Iron Man Gauntlet OS for Tony Stark",
  "main": "electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "package:win": "electron-builder --win",
    "package:mac": "electron-builder --mac",
    "package:linux": "electron-builder --linux"
  },
  "build": {
    "appId": "com.stark.jarvis.gauntlet",
    "productName": "JARVIS Gauntlet OS",
    "mac": {
      "category": "public.app-category.utilities",
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "entitlements": "entitlements.mac.plist"
    },
    "win": {
      "target": ["nsis", "portable"]
    },
    "linux": {
      "target": ["AppImage", "deb"]
    }
  }
}`;

  const capacitorAndroidConfigSnippet = `{
  "appId": "com.stark.jarvis",
  "appName": "JARVIS Gauntlet OS",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https"
  },
  "android": {
    "allowMixedContent": true,
    "permissions": [
      "android.permission.RECORD_AUDIO",
      "android.permission.MODIFY_AUDIO_SETTINGS",
      "android.permission.INTERNET"
    ]
  }
}`;

  const legalDisclaimerSnippet = `LEGAL & TRADEMARK NOTICE:
This application ("J.A.R.V.I.S. Iron Man Gauntlet OS") is an interactive Stark Industries simulation software suite developed by Tony Stark.

"Iron Man", "J.A.R.V.I.S.", and related Marvel trademarks, character names, and lore are the intellectual property of Marvel Characters, Inc. and The Walt Disney Company. This project is not officially affiliated with, endorsed, sponsored, or produced by Marvel Studios or The Walt Disney Company.

This software is strictly non-commercial and provided free of charge for personal hobby and maker educational purposes.`;

  return (
    <div className="bg-gray-900/60 border border-cyan-500/20 rounded-xl p-4 flex flex-col backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3 mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-950/40 border border-amber-400/40 flex items-center justify-center glow-arc-gold">
            <FolderDown className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="font-tech text-sm font-bold tracking-wider text-amber-300">
              CROSS-PLATFORM PUBLISHING & PACKAGING CENTER
            </h3>
            <p className="text-[11px] text-gray-400 font-sans">
              Desktop & Mobile Publishing (Windows, macOS, Linux, Android)
            </p>
          </div>
        </div>

        {/* Master Creator 2017 Gate Badge */}
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border ${
            isMasterPublishUnlocked
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
              : 'bg-red-950/80 border-red-500 text-red-300'
          }`}>
            {isMasterPublishUnlocked ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-red-400" />}
            <span>{isMasterPublishUnlocked ? 'CREATOR AUTHORIZED' : 'LOCKED: CREATOR PASSCODE REQUIRED'}</span>
          </span>

          {!isMasterPublishUnlocked && (
            <button
              onClick={() => requireMasterPublishAccess(() => {})}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-gray-950 font-tech font-bold text-xs cursor-pointer shadow flex items-center gap-1"
            >
              <KeyRound className="w-3 h-3" />
              <span>UNLOCK</span>
            </button>
          )}

          {isMasterPublishUnlocked && (
            <button
              onClick={lockMasterPublish}
              className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white font-mono text-xs cursor-pointer"
            >
              RELOCK
            </button>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* FEATURED: GITHUB REPOSITORY & WINDOWS (.EXE) DIRECT DOWNLOAD HUB      */}
      {/* ===================================================================== */}
      <div className="relative z-10 mb-6 p-5 bg-gradient-to-r from-gray-950 via-slate-900 to-cyan-950/40 border-2 border-cyan-500/50 rounded-2xl shadow-[0_0_35px_rgba(6,182,212,0.25)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/30 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-900 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/50 px-2 py-0.5 rounded">
                  GITHUB REPO: dushi2933/DUS-JARVIS
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                  CREATOR: jdushi@gmail.com
                </span>
                <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-950 px-2 py-0.5 rounded border border-amber-500/40">
                  WINDOWS 10 & 11 READY
                </span>
              </div>
              <h4 className="font-tech text-base font-bold text-white tracking-wide mt-0.5">
                WINDOWS EXECUTABLE (.EXE) & GITHUB SOURCE HUB
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenGithub}
              className="px-3.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white border border-gray-600 font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Github className="w-3.5 h-3.5 text-cyan-400" />
              <span>VIEW GITHUB REPO</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </button>
            <a
              href="https://github.com/dushi2933/DUS-JARVIS/releases/new"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-300 font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span>DRAFT RELEASE v1.0.0</span>
            </a>
          </div>
        </div>

        {/* GitHub 404 Explanation & AI Studio Export */}
        <div className="p-3.5 bg-cyan-950/40 border border-cyan-500/40 rounded-xl text-xs font-mono-tech space-y-2 text-cyan-200">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Repository Connected: github.com/dushi2933/DUS-JARVIS</span>
          </div>
          <p className="text-[11px] text-gray-300 font-sans leading-relaxed">
            Your repository is active on GitHub! If you click a direct Release link and see GitHub's 404 page, it is because no release tag (e.g. <code>v1.0.0</code>) has been published yet. You can download the complete source code or Windows executable right now below:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-lg bg-gray-900/80 border border-cyan-500/30">
              <strong className="text-cyan-300 block mb-1">Option 1: Direct Source Download (.ZIP)</strong>
              <span>Click the green <strong className="text-emerald-300">"DOWNLOAD SOURCE (.ZIP)"</strong> button below to download all source files directly to your PC right now without needing GitHub!</span>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-900/80 border border-cyan-500/30">
              <strong className="text-amber-300 block mb-1">Option 2: Windows Setup Launcher (.EXE)</strong>
              <span>Click <strong className="text-cyan-300">"DOWNLOAD SETUP (.EXE)"</strong> to get the Windows 10/11 native launcher and run J.A.R.V.I.S. locally on your desktop.</span>
            </div>
          </div>
        </div>

        {/* Action Buttons for .EXE and .ZIP Download */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* 1. Full Project Source Code .ZIP */}
          <button
            onClick={handleDownloadSourceZip}
            className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-tech font-bold text-xs flex flex-col items-start gap-1 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all group border border-emerald-400/50"
          >
            <div className="flex items-center justify-between w-full">
              <span className="flex items-center gap-1.5 text-sm">
                <Download className="w-4 h-4 text-white group-hover:animate-bounce" />
                <span>DOWNLOAD SOURCE (.ZIP)</span>
              </span>
              <span className="text-[10px] font-mono bg-black/40 px-1.5 py-0.5 rounded text-emerald-200">
                ALL FILES
              </span>
            </div>
            <span className="text-[10px] font-sans font-normal text-emerald-100 text-left">
              Complete source code package. Unzip and run locally, or push directly to your GitHub!
            </span>
          </button>

          {/* 2. Main Windows Setup .exe */}
          <button
            onClick={() => handleDownloadExe('setup')}
            className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-tech font-bold text-xs flex flex-col items-start gap-1 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all group border border-cyan-400/50"
          >
            <div className="flex items-center justify-between w-full">
              <span className="flex items-center gap-1.5 text-sm">
                <Download className="w-4 h-4 text-white group-hover:animate-bounce" />
                <span>DOWNLOAD SETUP (.EXE)</span>
              </span>
              <span className="text-[10px] font-mono bg-black/40 px-1.5 py-0.5 rounded text-cyan-200">
                INSTALLER
              </span>
            </div>
            <span className="text-[10px] font-sans font-normal text-cyan-100 text-left">
              Full desktop installer for Windows 10 & 11. Adds Start Menu and Desktop shortcuts.
            </span>
          </button>

          {/* 3. Portable .exe */}
          <button
            onClick={() => handleDownloadExe('portable')}
            className="p-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-cyan-300 font-tech font-bold text-xs flex flex-col items-start gap-1 cursor-pointer transition-all border border-cyan-500/40 hover:border-cyan-400"
          >
            <div className="flex items-center justify-between w-full">
              <span className="flex items-center gap-1.5 text-sm text-cyan-200">
                <Package className="w-4 h-4 text-cyan-400" />
                <span>PORTABLE APP (.EXE)</span>
              </span>
              <span className="text-[10px] font-mono bg-gray-800 px-1.5 py-0.5 rounded text-amber-300">
                ZERO INSTALL
              </span>
            </div>
            <span className="text-[10px] font-sans font-normal text-gray-400 text-left">
              Single standalone executable. Run directly from USB stick or Downloads without installation.
            </span>
          </button>
        </div>

        {/* Quick Link URLs & Clone Command */}
        <div className="p-3 bg-gray-950/80 rounded-xl border border-gray-800 space-y-2 text-xs font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-gray-400 truncate">
              <span className="text-cyan-400 font-bold shrink-0">GITHUB REPO:</span>
              <span className="text-gray-300 truncate">{GITHUB_REPO_URL}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => copyToClipboard(GITHUB_REPO_URL, 'repoUrl')}
                className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px] flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'repoUrl' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'repoUrl' ? 'COPIED!' : 'COPY REPO LINK'}</span>
              </button>
              <button
                onClick={() => copyToClipboard(EXE_SETUP_DOWNLOAD_URL, 'exeUrl')}
                className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[11px] flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'exeUrl' ? <Check className="w-3 h-3 text-emerald-400" /> : <Download className="w-3 h-3" />}
                <span>{copiedSection === 'exeUrl' ? 'COPIED!' : 'COPY .EXE URL'}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-gray-850">
            <div className="flex items-center gap-2 text-gray-400 truncate">
              <span className="text-amber-400 font-bold shrink-0">GIT CLONE:</span>
              <code className="text-amber-200 truncate">git clone {GITHUB_REPO_URL}.git</code>
            </div>
            <button
              onClick={() => copyToClipboard(`git clone ${GITHUB_REPO_URL}.git`, 'cloneCmd')}
              className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px] flex items-center gap-1 cursor-pointer shrink-0"
            >
              {copiedSection === 'cloneCmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSection === 'cloneCmd' ? 'COPIED!' : 'COPY COMMAND'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Operating System Packaging Matrix Tabs */}
      <div className="relative z-10 mb-6">
        <div className="text-[11px] font-mono-tech uppercase text-gray-400 mb-2 flex items-center gap-1.5">
          <Laptop className="w-3.5 h-3.5 text-cyan-400" />
          <span>Select Target Operating System:</span>
        </div>

        <div className="flex flex-wrap gap-2 p-1 bg-gray-950/80 rounded-lg border border-gray-800 mb-3">
          {[
            { id: 'windows', label: 'Windows (10 / 11)', desc: '.exe & .msi' },
            { id: 'macos', label: 'macOS', desc: '.dmg & .app' },
            { id: 'linux', label: 'Linux', desc: '.AppImage & .deb' },
            { id: 'android', label: 'Android Mobile', desc: '.apk & .aab (Play Store)' },
            { id: 'pwa', label: 'PWA Web Desktop', desc: 'Instant Install' },
          ].map((tab) => {
            const isActive = activeOsTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playHudBeep('subtle');
                  setActiveOsTab(tab.id as any);
                }}
                className={`flex-1 min-w-[140px] py-2 px-3 rounded-md text-xs font-tech font-bold text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-950/60 text-cyan-200 border border-cyan-400/50 glow-arc-blue'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
                }`}
              >
                <div>{tab.label}</div>
                <div className="text-[10px] text-gray-500 font-mono-tech">{tab.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Tab Content: Windows */}
        {activeOsTab === 'windows' && (
          <div className="bg-gray-950/70 border border-cyan-500/20 rounded-xl p-4 text-xs font-sans space-y-3">
            <h4 className="font-tech text-sm font-bold text-cyan-300">
              Windows Packaging & Distribution (.exe / .msi)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono-tech text-[11px]">
              <div className="bg-gray-900/80 p-3 rounded-lg border border-gray-800">
                <span className="text-amber-400 font-bold block mb-1">1. Build Artifacts</span>
                <p className="text-gray-300">
                  Generate NSIS installer (<code>.exe</code>) with automated desktop shortcuts, start menu entries, and uninstaller, plus a portable zero-install executable.
                </p>
              </div>

              <div className="bg-gray-900/80 p-3 rounded-lg border border-gray-800">
                <span className="text-amber-400 font-bold block mb-1">2. Microsoft SmartScreen</span>
                <p className="text-gray-300">
                  Unsigned Windows apps prompt a blue warning banner. Use an EV or Standard Code Signing Certificate, or submit your signed installer to the Microsoft Partner Center.
                </p>
              </div>

              <div className="bg-gray-900/80 p-3 rounded-lg border border-gray-800">
                <span className="text-amber-400 font-bold block mb-1">3. Microsoft Store</span>
                <p className="text-gray-300">
                  Package as MSIX via MSIX Packaging Tool or Electron-Builder. Requires a Microsoft Developer account ($19 one-time fee).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: macOS */}
        {activeOsTab === 'macos' && (
          <div className="bg-gray-950/70 border border-cyan-500/20 rounded-xl p-4 text-xs font-sans space-y-3">
            <h4 className="font-tech text-sm font-bold text-cyan-300">
              macOS Packaging & Notarization (.dmg / .app)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono-tech text-[11px]">
              <div className="bg-gray-900/80 p-3 rounded-lg border border-gray-800">
                <span className="text-cyan-400 font-bold block mb-1">1. Universal Binary</span>
                <p className="text-gray-300">
                  Compile Universal binary containing both ARM64 (Apple Silicon M1/M2/M3/M4) and x86_64 slices for full Mac compatibility.
                </p>
              </div>

              <div className="bg-gray-900/80 p-3 rounded-lg border border-gray-800">
                <span className="text-cyan-400 font-bold block mb-1">2. Apple Notarization</span>
                <p className="text-gray-300">
                  macOS Gatekeeper blocks un-notarized software. Submit your <code>.dmg</code> via Apple's <code>notarytool</code> using an Apple Developer Program ID ($99/yr).
                </p>
              </div>

              <div className="bg-gray-900/80 p-3 rounded-lg border border-gray-800">
                <span className="text-cyan-400 font-bold block mb-1">3. Mac Entitlements</span>
                <p className="text-gray-300">
                  Enable Hardened Runtime and add <code>com.apple.security.device.audio-input</code> in plist for J.A.R.V.I.S. voice commands.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Linux */}
        {activeOsTab === 'linux' && (
          <div className="bg-gray-950/70 border border-cyan-500/20 rounded-xl p-4 text-xs font-sans space-y-3">
            <h4 className="font-tech text-sm font-bold text-cyan-300">
              Linux Packaging (.AppImage / .deb / Flatpak)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono-tech text-[11px]">
              <div className="bg-gray-900/80 p-3 rounded-lg border border-gray-800">
                <span className="text-emerald-400 font-bold block mb-1">1. AppImage</span>
                <p className="text-gray-300">
                  The recommended Linux format: a single portable executable file that runs out-of-the-box on Ubuntu, Debian, Fedora, Arch, and Mint.
                </p>
              </div>

              <div className="bg-gray-900/80 p-3 rounded-lg border border-gray-800">
                <span className="text-emerald-400 font-bold block mb-1">2. Debian (.deb)</span>
                <p className="text-gray-300">
                  Native package for Debian/Ubuntu with desktop menu integration and apt dependency resolution.
                </p>
              </div>

              <div className="bg-gray-900/80 p-3 rounded-lg border border-gray-800">
                <span className="text-emerald-400 font-bold block mb-1">3. Flathub & Snap</span>
                <p className="text-gray-300">
                  Publish to Flathub for centralized Linux app store distribution with automatic updates.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Android */}
        {activeOsTab === 'android' && (
          <div className="bg-gray-950/70 border border-cyan-500/20 rounded-xl p-4 text-xs font-sans space-y-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <h4 className="font-tech text-sm font-bold text-emerald-300">
                Android Mobile Publishing (.apk & .aab for Google Play)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono-tech text-[11px]">
              <div className="bg-gray-900/80 p-3 rounded-lg border border-gray-800">
                <span className="text-emerald-400 font-bold block mb-1">1. Capacitor / TWA Packaging</span>
                <p className="text-gray-300">
                  Wrap this React app with <strong>Capacitor</strong> (<code>npx cap add android</code>) or Google's <strong>Bubblewrap</strong> to produce native Android Studio Gradle projects.
                </p>
              </div>

              <div className="bg-gray-900/80 p-3 rounded-lg border border-gray-800">
                <span className="text-emerald-400 font-bold block mb-1">2. Direct APK Sideloading</span>
                <p className="text-gray-300">
                  Build release <code>app-release.apk</code> and share it directly! Sirly Sarah can install it on any Android phone or tablet simply by tapping the file.
                </p>
              </div>

              <div className="bg-gray-900/80 p-3 rounded-lg border border-gray-800">
                <span className="text-emerald-400 font-bold block mb-1">3. Google Play Store (.aab)</span>
                <p className="text-gray-300">
                  Build Android App Bundle (<code>.aab</code>) signed with your keystore. Submit to Google Play Console ($25 one-time registration).
                </p>
              </div>
            </div>

            {/* Android Manifest Permissions */}
            <div className="bg-gray-900/90 p-3 rounded-lg border border-gray-800 font-mono-tech text-[11px]">
              <span className="text-amber-400 font-bold block mb-1">
                Required AndroidManifest.xml Permissions:
              </span>
              <pre className="text-cyan-200">
{`<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
<uses-permission android:name="android.permission.INTERNET" />`}
              </pre>
            </div>
          </div>
        )}

        {/* Tab Content: PWA */}
        {activeOsTab === 'pwa' && (
          <div className="bg-gray-950/70 border border-cyan-500/20 rounded-xl p-4 text-xs font-sans space-y-3">
            <h4 className="font-tech text-sm font-bold text-cyan-300">
              Progressive Web App (Instant Zero-Install Option)
            </h4>
            <p className="text-gray-300 leading-relaxed">
              Your app already has PWA manifest and service worker installed. Any user on Windows, Mac, Linux, or Android visiting your link can click <strong>Install</strong> in Chrome/Edge or <strong>Add to Home Screen</strong> on Android to run it as a full native app without downloading heavy installer files.
            </p>
          </div>
        )}
      </div>

      {/* 2. Legal & Trademark Requirements: Marvel / Disney IP */}
      <div className="bg-gray-950/80 border border-amber-500/30 rounded-xl p-4 mb-6 relative z-10">
        <div className="flex items-center gap-2 mb-2 font-tech font-bold text-sm text-amber-300">
          <Scale className="w-4 h-4 text-amber-400" />
          <span>LEGAL & INTELLECTUAL PROPERTY (IP) GUIDELINES</span>
        </div>

        <div className="space-y-2 text-xs text-gray-300 leading-relaxed mb-3">
          <p>
            <strong>"Iron Man"</strong>, <strong>"J.A.R.V.I.S."</strong>, and Stark Industries are registered trademarks of Marvel Characters, Inc. and The Walt Disney Company. To safely publish your app without running into trademark or copyright takedowns:
          </p>
          <ul className="list-disc list-inside space-y-1 text-[11px] font-mono-tech text-gray-400">
            <li><strong className="text-gray-200">Non-Commercial Fan Homage:</strong> Keep the app 100% free with no ads, paywalls, or in-app purchases using Marvel names.</li>
            <li><strong className="text-gray-200">Clear Fan Disclaimer:</strong> Prominently display a legal notice in your app and repo stating that the project is an unofficial fan tribute.</li>
            <li><strong className="text-gray-200">App Store Naming:</strong> App stores (Google Play / Apple / Microsoft) reject apps titled strictly "Iron Man" unless you are Disney. For store releases, use names like <em>"Aegis Gauntlet OS - Stark-Inspired Companion"</em> or <em>"Gauntlet OS for Sirly Sarah"</em>.</li>
            <li><strong className="text-gray-200">Privacy Policy for Audio:</strong> App stores legally require a published Privacy Policy stating that microphone audio is used solely for real-time voice command processing and not sold to data brokers.</li>
          </ul>
        </div>

        {/* Copyable Legal Disclaimer */}
        <div className="bg-gray-900 p-2.5 rounded-lg border border-gray-800 flex items-center justify-between gap-3">
          <div className="text-[10px] font-mono-tech text-gray-400 truncate">
            Ready-to-use Fan Disclaimer & Trademark Notice for Sirly Sarah
          </div>
          <button
            onClick={() => copyToClipboard(legalDisclaimerSnippet, 'disclaimer')}
            className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-mono-tech flex items-center gap-1 cursor-pointer shrink-0"
          >
            {copiedSection === 'disclaimer' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'disclaimer' ? 'COPIED!' : 'COPY DISCLAIMER'}</span>
          </button>
        </div>
      </div>

      {/* 3. Ready-to-use Configurations (Electron & Android Capacitor) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10">
        {/* Electron package.json Generator */}
        <div className="bg-gray-950/80 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span className="font-tech text-xs font-bold text-gray-200 uppercase">
                Desktop Electron (Windows / Mac / Linux)
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(electronPackageJsonSnippet, 'pkgjson')}
              className="px-2.5 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono-tech flex items-center gap-1 cursor-pointer"
            >
              {copiedSection === 'pkgjson' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'pkgjson' ? 'COPIED!' : 'COPY'}</span>
            </button>
          </div>

          <pre className="p-3 bg-gray-900/90 rounded-lg border border-gray-800 text-[11px] font-mono-tech text-cyan-100 overflow-x-auto max-h-44">
            {electronPackageJsonSnippet}
          </pre>
        </div>

        {/* Capacitor Android Config Generator */}
        <div className="bg-gray-950/80 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span className="font-tech text-xs font-bold text-emerald-200 uppercase">
                Mobile Android (Capacitor Config)
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(capacitorAndroidConfigSnippet, 'capconfig')}
              className="px-2.5 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono-tech flex items-center gap-1 cursor-pointer"
            >
              {copiedSection === 'capconfig' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'capconfig' ? 'COPIED!' : 'COPY'}</span>
            </button>
          </div>

          <pre className="p-3 bg-gray-900/90 rounded-lg border border-gray-800 text-[11px] font-mono-tech text-emerald-100 overflow-x-auto max-h-44">
            {capacitorAndroidConfigSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
};
