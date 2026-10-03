import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Zap, 
  RotateCcw, 
  Flame, 
  ShieldAlert, 
  Activity, 
  Check, 
  Compass, 
  Radio, 
  Layers,
  Award
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useToast } from '../context/ToastContext';

interface InfinityStone {
  id: 'space' | 'mind' | 'reality' | 'power' | 'time' | 'soul';
  name: string;
  color: string;
  glow: string;
  domain: string;
  source: string;
  isSocketed: boolean;
}

export const NanoGauntletInfinitySnap: React.FC = () => {
  const { addToast } = useToast();

  const [stones, setStones] = useState<InfinityStone[]>([
    {
      id: 'space',
      name: 'Space Stone',
      color: '#3b82f6',
      glow: 'rgba(59, 130, 246, 0.9)',
      domain: 'Subspace teleportation & wormhole control',
      source: 'The Tesseract',
      isSocketed: true,
    },
    {
      id: 'mind',
      name: 'Mind Stone',
      color: '#eab308',
      glow: 'rgba(234, 179, 8, 0.9)',
      domain: 'Neural intellect & consciousness overdrive',
      source: 'Loki\'s Scepter / Vision',
      isSocketed: true,
    },
    {
      id: 'reality',
      name: 'Reality Stone',
      color: '#ef4444',
      glow: 'rgba(239, 68, 68, 0.9)',
      domain: 'Universal matter transmutation & illusion',
      source: 'The Aether',
      isSocketed: true,
    },
    {
      id: 'power',
      name: 'Power Stone',
      color: '#a855f7',
      glow: 'rgba(168, 85, 247, 0.9)',
      domain: 'Raw cosmic destruction & planetary disintegration',
      source: 'The Orb / Ronan',
      isSocketed: true,
    },
    {
      id: 'time',
      name: 'Time Stone',
      color: '#10b981',
      glow: 'rgba(16, 185, 129, 0.9)',
      domain: 'Temporal rewind, time loops & causality shift',
      source: 'Eye of Agamotto / Dr. Strange',
      isSocketed: true,
    },
    {
      id: 'soul',
      name: 'Soul Stone',
      color: '#f97316',
      glow: 'rgba(249, 115, 22, 0.9)',
      domain: 'Universal life-force & spiritual perception',
      source: 'Vormir Altar',
      isSocketed: true,
    },
  ]);

  const [isSnapping, setIsSnapping] = useState<boolean>(false);
  const [hasSnapped, setHasSnapped] = useState<boolean>(false);
  const [gammaRadiationRad, setGammaRadiationRad] = useState<number>(4500);

  const socketedCount = stones.filter((s) => s.isSocketed).length;
  const isFullyArmed = socketedCount === 6;

  // Toggle socketing of individual stones
  const handleToggleStone = (id: string) => {
    soundFx.playHudBeep('mode');
    setStones((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isSocketed: !s.isSocketed } : s))
    );
  };

  // Trigger The Legendary Snap ("And I... am... Iron Man.")
  const handleCosmicSnap = () => {
    if (!isFullyArmed || isSnapping) return;

    setIsSnapping(true);
    soundFx.playArcReactorPulse();
    soundFx.playRepulsorCharge();

    jarvisVoice.speak('And I... am... Iron Man.');

    setTimeout(() => {
      soundFx.playRepulsorBlast();
      setIsSnapping(false);
      setHasSnapped(true);
      setGammaRadiationRad(12800);

      addToast({
        title: 'COSMIC SNAP EXECUTED',
        message: 'All hostile forces disintegrated across the galaxy. Universe saved.',
        type: 'alert',
      });
    }, 1600);
  };

  // Reset or Time Stone Rewind
  const handleRewindTime = () => {
    soundFx.playHudBeep('confirm');
    setHasSnapped(false);
    setGammaRadiationRad(4500);
    jarvisVoice.speak('Time Stone temporal loop engaged. Causality continuum restored to baseline.');
    addToast({
      title: 'Temporal Loop Restored',
      message: 'Time Stone reversed all gamma trauma.',
      type: 'protocol',
    });
  };

  return (
    <div className={`bg-gray-950/90 border border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md relative min-h-[640px] flex flex-col p-4 gap-4 select-none transition-all ${
      hasSnapped ? 'ring-4 ring-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.6)]' : ''
    }`}>
      <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

      {/* Cosmic Blinding Flash effect during snap */}
      {isSnapping && (
        <div className="absolute inset-0 bg-white animate-pulse z-50 pointer-events-none opacity-90 transition-opacity" />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-amber-500 to-amber-700 flex items-center justify-center text-white shadow-[0_0_20px_rgba(245,158,11,0.6)] border border-amber-400">
            <Sparkles className="w-5 h-5 animate-pulse text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tech text-base font-bold text-amber-200 tracking-wider">
                MARK LXXXV // NANO GAUNTLET INFINITY SNAP
              </h2>
              <span className={`text-[10px] font-mono-tech px-2 py-0.5 rounded border uppercase font-bold ${
                isFullyArmed
                  ? 'bg-amber-950 text-amber-300 border-amber-400 animate-pulse'
                  : 'bg-gray-900 text-gray-400 border-gray-800'
              }`}>
                STONES: {socketedCount} / 6 SOCKETED
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans">
              Harness the 6 Infinity Stones into Tony Stark's Mark 85 nanotech gauntlet to execute the cosmic snap
            </p>
          </div>
        </div>

        {/* Status / Reset */}
        <div className="flex items-center gap-2">
          {hasSnapped && (
            <button
              onClick={handleRewindTime}
              className="py-2 px-3.5 rounded-xl bg-emerald-950 border border-emerald-400 hover:bg-emerald-900 text-emerald-300 font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>TIME STONE REWIND</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Gauntlet & Stones Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
        
        {/* Left Column: Nano Gauntlet Housing & The Snap Trigger (8 Cols) */}
        <div className="lg:col-span-8 bg-gray-950/95 border border-amber-500/30 rounded-2xl relative overflow-hidden flex flex-col justify-between p-6 min-h-[460px] shadow-inner">
          
          {/* Top Cosmic Telemetry */}
          <div className="w-full flex items-center justify-between text-xs font-mono-tech border-b border-gray-800 pb-2">
            <span className="text-gray-400">CHASSIS: SMART NANITE VIBRANIUM MATRIX</span>
            <span className="text-amber-400 font-bold">
              GAMMA OUTPUT: {gammaRadiationRad.toLocaleString()} RADS
            </span>
          </div>

          {/* Center Graphic: The 6 Infinity Stones Array */}
          <div className="my-auto flex flex-col items-center gap-4 text-center">
            
            {/* The 6 Sockets Ring */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Central Palm Stone Socket (Mind Stone) */}
              <div 
                className="w-16 h-16 rounded-full border-2 flex items-center justify-center relative cursor-pointer shadow-2xl transition-all duration-300"
                style={{
                  backgroundColor: stones[1].isSocketed ? `${stones[1].color}33` : '#111827',
                  borderColor: stones[1].isSocketed ? stones[1].color : '#374151',
                  boxShadow: stones[1].isSocketed ? `0 0 25px ${stones[1].glow}` : 'none',
                }}
                onClick={() => handleToggleStone('mind')}
              >
                <div 
                  className={`w-8 h-8 rounded-full ${stones[1].isSocketed ? 'animate-pulse' : 'opacity-20'}`}
                  style={{ backgroundColor: stones[1].color }}
                />
              </div>

              {/* 5 Finger / Knuckle Stone Sockets placed in arc */}
              {[stones[0], stones[2], stones[3], stones[4], stones[5]].map((st, idx) => {
                const angleDeg = -140 + idx * 70;
                const angleRad = (angleDeg * Math.PI) / 180;
                const radius = 95;
                const x = Math.round(radius * Math.cos(angleRad));
                const y = Math.round(radius * Math.sin(angleRad));

                return (
                  <div
                    key={st.id}
                    onClick={() => handleToggleStone(st.id)}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                      backgroundColor: st.isSocketed ? `${st.color}33` : '#111827',
                      borderColor: st.isSocketed ? st.color : '#374151',
                      boxShadow: st.isSocketed ? `0 0 20px ${st.glow}` : 'none',
                    }}
                    className="absolute w-12 h-12 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-110"
                  >
                    <div 
                      className={`w-6 h-6 rounded-full ${st.isSocketed ? 'animate-pulse' : 'opacity-20'}`}
                      style={{ backgroundColor: st.color }}
                    />
                  </div>
                );
              })}

              {/* Lightning Gamma Veins */}
              {isFullyArmed && (
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/40 animate-spin-slow pointer-events-none" />
              )}
            </div>

            <div>
              <span className="text-xs font-mono-tech text-amber-400 font-bold tracking-widest uppercase">
                {hasSnapped ? 'THE DECISIVE MOMENT // REALITY ANCHORED' : 'MARK 85 NANO GAUNTLET HOUSING'}
              </span>
              <h3 className="font-tech text-2xl font-bold text-white tracking-widest mt-0.5">
                {hasSnapped ? '"AND I... AM... IRON MAN."' : 'COSMIC GAMMA MATRIX'}
              </h3>
              <p className="text-xs text-gray-400 font-sans max-w-md mt-1 leading-relaxed">
                {hasSnapped
                  ? 'All 6 Infinity Stones discharged simultaneously. Hostile armada reduced to ash.'
                  : 'Click any stone to socket or eject. When all 6 stones are locked, activate the cosmic snap!'}
              </p>
            </div>
          </div>

          {/* Bottom Snap Action Button */}
          <div className="w-full flex justify-center pt-2">
            <button
              onClick={handleCosmicSnap}
              disabled={!isFullyArmed || isSnapping}
              className={`py-3.5 px-8 rounded-2xl font-tech font-bold text-sm tracking-widest uppercase flex items-center gap-2.5 cursor-pointer shadow-2xl transition-all ${
                isFullyArmed
                  ? 'bg-gradient-to-r from-red-600 via-amber-500 to-amber-600 hover:scale-105 active:scale-95 text-white shadow-[0_0_35px_rgba(245,158,11,0.8)]'
                  : 'bg-gray-900 border border-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-5 h-5 text-amber-200 animate-spin-slow" />
              <span>{isFullyArmed ? 'EXECUTE THE INFINITY SNAP' : 'SOCKET ALL 6 STONES TO SNAP'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Stones Dossier & Powers (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="bg-gray-900/90 border border-amber-500/20 rounded-xl p-3.5 flex flex-col gap-2.5">
            <span className="font-tech text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-800 pb-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>THE 6 INFINITY STONES DOSSIER</span>
            </span>

            <div className="space-y-2">
              {stones.map((st) => (
                <div
                  key={st.id}
                  onClick={() => handleToggleStone(st.id)}
                  className={`p-2.5 rounded-xl border text-xs font-mono-tech cursor-pointer transition-all flex items-start gap-2.5 ${
                    st.isSocketed
                      ? 'bg-gray-950 border-gray-700 text-white'
                      : 'bg-gray-950/40 border-gray-900 text-gray-500 opacity-60'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full mt-0.5 shrink-0"
                    style={{
                      backgroundColor: st.color,
                      boxShadow: st.isSocketed ? `0 0 10px ${st.glow}` : 'none',
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-tech font-bold text-white tracking-wider">
                        {st.name}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                        st.isSocketed ? 'bg-amber-950 text-amber-300 border border-amber-500/40' : 'text-gray-600'
                      }`}>
                        {st.isSocketed ? 'SOCKETED' : 'EJECTED'}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-sans mt-0.5 leading-snug">
                      {st.domain}
                    </p>
                    <span className="text-[9px] text-gray-500 block mt-0.5">
                      ORIGIN: {st.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
