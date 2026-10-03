import React, { useState } from 'react';
import { 
  Shield, 
  Cpu, 
  Zap, 
  Flame, 
  Layers, 
  Crosshair, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  RotateCw,
  Wrench,
  ChevronRight,
  Eye,
  Disc
} from 'lucide-react';
import { SuitPartCategory, SuitSubsystemPart } from '../types/suitParts';
import { ArmorMark } from '../types/gauntlet';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useToast } from '../context/ToastContext';

interface SuitPartsInspectorProps {
  currentMark: ArmorMark;
  onFireRepulsor: () => void;
  onChargeRepulsor: (level: number) => void;
}

export const SuitPartsInspector: React.FC<SuitPartsInspectorProps> = ({
  currentMark,
  onFireRepulsor,
  onChargeRepulsor,
}) => {
  const { addToast } = useToast();
  const [selectedPartId, setSelectedPartId] = useState<SuitPartCategory>('chest');
  const [isCalibrating, setIsCalibrating] = useState(false);

  const suitParts: Record<SuitPartCategory, SuitSubsystemPart> = {
    helmet: {
      id: 'helmet',
      name: 'Tactical Helmet & HUD Optics',
      codename: 'OCULAR-TARGETING-MK8',
      location: 'Cranial Assembly',
      integrity: 100,
      powerDrawGW: 0.35,
      tempKelvin: 298,
      status: 'OPTIMAL',
      keyFeatures: [
        'Retinal eye-tracking & multi-target lock reticles',
        'Atmospheric environmental life support & filtration',
        'Stark Industries satellite neural uplink (0.8ms latency)',
        'Vocal acoustic frequency synthesizer (J.A.R.V.I.S. Core)',
      ],
      operationalSpecs: {
        material: 'Gold-Titanium & Nanocrystal Polycarbonate',
        voltageOrThrust: '48V Optical Matrix',
        coolingType: 'Passive Thermoelectric Micro-channels',
        responseTimeMs: 0.8,
      },
      actions: [
        { label: 'Calibrate HUD Reticle', actionId: 'cal_hud', description: 'Align dual-eye holographic targeting crosshairs.' },
        { label: 'Pressurize Oxygen Seal', actionId: 'pressurize', description: 'Lock cranial seals for space / sub-orbital flight.' },
      ],
    },
    chest: {
      id: 'chest',
      name: 'Thoracic Chassis & Arc Uni-Beam',
      codename: 'CHEST-CORE-UNIBEAM',
      location: 'Thoracic Sternum',
      integrity: 100,
      powerDrawGW: 4.5,
      tempKelvin: 325,
      status: 'OPTIMAL',
      keyFeatures: [
        'Central Arc Reactor containment chamber & power coupler',
        'Concussive Uni-Beam focused plasma emitter',
        'High-density nanite storage reservoir (billions of particles)',
        'Kinetic deflection chestplate (absorbs up to 50 metric tons)',
      ],
      operationalSpecs: {
        material: 'Quantum Vibranium Weave & Nanite Housing',
        voltageOrThrust: '4.5 Gigawatts Sustained Output',
        coolingType: 'Active Liquid Helium Torus Loop',
        responseTimeMs: 0.2,
      },
      actions: [
        { label: 'Prime Uni-Beam Focus', actionId: 'prime_unibeam', description: 'Overcharge central chest emitter for wide-angle blast.' },
        { label: 'Cycle Nanite Reservoir', actionId: 'cycle_nanites', description: 'Distribute nanite particles across armor matrix.' },
      ],
    },
    gauntletRight: {
      id: 'gauntletRight',
      name: 'Right Forearm Gauntlet & Repulsor',
      codename: 'REPULSOR-PRIMARY-RIGHT',
      location: 'Right Forearm & Palm',
      integrity: 100,
      powerDrawGW: 1.2,
      tempKelvin: 310,
      status: 'OPTIMAL',
      keyFeatures: [
        'Variable-geometry palm repulsor concussive emitter',
        'Wrist-mounted micro-missile launch bay (6 projectiles)',
        'High-frequency carbon-dioxide cutting laser (200W)',
        'Five-finger motorized kinematic servo grips (2.4 ton force)',
      ],
      operationalSpecs: {
        material: 'Gold-Titanium knuckle plating & Carbon fiber',
        voltageOrThrust: '850 kV Repulsor Pulse Output',
        coolingType: 'Thermal Exhaust Forearm Vents',
        responseTimeMs: 0.4,
      },
      actions: [
        { label: 'Charge Palm Repulsor (100%)', actionId: 'charge_rep', description: 'Prime right palm capacitor to maximum voltage.' },
        { label: 'Discharge Concussive Blast', actionId: 'fire_blast', description: 'Fire high-yield concussive kinetic pulse.' },
      ],
    },
    gauntletLeft: {
      id: 'gauntletLeft',
      name: 'Left Forearm Gauntlet & Energy Shield',
      codename: 'SHIELD-NANO-LEFT',
      location: 'Left Forearm & Palm',
      integrity: 100,
      powerDrawGW: 0.95,
      tempKelvin: 305,
      status: 'OPTIMAL',
      keyFeatures: [
        'Vibranium-nanite energy shield projector',
        'Sonic disrupter cannon for non-lethal crowd suppression',
        'Integrated wireless diagnostic datalink interface',
        'Auxiliary magnetic repulsor steering coil',
      ],
      operationalSpecs: {
        material: 'Nanite Matrix & Vibranium Micro-Mesh',
        voltageOrThrust: '350 kHz Shield Resonance Barrier',
        coolingType: 'Solid-State Heat Sinks',
        responseTimeMs: 0.5,
      },
      actions: [
        { label: 'Deploy Nano-Shield', actionId: 'deploy_shield', description: 'Project hard-light hexagonal kinetic energy barrier.' },
        { label: 'Sonic Disrupter Pulse', actionId: 'sonic_pulse', description: 'Emit 140dB directional acoustic deterrent shockwave.' },
      ],
    },
    backFlight: {
      id: 'backFlight',
      name: 'Flight Stabilizers & Back Air Brakes',
      codename: 'STABILIZER-FLAPS-AERO',
      location: 'Dorsal Upper Back',
      integrity: 100,
      powerDrawGW: 1.1,
      tempKelvin: 340,
      status: 'OPTIMAL',
      keyFeatures: [
        'Dual articulated aerodynamic flaps for supersonic deceleration',
        'Micro-thruster pitch and yaw attitude reaction controls',
        'Anti-radar thermal dissipation exhaust channels',
        'Auxiliary repulsor winglets for Mach 3+ stability',
      ],
      operationalSpecs: {
        material: 'Heat-Treated Titanium-Cobalt Alloy',
        voltageOrThrust: '12,000 N Aerodynamic Braking Force',
        coolingType: 'Ram-Air Cryogenic Ducts',
        responseTimeMs: 1.2,
      },
      actions: [
        { label: 'Actuate Air Brake Flaps', actionId: 'test_flaps', description: 'Test servo deployment of dorsal deceleration flaps.' },
        { label: 'Purge Heat Dissipators', actionId: 'purge_heat', description: 'Vent thermal buildup from supersonic flight.' },
      ],
    },
    shoulders: {
      id: 'shoulders',
      name: 'Shoulder Munition Clusters',
      codename: 'SHOULDER-POD-CLUSTER',
      location: 'Left & Right Deltoids',
      integrity: 100,
      powerDrawGW: 0.4,
      tempKelvin: 300,
      status: 'OPTIMAL',
      keyFeatures: [
        'Dual concealed micro-missile silos (12 darts per pod)',
        'Armor-piercing depleted uranium kinetic darts',
        'Infrared guidance tracking sensors with 360° lock',
        'Pop-up motorized stealth cowlings',
      ],
      operationalSpecs: {
        material: 'Ballistic Composite & Kevlar-Titanium Layer',
        voltageOrThrust: 'Micro-Pneumatic Dart Ejection',
        coolingType: 'Convection Air Flow',
        responseTimeMs: 0.7,
      },
      actions: [
        { label: 'Deploy Shoulder Pods', actionId: 'open_shoulders', description: 'Extend motorized missile silos from deltoid cowlings.' },
        { label: 'Run Ordinance Inventory', actionId: 'inventory_ord', description: 'Verify projectile count and seeker heads.' },
      ],
    },
    hipPods: {
      id: 'hipPods',
      name: 'Hip Pods & Flare Countermeasures',
      codename: 'HIP-POD-FLARES',
      location: 'Pelvic Lateral Flanks',
      integrity: 100,
      powerDrawGW: 0.25,
      tempKelvin: 295,
      status: 'OPTIMAL',
      keyFeatures: [
        'Magnesium/Teflon anti-missile infrared decoy flares',
        'High-impact kinetic shock dampeners for rough landings',
        'Emergency reserve lithium-sulfur capacitor pack',
        'Magnetic side-holster clamps for tactical ordnance',
      ],
      operationalSpecs: {
        material: 'Impact-Resistant Titanium Skeleton',
        voltageOrThrust: 'Pyrotechnic Flare Ejection',
        coolingType: 'Passive Thermal Shielding',
        responseTimeMs: 0.3,
      },
      actions: [
        { label: 'Discharge Decoy Flares', actionId: 'fire_flares', description: 'Eject magnesium countermeasures against heat-seeking missiles.' },
        { label: 'Test Shock Dampeners', actionId: 'test_shocks', description: 'Cycle pelvic hydraulic shock absorption pistons.' },
      ],
    },
    bootJets: {
      id: 'bootJets',
      name: 'Boot Flight Thrusters & Repulsor Jets',
      codename: 'THRUSTERS-BOOT-SUPERSONIC',
      location: 'Lower Legs & Soles',
      integrity: 100,
      powerDrawGW: 2.8,
      tempKelvin: 520,
      status: 'OPTIMAL',
      keyFeatures: [
        'High-density vectoring repulsor flight nozzles',
        'Variable thrust ceiling capable of Mach 4.2 dash speed',
        'Ground touchdown kinetic energy dissipation soles',
        'Internal gyroscopic attitude stabilization computers',
      ],
      operationalSpecs: {
        material: 'Tungsten-Carbide Nozzle Ring & Heat Shield',
        voltageOrThrust: '45,000 N Peak Flight Thrust per Boot',
        coolingType: 'Cryogenic Liquid Nitrogen Pulse Loop',
        responseTimeMs: 0.1,
      },
      actions: [
        { label: 'Ignite Flight Thruster Burst', actionId: 'fire_thrusters', description: 'Execute vertical thrust surge for rapid altitude climb.' },
        { label: 'Gimbal Vectoring Nozzles', actionId: 'gimbal_nozzles', description: 'Calibrate multi-axis thrust vectoring angles.' },
      ],
    },
  };

  const currentPart = suitParts[selectedPartId];

  const handleExecutePartAction = (actionId: string, label: string) => {
    soundFx.playHudBeep('mode');
    setIsCalibrating(true);

    if (actionId === 'charge_rep') {
      onChargeRepulsor(100);
      soundFx.playRepulsorCharge();
    } else if (actionId === 'fire_blast') {
      onFireRepulsor();
    } else if (actionId === 'prime_unibeam') {
      soundFx.playRepulsorCharge(2000);
      setTimeout(() => {
        soundFx.playRepulsorBlast();
      }, 1000);
    } else {
      soundFx.playHudBeep('confirm');
    }

    setTimeout(() => {
      setIsCalibrating(false);
      jarvisVoice.speak(`${label} completed for ${currentPart.name}, Mr. Stark.`);
      addToast({
        title: `Subsystem Action: ${label}`,
        message: `${currentPart.name} calibrated successfully. Telemetry verified nominal.`,
        type: 'tactical',
      });
    }, 900);
  };

  return (
    <div className="bg-gray-900/60 border border-cyan-500/20 rounded-xl p-4 flex flex-col gap-4 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-400/50 flex items-center justify-center glow-arc-gold">
            <Layers className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h3 className="font-tech text-sm font-bold tracking-wider text-amber-200 uppercase flex items-center gap-2">
              <span>IRON MAN SUIT SUBSYSTEM & COMPONENT INSPECTOR</span>
              <span className="text-[10px] text-cyan-400 font-mono-tech">[{currentMark}]</span>
            </h3>
            <p className="text-[11px] text-gray-400 font-sans">
              Subsystem diagnostics across Helmet, Uni-Beam, Gauntlets, Flaps, and Boot Jets
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono-tech text-gray-400">CHASSIS HEALTH:</span>
          <span className="text-emerald-400 font-mono-tech font-bold text-xs">100% NOMINAL</span>
        </div>
      </div>

      {/* Main Grid: Interactive Full Body Suit Blueprint & Component Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
        
        {/* Left Interactive Full Body Armor Blueprint (5 Cols) */}
        <div className="lg:col-span-5 bg-gray-950/80 border border-cyan-500/30 rounded-xl p-4 flex flex-col items-center justify-center relative min-h-[460px]">
          <div className="text-[11px] font-mono-tech text-cyan-300 mb-2 flex items-center gap-1.5 self-start">
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            <span>CLICK ANY ARMOR COMPONENT TO INSPECT:</span>
          </div>

          {/* Interactive SVG Full Suit Anatomy */}
          <div className="relative w-full max-w-xs flex items-center justify-center">
            <svg viewBox="0 0 300 480" className="w-full h-auto drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              {/* Outer Hologram Radial Target Ring */}
              <circle cx="150" cy="240" r="190" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="6 6" opacity="0.25" />
              <circle cx="150" cy="240" r="140" fill="none" stroke="#eab308" strokeWidth="1" strokeDasharray="12 8" opacity="0.2" />

              {/* 1. Helmet Hotspot */}
              <g 
                onClick={() => {
                  soundFx.playHudBeep('subtle');
                  setSelectedPartId('helmet');
                }}
                className="cursor-pointer group"
              >
                <rect 
                  x="132" y="30" width="36" height="42" rx="8" 
                  fill={selectedPartId === 'helmet' ? '#ef4444' : '#7f1d1d'} 
                  stroke={selectedPartId === 'helmet' ? '#38bdf8' : '#f59e0b'} 
                  strokeWidth={selectedPartId === 'helmet' ? '2.5' : '1.5'} 
                  className="transition-all"
                />
                {/* Eyes glowing */}
                <line x1="138" y1="48" x2="147" y2="48" stroke="#ffffff" strokeWidth="2.5" />
                <line x1="153" y1="48" x2="162" y2="48" stroke="#ffffff" strokeWidth="2.5" />
              </g>

              {/* 2. Shoulders Hotspot */}
              <g 
                onClick={() => {
                  soundFx.playHudBeep('subtle');
                  setSelectedPartId('shoulders');
                }}
                className="cursor-pointer group"
              >
                <rect 
                  x="80" y="78" width="38" height="24" rx="5" 
                  fill={selectedPartId === 'shoulders' ? '#f59e0b' : '#b45309'} 
                  stroke={selectedPartId === 'shoulders' ? '#38bdf8' : '#eab308'} 
                  strokeWidth={selectedPartId === 'shoulders' ? '2' : '1'} 
                />
                <rect 
                  x="182" y="78" width="38" height="24" rx="5" 
                  fill={selectedPartId === 'shoulders' ? '#f59e0b' : '#b45309'} 
                  stroke={selectedPartId === 'shoulders' ? '#38bdf8' : '#eab308'} 
                  strokeWidth={selectedPartId === 'shoulders' ? '2' : '1'} 
                />
              </g>

              {/* 3. Chest Plate & Uni-Beam Hotspot */}
              <g 
                onClick={() => {
                  soundFx.playHudBeep('subtle');
                  setSelectedPartId('chest');
                }}
                className="cursor-pointer group"
              >
                <polygon 
                  points="118,75 182,75 190,140 150,165 110,140" 
                  fill={selectedPartId === 'chest' ? '#b91c1c' : '#450a0a'} 
                  stroke={selectedPartId === 'chest' ? '#38bdf8' : '#f59e0b'} 
                  strokeWidth={selectedPartId === 'chest' ? '2.5' : '1.5'} 
                  className="transition-all"
                />
                {/* Arc Reactor Uni-Beam Core */}
                <circle 
                  cx="150" cy="115" r="14" 
                  fill="#ffffff" 
                  stroke="#38bdf8" 
                  strokeWidth="3" 
                  className="animate-pulse"
                />
                <circle cx="150" cy="115" r="7" fill="#0284c7" />
              </g>

              {/* 4. Back Flight Flaps Hotspot (Indicated Behind Torso) */}
              <g 
                onClick={() => {
                  soundFx.playHudBeep('subtle');
                  setSelectedPartId('backFlight');
                }}
                className="cursor-pointer group"
              >
                <rect 
                  x="60" y="105" width="22" height="35" rx="3" 
                  fill={selectedPartId === 'backFlight' ? '#38bdf8' : '#0369a1'} 
                  stroke={selectedPartId === 'backFlight' ? '#ffffff' : '#0284c7'} 
                  strokeWidth="1.5" 
                />
                <rect 
                  x="218" y="105" width="22" height="35" rx="3" 
                  fill={selectedPartId === 'backFlight' ? '#38bdf8' : '#0369a1'} 
                  stroke={selectedPartId === 'backFlight' ? '#ffffff' : '#0284c7'} 
                  strokeWidth="1.5" 
                />
              </g>

              {/* 5. Right Gauntlet Hotspot */}
              <g 
                onClick={() => {
                  soundFx.playHudBeep('subtle');
                  setSelectedPartId('gauntletRight');
                }}
                className="cursor-pointer group"
              >
                <rect 
                  x="68" y="145" width="22" height="65" rx="4" 
                  fill={selectedPartId === 'gauntletRight' ? '#ef4444' : '#7f1d1d'} 
                  stroke={selectedPartId === 'gauntletRight' ? '#38bdf8' : '#f59e0b'} 
                  strokeWidth={selectedPartId === 'gauntletRight' ? '2' : '1'} 
                />
                {/* Palm Repulsor */}
                <circle cx="79" cy="200" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
              </g>

              {/* 6. Left Gauntlet Hotspot */}
              <g 
                onClick={() => {
                  soundFx.playHudBeep('subtle');
                  setSelectedPartId('gauntletLeft');
                }}
                className="cursor-pointer group"
              >
                <rect 
                  x="210" y="145" width="22" height="65" rx="4" 
                  fill={selectedPartId === 'gauntletLeft' ? '#ef4444' : '#7f1d1d'} 
                  stroke={selectedPartId === 'gauntletLeft' ? '#38bdf8' : '#f59e0b'} 
                  strokeWidth={selectedPartId === 'gauntletLeft' ? '2' : '1'} 
                />
                {/* Shield emitter */}
                <circle cx="221" cy="200" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
              </g>

              {/* 7. Hip Pods Hotspot */}
              <g 
                onClick={() => {
                  soundFx.playHudBeep('subtle');
                  setSelectedPartId('hipPods');
                }}
                className="cursor-pointer group"
              >
                <rect 
                  x="115" y="170" width="70" height="30" rx="4" 
                  fill={selectedPartId === 'hipPods' ? '#f59e0b' : '#78350f'} 
                  stroke={selectedPartId === 'hipPods' ? '#38bdf8' : '#d97706'} 
                  strokeWidth={selectedPartId === 'hipPods' ? '2' : '1'} 
                />
              </g>

              {/* Legs Thighs */}
              <rect x="120" y="205" width="26" height="95" rx="6" fill="#b91c1c" stroke="#f59e0b" strokeWidth="1" />
              <rect x="154" y="205" width="26" height="95" rx="6" fill="#b91c1c" stroke="#f59e0b" strokeWidth="1" />

              {/* 8. Boot Flight Thrusters Hotspot */}
              <g 
                onClick={() => {
                  soundFx.playHudBeep('subtle');
                  setSelectedPartId('bootJets');
                }}
                className="cursor-pointer group"
              >
                <rect 
                  x="116" y="305" width="30" height="75" rx="6" 
                  fill={selectedPartId === 'bootJets' ? '#eab308' : '#713f12'} 
                  stroke={selectedPartId === 'bootJets' ? '#38bdf8' : '#f59e0b'} 
                  strokeWidth={selectedPartId === 'bootJets' ? '2' : '1'} 
                />
                <rect 
                  x="154" y="305" width="30" height="75" rx="6" 
                  fill={selectedPartId === 'bootJets' ? '#eab308' : '#713f12'} 
                  stroke={selectedPartId === 'bootJets' ? '#38bdf8' : '#f59e0b'} 
                  strokeWidth={selectedPartId === 'bootJets' ? '2' : '1'} 
                />
                {/* Thruster exhaust flames */}
                <ellipse cx="131" cy="385" rx="10" ry="8" fill="#38bdf8" opacity="0.8" />
                <ellipse cx="169" cy="385" rx="10" ry="8" fill="#38bdf8" opacity="0.8" />
              </g>
            </svg>
          </div>

          <div className="text-[10px] text-gray-500 font-mono-tech mt-2 text-center">
            SELECTED: <span className="text-cyan-300 font-bold">{currentPart.name}</span>
          </div>
        </div>

        {/* Right Detail Telemetry Panel (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          
          {/* Subsystem Name & Codename Banner */}
          <div className="bg-gray-950/80 border border-cyan-500/30 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <div>
                <span className="text-[10px] font-mono-tech text-gray-400 block uppercase">
                  COMPONENT SUBSYSTEM:
                </span>
                <h4 className="font-tech text-base font-bold text-cyan-200">
                  {currentPart.name}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono-tech px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-bold">
                  STATUS: {currentPart.status}
                </span>
                <span className="text-[10px] text-gray-500 font-mono-tech block mt-0.5">
                  {currentPart.codename}
                </span>
              </div>
            </div>

            {/* Quick Gauges: Integrity, Power Draw, Temp */}
            <div className="grid grid-cols-3 gap-2 pt-1 font-mono-tech text-center">
              <div className="bg-gray-900/80 p-2 rounded-lg border border-gray-800">
                <span className="text-[10px] text-gray-400 block">HULL INTEGRITY</span>
                <span className="text-emerald-400 font-bold text-sm">{currentPart.integrity}%</span>
              </div>
              <div className="bg-gray-900/80 p-2 rounded-lg border border-gray-800">
                <span className="text-[10px] text-gray-400 block">POWER DRAW</span>
                <span className="text-cyan-300 font-bold text-sm">{currentPart.powerDrawGW} GW</span>
              </div>
              <div className="bg-gray-900/80 p-2 rounded-lg border border-gray-800">
                <span className="text-[10px] text-gray-400 block">TEMPERATURE</span>
                <span className="text-amber-400 font-bold text-sm">{currentPart.tempKelvin} K</span>
              </div>
            </div>
          </div>

          {/* Key Engineering Features */}
          <div className="bg-gray-950/80 border border-gray-800 rounded-xl p-4">
            <span className="font-tech text-xs font-bold text-gray-300 uppercase block mb-2">
              ARCHITECTURAL SPECIFICATIONS & CAPABILITIES:
            </span>
            <ul className="space-y-1.5 text-xs text-gray-300 font-sans">
              {currentPart.keyFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-800 text-[11px] font-mono-tech text-gray-400">
              <div>MATERIAL: <span className="text-gray-200">{currentPart.operationalSpecs.material}</span></div>
              <div>VOLTAGE / THRUST: <span className="text-cyan-300">{currentPart.operationalSpecs.voltageOrThrust}</span></div>
              <div>COOLING: <span className="text-gray-200">{currentPart.operationalSpecs.coolingType}</span></div>
              <div>LATENCY: <span className="text-emerald-400">{currentPart.operationalSpecs.responseTimeMs} ms</span></div>
            </div>
          </div>

          {/* Action Trigger Buttons for Selected Part */}
          <div className="bg-gray-950/80 border border-cyan-500/20 rounded-xl p-4 flex flex-col gap-2">
            <span className="font-tech text-xs font-bold text-cyan-300 uppercase flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>TEST & CALIBRATE COMPONENT:</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              {currentPart.actions.map((act) => (
                <button
                  key={act.actionId}
                  onClick={() => handleExecutePartAction(act.actionId, act.label)}
                  disabled={isCalibrating}
                  className="p-2.5 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-200 text-xs font-tech font-bold text-left cursor-pointer transition-all flex flex-col gap-0.5 disabled:opacity-50"
                >
                  <div className="flex items-center justify-between text-cyan-300">
                    <span>{act.label}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] text-gray-400 font-sans font-normal">
                    {act.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Component Quick Switcher Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(Object.keys(suitParts) as SuitPartCategory[]).map((pId) => (
              <button
                key={pId}
                onClick={() => {
                  soundFx.playHudBeep('subtle');
                  setSelectedPartId(pId);
                }}
                className={`px-2.5 py-1.5 rounded-md text-[11px] font-tech font-bold whitespace-nowrap cursor-pointer transition-all ${
                  selectedPartId === pId
                    ? 'bg-amber-950/70 border border-amber-400/60 text-amber-200 glow-arc-gold'
                    : 'bg-gray-900/80 border border-gray-800 text-gray-400 hover:text-gray-200'
                }`}
              >
                {suitParts[pId].name.split('&')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
