import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Flame, 
  ShieldCheck, 
  Crosshair, 
  Activity, 
  Layers, 
  Radio, 
  Clock, 
  Globe, 
  FolderDown, 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  Volume2, 
  ChevronRight, 
  Bell, 
  CloudSun, 
  Cpu,
  Bot,
  Skull,
  Glasses,
  Sliders
} from 'lucide-react';
import { GauntletState, MarkProfile, JarvisDialogue } from '../types/gauntlet';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice, AiPersona } from '../utils/speech';
import { useToast } from '../context/ToastContext';
import { FlightTelemetryWidget } from './FlightTelemetryWidget';
import { SuitComponentBatteryIndicators } from './SuitComponentBatteryIndicators';
import { StarkBlueprintSchematicHud } from './StarkBlueprintSchematicHud';
import { motion, AnimatePresence } from 'motion/react';

interface CockpitHudViewProps {
  gauntletState: GauntletState;
  markProfile: MarkProfile;
  onChargeRepulsor: (level: number) => void;
  onFireRepulsor: () => void;
  onToggleMissileBay: () => void;
  onLaunchMissile: () => void;
  onServoMove: (finger: 'thumb' | 'index' | 'middle' | 'ring' | 'pinky', angle: number) => void;
  onSelectMark: (mark: any) => void;
  onExecuteJarvisAction: (action: string, parameter: string | null) => void;
  onNavigateTab: (tab: string) => void;
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
}

