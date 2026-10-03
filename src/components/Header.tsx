import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Volume2, 
  VolumeX, 
  Mic, 
  Radio, 
  Maximize2, 
  Minimize2, 
  Download, 
  RotateCcw,
  Sparkles,
  Cpu,
  Lock,
  Unlock,
  Fingerprint,
  Palette
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useTheme, THEME_CONFIGS, StarkTheme } from '../context/ThemeContext';

interface HeaderProps {
  onReset: () => void;
  onOpenPublishGuide: () => void;
  activeProtocol: string;
  isJarvisThinking: boolean;
  isBiometricAuthenticated?: boolean;
  onOpenBiometrics?: () => void;
  isWakeWordEnabled?: boolean;
  onToggleWakeWord?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onOpenPublishGuide,
  activeProtocol,
  isJarvisThinking,
  isBiometricAuthenticated = true,
  onOpenBiometrics,
  isWakeWordEnabled = false,
  onToggleWakeWord,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const { currentTheme, themeConfig, setTheme } = useTheme();
  const [canInstallPwa, setCanInstallPwa] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Listen for PWA beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPwa(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Track fullscreen change
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFx.setMuted(next);
    if (!next) {
      soundFx.playHudBeep('confirm');
    }
  };

  const toggleFullscreen = () => {
    soundFx.playHudBeep('subtle');
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleInstallClick = () => {
    soundFx.playHudBeep('confirm');
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setCanInstallPwa(false);
        }
        setDeferredPrompt(null);
      });
    } else {
      // Open the comprehensive Publish / Laptop App guide
      onOpenPublishGuide();
    }
  };

  return (
    <header className="border-b border-cyan-500/20 bg-gray-950/80 backdrop-blur-md sticky top-0 z-40 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Stark Brand & J.A.R.V.I.S. title */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-950/40 border border-cyan-400/40 glow-arc-blue">
            <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-gray-950 animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-tech tracking-widest text-xs font-bold text-cyan-400 uppercase">
                STARK INDUSTRIES
              </span>
              <span className="text-gray-600 text-xs">/</span>
              <span className="font-tech text-xs tracking-wider text-amber-400 font-semibold">
                J.A.R.V.I.S. OS v4.2
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-bold tracking-wider text-cyan-100 font-tech flex items-center gap-2">
              IRON MAN GAUNTLET SUITE
              {activeProtocol !== 'IDLE' && (
                <span className="text-xs px-2 py-0.5 rounded font-mono-tech uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {activeProtocol} PROTOCOL
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Center: Pilot Clearance Badge & Biometrics for Tony Stark */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-xs">
          <div className={`w-2 h-2 rounded-full ${
            isBiometricAuthenticated ? 'bg-emerald-400 animate-pulse' : 'bg-red-500 animate-ping'
          }`} />
          <div className="flex items-center gap-2 font-mono-tech">
            <span className="text-gray-400">PILOT:</span>
            <span className="text-cyan-300 font-semibold tracking-wide">
              TONY STARK
            </span>
            <span className="text-gray-600">|</span>
            <span className={isBiometricAuthenticated ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>
              {isBiometricAuthenticated ? 'ALPHA-1 AUTHORIZED' : 'SECURITY LOCKED'}
            </span>
          </div>

          {onOpenBiometrics && (
            <button
              onClick={() => {
                soundFx.playHudBeep('mode');
                onOpenBiometrics();
              }}
              title="Open Biometric Authentication Terminal"
              className={`px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold flex items-center gap-1 border cursor-pointer transition-all ${
                isBiometricAuthenticated
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60'
                  : 'bg-red-950/80 border-red-500 text-red-300 hover:bg-red-900 glow-arc-red animate-pulse'
              }`}
            >
              <Fingerprint className="w-3 h-3" />
              <span>{isBiometricAuthenticated ? 'VERIFIED' : 'SCAN'}</span>
            </button>
          )}
          {onToggleWakeWord && (
            <button
              onClick={() => {
                soundFx.playHudBeep('mode');
                onToggleWakeWord();
              }}
              title={isWakeWordEnabled ? 'Wake Word "Jarvis" Active' : 'Enable Wake Word "Jarvis"'}
              className={`px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold flex items-center gap-1 border cursor-pointer transition-all ${
                isWakeWordEnabled
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 glow-arc-blue animate-pulse'
                  : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-gray-200'
              }`}
            >
              <Mic className="w-3 h-3 text-cyan-400" />
              <span>{isWakeWordEnabled ? 'SAY "JARVIS"' : 'HOTWORD: OFF'}</span>
            </button>
          )}
        </div>

        {/* Right: Quick Tactical Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            className={`p-2 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${
              isMuted
                ? 'border-gray-800 bg-gray-900 text-gray-500'
                : 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:border-cyan-400'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline font-mono-tech">
              {isMuted ? 'MUTED' : 'AUDIO FX'}
            </span>
          </button>

          {/* Theme Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                soundFx.playHudBeep('subtle');
                setIsThemeMenuOpen(!isThemeMenuOpen);
              }}
              title={`Theme: ${themeConfig.name}. Click to switch theme.`}
              className="p-2 rounded-lg border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 hover:border-cyan-400 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Palette className="w-4 h-4" style={{ color: themeConfig.primaryColor }} />
              <span className="hidden sm:inline font-mono-tech">THEME</span>
            </button>

            {isThemeMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-950 border border-cyan-500/40 rounded-xl p-2 shadow-2xl z-50 flex flex-col gap-1 backdrop-blur-md">
                <div className="px-2 py-1 text-[10px] font-mono-tech text-gray-400 uppercase tracking-wider border-b border-gray-800">
                  SELECT STARK THEME:
                </div>
                {Object.values(THEME_CONFIGS).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      soundFx.playHudBeep('mode');
                      setTheme(t.id);
                      setIsThemeMenuOpen(false);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-left text-xs font-tech font-bold flex items-center justify-between cursor-pointer transition-all ${
                      currentTheme === t.id
                        ? 'bg-cyan-950 text-cyan-200 border border-cyan-400'
                        : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full border border-white/40" style={{ backgroundColor: t.primaryColor }} />
                      <span>{t.name}</span>
                    </div>
                    {currentTheme === t.id && <span className="text-[10px] font-mono-tech text-cyan-400">ACTIVE</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen HUD Toggle */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen HUD Mode"
            className="p-2 rounded-lg border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 hover:border-cyan-400 transition-all text-xs flex items-center gap-1.5"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline font-mono-tech">HUD</span>
          </button>

          {/* Reset / Clean Slate Protocol */}
          <button
            onClick={() => {
              soundFx.playHudBeep('alert');
              onReset();
            }}
            title="Clean Slate: Reset Gauntlet Telemetry"
            className="p-2 rounded-lg border border-red-500/30 bg-red-950/20 text-red-300 hover:border-red-400 transition-all text-xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline font-mono-tech">RESET</span>
          </button>

          {/* Install / Publish to Laptop Button */}
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 rounded-lg border border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-tech font-semibold text-xs tracking-wider transition-all flex items-center gap-1.5 glow-arc-gold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 animate-bounce" />
            <span>INSTALL / PUBLISH</span>
          </button>
        </div>
      </div>
    </header>
  );
};
