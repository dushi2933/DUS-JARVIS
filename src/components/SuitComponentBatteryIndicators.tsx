import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Plane, 
  BatteryCharging, 
  Cpu, 
  Activity, 
  BatteryMedium,
  Sparkles
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { useToast } from '../context/ToastContext';

interface SuitComponentBatteryProps {
  repulsorCharge: number; // 0 - 100
  armorIntegrity: number; // 0 - 100
  flightStabilizersPower: number; // e.g. 25 - 100
  arcReactorOutputGW: number;
  onRechargeRepulsor?: () => void;
}

interface ComponentBatteryData {
  id: string;
  name: string;
  shortName: string;
  percentage: number;
  color: string;
  glowColor: string;
  bgColor: string;
  icon: React.ReactNode;
  status: string;
  voltage: string;
}

export const SuitComponentBatteryIndicators: React.FC<SuitComponentBatteryProps> = ({
  repulsorCharge,
  armorIntegrity,
  flightStabilizersPower,
  arcReactorOutputGW,
  onRechargeRepulsor,
}) => {
  const { addToast } = useToast();

  // Calculate dynamic battery percentages for each component
  // Repulsors: baseline minimum 15% + charge
  const repulsorBattery = Math.min(100, Math.max(12, Math.round(15 + (repulsorCharge * 0.85))));
  // Shield: tied to armor integrity and power routing
  const shieldBattery = Math.min(100, Math.max(20, Math.round(armorIntegrity)));
  // Flight: calculated based on stabilizers power and velocity load
  const flightBattery = Math.min(100, Math.max(25, Math.round(75 + (flightStabilizersPower / 4))));
  // Auxiliary Nanite Core
  const auxCoreBattery = Math.min(100, Math.max(30, Math.round(92 + (arcReactorOutputGW > 4 ? 6 : 0))));

  const components: ComponentBatteryData[] = [
    {
      id: 'repulsors',
      name: 'Repulsors Battery',
      shortName: 'REPULSORS',
      percentage: repulsorBattery,
      color: '#06b6d4', // cyan-500
      glowColor: 'rgba(6, 182, 212, 0.4)',
      bgColor: 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300',
      icon: <Zap className="w-3.5 h-3.5 text-cyan-400" />,
      status: repulsorCharge > 0 ? 'ARMED & READY' : 'STANDBY',
      voltage: '14.8 kV',
    },
    {
      id: 'shield',
      name: 'Kinetic Shield Battery',
      shortName: 'SHIELD',
      percentage: shieldBattery,
      color: '#10b981', // emerald-500
      glowColor: 'rgba(16, 185, 129, 0.4)',
      bgColor: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
      status: armorIntegrity > 80 ? 'DEFENSE 100%' : 'ABSORBING',
      voltage: '24.2 kV',
    },
    {
      id: 'flight',
      name: 'Flight Stabilizers Battery',
      shortName: 'FLIGHT',
      percentage: flightBattery,
      color: '#f59e0b', // amber-500
      glowColor: 'rgba(245, 158, 11, 0.4)',
      bgColor: 'bg-amber-950/60 border-amber-500/40 text-amber-300',
      icon: <Plane className="w-3.5 h-3.5 text-amber-400" />,
      status: 'THRUST NOMINAL',
      voltage: '48.0 kV',
    },
    {
      id: 'aux',
      name: 'Aux Core Nanite Battery',
      shortName: 'AUX CORE',
      percentage: auxCoreBattery,
      color: '#a855f7', // purple-500
      glowColor: 'rgba(168, 85, 247, 0.4)',
      bgColor: 'bg-purple-950/60 border-purple-500/40 text-purple-300',
      icon: <Cpu className="w-3.5 h-3.5 text-purple-400" />,
      status: 'NANITES ACTIVE',
      voltage: '5.2 GW',
    },
  ];

  // SVG Circular Gauge Calculations
  const radius = 22;
  const strokeWidth = 3.5;
  const circumference = 2 * Math.PI * radius; // ~138.23

  const handleComponentClick = (comp: ComponentBatteryData) => {
    soundFx.playHudBeep('mode');
    if (comp.id === 'repulsors' && onRechargeRepulsor) {
      onRechargeRepulsor();
    }
    addToast({
      title: `${comp.name}: ${comp.percentage}%`,
      message: `Voltage: ${comp.voltage} · Status: ${comp.status}`,
      type: 'status',
    });
  };

  return (
    <div className="w-full bg-gray-950/85 border border-cyan-500/30 rounded-xl p-3 shadow-xl backdrop-blur-md relative overflow-hidden select-none group hover:border-cyan-400/50 transition-all">
      <div className="absolute inset-0 holo-grid opacity-15 pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-2.5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <BatteryCharging className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-tech text-xs font-bold text-cyan-200 tracking-wider flex items-center gap-1.5">
              <span>SUIT COMPONENT BATTERY MATRIX</span>
              <span className="text-[9px] font-mono-tech px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                CIRCULAR TELEMETRY
              </span>
            </h4>
          </div>
        </div>

        <div className="text-[10px] font-mono-tech text-gray-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-semibold">CELLS SYNCHRONIZED</span>
        </div>
      </div>

      {/* Series of Small Circular Battery Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 relative z-10">
        {components.map((comp) => {
          const strokeDashoffset = circumference - (comp.percentage / 100) * circumference;

          return (
            <div
              key={comp.id}
              onClick={() => handleComponentClick(comp)}
              className="bg-gray-900/80 border border-gray-800 hover:border-gray-700 p-2.5 rounded-xl flex items-center gap-3 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] group/card shadow-inner"
              title={`Click to inspect ${comp.name}`}
            >
              {/* Circular SVG Battery Ring */}
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 52 52">
                  {/* Background Track Circle */}
                  <circle
                    cx="26"
                    cy="26"
                    r={radius}
                    fill="none"
                    stroke="#1f2937"
                    strokeWidth={strokeWidth}
                  />

                  {/* Colored Battery Life Progress Stroke */}
                  <circle
                    cx="26"
                    cy="26"
                    r={radius}
                    fill="none"
                    stroke={comp.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                    style={{
                      filter: `drop-shadow(0 0 4px ${comp.glowColor})`,
                    }}
                  />
                </svg>

                {/* Center Percentage Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center font-mono-tech">
                  <span className="text-[11px] font-extrabold text-white leading-none">
                    {comp.percentage}
                  </span>
                  <span className="text-[8px] text-gray-400 leading-none mt-0.5">
                    %
                  </span>
                </div>
              </div>

              {/* Component Label & Status Readout */}
              <div className="flex-1 min-w-0 font-mono-tech">
                <div className="flex items-center gap-1">
                  {comp.icon}
                  <span className="font-tech text-xs font-bold text-gray-200 tracking-wider truncate">
                    {comp.shortName}
                  </span>
                </div>
                <div className="text-[10px] font-bold mt-0.5 truncate" style={{ color: comp.color }}>
                  {comp.status}
                </div>
                <div className="text-[9px] text-gray-500">
                  {comp.voltage}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
