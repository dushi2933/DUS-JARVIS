import React, { useState } from 'react';
import { 
  Palette, 
  Sparkles, 
  Check, 
  RefreshCw, 
  Sliders, 
  Layers, 
  Zap, 
  Flame, 
  Droplets, 
  ShieldCheck 
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';

export interface PaintPreset {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  arcGlowColor: string;
  finish: 'GLOSS' | 'MATTE' | 'BRUSHED' | 'BATTLE_DAMAGED';
}

export const StarkArmorPaintShop: React.FC = () => {
  const { addToast } = useToast();
  const { setTheme } = useTheme();

  const [primaryColor, setPrimaryColor] = useState<string>('#dc2626'); // Red-600
  const [secondaryColor, setSecondaryColor] = useState<string>('#f59e0b'); // Amber-500
  const [arcGlowColor, setArcGlowColor] = useState<string>('#06b6d4'); // Cyan-500
  const [finish, setFinish] = useState<'GLOSS' | 'MATTE' | 'BRUSHED' | 'BATTLE_DAMAGED'>('GLOSS');

  const presets: PaintPreset[] = [
    {
      id: 'classic-hotrod',
      name: 'Classic Hot-Rod Red & Gold',
      primaryColor: '#dc2626',
      secondaryColor: '#f59e0b',
      arcGlowColor: '#06b6d4',
      finish: 'GLOSS',
    },
    {
      id: 'stealth-carbon',
      name: 'Mark XVI Stealth Blackout',
      primaryColor: '#171717',
      secondaryColor: '#525252',
      arcGlowColor: '#06b6d4',
      finish: 'MATTE',
    },
    {
      id: 'silver-centurion',
      name: 'Mark XXXIII Silver Centurion',
      primaryColor: '#e2e8f0',
      secondaryColor: '#dc2626',
      arcGlowColor: '#38bdf8',
      finish: 'BRUSHED',
    },
    {
      id: 'war-machine',
      name: 'War Machine Gunmetal & Slate',
      primaryColor: '#334155',
      secondaryColor: '#94a3b8',
      arcGlowColor: '#ef4444',
      finish: 'MATTE',
    },
    {
      id: 'quantum-realm',
      name: 'Endgame Quantum Nanite Suit',
      primaryColor: '#ffffff',
      secondaryColor: '#dc2626',
      arcGlowColor: '#ef4444',
      finish: 'GLOSS',
    },
    {
      id: 'vibranium-purple',
      name: 'Wakandan Vibranium Kinetic',
      primaryColor: '#1e1b4b',
      secondaryColor: '#a855f7',
      arcGlowColor: '#c084fc',
      finish: 'GLOSS',
    },
  ];

  const handleApplyPreset = (preset: PaintPreset) => {
    soundFx.playHudBeep('mode');
    setPrimaryColor(preset.primaryColor);
    setSecondaryColor(preset.secondaryColor);
    setArcGlowColor(preset.arcGlowColor);
    setFinish(preset.finish);
    jarvisVoice.speak(`Loading ${preset.name} nanocoating livery, Mr. Stark.`);
  };

  const handleApplyToSuit = () => {
    soundFx.playRepulsorCharge();
    soundFx.playHudBeep('confirm');

    // Sync active theme if applicable
    if (primaryColor === '#171717') setTheme('stealth-onyx');
    else if (arcGlowColor === '#a855f7') setTheme('loki-asgard');
    else setTheme('hotrod-crimson');

    jarvisVoice.speak('Robotic paint gantries engaged. Customized livery baked into armor composite, Sir.');
    addToast({
      title: 'Custom Livery Applied!',
      message: 'Nanotech pigment layer molecularly bonded to gauntlet chassis.',
      type: 'protocol',
    });
  };

  return (
    <div className="bg-gray-950/90 border border-amber-500/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md relative min-h-[640px] flex flex-col p-4 gap-4 select-none">
      <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-400 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
            <Palette className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tech text-base font-bold text-amber-200 tracking-wider">
                STARK ARMOR PAINT SHOP & NANOCOATING STUDIO
              </h2>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded border border-amber-500/40 bg-amber-950/80 text-amber-300 uppercase font-bold">
                FINISH: {finish}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans">
              Custom paint formulation, dual-tone anodizing, surface finishes, and real-time gauntlet rendering
            </p>
          </div>
        </div>

        {/* Master Apply Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleApplyToSuit}
            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-red-600 via-amber-500 to-amber-600 hover:scale-105 active:scale-95 text-white font-tech font-bold text-xs tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.6)] transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>BAKE LIVERY ONTO GAUNTLET</span>
          </button>
        </div>
      </div>

      {/* Main Studio Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
        
        {/* Left Column: Live Rendered Gauntlet Preview (7 Cols) */}
        <div className="lg:col-span-7 bg-gray-950/95 border border-amber-500/30 rounded-2xl relative overflow-hidden flex flex-col items-center justify-between p-6 min-h-[460px] shadow-inner">
          
          <div className="w-full flex items-center justify-between text-xs font-mono-tech border-b border-gray-800 pb-2">
            <span className="text-gray-400">SURFACE SHADER: {finish} SPECULAR MATRIX</span>
            <span style={{ color: arcGlowColor }} className="font-bold">
              ARC EMISSION: {arcGlowColor.toUpperCase()}
            </span>
          </div>

          {/* Center SVG Render of Iron Man Gauntlet with Custom Colors */}
          <div className="my-auto flex flex-col items-center gap-4">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                <defs>
                  <filter id="arcGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Outer Armor Forearm Clamshell (Primary Color) */}
                <path
                  d="M 50,40 L 150,40 L 165,160 L 35,160 Z"
                  fill={primaryColor}
                  stroke="#1f2937"
                  strokeWidth="3"
                  className={finish === 'GLOSS' ? 'drop-shadow-lg' : ''}
                />

                {/* Inner Muscle Struts (Secondary Color) */}
                <path
                  d="M 65,55 L 135,55 L 145,145 L 55,145 Z"
                  fill={secondaryColor}
                  stroke="#111827"
                  strokeWidth="2"
                />

                {/* Palm Center Arc Core Emitter */}
                <circle
                  cx="100"
                  cy="100"
                  r="24"
                  fill="#111827"
                  stroke={primaryColor}
                  strokeWidth="3"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="16"
                  fill={arcGlowColor}
                  filter="url(#arcGlowFilter)"
                  className="animate-pulse"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="8"
                  fill="#ffffff"
                />

                {/* Decorative Gauntlet Finger Joints (Secondary Color) */}
                <rect x="45" y="15" width="16" height="22" rx="4" fill={secondaryColor} stroke="#111827" />
                <rect x="75" y="8" width="18" height="28" rx="4" fill={primaryColor} stroke="#111827" />
                <rect x="107" y="8" width="18" height="28" rx="4" fill={primaryColor} stroke="#111827" />
                <rect x="139" y="15" width="16" height="22" rx="4" fill={secondaryColor} stroke="#111827" />
              </svg>
            </div>

            <div className="text-center">
              <span className="text-xs font-mono-tech text-amber-400 font-bold tracking-widest uppercase">
                GAUNTLET LIVERY PREVIEW
              </span>
              <h3 className="font-tech text-lg font-bold text-white tracking-wider mt-0.5">
                MOLECULAR NANO-COATING
              </h3>
            </div>
          </div>

          {/* Finish Selector Bar */}
          <div className="w-full bg-gray-900/80 p-2.5 rounded-xl border border-gray-800 flex items-center justify-between text-xs font-mono-tech">
            <span className="text-gray-400">SURFACE FINISH:</span>
            <div className="flex gap-1.5">
              {(['GLOSS', 'MATTE', 'BRUSHED', 'BATTLE_DAMAGED'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    soundFx.playHudBeep('subtle');
                    setFinish(f);
                  }}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                    finish === f
                      ? 'bg-amber-500 text-gray-950 font-extrabold shadow-md'
                      : 'bg-gray-950 text-gray-400 hover:text-white'
                  }`}
                >
                  {f.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Color Swatches & Preset Vault (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          
          {/* Custom Color Pickers */}
          <div className="bg-gray-900/90 border border-amber-500/20 rounded-xl p-3.5 flex flex-col gap-3">
            <span className="font-tech text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-800 pb-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>CUSTOM PALETTE CALIBRATION</span>
            </span>

            {/* Primary Color Picker */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-950 border border-gray-800 text-xs font-mono-tech">
              <span className="text-gray-300">PRIMARY ARMOR PLATE:</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-8 h-8 rounded border border-gray-700 bg-transparent cursor-pointer"
                />
                <span className="font-bold uppercase text-white">{primaryColor}</span>
              </div>
            </div>

            {/* Secondary Color Picker */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-950 border border-gray-800 text-xs font-mono-tech">
              <span className="text-gray-300">SECONDARY MUSCULATURE:</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-8 h-8 rounded border border-gray-700 bg-transparent cursor-pointer"
                />
                <span className="font-bold uppercase text-white">{secondaryColor}</span>
              </div>
            </div>

            {/* Arc Core Emission Glow Picker */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-950 border border-gray-800 text-xs font-mono-tech">
              <span className="text-gray-300">ARC REACTOR EMISSION:</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={arcGlowColor}
                  onChange={(e) => setArcGlowColor(e.target.value)}
                  className="w-8 h-8 rounded border border-gray-700 bg-transparent cursor-pointer"
                />
                <span className="font-bold uppercase text-white">{arcGlowColor}</span>
              </div>
            </div>
          </div>

          {/* Canonical Livery Presets Vault */}
          <div className="bg-gray-900/90 border border-amber-500/20 rounded-xl p-3.5 flex flex-col gap-2.5">
            <span className="font-tech text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-800 pb-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>STARK CANONICAL PRESETS</span>
            </span>

            <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleApplyPreset(p)}
                  className="w-full p-2 rounded-lg bg-gray-950 border border-gray-800 hover:border-amber-400 text-left cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex -space-x-1">
                      <span className="w-3.5 h-3.5 rounded-full border border-black" style={{ backgroundColor: p.primaryColor }} />
                      <span className="w-3.5 h-3.5 rounded-full border border-black" style={{ backgroundColor: p.secondaryColor }} />
                      <span className="w-3.5 h-3.5 rounded-full border border-black" style={{ backgroundColor: p.arcGlowColor }} />
                    </div>
                    <span className="text-xs font-tech font-bold text-gray-300 group-hover:text-white">
                      {p.name}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono-tech text-gray-500">{p.finish}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
