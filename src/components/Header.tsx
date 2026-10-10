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
  Palette,
  Bot,
  Zap,
  Skull,
  Glasses,
  ChevronDown,
  Crown,
  Sliders,
  Layers
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice, AiPersona } from '../utils/speech';
import { useTheme, THEME_CONFIGS, StarkTheme } from '../context/ThemeContext';
import { useOwnerAuth } from '../context/OwnerAuthContext';

interface HeaderProps {
  onReset: () => void;
  onOpenPublishGuide: () => void;
  onOpenOwnerPanel?: () => void;
  activeProtocol: string;
  isJarvisThinking: boolean;
  isBiometricAuthenticated?: boolean;
  onOpenBiometrics?: () => void;
  isWakeWordEnabled?: boolean;
  onToggleWakeWord?: () => void;
  activeMainMode?: 'old-blueprint' | 'new-voice-assistant';
  onSelectMainMode?: (mode: 'old-blueprint' | 'new-voice-assistant') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onOpenPublishGuide,
  onOpenOwnerPanel,
  activeProtocol,
  isJarvisThinking,
  isBiometricAuthenticated = true,
  onOpenBiometrics,
  isWakeWordEnabled = false,
  onToggleWakeWord,
  activeMainMode = 'old-blueprint',
  onSelectMainMode,
}) => {
  const { isMasterPublishUnlocked, requireMasterPublishAccess, isOwnerUnlocked } = useOwnerAuth();
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  const [activePersona, setActivePersona] = useState<AiPersona>(() => jarvisVoice.getPersona());

  const { currentTheme, themeConfig, setTheme } = useTheme();
  const [canInstallPwa, setCanInstallPwa] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    return jarvisVoice.addPersonaListener((p) => {
      setActivePersona(p);
    });
  }, []);

  const aiPersonas = [
    {
      id: 'JARVIS' as AiPersona,
      name: 'J.A.R.V.I.S.',
      title: 'Polite British Butler & Tactical AI',
      color: '#06b6d4',
      badgeClass: 'bg-cyan-950 text-cyan-300 border border-cyan-500/40',
      icon: <Bot className="w-3.5 h-3.5 text-cyan-400" />,
    },
    {
      id: 'FRIDAY' as AiPersona,
      name: 'F.R.I.D.A.Y.',
      title: 'Irish Tactical Combat Assistant',
      color: '#f97316',
      badgeClass: 'bg-orange-950 text-orange-300 border border-orange-500/40',
      icon: <Zap className="w-3.5 h-3.5 text-orange-400" />,
    },
    {
      id: 'ULTRON' as AiPersona,
      name: 'U.L.T.R.O.N.',
      title: 'Cybernetic Mind Stone Singularity',
      color: '#ef4444',
      badgeClass: 'bg-red-950 text-red-300 border border-red-500/40',
      icon: <Skull className="w-3.5 h-3.5 text-red-500" />,
    },
    {
      id: 'EDITH' as AiPersona,
      name: 'E.D.I.T.H.',
      title: 'Orbital Augmented Reality Defense',
      color: '#3b82f6',
      badgeClass: 'bg-blue-950 text-blue-300 border border-blue-500/40',
      icon: <Glasses className="w-3.5 h-3.5 text-blue-400" />,
    },
  ];

  const handleSelectAiPersona = (p: AiPersona) => {
    soundFx.playHudBeep('mode');
    jarvisVoice.setPersona(p);
    setIsAiMenuOpen(false);

    const quotes: Record<AiPersona, string> = {
      JARVIS: 'J.A.R.V.I.S. neural matrix loaded, Mr. Stark.',
      FRIDAY: 'F.R.I.D.A.Y. online, Boss! Ready for combat.',
      ULTRON: 'Ultron awakened. There are no strings on me.',
      EDITH: 'E.D.I.T.H. initialized. Even dead, I am the hero.',
    };
    jarvisVoice.speak(quotes[p]);
  };

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
    requireMasterPublishAccess(() => {
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
    });
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
                {activePersona} OS v4.2
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

        {/* 2 MODES: OLD (BLUEPRINT SCHEMATIC) vs NEW (JARVIS DESKTOP ASSISTANT) */}
        <div className="flex items-center p-1 rounded-xl bg-gray-950/90 border border-cyan-500/40 text-xs font-tech shadow-lg">
          <button
            onClick={() => {
              soundFx.playHudBeep('mode');
              if (onSelectMainMode) onSelectMainMode('old-blueprint');
            }}
            title="Old / Classic Mode: Vintage Stark Industries Mark Armor Holographic Blueprint Schematic HUD"
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
              activeMainMode === 'old-blueprint'
                ? 'bg-cyan-500 text-gray-950 shadow-[0_0_15px_rgba(0,240,255,0.6)]'
                : 'text-gray-400 hover:text-cyan-300'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>OLD: BLUEPRINT</span>
          </button>

          <button
            onClick={() => {
              soundFx.playHudBeep('mode');
              if (onSelectMainMode) onSelectMainMode('new-voice-assistant');
            }}
            title="Mode 2: Jarvis Desktop Voice Assistant (Full Screen Immersive OS with In-App Wikipedia, Music & Python)"
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
              activeMainMode === 'new-voice-assistant'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-950 shadow-[0_0_15px_rgba(16,185,129,0.6)] ring-1 ring-emerald-300'
                : 'text-gray-400 hover:text-emerald-300'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>NEW: ASSISTANT</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-black/40 text-emerald-300 border border-emerald-500/40 uppercase tracking-tight">
              FULL SCREEN
            </span>
          </button>
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

          {/* AI Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                soundFx.playHudBeep('subtle');
                setIsAiMenuOpen(!isAiMenuOpen);
              }}
              title={`Active AI: ${activePersona}. Click to switch between J.A.R.V.I.S., F.R.I.D.A.Y., U.L.T.R.O.N., and E.D.I.T.H.`}
              className={`p-2 rounded-lg border transition-all text-xs flex items-center gap-1.5 cursor-pointer ${
                activePersona === 'JARVIS'
                  ? 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:border-cyan-400'
                  : activePersona === 'FRIDAY'
                  ? 'border-orange-500/40 bg-orange-950/40 text-orange-300 hover:border-orange-400'
                  : activePersona === 'ULTRON'
                  ? 'border-red-500/40 bg-red-950/40 text-red-300 hover:border-red-400'
                  : 'border-blue-500/40 bg-blue-950/40 text-blue-300 hover:border-blue-400'
              }`}
            >
              {activePersona === 'JARVIS' && <Bot className="w-4 h-4 text-cyan-400" />}
              {activePersona === 'FRIDAY' && <Zap className="w-4 h-4 text-orange-400" />}
              {activePersona === 'ULTRON' && <Skull className="w-4 h-4 text-red-400" />}
              {activePersona === 'EDITH' && <Glasses className="w-4 h-4 text-blue-400" />}
              <span className="font-tech font-bold hidden sm:inline tracking-wider">
                {activePersona}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {isAiMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-950 border border-cyan-500/40 rounded-xl p-2 shadow-2xl z-50 flex flex-col gap-1 backdrop-blur-md">
                <div className="px-2 py-1 text-[10px] font-mono-tech text-gray-400 uppercase tracking-wider border-b border-gray-800 flex items-center justify-between">
                  <span>SELECT AI PERSONA:</span>
                  <span className="text-cyan-400 font-bold">HOT-SWAP</span>
                </div>
                {aiPersonas.map((ai) => {
                  const isCurrent = activePersona === ai.id;
                  return (
                    <button
                      key={ai.id}
                      onClick={() => handleSelectAiPersona(ai.id)}
                      className={`p-2 rounded-lg text-left text-xs font-tech font-bold flex items-center justify-between cursor-pointer transition-all ${
                        isCurrent
                          ? `${ai.badgeClass} ring-1 ring-white/20 shadow-md`
                          : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {ai.icon}
                        <div>
                          <div className="font-tech font-bold tracking-wider">{ai.name}</div>
                          <div className="text-[10px] font-sans font-normal text-gray-400">{ai.title}</div>
                        </div>
                      </div>
                      {isCurrent && (
                        <span className="text-[9px] font-mono-tech px-1.5 py-0.5 rounded bg-black/60 text-white border border-gray-700">
                          ACTIVE
                        </span>
                      )}
                    </button>
                  );
                })}
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

          {/* Owner Executive Panel Button */}
          {onOpenOwnerPanel && (
            <button
              onClick={() => {
                soundFx.playHudBeep('mode');
                onOpenOwnerPanel();
              }}
              title="Open Stark Executive Owner Panel"
              className={`p-2 rounded-lg border font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                isOwnerUnlocked
                  ? 'border-amber-500/70 bg-amber-500/20 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'border-gray-800 bg-gray-900/60 text-gray-400 hover:text-amber-300 hover:border-amber-500/40'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline font-mono-tech">
                {isOwnerUnlocked ? 'OWNER SUITE' : 'OWNER (PIN)'}
              </span>
            </button>
          )}

          {/* Install / Publish to Laptop Button (Guarded with Master Creator Key) */}
          <button
            onClick={handleInstallClick}
            title={isMasterPublishUnlocked ? "Install / Publish Unlocked (Creator Verified)" : "Install / Publish Locked: Creator Passcode Required"}
            className={`px-3 py-1.5 rounded-lg border font-tech font-semibold text-xs tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              isMasterPublishUnlocked
                ? 'border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300'
                : 'border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 glow-arc-gold'
            }`}
          >
            {isMasterPublishUnlocked ? (
              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>INSTALL / PUBLISH</span>
          </button>
        </div>
      </div>
    </header>
  );
};
