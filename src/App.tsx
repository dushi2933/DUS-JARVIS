/**
 * J.A.R.V.I.S. Iron Man Gauntlet OS
 * Stark Industries Terminal for Mr. Tony Stark
 */

import React, { useState, useEffect, useCallback } from 'react';
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
  LayoutGrid,
  Video,
  Fingerprint,
  Eye,
  Lock,
  Unlock,
  Mic,
  Users,
  PhoneCall,
  Satellite,
  Flame,
  Disc,
  Lightbulb,
  Bot,
  Film,
  Hammer,
  Palette,
  Target,
  Sword,
  MapPin,
  Laptop,
  TrendingUp,
  DollarSign,
  Building2,
  Crown,
  Maximize2,
  Minimize2
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
import { BiometricAuthModal } from './components/BiometricAuthModal';
import { StarkTowerCameras } from './components/StarkTowerCameras';
import { SuitPartsInspector } from './components/SuitPartsInspector';
import { JarvisWakeHudBanner } from './components/JarvisWakeHudBanner';
import { AvengersCommLink } from './components/AvengersCommLink';
import { RealFriendsCommBridge } from './components/RealFriendsCommBridge';
import { HolographicDisplay } from './components/HolographicDisplay';
import { HelmetVisionAr } from './components/HelmetVisionAr';
import { VeronicaHulkbusterDrop } from './components/VeronicaHulkbusterDrop';
import { HousePartyProtocolSquad } from './components/HousePartyProtocolSquad';
import { StarkWorkshopJukebox } from './components/StarkWorkshopJukebox';
import { StarkSmartHomeIot } from './components/StarkSmartHomeIot';
import { AiPersonaMatrix } from './components/AiPersonaMatrix';
import { AllIronManSuitsVault } from './components/AllIronManSuitsVault';
import { HulkbusterHeavyBattlestation } from './components/HulkbusterHeavyBattlestation';
import { IronManCinematicUniverseTheater } from './components/IronManCinematicUniverseTheater';
import { NanoGauntletInfinitySnap } from './components/NanoGauntletInfinitySnap';
import { DogfightRadarSimulator } from './components/DogfightRadarSimulator';
import { StarkArmorPaintShop } from './components/StarkArmorPaintShop';
import { NanotechWeaponsForge } from './components/NanotechWeaponsForge';
import { GlobalThreatIntelGlobe } from './components/GlobalThreatIntelGlobe';
import { StarkLaptopNativeBridge } from './components/StarkLaptopNativeBridge';
import { StarkVirtualLaptop } from './components/StarkVirtualLaptop';
import { StarkInvestmentsPortal } from './components/StarkInvestmentsPortal';
import { StarkFinancialBridge } from './components/StarkFinancialBridge';
import { StarkOwnerPanel } from './components/StarkOwnerPanel';
import { MasterCreatorGateModal } from './components/MasterCreatorGateModal';
import { StarkBlueprintSchematicHud } from './components/StarkBlueprintSchematicHud';
import { JarvisDesktopVoiceAssistant } from './components/JarvisDesktopVoiceAssistant';
import { motion, AnimatePresence } from 'motion/react';
import { ToastProvider, useToast } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { OwnerAuthProvider, useOwnerAuth } from './context/OwnerAuthContext';
import { 
  GauntletState, 
  ArmorMark, 
  ProtocolType, 
  RepulsorLens, 
  CapacitorType 
} from './types/gauntlet';
import { MARK_PROFILES } from './data/markProfiles';
import { soundFx } from './utils/audioEffects';
import { jarvisVoice } from './utils/speech';
import { jarvisWakeEngine, WakeWordStatus } from './utils/wakeWord';