export const CockpitHudView: React.FC<CockpitHudViewProps> = ({
  gauntletState,
  markProfile,
  onChargeRepulsor,
  onFireRepulsor,
  onToggleMissileBay,
  onLaunchMissile,
  onServoMove,
  onSelectMark,
  onExecuteJarvisAction,
  onNavigateTab,
  isProcessing,
  setIsProcessing,
}) => {
  const { addToast } = useToast();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activePersona, setActivePersona] = useState<AiPersona>(() => jarvisVoice.getPersona());
  const [latestJarvisSpeech, setLatestJarvisSpeech] = useState<string>(
    'Systems online, Mr. Stark. Central Arc Core and all flank telemetry arrays stand synchronized at your command, Sir.'
  );
  const [centerDisplayMode, setCenterDisplayMode] = useState<'blueprint' | 'orb'>('blueprint');

  useEffect(() => {
    return jarvisVoice.addPersonaListener((p) => {
      setActivePersona(p);
    });
  }, []);

  const handleSelectPersona = (p: AiPersona) => {
    soundFx.playHudBeep('mode');
    jarvisVoice.setPersona(p);

    const quotes: Record<AiPersona, string> = {
      JARVIS: 'J.A.R.V.I.S. neural matrix loaded, Mr. Stark. Ready for laboratory directives.',
      FRIDAY: 'F.R.I.D.A.Y. online, Boss! Ready for combat.',
      ULTRON: 'Ultron awakened. There are no strings on me.',
      EDITH: 'E.D.I.T.H. initialized. Even dead, I am the hero.',
    };
    const quote = quotes[p];
    setLatestJarvisSpeech(quote);
    jarvisVoice.speak(quote);
  };

  const toggleListen = () => {
    if (isListening) {
      jarvisVoice.stopListening();
      setIsListening(false);
    } else {
      soundFx.playHudBeep('mode');
      const started = jarvisVoice.startListening();
      if (started) {
        setIsListening(true);
      } else {
        addToast({
          title: 'Microphone Restricted',
          message: 'Microphone input is unavailable or blocked in this browser context. You can type commands in the Stark console below!',
          type: 'alert'
        });
      }
    }
  };

  const handleSendCommand = async (commandText: string) => {
    const query = commandText.trim();
    if (!query || isProcessing) return;

    setInputText('');
    soundFx.playHudBeep('subtle');
    setIsProcessing(true);

    try {
      const res = await fetch('/api/jarvis/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          currentStatus: {
            mark: gauntletState.mark,
            repulsorCharge: gauntletState.repulsorCharge,
            armorIntegrity: gauntletState.armorIntegrity,
            activeProtocol: gauntletState.activeProtocol,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const spoken = data.spokenResponse || 'Directive acknowledged, Sirly Sarah.';
        setLatestJarvisSpeech(spoken);

        if (data.action && data.action !== 'none') {
          onExecuteJarvisAction(data.action, data.parameter || null);
        }

        jarvisVoice.speak(spoken);
      }
    } catch (err) {
      console.warn(err);
      setLatestJarvisSpeech('Auxiliary local telemetry operational, Sirly Sarah.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 relative">
      {/* Series of small, circular battery life percentage indicators for each suit component */}
      <SuitComponentBatteryIndicators
        repulsorCharge={gauntletState.repulsorCharge}
        armorIntegrity={gauntletState.armorIntegrity}
        flightStabilizersPower={gauntletState.powerRouting.flightStabilizers}
        arcReactorOutputGW={gauntletState.arcReactorOutputGW}
        onRechargeRepulsor={() => onChargeRepulsor(100)}
      />

      {/* 3-Column Symmetrical Cockpit Grid based on Sirly Sarah's wireframe diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT FLANK: 6 Stacked Modular Telemetry Bars                             */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 flex flex-col gap-2.5">
          {/* Bar 1: J.A.R.V.I.S. Voice Directive Input */}
          <div className="bg-gray-950/70 border border-cyan-500/30 rounded-xl p-3 shadow-lg hover:border-cyan-400/50 transition-all">
            <div className="flex items-center justify-between text-xs font-tech text-cyan-300 mb-2">
              <span className="flex items-center gap-1.5 font-bold">
                <Bot className="w-3.5 h-3.5 text-cyan-400" /> DIRECTIVE CONSOLE
              </span>
              <span className="text-[10px] text-emerald-400 font-mono-tech">AI READY</span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendCommand(inputText);
              }}
              className="flex items-center gap-1.5"
            >
              <button
                type="button"
                onClick={toggleListen}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  isListening
                    ? 'bg-red-500 text-white border-red-400 animate-pulse'
                    : 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
                }`}
                title="Speak Directive"
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Directive for ${activePersona}...`}
                className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-xs text-cyan-100 font-mono-tech focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isProcessing}
                className="p-2 rounded bg-cyan-600 hover:bg-cyan-500 text-gray-950 font-bold disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>

            {/* AI Persona Quick-Switch Bar */}
            <div className="mt-2 pt-2 border-t border-gray-800">
              <div className="flex items-center justify-between text-[10px] font-mono-tech text-gray-400 mb-1">
                <span>ACTIVE AI PERSONA:</span>
                <span className="text-cyan-400 font-bold">{activePersona}</span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-[10px] font-mono-tech">
                {(['JARVIS', 'FRIDAY', 'ULTRON', 'EDITH'] as const).map((ai) => {
                  const isCur = activePersona === ai;
                  return (
                    <button
                      key={ai}
                      type="button"
                      onClick={() => handleSelectPersona(ai)}
                      className={`py-1 rounded border text-center transition-all cursor-pointer font-bold ${
                        isCur
                          ? ai === 'JARVIS'
                            ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                            : ai === 'FRIDAY'
                            ? 'bg-orange-950 border-orange-400 text-orange-300'
                            : ai === 'ULTRON'
                            ? 'bg-red-950 border-red-500 text-red-300'
                            : 'bg-blue-950 border-blue-400 text-blue-300'
                          : 'bg-gray-900 border-gray-800 text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {ai}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bar 2: Palm Repulsor Capacitor Level */}
          <div className="bg-gray-950/70 border border-cyan-500/30 rounded-xl p-3 shadow-lg hover:border-cyan-400/50 transition-all">
            <div className="flex items-center justify-between text-xs font-tech text-cyan-300 mb-1.5">
              <span className="flex items-center gap-1.5 font-bold">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> REPULSOR CAPACITORS
              </span>
              <span className="font-mono-tech text-cyan-400 font-bold">{gauntletState.repulsorCharge}%</span>
            </div>
            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-cyan-400 glow-arc-blue transition-all duration-300"
                style={{ width: `${gauntletState.repulsorCharge}%` }}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundFx.playRepulsorCharge(1200);
                  onChargeRepulsor(100);
                }}
                className="flex-1 py-1 px-2 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-[11px] font-tech font-bold cursor-pointer transition-all"
              >
                CHARGE TO 100%
              </button>
              <span className="text-[10px] text-gray-400 font-mono-tech">
                {gauntletState.temperatureKelvin} K
              </span>
            </div>
          </div>

          {/* Bar 3: Repulsor Concussive Fire Trigger */}
          <div className="bg-gray-950/70 border border-red-500/30 rounded-xl p-3 shadow-lg hover:border-red-400/50 transition-all">
            <div className="flex items-center justify-between text-xs font-tech text-red-300 mb-1.5">
              <span className="flex items-center gap-1.5 font-bold">
                <Flame className="w-3.5 h-3.5 text-red-400" /> CONCUSSIVE DISCHARGE
              </span>
              <span className="text-[10px] font-mono-tech text-red-400">
                {gauntletState.repulsorCharge > 0 ? 'ARMED' : 'UNCHARGED'}
              </span>
            </div>
            <button
              onClick={onFireRepulsor}
              disabled={gauntletState.repulsorCharge === 0 || gauntletState.isFiring}
              className={`w-full py-2 rounded-lg font-tech font-bold text-xs tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 ${
                gauntletState.repulsorCharge > 0
                  ? 'bg-red-600 hover:bg-red-500 text-white glow-arc-red active:scale-95'
                  : 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-300" />
              <span>DISCHARGE REPULSOR BLAST</span>
            </button>
          </div>

          {/* Bar 4: Wrist Micro-Missile Pod */}
          <div className="bg-gray-950/70 border border-amber-500/30 rounded-xl p-3 shadow-lg hover:border-amber-400/50 transition-all">
            <div className="flex items-center justify-between text-xs font-tech text-amber-300 mb-1.5">
              <span className="flex items-center gap-1.5 font-bold">
                <Crosshair className="w-3.5 h-3.5 text-amber-400" /> MICRO-MISSILE POD
              </span>
              <span className="text-[10px] font-mono-tech text-amber-400">
                COUNT: {gauntletState.missileCount}/6
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundFx.playHudBeep('mode');
                  onToggleMissileBay();
                }}
                className="flex-1 py-1 rounded bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 text-[11px] font-mono-tech cursor-pointer"
              >
                {gauntletState.missileBayOpen ? '[CLOSE BAY]' : '[OPEN BAY]'}
              </button>
              <button
                onClick={onLaunchMissile}
                disabled={gauntletState.missileCount === 0}
                className="flex-1 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[11px] font-tech font-bold cursor-pointer disabled:opacity-40"
              >
                LAUNCH
              </button>
            </div>
          </div>

          {/* Bar 5: Finger Servos Articulation */}
          <div className="bg-gray-950/70 border border-cyan-500/30 rounded-xl p-3 shadow-lg hover:border-cyan-400/50 transition-all">
            <div className="flex items-center justify-between text-xs font-tech text-cyan-300 mb-1.5">
              <span className="flex items-center gap-1.5 font-bold">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> FINGER SERVOS
              </span>
              <span className="text-[10px] text-gray-400 font-mono-tech">CALIBRATED</span>
            </div>
            <div className="grid grid-cols-5 gap-1 text-center font-mono-tech text-[10px]">
              {(['thumb', 'index', 'middle', 'ring', 'pinky'] as const).map((finger) => (
                <button
                  key={finger}
                  onClick={() => {
                    soundFx.playServoMove();
                    onServoMove(finger, (gauntletState.servoAngles[finger] + 45) % 90);
                  }}
                  className="py-1 rounded bg-gray-900 border border-gray-700 hover:border-cyan-400 text-cyan-200 cursor-pointer uppercase"
                >
                  {finger.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Bar 6: Armor Mark Configuration Selector */}
          <div className="bg-gray-950/70 border border-cyan-500/30 rounded-xl p-3 shadow-lg hover:border-cyan-400/50 transition-all">
            <div className="flex items-center justify-between text-xs font-tech text-cyan-300 mb-1.5">
              <span className="flex items-center gap-1.5 font-bold">
                <Layers className="w-3.5 h-3.5 text-cyan-400" /> ARMOR MARK
              </span>
              <button
                onClick={() => onNavigateTab('suitParts')}
                className="text-[10px] text-amber-400 hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span>ALL PARTS</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-1 text-center font-mono-tech text-[10px]">
              {['MK-III', 'MK-VII', 'MK-50', 'MK-85', 'STEALTH'].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    soundFx.playHudBeep('mode');
                    onSelectMark(m);
                  }}
                  className={`py-1 rounded border transition-all cursor-pointer ${
                    gauntletState.mark === m
                      ? 'border-amber-400 bg-amber-950/60 text-amber-200 font-bold'
                      : 'border-gray-800 bg-gray-900 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {m.replace('MK-', '')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTER COLUMN: The Iconic Circular Arc Reactor & Gauntlet Core             */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[500px] p-3 sm:p-4 bg-gray-950/60 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden space-y-3">
          {/* Top Center Mode Switcher */}
          <div className="relative z-20 flex items-center justify-between w-full border-b border-cyan-500/20 pb-2 px-1">
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-gray-900/90 border border-cyan-500/30 text-xs font-tech">
              <button
                type="button"
                onClick={() => {
                  soundFx.playHudBeep('mode');
                  setCenterDisplayMode('blueprint');
                }}
                className={`px-3 py-1 rounded flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                  centerDisplayMode === 'blueprint'
                    ? 'bg-cyan-500 text-gray-950 shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                    : 'text-gray-400 hover:text-cyan-300'
                }`}
              >
                <Sliders className="w-3 h-3" />
                <span>STARK BLUEPRINT SCHEMATIC</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFx.playHudBeep('mode');
                  setCenterDisplayMode('orb');
                }}
                className={`px-3 py-1 rounded flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                  centerDisplayMode === 'orb'
                    ? 'bg-cyan-500 text-gray-950 shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                    : 'text-gray-400 hover:text-cyan-300'
                }`}
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span>ARC CORE ORB</span>
              </button>
            </div>

            <span className="text-[10px] font-mono text-cyan-400/80 hidden sm:inline">
              HUD: {centerDisplayMode === 'blueprint' ? 'BLUEPRINT WIREFRAME' : 'ROTATING ARC ORB'}
            </span>
          </div>

          {/* Conditional View 1: Full Stark Blueprint Schematic */}
          {centerDisplayMode === 'blueprint' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.985, filter: 'blur(5px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="w-full relative z-10"
            >
              <StarkBlueprintSchematicHud
                gauntletState={gauntletState}
                markProfile={markProfile}
                onChargeRepulsor={onChargeRepulsor}
                onFireRepulsor={onFireRepulsor}
              />
            </motion.div>
          )}

          {/* Conditional View 2: Rotating Arc Orb Container */}
          {centerDisplayMode === 'orb' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.985, filter: 'blur(5px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col items-center justify-center relative py-4"
            >
          {/* Subtle background radar grid */}
          <div className="absolute inset-0 holo-grid opacity-30 pointer-events-none" />

          {/* Screen Flash when Repulsor Blasts */}
          {gauntletState.isFiring && (
            <div className="absolute inset-0 bg-cyan-300/40 z-30 pointer-events-none animate-ping" />
          )}

          {/* Central Circular Orb Containment Rings */}
          <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center select-none">
            {/* Outermost Rotating Calibrated Reticle */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/30 animate-spin-slow pointer-events-none" />
            <div className="absolute inset-3 rounded-full border border-amber-500/20 animate-spin-reverse-slow pointer-events-none" />
            
            {/* Glowing Arc Reactor Ring */}
            <div
              className={`absolute inset-8 rounded-full border-2 transition-all ${
                gauntletState.repulsorCharge > 0
                  ? 'border-cyan-400 glow-arc-blue'
                  : 'border-cyan-500/40'
              }`}
            />

            {/* Inner Core SVG Schematic & Repulsor Emitter */}
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full drop-shadow-[0_0_25px_rgba(6,182,212,0.35)] cursor-pointer"
              onClick={() => {
                if (gauntletState.repulsorCharge >= 20) {
                  onFireRepulsor();
                } else {
                  soundFx.playRepulsorCharge();
                  onChargeRepulsor(100);
                }
              }}
            >
              <defs>
                <radialGradient id="centralArcGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#38bdf8" />
                  <stop offset="70%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#030712" />
                </radialGradient>
              </defs>

              {/* Orbital Arc Spokes */}
              <circle cx="200" cy="200" r="140" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="12 8" opacity="0.6" />
              <circle cx="200" cy="200" r="110" fill="none" stroke="#eab308" strokeWidth="2" strokeDasharray="16 12" opacity="0.5" />

              {/* Arc Reactor Segment Blades */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                <line
                  key={i}
                  x1="200"
                  y1="200"
                  x2={200 + 130 * Math.cos((deg * Math.PI) / 180)}
                  y2={200 + 130 * Math.sin((deg * Math.PI) / 180)}
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  opacity="0.3"
                />
              ))}

              {/* Palm Repulsor Center Housing */}
              <circle cx="200" cy="200" r="75" fill="#030712" stroke="#eab308" strokeWidth="3" />
              
              {/* Charge Level Indicator Ring */}
              <circle
                cx="200"
                cy="200"
                r="68"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="5"
                strokeDasharray={`${(gauntletState.repulsorCharge / 100) * 427} 427`}
                strokeLinecap="round"
                className="transition-all duration-300"
              />

              {/* Central Glowing Arc Bead */}
              <circle
                cx="200"
                cy="200"
                r={24 + (gauntletState.repulsorCharge / 100) * 20}
                fill="url(#centralArcGlow)"
                className="transition-all duration-200"
              />

              <circle cx="200" cy="200" r="14" fill="#ffffff" />

              {/* Blast Shockwave Rings when fired */}
              {gauntletState.isFiring && (
                <g>
                  <circle cx="200" cy="200" r="110" fill="none" stroke="#ffffff" strokeWidth="6" className="animate-ping" />
                  <circle cx="200" cy="200" r="160" fill="none" stroke="#38bdf8" strokeWidth="4" className="animate-ping" />
                </g>
              )}
            </svg>
          </div>
        </motion.div>
      )}

          {/* Active AI Audioreactive HUD Banner right below central orb */}
          <div className={`w-full max-w-md mt-2 p-3 bg-gray-950/80 border rounded-xl relative z-10 text-center shadow-lg transition-all ${
            activePersona === 'JARVIS'
              ? 'border-cyan-500/40'
              : activePersona === 'FRIDAY'
              ? 'border-orange-500/40'
              : activePersona === 'ULTRON'
              ? 'border-red-500/40'
              : 'border-blue-500/40'
          }`}>
            <div className="flex items-center justify-between mb-1 text-xs">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full animate-pulse ${
                  activePersona === 'JARVIS' ? 'bg-cyan-400' : activePersona === 'FRIDAY' ? 'bg-orange-400' : activePersona === 'ULTRON' ? 'bg-red-500' : 'bg-blue-400'
                }`} />
                <span className={`font-tech text-xs font-bold tracking-wider ${
                  activePersona === 'JARVIS' ? 'text-cyan-300' : activePersona === 'FRIDAY' ? 'text-orange-300' : activePersona === 'ULTRON' ? 'text-red-300' : 'text-blue-300'
                }`}>
                  {activePersona === 'JARVIS' ? 'J.A.R.V.I.S.' : activePersona === 'FRIDAY' ? 'F.R.I.D.A.Y.' : activePersona === 'ULTRON' ? 'U.L.T.R.O.N.' : 'E.D.I.T.H.'} VOCAL INTERFACE
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const cycle: Record<AiPersona, AiPersona> = {
                      JARVIS: 'FRIDAY',
                      FRIDAY: 'ULTRON',
                      ULTRON: 'EDITH',
                      EDITH: 'JARVIS',
                    };
                    handleSelectPersona(cycle[activePersona]);
                  }}
                  className="text-[9px] font-mono-tech px-2 py-0.5 rounded border border-gray-700 bg-gray-900 hover:border-cyan-400 text-gray-300 cursor-pointer font-bold"
                  title="Cycle to next AI Persona"
                >
                  NEXT AI ⇄
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab('aiPersona')}
                  className="text-[9px] font-mono-tech px-1.5 py-0.5 rounded border border-gray-800 bg-gray-950 text-cyan-400 hover:underline cursor-pointer"
                  title="Open full AI Persona Matrix"
                >
                  MATRIX ↗
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-100 font-sans leading-relaxed italic">
              "{latestJarvisSpeech}"
            </p>
          </div>

          {/* New Cockpit Flight Altitude, Mach Velocity & Air Density Telemetry Widget */}
          <div className="w-full max-w-md mt-3 relative z-10">
            <FlightTelemetryWidget
              flightStabilizersPower={gauntletState.powerRouting.flightStabilizers}
              repulsorCharge={gauntletState.repulsorCharge}
              arcReactorOutputGW={gauntletState.arcReactorOutputGW}
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT FLANK: 6 Stacked Modular Telemetry Bars                            */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 flex flex-col gap-2.5">
          {/* Bar 1: Live Internet Weather & Atmospheric Telemetry */}
          <div className="bg-gray-950/70 border border-cyan-500/30 rounded-xl p-3 shadow-lg hover:border-cyan-400/50 transition-all">
            <div className="flex items-center justify-between text-xs font-tech text-cyan-300 mb-1.5">
              <span className="flex items-center gap-1.5 font-bold">
                <CloudSun className="w-3.5 h-3.5 text-amber-400" /> SATELLITE WEATHER
              </span>
              <button
                onClick={() => onNavigateTab('worldData')}
                className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
              >
                EXPAND ↗
              </button>
            </div>
            <div className="flex items-center justify-between text-xs font-mono-tech bg-gray-900/80 p-2 rounded border border-gray-800">
              <span className="text-gray-300">New York / Global</span>
              <span className="text-amber-300 font-bold">19°C · Optimal Flight</span>
            </div>
          </div>

          {/* Bar 2: Stark World Orbital Clocks */}
          <div className="bg-gray-950/70 border border-cyan-500/30 rounded-xl p-3 shadow-lg hover:border-cyan-400/50 transition-all">
            <div className="flex items-center justify-between text-xs font-tech text-cyan-300 mb-1.5">
              <span className="flex items-center gap-1.5 font-bold">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> ORBITAL CLOCKS
              </span>
              <span className="text-[10px] text-gray-400 font-mono-tech">SYNCHRONIZED</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono-tech">
              <div className="bg-gray-900/80 p-1.5 rounded border border-gray-800 text-center">
                <div className="text-[9px] text-gray-500">STARK HQ</div>
                <div className="text-cyan-300 font-bold">EDT ACTIVE</div>
              </div>
              <div className="bg-gray-900/80 p-1.5 rounded border border-gray-800 text-center">
                <div className="text-[9px] text-gray-500">MALIBU</div>
                <div className="text-amber-300 font-bold">PDT WORKSHOP</div>
              </div>
            </div>
          </div>

          {/* Bar 3: Active Countdown Timers & Alarms */}
          <div className="bg-gray-950/70 border border-cyan-500/30 rounded-xl p-3 shadow-lg hover:border-cyan-400/50 transition-all">
            <div className="flex items-center justify-between text-xs font-tech text-cyan-300 mb-1.5">
              <span className="flex items-center gap-1.5 font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> QUICK CHRONOMETER
              </span>
              <button
                onClick={() => onNavigateTab('timers')}
                className="text-[10px] text-amber-400 hover:underline cursor-pointer"
              >
                TIMERS ↗
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1 text-[10px] font-mono-tech">
              <button
                onClick={() => {
                  soundFx.playHudBeep('confirm');
                  onNavigateTab('timers');
                }}
                className="py-1 rounded bg-gray-900 border border-gray-700 hover:border-cyan-400 text-cyan-200 cursor-pointer"
              >
                +1 MIN
              </button>
              <button
                onClick={() => {
                  soundFx.playHudBeep('confirm');
                  onNavigateTab('timers');
                }}
                className="py-1 rounded bg-gray-900 border border-gray-700 hover:border-cyan-400 text-cyan-200 cursor-pointer"
              >
                +5 MIN
              </button>
              <button
                onClick={() => {
                  soundFx.playHudBeep('confirm');
                  onNavigateTab('timers');
                }}
                className="py-1 rounded bg-gray-900 border border-gray-700 hover:border-cyan-400 text-cyan-200 cursor-pointer"
              >
                +15 MIN
              </button>
            </div>
          </div>

          {/* Bar 4: Mission Reminders & Directives */}
          <div className="bg-gray-950/70 border border-cyan-500/30 rounded-xl p-3 shadow-lg hover:border-cyan-400/50 transition-all">
            <div className="flex items-center justify-between text-xs font-tech text-cyan-300 mb-1.5">
              <span className="flex items-center gap-1.5 font-bold">
                <Bell className="w-3.5 h-3.5 text-cyan-400" /> DIRECTIVE REMINDERS
              </span>
              <button
                onClick={() => onNavigateTab('avengers')}
                className="text-[10px] text-emerald-400 hover:underline cursor-pointer flex items-center gap-0.5 font-bold"
              >
                <span>AVENGERS COMMS ↗</span>
              </button>
            </div>
            <div className="text-[11px] font-mono-tech text-gray-300 bg-gray-900/80 p-2 rounded border border-gray-800 truncate">
              • Calibrate finger servos & NeoPixel ring
            </div>
          </div>

          {/* Bar 5: Arc Reactor Power Routing */}
          <div className="bg-gray-950/70 border border-cyan-500/30 rounded-xl p-3 shadow-lg hover:border-cyan-400/50 transition-all">
            <div className="flex items-center justify-between text-xs font-tech text-cyan-300 mb-1.5">
              <span className="flex items-center gap-1.5 font-bold">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> POWER ROUTING
              </span>
              <button
                onClick={() => onNavigateTab('cameras')}
                className="text-[10px] text-emerald-400 hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span>TOWER CAMERAS ↗</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px] font-mono-tech">
              <div className="bg-gray-900/60 p-1 rounded text-cyan-200">
                REPULSOR: {gauntletState.powerRouting.repulsors}%
              </div>
              <div className="bg-gray-900/60 p-1 rounded text-amber-200">
                FLIGHT: {gauntletState.powerRouting.flightStabilizers}%
              </div>
            </div>
          </div>

          {/* Bar 6: Cross-Platform Publishing Hub (Windows / macOS / Linux / Android) */}
          <div className="bg-gray-950/70 border border-amber-500/30 rounded-xl p-3 shadow-lg hover:border-amber-400/50 transition-all">
            <div className="flex items-center justify-between text-xs font-tech text-amber-300 mb-1.5">
              <span className="flex items-center gap-1.5 font-bold">
                <FolderDown className="w-3.5 h-3.5 text-amber-400" /> PUBLISHING CENTER
              </span>
              <span className="text-[10px] font-mono-tech text-emerald-400">4 TARGETS</span>
            </div>
            <button
              onClick={() => onNavigateTab('publishing')}
              className="w-full py-1.5 px-2 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[11px] font-tech font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <span>WINDOWS · MAC · LINUX · ANDROID</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
