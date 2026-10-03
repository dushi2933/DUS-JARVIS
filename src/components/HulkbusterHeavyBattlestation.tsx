import React, { useState } from 'react';
import { 
  Zap, 
  ShieldAlert, 
  Activity, 
  RotateCcw, 
  Flame, 
  Layers, 
  RefreshCw, 
  Radio, 
  CheckCircle2, 
  AlertTriangle,
  Cpu,
  Hammer
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useToast } from '../context/ToastContext';

export const HulkbusterHeavyBattlestation: React.FC = () => {
  const { addToast } = useToast();

  const [jackhammerPunches, setJackhammerPunches] = useState<number>(0);
  const [isJackhammering, setIsJackhammering] = useState<boolean>(false);
  const [isReplacingArm, setIsReplacingArm] = useState<boolean>(false);
  const [hulkPacificationPercent, setHulkPacificationPercent] = useState<number>(35);
  const [coreOutputWatts, setCoreOutputWatts] = useState<number>(22.5); // Gigawatts
  const [screenShake, setScreenShake] = useState<boolean>(false);

  // Rapid Jackhammer Punch ("Go to sleep, go to sleep!")
  const handleJackhammerPunch = () => {
    setIsJackhammering(true);
    setScreenShake(true);
    soundFx.playRepulsorBlast();
    setJackhammerPunches((p) => p + 1);
    setHulkPacificationPercent((prev) => Math.min(100, prev + 8));

    setTimeout(() => {
      soundFx.playRepulsorBlast();
    }, 150);

    setTimeout(() => {
      soundFx.playRepulsorBlast();
      setIsJackhammering(false);
      setScreenShake(false);
    }, 350);

    if (jackhammerPunches % 3 === 0) {
      jarvisVoice.speak('Pneumatic jackhammer cycle: "Go to sleep, go to sleep, go to sleep!"');
    }

    addToast({
      title: 'Heavy Jackhammer Fist Impact',
      message: 'Hydraulic piston delivers 1,200 tons per square inch concussive strike!',
      type: 'alert',
    });
  };

  // Seismic Ground Pound Shockwave
  const handleSeismicGroundPound = () => {
    setScreenShake(true);
    soundFx.playArcReactorPulse();
    soundFx.playRepulsorBlast();
    setHulkPacificationPercent((prev) => Math.min(100, prev + 15));

    jarvisVoice.speak('Seismic shockwave discharged through dual hydraulic gauntlets.');
    addToast({
      title: 'Seismic Shockwave Fired',
      message: 'Omni-directional ground shockwave dispersed across a 50-meter radius!',
      type: 'protocol',
    });

    setTimeout(() => setScreenShake(false), 500);
  };

  // Veronica Limb Replacement Dock
  const handleReplaceArm = () => {
    setIsReplacingArm(true);
    soundFx.playHudBeep('alert');
    jarvisVoice.speak('Veronica orbital package inbound. Jettisoning damaged forearm assembly, attaching fresh vibranium jackhammer module.');

    setTimeout(() => {
      soundFx.playHudBeep('confirm');
      setIsReplacingArm(false);
      setCoreOutputWatts(24.0);
      addToast({
        title: 'Veronica Replacement Arm Latched',
        message: 'Fresh hydraulic jackhammer assembly docked with 100% pneumatic pressure!',
        type: 'protocol',
      });
    }, 2800);
  };

  return (
    <div className={`bg-gray-950/90 border border-red-600/40 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md relative min-h-[640px] flex flex-col p-4 gap-4 select-none transition-transform ${
      screenShake ? 'scale-[1.01] -translate-y-1' : ''
    }`}>
      <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-500/20 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-950/90 border border-red-500 flex items-center justify-center text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.6)]">
            <Hammer className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tech text-base font-bold text-red-200 tracking-wider">
                MARK XLIV // HULKBUSTER HEAVY BATTLESTATION
              </h2>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded border border-red-500/40 bg-red-950/80 text-red-300 uppercase font-bold animate-pulse">
                ARMOR CLASS: TITAN
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans">
              Heavy hydraulic pneumatic jackhammers, Veronica orbital replacement arm dock, and containment telemetry
            </p>
          </div>
        </div>

        {/* Quick Power Indicator */}
        <div className="flex items-center gap-2 font-mono-tech text-xs bg-gray-900 px-3 py-1.5 rounded-xl border border-gray-800 text-amber-300">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>ARC POWER: {coreOutputWatts} GIGAWATTS</span>
        </div>
      </div>

      {/* Main Cockpit Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
        
        {/* Left Column: Hulkbuster Fist & Heavy Weapons Stage (8 Cols) */}
        <div className="lg:col-span-8 bg-gray-950/95 border border-red-500/30 rounded-2xl relative overflow-hidden flex flex-col justify-between p-6 min-h-[460px] shadow-inner">
          
          {/* Top Status Banner */}
          <div className="w-full flex items-center justify-between text-xs font-mono-tech border-b border-gray-800 pb-2">
            <span className="text-gray-400">CHASSIS: 11 MULTI-ARC REACTORS ACTIVE</span>
            <span className="text-red-400 font-bold">HYDRAULIC PRESSURE: 3,500 PSI</span>
          </div>

          {/* Center Graphic & Jackhammer Fist Visual */}
          <div className="my-auto flex flex-col items-center gap-4 text-center">
            <div className={`w-44 h-44 rounded-3xl border-4 border-red-600 bg-red-950/50 flex items-center justify-center relative shadow-[0_0_40px_rgba(239,68,68,0.5)] transition-all ${
              isJackhammering ? 'scale-110 rotate-3 border-amber-400' : ''
            }`}>
              <div className="scale-150">
                <Hammer className={`w-12 h-12 ${isJackhammering ? 'text-amber-300 animate-bounce' : 'text-red-400'}`} />
              </div>

              {/* Pulsing Shockwave Ring */}
              <div className="absolute -inset-4 rounded-3xl border-2 border-red-500/40 animate-ping pointer-events-none" />
            </div>

            <div>
              <span className="text-xs font-mono-tech text-amber-400 font-bold tracking-widest uppercase">
                {isReplacingArm ? 'VERONICA LIMB REPLACEMENT IN PROGRESS...' : 'MARK XLIV PNEUMATIC GAUNTLET'}
              </span>
              <h3 className="font-tech text-xl font-bold text-white tracking-widest mt-0.5">
                HYDRAULIC JACKHAMMER FIST
              </h3>
              <p className="text-xs text-gray-400 font-sans max-w-sm mt-1 leading-relaxed">
                Pneumatic internal piston fires repeatedly at 12 cycles per second, absorbing kinetic rebound via heavy dampeners.
              </p>
            </div>

            {/* Target Pacification Bar */}
            <div className="w-full max-w-md bg-gray-900 p-3 rounded-xl border border-gray-800 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-mono-tech">
                <span className="text-gray-400">HULK SEDATION / PACIFICATION</span>
                <span className="text-red-400 font-bold">{hulkPacificationPercent}% CONTAINED</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-gray-950 overflow-hidden border border-gray-800">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${hulkPacificationPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Action Controls */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <button
              onClick={handleJackhammerPunch}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:scale-105 active:scale-95 text-white font-tech font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all"
            >
              <Hammer className="w-4 h-4" />
              <span>JACKHAMMER PUNCH</span>
            </button>

            <button
              onClick={handleSeismicGroundPound}
              className="py-3 px-4 rounded-xl bg-gray-900 border border-red-500 hover:border-red-400 text-white font-tech font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>SEISMIC POUND</span>
            </button>

            <button
              onClick={handleReplaceArm}
              disabled={isReplacingArm}
              className="py-3 px-4 rounded-xl bg-cyan-950 border border-cyan-400 hover:bg-cyan-900 text-cyan-200 font-tech font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isReplacingArm ? 'animate-spin' : ''}`} />
              <span>VERONICA ARM DOCK</span>
            </button>
          </div>
        </div>

        {/* Right Column: Telemetry & Weapon Systems (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          
          {/* Card 1: Hulkbuster Specs */}
          <div className="bg-gray-900/90 border border-red-500/20 rounded-xl p-3.5 flex flex-col gap-2.5">
            <span className="font-tech text-xs font-bold text-red-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-800 pb-2">
              <Activity className="w-4 h-4 text-red-400" />
              <span>HEAVY ARMOR TELEMETRY</span>
            </span>

            <div className="space-y-2 text-xs font-mono-tech">
              <div className="bg-gray-950 p-2 rounded-lg border border-gray-800 flex justify-between items-center">
                <span className="text-gray-400">TOTAL WEIGHT:</span>
                <span className="text-white font-bold">2,100 KG</span>
              </div>
              <div className="bg-gray-950 p-2 rounded-lg border border-gray-800 flex justify-between items-center">
                <span className="text-gray-400">CHEST REACTORS:</span>
                <span className="text-cyan-300 font-bold">4 QUAD-CORE CORES</span>
              </div>
              <div className="bg-gray-950 p-2 rounded-lg border border-gray-800 flex justify-between items-center">
                <span className="text-gray-400">PUNCH CYCLES:</span>
                <span className="text-amber-300 font-bold">{jackhammerPunches} DISCHARGED</span>
              </div>
              <div className="bg-gray-950 p-2 rounded-lg border border-gray-800 flex justify-between items-center">
                <span className="text-gray-400">HULL THICKNESS:</span>
                <span className="text-emerald-300 font-bold">120 MM VIBRANIUM-STEEL</span>
              </div>
            </div>
          </div>

          {/* Card 2: Specialized Hulk Containment Subsystems */}
          <div className="bg-gray-900/90 border border-red-500/20 rounded-xl p-3.5 flex flex-col gap-2.5">
            <span className="font-tech text-xs font-bold text-red-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-800 pb-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>CONTAINMENT PROTOCOLS</span>
            </span>

            {[
              { name: 'Chemical Sedative Gas Sprayer', status: 'READY (100%)' },
              { name: 'Electrified Concussion Clamps', status: 'CHARGED (80 kV)' },
              { name: 'Sub-Orbital Containment Cage', status: 'ORBITAL STANDBY' },
              { name: 'Bruce Banner Gamma Dampeners', status: 'ONLINE' },
            ].map((sub, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-mono-tech p-2 bg-gray-950 rounded-lg border border-gray-800">
                <span className="text-gray-300">{sub.name}</span>
                <span className="text-[10px] text-emerald-400 font-bold">{sub.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
