import React, { useState, useEffect, useRef } from 'react';
import { 
  Crosshair, 
  Eye, 
  Activity, 
  Heart, 
  ShieldAlert, 
  Camera, 
  VideoOff, 
  RefreshCw, 
  Zap, 
  Radio, 
  Compass, 
  Sliders,
  Maximize2
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useToast } from '../context/ToastContext';

interface TargetPoint {
  id: string;
  x: number;
  y: number;
  label: string;
  threat: 'LOW' | 'MED' | 'HIGH' | 'FRIENDLY';
  distance: string;
}

export const HelmetVisionAr: React.FC = () => {
  const { addToast } = useToast();

  const [hasCamera, setHasCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [visionMode, setVisionMode] = useState<'STANDARD' | 'THERMAL' | 'NIGHT_VISION' | 'TACTICAL_SCAN'>('TACTICAL_SCAN');
  
  // Pilot Biometrics Simulation
  const [heartRate, setHeartRate] = useState<number>(78);
  const [spo2, setSpo2] = useState<number>(99);
  const [stressLevel, setStressLevel] = useState<number>(18);
  const [synapticLatency, setSynapticLatency] = useState<number>(1.2);
  
  // Target tracking points
  const [targets, setTargets] = useState<TargetPoint[]>([
    { id: 't1', x: 50, y: 45, label: 'PILOT: TONY STARK', threat: 'FRIENDLY', distance: '0.4 m' },
    { id: 't2', x: 75, y: 30, label: 'LAB WORKBENCH', threat: 'LOW', distance: '2.8 m' },
  ]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasCamera(true);
      setCameraError(null);
      soundFx.playHudBeep('confirm');
      jarvisVoice.speak('Optical sensors engaged. Helmet computer vision online, Sir.');
      addToast({
        title: 'Helmet AR Vision Online',
        message: 'Real-time optical HUD locked onto pilot facial coordinates.',
        type: 'protocol',
      });
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access required for live Helmet AR. You can still use simulated optics!');
      setHasCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setHasCamera(false);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // Biometric pulse simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setHeartRate((prev) => {
        const jitter = Math.floor(Math.random() * 5) - 2;
        return Math.max(65, Math.min(130, prev + jitter));
      });
      setStressLevel((prev) => Math.max(10, Math.min(45, prev + Math.floor(Math.random() * 3) - 1)));
      setSynapticLatency(+(1.1 + Math.random() * 0.4).toFixed(2));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  // Click on stream to place tactical target lock
  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    soundFx.playHudBeep('alert');
    const newTarget: TargetPoint = {
      id: `target-${Date.now()}`,
      x: Math.round(x),
      y: Math.round(y),
      label: `TACTICAL TARGET-0${targets.length + 1}`,
      threat: targets.length % 2 === 0 ? 'MED' : 'HIGH',
      distance: `${(1.5 + Math.random() * 8).toFixed(1)} m`,
    };

    setTargets((prev) => [...prev.slice(-3), newTarget]);
  };

  return (
    <div className="bg-gray-950/90 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md relative min-h-[640px] flex flex-col p-4 gap-4 select-none">
      <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Crosshair className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tech text-base font-bold text-cyan-200 tracking-wider">
                HELMET OPTICS AR // TARGET LOCK & PILOT VITALS
              </h2>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded border border-cyan-500/40 bg-cyan-950/80 text-cyan-300 uppercase font-bold animate-pulse">
                {hasCamera ? 'OPTICAL FEED LIVE' : 'SYNTHETIC OPTICS'}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans">
              Real-time computer vision with biometric ECG HUD and interactive target acquisition
            </p>
          </div>
        </div>

        {/* Vision Mode Selectors */}
        <div className="flex items-center gap-1.5 bg-gray-900/90 p-1 rounded-xl border border-gray-800">
          {(['TACTICAL_SCAN', 'THERMAL', 'NIGHT_VISION', 'STANDARD'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                soundFx.playHudBeep('mode');
                setVisionMode(mode);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono-tech font-bold cursor-pointer transition-all ${
                visionMode === mode
                  ? 'bg-cyan-600 text-gray-950 font-extrabold shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                  : 'text-gray-400 hover:text-cyan-200'
              }`}
            >
              {mode.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Viewport & Biometrics */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
        
        {/* Left: AR Helmet Viewport with Video Feed & Reticles (8 Cols) */}
        <div 
          onClick={handleStageClick}
          className={`lg:col-span-8 bg-black rounded-2xl relative overflow-hidden flex items-center justify-center min-h-[460px] border-2 cursor-crosshair shadow-2xl transition-all ${
            visionMode === 'THERMAL' 
              ? 'border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.3)]' 
              : visionMode === 'NIGHT_VISION' 
              ? 'border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.3)]' 
              : 'border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)]'
          }`}
        >
          {/* Real Video Element */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover scale-x-[-1] transition-all ${
              visionMode === 'THERMAL'
                ? 'invert contrast-200 hue-rotate-180 brightness-125'
                : visionMode === 'NIGHT_VISION'
                ? 'contrast-150 brightness-110 sepia hue-rotate-[90deg] saturate-[300%]'
                : ''
            } ${!hasCamera ? 'opacity-20' : 'opacity-85'}`}
          />

          {/* Fallback Simulation Hologram if camera unavailable */}
          {!hasCamera && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gray-950/80">
              <Camera className="w-12 h-12 text-cyan-400 mb-3 animate-pulse" />
              <h4 className="font-tech text-sm font-bold text-cyan-200 uppercase">
                OPTICAL SENSORS IN SYNTHETIC MODE
              </h4>
              <p className="text-xs text-gray-400 font-sans max-w-sm mt-1">
                {cameraError || 'Camera stream disabled. Simulating target tracking optics and biometric telemetry.'}
              </p>
              <button
                onClick={startCamera}
                className="mt-3 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-gray-950 font-tech font-bold text-xs cursor-pointer shadow-md"
              >
                REQUEST CAMERA ACCESS
              </button>
            </div>
          )}

          {/* HUD Scanline Overlay */}
          <div className="absolute inset-0 holo-scanlines pointer-events-none opacity-40" />

          {/* Iron Man Helmet HUD Brackets Overlay */}
          <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
            {/* Top HUD Info */}
            <div className="flex items-center justify-between font-mono-tech text-xs">
              <div className="bg-black/70 px-3 py-1 rounded-lg border border-cyan-500/40 text-cyan-300 backdrop-blur-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>MARK 85 // AR OPTICS REV-4</span>
              </div>
              <div className="bg-black/70 px-3 py-1 rounded-lg border border-cyan-500/40 text-cyan-300 backdrop-blur-sm">
                <span>ZOOM: 1.0X · FLIR: ACTIVE</span>
              </div>
            </div>

            {/* Center Crosshair Calibrated Reticle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none flex items-center justify-center">
              <div className="w-full h-full rounded-full border-2 border-dashed border-cyan-400/40 animate-spin-slow" />
              <div className="absolute w-36 h-36 rounded-full border border-cyan-500/30" />
              <div className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
              {/* Pitch Ladder Guides */}
              <div className="absolute w-24 h-0.5 bg-cyan-400/50" />
              <div className="absolute h-24 w-0.5 bg-cyan-400/50" />
            </div>

            {/* Dynamic Target Locking Brackets */}
            {targets.map((tgt) => (
              <div
                key={tgt.id}
                style={{ top: `${tgt.y}%`, left: `${tgt.x}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center animate-pulse"
              >
                <div className={`w-16 h-16 rounded border-2 border-dashed relative flex items-center justify-center ${
                  tgt.threat === 'HIGH' ? 'border-red-500 bg-red-950/30' : 'border-cyan-400 bg-cyan-950/30'
                }`}>
                  <div className="w-2 h-2 rounded-full bg-current" />
                  <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white" />
                  <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white" />
                  <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white" />
                </div>
                <div className="bg-black/80 px-2 py-0.5 rounded text-[9px] font-mono-tech text-cyan-200 border border-cyan-500/40 mt-1 whitespace-nowrap">
                  {tgt.label} · {tgt.distance}
                </div>
              </div>
            ))}

            {/* Bottom HUD Bar */}
            <div className="flex items-center justify-between font-mono-tech text-[11px] text-cyan-400">
              <span className="bg-black/60 px-2 py-1 rounded backdrop-blur-sm border border-cyan-500/30">
                CLICK TO LOCK TARGET ACQUISITION
              </span>
              <span className="bg-black/60 px-2 py-1 rounded backdrop-blur-sm border border-cyan-500/30 text-amber-300">
                ACTIVE TARGETS: {targets.length}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Pilot Biometrics & Diagnostics Panel (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          
          {/* Card 1: Pilot Vitals & ECG */}
          <div className="bg-gray-900/90 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col gap-2.5">
            <span className="font-tech text-xs font-bold text-cyan-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-800 pb-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>PILOT BIOMETRIC VITALS</span>
            </span>

            {/* Heart Rate Metric */}
            <div className="bg-gray-950 p-2.5 rounded-lg border border-red-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Heart className="w-6 h-6 text-red-500 animate-bounce" />
                <div>
                  <div className="text-[10px] font-mono-tech text-gray-400">HEART RATE</div>
                  <div className="text-xl font-bold font-mono-tech text-red-400">
                    {heartRate} <span className="text-xs text-gray-400">BPM</span>
                  </div>
                </div>
              </div>
              {/* Mini SVG ECG line */}
              <svg viewBox="0 0 100 30" className="w-24 h-8 overflow-visible">
                <path
                  d="M 0,15 L 20,15 L 25,5 L 30,25 L 35,15 L 50,15 L 55,2 L 62,28 L 70,15 L 100,15"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech">
              <div className="bg-gray-950 p-2 rounded-lg border border-cyan-500/20">
                <span className="text-gray-400 text-[10px]">BLOOD OXYGEN</span>
                <div className="text-sm font-bold text-cyan-300">{spo2}% SpO2</div>
              </div>
              <div className="bg-gray-950 p-2 rounded-lg border border-amber-500/20">
                <span className="text-gray-400 text-[10px]">STRESS INDEX</span>
                <div className="text-sm font-bold text-amber-300">{stressLevel}% NOMINAL</div>
              </div>
              <div className="bg-gray-950 p-2 rounded-lg border border-emerald-500/20">
                <span className="text-gray-400 text-[10px]">NEURAL LATENCY</span>
                <div className="text-sm font-bold text-emerald-300">{synapticLatency} ms</div>
              </div>
              <div className="bg-gray-950 p-2 rounded-lg border border-blue-500/20">
                <span className="text-gray-400 text-[10px]">SUIT INTERFACE</span>
                <div className="text-sm font-bold text-blue-300">SYNCHRONIZED</div>
              </div>
            </div>
          </div>

          {/* Card 2: Threat Analyzer & Target Log */}
          <div className="bg-gray-900/90 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col gap-2.5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <span className="font-tech text-xs font-bold text-cyan-200 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>TACTICAL TARGET QUEUE</span>
              </span>
              <button
                onClick={() => {
                  soundFx.playHudBeep('subtle');
                  setTargets([]);
                }}
                className="text-[10px] text-gray-400 hover:text-cyan-300 underline font-mono-tech cursor-pointer"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
              {targets.length === 0 ? (
                <p className="text-xs text-gray-500 font-mono-tech text-center py-4">
                  Click anywhere on the camera view to lock target coords...
                </p>
              ) : (
                targets.map((tgt) => (
                  <div key={tgt.id} className="bg-gray-950 p-2 rounded-lg border border-gray-800 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-tech font-bold text-cyan-200 text-xs">{tgt.label}</div>
                      <div className="text-[10px] text-gray-500 font-mono-tech">DIST: {tgt.distance}</div>
                    </div>
                    <span className={`text-[9px] font-mono-tech px-1.5 py-0.5 rounded font-bold border ${
                      tgt.threat === 'HIGH' ? 'bg-red-950 text-red-400 border-red-500/40' : 'bg-cyan-950 text-cyan-400 border-cyan-500/40'
                    }`}>
                      {tgt.threat}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
