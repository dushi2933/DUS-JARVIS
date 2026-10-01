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
  Globe,
  Smartphone
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';

export const PublishingCommandCenter: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeOsTab, setActiveOsTab] = useState<'windows' | 'macos' | 'linux' | 'android' | 'pwa'>('windows');

  const copyToClipboard = (text: string, sectionId: string) => {
    soundFx.playHudBeep('confirm');
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2500);
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
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-950/40 border border-amber-400/40 flex items-center justify-center glow-arc-gold">
            <FolderDown className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="font-tech text-sm font-bold tracking-wider text-amber-300">
              CROSS-PLATFORM PUBLISHING & PACKAGING CENTER
            </h3>
            <p className="text-[11px] text-gray-400 font-sans">
              Desktop & Mobile Publishing (Windows, macOS, Linux, Android) for Sirly Sarah
            </p>
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
