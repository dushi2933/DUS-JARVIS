import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Flame, 
  ShieldCheck, 
  Crosshair, 
  Activity, 
  Layers, 
  Gauge, 
  Sparkles,
  ChevronRight,
  Sliders,
  AlertTriangle
} from 'lucide-react';
import { GauntletState, MarkProfile } from '../types/gauntlet';
import { soundFx } from '../utils/audioEffects';

interface GauntletHologramProps {
  gauntletState: GauntletState;
  markProfile: MarkProfile;
  onChargeRepulsor: (level: number) => void;
  onFireRepulsor: () => void;
  onToggleMissileBay: () => void;
  onLaunchMissile: () => void;
  onServoMove: (finger: 'thumb' | 'index' | 'middle' | 'ring' | 'pinky', angle: number) => void;
}

export const GauntletHologram: React.FC<GauntletHologramProps> = ({
  gauntletState,
  markProfile,
  onChargeRepulsor,
  onFireRepulsor,
  onToggleMissileBay,
  onLaunchMissile,
  onServoMove,
}) => {
  const [activeFingerHover, setActiveFingerHover] = useState<string | null>(null);
  const [chargeHoldInterval, setChargeHoldInterval] = useState<any>(null);

  // Stop hold charging on unmount
  useEffect(() => {
    return () => {
      if (chargeHoldInterval) clearInterval(chargeHoldInterval);
    };
  }, [chargeHoldInterval]);

  const startHoldCharge = () => {
    soundFx.playRepulsorCharge(2000);
    const interval = setInterval(() => {
      onChargeRepulsor(Math.min(100, gauntletState.repulsorCharge + 8));
    }, 120);
    setChargeHoldInterval(interval);
  };

  const stopHoldCharge = () => {
    if (chargeHoldInterval) {
      clearInterval(chargeHoldInterval);
      setChargeHoldInterval(null);
    }
  };

  // Color mappings based on Mark profile
  const primaryColor = markProfile.primaryColor;
  const accentColor = markProfile.accentColor;
  const glowColor = markProfile.glowColor;

  return (
    <div className="bg-gray-900/60 border border-cyan-500/20 rounded-xl p-4 flex flex-col backdrop-blur-sm relative overflow-hidden">
      {/* Background Hologram grid */}
      <div className="absolute inset-0 holo-grid opacity-30 pointer-events-none" />

      {/* Screen Shake & Flash when Repulsor Fires */}
      {gauntletState.isFiring && (
        <div className="absolute inset-0 bg-cyan-300/30 backdrop-blur-sm z-30 pointer-events-none animate-ping" />
      )}

      {/* Top Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-cyan-500/20 pb-3 mb-3 gap-2 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-tech text-xs tracking-wider text-amber-400 uppercase font-bold">
              {markProfile.name}
            </span>
            <span className="text-gray-600 text-xs">/</span>
            <span className="text-xs text-cyan-300 font-mono-tech">
              GAUNTLET SCHEMATIC
            </span>
          </div>
          <p className="text-xs text-gray-400 font-sans">
            {markProfile.subtitle}
          </p>
        </div>

        {/* Telemetry Stats: Charge, Heat, Hull */}
        <div className="flex items-center gap-4 text-xs font-mono-tech">
          {/* Repulsor Charge */}
          <div className="flex items-center gap-1.5 bg-gray-950/60 px-2.5 py-1 rounded border border-cyan-500/30">
            <Zap className={`w-3.5 h-3.5 ${gauntletState.repulsorCharge > 0 ? 'text-cyan-400 animate-pulse' : 'text-gray-500'}`} />
            <span className="text-gray-400">CHARGE:</span>
            <span className="text-cyan-300 font-bold">{gauntletState.repulsorCharge}%</span>
          </div>

          {/* Temperature */}
          <div className="flex items-center gap-1.5 bg-gray-950/60 px-2.5 py-1 rounded border border-gray-800">
            <Flame className={`w-3.5 h-3.5 ${gauntletState.temperatureKelvin > 450 ? 'text-amber-400 animate-bounce' : 'text-gray-400'}`} />
            <span className="text-gray-400">CORE:</span>
            <span className={gauntletState.temperatureKelvin > 450 ? 'text-amber-300 font-bold' : 'text-gray-200'}>
              {gauntletState.temperatureKelvin} K
            </span>
          </div>

          {/* Armor Integrity */}
          <div className="flex items-center gap-1.5 bg-gray-950/60 px-2.5 py-1 rounded border border-gray-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-gray-400">HULL:</span>
            <span className="text-emerald-400 font-bold">{gauntletState.armorIntegrity}%</span>
          </div>
        </div>
      </div>

      {/* Main Holographic Gauntlet Visualization Area */}
      <div className="relative flex-1 min-h-[340px] flex items-center justify-center py-2 relative z-10">
        {/* Hologram Reticle Circles */}
        <div className="absolute w-72 h-72 rounded-full border border-cyan-500/20 animate-spin-slow pointer-events-none" />
        <div className="absolute w-84 h-84 rounded-full border border-dashed border-amber-500/15 animate-spin-reverse-slow pointer-events-none" />

        {/* SVG Gauntlet Schematic */}
        <svg
          viewBox="0 0 500 580"
          className="w-full max-w-[380px] h-auto drop-shadow-[0_0_20px_rgba(6,182,212,0.25)] select-none"
        >
          <defs>
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="armorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.95" />
              <stop offset="50%" stopColor={primaryColor} stopOpacity="0.75" />
              <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="50%" stopColor="#fef08a" />
              <stop offset="100%" stopColor={accentColor} />
            </linearGradient>
          </defs>

          {/* 1. Forearm Main Armor Shell */}
          <path
            d="M 160 560 L 340 560 L 375 390 L 125 390 Z"
            fill="url(#armorGradient)"
            stroke={accentColor}
            strokeWidth="2.5"
            opacity="0.9"
          />

          {/* Forearm Heat Exchanger Vent Slits */}
          <line x1="175" y1="440" x2="325" y2="440" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="6 4" opacity="0.7" />
          <line x1="185" y1="470" x2="315" y2="470" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="6 4" opacity="0.7" />
          <line x1="195" y1="500" x2="305" y2="500" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="6 4" opacity="0.7" />
          <line x1="205" y1="530" x2="295" y2="530" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="6 4" opacity="0.7" />

          {/* 2. Wrist Articulation & Micro-Missile Pod */}
          <path
            d="M 130 388 L 370 388 L 385 330 L 115 330 Z"
            fill="#18181b"
            stroke={accentColor}
            strokeWidth="2"
          />

          {/* Micro-Missile Bay Interactive Actuator */}
          <g
            onClick={() => {
              soundFx.playHudBeep('mode');
              onToggleMissileBay();
            }}
            className="cursor-pointer group"
          >
            <rect
              x="180"
              y="342"
              width="140"
              height="36"
              rx="4"
              fill={gauntletState.missileBayOpen ? '#450a0a' : '#030712'}
              stroke={gauntletState.missileBayOpen ? '#ef4444' : '#0ea5e9'}
              strokeWidth="2"
              className="transition-all"
            />
            <text
              x="250"
              y="364"
              textAnchor="middle"
              fill={gauntletState.missileBayOpen ? '#fca5a5' : '#7dd3fc'}
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {gauntletState.missileBayOpen ? `[POD ARMED: ${gauntletState.missileCount}/6]` : '[MISSILE POD]'}
            </text>

            {/* Individual Missiles inside pod when open */}
            {gauntletState.missileBayOpen && (
              <g>
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <circle
                    key={idx}
                    cx={195 + idx * 22}
                    cy="360"
                    r="4"
                    fill={idx < gauntletState.missileCount ? '#ef4444' : '#374151'}
                    stroke="#fee2e2"
                    strokeWidth="1"
                  />
                ))}
              </g>
            )}
          </g>

          {/* 3. Palm Base Plate */}
          <path
            d="M 120 328 L 380 328 L 405 195 L 95 195 Z"
            fill="url(#armorGradient)"
            stroke={accentColor}
            strokeWidth="3"
          />

          {/* Lateral Gold Guard Plates */}
          <path d="M 95 195 L 125 328 L 105 328 L 80 205 Z" fill="url(#goldAccent)" />
          <path d="M 405 195 L 375 328 L 395 328 L 420 205 Z" fill="url(#goldAccent)" />

          {/* 4. Articulated Finger Servos */}
          {/* Thumb */}
          <g
            onClick={() => {
              soundFx.playServoMove();
              onServoMove('thumb', (gauntletState.servoAngles.thumb + 30) % 90);
            }}
            className="cursor-pointer"
            onMouseEnter={() => setActiveFingerHover('thumb')}
            onMouseLeave={() => setActiveFingerHover(null)}
          >
            <path
              d="M 100 240 L 40 185 L 60 150 L 115 195 Z"
              fill={activeFingerHover === 'thumb' ? accentColor : 'url(#goldAccent)'}
              stroke="#78350f"
              strokeWidth="2"
              transform={`rotate(${gauntletState.servoAngles.thumb * 0.2}, 100, 240)`}
              className="transition-transform duration-200"
            />
            <circle cx="80" cy="195" r="5" fill="#0ea5e9" opacity="0.8" />
          </g>

          {/* Index Finger */}
          <g
            onClick={() => {
              soundFx.playServoMove();
              onServoMove('index', (gauntletState.servoAngles.index + 30) % 90);
            }}
            className="cursor-pointer"
            onMouseEnter={() => setActiveFingerHover('index')}
            onMouseLeave={() => setActiveFingerHover(null)}
          >
            <path
              d="M 125 190 L 135 60 L 175 60 L 175 190 Z"
              fill={activeFingerHover === 'index' ? accentColor : 'url(#goldAccent)'}
              stroke="#78350f"
              strokeWidth="2"
              transform={`translate(0, ${gauntletState.servoAngles.index * 0.15})`}
              className="transition-transform duration-200"
            />
            <line x1="130" y1="120" x2="170" y2="120" stroke="#78350f" strokeWidth="2" />
            <circle cx="150" cy="120" r="3" fill="#0ea5e9" />
          </g>

          {/* Middle Finger */}
          <g
            onClick={() => {
              soundFx.playServoMove();
              onServoMove('middle', (gauntletState.servoAngles.middle + 30) % 90);
            }}
            className="cursor-pointer"
            onMouseEnter={() => setActiveFingerHover('middle')}
            onMouseLeave={() => setActiveFingerHover(null)}
          >
            <path
              d="M 195 190 L 205 35 L 250 35 L 255 190 Z"
              fill={activeFingerHover === 'middle' ? accentColor : 'url(#goldAccent)'}
              stroke="#78350f"
              strokeWidth="2"
              transform={`translate(0, ${gauntletState.servoAngles.middle * 0.15})`}
              className="transition-transform duration-200"
            />
            <line x1="200" y1="110" x2="250" y2="110" stroke="#78350f" strokeWidth="2" />
            <circle cx="227" cy="110" r="3" fill="#0ea5e9" />
          </g>

          {/* Ring Finger */}
          <g
            onClick={() => {
              soundFx.playServoMove();
              onServoMove('ring', (gauntletState.servoAngles.ring + 30) % 90);
            }}
            className="cursor-pointer"
            onMouseEnter={() => setActiveFingerHover('ring')}
            onMouseLeave={() => setActiveFingerHover(null)}
          >
            <path
              d="M 275 190 L 285 65 L 325 65 L 325 190 Z"
              fill={activeFingerHover === 'ring' ? accentColor : 'url(#goldAccent)'}
              stroke="#78350f"
              strokeWidth="2"
              transform={`translate(0, ${gauntletState.servoAngles.ring * 0.15})`}
              className="transition-transform duration-200"
            />
            <line x1="280" y1="125" x2="320" y2="125" stroke="#78350f" strokeWidth="2" />
            <circle cx="300" cy="125" r="3" fill="#0ea5e9" />
          </g>

          {/* Pinky Finger */}
          <g
            onClick={() => {
              soundFx.playServoMove();
              onServoMove('pinky', (gauntletState.servoAngles.pinky + 30) % 90);
            }}
            className="cursor-pointer"
            onMouseEnter={() => setActiveFingerHover('pinky')}
            onMouseLeave={() => setActiveFingerHover(null)}
          >
            <path
              d="M 345 195 L 360 95 L 395 105 L 380 205 Z"
              fill={activeFingerHover === 'pinky' ? accentColor : 'url(#goldAccent)'}
              stroke="#78350f"
              strokeWidth="2"
              transform={`translate(0, ${gauntletState.servoAngles.pinky * 0.15})`}
              className="transition-transform duration-200"
            />
            <line x1="355" y1="145" x2="385" y2="150" stroke="#78350f" strokeWidth="2" />
            <circle cx="370" cy="148" r="3" fill="#0ea5e9" />
          </g>

          {/* 5. Center Palm Arc Repulsor Emitter (Interactive Core) */}
          <g
            onClick={() => {
              if (gauntletState.repulsorCharge >= 20) {
                onFireRepulsor();
              } else {
                soundFx.playRepulsorCharge();
                onChargeRepulsor(100);
              }
            }}
            className="cursor-pointer group"
          >
            {/* Outer Capacitor Housing */}
            <circle cx="250" cy="265" r="54" fill="#030712" stroke={accentColor} strokeWidth="3" />

            {/* Glowing Charge Ring */}
            <circle
              cx="250"
              cy="265"
              r="48"
              fill="none"
              stroke={glowColor}
              strokeWidth="4"
              strokeDasharray={`${(gauntletState.repulsorCharge / 100) * 300} 300`}
              strokeLinecap="round"
              className="transition-all duration-300"
            />

            {/* Repulsor Core Internal Matrix */}
            <circle
              cx="250"
              cy="265"
              r="40"
              fill={gauntletState.repulsorCharge > 0 ? glowColor : '#0f172a'}
              opacity={0.3 + (gauntletState.repulsorCharge / 100) * 0.7}
              filter={gauntletState.repulsorCharge > 40 ? 'url(#glowEffect)' : undefined}
            />

            {/* Bright Center Plasma Bead */}
            <circle
              cx="250"
              cy="265"
              r={12 + (gauntletState.repulsorCharge / 100) * 16}
              fill="#ffffff"
              filter={gauntletState.repulsorCharge > 0 ? 'drop-shadow(0 0 12px #38bdf8)' : undefined}
              className="transition-all duration-200"
            />

            {/* Plasma Discharge Spokes */}
            <line x1="250" y1="225" x2="250" y2="305" stroke="#0284c7" strokeWidth="2" />
            <line x1="210" y1="265" x2="290" y2="265" stroke="#0284c7" strokeWidth="2" />
            <line x1="222" y1="237" x2="278" y2="293" stroke="#0284c7" strokeWidth="2" />
            <line x1="222" y1="293" x2="278" y2="237" stroke="#0284c7" strokeWidth="2" />

            <circle cx="250" cy="265" r="10" fill="#ffffff" />
          </g>

          {/* Firing Shockwave Rings (Animated Blast Effect) */}
          {gauntletState.isFiring && (
            <g>
              <circle cx="250" cy="265" r="90" fill="none" stroke="#ffffff" strokeWidth="6" opacity="0.9" className="animate-ping" />
              <circle cx="250" cy="265" r="140" fill="none" stroke="#38bdf8" strokeWidth="4" opacity="0.7" className="animate-ping" />
              <circle cx="250" cy="265" r="200" fill="none" stroke="#eab308" strokeWidth="3" opacity="0.5" className="animate-ping" />
            </g>
          )}
        </svg>

        {/* Hover / Tap Hint */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono-tech text-gray-500">
          <span>[CLICK FINGERS TO ARTICULATE]</span>
          <span>[CLICK PALM TO DISCHARGE]</span>
        </div>
      </div>

      {/* Gauntlet Tactical Control Triggers */}
      <div className="border-t border-cyan-500/20 pt-3 mt-2 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        {/* Hold or Tap to Charge Repulsors */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onMouseDown={startHoldCharge}
            onMouseUp={stopHoldCharge}
            onTouchStart={startHoldCharge}
            onTouchEnd={stopHoldCharge}
            onClick={() => onChargeRepulsor(100)}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 hover:border-cyan-300 text-cyan-300 font-tech font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>CHARGE REPULSOR</span>
          </button>

          {/* Instant 100% Quick Prime */}
          <button
            onClick={() => {
              soundFx.playRepulsorCharge(800);
              onChargeRepulsor(100);
            }}
            className="px-2.5 py-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-mono-tech cursor-pointer"
            title="Instant Full Capacitor Charge"
          >
            100%
          </button>
        </div>

        {/* Big Concussive DISCHARGE / FIRE Button */}
        <button
          onClick={onFireRepulsor}
          disabled={gauntletState.repulsorCharge === 0 || gauntletState.isFiring}
          className={`w-full sm:w-auto px-6 py-2 rounded-lg font-tech font-bold text-sm tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer ${
            gauntletState.repulsorCharge > 0
              ? 'bg-red-600 hover:bg-red-500 text-white glow-arc-red active:scale-95'
              : 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-300" />
          <span>FIRE REPULSOR BLAST</span>
        </button>

        {/* Micro-Missile Launch Button */}
        <button
          onClick={onLaunchMissile}
          disabled={gauntletState.missileCount === 0}
          className={`w-full sm:w-auto px-3.5 py-2 rounded-lg border font-tech font-semibold text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            gauntletState.missileCount > 0
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/40'
              : 'bg-gray-800/40 border-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          <Crosshair className="w-4 h-4 text-amber-400" />
          <span>LAUNCH MISSILE ({gauntletState.missileCount})</span>
        </button>
      </div>
    </div>
  );
};
