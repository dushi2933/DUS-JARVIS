import React, { useState } from 'react';
import { 
  Globe, 
  ShieldAlert, 
  Zap, 
  Radio, 
  Crosshair, 
  MapPin, 
  Activity, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Satellite 
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useToast } from '../context/ToastContext';

interface ThreatHotspot {
  id: string;
  name: string;
  region: string;
  coordinates: string;
  threatLevel: 'ALPHA' | 'OMEGA' | 'CRITICAL' | 'MONITORED';
  incident: string;
  status: string;
  activeDrones: number;
}

export const GlobalThreatIntelGlobe: React.FC = () => {
  const { addToast } = useToast();

  const [hotspots, setHotspots] = useState<ThreatHotspot[]>([
    {
      id: 'nyc',
      name: 'Stark Tower / New York Corridor',
      region: 'North America (40.75° N, 73.98° W)',
      coordinates: '40.7580, -73.9855',
      threatLevel: 'MONITORED',
      incident: 'Battle of New York Chitauri wormhole gateway. Penthouse helipad secure.',
      status: 'AIRSPACE CLEAR',
      activeDrones: 6,
    },
    {
      id: 'sokovia',
      name: 'Novi Grad Crater',
      region: 'Eastern Europe (44.15° N, 20.91° E)',
      coordinates: '44.1527, 20.9114',
      threatLevel: 'ALPHA',
      incident: 'Ultron vibranium core detonation site. Residual robotic chatter scanned.',
      status: 'GROUND PATROL ACTIVE',
      activeDrones: 12,
    },
    {
      id: 'wakanda',
      name: 'Wakandan Perimeter Barrier',
      region: 'East Africa (0.22° N, 37.90° E)',
      coordinates: '0.2280, 37.9083',
      threatLevel: 'OMEGA',
      incident: 'Outrider swarm invasion vector. Energy dome frequency synchronized.',
      status: 'HIGH DEFENSE READINESS',
      activeDrones: 24,
    },
    {
      id: 'titan',
      name: 'Titan Ruins (Subspace Uplink)',
      region: 'Deep Space Relay (Saturnian Moon)',
      coordinates: 'TITAN-ORBIT-04',
      threatLevel: 'CRITICAL',
      incident: 'Q-Ship crash site and Mad Titan confrontation sector.',
      status: 'SATELLITE TELEMETRY LINKED',
      activeDrones: 4,
    },
    {
      id: 'malibu',
      name: 'Point Dume Cliffside Workshop',
      region: 'California Coast (34.00° N, 118.80° W)',
      coordinates: '34.0015, -118.8062',
      threatLevel: 'MONITORED',
      incident: 'Original Stark residence and Mark I-VII subterranean wine cellar vault.',
      status: 'AUTOMATED PERIMETER ARMED',
      activeDrones: 8,
    },
    {
      id: 'leipzig',
      name: 'Leipzig-Halle Airport Sector',
      region: 'Germany (51.42° N, 12.23° E)',
      coordinates: '51.4239, 12.2364',
      threatLevel: 'MONITORED',
      incident: 'Sokovia Accords airport clash site. International diplomatic oversight.',
      status: 'COMMERCIAL AIRSPACE RESUMED',
      activeDrones: 2,
    },
  ]);

  const [selectedHotspot, setSelectedHotspot] = useState<ThreatHotspot>(hotspots[2]); // Wakanda default
  const [isFiringOrbitalStrike, setIsFiringOrbitalStrike] = useState<boolean>(false);

  // Authorize Orbital Particle Strike
  const handleAuthorizeOrbitalStrike = () => {
    setIsFiringOrbitalStrike(true);
    soundFx.playArcReactorPulse();
    soundFx.playRepulsorCharge();

    jarvisVoice.speak(`Stark orbital defense satellite locked on ${selectedHotspot.name}. Kinetic particle beam authorized. Stand by for orbital discharge.`);

    setTimeout(() => {
      soundFx.playRepulsorBlast();
      setIsFiringOrbitalStrike(false);

      setHotspots((prev) =>
        prev.map((h) =>
          h.id === selectedHotspot.id ? { ...h, status: 'THREAT NEUTRALIZED (ORBITAL STRIKE)', threatLevel: 'MONITORED' } : h
        )
      );

      addToast({
        title: 'Orbital Particle Strike Discharged!',
        message: `High-density particle beam impacted coordinates ${selectedHotspot.coordinates}. Sector neutralized.`,
        type: 'alert',
      });
    }, 2200);
  };

  // Dispatch Drone Squadron
  const handleDispatchDrones = () => {
    soundFx.playHudBeep('mode');
    setHotspots((prev) =>
      prev.map((h) =>
        h.id === selectedHotspot.id ? { ...h, activeDrones: h.activeDrones + 4 } : h
      )
    );
    jarvisVoice.speak(`Deploying four additional automated Iron Legion drones to ${selectedHotspot.name}.`);
    addToast({
      title: 'Iron Legion Drones Dispatched',
      message: `Squadron en route to ${selectedHotspot.region}.`,
      type: 'protocol',
    });
  };

  return (
    <div className="bg-gray-950/90 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md relative min-h-[640px] flex flex-col p-4 gap-4 select-none">
      <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

      {/* Screen flash during orbital strike */}
      {isFiringOrbitalStrike && (
        <div className="absolute inset-0 bg-cyan-400 animate-pulse z-50 pointer-events-none opacity-80 transition-opacity" />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Globe className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tech text-base font-bold text-cyan-200 tracking-wider">
                STARK GLOBAL THREAT MAP // ORBITAL DEFENSE NETWORK
              </h2>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded border border-cyan-500/40 bg-cyan-950/80 text-cyan-300 uppercase font-bold animate-pulse">
                SATELLITE UPLINK: VERONICA-01
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans">
              Worldwide intelligence hotspots, Iron Legion drone patrols, and kinetic particle strike authorization
            </p>
          </div>
        </div>

        {/* Global Drone Count */}
        <div className="flex items-center gap-2 text-xs font-mono-tech bg-gray-900 px-3 py-1.5 rounded-xl border border-gray-800 text-cyan-300">
          <Satellite className="w-3.5 h-3.5 text-cyan-400" />
          <span>GLOBAL DRONES: {hotspots.reduce((acc, h) => acc + h.activeDrones, 0)} ACTIVE</span>
        </div>
      </div>

      {/* Main Grid: Hotspot Directory & Tactical Satellite Terminal */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
        
        {/* Left Column: Tactical Hotspot Directory (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-2.5 max-h-[500px] overflow-y-auto pr-1">
          {hotspots.map((h) => {
            const isSelected = selectedHotspot.id === h.id;
            return (
              <div
                key={h.id}
                onClick={() => {
                  soundFx.playHudBeep('subtle');
                  setSelectedHotspot(h);
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg'
                    : 'bg-gray-950 border-gray-800 hover:border-gray-700 text-gray-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-gray-500'}`} />
                    <h4 className="font-tech text-xs font-bold text-white tracking-wider">
                      {h.name}
                    </h4>
                  </div>
                  <span className={`text-[9px] font-mono-tech px-1.5 py-0.2 rounded font-bold border ${
                    h.threatLevel === 'OMEGA'
                      ? 'bg-red-950 text-red-300 border-red-500 animate-pulse'
                      : h.threatLevel === 'ALPHA'
                      ? 'bg-amber-950 text-amber-300 border-amber-500'
                      : 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                  }`}>
                    {h.threatLevel}
                  </span>
                </div>

                <p className="text-[11px] font-sans text-gray-400 line-clamp-1">
                  {h.incident}
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono-tech text-gray-500 pt-1 border-t border-gray-800/60">
                  <span>{h.region}</span>
                  <span className="text-cyan-400 font-bold">{h.activeDrones} DRONES</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: High-Tech Satellite Target Terminal (7 Cols) */}
        <div className="lg:col-span-7 bg-gray-900/95 border border-cyan-500/30 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-xl">
          
          {/* Top Dossier Title */}
          <div>
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <div>
                <span className="text-[10px] font-mono-tech text-amber-400 font-bold uppercase tracking-widest block">
                  ORBITAL RECONNAISSANCE DOSSIER
                </span>
                <h3 className="font-tech text-xl font-bold text-white tracking-wider mt-0.5">
                  {selectedHotspot.name}
                </h3>
              </div>
              <div className="text-right font-mono-tech text-xs">
                <span className="text-cyan-300 font-bold block">{selectedHotspot.coordinates}</span>
                <span className="text-emerald-400 text-[10px]">{selectedHotspot.status}</span>
              </div>
            </div>

            {/* Tactical Incident Brief */}
            <div className="mt-3 p-3 rounded-xl bg-gray-950 border border-gray-800 text-xs font-mono-tech space-y-2">
              <div>
                <span className="text-gray-500 text-[10px] block">TACTICAL INTELLIGENCE BRIEF</span>
                <p className="text-gray-300 font-sans mt-0.5 leading-relaxed">{selectedHotspot.incident}</p>
              </div>
              <div>
                <span className="text-gray-500 text-[10px] block">PATROL TRANSPONDER</span>
                <span className="text-cyan-300 font-bold">{selectedHotspot.activeDrones} Autonomous Iron Legion Units</span>
              </div>
            </div>
          </div>

          {/* Center Target Holographic Reticle */}
          <div className="my-auto flex flex-col items-center gap-3 py-2">
            <div className="w-36 h-36 rounded-full border-2 border-dashed border-cyan-400 flex items-center justify-center relative animate-spin-slow">
              <div className="w-24 h-24 rounded-full border border-red-500/60 flex items-center justify-center">
                <Crosshair className="w-8 h-8 text-cyan-300 animate-pulse" />
              </div>
            </div>
            <span className="text-[11px] font-mono-tech text-cyan-300 font-bold tracking-wider">
              {isFiringOrbitalStrike ? 'ORBITAL KINETIC BEAM DISCHARGING...' : 'SATELLITE OPTICS LOCKED ON TARGET'}
            </span>
          </div>

          {/* Bottom Action Controls */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAuthorizeOrbitalStrike}
              disabled={isFiringOrbitalStrike}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:scale-105 active:scale-95 text-white font-tech font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>ORBITAL PARTICLE STRIKE</span>
            </button>

            <button
              onClick={handleDispatchDrones}
              className="py-3 px-4 rounded-xl bg-gray-950 border border-cyan-400 hover:bg-cyan-900 text-cyan-200 font-tech font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <Satellite className="w-4 h-4" />
              <span>DISPATCH +4 IRON LEGION DRONES</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
