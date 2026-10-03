import React, { useState } from 'react';
import { 
  Users, 
  ShieldAlert, 
  Radio, 
  Zap, 
  Navigation, 
  BatteryCharging, 
  RotateCw, 
  Plane, 
  Crosshair, 
  Activity, 
  Flame,
  CheckCircle2
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useToast } from '../context/ToastContext';

interface DroneSuit {
  id: string;
  name: string;
  codeName: string;
  specialty: string;
  battery: number;
  hullIntegrity: number;
  status: 'PATROL' | 'DEFENDING' | 'INTERCEPTING' | 'STANDBY';
  distanceKm: number;
  location: string;
}

export const HousePartyProtocolSquad: React.FC = () => {
  const { addToast } = useToast();

  const [suits, setSuits] = useState<DroneSuit[]>([
    {
      id: 'mk17',
      name: 'Mark XVII',
      codeName: 'HEARTBREAKER',
      specialty: 'Artillery Level RT Chest Cannon & Repulsor Shield',
      battery: 94,
      hullIntegrity: 100,
      status: 'PATROL',
      distanceKm: 3.2,
      location: 'East River Airspace',
    },
    {
      id: 'mk33',
      name: 'Mark XXXIII',
      codeName: 'SILVER CENTURION',
      specialty: 'Vibranium Forearm Blades & Magnetic Forcefield',
      battery: 88,
      hullIntegrity: 96,
      status: 'PATROL',
      distanceKm: 1.8,
      location: 'Stark Tower North Perimeter',
    },
    {
      id: 'mk38',
      name: 'Mark XXXVIII',
      codeName: 'IGOR',
      specialty: 'Heavy Hydraulic Lifting Spine & Structural Bracing',
      battery: 100,
      hullIntegrity: 100,
      status: 'STANDBY',
      distanceKm: 0.1,
      location: 'Workshop Sub-Level 4',
    },
    {
      id: 'mk39',
      name: 'Mark XXXIX',
      codeName: 'STARBOOST',
      specialty: 'Sub-Orbital High-Altitude Flight & Conformal Booster',
      battery: 92,
      hullIntegrity: 98,
      status: 'PATROL',
      distanceKm: 18.5,
      location: 'Stratosphere Flight Corridor',
    },
    {
      id: 'mk40',
      name: 'Mark XL',
      codeName: 'SHOTGUN',
      specialty: 'Hyper-Velocity Supersonic Mach 5 Interceptor',
      battery: 81,
      hullIntegrity: 92,
      status: 'INTERCEPTING',
      distanceKm: 6.4,
      location: 'Long Island Sound Vector',
    },
    {
      id: 'mk41',
      name: 'Mark XLI',
      codeName: 'BONES',
      specialty: 'Modular Exoskeleton Splitting & High-G Aerobatics',
      battery: 95,
      hullIntegrity: 100,
      status: 'PATROL',
      distanceKm: 4.1,
      location: 'Manhattan Grid 7',
    },
  ]);

  const [activeFormation, setActiveFormation] = useState<'PERIMETER' | 'CONVERGE' | 'RECON' | 'STANDBY'>('PERIMETER');

  // Trigger Full House Party Protocol Command
  const handleExecuteHouseParty = () => {
    soundFx.playRepulsorBlast();
    setActiveFormation('CONVERGE');
    setSuits((prev) =>
      prev.map((s) => ({
        ...s,
        status: 'DEFENDING',
        distanceKm: +(s.distanceKm * 0.3).toFixed(1),
      }))
    );

    jarvisVoice.speak('House Party Protocol initiated, Mr. Stark. All automated drone armors converging on your position.');
    addToast({
      title: 'HOUSE PARTY PROTOCOL ENGAGED',
      message: 'All 6 autonomous Iron Man suits dispatched in tight combat escort around your gauntlet coordinates!',
      type: 'alert',
    });
  };

  const handleSetFormation = (form: 'PERIMETER' | 'CONVERGE' | 'RECON' | 'STANDBY') => {
    soundFx.playHudBeep('mode');
    setActiveFormation(form);

    const statusMap: Record<typeof form, DroneSuit['status']> = {
      PERIMETER: 'DEFENDING',
      CONVERGE: 'DEFENDING',
      RECON: 'PATROL',
      STANDBY: 'STANDBY',
    };

    setSuits((prev) =>
      prev.map((s) => ({
        ...s,
        status: statusMap[form],
      }))
    );

    jarvisVoice.speak(`Squadron reconfigured to ${form.toLowerCase()} vector.`);
  };

  return (
    <div className="bg-gray-950/90 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md relative min-h-[640px] flex flex-col p-4 gap-4 select-none">
      <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Users className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tech text-base font-bold text-cyan-200 tracking-wider">
                HOUSE PARTY PROTOCOL // AUTONOMOUS ARMOR SQUADRON
              </h2>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded border border-cyan-500/40 bg-cyan-950/80 text-cyan-300 uppercase font-bold animate-pulse">
                6 DRONES AIRBORNE
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans">
              Command and coordinate Tony Stark's fleet of autonomous tactical Iron Man armors
            </p>
          </div>
        </div>

        {/* Global House Party Master Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExecuteHouseParty}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:scale-105 active:scale-95 text-white font-tech font-bold text-xs tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.6)] transition-all"
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>TRIGGER HOUSE PARTY PROTOCOL</span>
          </button>
        </div>
      </div>

      {/* Formation Selector Bar */}
      <div className="bg-gray-900/90 border border-cyan-500/20 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-tech font-bold text-gray-300 uppercase">
            FLEET TACTICAL FORMATION:
          </span>
          {(['PERIMETER', 'CONVERGE', 'RECON', 'STANDBY'] as const).map((form) => (
            <button
              key={form}
              onClick={() => handleSetFormation(form)}
              className={`px-3 py-1 rounded-lg text-xs font-mono-tech font-bold cursor-pointer transition-all ${
                activeFormation === form
                  ? 'bg-cyan-600 text-gray-950 font-extrabold shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                  : 'bg-gray-950 border border-gray-800 text-gray-400 hover:text-gray-200'
              }`}
            >
              {form}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono-tech text-gray-400">
          SQUADRON HEALTH: <span className="text-emerald-400 font-bold">98.2% AVERAGE</span>
        </div>
      </div>

      {/* Suits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 relative z-10">
        {suits.map((suit) => (
          <div
            key={suit.id}
            className="bg-gray-950/80 border border-cyan-500/30 rounded-xl p-3.5 flex flex-col justify-between gap-3 shadow-lg hover:border-cyan-400 transition-all group"
          >
            {/* Top Suit Row */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <div>
                <span className="text-[10px] font-mono-tech text-amber-400 font-bold block">
                  {suit.name}
                </span>
                <h3 className="font-tech text-sm font-bold text-cyan-200 tracking-wider">
                  {suit.codeName}
                </h3>
              </div>

              <span className={`text-[9px] font-mono-tech px-2 py-0.5 rounded font-bold border uppercase ${
                suit.status === 'DEFENDING'
                  ? 'bg-red-950/80 text-red-300 border-red-500/40 animate-pulse'
                  : suit.status === 'INTERCEPTING'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                  : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
              }`}>
                {suit.status}
              </span>
            </div>

            {/* Suit Specialty */}
            <p className="text-[11px] text-gray-300 font-sans leading-relaxed">
              {suit.specialty}
            </p>

            {/* Telemetry Metrics */}
            <div className="grid grid-cols-3 gap-1 text-[10px] font-mono-tech bg-gray-900/60 p-2 rounded-lg border border-gray-800/80">
              <div>
                <span className="text-gray-500 block">BATTERY</span>
                <span className="text-cyan-300 font-bold">{suit.battery}%</span>
              </div>
              <div>
                <span className="text-gray-500 block">HULL</span>
                <span className="text-emerald-300 font-bold">{suit.hullIntegrity}%</span>
              </div>
              <div>
                <span className="text-gray-500 block">PROXIMITY</span>
                <span className="text-amber-300 font-bold">{suit.distanceKm} km</span>
              </div>
            </div>

            {/* Location & Quick Action */}
            <div className="flex items-center justify-between text-[10px] font-mono-tech pt-1">
              <span className="text-gray-400 flex items-center gap-1">
                <Navigation className="w-3 h-3 text-cyan-400" />
                <span>{suit.location}</span>
              </span>

              <button
                onClick={() => {
                  soundFx.playHudBeep('subtle');
                  setSuits((prev) =>
                    prev.map((s) => (s.id === suit.id ? { ...s, distanceKm: 0.2, status: 'DEFENDING' } : s))
                  );
                  addToast({
                    title: `${suit.codeName} Dispatched`,
                    message: `${suit.name} called directly to your perimeter.`,
                    type: 'status',
                  });
                }}
                className="text-cyan-400 hover:text-cyan-200 underline cursor-pointer"
              >
                Recall To Position ↗
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
