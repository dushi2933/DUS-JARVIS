import React, { useState } from 'react';
import { 
  Lightbulb, 
  Lock, 
  Unlock, 
  Thermometer, 
  Zap, 
  Wifi, 
  Sliders, 
  Flame, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Send,
  Power
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useToast } from '../context/ToastContext';

export type LightingMode = 'ARC_CYAN' | 'DIMMED' | 'RED_ALERT' | 'WARM_GOLD';

export const StarkSmartHomeIot: React.FC = () => {
  const { addToast } = useToast();

  // Smart home states
  const [lightMode, setLightMode] = useState<LightingMode>('ARC_CYAN');
  const [brightness, setBrightness] = useState<number>(85);
  const [isBlastDoorLocked, setIsBlastDoorLocked] = useState<boolean>(true);
  const [temperatureF, setTemperatureF] = useState<number>(68);
  const [isChargingPadActive, setIsChargingPadActive] = useState<boolean>(true);
  
  // Real-world Webhook URL for Philips Hue / Home Assistant
  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('stark_iot_webhook') || '';
    }
    return '';
  });
  const [isSavedWebhook, setIsSavedWebhook] = useState<boolean>(false);

  // Switch Lighting
  const handleSetLighting = (mode: LightingMode) => {
    soundFx.playHudBeep('mode');
    setLightMode(mode);

    const desc: Record<LightingMode, string> = {
      ARC_CYAN: 'Stark Arc Reactor Cyan 6500K daylight',
      DIMMED: 'Dimmed stealth mode at 20% luminance',
      RED_ALERT: 'Combat Red Alert pulsing emergency strobes',
      WARM_GOLD: 'Warm ambient incandescent 2700K',
    };
    jarvisVoice.speak(`Adjusting workshop lighting to ${desc[mode]}, Sir.`);
    
    // Dispatch webhook if configured
    if (webhookUrl.trim()) {
      try {
        fetch(webhookUrl.trim(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ device: 'stark_lights', mode, brightness }),
          mode: 'no-cors',
        }).catch(() => {});
      } catch (e) {}
    }

    addToast({
      title: 'Lab Lighting Updated',
      message: `Illumination shifted to ${mode.replace('_', ' ')}.`,
      type: 'protocol',
    });
  };

  // Toggle Blast Doors
  const handleToggleDoor = () => {
    const nextLocked = !isBlastDoorLocked;
    setIsBlastDoorLocked(nextLocked);
    soundFx.playHudBeep('alert');
    jarvisVoice.speak(
      nextLocked
        ? 'Workshop blast doors hermetically sealed with magnetic deadbolts.'
        : 'Blast doors disengaged. Laboratory access granted.'
    );
    addToast({
      title: nextLocked ? 'Blast Doors Locked' : 'Blast Doors Unlocked',
      message: nextLocked ? 'Vibranium-reinforced bulkheads sealed.' : 'Access authorized for Tony Stark.',
      type: nextLocked ? 'alert' : 'status',
    });
  };

  // Save Webhook URL
  const handleSaveWebhook = () => {
    localStorage.setItem('stark_iot_webhook', webhookUrl.trim());
    setIsSavedWebhook(true);
    soundFx.playHudBeep('confirm');
    addToast({
      title: 'IoT Webhook Saved',
      message: 'J.A.R.V.I.S. will synchronize repulsor events with your smart home setup.',
      type: 'status',
    });
    setTimeout(() => setIsSavedWebhook(false), 2000);
  };

  return (
    <div className="bg-gray-950/90 border border-emerald-500/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md relative min-h-[640px] flex flex-col p-4 gap-4 select-none">
      <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-400 flex items-center justify-center text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            <Wifi className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tech text-base font-bold text-emerald-200 tracking-wider">
                STARK TOWER IOT & SMART AUTOMATION BRIDGE
              </h2>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded border border-emerald-500/40 bg-emerald-950/80 text-emerald-300 uppercase font-bold animate-pulse">
                FACILITY NETWORK: ONLINE
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans">
              Control laboratory ambient lighting, security deadbolts, inductive charging pads, and real smart bulbs
            </p>
          </div>
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        
        {/* Module 1: Lab Lighting */}
        <div className="bg-gray-900/90 border border-cyan-500/30 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <span className="font-tech text-xs font-bold text-cyan-200 uppercase flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-cyan-400" />
              <span>LABORATORY AMBIENT LIGHTING</span>
            </span>
            <span className="text-xs font-mono-tech text-cyan-300 font-bold">{brightness}%</span>
          </div>

          {/* Mode Chips */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'ARC_CYAN' as LightingMode, label: 'ARC CYAN', color: 'bg-cyan-500' },
              { id: 'DIMMED' as LightingMode, label: 'STEALTH DIM', color: 'bg-gray-600' },
              { id: 'RED_ALERT' as LightingMode, label: 'RED ALERT', color: 'bg-red-500' },
              { id: 'WARM_GOLD' as LightingMode, label: 'WARM GOLD', color: 'bg-amber-500' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => handleSetLighting(m.id)}
                className={`py-2 px-3 rounded-lg border text-xs font-mono-tech font-bold flex items-center gap-2 cursor-pointer transition-all ${
                  lightMode === m.id
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-md'
                    : 'bg-gray-950 border-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${m.color}`} />
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          {/* Brightness Slider */}
          <div className="pt-2 border-t border-gray-800">
            <span className="text-[10px] font-mono-tech text-gray-400 block mb-1">INTENSITY</span>
            <input
              type="range"
              min="10"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Module 2: Blast Door Security */}
        <div className="bg-gray-900/90 border border-red-500/30 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <span className="font-tech text-xs font-bold text-red-200 uppercase flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-red-400" />
              <span>WORKSHOP BLAST DOORS</span>
            </span>
            <span className={`text-[10px] font-mono-tech px-2 py-0.5 rounded font-bold border uppercase ${
              isBlastDoorLocked ? 'bg-red-950 text-red-300 border-red-500' : 'bg-emerald-950 text-emerald-300 border-emerald-500'
            }`}>
              {isBlastDoorLocked ? 'LOCKED' : 'OPEN'}
            </span>
          </div>

          <p className="text-xs text-gray-400 font-sans leading-relaxed">
            {isBlastDoorLocked
              ? 'Heavy 8-inch titanium-alloy blast doors locked with triple magnetic solenoids.'
              : 'Blast doors currently disengaged. Free passage through workshop sub-levels.'}
          </p>

          <button
            onClick={handleToggleDoor}
            className={`py-2.5 px-4 rounded-xl font-tech font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all ${
              isBlastDoorLocked
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                : 'bg-emerald-600 hover:bg-emerald-500 text-gray-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
            }`}
          >
            {isBlastDoorLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>{isBlastDoorLocked ? 'DISENGAGE BLAST DOORS' : 'ENGAGE SECURITY LOCKDOWN'}</span>
          </button>
        </div>

        {/* Module 3: Climate & Charging Pads */}
        <div className="bg-gray-900/90 border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <span className="font-tech text-xs font-bold text-emerald-200 uppercase flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-emerald-400" />
              <span>CLIMATE & INDUCTIVE PADS</span>
            </span>
            <span className="text-xs font-mono-tech text-emerald-300 font-bold">{temperatureF}°F</span>
          </div>

          <div className="space-y-2 text-xs font-mono-tech">
            <div className="flex items-center justify-between p-2 rounded bg-gray-950 border border-gray-800">
              <span className="text-gray-400">LAB TEMP:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTemperatureF((t) => t - 1)}
                  className="px-1.5 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-white cursor-pointer"
                >
                  -
                </button>
                <span className="font-bold text-white">{temperatureF}°F</span>
                <button
                  onClick={() => setTemperatureF((t) => t + 1)}
                  className="px-1.5 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-white cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-gray-950 border border-gray-800">
              <span className="text-gray-400">GAUNTLET CHARGER:</span>
              <button
                onClick={() => setIsChargingPadActive(!isChargingPadActive)}
                className={`text-[10px] px-2 py-0.5 rounded font-bold cursor-pointer ${
                  isChargingPadActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'text-gray-500'
                }`}
              >
                {isChargingPadActive ? 'CHARGING (45W)' : 'OFFLINE'}
              </button>
            </div>
          </div>

          <div className="text-[10px] font-mono-tech text-gray-500">
            AIR SCRUBBERS: 78% N2 · 21% O2 · PARTICLES: NOMINAL
          </div>
        </div>
      </div>

      {/* Real-World Webhook Integration Bar (Philips Hue / Home Assistant) */}
      <div className="bg-gray-900/90 border border-emerald-500/20 rounded-xl p-4 flex flex-col gap-2 relative z-10">
        <span className="font-tech text-xs font-bold text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>PHYSICAL SMART HOME WEBHOOK (PHILIPS HUE / HOME ASSISTANT)</span>
        </span>
        <p className="text-xs text-gray-400 font-sans">
          Enter an HTTP endpoint or Home Assistant webhook. When you fire repulsors or switch alert modes, J.A.R.V.I.S. can trigger your actual physical room lights!
        </p>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="e.g. http://192.168.1.50:8123/api/webhook/stark-lighting"
            className="flex-1 py-2 px-3 rounded-lg bg-gray-950 border border-gray-800 text-xs text-cyan-200 placeholder-gray-600 focus:outline-none focus:border-emerald-400 font-mono-tech"
          />
          <button
            onClick={handleSaveWebhook}
            className="py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-gray-950 font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
          >
            {isSavedWebhook ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
            <span>{isSavedWebhook ? 'SAVED!' : 'SAVE ENDPOINT'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
