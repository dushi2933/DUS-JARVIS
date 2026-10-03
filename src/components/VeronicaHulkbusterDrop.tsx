import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Satellite, 
  ShieldAlert, 
  Zap, 
  Flame, 
  Layers, 
  Radio, 
  CheckCircle2, 
  RotateCcw, 
  Activity, 
  Compass, 
  AlertTriangle 
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useToast } from '../context/ToastContext';

export type DropStage = 
  | 'STANDBY' 
  | 'ORBITAL_ALIGNMENT' 
  | 'POD_EJECTION' 
  | 'ATMOSPHERIC_ENTRY' 
  | 'DECELERATION' 
  | 'DOCKING_LATCH' 
  | 'HULKBUSTER_ACTIVE';

export const VeronicaHulkbusterDrop: React.FC = () => {
  const { addToast } = useToast();

  const [stage, setStage] = useState<DropStage>('STANDBY');
  const [altitudeKm, setAltitudeKm] = useState<number>(420);
  const [speedMach, setSpeedMach] = useState<number>(24.5);
  const [heatShieldTempC, setHeatShieldTempC] = useState<number>(85);
  const [powerBoostPercent, setPowerBoostPercent] = useState<number>(0);

  // Trigger orbital deployment sequence
  const handleLaunchVeronica = () => {
    soundFx.playHudBeep('alert');
    setStage('ORBITAL_ALIGNMENT');
    jarvisVoice.speak('Veronica orbital relay verified. Aligning Hulkbuster drop pod over current coordinates, Mr. Stark.');
    addToast({
      title: 'Veronica Satellite Deployed',
      message: 'Orbital cage targeting Stark Tower landing zone from 420 km altitude.',
      type: 'protocol',
    });

    // Step 2: Pod ejection after 2.5s
    setTimeout(() => {
      soundFx.playArcReactorPulse();
      setStage('POD_EJECTION');
      setAltitudeKm(310);
      setSpeedMach(22.0);
    }, 2500);

    // Step 3: Re-entry burn after 5.5s
    setTimeout(() => {
      soundFx.playRepulsorCharge();
      setStage('ATMOSPHERIC_ENTRY');
      setAltitudeKm(85);
      setSpeedMach(16.5);
      setHeatShieldTempC(2950);
      jarvisVoice.speak('Re-entry heat shield experiencing 2,900 degrees Celsius plasma sheath.');
    }, 5500);

    // Step 4: Supersonic brake after 8.5s
    setTimeout(() => {
      soundFx.playHudBeep('mode');
      setStage('DECELERATION');
      setAltitudeKm(12);
      setSpeedMach(2.8);
      setHeatShieldTempC(620);
    }, 8500);

    // Step 5: Docking latch after 11.5s
    setTimeout(() => {
      soundFx.playHudBeep('confirm');
      setStage('DOCKING_LATCH');
      setAltitudeKm(0.1);
      setSpeedMach(0.2);
    }, 11500);

    // Step 6: Fully docked Hulkbuster after 14s
    setTimeout(() => {
      soundFx.playRepulsorBlast();
      setStage('HULKBUSTER_ACTIVE');
      setAltitudeKm(0);
      setSpeedMach(0);
      setHeatShieldTempC(120);
      setPowerBoostPercent(500);
      jarvisVoice.speak('Hulkbuster heavy plating locked into gauntlet servos. Arc output amplified five hundred percent, Sir.');
      addToast({
        title: 'HULKBUSTER HEAVY SUIT ENGAGED',
        message: 'Titanium-Vibranium armor clamps latched. Repulsor wattage boosted +500%!',
        type: 'alert',
      });
    }, 14000);
  };

  const handleReset = () => {
    soundFx.playHudBeep('subtle');
    setStage('STANDBY');
    setAltitudeKm(420);
    setSpeedMach(24.5);
    setHeatShieldTempC(85);
    setPowerBoostPercent(0);
    jarvisVoice.speak('Veronica orbital package returned to geostationary orbit, Sir.');
  };

  const isDropping = stage !== 'STANDBY' && stage !== 'HULKBUSTER_ACTIVE';

  return (
    <div className="bg-gray-950/90 border border-amber-500/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md relative min-h-[640px] flex flex-col p-4 gap-4 select-none">
      <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-400 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
            <Satellite className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tech text-base font-bold text-amber-200 tracking-wider">
                VERONICA // HULKBUSTER ORBITAL DROP SIMULATOR
              </h2>
              <span className={`text-[10px] font-mono-tech px-2 py-0.5 rounded border uppercase font-bold ${
                stage === 'HULKBUSTER_ACTIVE'
                  ? 'bg-red-950 text-red-300 border-red-500 animate-pulse'
                  : isDropping
                  ? 'bg-amber-950 text-amber-300 border-amber-500 animate-bounce'
                  : 'bg-gray-900 text-gray-400 border-gray-800'
              }`}>
                STATUS: {stage.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans">
              Deploy modular sub-orbital cage plating directly from Stark Satellite Veronica in low-Earth orbit
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          {stage === 'STANDBY' ? (
            <button
              onClick={handleLaunchVeronica}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:scale-105 active:scale-95 text-white font-tech font-bold text-xs tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.6)] transition-all"
            >
              <Rocket className="w-4 h-4" />
              <span>DEPLOY VERONICA DROP</span>
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="py-2 px-3 rounded-lg bg-gray-900 border border-gray-700 hover:border-amber-400 text-gray-300 font-mono-tech text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Satellite</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Orbital Descent Telemetry Visualizer */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
        
        {/* Left: Atmospheric Descent Visualizer (8 Cols) */}
        <div className="lg:col-span-8 bg-gray-950/95 border border-amber-500/30 rounded-2xl relative overflow-hidden flex flex-col items-center justify-between p-4 min-h-[460px] shadow-inner">
          {/* Earth Horizon Curvature at Bottom */}
          <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-[100%] bg-blue-950/60 border-t-2 border-cyan-400/50 shadow-[0_0_50px_rgba(6,182,212,0.4)] pointer-events-none" />

          {/* Re-entry Heat Cone Visual effect */}
          {stage === 'ATMOSPHERIC_ENTRY' && (
            <div className="absolute inset-0 bg-gradient-to-t from-red-600/30 via-amber-500/10 to-transparent animate-pulse pointer-events-none" />
          )}

          {/* Top Flight Ceiling Indicator */}
          <div className="w-full flex items-center justify-between text-xs font-mono-tech text-gray-400 border-b border-gray-800 pb-2 relative z-10">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Satellite className="w-3.5 h-3.5" /> VERONICA ORBITAL PLATFORM (GEO-420KM)
            </span>
            <span className="text-cyan-300">TARGET: STARK TOWER HELIPAD</span>
          </div>

          {/* Center Pod Graphic */}
          <div className="my-auto flex flex-col items-center relative z-10">
            <div className={`w-32 h-32 rounded-2xl border-2 flex items-center justify-center relative transition-all duration-700 shadow-2xl ${
              stage === 'HULKBUSTER_ACTIVE'
                ? 'border-red-500 bg-red-950/60 scale-125 shadow-[0_0_35px_rgba(239,68,68,0.7)]'
                : stage === 'ATMOSPHERIC_ENTRY'
                ? 'border-amber-400 bg-amber-950/70 scale-110 shadow-[0_0_40px_rgba(245,158,11,0.8)] animate-pulse'
                : 'border-amber-500/40 bg-gray-900/90'
            }`}>
              {/* Hulkbuster Gauntlet Schematic Icon */}
              <Zap className={`w-14 h-14 ${
                stage === 'HULKBUSTER_ACTIVE' ? 'text-red-400 animate-bounce' : 'text-amber-300'
              }`} />

              {/* Shockwave Rings when active */}
              {stage === 'HULKBUSTER_ACTIVE' && (
                <div className="absolute -inset-4 rounded-3xl border-2 border-red-500/50 animate-ping pointer-events-none" />
              )}
            </div>

            <div className="mt-3 text-center">
              <h3 className="font-tech text-sm font-bold text-amber-200 uppercase tracking-widest">
                {stage === 'HULKBUSTER_ACTIVE' ? 'HULKBUSTER HEAVY GAUNTLET DOCKED' : 'VERONICA DROP POD // MARK 44'}
              </h3>
              <p className="text-xs font-mono-tech text-gray-400 mt-0.5">
                {stage === 'HULKBUSTER_ACTIVE' 
                  ? 'REPULSOR OUTPUT AMPLIFIED TO 22.5 GIGAWATTS' 
                  : `TRAJECTORY VECTOR: ${altitudeKm} KM · MACH ${speedMach}`}
              </p>
            </div>
          </div>

          {/* Bottom Stage Progress Bar */}
          <div className="w-full bg-gray-900/80 p-2.5 rounded-xl border border-gray-800 relative z-10">
            <div className="flex items-center justify-between text-[11px] font-mono-tech text-gray-400 mb-1.5">
              <span>DESCENT PROGRESS</span>
              <span className="text-amber-300 font-bold">
                {stage === 'HULKBUSTER_ACTIVE' ? '100% COMPLETE' : `${Math.round(((420 - altitudeKm) / 420) * 100)}%`}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-950 overflow-hidden border border-gray-800">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-500 rounded-full"
                style={{ width: `${Math.round(((420 - altitudeKm) / 420) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Telemetry Readouts (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          
          {/* Card 1: Re-entry Physics */}
          <div className="bg-gray-900/90 border border-amber-500/20 rounded-xl p-3.5 flex flex-col gap-2.5">
            <span className="font-tech text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-800 pb-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>ORBITAL RE-ENTRY TELEMETRY</span>
            </span>

            <div className="space-y-2 text-xs font-mono-tech">
              <div className="bg-gray-950 p-2 rounded-lg border border-gray-800 flex justify-between items-center">
                <span className="text-gray-400">ALTITUDE:</span>
                <span className="text-amber-300 font-bold">{altitudeKm} KM</span>
              </div>
              <div className="bg-gray-950 p-2 rounded-lg border border-gray-800 flex justify-between items-center">
                <span className="text-gray-400">VELOCITY:</span>
                <span className="text-cyan-300 font-bold">MACH {speedMach}</span>
              </div>
              <div className="bg-gray-950 p-2 rounded-lg border border-gray-800 flex justify-between items-center">
                <span className="text-gray-400">HEAT SHIELD:</span>
                <span className={`font-bold ${heatShieldTempC > 1500 ? 'text-red-400 animate-pulse' : 'text-emerald-300'}`}>
                  {heatShieldTempC}°C
                </span>
              </div>
              <div className="bg-gray-950 p-2 rounded-lg border border-gray-800 flex justify-between items-center">
                <span className="text-gray-400">POWER GAIN:</span>
                <span className="text-red-400 font-bold">+{powerBoostPercent}% WATTS</span>
              </div>
            </div>
          </div>

          {/* Card 2: Modular Armor Attachment Points */}
          <div className="bg-gray-900/90 border border-amber-500/20 rounded-xl p-3.5 flex flex-col gap-2.5">
            <span className="font-tech text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-800 pb-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>HULKBUSTER COUPLING LOCKS</span>
            </span>

            {[
              { label: 'Wrist Hydraulic Clamp', isLocked: stage === 'HULKBUSTER_ACTIVE' || stage === 'DOCKING_LATCH' },
              { label: 'Forearm Vibranium Reinforcement', isLocked: stage === 'HULKBUSTER_ACTIVE' || stage === 'DOCKING_LATCH' },
              { label: 'Secondary Arc Capacitor Shunt', isLocked: stage === 'HULKBUSTER_ACTIVE' },
              { label: 'Heavy Pneumatic Fist Servo', isLocked: stage === 'HULKBUSTER_ACTIVE' },
            ].map((lock, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-mono-tech p-1.5 bg-gray-950 rounded border border-gray-800">
                <span className="text-gray-300">{lock.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  lock.isLocked ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'text-gray-500'
                }`}>
                  {lock.isLocked ? 'LOCKED' : 'STANDBY'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
