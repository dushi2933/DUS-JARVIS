import React from 'react';
import { 
  Wrench, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  Printer, 
  HardDrive,
  Lightbulb
} from 'lucide-react';
import { ArmorMark, RepulsorLens, CapacitorType } from '../types/gauntlet';
import { MARK_PROFILES } from '../data/markProfiles';
import { soundFx } from '../utils/audioEffects';

interface GauntletWorkshopProps {
  currentMark: ArmorMark;
  currentLens: RepulsorLens;
  currentCapacitor: CapacitorType;
  onSelectMark: (mark: ArmorMark) => void;
  onSelectLens: (lens: RepulsorLens) => void;
  onSelectCapacitor: (cap: CapacitorType) => void;
}

export const GauntletWorkshop: React.FC<GauntletWorkshopProps> = ({
  currentMark,
  currentLens,
  currentCapacitor,
  onSelectMark,
  onSelectLens,
  onSelectCapacitor,
}) => {
  const marks = Object.values(MARK_PROFILES);

  return (
    <div className="bg-gray-900/60 border border-cyan-500/20 rounded-xl p-4 flex flex-col backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-950/40 border border-amber-400/40 flex items-center justify-center glow-arc-gold">
            <Wrench className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="font-tech text-sm font-bold tracking-wider text-amber-300">
              STARK ARMOR BLUEPRINT WORKSHOP
            </h3>
            <p className="text-[11px] text-gray-400 font-sans">
              Gauntlet Assembly & Mark Customization Suite
            </p>
          </div>
        </div>
      </div>

      {/* 1. Mark Selector Cards */}
      <div className="relative z-10 mb-4">
        <div className="text-[11px] font-mono-tech text-gray-400 uppercase mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Select Armor Mark Configuration:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {marks.map((m) => {
            const isSelected = currentMark === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  soundFx.playHudBeep('mode');
                  onSelectMark(m.id);
                }}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-amber-400/80 bg-amber-950/30 glow-arc-gold'
                    : 'border-gray-800 bg-gray-950/40 hover:border-gray-700'
                }`}
              >
                {isSelected && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 absolute top-2 right-2" />
                )}
                <div
                  className="w-3 h-3 rounded-full mb-2"
                  style={{ backgroundColor: m.accentColor }}
                />
                <div className="font-tech text-xs font-bold text-gray-200">
                  {m.name}
                </div>
                <div className="text-[10px] text-gray-400 font-mono-tech mt-0.5 truncate">
                  {m.baseOutputGW} GW Output
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Mark Technical Specs & Lore */}
      <div className="bg-gray-950/70 border border-gray-800 rounded-lg p-3 relative z-10 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800/80 pb-2 mb-2">
          <div>
            <span className="font-tech text-xs font-bold text-cyan-300">
              {MARK_PROFILES[currentMark].name}
            </span>
            <span className="text-gray-600 text-xs mx-2">|</span>
            <span className="text-[11px] text-amber-400 font-mono-tech">
              MATERIAL: {MARK_PROFILES[currentMark].material}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono-tech">
            STATUS: CALIBRATED
          </span>
        </div>

        <p className="text-xs text-gray-300 mb-2 leading-relaxed font-sans">
          {MARK_PROFILES[currentMark].description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-mono-tech text-gray-400">
          {MARK_PROFILES[currentMark].features.map((feat, i) => (
            <div key={i} className="flex items-center gap-1.5 text-gray-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Repulsor Lens & Capacitor Bank Tuning */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 mb-4">
        {/* Repulsor Lens */}
        <div className="bg-gray-950/50 p-3 rounded-lg border border-gray-800">
          <div className="text-xs font-tech text-cyan-300 mb-2 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Repulsor Emitter Lens Focal Array:</span>
          </div>
          <div className="space-y-1.5">
            {[
              { id: 'PULSE', label: 'Concussive Kinetic Pulse', desc: 'Standard Iron Man beam with physical blunt force impact.' },
              { id: 'LASER', label: 'Continuous High-Thermal Laser', desc: 'Focused high-wattage cutting beam.' },
              { id: 'ION_SHIELD', label: 'Wide-Angle Ion Shield', desc: 'Deflective energy canopy in the gauntlet palm.' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  soundFx.playHudBeep('subtle');
                  onSelectLens(opt.id as RepulsorLens);
                }}
                className={`w-full text-left p-2 rounded border text-xs transition-all cursor-pointer ${
                  currentLens === opt.id
                    ? 'border-cyan-500/60 bg-cyan-950/40 text-cyan-200'
                    : 'border-gray-800 bg-gray-900/40 text-gray-400 hover:text-gray-300'
                }`}
              >
                <div className="font-semibold">{opt.label}</div>
                <div className="text-[10px] text-gray-400">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Capacitor Cell */}
        <div className="bg-gray-950/50 p-3 rounded-lg border border-gray-800">
          <div className="text-xs font-tech text-amber-300 mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Capacitor Storage Cells:</span>
          </div>
          <div className="space-y-1.5">
            {[
              { id: 'PALLADIUM', label: 'Palladium Micro-Capacitor', desc: 'High reliability, quick 1.5s charge cycles.' },
              { id: 'VIBRANIUM_ION', label: 'Vibranium-Ion Mesh', desc: 'Absorbs incoming kinetic energy into recharge reservoir.' },
              { id: 'NANITE_FLOW', label: 'Dynamic Nanite Fluid Core', desc: 'Zero heat dissipation latency with self-healing channels.' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  soundFx.playHudBeep('subtle');
                  onSelectCapacitor(opt.id as CapacitorType);
                }}
                className={`w-full text-left p-2 rounded border text-xs transition-all cursor-pointer ${
                  currentCapacitor === opt.id
                    ? 'border-amber-500/60 bg-amber-950/40 text-amber-200'
                    : 'border-gray-800 bg-gray-900/40 text-gray-400 hover:text-gray-300'
                }`}
              >
                <div className="font-semibold">{opt.label}</div>
                <div className="text-[10px] text-gray-400">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Physical Iron Man Gauntlet Build Roadmap (Actionable Guide for Lyssandra) */}
      <div className="p-3 bg-gradient-to-r from-cyan-950/30 to-amber-950/30 border border-cyan-500/30 rounded-lg relative z-10">
        <div className="flex items-center gap-2 mb-2 text-xs font-tech font-bold text-amber-300">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>REAL-LIFE GAUNTLET FABRICATION GUIDE FOR MISS LYSSANDRA</span>
        </div>
        <p className="text-[11px] text-gray-300 mb-2 leading-relaxed">
          Ready to physically build the Iron Man gauntlet in real life? Here is the blueprint roadmap to connect with this J.A.R.V.I.S. app:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono-tech text-gray-300">
          <div className="bg-gray-950/70 p-2 rounded border border-gray-800">
            <div className="text-cyan-400 font-bold mb-1 flex items-center gap-1">
              <Printer className="w-3.5 h-3.5" /> 1. Shell & Armoring
            </div>
            <span>3D print PLA+ or PETG gauntlet pieces (Mark III or Mark 50 STL). Sand, prime, and paint Crimson Red & Gold!</span>
          </div>

          <div className="bg-gray-950/70 p-2 rounded border border-gray-800">
            <div className="text-amber-400 font-bold mb-1 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" /> 2. Electronics & LED
            </div>
            <span>Use an Arduino Nano / ESP32 with a WS2812B NeoPixel ring in the palm for the glowing Arc Repulsor blast.</span>
          </div>

          <div className="bg-gray-950/70 p-2 rounded border border-gray-800">
            <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5" /> 3. J.A.R.V.I.S. Link
            </div>
            <span>Connect this laptop app to your gauntlet via Bluetooth or Web Serial API to trigger actual physical LED flashes!</span>
          </div>
        </div>
      </div>
    </div>
  );
};
