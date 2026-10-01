import React, { useState } from 'react';
import { 
  Zap, 
  Activity, 
  ShieldAlert, 
  Sliders, 
  Radio, 
  Cpu, 
  Thermometer, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { GauntletState } from '../types/gauntlet';
import { soundFx } from '../utils/audioEffects';

interface ArcReactorPowerGridProps {
  gauntletState: GauntletState;
  onUpdatePowerRouting: (routing: GauntletState['powerRouting']) => void;
  onOverdriveReactor: () => void;
}

export const ArcReactorPowerGrid: React.FC<ArcReactorPowerGridProps> = ({
  gauntletState,
  onUpdatePowerRouting,
  onOverdriveReactor,
}) => {
  const [isOverdriven, setIsOverdriven] = useState(false);

  const handleSliderChange = (subsystem: keyof GauntletState['powerRouting'], value: number) => {
    soundFx.playHudBeep('subtle');
    const current = { ...gauntletState.powerRouting };
    current[subsystem] = value;
    onUpdatePowerRouting(current);
  };

  const triggerOverdrive = () => {
    soundFx.playArcReactorPulse();
    soundFx.playHudBeep('alert');
    setIsOverdriven(true);
    onOverdriveReactor();
    setTimeout(() => setIsOverdriven(false), 4000);
  };

  const balancePowerEqually = () => {
    soundFx.playHudBeep('confirm');
    onUpdatePowerRouting({
      repulsors: 40,
      flightStabilizers: 20,
      kineticShield: 20,
      nanoRepair: 20,
    });
  };

  const divertToWeapons = () => {
    soundFx.playHudBeep('alert');
    onUpdatePowerRouting({
      repulsors: 85,
      flightStabilizers: 5,
      kineticShield: 5,
      nanoRepair: 5,
    });
  };

  return (
    <div className="bg-gray-900/60 border border-cyan-500/20 rounded-xl p-4 flex flex-col backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-400/40 flex items-center justify-center glow-arc-blue">
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-tech text-sm font-bold tracking-wider text-cyan-200">
              ARC REACTOR POWER DISTRIBUTION
            </h3>
            <p className="text-[11px] text-gray-400 font-sans">
              Palladium-Vibranium Micro-Core Telemetry
            </p>
          </div>
        </div>

        {/* Quick Balancing Presets */}
        <div className="flex items-center gap-1.5 text-xs font-mono-tech">
          <button
            onClick={balancePowerEqually}
            className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px] border border-gray-700 cursor-pointer"
          >
            BALANCED
          </button>
          <button
            onClick={divertToWeapons}
            className="px-2 py-1 rounded bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-500/40 text-[11px] cursor-pointer"
          >
            MAX REPULSOR
          </button>
        </div>
      </div>

      {/* Center Grid: Arc Core Pulsar + Subsystem Allocation Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-10 my-1">
        {/* Left: Glowing Holographic Arc Core */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-3 bg-gray-950/60 rounded-xl border border-cyan-500/20">
          <div className="relative w-28 h-28 flex items-center justify-center my-2">
            {/* Pulsing Outer Shield */}
            <div
              className={`absolute inset-0 rounded-full border-2 border-cyan-400/30 ${
                isOverdriven ? 'animate-ping border-red-400' : 'animate-pulse-ring'
              }`}
            />
            {/* Spinning Stator Segments */}
            <div className="absolute inset-2 rounded-full border border-dashed border-cyan-300/60 animate-spin-slow" />
            <div className="absolute inset-4 rounded-full border border-amber-400/40 animate-spin-reverse-slow" />

            {/* Inner Core */}
            <div
              className={`w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all ${
                isOverdriven
                  ? 'bg-amber-400 glow-arc-gold scale-110'
                  : 'bg-cyan-400 glow-arc-blue'
              }`}
            >
              <span className="font-tech text-gray-950 text-xs font-bold leading-none">
                {isOverdriven ? '120%' : '100%'}
              </span>
              <span className="text-[9px] text-gray-900 font-mono-tech uppercase">
                STABLE
              </span>
            </div>
          </div>

          <div className="text-center mt-1">
            <span className="font-tech text-base font-bold text-cyan-200">
              {gauntletState.arcReactorOutputGW} GIGAWATTS
            </span>
            <div className="text-[10px] text-gray-400 font-mono-tech mt-0.5">
              OUTPUT FREQUENCY: 1.21 MHz
            </div>
          </div>

          {/* Overdrive Trigger */}
          <button
            onClick={triggerOverdrive}
            className={`mt-3 w-full py-1.5 px-3 rounded-lg font-tech text-xs tracking-wider font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              isOverdriven
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isOverdriven ? 'OVERDRIVE ACTIVE!' : 'ARC OVERDRIVE'}</span>
          </button>
        </div>

        {/* Right: Subsystem Energy Routing Sliders */}
        <div className="md:col-span-7 space-y-3">
          {/* 1. Palm Repulsors */}
          <div className="bg-gray-950/50 p-2.5 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-tech text-cyan-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Palm Repulsor Capacitors
              </span>
              <span className="font-mono-tech text-cyan-400 font-bold">
                {gauntletState.powerRouting.repulsors}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={gauntletState.powerRouting.repulsors}
              onChange={(e) => handleSliderChange('repulsors', Number(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 2. Flight Attitude Thrusters */}
          <div className="bg-gray-950/50 p-2.5 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-tech text-amber-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Flight Gyro & Attitude Thrusters
              </span>
              <span className="font-mono-tech text-amber-400 font-bold">
                {gauntletState.powerRouting.flightStabilizers}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={gauntletState.powerRouting.flightStabilizers}
              onChange={(e) => handleSliderChange('flightStabilizers', Number(e.target.value))}
              className="w-full accent-amber-400 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 3. Kinetic Shield */}
          <div className="bg-gray-950/50 p-2.5 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-tech text-blue-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Kinetic Energy Dispersion Shield
              </span>
              <span className="font-mono-tech text-blue-400 font-bold">
                {gauntletState.powerRouting.kineticShield}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={gauntletState.powerRouting.kineticShield}
              onChange={(e) => handleSliderChange('kineticShield', Number(e.target.value))}
              className="w-full accent-blue-400 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 4. Nano-Repair Reservoir */}
          <div className="bg-gray-950/50 p-2.5 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-tech text-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Nanite Cellular Self-Repair
              </span>
              <span className="font-mono-tech text-emerald-400 font-bold">
                {gauntletState.powerRouting.nanoRepair}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={gauntletState.powerRouting.nanoRepair}
              onChange={(e) => handleSliderChange('nanoRepair', Number(e.target.value))}
              className="w-full accent-emerald-400 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
