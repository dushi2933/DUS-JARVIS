import React from 'react';
import { 
  ShieldAlert, 
  Crosshair, 
  Plane, 
  Eye, 
  RotateCcw, 
  Radio, 
  Check, 
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import { ProtocolType } from '../types/gauntlet';
import { soundFx } from '../utils/audioEffects';

interface TacticalProtocolsProps {
  activeProtocol: ProtocolType;
  onSetProtocol: (proto: ProtocolType) => void;
  onRepairArmor: () => void;
  armorIntegrity: number;
}

export const TacticalProtocols: React.FC<TacticalProtocolsProps> = ({
  activeProtocol,
  onSetProtocol,
  onRepairArmor,
  armorIntegrity,
}) => {
  const protocols: {
    id: ProtocolType;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    activeBg: string;
  }[] = [
    {
      id: 'COMBAT',
      name: 'Combat Protocol',
      description: 'Arms repulsor capacitor overclock (+200% recharge rate) and opens micro-missile targeting.',
      icon: <Crosshair className="w-4 h-4" />,
      color: 'text-red-400 border-red-500/40',
      activeBg: 'bg-red-950/40 glow-arc-red',
    },
    {
      id: 'FLIGHT',
      name: 'Flight Attitude Stabilization',
      description: 'Synchronizes dual palm gyroscopes and wrist micro-thrusters for smooth flight control.',
      icon: <Plane className="w-4 h-4" />,
      color: 'text-amber-400 border-amber-500/40',
      activeBg: 'bg-amber-950/40 glow-arc-gold',
    },
    {
      id: 'SENTRY',
      name: 'Sentry Autonomous Scan',
      description: 'Engages 360-degree perimeter threat radar and motion sensors around your laptop.',
      icon: <Eye className="w-4 h-4" />,
      color: 'text-cyan-400 border-cyan-500/40',
      activeBg: 'bg-cyan-950/40 glow-arc-blue',
    },
    {
      id: 'HOUSE_PARTY',
      name: 'House Party Protocol',
      description: 'Broadcasts encrypted Stark Industries handshake to summon all backup armors.',
      icon: <Radio className="w-4 h-4" />,
      color: 'text-purple-400 border-purple-500/40',
      activeBg: 'bg-purple-950/40',
    },
    {
      id: 'CLEAN_SLATE',
      name: 'Clean Slate Protocol',
      description: 'Safely vents all capacitor charges, clears volatile memory, and restores safe idle standby.',
      icon: <RotateCcw className="w-4 h-4" />,
      color: 'text-gray-400 border-gray-600',
      activeBg: 'bg-gray-800/60',
    },
  ];

  return (
    <div className="bg-gray-900/60 border border-cyan-500/20 rounded-xl p-4 flex flex-col backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-950/40 border border-red-500/40 flex items-center justify-center glow-arc-red">
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h3 className="font-tech text-sm font-bold tracking-wider text-red-300">
              STARK DEFENSE & TACTICAL PROTOCOLS
            </h3>
            <p className="text-[11px] text-gray-400 font-sans">
              Authorized Mission Protocols for Miss Lyssandra
            </p>
          </div>
        </div>

        {/* Armor Repair Quick Trigger */}
        <button
          onClick={() => {
            soundFx.playHudBeep('confirm');
            onRepairArmor();
          }}
          disabled={armorIntegrity >= 100}
          className={`px-2.5 py-1 rounded text-xs font-mono-tech flex items-center gap-1.5 border transition-all cursor-pointer ${
            armorIntegrity < 100
              ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50'
              : 'border-gray-800 bg-gray-900 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>NANO-REPAIR HULL ({armorIntegrity}%)</span>
        </button>
      </div>

      {/* Protocol Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 relative z-10">
        {protocols.map((proto) => {
          const isActive = activeProtocol === proto.id;
          return (
            <button
              key={proto.id}
              onClick={() => {
                soundFx.playHudBeep('alert');
                onSetProtocol(isActive ? 'IDLE' : proto.id);
              }}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer relative ${
                isActive
                  ? `${proto.color} ${proto.activeBg}`
                  : 'border-gray-800 bg-gray-950/40 hover:border-gray-700 text-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded bg-gray-900/80 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {proto.icon}
                  </div>
                  <span className="font-tech text-xs font-bold tracking-wide">
                    {proto.name}
                  </span>
                </div>
                {isActive && (
                  <span className="text-[10px] font-mono-tech uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 animate-pulse">
                    ENGAGED
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                {proto.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
