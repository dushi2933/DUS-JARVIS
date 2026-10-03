import React, { useState, useEffect } from 'react';
import { 
  Crosshair, 
  ShieldAlert, 
  Flame, 
  Radio, 
  Zap, 
  Activity, 
  Target, 
  RefreshCw, 
  Award,
  Sparkles,
  Plane
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useToast } from '../context/ToastContext';

interface Bogey {
  id: string;
  name: string;
  type: 'F22_RAPTOR' | 'CHITAURI' | 'HAMMER_DRONE' | 'OUTRIDER';
  distanceKm: number;
  bearingDeg: number;
  mach: number;
  isLocked: boolean;
  isDestroyed: boolean;
}

export const DogfightRadarSimulator: React.FC = () => {
  const { addToast } = useToast();

  const [bogeys, setBogeys] = useState<Bogey[]>([
    {
      id: 'b1',
      name: 'WHIPLASH-1 (F-22)',
      type: 'F22_RAPTOR',
      distanceKm: 8.4,
      bearingDeg: 35,
      mach: 1.8,
      isLocked: false,
      isDestroyed: false,
    },
    {
      id: 'b2',
      name: 'CHITAURI CHARIOT-ALPHA',
      type: 'CHITAURI',
      distanceKm: 4.2,
      bearingDeg: 120,
      mach: 2.4,
      isLocked: true,
      isDestroyed: false,
    },
    {
      id: 'b3',
      name: 'HAMMER DRONE MK-II',
      type: 'HAMMER_DRONE',
      distanceKm: 6.8,
      bearingDeg: 215,
      mach: 1.2,
      isLocked: false,
      isDestroyed: false,
    },
    {
      id: 'b4',
      name: 'OUTRIDER SKIFF',
      type: 'OUTRIDER',
      distanceKm: 12.1,
      bearingDeg: 310,
      mach: 2.9,
      isLocked: false,
      isDestroyed: false,
    },
  ]);

  const [score, setScore] = useState<number>(0);
  const [flaresLeft, setFlaresLeft] = useState<number>(4);
  const [isDeployingFlares, setIsDeployingFlares] = useState<boolean>(false);

  // Lock target
  const handleLockTarget = (id: string) => {
    soundFx.playHudBeep('alert');
    setBogeys((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isLocked: !b.isLocked } : b))
    );
  };

  // Fire Micro-Missiles at locked targets
  const handleFireMissiles = () => {
    const locked = bogeys.filter((b) => b.isLocked && !b.isDestroyed);
    if (locked.length === 0) {
      jarvisVoice.speak('No target locked, Mr. Stark. Tap a radar contact to acquire missile lock.');
      return;
    }

    soundFx.playMissileLaunch();
    soundFx.playRepulsorBlast();

    setBogeys((prev) =>
      prev.map((b) => (b.isLocked ? { ...b, isDestroyed: true, isLocked: false } : b))
    );

    setScore((s) => s + locked.length * 500);
    jarvisVoice.speak(`Splash ${locked.length}! Hostile signature neutralized, Sir.`);

    addToast({
      title: 'Target Splash Confirmed!',
      message: `${locked.length} hostile craft eliminated via micro-missile salvo.`,
      type: 'tactical',
    });
  };

  // Deploy Countermeasure Flares
  const handleDeployFlares = () => {
    if (flaresLeft <= 0 || isDeployingFlares) return;
    setIsDeployingFlares(true);
    setFlaresLeft((f) => f - 1);
    soundFx.playRepulsorBlast();
    jarvisVoice.speak('Countermeasure magnesium flares deployed. Heat-seeking locks spoofed.');

    setTimeout(() => {
      setIsDeployingFlares(false);
    }, 1200);

    addToast({
      title: 'Magnesium Flares Deployed',
      message: 'All incoming missile radar locks deflected.',
      type: 'protocol',
    });
  };

  // Respawn / Scramble Radar
  const handleScrambleRadar = () => {
    soundFx.playHudBeep('mode');
    setBogeys([
      {
        id: `b-${Date.now()}-1`,
        name: 'CHITAURI CHARIOT-BRAVO',
        type: 'CHITAURI',
        distanceKm: +(3 + Math.random() * 8).toFixed(1),
        bearingDeg: Math.floor(Math.random() * 360),
        mach: 2.2,
        isLocked: false,
        isDestroyed: false,
      },
      {
        id: `b-${Date.now()}-2`,
        name: 'F-22 RAPTOR INTERCEPT',
        type: 'F22_RAPTOR',
        distanceKm: +(5 + Math.random() * 7).toFixed(1),
        bearingDeg: Math.floor(Math.random() * 360),
        mach: 1.9,
        isLocked: false,
        isDestroyed: false,
      },
      {
        id: `b-${Date.now()}-3`,
        name: 'HAMMER COMBAT DRONE',
        type: 'HAMMER_DRONE',
        distanceKm: +(4 + Math.random() * 6).toFixed(1),
        bearingDeg: Math.floor(Math.random() * 360),
        mach: 1.4,
        isLocked: true,
        isDestroyed: false,
      },
    ]);
    jarvisVoice.speak('Radar sweeping fresh combat sector. New bogeys identified on tactical grid.');
  };

  return (
    <div className="bg-gray-950/90 border border-emerald-500/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md relative min-h-[640px] flex flex-col p-4 gap-4 select-none">
      <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-400 flex items-center justify-center text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            <Crosshair className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tech text-base font-bold text-emerald-200 tracking-wider">
                TACTICAL DOGFIGHT RADAR & BOGEY INTERCEPT
              </h2>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded border border-emerald-500/40 bg-emerald-950/80 text-emerald-300 uppercase font-bold animate-pulse">
                RWR: 360° SWEEP LIVE
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans">
              Air combat radar scope, bogey missile lock-on, countermeasure flares, and Mach 3 dogfight scoring
            </p>
          </div>
        </div>

        {/* Combat Score & Scramble */}
        <div className="flex items-center gap-2">
          <div className="bg-gray-900 px-3 py-1.5 rounded-xl border border-gray-800 text-xs font-mono-tech text-amber-300 font-bold">
            COMBAT SCORE: {score.toLocaleString()} PTS
          </div>
          <button
            onClick={handleScrambleRadar}
            className="p-2 rounded-xl bg-gray-900 border border-gray-800 hover:border-emerald-400 text-gray-300 cursor-pointer"
            title="Scramble new sector contacts"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Radar Screen Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
        
        {/* Left Column: 360° Circular Radar Sweeping Screen (8 Cols) */}
        <div className="lg:col-span-8 bg-gray-950/95 border border-emerald-500/30 rounded-2xl relative overflow-hidden flex flex-col items-center justify-between p-6 min-h-[460px] shadow-inner">
          
          {/* Top Compass Header */}
          <div className="w-full flex items-center justify-between text-xs font-mono-tech border-b border-gray-800 pb-2">
            <span className="text-emerald-400 font-bold">RADAR RANGE: 15 KM RADIUS</span>
            <span className="text-gray-400">FLARES REMAINING: {flaresLeft} / 4</span>
          </div>

          {/* Center 360° Radar Scope */}
          <div className="relative w-80 h-80 rounded-full border-2 border-emerald-500/50 bg-emerald-950/20 flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.3)] my-auto">
            {/* Concentric distance rings */}
            <div className="absolute w-60 h-60 rounded-full border border-emerald-500/30" />
            <div className="absolute w-40 h-40 rounded-full border border-emerald-500/20" />
            <div className="absolute w-20 h-20 rounded-full border border-emerald-500/20" />
            <div className="absolute w-full h-0.5 bg-emerald-500/30" />
            <div className="absolute h-full w-0.5 bg-emerald-500/30" />

            {/* Rotating Radar Sweeping Beam */}
            <div 
              className="absolute inset-0 rounded-full animate-spin-slow pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg at 50% 50%, rgba(16, 185, 129, 0.4) 0deg, transparent 60deg, transparent 360deg)',
              }}
            />

            {/* Iron Man Center Position */}
            <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] flex items-center justify-center relative z-20">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>

            {/* Bogeys plotted on Radar Scope */}
            {bogeys.map((b) => {
              if (b.isDestroyed) return null;
              const angleRad = ((b.bearingDeg - 90) * Math.PI) / 180;
              const radiusPx = (b.distanceKm / 15) * 140;
              const x = Math.round(radiusPx * Math.cos(angleRad));
              const y = Math.round(radiusPx * Math.sin(angleRad));

              return (
                <div
                  key={b.id}
                  onClick={() => handleLockTarget(b.id)}
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                  className="absolute cursor-pointer flex flex-col items-center group z-30 transition-transform hover:scale-125"
                >
                  <div className={`w-6 h-6 rounded flex items-center justify-center border ${
                    b.isLocked
                      ? 'bg-red-950 border-red-500 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse'
                      : 'bg-emerald-950 border-emerald-400 text-emerald-400'
                  }`}>
                    <Target className="w-4 h-4" />
                  </div>
                  <span className="text-[8px] font-mono-tech px-1 rounded bg-black/80 text-white mt-0.5 whitespace-nowrap border border-gray-800">
                    {b.name.slice(0, 10)} · {b.distanceKm}km
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom Combat Action Buttons */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleFireMissiles}
              className="py-3 px-5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:scale-105 active:scale-95 text-white font-tech font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all"
            >
              <Crosshair className="w-4 h-4" />
              <span>FIRE MISSILE SALVO AT LOCKED CONTACTS</span>
            </button>

            <button
              onClick={handleDeployFlares}
              disabled={flaresLeft <= 0}
              className="py-3 px-5 rounded-xl bg-gray-900 border border-amber-500 hover:border-amber-400 text-amber-300 font-tech font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all disabled:opacity-50"
            >
              <Flame className="w-4 h-4" />
              <span>DEPLOY COUNTERMEASURE FLARES ({flaresLeft} LEFT)</span>
            </button>
          </div>
        </div>

        {/* Right Column: Radar Warning Receiver & Bogey Dossier (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="bg-gray-900/90 border border-emerald-500/20 rounded-xl p-3.5 flex flex-col gap-2.5">
            <span className="font-tech text-xs font-bold text-emerald-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-800 pb-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>RADAR WARNING RECEIVER (RWR)</span>
            </span>

            <div className="space-y-2">
              {bogeys.map((b) => (
                <div
                  key={b.id}
                  onClick={() => handleLockTarget(b.id)}
                  className={`p-2.5 rounded-xl border text-xs font-mono-tech cursor-pointer transition-all flex items-center justify-between ${
                    b.isDestroyed
                      ? 'bg-gray-950/40 border-gray-900 text-gray-600 opacity-40 line-through'
                      : b.isLocked
                      ? 'bg-red-950/80 border-red-500 text-white shadow-md'
                      : 'bg-gray-950 border-gray-800 text-gray-300 hover:border-gray-700'
                  }`}
                >
                  <div>
                    <div className="font-tech font-bold text-xs text-white">{b.name}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      DIST: {b.distanceKm} KM · BRG: {b.bearingDeg}° · MACH {b.mach}
                    </div>
                  </div>

                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold border ${
                    b.isDestroyed
                      ? 'text-gray-600 border-gray-800'
                      : b.isLocked
                      ? 'bg-red-600 text-white border-red-400 animate-pulse'
                      : 'bg-gray-900 text-gray-400 border-gray-800'
                  }`}>
                    {b.isDestroyed ? 'SPLASH' : b.isLocked ? 'LOCKED' : 'TRACKING'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
