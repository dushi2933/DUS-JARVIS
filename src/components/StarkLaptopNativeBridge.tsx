import React, { useState, useEffect } from 'react';
import { 
  Laptop, 
  BatteryCharging, 
  Cpu, 
  HardDrive, 
  FolderOpen, 
  Monitor, 
  Bell, 
  ShieldCheck, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  Wifi, 
  Radio, 
  Sparkles, 
  Activity, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  Key 
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useToast } from '../context/ToastContext';

interface LaptopHardwareSpecs {
  batteryLevel: number | null;
  isCharging: boolean | null;
  cpuCores: number;
  deviceMemoryGB: number | null;
  onlineStatus: boolean;
  screenWidth: number;
  screenHeight: number;
  colorDepth: number;
  userAgent: string;
}

export const StarkLaptopNativeBridge: React.FC = () => {
  const { addToast } = useToast();

  const [specs, setSpecs] = useState<LaptopHardwareSpecs>({
    batteryLevel: null,
    isCharging: null,
    cpuCores: typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8,
    deviceMemoryGB: typeof navigator !== 'undefined' ? (navigator as any).deviceMemory || 16 : 16,
    onlineStatus: typeof navigator !== 'undefined' ? navigator.onLine : true,
    screenWidth: typeof window !== 'undefined' ? window.screen.width : 1920,
    screenHeight: typeof window !== 'undefined' ? window.screen.height : 1080,
    colorDepth: typeof window !== 'undefined' ? window.screen.colorDepth : 24,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown OS',
  });

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFileSize, setSelectedFileSize] = useState<string | null>(null);
  const [fileContentSnippet, setFileContentSnippet] = useState<string | null>(null);

  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  const [copiedDaemon, setCopiedDaemon] = useState<boolean>(false);
  const [copiedElectron, setCopiedElectron] = useState<boolean>(false);
  const [selectedOs, setSelectedOs] = useState<'windows' | 'macos' | 'linux'>('windows');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyCommand = (cmd: string, id: string) => {
    soundFx.playHudBeep('confirm');
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
    addToast({
      title: 'Command Copied to Clipboard',
      message: `Paste into your ${selectedOs.toUpperCase()} terminal to execute.`,
      type: 'status',
    });
  };

  const directProtocols = [
    { name: 'VS Code', protocol: 'vscode://', icon: '💻', note: 'Opens Visual Studio Code' },
    { name: 'Spotify', protocol: 'spotify://', icon: '🎵', note: 'Opens Spotify Desktop' },
    { name: 'Windows Settings', protocol: 'ms-settings:', icon: '⚙️', note: 'Opens Windows Settings' },
    { name: 'Calculator (Win)', protocol: 'calculator:', icon: '🔢', note: 'Opens Windows Calculator' },
    { name: 'Mail Client', protocol: 'mailto:', icon: '✉️', note: 'Opens Default Email App' },
    { name: 'Slack', protocol: 'slack://', icon: '💬', note: 'Opens Slack Desktop' },
    { name: 'Discord', protocol: 'discord://', icon: '🎮', note: 'Opens Discord App' },
    { name: 'Steam', protocol: 'steam://', icon: '🕹️', note: 'Opens Steam Client' },
  ];

  const handleLaunchProtocol = (proto: string, name: string) => {
    soundFx.playHudBeep('mode');
    jarvisVoice.speak(`Requesting operating system launch protocol for ${name}, Mr. Stark.`);
    window.location.href = proto;
    addToast({
      title: `Launching ${name}...`,
      message: `Dispatched native URI protocol "${proto}" to your operating system.`,
      type: 'protocol',
    });
  };

  const appLaunchTerminalCommands = {
    windows: [
      { name: 'Google Chrome', cmd: 'start chrome', desc: 'Opens Chrome browser' },
      { name: 'VS Code', cmd: 'code .', desc: 'Opens VS Code in current directory' },
      { name: 'Windows Calculator', cmd: 'calc', desc: 'Opens native Windows Calculator' },
      { name: 'Notepad', cmd: 'notepad', desc: 'Opens Notepad text editor' },
      { name: 'File Explorer', cmd: 'explorer .', desc: 'Opens File Explorer at folder' },
      { name: 'Spotify', cmd: 'start spotify', desc: 'Opens Spotify music player' },
      { name: 'Task Manager', cmd: 'taskmgr', desc: 'Opens system resource monitor' },
      { name: 'Windows Terminal / PowerShell', cmd: 'start wt', desc: 'Opens modern Windows Terminal' },
      { name: 'System Settings', cmd: 'start ms-settings:', desc: 'Opens Windows Settings hub' },
    ],
    macos: [
      { name: 'Google Chrome', cmd: 'open -a "Google Chrome"', desc: 'Opens Google Chrome on Mac' },
      { name: 'VS Code', cmd: 'open -a "Visual Studio Code"', desc: 'Opens Visual Studio Code' },
      { name: 'Calculator', cmd: 'open -a Calculator', desc: 'Opens macOS Calculator' },
      { name: 'Notes', cmd: 'open -a Notes', desc: 'Opens Apple Notes app' },
      { name: 'Finder', cmd: 'open .', desc: 'Opens Finder in current folder' },
      { name: 'Spotify', cmd: 'open -a Spotify', desc: 'Opens Spotify desktop app' },
      { name: 'Activity Monitor', cmd: 'open -a "Activity Monitor"', desc: 'Opens Mac CPU/RAM monitor' },
      { name: 'Terminal', cmd: 'open -a Terminal', desc: 'Launches a new Terminal window' },
      { name: 'System Settings', cmd: 'open -a "System Settings"', desc: 'Opens macOS System Settings' },
    ],
    linux: [
      { name: 'Chrome / Chromium', cmd: 'google-chrome &', desc: 'Launches Chrome in background' },
      { name: 'VS Code', cmd: 'code . &', desc: 'Opens VS Code editor' },
      { name: 'Calculator', cmd: 'gnome-calculator &', desc: 'Opens GNOME Calculator' },
      { name: 'Text Editor', cmd: 'gedit &', desc: 'Opens default GNOME text editor' },
      { name: 'File Manager', cmd: 'nautilus . &', desc: 'Opens Nautilus / file manager' },
      { name: 'Spotify', cmd: 'spotify &', desc: 'Opens Spotify client' },
      { name: 'System Monitor', cmd: 'gnome-system-monitor &', desc: 'Opens Linux System Monitor' },
      { name: 'Terminal', cmd: 'x-terminal-emulator &', desc: 'Opens new terminal window' },
    ],
  };

  const jarvisPythonLauncherCode = `# ==============================================================================
# J.A.R.V.I.S. LOCAL TERMINAL APP LAUNCHER (Run on your laptop)
# Save as: jarvis_launcher.py
# Run in terminal: python jarvis_launcher.py
# ==============================================================================

import os, sys, subprocess, webbrowser

def speak(text):
    print(f"\\n🤖 [J.A.R.V.I.S.]: {text}")
    # Voice synthesis on Mac/Windows/Linux if available
    if sys.platform == 'darwin':
        subprocess.run(['say', text])
    elif sys.platform == 'win32':
        # Windows PowerShell speech
        ps_cmd = f'Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak("{text}")'
        subprocess.run(['powershell', '-Command', ps_cmd], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def open_app(command):
    cmd = command.lower().strip()
    
    if "chrome" in cmd or "browser" in cmd:
        speak("Opening Google Chrome, Mr. Stark.")
        if sys.platform == 'darwin': subprocess.Popen(['open', '-a', 'Google Chrome'])
        elif sys.platform == 'win32': subprocess.Popen(['cmd.exe', '/c', 'start chrome'])
        else: subprocess.Popen(['google-chrome'])

    elif "code" in cmd or "vscode" in cmd or "editor" in cmd:
        speak("Opening Visual Studio Code.")
        if sys.platform == 'darwin': subprocess.Popen(['open', '-a', 'Visual Studio Code'])
        elif sys.platform == 'win32': subprocess.Popen(['cmd.exe', '/c', 'start code'])
        else: subprocess.Popen(['code'])

    elif "calc" in cmd or "calculator" in cmd:
        speak("Opening Calculator for flight equations.")
        if sys.platform == 'darwin': subprocess.Popen(['open', '-a', 'Calculator'])
        elif sys.platform == 'win32': subprocess.Popen(['cmd.exe', '/c', 'calc'])
        else: subprocess.Popen(['gnome-calculator'])

    elif "spotify" in cmd or "music" in cmd:
        speak("Initializing soundtrack playback on Spotify.")
        if sys.platform == 'darwin': subprocess.Popen(['open', '-a', 'Spotify'])
        elif sys.platform == 'win32': subprocess.Popen(['cmd.exe', '/c', 'start spotify'])
        else: subprocess.Popen(['spotify'])

    elif "files" in cmd or "finder" in cmd or "explorer" in cmd:
        speak("Opening local file storage.")
        if sys.platform == 'darwin': subprocess.Popen(['open', '.'])
        elif sys.platform == 'win32': subprocess.Popen(['explorer', '.'])
        else: subprocess.Popen(['xdg-open', '.'])

    elif "terminal" in cmd or "cmd" in cmd:
        speak("Opening auxiliary terminal emulator.")
        if sys.platform == 'darwin': subprocess.Popen(['open', '-a', 'Terminal'])
        elif sys.platform == 'win32': subprocess.Popen(['cmd.exe', '/c', 'start cmd'])
        else: subprocess.Popen(['x-terminal-emulator'])

    elif "exit" in cmd or "quit" in cmd:
        speak("Powering down local Jarvis bridge. Farewell, Sir.")
        sys.exit(0)
    else:
        speak(f"Command not recognized for app launch: {command}")

print("="*60)
print("  J.A.R.V.I.S. NATIVE LAPTOP APP LAUNCHER")
print("  Commands: chrome | vscode | calc | spotify | files | terminal | exit")
print("="*60)
speak("J.A.R.V.I.S. terminal bridge active. What app shall I open, Mr. Stark?")

while True:
    try:
        user_input = input("\\n[STARK COMMAND]> ")
        if user_input.strip():
            open_app(user_input)
    except (KeyboardInterrupt, EOFError):
        print("\\nExiting Jarvis bridge.")
        break
`;

  // Load real laptop hardware metrics on mount
  useEffect(() => {
    // Battery Status API
    if (typeof navigator !== 'undefined' && (navigator as any).getBattery) {
      (navigator as any).getBattery().then((battery: any) => {
        setSpecs((prev) => ({
          ...prev,
          batteryLevel: Math.round(battery.level * 100),
          isCharging: battery.charging,
        }));

        battery.addEventListener('levelchange', () => {
          setSpecs((prev) => ({ ...prev, batteryLevel: Math.round(battery.level * 100) }));
        });
        battery.addEventListener('chargingchange', () => {
          setSpecs((prev) => ({ ...prev, isCharging: battery.charging }));
        });
      }).catch(() => {});
    }

    const handleOnline = () => setSpecs((prev) => ({ ...prev, onlineStatus: true }));
    const handleOffline = () => setSpecs((prev) => ({ ...prev, onlineStatus: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Request Native System Notifications Permission
  const handleRequestNotifications = async () => {
    soundFx.playHudBeep('subtle');
    if (typeof Notification === 'undefined') {
      addToast({
        title: 'Notifications Unsupported',
        message: 'Your browser environment does not support desktop notifications.',
        type: 'alert',
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        soundFx.playHudBeep('confirm');
        jarvisVoice.speak('Native desktop notifications authorized. Operating system uplink established, Mr. Stark.');
        new Notification('J.A.R.V.I.S. // Stark OS', {
          body: 'Native laptop telemetry bridge synchronized. Full desktop alerts enabled.',
          icon: '/favicon.ico',
        });
        addToast({
          title: 'Laptop Notifications Authorized',
          message: 'Jarvis can now deliver native OS system banner alerts directly to your desktop.',
          type: 'protocol',
        });
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Real Local File System Access API
  const handlePickLocalFile = async () => {
    soundFx.playHudBeep('mode');
    if ('showOpenFilePicker' in window) {
      try {
        const [fileHandle] = await (window as any).showOpenFilePicker();
        const file = await fileHandle.getFile();
        setSelectedFileName(file.name);
        setSelectedFileSize(`${(file.size / 1024).toFixed(1)} KB`);

        // Read first 500 characters
        const text = await file.text();
        setFileContentSnippet(text.slice(0, 400) + (text.length > 400 ? '...' : ''));

        soundFx.playHudBeep('confirm');
        jarvisVoice.speak(`Local file ${file.name} successfully linked from laptop drive. Telemetry verified.`);
        addToast({
          title: `File Linked: ${file.name}`,
          message: `Read permissions verified. Size: ${(file.size / 1024).toFixed(1)} KB`,
          type: 'status',
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn(err);
        }
      }
    } else {
      // Fallback file input
      const input = document.createElement('input');
      input.type = 'file';
      input.onchange = async (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          setSelectedFileName(file.name);
          setSelectedFileSize(`${(file.size / 1024).toFixed(1)} KB`);
          const reader = new FileReader();
          reader.onload = () => {
            const result = (reader.result as string) || '';
            setFileContentSnippet(result.slice(0, 400));
          };
          reader.readAsText(file);
          jarvisVoice.speak(`Local file ${file.name} linked from laptop.`);
        }
      };
      input.click();
    }
  };

  // Real Screen Share Surveillance Uplink
  const handleToggleScreenShare = async () => {
    if (isScreenSharing && screenStream) {
      screenStream.getTracks().forEach((t) => t.stop());
      setScreenStream(null);
      setIsScreenSharing(false);
      jarvisVoice.speak('Laptop screen surveillance feed terminated.');
      return;
    }

    try {
      soundFx.playHudBeep('confirm');
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      setScreenStream(stream);
      setIsScreenSharing(true);
      jarvisVoice.speak('Laptop screen surveillance linked to central HUD viewport, Mr. Stark.');
      addToast({
        title: 'Laptop Screen Feed Connected',
        message: 'Real-time desktop viewport stream established.',
        type: 'protocol',
      });

      stream.getVideoTracks()[0].onended = () => {
        setIsScreenSharing(false);
        setScreenStream(null);
      };
    } catch (err: any) {
      if (err.name !== 'NotAllowedError') {
        console.warn(err);
      }
    }
  };

  const localDaemonScript = `# ==============================================================================
# J.A.R.V.I.S. LOCAL LAPTOP DAEMON BRIDGE (Python / Node.js)
# Gives Jarvis full system command execution on your local laptop
# ==============================================================================

import os, sys, subprocess, webbrowser
from http.server import HTTPServer, BaseHTTPRequestHandler
import json

class StarkLocalDaemon(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = json.loads(self.rfile.read(content_length))
        action = post_data.get('action')
        target = post_data.get('target', '')

        print(f"[JARVIS DAEMON] Executing: {action} {target}")
        
        # Example: Open local apps, files, or terminals
        if action == 'open_app':
            if sys.platform == 'darwin': subprocess.Popen(['open', '-a', target])
            elif sys.platform == 'win32': subprocess.Popen(['start', target], shell=True)
            else: subprocess.Popen([target])
        elif action == 'open_terminal':
            if sys.platform == 'darwin': subprocess.Popen(['open', '-a', 'Terminal'])
            elif sys.platform == 'win32': subprocess.Popen(['cmd.exe'])
            else: subprocess.Popen(['x-terminal-emulator'])

        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"status": "acknowledged", "action": action}).encode())

server = HTTPServer(('127.0.0.1', 8888), StarkLocalDaemon)
print("[STARK UPLINK] Local laptop daemon listening on http://127.0.0.1:8888")
server.serve_forever()
`;

  return (
    <div className="bg-gray-950/90 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md relative min-h-[640px] flex flex-col p-4 gap-4 select-none">
      <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Laptop className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tech text-base font-bold text-cyan-200 tracking-wider">
                STARK LAPTOP OS UPLINK // NATIVE ACCESS BRIDGE
              </h2>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded border border-emerald-500/40 bg-emerald-950/80 text-emerald-300 uppercase font-bold animate-pulse">
                DEVICE LINK: ACTIVE
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans">
              Direct telemetry, local file system inspection, desktop screen stream, and native OS command daemon
            </p>
          </div>
        </div>

        {/* Real Battery & Hardware Pill */}
        <div className="flex items-center gap-2 text-xs font-mono-tech bg-gray-900 px-3 py-1.5 rounded-xl border border-gray-800 text-cyan-300">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>CORES: {specs.cpuCores} THREADS</span>
          <span className="text-gray-600">|</span>
          <BatteryCharging className="w-3.5 h-3.5 text-amber-400" />
          <span>BATTERY: {specs.batteryLevel !== null ? `${specs.batteryLevel}%` : 'AC PLUGGED'}</span>
        </div>
      </div>

      {/* 2-Column Command Hub */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
        
        {/* Left Column: Live Laptop Hardware & Native Web APIs (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          
          {/* Hardware Sensors Grid */}
          <div className="bg-gray-900/90 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col gap-2.5">
            <span className="font-tech text-xs font-bold text-cyan-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-800 pb-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>LIVE LAPTOP HARDWARE TELEMETRY</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono-tech">
              <div className="bg-gray-950 p-2.5 rounded-lg border border-gray-800">
                <span className="text-gray-500 text-[10px] block">CPU LOGICAL CORES</span>
                <span className="text-cyan-300 font-bold text-sm">{specs.cpuCores} Cores</span>
              </div>
              <div className="bg-gray-950 p-2.5 rounded-lg border border-gray-800">
                <span className="text-gray-500 text-[10px] block">SYSTEM MEMORY</span>
                <span className="text-emerald-300 font-bold text-sm">~{specs.deviceMemoryGB} GB RAM</span>
              </div>
              <div className="bg-gray-950 p-2.5 rounded-lg border border-gray-800">
                <span className="text-gray-500 text-[10px] block">DISPLAY RESOLUTION</span>
                <span className="text-amber-300 font-bold text-sm">{specs.screenWidth} × {specs.screenHeight}</span>
              </div>
              <div className="bg-gray-950 p-2.5 rounded-lg border border-gray-800">
                <span className="text-gray-500 text-[10px] block">BATTERY HEALTH</span>
                <span className="text-cyan-300 font-bold text-sm">
                  {specs.batteryLevel !== null ? `${specs.batteryLevel}% ${specs.isCharging ? '⚡ (Charging)' : ''}` : 'AC Powered'}
                </span>
              </div>
              <div className="bg-gray-950 p-2.5 rounded-lg border border-gray-800">
                <span className="text-gray-500 text-[10px] block">NETWORK UPLINK</span>
                <span className={`font-bold text-sm ${specs.onlineStatus ? 'text-emerald-400' : 'text-red-400'}`}>
                  {specs.onlineStatus ? 'ONLINE (10 Gbps)' : 'OFFLINE'}
                </span>
              </div>
              <div className="bg-gray-950 p-2.5 rounded-lg border border-gray-800">
                <span className="text-gray-500 text-[10px] block">COLOR DEPTH</span>
                <span className="text-purple-300 font-bold text-sm">{specs.colorDepth}-Bit HDR</span>
              </div>
            </div>
          </div>

          {/* Interactive Native Subsystem Access Buttons */}
          <div className="bg-gray-900/90 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col gap-3">
            <span className="font-tech text-xs font-bold text-cyan-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-800 pb-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span>NATIVE LAPTOP SUBSYSTEM INTEGRATION</span>
            </span>

            <div className="space-y-2">
              {/* Local File System Access */}
              <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                    <FolderOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-tech text-xs font-bold text-white tracking-wide">
                      LOCAL FILE SYSTEM ACCESS
                    </h4>
                    <p className="text-[11px] text-gray-400 font-sans">
                      Allow Jarvis to inspect and read local files or folders from your SSD
                    </p>
                  </div>
                </div>

                <button
                  onClick={handlePickLocalFile}
                  className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-gray-950 font-tech font-bold text-xs cursor-pointer shadow-md transition-all shrink-0"
                >
                  LINK FILE ↗
                </button>
              </div>

              {/* Selected File Dossier if any */}
              {selectedFileName && (
                <div className="bg-gray-950 border border-cyan-500/30 p-2.5 rounded-xl font-mono-tech text-xs">
                  <div className="flex items-center justify-between text-cyan-300 pb-1 border-b border-gray-800">
                    <span>FILE: {selectedFileName}</span>
                    <span className="text-gray-400">{selectedFileSize}</span>
                  </div>
                  {fileContentSnippet && (
                    <pre className="mt-1.5 text-[10px] text-gray-300 max-h-24 overflow-y-auto whitespace-pre-wrap font-mono">
                      {fileContentSnippet}
                    </pre>
                  )}
                </div>
              )}

              {/* Real Screen Share Video Stream */}
              <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-tech text-xs font-bold text-white tracking-wide">
                      LAPTOP SCREEN SURVEILLANCE
                    </h4>
                    <p className="text-[11px] text-gray-400 font-sans">
                      Stream your live laptop desktop directly into Jarvis's HUD
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleToggleScreenShare}
                  className={`w-full sm:w-auto px-3 py-1.5 rounded-lg font-tech font-bold text-xs cursor-pointer shadow-md transition-all shrink-0 ${
                    isScreenSharing
                      ? 'bg-red-600 hover:bg-red-500 text-white'
                      : 'bg-amber-600 hover:bg-amber-500 text-gray-950'
                  }`}
                >
                  {isScreenSharing ? 'STOP STREAM' : 'LINK SCREEN ↗'}
                </button>
              </div>

              {/* Live Screen Video Feed if active */}
              {isScreenSharing && screenStream && (
                <div className="rounded-xl overflow-hidden border border-amber-400 shadow-xl bg-black">
                  <video
                    autoPlay
                    playsInline
                    ref={(video) => {
                      if (video && screenStream) {
                        video.srcObject = screenStream;
                      }
                    }}
                    className="w-full h-44 object-contain"
                  />
                </div>
              )}

              {/* Native OS Desktop Notifications */}
              <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-tech text-xs font-bold text-white tracking-wide">
                      DESKTOP SYSTEM NOTIFICATIONS
                    </h4>
                    <p className="text-[11px] text-gray-400 font-sans">
                      Deliver Jarvis tactical alerts to Windows Action Center / macOS Banner
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleRequestNotifications}
                  disabled={notificationPermission === 'granted'}
                  className={`w-full sm:w-auto px-3 py-1.5 rounded-lg font-tech font-bold text-xs cursor-pointer shadow-md transition-all shrink-0 ${
                    notificationPermission === 'granted'
                      ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300 cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-gray-950'
                  }`}
                >
                  {notificationPermission === 'granted' ? 'AUTHORIZED ✓' : 'ENABLE ALERTS'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Direct App Launchers & Terminal Commands (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          
          {/* Section 1: 1-Click Direct Browser App Launchers (URI Protocols) */}
          <div className="bg-gray-900/90 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col gap-2.5 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <span className="font-tech text-xs font-bold text-cyan-200 uppercase tracking-wider flex items-center gap-1.5">
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                <span>DIRECT 1-CLICK PROTOCOL APP LAUNCHERS</span>
              </span>
              <span className="text-[10px] font-mono-tech text-emerald-400">NATIVE URI</span>
            </div>

            <p className="text-[11px] text-gray-300 font-sans">
              Click any app below to trigger your laptop's native application protocol directly from Jarvis:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {directProtocols.map((app) => (
                <button
                  key={app.name}
                  onClick={() => handleLaunchProtocol(app.protocol, app.name)}
                  className="bg-gray-950 hover:bg-cyan-950/60 border border-gray-800 hover:border-cyan-500/50 p-2.5 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-105 active:scale-95 group shadow-sm"
                  title={`${app.note} (${app.protocol})`}
                >
                  <span className="text-xl mb-1">{app.icon}</span>
                  <span className="font-tech text-xs font-bold text-gray-200 group-hover:text-cyan-300 truncate w-full">
                    {app.name}
                  </span>
                  <span className="text-[9px] font-mono-tech text-gray-500 truncate w-full mt-0.5">
                    {app.protocol}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Terminal Commands to Open Laptop Apps (Windows / Mac / Linux) */}
          <div className="bg-gray-900/90 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col gap-2.5 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span className="font-tech text-xs font-bold text-amber-200 uppercase tracking-wider">
                  TERMINAL CODES TO OPEN APPS
                </span>
              </div>

              {/* OS Tabs: Windows / macOS / Linux */}
              <div className="flex items-center gap-1 font-mono-tech text-[10px]">
                {(['windows', 'macos', 'linux'] as const).map((os) => (
                  <button
                    key={os}
                    onClick={() => {
                      soundFx.playHudBeep('subtle');
                      setSelectedOs(os);
                    }}
                    className={`px-2 py-0.5 rounded uppercase font-bold cursor-pointer transition-all ${
                      selectedOs === os
                        ? 'bg-amber-500 text-gray-950 shadow'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {os === 'windows' ? 'WIN' : os === 'macos' ? 'MAC' : 'LINUX'}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-gray-300 font-sans">
              Copy and paste these exact command lines into your {selectedOs.toUpperCase()} terminal to launch apps immediately:
            </p>

            {/* Commands Table / Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {appLaunchTerminalCommands[selectedOs].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-950 border border-gray-800 p-2 rounded-lg flex items-center justify-between gap-2 hover:border-gray-700 transition-all font-mono-tech"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] text-gray-200 font-bold truncate">
                      {item.name}
                    </div>
                    <code className="text-[10px] text-amber-300 bg-black/40 px-1 py-0.5 rounded truncate block mt-0.5">
                      {item.cmd}
                    </code>
                  </div>

                  <button
                    onClick={() => copyCommand(item.cmd, `${selectedOs}-${idx}`)}
                    className="p-1.5 rounded bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 hover:text-amber-300 cursor-pointer transition-all shrink-0"
                    title={`Copy "${item.cmd}"`}
                  >
                    {copiedCmd === `${selectedOs}-${idx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: J.A.R.V.I.S. Python Interactive Terminal Launcher Script */}
          <div className="bg-gray-900/90 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col gap-2 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <span className="font-tech text-xs font-bold text-cyan-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>COMPLETE PYTHON J.A.R.V.I.S. APP LAUNCHER SCRIPT</span>
              </span>

              <button
                onClick={() => {
                  soundFx.playHudBeep('confirm');
                  navigator.clipboard.writeText(jarvisPythonLauncherCode);
                  setCopiedDaemon(true);
                  setTimeout(() => setCopiedDaemon(false), 2000);
                  addToast({
                    title: 'Script Copied to Clipboard!',
                    message: 'Save as jarvis_launcher.py and run: python jarvis_launcher.py',
                    type: 'status',
                  });
                }}
                className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-gray-950 text-[10px] font-tech font-bold flex items-center gap-1.5 cursor-pointer shadow transition-all"
              >
                {copiedDaemon ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                <span>{copiedDaemon ? 'COPIED' : 'COPY SCRIPT'}</span>
              </button>
            </div>

            <p className="text-[11px] text-gray-300 font-sans leading-relaxed">
              Save this script as <code className="text-cyan-300 font-mono">jarvis_launcher.py</code> and run <code className="text-cyan-300 font-mono">python jarvis_launcher.py</code>. It provides spoken voice feedback and lets you type or speak <code className="text-amber-300">open chrome</code>, <code className="text-amber-300">open vscode</code>, <code className="text-amber-300">open calc</code>, <code className="text-amber-300">open spotify</code>, etc. directly on your laptop!
            </p>

            <div className="bg-gray-950 border border-gray-800 rounded-xl p-2.5 font-mono-tech text-[10px] text-cyan-300 overflow-x-auto max-h-36">
              <pre className="whitespace-pre">{jarvisPythonLauncherCode}</pre>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
