import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Flame, 
  Crosshair, 
  Activity, 
  Sliders, 
  Layers, 
  Maximize2, 
  RotateCw, 
  Volume2, 
  Info,
  Shield,
  Cpu
} from 'lucide-react';
import { GauntletState, MarkProfile } from '../types/gauntlet';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';

interface StarkBlueprintSchematicHudProps {
  gauntletState?: GauntletState;
  markProfile?: MarkProfile;
  onChargeRepulsor?: (level: number) => void;
  onFireRepulsor?: () => void;
  className?: string;
  isStandaloneTab?: boolean;
}

export const StarkBlueprintSchematicHud: React.FC<StarkBlueprintSchematicHudProps> = ({
  gauntletState,
  onChargeRepulsor,
  onFireRepulsor,
  className = '',
  isStandaloneTab = false,
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('arc-reactor');
  const [viewMode, setViewMode] = useState<'schematic' | 'diagnostic' | 'combat'>('schematic');
  const [isRotatingCore, setIsRotatingCore] = useState<boolean>(true);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const repulsorCharge = gauntletState?.repulsorCharge ?? 85;
  const isFiring = gauntletState?.isFiring ?? false;

  const sectorDetails: Record<string, { title: string; subtitle: string; spec: string; status: string; efficiency: string }> = {
    'arc-reactor': {
      title: 'CENTRAL ARC REACTOR CORE (MK-LXXXV)',
      subtitle: 'Palladium-Free Synthesized Isotope Cold Fusion Unit',
      spec: 'Output: 3.8 GJ/sec · Output Voltage: 12.4 kV · Core Flux: 99.4%',
      status: 'OPTIMAL // LEVEL 10 CLEARANCE',
      efficiency: '99.8%',
    },
    'helmet': {
      title: 'AUGMENTED COGNITIVE TACTICAL HELMET',
      subtitle: 'Retinal HUD Projection & J.A.R.V.I.S. Neural Uplink',
      spec: 'Resolution: 16K Holographic · Latency: 0.12 ms · Sensor Array: Multi-Spectrum',
      status: 'NEURAL SYNC ACTIVE',
      efficiency: '100.0%',
    },
    'chest-armor': {
      title: 'CHEST & PECTORAL DEFENSE MATRIX',
      subtitle: 'Gold-Titanium Nanotech Liquid Lattice Weave',
      spec: 'Tensile Strength: 420 GPa · Ablative Threshold: 4,500°C · Density: 9.8 g/cm³',
      status: 'INTEGRITY 100%',
      efficiency: '98.5%',
    },
    'left-repulsor': {
      title: 'PORT GAUNTLET & PALM REPULSOR EMITTER',
      subtitle: 'Concussive Muon Particle Acceleration Nozzle',
      spec: 'Max Discharge: 100% · Servo Articulation: 5-Axis Micro-Servos · Thermal: 310 K',
      status: 'ARMED & CALIBRATED',
      efficiency: '96.2%',
    },
    'right-repulsor': {
      title: 'STARBOARD GAUNTLET & PALM REPULSOR EMITTER',
      subtitle: 'Concussive Muon Particle Acceleration Nozzle',
      spec: 'Max Discharge: 100% · Micro-Missile Pod: 6 Armed · Thermal: 312 K',
      status: 'ARMED & CALIBRATED',
      efficiency: '97.0%',
    },
    'leg-thrusters': {
      title: 'SUPERSONIC FLIGHT THRUSTERS & KNEE JOINTS',
      subtitle: 'Vector-Thrust Stabilizers & Nanotech Air Brakes',
      spec: 'Max Airspeed: Mach 3.2 · Stabilizer Response: 4.8 ms · Articulation: Dual-Pivot',
      status: 'AERO STABLE',
      efficiency: '99.1%',
    },
    'orthogonal-rear': {
      title: 'DORSAL THRUSTER MATRIX & FLAP ACTUATORS',
      subtitle: 'Rear Aerodynamic Flight Stabilizers & Ejection Ports',
      spec: 'Aerodynamic Drag Coeff: 0.18 · Deploy Angle: 0°-45° · Nanotech Recovery',
      status: 'SYNCHRONIZED',
      efficiency: '98.9%',
    },
  };

  const currentSector = sectorDetails[selectedSector] || sectorDetails['arc-reactor'];

  const handleSelectSector = (id: string, sound: 'beep' | 'arc' = 'beep') => {
    setSelectedSector(id);
    if (sound === 'arc') {
      soundFx.playArcReactorPulse();
    } else {
      soundFx.playHudBeep('subtle');
    }
  };

  const handleFireBlast = () => {
    if (onFireRepulsor) {
      onFireRepulsor();
    } else {
      soundFx.playRepulsorBlast();
    }
    jarvisVoice.speak('Discharging repulsor concussive pulse, Sir.');
  };

  const handleChargeCore = () => {
    if (onChargeRepulsor) {
      onChargeRepulsor(100);
    } else {
      soundFx.playRepulsorCharge(1500);
    }
    jarvisVoice.speak('Arc core capacitors charged to one hundred percent capacity.');
  };

  return (
    <div className={`relative w-full rounded-2xl border border-cyan-500/40 bg-[#03060a] overflow-hidden select-none font-mono text-cyan-200 shadow-[0_0_40px_rgba(0,240,255,0.18)] ${className}`}>
      {/* 1. Deep Technical Blueprint Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundColor: '#020508',
          backgroundImage: `
            linear-gradient(to right, rgba(0, 240, 255, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 240, 255, 0.12) 1px, transparent 1px),
            linear-gradient(to right, rgba(0, 240, 255, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 240, 255, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px, 80px 80px, 16px 16px, 16px 16px'
        }}
      />

      {/* Blueprint Vignette and Scanlines */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_50%,rgba(2,4,8,0.85)_100%)]" />
      <div className="absolute inset-0 pointer-events-none holo-scanlines opacity-25" />

      {/* Screen flash on fire */}
      {isFiring && (
        <div className="absolute inset-0 bg-cyan-400/30 z-40 pointer-events-none animate-ping" />
      )}

      {/* Header Toolbar */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 p-4 border-b border-cyan-500/30 bg-[#040912]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {/* STARK INDUSTRIES Technical Logo with Chevron */}
          <div className="flex items-center gap-2">
            <span className="font-tech text-base sm:text-lg font-black tracking-widest text-cyan-400 italic">
              STARK INDUSTRIES
            </span>
            <span className="text-cyan-500/60 font-mono text-sm tracking-tighter">
              //
            </span>
          </div>

          <span className="text-[11px] font-mono text-cyan-400/80 hidden md:inline-block border-l border-cyan-500/30 pl-3">
            MARK LXXXV WIREFRAME BLUEPRINT & DIAGNOSTIC HUD
          </span>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-950/90 rounded-lg p-0.5 border border-cyan-500/30 text-xs font-mono">
            {[
              { id: 'schematic', label: 'SCHEMATIC' },
              { id: 'diagnostic', label: 'DIAGNOSTIC' },
              { id: 'combat', label: 'TACTICAL' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  soundFx.playHudBeep('mode');
                  setViewMode(m.id as any);
                }}
                className={`px-3 py-1 rounded transition-all cursor-pointer font-bold ${
                  viewMode === m.id
                    ? 'bg-cyan-500 text-gray-950 shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                    : 'text-cyan-400/70 hover:text-cyan-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsRotatingCore(!isRotatingCore)}
            title="Toggle Core Rotation"
            className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
              isRotatingCore
                ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                : 'bg-gray-900 border-gray-700 text-gray-400'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotatingCore ? 'animate-spin-slow' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Canvas Grid: Left Arc Reactor Blueprint + Center Iron Man Wireframe + Right Orthogonal Views */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-[580px] p-4 lg:p-6 gap-6 items-center">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Arc Reactor Stator Blueprint Drafting & Mechanical Schematic */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 flex flex-col justify-between h-full space-y-6">
          {/* Top: Stark Industries Mechanical Blueprint Diagram */}
          <div className="relative p-4 rounded-xl border border-cyan-500/30 bg-[#030810]/70 backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono border-b border-cyan-500/20 pb-2">
              <span className="text-cyan-400 font-bold tracking-wider">MECHANICAL STATOR DIAGRAM</span>
              <span className="text-gray-400">DWG. #85-AR-01</span>
            </div>

            {/* Circular Mechanical Stator Drawing with angle ticks and dimension lines */}
            <div className="relative flex items-center justify-center py-2">
              <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-[0_0_8px_rgba(0,240,255,0.3)]">
                {/* Crosshairs */}
                <line x1="100" y1="10" x2="100" y2="190" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
                <line x1="10" y1="100" x2="190" y2="100" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />

                {/* Outer Dimension Ring with Degree Callout */}
                <circle cx="100" cy="100" r="85" fill="none" stroke="#00f0ff" strokeWidth="0.8" opacity="0.5" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="#00f0ff" strokeWidth="1" strokeDasharray="6 4" opacity="0.6" />
                
                {/* Angle Dimension Arc (120 deg) */}
                <path d="M 100 15 A 85 85 0 0 1 173 57" fill="none" stroke="#00f0ff" strokeWidth="1" />
                <text x="145" y="45" fill="#00f0ff" fontSize="9" fontFamily="monospace" fontWeight="bold">120°</text>
                
                {/* Radial Stator Teeth (10 Teeth like in the reference image) */}
                {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg, i) => {
                  const rad = (deg * Math.PI) / 180;
                  const x1 = 100 + 45 * Math.cos(rad);
                  const y1 = 100 + 45 * Math.sin(rad);
                  const x2 = 100 + 68 * Math.cos(rad);
                  const y2 = 100 + 68 * Math.sin(rad);
                  return (
                    <g key={i}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00f0ff" strokeWidth="2.5" opacity="0.85" />
                      <circle cx={x2} cy={y2} r="2" fill="#ef4444" opacity="0.7" />
                    </g>
                  );
                })}

                {/* Inner Core Circle with Concentric Rings */}
                <circle cx="100" cy="100" r="32" fill="none" stroke="#00f0ff" strokeWidth="1.2" opacity="0.9" />
                <circle cx="100" cy="100" r="16" fill="none" stroke="#ef4444" strokeWidth="1.2" opacity="0.8" />
                <circle cx="100" cy="100" r="6" fill="#00f0ff" />

                {/* Drafting Dimension Callout Line */}
                <line x1="100" y1="100" x2="35" y2="40" stroke="#00f0ff" strokeWidth="0.8" opacity="0.7" />
                <line x1="35" y1="40" x2="15" y2="40" stroke="#00f0ff" strokeWidth="0.8" opacity="0.7" />
                <text x="18" y="36" fill="#00f0ff" fontSize="8" fontFamily="monospace">Ø 88.4mm</text>
              </svg>
            </div>

            <div className="text-[10px] text-gray-400 font-mono space-y-1">
              <div className="flex justify-between">
                <span>STATOR ROTOR:</span>
                <span className="text-cyan-300">10-POLE COLD FLUX</span>
              </div>
              <div className="flex justify-between">
                <span>FIELD FREQUENCY:</span>
                <span className="text-cyan-300">2.44 GHz SYNCH</span>
              </div>
            </div>
          </div>

          {/* Bottom-Left: The Authentic Rotating J.A.R.V.I.S. Core Emblem */}
          <div 
            onClick={() => handleSelectSector('arc-reactor', 'arc')}
            className="p-4 rounded-xl border border-cyan-500/40 bg-gradient-to-br from-gray-950 via-[#030914] to-cyan-950/40 relative cursor-pointer hover:border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all group"
          >
            <div className="flex items-center justify-between text-[11px] mb-2">
              <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>J.A.R.V.I.S. HUD CORE</span>
              </span>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">
                ACTIVE
              </span>
            </div>

            {/* Concentric Rotating J.A.R.V.I.S. Circular Core Emblem (matching the image) */}
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
              {/* Outer Segmented Radial Ring with 32 Tick Marks */}
              <svg 
                viewBox="0 0 200 200" 
                className={`w-full h-full drop-shadow-[0_0_12px_rgba(0,240,255,0.45)] ${isRotatingCore ? 'animate-spin-slow' : ''}`}
              >
                {/* Outer Thin Ring */}
                <circle cx="100" cy="100" r="92" fill="none" stroke="#00f0ff" strokeWidth="1" opacity="0.6" />
                
                {/* 32 Radial Ticks */}
                {Array.from({ length: 32 }).map((_, i) => {
                  const deg = (i * 360) / 32;
                  const rad = (deg * Math.PI) / 180;
                  const x1 = 100 + 82 * Math.cos(rad);
                  const y1 = 100 + 82 * Math.sin(rad);
                  const x2 = 100 + 91 * Math.cos(rad);
                  const y2 = 100 + 91 * Math.sin(rad);
                  return (
                    <line 
                      key={i} 
                      x1={x1} 
                      y1={y1} 
                      x2={x2} 
                      y2={y2} 
                      stroke="#00f0ff" 
                      strokeWidth={i % 4 === 0 ? "2.5" : "1"} 
                      opacity={i % 4 === 0 ? "0.9" : "0.5"} 
                    />
                  );
                })}

                {/* Middle Counter-Clockwise Dashed Track */}
                <circle 
                  cx="100" 
                  cy="100" 
                  r="74" 
                  fill="none" 
                  stroke="#00f0ff" 
                  strokeWidth="2.5" 
                  strokeDasharray="18 10 6 10" 
                  opacity="0.8" 
                />

                {/* Segmented Arc Blocks */}
                <path 
                  d="M 100 28 A 72 72 0 0 1 172 100" 
                  fill="none" 
                  stroke="#00f0ff" 
                  strokeWidth="4" 
                  opacity="0.75" 
                />
                <path 
                  d="M 100 172 A 72 72 0 0 1 28 100" 
                  fill="none" 
                  stroke="#00f0ff" 
                  strokeWidth="4" 
                  opacity="0.75" 
                />

                {/* Inner Bezel Track */}
                <circle cx="100" cy="100" r="58" fill="#040812" stroke="#00f0ff" strokeWidth="1.5" opacity="0.9" />
              </svg>

              {/* Centered J.A.R.V.I.S. Text with Glowing Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <div className="w-16 h-16 rounded-full border border-cyan-400/50 flex flex-col items-center justify-center bg-cyan-950/60 shadow-[inset_0_0_15px_rgba(0,240,255,0.4)]">
                  <span className="font-tech text-xs sm:text-sm font-black tracking-widest text-cyan-200 text-glow-cyan">
                    J.A.R.V.I.S.
                  </span>
                  <div className="w-6 h-0.5 bg-cyan-400 mt-0.5 rounded-full" />
                </div>
              </div>
            </div>

            <p className="text-[10px] text-cyan-400/80 text-center font-mono mt-1">
              CLICK TO SYNCHRONIZE ARC REACTOR
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTER COLUMN: The Iconic Full Iron Man Mark Armor Wireframe Schematic   */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[520px]">
          {/* Subtle Concentric Target Grids */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-96 h-96 rounded-full border border-cyan-500/40" />
            <div className="w-72 h-72 rounded-full border border-dashed border-cyan-500/40" />
          </div>

          {/* Interactive Wireframe SVG of Iron Man Suit */}
          <div className="relative w-full max-w-[440px] aspect-[4/5] flex items-center justify-center">
            <svg 
              viewBox="0 0 400 520" 
              className="w-full h-full drop-shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer"
            >
              <defs>
                <radialGradient id="arcReactorGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="30%" stopColor="#38bdf8" />
                  <stop offset="70%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>

                <linearGradient id="neonCyanWire" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>

                <linearGradient id="neonRedWire" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>

              {/* 1. HELMET & VISOR WIREFRAME */}
              <g 
                onClick={() => handleSelectSector('helmet')}
                onMouseEnter={() => setHoveredPart('HELMET & NEURAL RETINAL HUD')}
                onMouseLeave={() => setHoveredPart(null)}
                className="transition-all hover:opacity-100"
              >
                {/* Outer Helmet Silhouette */}
                <path 
                  d="M 180 40 C 180 32, 220 32, 220 40 C 230 46, 234 65, 230 85 C 226 95, 218 102, 200 105 C 182 102, 174 95, 170 85 C 166 65, 170 46, 180 40 Z" 
                  fill="rgba(2, 6, 14, 0.7)" 
                  stroke="#00f0ff" 
                  strokeWidth="2" 
                />
                
                {/* Crimson Faceplate Accents */}
                <path 
                  d="M 182 52 L 218 52 L 222 75 L 210 95 L 190 95 L 178 75 Z" 
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="1.2" 
                />

                {/* Glowing Slit Visor Optics */}
                <line x1="183" y1="68" x2="195" y2="70" stroke="#00f0ff" strokeWidth="2.5" className="glow-blueprint-cyan" />
                <line x1="217" y1="68" x2="205" y2="70" stroke="#00f0ff" strokeWidth="2.5" className="glow-blueprint-cyan" />

                {/* Chin Seamline */}
                <line x1="195" y1="95" x2="205" y2="95" stroke="#10b981" strokeWidth="1.5" />
              </g>

              {/* 2. COLLAR & NECK */}
              <path d="M 185 105 L 175 120 L 225 120 L 215 105 Z" fill="none" stroke="#00f0ff" strokeWidth="1.2" />

              {/* 3. SHOULDER PAULDRONS (Outer Deltoids) */}
              {/* Left Shoulder */}
              <g 
                onClick={() => handleSelectSector('left-repulsor')}
                onMouseEnter={() => setHoveredPart('PORT SHOULDER & SERVO DAMPENER')}
                onMouseLeave={() => setHoveredPart(null)}
              >
                <path 
                  d="M 172 120 L 140 130 C 132 142, 134 162, 145 175 L 165 160 Z" 
                  fill="rgba(3, 7, 18, 0.6)" 
                  stroke="#00f0ff" 
                  strokeWidth="1.8" 
                />
                <path d="M 145 135 L 138 152 L 155 162" fill="none" stroke="#ef4444" strokeWidth="1" />
                <circle cx="152" cy="148" r="4" fill="none" stroke="#10b981" strokeWidth="1" />
              </g>

              {/* Right Shoulder */}
              <g 
                onClick={() => handleSelectSector('right-repulsor')}
                onMouseEnter={() => setHoveredPart('STARBOARD SHOULDER & MISSILE CAROUSEL')}
                onMouseLeave={() => setHoveredPart(null)}
              >
                <path 
                  d="M 228 120 L 260 130 C 268 142, 266 162, 255 175 L 235 160 Z" 
                  fill="rgba(3, 7, 18, 0.6)" 
                  stroke="#00f0ff" 
                  strokeWidth="1.8" 
                />
                <path d="M 255 135 L 262 152 L 245 162" fill="none" stroke="#ef4444" strokeWidth="1" />
                <circle cx="248" cy="148" r="4" fill="none" stroke="#10b981" strokeWidth="1" />
              </g>

              {/* 4. CHEST PLATE & ARC REACTOR CORE (The Star of the Reference Image) */}
              <g 
                onClick={() => handleSelectSector('arc-reactor', 'arc')}
                onMouseEnter={() => setHoveredPart('CENTRAL ARC REACTOR CORE (CLICK TO DISCHARGE)')}
                onMouseLeave={() => setHoveredPart(null)}
                className="cursor-pointer group"
              >
                {/* Main Pectoral Shield Contours */}
                <path 
                  d="M 165 125 L 235 125 L 245 185 L 232 230 L 168 230 L 155 185 Z" 
                  fill="rgba(2, 6, 14, 0.8)" 
                  stroke="#00f0ff" 
                  strokeWidth="2" 
                />

                {/* Crimson Internal Armor Contours (Exact lines as in reference image) */}
                <path d="M 175 135 L 190 155 L 210 155 L 225 135" fill="none" stroke="#ef4444" strokeWidth="1.2" />
                <path d="M 162 175 L 175 220 L 200 230 L 225 220 L 238 175" fill="none" stroke="#ef4444" strokeWidth="1.2" />

                {/* Vertical Symmetry & Division Lines */}
                <line x1="200" y1="125" x2="200" y2="170" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
                <line x1="200" y1="205" x2="200" y2="230" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

                {/* Lateral Torso Accent Brackets in Red (as seen in image) */}
                <path d="M 178 185 C 176 195, 176 205, 178 215" fill="none" stroke="#ef4444" strokeWidth="2" />
                <path d="M 222 185 C 224 195, 224 205, 222 215" fill="none" stroke="#ef4444" strokeWidth="2" />

                {/* ============================================================== */}
                {/* THE GLOWING CIRCULAR ARC REACTOR CORE                          */}
                {/* ============================================================== */}
                <g className="filter drop-shadow-[0_0_12px_rgba(0,240,255,0.9)]">
                  {/* Outer Core Rim */}
                  <circle cx="200" cy="188" r="18" fill="none" stroke="#00f0ff" strokeWidth="2.5" />
                  
                  {/* Inner Concentric Glow Ring */}
                  <circle cx="200" cy="188" r="12" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 2" />
                  
                  {/* Bright Pure Core Glow */}
                  <circle cx="200" cy="188" r="8" fill="url(#arcReactorGlow)" />
                  <circle cx="200" cy="188" r="3" fill="#ffffff" />
                </g>
              </g>

              {/* 5. ARMS & GAUNTLETS (Port & Starboard) */}
              {/* Left Bicep and Forearm */}
              <g 
                onClick={() => handleSelectSector('left-repulsor')}
                onMouseEnter={() => setHoveredPart('PORT GAUNTLET')}
                onMouseLeave={() => setHoveredPart(null)}
              >
                <path d="M 148 178 L 138 230 L 152 232 L 160 180 Z" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
                {/* Green Joint Highlight (as in user image) */}
                <line x1="138" y1="230" x2="152" y2="232" stroke="#10b981" strokeWidth="2" />
                
                {/* Forearm & Gauntlet */}
                <path d="M 136 235 L 126 310 L 144 315 L 154 237 Z" fill="none" stroke="#00f0ff" strokeWidth="1.8" />
                <path d="M 130 250 L 148 255 L 142 295" fill="none" stroke="#ef4444" strokeWidth="1" />
                
                {/* Hand and Palm Repulsor */}
                <path d="M 126 312 L 120 348 L 138 350 L 144 316 Z" fill="none" stroke="#ef4444" strokeWidth="1.2" />
                <circle cx="130" cy="330" r="3.5" fill="#00f0ff" className="glow-blueprint-cyan" />
              </g>

              {/* Right Bicep and Forearm */}
              <g 
                onClick={() => handleSelectSector('right-repulsor')}
                onMouseEnter={() => setHoveredPart('STARBOARD GAUNTLET')}
                onMouseLeave={() => setHoveredPart(null)}
              >
                <path d="M 252 178 L 262 230 L 248 232 L 240 180 Z" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
                {/* Green Joint Highlight */}
                <line x1="262" y1="230" x2="248" y2="232" stroke="#10b981" strokeWidth="2" />

                {/* Forearm & Gauntlet */}
                <path d="M 264 235 L 274 310 L 256 315 L 246 237 Z" fill="none" stroke="#00f0ff" strokeWidth="1.8" />
                <path d="M 270 250 L 252 255 L 258 295" fill="none" stroke="#ef4444" strokeWidth="1" />

                {/* Hand and Palm Repulsor */}
                <path d="M 274 312 L 280 348 L 262 350 L 256 316 Z" fill="none" stroke="#ef4444" strokeWidth="1.2" />
                <circle cx="270" cy="330" r="3.5" fill="#00f0ff" className="glow-blueprint-cyan" />
              </g>

              {/* 6. ABDOMEN & PELVIC CHASSIS */}
              <g onClick={() => handleSelectSector('chest-armor')}>
                <path d="M 168 230 L 172 285 L 228 285 L 232 230 Z" fill="none" stroke="#00f0ff" strokeWidth="1.8" />
                {/* Abdominal Segmented Plates */}
                <line x1="170" y1="248" x2="230" y2="248" stroke="#ef4444" strokeWidth="1" />
                <line x1="171" y1="266" x2="229" y2="266" stroke="#ef4444" strokeWidth="1" />
                {/* Pelvic Plate */}
                <path d="M 172 285 L 180 325 L 200 335 L 220 325 L 228 285 Z" fill="none" stroke="#00f0ff" strokeWidth="1.8" />
              </g>

              {/* 7. LEGS & THRUSTERS (Upper Thighs with Green Joint Highlights) */}
              <g 
                onClick={() => handleSelectSector('leg-thrusters')}
                onMouseEnter={() => setHoveredPart('STABILIZER LEGS & HYDRAULICS')}
                onMouseLeave={() => setHoveredPart(null)}
              >
                {/* Left Thigh */}
                <path d="M 175 328 L 165 405 L 192 405 L 198 335 Z" fill="none" stroke="#00f0ff" strokeWidth="1.8" />
                {/* Green Hip & Knee Joints (As visible in user reference image) */}
                <line x1="165" y1="405" x2="192" y2="405" stroke="#10b981" strokeWidth="2.5" />
                <path d="M 172 345 L 188 345 L 185 390" fill="none" stroke="#ef4444" strokeWidth="1" />

                {/* Right Thigh */}
                <path d="M 225 328 L 235 405 L 208 405 L 202 335 Z" fill="none" stroke="#00f0ff" strokeWidth="1.8" />
                {/* Green Hip & Knee Joints */}
                <line x1="235" y1="405" x2="208" y2="405" stroke="#10b981" strokeWidth="2.5" />
                <path d="M 228 345 L 212 345 L 215 390" fill="none" stroke="#ef4444" strokeWidth="1" />
              </g>

              {/* Dynamic Dimension Callout Lines across Suit */}
              <g opacity="0.4" stroke="#00f0ff" strokeWidth="0.6">
                <line x1="70" y1="188" x2="160" y2="188" strokeDasharray="3 3" />
                <text x="50" y="191" fill="#00f0ff" fontSize="8" fontFamily="monospace">CORE Z-0</text>

                <line x1="240" y1="68" x2="330" y2="68" strokeDasharray="3 3" />
                <text x="335" y="71" fill="#00f0ff" fontSize="8" fontFamily="monospace">OPTIC HUD</text>
              </g>
            </svg>
          </div>

          {/* Real-Time Hover Tooltip / Status Display */}
          <div className="mt-2 text-center">
            {hoveredPart ? (
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-500/40 px-3 py-1 rounded-full animate-pulse">
                {hoveredPart}
              </span>
            ) : (
              <span className="text-xs font-mono text-cyan-400/80">
                CLICK ANY BLUEPRINT ARMOR SECTOR FOR TELEMETRY
              </span>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Exploded Arc Reactor Assembly & 3 Orthogonal Views (DWG)   */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 flex flex-col justify-between h-full space-y-6">
          
          {/* Top-Right: Exploded Arc Core Assembly with Harness (As seen in reference image) */}
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-[#030810]/70 backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono border-b border-cyan-500/20 pb-2">
              <span className="text-cyan-400 font-bold tracking-wider">ISOTOPE HOUSING UNIT</span>
              <span className="text-gray-400">DWG. #85-CORE-3D</span>
            </div>

            {/* 3D Exploded Housing & Wiring Bundle Drawing */}
            <div className="flex items-center justify-center py-1">
              <svg viewBox="0 0 180 120" className="w-44 h-28 drop-shadow-[0_0_8px_rgba(0,240,255,0.3)]">
                {/* Curved Braided Wiring Loom (Left harness) */}
                <path d="M 20 50 C 40 40, 50 75, 75 60" fill="none" stroke="#ef4444" strokeWidth="2.5" />
                <path d="M 20 58 C 42 48, 52 83, 75 68" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
                <path d="M 20 66 C 45 56, 55 90, 75 75" fill="none" stroke="#10b981" strokeWidth="1.5" />

                {/* 3D Cylindrical Core Rings */}
                <ellipse cx="110" cy="60" rx="35" ry="42" fill="#040914" stroke="#00f0ff" strokeWidth="2" />
                <ellipse cx="110" cy="60" rx="26" ry="32" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="5 3" />
                <ellipse cx="110" cy="60" rx="14" ry="18" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
                <circle cx="110" cy="60" r="5" fill="#00f0ff" />

                {/* Stator Ring Details around perimeter */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, idx) => {
                  const rad = (deg * Math.PI) / 180;
                  const x = 110 + 35 * Math.cos(rad);
                  const y = 60 + 42 * Math.sin(rad);
                  return <circle key={idx} cx={x} cy={y} r="2" fill="#10b981" />;
                })}

                {/* Technical Dimension Callout */}
                <line x1="145" y1="40" x2="175" y2="30" stroke="#00f0ff" strokeWidth="0.8" />
                <text x="145" y="24" fill="#00f0ff" fontSize="7" fontFamily="monospace">CORE #01</text>
              </svg>
            </div>

            <div className="text-[10px] text-gray-400 font-mono space-y-1">
              <div className="flex justify-between">
                <span>CONDUIT TYPE:</span>
                <span className="text-cyan-300">TRIPLE SUPERCONDUCTOR</span>
              </div>
              <div className="flex justify-between">
                <span>SHIELDING:</span>
                <span className="text-cyan-300">BORON-DOPED CARBON</span>
              </div>
            </div>
          </div>

          {/* Bottom-Right: 3 Orthogonal Views (Front, Profile, Rear) Matching Image */}
          <div 
            onClick={() => handleSelectSector('orthogonal-rear')}
            className="p-4 rounded-xl border border-cyan-500/30 bg-[#030810]/70 backdrop-blur-sm space-y-3 cursor-pointer hover:border-cyan-400 transition-all"
          >
            <div className="flex items-center justify-between text-[11px] font-mono border-b border-cyan-500/20 pb-2">
              <span className="text-cyan-400 font-bold tracking-wider">ORTHOGONAL ELEVATIONS</span>
              <span className="text-emerald-400 font-bold">FRONT · SIDE · REAR</span>
            </div>

            {/* 3 Silhouette Wireframes */}
            <div className="relative py-2">
              <svg viewBox="0 0 240 140" className="w-full h-32 drop-shadow-[0_0_6px_rgba(0,240,255,0.25)]">
                {/* 1. View A: Front Elevation */}
                <g transform="translate(10, 5)">
                  <text x="25" y="10" fill="#00f0ff" fontSize="7" textAnchor="middle" fontFamily="monospace">FRONT</text>
                  {/* Head */}
                  <ellipse cx="25" cy="20" rx="6" ry="8" fill="none" stroke="#00f0ff" strokeWidth="1" />
                  {/* Chest */}
                  <path d="M 17 28 L 33 28 L 30 55 L 20 55 Z" fill="none" stroke="#00f0ff" strokeWidth="1" />
                  <circle cx="25" cy="38" r="2.5" fill="#00f0ff" />
                  {/* Arms */}
                  <line x1="16" y1="30" x2="10" y2="65" stroke="#ef4444" strokeWidth="1" />
                  <line x1="34" y1="30" x2="40" y2="65" stroke="#ef4444" strokeWidth="1" />
                  {/* Legs */}
                  <line x1="21" y1="55" x2="18" y2="105" stroke="#00f0ff" strokeWidth="1" />
                  <line x1="29" y1="55" x2="32" y2="105" stroke="#00f0ff" strokeWidth="1" />
                  {/* Knee Callout Box (as in image) */}
                  <rect x="15" y="75" width="20" height="8" fill="rgba(255,255,255,0.2)" stroke="#ffffff" strokeWidth="0.8" />
                </g>

                {/* 2. View B: Profile (Side Elevation) */}
                <g transform="translate(85, 5)">
                  <text x="25" y="10" fill="#00f0ff" fontSize="7" textAnchor="middle" fontFamily="monospace">PROFILE</text>
                  {/* Head */}
                  <ellipse cx="25" cy="20" rx="7" ry="8" fill="none" stroke="#00f0ff" strokeWidth="1" />
                  {/* Chest Profile */}
                  <path d="M 22 28 C 34 35, 30 50, 24 55 Z" fill="none" stroke="#00f0ff" strokeWidth="1" />
                  {/* Arm */}
                  <line x1="24" y1="32" x2="22" y2="65" stroke="#ef4444" strokeWidth="1" />
                  {/* Leg */}
                  <path d="M 23 55 L 25 80 L 22 105" fill="none" stroke="#00f0ff" strokeWidth="1" />
                  {/* Knee Callout Box */}
                  <rect x="21" y="75" width="8" height="8" fill="rgba(255,255,255,0.2)" stroke="#ffffff" strokeWidth="0.8" />
                </g>

                {/* 3. View C: Dorsal (Rear Elevation) */}
                <g transform="translate(160, 5)">
                  <text x="25" y="10" fill="#00f0ff" fontSize="7" textAnchor="middle" fontFamily="monospace">DORSAL</text>
                  {/* Head */}
                  <ellipse cx="25" cy="20" rx="6" ry="8" fill="none" stroke="#00f0ff" strokeWidth="1" />
                  {/* Back Armor & Flaps */}
                  <path d="M 17 28 L 33 28 L 30 55 L 20 55 Z" fill="none" stroke="#00f0ff" strokeWidth="1" />
                  <path d="M 21 34 L 29 34 L 27 46 L 23 46 Z" fill="none" stroke="#ef4444" strokeWidth="1" />
                  {/* Arms */}
                  <line x1="16" y1="30" x2="10" y2="65" stroke="#ef4444" strokeWidth="1" />
                  <line x1="34" y1="30" x2="40" y2="65" stroke="#ef4444" strokeWidth="1" />
                  {/* Legs */}
                  <line x1="21" y1="55" x2="18" y2="105" stroke="#00f0ff" strokeWidth="1" />
                  <line x1="29" y1="55" x2="32" y2="105" stroke="#00f0ff" strokeWidth="1" />
                  {/* Knee Callout Box */}
                  <rect x="15" y="75" width="20" height="8" fill="rgba(255,255,255,0.2)" stroke="#ffffff" strokeWidth="0.8" />
                </g>
              </svg>
            </div>

            <div className="text-[10px] text-gray-400 font-mono space-y-1">
              <div className="flex justify-between">
                <span>TOTAL HEIGHT:</span>
                <span className="text-cyan-300">1.98 m (6 ft 6 in)</span>
              </div>
              <div className="flex justify-between">
                <span>TOTAL DRY WEIGHT:</span>
                <span className="text-cyan-300">102 kg (Nanoweave)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FOOTER BAR: Active Blueprint Telemetry & Tactical Controls               */}
      {/* ========================================================================= */}
      <div className="relative z-20 p-4 border-t border-cyan-500/30 bg-[#040912]/90 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Sector Telemetry Readout */}
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-tech font-bold text-sm tracking-wider">
              {currentSector.title}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              EFFICIENCY: {currentSector.efficiency}
            </span>
          </div>
          <p className="text-xs text-gray-300 font-sans">
            {currentSector.subtitle}
          </p>
          <p className="text-[11px] text-cyan-400/90 font-mono">
            {currentSector.spec}
          </p>
        </div>

        {/* Tactical Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleChargeCore}
            className="px-4 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-400/50 font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all hover:scale-[1.02]"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>CHARGE ARC CORE ({repulsorCharge}%)</span>
          </button>

          <button
            onClick={handleFireBlast}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.45)] transition-all hover:scale-[1.02]"
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>REPULSOR BLAST</span>
          </button>
        </div>
      </div>
    </div>
  );
};
