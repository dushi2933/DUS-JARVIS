import React, { useState } from 'react';
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Sword, 
  Crosshair, 
  Flame, 
  Activity, 
  RefreshCw, 
  Sliders, 
  Radio, 
  Check, 
  Layers, 
  Cpu, 
  Maximize2 
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useToast } from '../context/ToastContext';

export type NanotechWeaponType = 
  | 'ENERGY_BLADE'
  | 'NANO_SHIELD'
  | 'LIGHTNING_REFOCUSER'
  | 'BATTERING_RAMS'
  | 'WING_THRUSTERS'
  | 'PLASMA_CANNON';

interface NanoWeaponConfig {
  id: NanotechWeaponType;
  name: string;
  codeName: string;
  powerDrawGW: number;
  armorMark: 'MARK-50' | 'MARK-85';
  damageRating: number;
  defenseRating: number;
  description: string;
  icon: React.ReactNode;
  particlesCount: number;
  firstUsed: string;
}

export const NanotechWeaponsForge: React.FC = () => {
  const { addToast } = useToast();

  const [activeWeapon, setActiveWeapon] = useState<NanotechWeaponType>('ENERGY_BLADE');
  const [isMorphing, setIsMorphing] = useState<boolean>(false);
  const [naniteReservoirPercent, setNaniteReservoirPercent] = useState<number>(88);

  const weapons: NanoWeaponConfig[] = [
    {
      id: 'ENERGY_BLADE',
      name: 'Nanotech Vibranium Blade',
      codeName: 'KATAR / ENERGY PIKE',
      powerDrawGW: 2.4,
      armorMark: 'MARK-50',
      damageRating: 94,
      defenseRating: 40,
      description: 'Solidified liquid nanite cutting edge with high-frequency thermal edge capable of slicing through alien alloys and drawing blood from Thanos.',
      icon: <Sword className="w-5 h-5 text-amber-400" />,
      particlesCount: 420000,
      firstUsed: 'Avengers: Infinity War (Titan Battle)',
    },
    {
      id: 'NANO_SHIELD',
      name: 'Hexagonal Energy Shield',
      codeName: 'AEGIS BARRIER',
      powerDrawGW: 3.8,
      armorMark: 'MARK-50',
      damageRating: 20,
      defenseRating: 99,
      description: 'Broad interlocking nanite shield plate that channels Arc Reactor energy into a deflective electromagnetic forcefield absorbing Power Stone blasts.',
      icon: <Shield className="w-5 h-5 text-cyan-400" />,
      particlesCount: 650000,
      firstUsed: 'Avengers: Infinity War (New York Battle)',
    },
    {
      id: 'LIGHTNING_REFOCUSER',
      name: 'Lightning Refocuser Back Array',
      codeName: 'MJÖLNIR CHANNELER',
      powerDrawGW: 6.2,
      armorMark: 'MARK-85',
      damageRating: 100,
      defenseRating: 65,
      description: 'Six dorsal nanite arms unfurl behind Tony to capture Thor\'s lightning strikes and refocus the cosmic electrical energy into a supercharged unibeam.',
      icon: <Zap className="w-5 h-5 text-amber-300" />,
      particlesCount: 880000,
      firstUsed: 'Avengers: Endgame (Avengers Compound Ruins)',
    },
    {
      id: 'BATTERING_RAMS',
      name: 'Heavy Battering Rams',
      codeName: 'HAMMER GAUNTLETS',
      powerDrawGW: 4.1,
      armorMark: 'MARK-50',
      damageRating: 96,
      defenseRating: 80,
      description: 'Expands the forearm nanite mass into oversized pneumatic club gauntlets with kinetic thrusters for devastating close-quarters impacts.',
      icon: <Activity className="w-5 h-5 text-red-400" />,
      particlesCount: 540000,
      firstUsed: 'Avengers: Infinity War (Titan Battle vs Thanos)',
    },
    {
      id: 'WING_THRUSTERS',
      name: 'Zero-G Conformal Wing Thrusters',
      codeName: 'VALKYRIE FLIGHT PODS',
      powerDrawGW: 5.0,
      armorMark: 'MARK-50',
      damageRating: 45,
      defenseRating: 50,
      description: 'Aerodynamic nanite wings that deploy from Tony\'s back, boosting flight acceleration to Mach 8+ in vacuum or orbital re-entry.',
      icon: <Flame className="w-5 h-5 text-orange-400" />,
      particlesCount: 710000,
      firstUsed: 'Avengers: Infinity War (Q-Ship Chase)',
    },
    {
      id: 'PLASMA_CANNON',
      name: 'Quad-Barrel Plasma Cannons',
      codeName: 'REPULSOR GATLING',
      powerDrawGW: 5.5,
      armorMark: 'MARK-85',
      damageRating: 98,
      defenseRating: 30,
      description: 'Forearm and shoulder clusters morph into rapid-cycling high-density plasma blasters firing 40 concentrated bolts per second.',
      icon: <Crosshair className="w-5 h-5 text-emerald-400" />,
      particlesCount: 620000,
      firstUsed: 'Avengers: Endgame (Final Battle)',
    },
  ];

  const current = weapons.find((w) => w.id === activeWeapon) || weapons[0];

  const handleMorphToWeapon = (id: NanotechWeaponType) => {
    if (isMorphing) return;
    setIsMorphing(true);
    soundFx.playRepulsorCharge();
    soundFx.playHudBeep('mode');

    const targetWeapon = weapons.find((w) => w.id === id);
    jarvisVoice.speak(`Morphing nanotech configuration to ${targetWeapon?.name}. Flowing ${targetWeapon?.particlesCount.toLocaleString()} smart nanites.`);

    setTimeout(() => {
      soundFx.playRepulsorBlast();
      setActiveWeapon(id);
      setIsMorphing(false);
      setNaniteReservoirPercent((prev) => Math.max(20, prev - 4));

      addToast({
        title: `${targetWeapon?.name} Deployed!`,
        message: `Nanotech matrix solidified into ${targetWeapon?.codeName}.`,
        type: 'protocol',
      });
    }, 1100);
  };

  const handleReplenishNanites = () => {
    soundFx.playHudBeep('confirm');
    setNaniteReservoirPercent(100);
    jarvisVoice.speak('Nanite storage housing fully replenished from RT-08 chest reservoir.');
    addToast({
      title: 'Nanite Reservoir Restored',
      message: '100% capacity (1,200,000 smart particles available).',
      type: 'protocol',
    });
  };

  return (
    <div className="bg-gray-950/90 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md relative min-h-[640px] flex flex-col p-4 gap-4 select-none">
      <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tech text-base font-bold text-cyan-200 tracking-wider">
                MARK 50 / 85 // NANOTECH WEAPONS MORPHING FORGE
              </h2>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded border border-cyan-500/40 bg-cyan-950/80 text-cyan-300 uppercase font-bold animate-pulse">
                {isMorphing ? 'PARTICLE FLUIDITY: ACTIVE' : 'NANITE MATRIX: SOLIDIFIED'}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans">
              Liquid smart-metal molecular shape-shifting: blades, energy shields, lightning refocusers, and plasma cannons
            </p>
          </div>
        </div>

        {/* Reservoir Capacity */}
        <div className="flex items-center gap-2">
          <div className="bg-gray-900 px-3 py-1.5 rounded-xl border border-gray-800 text-xs font-mono-tech text-cyan-300 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>NANITE LEVEL: {naniteReservoirPercent}%</span>
          </div>
          <button
            onClick={handleReplenishNanites}
            className="p-2 rounded-xl bg-gray-900 border border-gray-800 hover:border-cyan-400 text-gray-300 cursor-pointer"
            title="Replenish nanite reservoir"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Forge Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
        
        {/* Left Column: Real-Time Nanotech Morphing Hologram Chamber (7 Cols) */}
        <div className="lg:col-span-7 bg-gray-950/95 border border-cyan-500/30 rounded-2xl relative overflow-hidden flex flex-col items-center justify-between p-6 min-h-[460px] shadow-inner">
          
          <div className="w-full flex items-center justify-between text-xs font-mono-tech border-b border-gray-800 pb-2">
            <span className="text-gray-400">CLASS: {current.armorMark} SMART NANITES</span>
            <span className="text-cyan-400 font-bold">
              PARTICLES: {current.particlesCount.toLocaleString()} ACTIVE
            </span>
          </div>

          {/* Morphing Chamber Visual */}
          <div className="my-auto flex flex-col items-center gap-4 text-center">
            <div className={`w-52 h-52 rounded-3xl border-2 border-cyan-500/60 bg-cyan-950/20 flex items-center justify-center relative shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all duration-500 ${
              isMorphing ? 'scale-110 border-amber-400 animate-pulse' : ''
            }`}>
              
              {/* Central Weapon Icon Hologram */}
              <div className={`scale-175 transition-all ${isMorphing ? 'blur-sm rotate-45' : ''}`}>
                {current.icon}
              </div>

              {/* Pulsing Nanite Mesh Orbit */}
              <div className="absolute -inset-3 rounded-3xl border border-dashed border-cyan-400/40 animate-spin-slow pointer-events-none" />
              
              {/* Particle Stream Dots */}
              {isMorphing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full border-4 border-amber-400/60 rounded-3xl animate-ping" />
                </div>
              )}
            </div>

            <div>
              <span className="text-xs font-mono-tech text-amber-400 font-bold tracking-widest uppercase">
                {isMorphing ? 'RECONFIGURING LIQUID NANOMATRIX...' : current.codeName}
              </span>
              <h3 className="font-tech text-2xl font-bold text-white tracking-widest mt-0.5">
                {current.name}
              </h3>
              <p className="text-xs text-gray-400 font-sans max-w-md mt-1 leading-relaxed">
                {current.description}
              </p>
            </div>

            {/* Combat Power & Defense Ratings */}
            <div className="w-full max-w-md grid grid-cols-2 gap-2 bg-gray-900 p-2.5 rounded-xl border border-gray-800 font-mono-tech text-xs">
              <div>
                <span className="text-gray-500 block text-[10px]">OFFENSIVE IMPACT</span>
                <span className="text-red-400 font-bold">{current.damageRating} / 100</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px]">DEFENSIVE RATING</span>
                <span className="text-emerald-400 font-bold">{current.defenseRating} / 100</span>
              </div>
            </div>
          </div>

          {/* Morph Confirmation Bar */}
          <div className="w-full text-center text-[10px] font-mono-tech text-gray-500 pt-2 border-t border-gray-800">
            FIRST DEPLOYMENT: {current.firstUsed.toUpperCase()}
          </div>
        </div>

        {/* Right Column: Weapons Selection Directory (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="bg-gray-900/90 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col gap-2.5">
            <span className="font-tech text-xs font-bold text-cyan-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-800 pb-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>NANOMORPH WEAPON DIRECTORY</span>
            </span>

            <div className="space-y-2">
              {weapons.map((w) => {
                const isActive = activeWeapon === w.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => handleMorphToWeapon(w.id)}
                    disabled={isMorphing}
                    className={`w-full p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                      isActive
                        ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg'
                        : 'bg-gray-950 border-gray-800 hover:border-gray-700 text-gray-400'
                    }`}
                  >
                    <div className="mt-0.5">{w.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-tech text-xs font-bold text-white tracking-wider">
                          {w.name}
                        </span>
                        <span className="text-[9px] font-mono-tech px-1.5 py-0.2 rounded bg-black/60 text-cyan-300 border border-gray-800">
                          {w.powerDrawGW} GW
                        </span>
                      </div>
                      <p className="text-[10px] font-sans text-gray-400 mt-0.5 line-clamp-1">
                        {w.description}
                      </p>
                      <div className="flex items-center justify-between text-[9px] font-mono-tech text-gray-500 mt-1">
                        <span>{w.armorMark}</span>
                        <span className={isActive ? 'text-amber-400 font-bold' : ''}>
                          {isActive ? 'DEPLOYED' : 'READY TO MORPH'}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