function MainAppContent() {
  const { addToast } = useToast();
  const { requireMasterPublishAccess, ownerAccounts, switchAccount, unlockOwnerWithPin } = useOwnerAuth();

  const [activeTab, setActiveTab] = useState<
    | 'blueprint'
    | 'desktopAssistant'
    | 'owner'
    | 'cockpit'
    | 'investments'
    | 'financialBridge'
    | 'virtualLaptop'
    | 'laptopBridge'
    | 'nanoForge'
    | 'threatMap'
    | 'infinitySnap'
    | 'dogfightRadar'
    | 'paintShop'
    | 'allSuits'
    | 'hulkbusterStation'
    | 'aiPersona'
    | 'mcuMovies'
    | 'helmetAr'
    | 'hologram'
    | 'veronica'
    | 'houseParty'
    | 'jukebox'
    | 'smartHome'
    | 'avengers'
    | 'friendCalls'
    | 'suitParts'
    | 'cameras'
    | 'gauntlet'
    | 'timers'
    | 'worldData'
    | 'publishing'
    | 'reactor'
    | 'workshop'
    | 'protocols'
  >(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const path = window.location.pathname.toLowerCase();
      if (
        p.get('portal') === 'owner' || 
        p.get('portal') === 'owner-suite' || 
        p.get('portal') === 'executive' || 
        p.get('portal') === 'executive-suite' || 
        p.get('owner') || 
        p.get('executive') || 
        p.get('suite') || 
        p.get('stark-owner') ||
        path.includes('/owner') ||
        path.includes('/executive') ||
        path.includes('/suite')
      ) {
        return 'owner';
      }
      if (p.get('portal') === 'bridge' || p.get('bridge') || path.includes('/bridge')) return 'financialBridge';
      if (p.get('portal') === 'invest' || p.get('invest') || window.location.search.includes('invest') || path.includes('/invest')) return 'investments';
      if (p.get('freq') || p.get('room')) return 'friendCalls';
    }
    return 'cockpit';
  });

  // 2 Master Modes: 'old-blueprint' (Stark Blueprint Schematic HUD) vs 'new-voice-assistant' (Jarvis Desktop Voice Assistant)
  const [mainMode, setMainMode] = useState<'old-blueprint' | 'new-voice-assistant'>('old-blueprint');
  // Mode 2 Full Screen Mode state (defaults to true so Mode 2 fills the entire display)
  const [isMode2FullScreen, setIsMode2FullScreen] = useState(true);

  // Deep-link auto-switch for specific owner accounts (e.g. ?portal=owner&acc=owner-2, ?owner=tony, ?ps=1234567, ?mode=2)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const ownerParam = p.get('owner')?.toLowerCase();
      const accParam = p.get('acc');
      const pinParam = p.get('ps') || p.get('pin') || p.get('password');
      const modeParam = p.get('mode')?.toLowerCase();

      if (modeParam === '2' || modeParam === 'assistant' || modeParam === 'new') {
        setMainMode('new-voice-assistant');
        setActiveTab('desktopAssistant');
        setIsMode2FullScreen(true);
      } else if (modeParam === '1' || modeParam === 'blueprint' || modeParam === 'old') {
        setMainMode('old-blueprint');
        setActiveTab('blueprint');
        setIsMode2FullScreen(false);
      }

      let targetAccount = null;
      if (accParam) {
        targetAccount = ownerAccounts.find((a) => a.id === accParam);
      }
      if (!targetAccount && ownerParam && ownerParam !== 'true' && ownerParam !== '1') {
        targetAccount = ownerAccounts.find(
          (a) => a.handle.toLowerCase().includes(ownerParam) || a.name.toLowerCase().includes(ownerParam) || a.id.toLowerCase() === ownerParam
        );
      }

      if (targetAccount) {
        switchAccount(targetAccount.id);
      }

      if (pinParam) {
        unlockOwnerWithPin(pinParam);
      }
    }
  }, [ownerAccounts, switchAccount, unlockOwnerWithPin]);

  // Global Keyboard listener for Mode 2 Full Screen escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeTab === 'desktopAssistant' && isMode2FullScreen) {
        setIsMode2FullScreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, isMode2FullScreen]);

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isBiometricsOpen, setIsBiometricsOpen] = useState(false);
  const [isBiometricAuthenticated, setIsBiometricAuthenticated] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceTriggeredTimerSecs, setVoiceTriggeredTimerSecs] = useState<number | null>(null);

  // Wake word ("Jarvis") state
  const [wakeWordStatus, setWakeWordStatus] = useState<WakeWordStatus>('DISABLED');
  const [isWakeWordEnabled, setIsWakeWordEnabled] = useState(false);
  const [interimSpeech, setInterimSpeech] = useState('');

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
  const handleExecuteJarvisAction = useCallback((action: string, parameter: string | null) => {
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

      case 'open_avengers_comms':
      case 'call_avengers_group':
      case 'call_avenger': {
        soundFx.playHudBeep('mode');
        setActiveTab('avengers');
        addToast({
          title: 'Avengers Comms Bridge Online',
          message: 'Subspace frequencies synchronized with Thor, Bruce Banner, and Loki.',
          type: 'tactical',
        });
        break;
      }

      case 'call_friend':
      case 'open_friend_call': {
        soundFx.playHudBeep('mode');
        setActiveTab('friendCalls');
        addToast({
          title: 'Real-World Comm Bridge Online',
          message: 'WebRTC P2P frequency ready. Copy your invite link and send it to your friends!',
          type: 'status',
        });
        break;
      }

      case 'open_mode_2':
      case 'open_mode_two':
      case 'open_desktop_assistant':
      case 'mode_2':
      case 'mode_2_fullscreen':
      case 'mode_2_full_screen':
      case 'desktop_assistant':
      case 'voice_assistant': {
        soundFx.playHudBeep('mode');
        setMainMode('new-voice-assistant');
        setActiveTab('desktopAssistant');
        setIsMode2FullScreen(true);
        addToast({
          title: 'Mode 2 Full Screen Online',
          message: 'Jarvis Desktop Voice Assistant full screen HUD matrix engaged.',
          type: 'protocol',
        });
        break;
      }

      case 'open_mode_1':
      case 'open_mode_one':
      case 'mode_1':
      case 'blueprint':
      case 'blueprint_hud': {
        soundFx.playHudBeep('mode');
        setMainMode('old-blueprint');
        setActiveTab('blueprint');
        setIsMode2FullScreen(false);
        addToast({
          title: 'Mode 1 Blueprint HUD Online',
          message: 'Vintage Stark Industries Mark Armor Blueprint Schematic HUD active.',
          type: 'status',
        });
        break;
      }

      case 'open_hologram':
      case 'show_hologram':
      case 'holographic_display': {
        soundFx.playHologramActivate();
        setActiveTab('hologram');
        addToast({
          title: 'Holographic Projection Deck Online',
          message: 'Volumetric 3D photon projection engaged with 360° interactive rotation.',
          type: 'protocol',
        });
        break;
      }

      case 'open_helmet_ar':
      case 'show_helmet_ar': {
        soundFx.playHudBeep('mode');
        setActiveTab('helmetAr');
        addToast({
          title: 'Helmet AR Vision Online',
          message: 'Optical targeting system and biometric HUD engaged.',
          type: 'protocol',
        });
        break;
      }

      case 'open_veronica':
      case 'deploy_hulkbuster': {
        soundFx.playArcReactorPulse();
        setActiveTab('veronica');
        addToast({
          title: 'Veronica Platform Activated',
          message: 'Hulkbuster orbital telemetry online.',
          type: 'alert',
        });
        break;
      }

      case 'open_house_party':
      case 'house_party_protocol': {
        soundFx.playRepulsorBlast();
        setActiveTab('houseParty');
        addToast({
          title: 'House Party Protocol Online',
          message: 'Automated drone armor squadron awaiting commands.',
          type: 'alert',
        });
        break;
      }

      case 'open_jukebox':
      case 'play_music': {
        soundFx.playHudBeep('mode');
        setActiveTab('jukebox');
        addToast({
          title: 'Stark Soundstage Online',
          message: 'Workshop music synthesizer and ATC scanner ready.',
          type: 'status',
        });
        break;
      }

      case 'open_smart_home':
      case 'smart_lights': {
        soundFx.playHudBeep('subtle');
        setActiveTab('smartHome');
        addToast({
          title: 'Stark IoT Hub Online',
          message: 'Workshop ambient lighting and blast doors ready.',
          type: 'protocol',
        });
        break;
      }

      case 'open_all_suits':
      case 'hall_of_armors': {
        soundFx.playHudBeep('mode');
        setActiveTab('allSuits');
        addToast({
          title: 'Stark Hall of Armors Online',
          message: 'All 24 canonical Iron Man suits accessible.',
          type: 'protocol',
        });
        break;
      }

      case 'open_hulkbuster_station':
      case 'hulkbuster_battlestation': {
        soundFx.playArcReactorPulse();
        setActiveTab('hulkbusterStation');
        addToast({
          title: 'Hulkbuster Battlestation Online',
          message: 'Pneumatic jackhammer gauntlet ready.',
          type: 'alert',
        });
        break;
      }

      case 'open_ai_persona':
      case 'switch_ai':
      case 'friday':
      case 'ultron':
      case 'edith':
      case 'jarvis': {
        soundFx.playHudBeep('mode');
        const p = typeof parameter === 'string' ? parameter.toUpperCase() : '';
        if (['JARVIS', 'FRIDAY', 'ULTRON', 'EDITH'].includes(p)) {
          jarvisVoice.setPersona(p as any);
        } else if (action === 'friday') {
          jarvisVoice.setPersona('FRIDAY');
        } else if (action === 'ultron') {
          jarvisVoice.setPersona('ULTRON');
        } else if (action === 'edith') {
          jarvisVoice.setPersona('EDITH');
        } else if (action === 'jarvis') {
          jarvisVoice.setPersona('JARVIS');
        }
        setActiveTab('aiPersona');
        addToast({
          title: `${jarvisVoice.getPersona()} Active`,
          message: 'AI Neural Matrix synchronized across gauntlet systems.',
          type: jarvisVoice.getPersona() === 'ULTRON' ? 'alert' : 'status',
        });
        break;
      }

      case 'open_mcu_movies':
      case 'iron_man_movies': {
        soundFx.playHudBeep('subtle');
        setActiveTab('mcuMovies');
        addToast({
          title: 'MCU Iron Man Theater Online',
          message: 'All 9 MCU films and iconic dialogues cataloged.',
          type: 'status',
        });
        break;
      }

      case 'open_infinity_snap':
      case 'infinity_snap':
      case 'snap': {
        soundFx.playArcReactorPulse();
        setActiveTab('infinitySnap');
        addToast({
          title: 'Nano Gauntlet Infinity Core Online',
          message: 'Cosmic gamma channels synchronized with all 6 Infinity Stones.',
          type: 'alert',
        });
        break;
      }

      case 'open_dogfight_radar':
      case 'dogfight': {
        soundFx.playHudBeep('alert');
        setActiveTab('dogfightRadar');
        addToast({
          title: 'Dogfight Radar Scanner Online',
          message: '360° RWR active. Hostile bogeys acquired on intercept grid.',
          type: 'tactical',
        });
        break;
      }

      case 'open_paint_shop':
      case 'custom_paint': {
        soundFx.playHudBeep('mode');
        setActiveTab('paintShop');
        addToast({
          title: 'Stark Armor Paint Shop Online',
          message: 'Nanocoating studio and dual-tone palette calibrated.',
          type: 'protocol',
        });
        break;
      }

      case 'open_virtual_laptop':
      case 'touchscreen_laptop':
      case 'fake_laptop':
      case 'stark_laptop': {
        soundFx.playArcReactorPulse();
        setActiveTab('virtualLaptop');
        addToast({
          title: 'Tony Stark Touchscreen Laptop Online',
          message: 'Holographic touch display, virtual chiclet keyboard, and multi-window desktop engaged.',
          type: 'protocol',
        });
        break;
      }

      case 'open_laptop_bridge':
      case 'access_laptop':
      case 'laptop_access':
      case 'laptop_uplink': {
        soundFx.playHudBeep('mode');
        setActiveTab('laptopBridge');
        addToast({
          title: 'Laptop OS Uplink Online',
          message: 'Local hardware diagnostics, file system access, and screen surveillance ready.',
          type: 'protocol',
        });
        break;
      }

      case 'open_nanotech_forge':
      case 'nanotech_weapons':
      case 'nano_blade': {
        soundFx.playRepulsorCharge();
        setActiveTab('nanoForge');
        addToast({
          title: 'Nanotech Weapons Forge Online',
          message: 'Liquid smart-metal molecular shape-shifting active.',
          type: 'alert',
        });
        break;
      }

      case 'open_threat_map':
      case 'threat_map':
      case 'orbital_strike': {
        soundFx.playArcReactorPulse();
        setActiveTab('threatMap');
        addToast({
          title: 'Global Threat Network Online',
          message: 'Orbital satellite defense and hotspot monitoring active.',
          type: 'alert',
        });
        break;
      }

      case 'open_cameras': {
        soundFx.playHudBeep('mode');
        setActiveTab('cameras');
        addToast({
          title: 'Stark Surveillance Linked',
          message: 'Tactical camera viewport switched to live CCTV feed network.',
          type: 'status',
        });
        break;
      }

      case 'open_suit_parts': {
        soundFx.playHudBeep('mode');
        setActiveTab('suitParts');
        addToast({
          title: 'Suit Architecture Opened',
          message: 'Component inspector loaded: Helmet, Uni-Beam, Flaps, and Boot Thrusters.',
          type: 'tactical',
        });
        break;
      }

      case 'open_biometrics': {
        soundFx.playHudBeep('mode');
        setIsBiometricsOpen(true);
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
  }, []);

  // Voice Command Dispatcher: Processes speech after wake word
  const handleProcessVoiceCommand = useCallback(async (spokenQuery: string) => {
    setIsProcessing(true);
    setInterimSpeech(spokenQuery);

    try {
      const response = await fetch('/api/jarvis/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: spokenQuery,
          currentStatus: {
            mark: gauntletState.mark,
            activeProtocol: gauntletState.activeProtocol,
            repulsorCharge: gauntletState.repulsorCharge,
            missileCount: gauntletState.missileCount,
          },
        }),
      });

      const data = await response.json();

      if (data.spokenResponse) {
        jarvisVoice.speak(data.spokenResponse);
        addToast({
          title: 'J.A.R.V.I.S. Response',
          message: data.spokenResponse,
          type: 'tactical',
        });
      }

      if (data.action && data.action !== 'none') {
        handleExecuteJarvisAction(data.action, data.parameter || null);
      }
    } catch (err) {
      console.error('[J.A.R.V.I.S.] Voice command execution error:', err);
      jarvisVoice.speak('I apologize, Mr. Stark. I encountered a minor neural desynchronization.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setInterimSpeech(''), 3000);
    }
  }, [gauntletState, addToast, handleExecuteJarvisAction]);

  // Register Wake Word ("Jarvis") Engine Callbacks
  useEffect(() => {
    jarvisWakeEngine.registerEvents({
      onStatusChange: (status) => {
        setWakeWordStatus(status);
        setIsWakeWordEnabled(status !== 'DISABLED');
      },
      onWakeWordTriggered: () => {
        addToast({
          title: 'Hotword Detected: "Jarvis"',
          message: 'Microphone opened. J.A.R.V.I.S. is listening to Mr. Stark...',
          type: 'tactical',
        });
      },
      onInterimSpeech: (transcript) => {
        setInterimSpeech(transcript);
      },
      onCommandDetected: (cmd) => {
        handleProcessVoiceCommand(cmd);
      },
      onError: (err) => {
        console.warn('Wake word engine notice:', err);
      },
    });

    return () => {
      jarvisWakeEngine.disable();
    };
  }, [handleProcessVoiceCommand, addToast]);

  // Toggle Wake Word Detection
  const handleToggleWakeWord = () => {
    if (isWakeWordEnabled) {
      jarvisWakeEngine.disable();
      setIsWakeWordEnabled(false);
      soundFx.playHudBeep('subtle');
      addToast({
        title: 'Wake Word Standby',
        message: 'Hotword radar paused. Click "ACTIVATE JARVIS MIC" to turn back on.',
        type: 'status',
      });
    } else {
      const ok = jarvisWakeEngine.enable();
      if (ok) {
        setIsWakeWordEnabled(true);
        soundFx.playHudBeep('confirm');
        jarvisVoice.speak('Hotword detection active, Mr. Stark. Just say Jarvis at any time.');
        addToast({
          title: 'Hotword Radar Online',
          message: 'Ambient microphone active. Say "Jarvis" to issue voice commands hands-free!',
          type: 'status',
        });
      } else {
        addToast({
          title: 'Microphone Permission Needed',
          message: 'Please grant microphone access in your browser to enable "Jarvis" hotword detection.',
          type: 'alert',
        });
      }
    }
  };

  // Charge palm repulsor
  const handleChargeRepulsor = (level: number) => {
    if (!isBiometricAuthenticated) {
      soundFx.playHudBeep('alert');
      addToast({
        title: 'Action Prohibited: Suit Locked',
        message: 'Biometric authorization required to charge weapons.',
        type: 'alert',
      });
      setIsBiometricsOpen(true);
      return;
    }

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
    if (!isBiometricAuthenticated) {
      soundFx.playHudBeep('alert');
      addToast({
        title: 'Discharge Blocked: Security Lock',
        message: 'Biometric verification required to fire repulsors, Mr. Stark.',
        type: 'alert',
      });
      setIsBiometricsOpen(true);
      return;
    }

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
    if (!isBiometricAuthenticated) {
      soundFx.playHudBeep('alert');
      addToast({
        title: 'Weapons Locked',
        message: 'Biometric authentication required to deploy ordnance.',
        type: 'alert',
      });
      setIsBiometricsOpen(true);
      return;
    }

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

      {/* Biometric Authentication Terminal Modal */}
      <BiometricAuthModal
        isOpen={isBiometricsOpen}
        onClose={() => setIsBiometricsOpen(false)}
        isAuthenticated={isBiometricAuthenticated}
        onAuthenticationSuccess={() => {
          setIsBiometricAuthenticated(true);
          setIsBiometricsOpen(false);
        }}
        onLockSystem={() => {
          setIsBiometricAuthenticated(false);
          setIsBiometricsOpen(false);
        }}
      />

      {/* ========================================================================= */}
      {/* MODE 2 FULL SCREEN TAKEOVER: JARVIS DESKTOP VOICE ASSISTANT OS            */}
      {/* ========================================================================= */}
      {activeTab === 'desktopAssistant' && isMode2FullScreen && (
        <div className="fixed inset-0 z-50 bg-[#020407] flex flex-col w-screen h-screen overflow-hidden select-none animate-fade-in">
          {/* Top Tactical Full Screen HUD Header */}
          <div className="relative z-30 flex items-center justify-between px-3 sm:px-6 py-2.5 border-b border-emerald-500/30 bg-[#020712]/95 backdrop-blur-md">
            {/* Left: Branding & Status */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="font-tech text-base sm:text-lg font-black tracking-widest text-emerald-400 italic">
                  STARK INDUSTRIES
                </span>
                <span className="text-emerald-500/60 font-mono text-sm tracking-tighter">//</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 border-l border-emerald-500/30 pl-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono text-emerald-300 font-bold tracking-wider">
                  MODE 2: JARVIS DESKTOP VOICE ASSISTANT [FULL SCREEN OS]
                </span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold hidden md:inline">
                FULL SCREEN ACTIVE
              </span>
            </div>

            {/* Center: Creator & Git Clearance */}
            <div className="hidden xl:flex items-center gap-2 text-[11px] font-mono bg-gray-950/80 border border-emerald-500/30 px-3 py-1 rounded-xl">
              <span className="text-gray-400">CLEARANCE:</span>
              <span className="text-amber-300 font-bold">Lisara Kodikara (Dushi)</span>
              <span className="text-gray-600">|</span>
              <span className="text-cyan-300">jdushi@gmail.com</span>
              <span className="text-gray-600">|</span>
              <span className="text-emerald-400">github.com/dushi2933/DUS-JARVIS</span>
            </div>

            {/* Right: Controls & Toggles */}
            <div className="flex items-center gap-2">
              {/* Switch to Mode 1 (Blueprint) */}
              <button
                onClick={() => {
                  soundFx.playHudBeep('mode');
                  setMainMode('old-blueprint');
                  setActiveTab('blueprint');
                  setIsMode2FullScreen(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/50 font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow transition-all"
                title="Switch to Mode 1: Blueprint Schematic HUD"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">MODE 1 (BLUEPRINT)</span>
              </button>

              {/* Exit Full Screen / Dock to Embedded */}
              <button
                onClick={() => {
                  soundFx.playHudBeep('subtle');
                  setIsMode2FullScreen(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-700 font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                title="Exit Full Screen Mode (Dock to windowed view) [ESC]"
              >
                <Minimize2 className="w-3.5 h-3.5 text-gray-400" />
                <span className="hidden sm:inline">WINDOWED [ESC]</span>
              </button>

              {/* Real Native Browser Fullscreen */}
              <button
                onClick={() => {
                  soundFx.playHudBeep('subtle');
                  if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                  } else {
                    document.exitFullscreen().catch(() => {});
                  }
                }}
                className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 cursor-pointer transition-all"
                title="Toggle Native Browser Fullscreen (F11)"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Full Screen Ambient Holographic Scanline */}
          <div className="absolute inset-x-0 top-11 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_25px_#10b981] animate-scanline-sweep pointer-events-none z-40" />

          {/* Full Screen Jarvis Desktop Voice Assistant Body */}
          <div className="flex-1 min-h-0 relative w-full h-full overflow-hidden">
            <JarvisDesktopVoiceAssistant
              isFullscreen={true}
              onToggleFullscreen={() => setIsMode2FullScreen(false)}
              onSwitchToMode1={() => {
                setMainMode('old-blueprint');
                setActiveTab('blueprint');
                setIsMode2FullScreen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Stark HUD Header */}
      <Header
        onReset={handleReset}
        onOpenPublishGuide={() => setActiveTab('publishing')}
        onOpenOwnerPanel={() => setActiveTab('owner')}
        activeProtocol={gauntletState.activeProtocol}
        isJarvisThinking={isProcessing}
        isBiometricAuthenticated={isBiometricAuthenticated}
        onOpenBiometrics={() => setIsBiometricsOpen(true)}
        isWakeWordEnabled={isWakeWordEnabled}
        onToggleWakeWord={handleToggleWakeWord}
        activeMainMode={mainMode}
        onSelectMainMode={(m) => {
          setMainMode(m);
          soundFx.playHudBeep('mode');
          if (m === 'old-blueprint') {
            setActiveTab('blueprint');
            setIsMode2FullScreen(false);
          } else {
            setActiveTab('desktopAssistant');
            setIsMode2FullScreen(true);
          }
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 flex flex-col gap-4">
        {/* Ambient "Say Jarvis" Wake Word HUD Banner */}
        <JarvisWakeHudBanner
          status={wakeWordStatus}
          isEnabled={isWakeWordEnabled}
          interimTranscript={interimSpeech}
          onToggleWakeWord={handleToggleWakeWord}
        />

        {/* Stark Investments Seed Capital Quick Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gradient-to-r from-amber-950/70 via-gray-900 to-slate-900 border border-amber-500/50 rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.2)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/60 flex items-center justify-center text-amber-400 shrink-0 shadow">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-300">
                  STARK INVESTMENTS // SEED CAPITAL ROUND IS OPEN
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono font-bold">
                  MVP VERIFIED
                </span>
              </div>
              <p className="text-xs text-gray-300 hidden sm:block">
                Back our App Store & Google Play launch ($150 target) in exchange for direct company equity & royalties.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                soundFx.playHudBeep('mode');
                setActiveTab(activeTab === 'investments' ? 'cockpit' : 'investments');
              }}
              className={`px-4 py-2 rounded-xl font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow transition-all ${
                activeTab === 'investments'
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-gray-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{activeTab === 'investments' ? 'RETURN TO COCKPIT' : 'OPEN STARK INVESTMENTS PORTAL'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Operational Centers) */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-900/90 border border-cyan-500/20 rounded-xl overflow-x-auto">
          {[
            { id: 'blueprint', label: '⚡ Mode 1: Stark Blueprint HUD (Old)', icon: <Sliders className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> },
            { id: 'desktopAssistant', label: '🎙️ Mode 2: Jarvis Desktop Assistant (New)', icon: <Bot className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> },
            { id: 'cockpit', label: 'Cockpit Wireframe HUD', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
            { id: 'owner', label: '👑 Stark Owner Executive Suite (10 Accounts)', icon: <Crown className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> },
            { id: 'virtualLaptop', label: 'Tony Stark Touchscreen Laptop', icon: <Laptop className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> },
            { id: 'laptopBridge', label: 'Laptop OS Uplink', icon: <Laptop className="w-3.5 h-3.5 text-cyan-300" /> },
            { id: 'nanoForge', label: 'Nanotech Weapons Forge', icon: <Sword className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> },
            { id: 'threatMap', label: 'Global Threat Map', icon: <MapPin className="w-3.5 h-3.5 text-red-400" /> },
            { id: 'infinitySnap', label: 'Nano Gauntlet Snap', icon: <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" /> },
            { id: 'dogfightRadar', label: 'Dogfight Radar Sim', icon: <Target className="w-3.5 h-3.5 text-emerald-400" /> },
            { id: 'paintShop', label: 'Armor Paint Shop', icon: <Palette className="w-3.5 h-3.5 text-purple-400" /> },
            { id: 'allSuits', label: 'All 24 Suits Vault', icon: <Layers className="w-3.5 h-3.5 text-amber-400" /> },
            { id: 'hulkbusterStation', label: 'Hulkbuster Battlestation', icon: <Hammer className="w-3.5 h-3.5 text-red-400" /> },
            { id: 'aiPersona', label: 'AI Persona (Friday/Ultron)', icon: <Bot className="w-3.5 h-3.5 text-orange-400 animate-pulse" /> },
            { id: 'mcuMovies', label: 'MCU Film Archive & Theater', icon: <Film className="w-3.5 h-3.5 text-cyan-300" /> },
            { id: 'helmetAr', label: 'Helmet Vision AR', icon: <Crosshair className="w-3.5 h-3.5 text-cyan-400" /> },
            { id: 'hologram', label: '3D Holographic Display', icon: <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" /> },
            { id: 'veronica', label: 'Veronica Hulkbuster Drop', icon: <Satellite className="w-3.5 h-3.5 text-amber-400" /> },
            { id: 'houseParty', label: 'House Party Squadron', icon: <Flame className="w-3.5 h-3.5 text-red-400" /> },
            { id: 'jukebox', label: 'Soundstage & Radio', icon: <Disc className="w-3.5 h-3.5 text-red-300" /> },
            { id: 'smartHome', label: 'Smart Home & IoT', icon: <Lightbulb className="w-3.5 h-3.5 text-emerald-400" /> },
            { id: 'friendCalls', label: 'Call Real Friends (WebRTC)', icon: <PhoneCall className="w-3.5 h-3.5 text-cyan-400 animate-bounce" /> },
            { id: 'avengers', label: 'Avengers Comms (Thor/Hulk/Loki)', icon: <Users className="w-3.5 h-3.5 text-emerald-400" /> },
            { id: 'suitParts', label: 'Suit Component Inspector', icon: <Layers className="w-3.5 h-3.5 text-amber-400" /> },
            { id: 'cameras', label: 'Stark Tower CCTV Feeds', icon: <Video className="w-3.5 h-3.5 text-emerald-400" /> },
            { id: 'gauntlet', label: 'Gauntlet & AI Core', icon: <Sliders className="w-3.5 h-3.5" /> },
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
                  if (tab.id === 'publishing') {
                    requireMasterPublishAccess(() => {
                      setActiveTab('publishing');
                    });
                  } else {
                    if (tab.id === 'desktopAssistant') {
                      setMainMode('new-voice-assistant');
                      setIsMode2FullScreen(true);
                    } else if (tab.id === 'blueprint') {
                      setMainMode('old-blueprint');
                      setIsMode2FullScreen(false);
                    }
                    setActiveTab(tab.id as any);
                  }
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

        {/* Tab -1: Stark Owner Executive Suite (10 Accounts + Sick Controls) */}
        {activeTab === 'owner' && (
          <StarkOwnerPanel
            onOpenPublishing={() => setActiveTab('publishing')}
            onNavigateTab={(tab) => setActiveTab(tab as any)}
          />
        )}

        {/* SMOOTH MODE TRANSITION ANIMATION: OLD BLUEPRINT vs NEW VOICE ASSISTANT */}
        <AnimatePresence mode="wait">
          {activeTab === 'blueprint' && (
            <motion.div
              key="mode-old-blueprint"
              initial={{ opacity: 0, y: 15, scale: 0.985, filter: 'blur(8px) brightness(1.25)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px) brightness(1)' }}
              exit={{ opacity: 0, y: -15, scale: 0.985, filter: 'blur(8px) brightness(0.8)' }}
              transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full"
            >
              {/* High-Tech Holographic Laser Scanline Sweep */}
              <div className="absolute inset-x-0 -top-1 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#00f0ff] animate-scanline-sweep pointer-events-none z-30" />
              
              {/* High-Tech Mode Shift Feedback Chip */}
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-cyan-300 font-bold uppercase tracking-wider">
                    ACTIVE HUD MODE // 01: VINTAGE STARK BLUEPRINT SCHEMATIC
                  </span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400/70">
                  LAYOUT RECONFIGURED · 60 FPS QUANTUM RENDER
                </span>
              </div>

              <StarkBlueprintSchematicHud
                gauntletState={gauntletState}
                markProfile={currentMarkProfile}
                onChargeRepulsor={handleChargeRepulsor}
                onFireRepulsor={handleFireRepulsor}
                isStandaloneTab={true}
              />
            </motion.div>
          )}

          {activeTab === 'desktopAssistant' && !isMode2FullScreen && (
            <motion.div
              key="mode-new-voice-assistant"
              initial={{ opacity: 0, y: 15, scale: 0.985, filter: 'blur(8px) brightness(1.25)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px) brightness(1)' }}
              exit={{ opacity: 0, y: -15, scale: 0.985, filter: 'blur(8px) brightness(0.8)' }}
              transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full"
            >
              {/* High-Tech Holographic Laser Scanline Sweep */}
              <div className="absolute inset-x-0 -top-1 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_#10b981] animate-scanline-sweep pointer-events-none z-30" />
              
              {/* High-Tech Mode Shift Feedback Chip & Expand to Full Screen Button */}
              <div className="flex items-center justify-between mb-2 px-1 flex-wrap gap-2">
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-emerald-300 font-bold uppercase tracking-wider">
                    ACTIVE HUD MODE // 02: JARVIS DESKTOP VOICE ASSISTANT (EMBEDDED)
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      soundFx.playHudBeep('confirm');
                      setIsMode2FullScreen(true);
                    }}
                    className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-900 font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                    title="Expand Mode 2 to Full Screen View"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>EXPAND TO FULL SCREEN</span>
                  </button>

                  <span className="text-[10px] font-mono text-emerald-400/70 hidden sm:inline">
                    NEURAL VOICE PIPELINE SYNCHRONIZED
                  </span>
                </div>
              </div>

              <JarvisDesktopVoiceAssistant
                isFullscreen={false}
                onToggleFullscreen={() => setIsMode2FullScreen(true)}
                onSwitchToMode1={() => {
                  setMainMode('old-blueprint');
                  setActiveTab('blueprint');
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab 0: Stark Investments & Angel Backer Syndicate Portal */}
        {activeTab === 'investments' && (
          <StarkInvestmentsPortal
            onLaunchLiveApp={() => {
              soundFx.playHudBeep('mode');
              setActiveTab('cockpit');
            }}
            onOpenVirtualLaptop={() => {
              soundFx.playHudBeep('mode');
              setActiveTab('virtualLaptop');
            }}
            onOpenFinancialBridge={() => {
              soundFx.playHudBeep('mode');
              setActiveTab('financialBridge');
            }}
          />
        )}

        {/* Tab 0b: Stark Financial Bridge (Encrypted Vault & Biometric 2FA Withdrawals) */}
        {activeTab === 'financialBridge' && (
          <StarkFinancialBridge
            onBackToInvestments={() => {
              soundFx.playHudBeep('mode');
              setActiveTab('investments');
            }}
          />
        )}

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
            onNavigateTab={(tab) => {
              if (tab === 'biometrics') {
                setIsBiometricsOpen(true);
              } else {
                setActiveTab(tab as any);
              }
            }}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        )}

        {/* Tab: Tony Stark Virtual Touchscreen Laptop */}
        {activeTab === 'virtualLaptop' && (
          <StarkVirtualLaptop />
        )}

        {/* Tab: Stark Laptop OS Uplink & Native Access Bridge */}
        {activeTab === 'laptopBridge' && (
          <StarkLaptopNativeBridge />
        )}

        {/* Tab: Nanotech Weapons Morphing Forge */}
        {activeTab === 'nanoForge' && (
          <NanotechWeaponsForge />
        )}

        {/* Tab: Global Threat Map & Orbital Satellite Strike */}
        {activeTab === 'threatMap' && (
          <GlobalThreatIntelGlobe />
        )}

        {/* Tab: Nano Gauntlet 6-Stone Cosmic Snap */}
        {activeTab === 'infinitySnap' && (
          <NanoGauntletInfinitySnap />
        )}

        {/* Tab: Dogfight Tactical Radar Simulator */}
        {activeTab === 'dogfightRadar' && (
          <DogfightRadarSimulator />
        )}

        {/* Tab: Stark Armor Paint Shop & Nanotech Customizer */}
        {activeTab === 'paintShop' && (
          <StarkArmorPaintShop />
        )}

        {/* Tab: All 24 Canonical Iron Man Suits Vault (Hall of Armors) */}
        {activeTab === 'allSuits' && (
          <AllIronManSuitsVault
            currentMark={gauntletState.mark}
            onEquipSuit={(mark) => {
              setGauntletState((prev) => ({ ...prev, mark }));
            }}
          />
        )}

        {/* Tab: Dedicated Hulkbuster Battlestation */}
        {activeTab === 'hulkbusterStation' && (
          <HulkbusterHeavyBattlestation />
        )}

        {/* Tab: AI Persona Switcher (J.A.R.V.I.S., F.R.I.D.A.Y., U.L.T.R.O.N., E.D.I.T.H.) */}
        {activeTab === 'aiPersona' && (
          <AiPersonaMatrix />
        )}

        {/* Tab: Complete MCU Iron Man Film Archive & Theater */}
        {activeTab === 'mcuMovies' && (
          <IronManCinematicUniverseTheater />
        )}

        {/* Tab: Helmet Computer Vision AR */}
        {activeTab === 'helmetAr' && (
          <HelmetVisionAr />
        )}

        {/* Tab 2: Stark Volumetric 3D Holographic Projection Deck */}
        {activeTab === 'hologram' && (
          <HolographicDisplay />
        )}

        {/* Tab: Veronica Hulkbuster Orbital Drop */}
        {activeTab === 'veronica' && (
          <VeronicaHulkbusterDrop />
        )}

        {/* Tab: House Party Protocol Multi-Armor Drone Squadron */}
        {activeTab === 'houseParty' && (
          <HousePartyProtocolSquad />
        )}

        {/* Tab: Stark Workshop Soundstage & ATC Jukebox */}
        {activeTab === 'jukebox' && (
          <StarkWorkshopJukebox />
        )}

        {/* Tab: Stark Smart Home & IoT Automation Bridge */}
        {activeTab === 'smartHome' && (
          <StarkSmartHomeIot />
        )}

        {/* Tab 3: Real-World Friends Calling Bridge (WebRTC Live Audio/Video) */}
        {activeTab === 'friendCalls' && (
          <RealFriendsCommBridge />
        )}

        {/* Tab 3: Avengers Tactical Comms & WhatsApp Group Calls */}
        {activeTab === 'avengers' && (
          <AvengersCommLink />
        )}

        {/* Tab 3: Full Suit Subsystem Inspector (Helmet, Uni-Beam, Flaps, Thrusters) */}
        {activeTab === 'suitParts' && (
          <SuitPartsInspector
            currentMark={gauntletState.mark}
            onFireRepulsor={handleFireRepulsor}
            onChargeRepulsor={handleChargeRepulsor}
          />
        )}

        {/* Tab 3: Stark Tower CCTV Surveillance Camera Network */}
        {activeTab === 'cameras' && (
          <StarkTowerCameras />
        )}

        {/* Tab 4: Detailed Gauntlet & AI Core */}
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

        {/* Tab 5: Timers & Reminders Hub */}
        {activeTab === 'timers' && (
          <RemindersTimersHub externalTimerTrigger={voiceTriggeredTimerSecs} />
        )}

        {/* Tab 6: Satellite Weather & News Data Hub */}
        {activeTab === 'worldData' && (
          <StarkWorldDataHub />
        )}

        {/* Tab 7: Publishing & Packaging Command Center (Windows, macOS, Linux, Android) */}
        {activeTab === 'publishing' && (
          <PublishingCommandCenter />
        )}

        {/* Tab 8: Arc Reactor Power Grid */}
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

        {/* Tab 9: Stark Blueprint Workshop */}
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

        {/* Tab 10: Defense Protocols */}
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
              onClick={() => setIsBiometricsOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer flex items-center gap-1"
            >
              <Fingerprint className="w-3 h-3" />
              <span>Biometric Security Terminal</span>
            </button>
            <span className="text-gray-700">|</span>
            <span className="text-emerald-400">
              STATUS: {isBiometricAuthenticated ? 'ALPHA-1 AUTHORIZED' : 'LOCKED'}
            </span>
          </div>
        </div>
      </footer>

      {/* Publish Quick Modal */}
      <PublishGuideModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
      />

      {/* Master Creator Gate Modal (Pass 2017) */}
      <MasterCreatorGateModal />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <OwnerAuthProvider>
          <MainAppContent />
        </OwnerAuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
