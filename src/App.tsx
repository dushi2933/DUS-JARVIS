/**
 * J.A.R.V.I.S. Iron Man Gauntlet OS
 * Stark Industries Terminal for Mr. Tony Stark
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Cpu, 
  Zap, 
  Layers, 
  Wrench, 
  Sliders, 
  Sparkles, 
  Activity,
  Terminal,
  Crosshair,
  Radio,
  Clock,
  Globe,
  FolderDown,
  LayoutGrid
} from 'lucide-react';
import { Header } from './components/Header';
import { CockpitHudView } from './components/CockpitHudView';
import { JarvisVoiceCore } from './components/JarvisVoiceCore';
import { GauntletHologram } from './components/GauntletHologram';
import { ArcReactorPowerGrid } from './components/ArcReactorPowerGrid';
import { GauntletWorkshop } from './components/GauntletWorkshop';
import { TacticalProtocols } from './components/TacticalProtocols';
import { RemindersTimersHub } from './components/RemindersTimersHub';
import { StarkWorldDataHub } from './components/StarkWorldDataHub';
import { PublishingCommandCenter } from './components/PublishingCommandCenter';
import { PublishGuideModal } from './components/PublishGuideModal';
import { JarvisToastContainer } from './components/JarvisToastContainer';
import { ToastProvider, useToast } from './context/ToastContext';
import { 
  GauntletState, 
  ArmorMark, 
  ProtocolType, 
  RepulsorLens, 
  CapacitorType 
} from './types/gauntlet';
import { MARK_PROFILES } from './data/markProfiles';
import { soundFx } from './utils/audioEffects';

function MainAppContent() {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'cockpit' | 'gauntlet' | 'timers' | 'worldData' | 'publishing' | 'reactor' | 'workshop' | 'protocols'
  >('cockpit'); // Default to Cockpit layout requested in Sirly Sarah's wireframe!

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceTriggeredTimerSecs, setVoiceTriggeredTimerSecs] = useState<number | null>(null);

  const [gauntletState, setGauntletState] = useState<GauntletState>({
    mark: 'MK-50',
    repulsorCharge: 0,
    repulsorMaxPower: 100,
    isCharging: false,
    isFiring: false,
    temperatureKelvin: 310,
    armorIntegrity: 100,
    missileCount: 6,
    missileBayOpen: false,
    activeProtocol: 'IDLE',
    servoAngles: {
      thumb: 0,
      index: 0,
      middle: 0,
      ring: 0,
      pinky: 0,
    },
    powerRouting: {
      repulsors: 40,
      flightStabilizers: 25,
      kineticShield: 20,
      nanoRepair: 15,
    },
    lens: 'PULSE',
    capacitor: 'NANITE_FLOW',
    arcReactorOutputGW: 4.5,
  });

  // Welcome system status toast on initial startup
  useEffect(() => {
    const timer = setTimeout(() => {
      addToast({
        title: 'J.A.R.V.I.S. Neural Core Online',
        message: 'All telemetry arrays, Arc Reactor harmonics, and tactical conduits are active for Mr. Tony Stark.',
        type: 'status',
      });
    }, 600);

    return () => clearTimeout(timer);
  }, [addToast]);

  // Action executor triggered by J.A.R.V.I.S. voice/chat command
  const handleExecuteJarvisAction = (action: string, parameter: string | null) => {
    switch (action) {
      case 'charge_repulsors': {
        const level = parameter ? parseInt(parameter, 10) || 100 : 100;
        soundFx.playRepulsorCharge(1600);
        setGauntletState((prev) => ({
          ...prev,
          repulsorCharge: Math.min(100, Math.max(10, level)),
        }));
        addToast({
          title: 'Repulsor Primed',
          message: `Capacitors charged to ${level}%. High-energy plasma ready for discharge.`,
          type: 'tactical',
        });
        break;
      }

      case 'fire_repulsor': {
        handleFireRepulsor();
        break;
      }

      case 'switch_mark': {
        const targetMark = (parameter?.toUpperCase() || 'MK-50') as ArmorMark;
        if (MARK_PROFILES[targetMark]) {
          soundFx.playHudBeep('mode');
          setGauntletState((prev) => ({
            ...prev,
            mark: targetMark,
            arcReactorOutputGW: MARK_PROFILES[targetMark].baseOutputGW,
          }));
          addToast({
            title: `Armor Switched: ${targetMark}`,
            message: `Gauntlet reconfigured to ${MARK_PROFILES[targetMark].name} matrix.`,
            type: 'tactical',
          });
        }
        break;
      }

      case 'toggle_protocol': {
        const proto = (parameter?.toUpperCase() || 'COMBAT') as ProtocolType;
        soundFx.playHudBeep('alert');
        setGauntletState((prev) => ({
          ...prev,
          activeProtocol: proto,
          repulsorCharge: proto === 'COMBAT' ? 100 : prev.repulsorCharge,
          missileBayOpen: proto === 'COMBAT' ? true : prev.missileBayOpen,
        }));
        addToast({
          title: `Protocol Override: ${proto}`,
          message: `Subsystems reconfigured to ${proto} parameters. Tactical permissions updated.`,
          type: 'protocol',
        });
        break;
      }

      case 'launch_missiles': {
        handleLaunchMissile();
        break;
      }

      case 'set_timer': {
        const secs = parameter ? parseInt(parameter, 10) || 300 : 300;
        setVoiceTriggeredTimerSecs(secs);
        setActiveTab('timers');
        addToast({
          title: 'Mission Chronometer Queued',
          message: `Countdown established for ${Math.round(secs / 60)} minutes.`,
          type: 'status',
        });
        break;
      }

      case 'fetch_weather':
      case 'fetch_news': {
        soundFx.playHudBeep('mode');
        setActiveTab('worldData');
        addToast({
          title: 'Satellite Uplink Synchronized',
          message: 'Atmospheric telemetry and Stark intelligence streams connected.',
          type: 'status',
        });
        break;
      }

      case 'open_publishing': {
        soundFx.playHudBeep('mode');
        setActiveTab('publishing');
        addToast({
          title: 'Publishing Center Opened',
          message: 'Cross-platform configurations loaded for Windows, macOS, Linux, and Android.',
          type: 'status',
        });
        break;
      }

      case 'run_diagnostics': {
        soundFx.playHudBeep('confirm');
        setGauntletState((prev) => ({
          ...prev,
          armorIntegrity: 100,
          temperatureKelvin: 310,
        }));
        addToast({
          title: 'Diagnostics Sweep Complete',
          message: 'All suit subsystems nominal. Armor integrity restored to 100%.',
          type: 'status',
        });
        break;
      }

      case 'calibrate_servos': {
        soundFx.playServoMove();
        setGauntletState((prev) => ({
          ...prev,
          servoAngles: { thumb: 45, index: 45, middle: 45, ring: 45, pinky: 45 },
        }));
        addToast({
          title: 'Servo Articulation Calibrated',
          message: 'Five-finger kinematic actuators tested and responding at 0.8ms latency.',
          type: 'tactical',
        });
        setTimeout(() => {
          soundFx.playServoMove();
          setGauntletState((prev) => ({
            ...prev,
            servoAngles: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 },
          }));
        }, 1200);
        break;
      }

      default:
        break;
    }
  };

  // Charge palm repulsor
  const handleChargeRepulsor = (level: number) => {
    setGauntletState((prev) => ({
      ...prev,
      repulsorCharge: Math.min(100, level),
    }));
    if (level >= 90) {
      addToast({
        title: 'Repulsor at Maximum Charge',
        message: 'Capacitor bank energized to 100%. Ready for concussive discharge.',
        type: 'tactical',
      });
    }
  };

  // Concussive repulsor blast
  const handleFireRepulsor = () => {
    soundFx.playRepulsorBlast();
    setGauntletState((prev) => ({
      ...prev,
      isFiring: true,
      repulsorCharge: 0,
      temperatureKelvin: Math.min(650, prev.temperatureKelvin + 45),
    }));

    addToast({
      title: 'Concussive Repulsor Discharged',
      message: 'High-yield plasma blast fired! Forearm cooling dissipation initiated.',
      type: 'alert',
    });

    setTimeout(() => {
      setGauntletState((prev) => ({
        ...prev,
        isFiring: false,
      }));
    }, 450);

    setTimeout(() => {
      setGauntletState((prev) => ({
        ...prev,
        temperatureKelvin: Math.max(310, prev.temperatureKelvin - 35),
      }));
    }, 2500);
  };

  // Micro-missile launch
  const handleLaunchMissile = () => {
    if (gauntletState.missileCount <= 0) {
      addToast({
        title: 'Missile Pod Empty',
        message: 'Micro-ordinance exhausted. Initiate replenishment in Workshop.',
        type: 'alert',
      });
      return;
    }
    soundFx.playMissileLaunch();
    const remaining = gauntletState.missileCount - 1;
    setGauntletState((prev) => ({
      ...prev,
      missileBayOpen: true,
      missileCount: remaining,
      temperatureKelvin: prev.temperatureKelvin + 15,
    }));
    addToast({
      title: 'Micro-Missile Fired',
      message: `Laser proximity projectile launched. ${remaining}/6 remaining in wrist magazine.`,
      type: 'alert',
    });
  };

  const handleToggleMissileBay = () => {
    const nextState = !gauntletState.missileBayOpen;
    setGauntletState((prev) => ({
      ...prev,
      missileBayOpen: nextState,
    }));
    addToast({
      title: nextState ? 'Missile Bay Deployed' : 'Missile Bay Sealed',
      message: nextState
        ? 'Wrist ordinance launcher opened and target lock system armed.'
        : 'Launcher bay doors sealed for aerodynamic flight.',
      type: 'tactical',
    });
  };

  const handleServoMove = (
    finger: 'thumb' | 'index' | 'middle' | 'ring' | 'pinky',
    angle: number
  ) => {
    setGauntletState((prev) => ({
      ...prev,
      servoAngles: {
        ...prev.servoAngles,
        [finger]: angle,
      },
    }));
  };

  // Clean Slate reset
  const handleReset = () => {
    soundFx.playHudBeep('alert');
    setGauntletState({
      mark: 'MK-50',
      repulsorCharge: 0,
      repulsorMaxPower: 100,
      isCharging: false,
      isFiring: false,
      temperatureKelvin: 310,
      armorIntegrity: 100,
      missileCount: 6,
      missileBayOpen: false,
      activeProtocol: 'IDLE',
      servoAngles: { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 },
      powerRouting: { repulsors: 40, flightStabilizers: 25, kineticShield: 20, nanoRepair: 15 },
      lens: 'PULSE',
      capacitor: 'NANITE_FLOW',
      arcReactorOutputGW: 4.5,
    });
    addToast({
      title: 'Clean Slate Protocol Engaged',
      message: 'All capacitor banks safely discharged. Subsystems reset to baseline safe parameters.',
      type: 'protocol',
    });
  };

  const currentMarkProfile = MARK_PROFILES[gauntletState.mark];

  return (
    <div className="min-h-screen bg-gray-950 text-cyan-50 flex flex-col relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Toast Notification Container in Top-Right Corner */}
      <JarvisToastContainer />

      {/* Stark HUD Header (Wide Horizontal Bar matching the wireframe diagram) */}
      <Header
        onReset={handleReset}
        onOpenPublishGuide={() => setActiveTab('publishing')}
        activeProtocol={gauntletState.activeProtocol}
        isJarvisThinking={isProcessing}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 flex flex-col gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-900/90 border border-cyan-500/20 rounded-xl overflow-x-auto">
          {[
            { id: 'cockpit', label: 'Cockpit Wireframe HUD', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
            { id: 'gauntlet', label: 'Detailed Gauntlet & AI Core', icon: <Crosshair className="w-3.5 h-3.5" /> },
            { id: 'timers', label: 'Timers & Reminders', icon: <Clock className="w-3.5 h-3.5" /> },
            { id: 'worldData', label: 'Satellite Weather & News', icon: <Globe className="w-3.5 h-3.5" /> },
            { id: 'publishing', label: 'Publishing (Win/Mac/Linux/Android)', icon: <FolderDown className="w-3.5 h-3.5" /> },
            { id: 'reactor', label: 'Arc Reactor Power Grid', icon: <Zap className="w-3.5 h-3.5" /> },
            { id: 'workshop', label: 'Stark Blueprint Workshop', icon: <Wrench className="w-3.5 h-3.5" /> },
            { id: 'protocols', label: 'Defense Protocols', icon: <Shield className="w-3.5 h-3.5" /> },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playHudBeep('subtle');
                  setActiveTab(tab.id as any);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-tech font-bold tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-400/50 glow-arc-blue'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Cockpit HUD (Top Banner + Center Orb + Left 6 Bars + Right 6 Bars) */}
        {activeTab === 'cockpit' && (
          <CockpitHudView
            gauntletState={gauntletState}
            markProfile={currentMarkProfile}
            onChargeRepulsor={handleChargeRepulsor}
            onFireRepulsor={handleFireRepulsor}
            onToggleMissileBay={handleToggleMissileBay}
            onLaunchMissile={handleLaunchMissile}
            onServoMove={handleServoMove}
            onSelectMark={(mark) => {
              setGauntletState((prev) => ({
                ...prev,
                mark,
                arcReactorOutputGW: MARK_PROFILES[mark]?.baseOutputGW || 4.5,
              }));
              addToast({
                title: `Chassis Changed: ${mark}`,
                message: `Gauntlet reconfigured to ${MARK_PROFILES[mark]?.name || mark}.`,
                type: 'tactical',
              });
            }}
            onExecuteJarvisAction={handleExecuteJarvisAction}
            onNavigateTab={(tab) => setActiveTab(tab as any)}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        )}

        {/* Tab 2: Detailed Gauntlet & AI Core */}
        {activeTab === 'gauntlet' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
            <div className="lg:col-span-7 flex flex-col">
              <GauntletHologram
                gauntletState={gauntletState}
                markProfile={currentMarkProfile}
                onChargeRepulsor={handleChargeRepulsor}
                onFireRepulsor={handleFireRepulsor}
                onToggleMissileBay={handleToggleMissileBay}
                onLaunchMissile={handleLaunchMissile}
                onServoMove={handleServoMove}
              />
            </div>

            <div className="lg:col-span-5 flex flex-col">
              <JarvisVoiceCore
                gauntletState={gauntletState}
                onExecuteAction={handleExecuteJarvisAction}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Timers & Reminders Hub */}
        {activeTab === 'timers' && (
          <RemindersTimersHub externalTimerTrigger={voiceTriggeredTimerSecs} />
        )}

        {/* Tab 4: Satellite Weather & News Data Hub */}
        {activeTab === 'worldData' && (
          <StarkWorldDataHub />
        )}

        {/* Tab 5: Publishing & Packaging Command Center (Windows, macOS, Linux, Android) */}
        {activeTab === 'publishing' && (
          <PublishingCommandCenter />
        )}

        {/* Tab 6: Arc Reactor Power Grid */}
        {activeTab === 'reactor' && (
          <div className="space-y-4">
            <ArcReactorPowerGrid
              gauntletState={gauntletState}
              onUpdatePowerRouting={(routing) => {
                setGauntletState((prev) => ({ ...prev, powerRouting: routing }));
                addToast({
                  title: 'Power Grid Re-routed',
                  message: `Repulsors: ${routing.repulsors}% · Flight: ${routing.flightStabilizers}% · Shield: ${routing.kineticShield}% · Nanites: ${routing.nanoRepair}%.`,
                  type: 'tactical',
                });
              }}
              onOverdriveReactor={() => {
                setGauntletState((prev) => ({
                  ...prev,
                  repulsorCharge: 100,
                  temperatureKelvin: prev.temperatureKelvin + 40,
                }));
                addToast({
                  title: 'Reactor Overdrive Engaged',
                  message: 'Maximum current shunted to palm repulsor capacitors.',
                  type: 'alert',
                });
              }}
            />
            <div className="p-3 bg-gray-900/60 border border-cyan-500/20 rounded-xl flex items-center justify-between text-xs font-mono-tech">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-gray-300">
                  J.A.R.V.I.S. Telemetry: "Arc Reactor harmonics operating within safe tolerance parameters, Mr. Stark."
                </span>
              </div>
              <span className="text-emerald-400 font-bold hidden sm:inline">
                RESONANCE: 99.8%
              </span>
            </div>
          </div>
        )}

        {/* Tab 7: Stark Blueprint Workshop */}
        {activeTab === 'workshop' && (
          <GauntletWorkshop
            currentMark={gauntletState.mark}
            currentLens={gauntletState.lens}
            currentCapacitor={gauntletState.capacitor}
            onSelectMark={(mark) => {
              setGauntletState((prev) => ({
                ...prev,
                mark,
                arcReactorOutputGW: MARK_PROFILES[mark].baseOutputGW,
              }));
              addToast({
                title: `Armor Matrix: ${mark}`,
                message: `Chassis updated to ${MARK_PROFILES[mark].name}.`,
                type: 'tactical',
              });
            }}
            onSelectLens={(lens) => {
              setGauntletState((prev) => ({ ...prev, lens }));
              addToast({
                title: `Lens Installed: ${lens}`,
                message: `Focal optics configured for ${lens} beam frequency.`,
                type: 'tactical',
              });
            }}
            onSelectCapacitor={(cap) => {
              setGauntletState((prev) => ({ ...prev, capacitor: cap }));
              addToast({
                title: `Capacitor Installed: ${cap}`,
                message: `Power cells adapted to ${cap} dielectric architecture.`,
                type: 'tactical',
              });
            }}
          />
        )}

        {/* Tab 8: Defense Protocols */}
        {activeTab === 'protocols' && (
          <TacticalProtocols
            activeProtocol={gauntletState.activeProtocol}
            onSetProtocol={(proto) => {
              setGauntletState((prev) => ({
                ...prev,
                activeProtocol: proto,
                repulsorCharge: proto === 'COMBAT' ? 100 : prev.repulsorCharge,
                missileBayOpen: proto === 'COMBAT' ? true : prev.missileBayOpen,
              }));
              addToast({
                title: `Protocol Override: ${proto}`,
                message: `Suit defense protocols shifted to ${proto}.`,
                type: 'protocol',
              });
            }}
            onRepairArmor={() => {
              setGauntletState((prev) => ({
                ...prev,
                armorIntegrity: 100,
                temperatureKelvin: 310,
              }));
              addToast({
                title: 'Nanite Hull Restored',
                message: 'Self-repair cycle finished. Armor integrity at 100%.',
                type: 'status',
              });
            }}
            armorIntegrity={gauntletState.armorIntegrity}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-cyan-500/10 py-3 px-4 bg-gray-950/90 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono-tech text-[11px]">
            <span className="text-cyan-400 font-bold">STARK INDUSTRIES</span>
            <span>·</span>
            <span>J.A.R.V.I.S. NEURAL LINK MK-OS</span>
            <span>·</span>
            <span className="text-amber-400 font-medium">DESIGNED FOR MR. TONY STARK</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono-tech">
            <button
              onClick={() => setActiveTab('publishing')}
              className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
            >
              Packaging for Win, Mac, Linux & Android
            </button>
            <span className="text-gray-700">|</span>
            <span className="text-emerald-400">STATUS: SYSTEMS ONLINE</span>
          </div>
        </div>
      </footer>

      {/* Publish Quick Modal */}
      <PublishGuideModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainAppContent />
    </ToastProvider>
  );
}
