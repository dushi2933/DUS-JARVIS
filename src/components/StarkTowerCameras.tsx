import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Video, 
  Eye, 
  ShieldAlert, 
  Radio, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Flame, 
  Moon, 
  Sun, 
  Crosshair, 
  Sliders, 
  AlertTriangle,
  Lock,
  Download,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { CameraFeedId, CameraFilterMode, StarkCameraFeed } from '../types/starkSecurity';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useToast } from '../context/ToastContext';

export const StarkTowerCameras: React.FC = () => {
  const { addToast } = useToast();
  const [selectedCamId, setSelectedCamId] = useState<CameraFeedId>('CAM-01-WORKSHOP');
  const [filterMode, setFilterMode] = useState<CameraFilterMode>('OPTICAL');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isLockdownActive, setIsLockdownActive] = useState(false);
  const [motionTrigger, setMotionTrigger] = useState(false);
  const [currentTimecode, setCurrentTimecode] = useState('');

  const cameras: StarkCameraFeed[] = [
    {
      id: 'CAM-01-WORKSHOP',
      name: 'Penthouse Workshop & Gantry',
      location: 'Floor 93 - Primary R&D Lab',
      status: 'ONLINE',
      panAngle: 12.4,
      zoomLevel: 1.0,
      infraredTempC: 22.8,
      motionDetected: true,
      threatLevel: 'NOMINAL',
      description: 'Gantry assembly station, robotic assistants DUM-E & U, holographic drafting tables.',
    },
    {
      id: 'CAM-02-HELIPAD',
      name: 'Helipad & Quinjet Skydeck',
      location: 'Floor 102 - Exterior Flight Deck',
      status: 'ONLINE',
      panAngle: 45.0,
      zoomLevel: 1.2,
      infraredTempC: 18.2,
      motionDetected: false,
      threatLevel: 'NOMINAL',
      description: 'High-altitude landing pad overlooking Manhattan airspace, wind shear anemometers.',
    },
    {
      id: 'CAM-03-REACTOR',
      name: 'Sub-Level Primary Arc Reactor',
      location: 'Sub-Basement B-4 - Power Core',
      status: 'ONLINE',
      panAngle: -5.0,
      zoomLevel: 1.5,
      infraredTempC: 84.5,
      motionDetected: false,
      threatLevel: 'NOMINAL',
      description: 'Massive clean-energy fusion torus, magnetic containment coils, coolant loops.',
    },
    {
      id: 'CAM-04-ARMORY',
      name: 'Hall of Armors Subterranean Vault',
      location: 'Sub-Basement B-2 - Vault Chamber',
      status: 'ONLINE',
      panAngle: 88.0,
      zoomLevel: 1.0,
      infraredTempC: 20.1,
      motionDetected: false,
      threatLevel: 'NOMINAL',
      description: 'Reinforced display vaults for Mark I through Mark LXXXV, cryogenic preservation pods.',
    },
    {
      id: 'CAM-05-AIRSPACE',
      name: 'Stark Tower Perimeter Radar & Airspace',
      location: 'Spire Rooftop - 360° Array',
      status: 'ONLINE',
      panAngle: 180.0,
      zoomLevel: 2.0,
      infraredTempC: 15.6,
      motionDetected: true,
      threatLevel: 'NOMINAL',
      description: 'Phased-array perimeter radar, repulsor surface-to-air defense turrets.',
    },
    {
      id: 'CAM-06-MALIBU',
      name: 'Point Dume Malibu Facility (Remote)',
      location: 'Pacific Coast Highway - Workshop',
      status: 'STANDBY',
      panAngle: 0.0,
      zoomLevel: 1.0,
      infraredTempC: 24.3,
      motionDetected: false,
      threatLevel: 'NOMINAL',
      description: 'Subterranean cliffside workshop and flight test testing corridor over the Pacific ocean.',
    },
  ];

  const currentCam = cameras.find((c) => c.id === selectedCamId) || cameras[0];

  // Timecode generator
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const ms = String(now.getMilliseconds()).padStart(3, '0').slice(0, 2);
      setCurrentTimecode(
        `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}:${ms} UTC`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, []);

  // Motion flicker simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setMotionTrigger((prev) => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectCam = (camId: CameraFeedId) => {
    soundFx.playHudBeep('mode');
    setSelectedCamId(camId);
    setZoomLevel(1);
    setPanX(0);
    setPanY(0);
    addToast({
      title: 'Surveillance Feed Switched',
      message: `Tuned to ${cameras.find((c) => c.id === camId)?.name}. Optics calibrated.`,
      type: 'status',
    });
  };

  const handleTriggerLockdown = () => {
    const nextState = !isLockdownActive;
    setIsLockdownActive(nextState);
    soundFx.playHudBeep('alert');

    if (nextState) {
      jarvisVoice.speak('Stark Tower security lockdown initiated, Mr. Stark. Blast doors sealed and defense turrets armed.');
      addToast({
        title: 'Tower Lockdown Engaged',
        message: 'All exterior bulkheads sealed. Access elevators grounded to sub-level.',
        type: 'alert',
      });
    } else {
      jarvisVoice.speak('Security lockdown disengaged. Standard surveillance protocols restored.');
      addToast({
        title: 'Lockdown Disengaged',
        message: 'Stark Tower security status returned to nominal green.',
        type: 'protocol',
      });
    }
  };

  const handleTakeSnapshot = () => {
    soundFx.playHudBeep('confirm');
    addToast({
      title: 'Security Snapshot Archived',
      message: `Frame from ${currentCam.name} saved to Stark Security Cloud with cryptographic hash.`,
      type: 'status',
    });
  };

  return (
    <div className="bg-gray-900/60 border border-cyan-500/20 rounded-xl p-4 flex flex-col gap-4 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-400/50 flex items-center justify-center glow-arc-blue">
            <Video className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <h3 className="font-tech text-sm font-bold tracking-wider text-cyan-200 uppercase flex items-center gap-2">
              <span>STARK TOWER TACTICAL SURVEILLANCE NETWORK</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
            </h3>
            <p className="text-[11px] text-gray-400 font-sans">
              Live CCTV feeds, thermal FLIR spectrum, and perimeter threat telemetry
            </p>
          </div>
        </div>

        {/* Lockdown & Snapshot Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTakeSnapshot}
            className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 hover:border-cyan-400 text-cyan-200 text-xs font-mono-tech flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>SNAPSHOT</span>
          </button>

          <button
            onClick={handleTriggerLockdown}
            className={`px-3 py-1.5 rounded-lg border text-xs font-tech font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              isLockdownActive
                ? 'bg-red-600 text-white border-red-400 glow-arc-red animate-pulse'
                : 'bg-red-950/50 border-red-500/40 text-red-300 hover:bg-red-900/50'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isLockdownActive ? 'LOCKDOWN ENGAGED' : 'ENGAGE LOCKDOWN'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left CCTV Feed Viewport, Right Camera Selector & PTZ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
        
        {/* Main Surveillance Viewport (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-2">
          {/* Video Container */}
          <div
            className={`relative rounded-xl border overflow-hidden min-h-[360px] sm:min-h-[420px] flex items-center justify-center transition-all ${
              filterMode === 'THERMAL_IR'
                ? 'border-amber-500/60 bg-gradient-to-br from-indigo-950 via-purple-950 to-amber-950'
                : filterMode === 'NIGHT_VISION'
                ? 'border-emerald-500/60 bg-emerald-950/80 text-emerald-300'
                : filterMode === 'HUD_WIREFRAME'
                ? 'border-cyan-400/70 bg-black text-cyan-300'
                : 'border-cyan-500/30 bg-gray-950 text-cyan-100'
            }`}
          >
            {/* Scanlines Overlay */}
            <div className="absolute inset-0 holo-scanlines pointer-events-none opacity-40 z-20" />

            {/* Top OSD Bar */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono-tech z-30 pointer-events-none">
              <div className="flex items-center gap-2 bg-black/60 px-2 py-1 rounded backdrop-blur-sm border border-gray-800">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="font-bold text-red-400">LIVE REC</span>
                <span className="text-gray-400">|</span>
                <span className="text-cyan-300 font-bold">{currentCam.id}</span>
                <span className="text-gray-500 hidden sm:inline">[{currentCam.location}]</span>
              </div>

              <div className="flex items-center gap-2 bg-black/60 px-2 py-1 rounded backdrop-blur-sm border border-gray-800">
                <span className="text-amber-400 font-bold">{currentCam.infraredTempC}°C</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-300">{currentTimecode}</span>
              </div>
            </div>

            {/* Simulated Animated Camera Scene by ID */}
            <div
              className="relative w-full h-full flex items-center justify-center transition-transform duration-200 select-none"
              style={{
                transform: `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`,
              }}
            >
              {/* Scene: CAM-01 Workshop */}
              {currentCam.id === 'CAM-01-WORKSHOP' && (
                <svg viewBox="0 0 600 400" className="w-full h-full max-h-[380px] opacity-80">
                  <defs>
                    <linearGradient id="gantryGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  {/* Floor grid */}
                  <line x1="50" y1="350" x2="550" y2="350" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="8 6" opacity="0.4" />
                  <line x1="100" y1="380" x2="500" y2="380" stroke="#0ea5e9" strokeWidth="1" opacity="0.2" />
                  {/* Gantry Ring */}
                  <circle cx="300" cy="200" r="110" fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray="14 10" className="animate-spin-slow" />
                  <circle cx="300" cy="200" r="80" fill="none" stroke="#eab308" strokeWidth="2" strokeDasharray="8 8" className="animate-spin-reverse-slow" />
                  {/* Robotic Arm DUM-E Silhouette */}
                  <path d="M 120 350 L 150 240 L 210 200 L 250 215" fill="none" stroke="#22d3ee" strokeWidth="4" />
                  <circle cx="150" cy="240" r="8" fill="#38bdf8" />
                  <circle cx="210" cy="200" r="6" fill="#38bdf8" />
                  {/* Iron Man Mark Suit Silhouette standing in gantry */}
                  <g transform="translate(275, 120)">
                    {/* Helmet */}
                    <rect x="18" y="10" width="14" height="18" rx="4" fill="#ef4444" stroke="#f59e0b" strokeWidth="1" />
                    <line x1="20" y1="18" x2="30" y2="18" stroke="#38bdf8" strokeWidth="2" />
                    {/* Torso & Arc Reactor */}
                    <rect x="10" y="32" width="30" height="45" rx="5" fill="#b91c1c" stroke="#f59e0b" strokeWidth="1.5" />
                    <circle cx="25" cy="45" r="5" fill="#ffffff" stroke="#38bdf8" strokeWidth="2" />
                    {/* Arms */}
                    <rect x="-2" y="34" width="10" height="38" rx="3" fill="#b91c1c" />
                    <rect x="42" y="34" width="10" height="38" rx="3" fill="#b91c1c" />
                    {/* Legs */}
                    <rect x="12" y="80" width="11" height="50" rx="3" fill="#f59e0b" />
                    <rect x="27" y="80" width="11" height="50" rx="3" fill="#f59e0b" />
                  </g>
                  {/* Holographic Drafting Tables */}
                  <rect x="420" y="240" width="120" height="50" rx="4" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
                  <text x="430" y="270" fill="#38bdf8" fontSize="10" fontFamily="monospace">PROJECT: MK-LXXXV</text>
                </svg>
              )}

              {/* Scene: CAM-02 Helipad */}
              {currentCam.id === 'CAM-02-HELIPAD' && (
                <svg viewBox="0 0 600 400" className="w-full h-full max-h-[380px] opacity-80">
                  {/* Giant Stark 'A' / Helipad Logo */}
                  <circle cx="300" cy="200" r="130" fill="none" stroke="#0ea5e9" strokeWidth="3" />
                  <circle cx="300" cy="200" r="110" fill="none" stroke="#eab308" strokeWidth="2" strokeDasharray="16 10" />
                  <text x="275" y="225" fill="#38bdf8" fontSize="72" fontWeight="bold" fontFamily="monospace">A</text>
                  {/* Skyline Silhouette */}
                  <rect x="40" y="80" width="50" height="150" fill="#0f172a" opacity="0.6" />
                  <rect x="100" y="50" width="40" height="180" fill="#0f172a" opacity="0.6" />
                  <rect x="460" y="90" width="60" height="140" fill="#0f172a" opacity="0.6" />
                  {/* Wind telemetry crosshairs */}
                  <circle cx="480" cy="120" r="25" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 4" />
                  <text x="460" y="160" fill="#22d3ee" fontSize="9" fontFamily="monospace">WIND: 14 KTS NW</text>
                </svg>
              )}

              {/* Scene: CAM-03 Primary Arc Reactor */}
              {currentCam.id === 'CAM-03-REACTOR' && (
                <svg viewBox="0 0 600 400" className="w-full h-full max-h-[380px] opacity-85">
                  <circle cx="300" cy="200" r="140" fill="none" stroke="#0284c7" strokeWidth="8" opacity="0.5" />
                  <circle cx="300" cy="200" r="110" fill="none" stroke="#0ea5e9" strokeWidth="5" className="animate-spin-slow" strokeDasharray="20 12" />
                  <circle cx="300" cy="200" r="70" fill="none" stroke="#38bdf8" strokeWidth="6" className="animate-spin-reverse-slow" strokeDasharray="12 8" />
                  <circle cx="300" cy="200" r="35" fill="#38bdf8" className="animate-pulse" />
                  <circle cx="300" cy="200" r="20" fill="#ffffff" />
                  {/* Containment Coils */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                    <line
                      key={i}
                      x1="300"
                      y1="200"
                      x2={300 + 150 * Math.cos((deg * Math.PI) / 180)}
                      y2={200 + 150 * Math.sin((deg * Math.PI) / 180)}
                      stroke="#f59e0b"
                      strokeWidth="3"
                    />
                  ))}
                  <text x="210" y="370" fill="#38bdf8" fontSize="12" fontFamily="monospace" fontWeight="bold">
                    ARC CONTAINMENT: 4.5 GW NOMINAL
                  </text>
                </svg>
              )}

              {/* Scene: CAM-04 Armory Vault */}
              {currentCam.id === 'CAM-04-ARMORY' && (
                <svg viewBox="0 0 600 400" className="w-full h-full max-h-[380px] opacity-80">
                  {/* 5 Vault Pods */}
                  {[80, 180, 280, 380, 480].map((x, i) => (
                    <g key={i}>
                      <rect x={x - 30} y="100" width="60" height="180" rx="8" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="8 6" />
                      <circle cx={x} cy="130" r="8" fill="#ef4444" stroke="#f59e0b" strokeWidth="1" />
                      <rect x={x - 12} y="145" width="24" height="40" rx="3" fill="#b91c1c" />
                      <circle cx={x} cy="158" r="4" fill="#38bdf8" />
                      <text x={x - 18} y="295" fill="#f59e0b" fontSize="9" fontFamily="monospace">
                        MK-{['I', 'VII', 'XLII', 'L', 'LXXXV'][i]}
                      </text>
                    </g>
                  ))}
                  <text x="210" y="60" fill="#38bdf8" fontSize="12" fontFamily="monospace" fontWeight="bold">
                    HALL OF ARMORS: 85 PODS SECURE
                  </text>
                </svg>
              )}

              {/* Scene: CAM-05 Airspace Radar */}
              {currentCam.id === 'CAM-05-AIRSPACE' && (
                <svg viewBox="0 0 600 400" className="w-full h-full max-h-[380px] opacity-80">
                  <circle cx="300" cy="200" r="140" fill="none" stroke="#10b981" strokeWidth="1.5" />
                  <circle cx="300" cy="200" r="100" fill="none" stroke="#10b981" strokeWidth="1" />
                  <circle cx="300" cy="200" r="60" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="6 4" />
                  <line x1="160" y1="200" x2="440" y2="200" stroke="#10b981" strokeWidth="1" opacity="0.4" />
                  <line x1="300" y1="60" x2="300" y2="340" stroke="#10b981" strokeWidth="1" opacity="0.4" />
                  {/* Sweeping Radar Needle */}
                  <line x1="300" y1="200" x2="430" y2="130" stroke="#34d399" strokeWidth="3" className="animate-spin-slow" />
                  {/* Tracked Airspace Blips */}
                  <circle cx="360" cy="140" r="4" fill="#ef4444" className="animate-ping" />
                  <text x="370" y="145" fill="#f87171" fontSize="9" fontFamily="monospace">ID: CIVILIAN-AIR-42</text>
                  <circle cx="230" cy="250" r="4" fill="#38bdf8" />
                  <text x="180" y="270" fill="#38bdf8" fontSize="9" fontFamily="monospace">STARK-QUINJET-01</text>
                </svg>
              )}

              {/* Scene: CAM-06 Malibu */}
              {currentCam.id === 'CAM-06-MALIBU' && (
                <svg viewBox="0 0 600 400" className="w-full h-full max-h-[380px] opacity-80">
                  {/* Ocean wave ripples */}
                  <path d="M 50 280 Q 150 260 250 280 T 450 280 T 550 280" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.5" />
                  <path d="M 30 310 Q 180 290 300 310 T 520 310" fill="none" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.3" />
                  {/* Point Dume cliff silhouette */}
                  <path d="M 380 350 L 450 180 L 520 220 L 560 350 Z" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />
                  <circle cx="460" cy="190" r="6" fill="#f59e0b" />
                  <text x="420" y="160" fill="#f59e0b" fontSize="10" fontFamily="monospace">MALIBU WORKSHOP</text>
                </svg>
              )}
            </div>

            {/* Target Reticle Crosshair in Center */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
              <Crosshair className="w-12 h-12 text-cyan-400/40" />
            </div>

            {/* Motion Detection Tag */}
            {currentCam.motionDetected && motionTrigger && (
              <div className="absolute bottom-4 left-4 z-30 bg-amber-950/80 border border-amber-400 text-amber-300 text-[10px] font-mono-tech px-2 py-1 rounded flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>MOTION DETECTED: SECTOR 4-B</span>
              </div>
            )}

            {/* Bottom OSD Bar: Filter mode badge */}
            <div className="absolute bottom-3 right-3 text-[10px] font-mono-tech bg-black/60 px-2 py-1 rounded backdrop-blur-sm border border-gray-800 z-30 pointer-events-none flex items-center gap-2">
              <span className="text-gray-400">SPECTRUM:</span>
              <span className="text-cyan-300 font-bold">{filterMode}</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-300">ZOOM {zoomLevel.toFixed(1)}x</span>
            </div>
          </div>

          {/* Viewport Control Bar: Filters & Zoom */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-gray-950/80 rounded-lg border border-gray-800">
            {/* Filter Modes */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono-tech text-gray-400 mr-1 hidden sm:inline">FILTER:</span>
              {[
                { id: 'OPTICAL', label: 'Optical', icon: <Sun className="w-3 h-3" /> },
                { id: 'THERMAL_IR', label: 'FLIR Thermal', icon: <Flame className="w-3 h-3 text-amber-400" /> },
                { id: 'NIGHT_VISION', label: 'Night Vision', icon: <Moon className="w-3 h-3 text-emerald-400" /> },
                { id: 'HUD_WIREFRAME', label: 'Wireframe', icon: <Sliders className="w-3 h-3 text-cyan-400" /> },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    soundFx.playHudBeep('subtle');
                    setFilterMode(f.id as CameraFilterMode);
                  }}
                  className={`px-2 py-1 rounded text-[11px] font-tech font-bold flex items-center gap-1 cursor-pointer transition-all ${
                    filterMode === f.id
                      ? 'bg-cyan-950/80 text-cyan-200 border border-cyan-400/50'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {f.icon}
                  <span>{f.label}</span>
                </button>
              ))}
            </div>

            {/* Pan & Zoom Controls */}
            <div className="flex items-center gap-1.5 font-mono-tech text-xs">
              <button
                onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))}
                className="p-1 rounded bg-gray-900 border border-gray-700 text-gray-300 hover:border-cyan-400 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] text-cyan-300 w-8 text-center">{zoomLevel.toFixed(1)}x</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                className="p-1 rounded bg-gray-900 border border-gray-700 text-gray-300 hover:border-cyan-400 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setZoomLevel(1);
                  setPanX(0);
                  setPanY(0);
                }}
                className="p-1 rounded bg-gray-900 border border-gray-700 text-gray-300 hover:border-cyan-400 cursor-pointer"
                title="Reset Camera Center"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Camera Feed Selector & Details (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="text-xs font-tech text-gray-300 font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>SURVEILLANCE SECTOR DIRECTORY</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono-tech">6 CAMERAS LIVE</span>
          </div>

          <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
            {cameras.map((cam) => {
              const isSelected = selectedCamId === cam.id;
              return (
                <button
                  key={cam.id}
                  onClick={() => handleSelectCam(cam.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 text-cyan-100 glow-arc-blue'
                      : 'bg-gray-950/70 border-gray-800 text-gray-400 hover:bg-gray-900 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-tech text-xs font-bold text-gray-200">
                      {cam.name}
                    </span>
                    <span className={`text-[9px] font-mono-tech px-1.5 py-0.5 rounded border ${
                      cam.status === 'ONLINE'
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                        : 'bg-amber-950/80 text-amber-400 border-amber-500/40'
                    }`}>
                      {cam.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono-tech text-gray-400">
                    <span>{cam.location}</span>
                    <span className="text-amber-400">{cam.infraredTempC}°C</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Camera Telemetry Card */}
          <div className="bg-gray-950/80 border border-gray-800 rounded-xl p-3 text-xs font-mono-tech space-y-2">
            <div className="text-cyan-300 font-bold font-tech flex items-center justify-between border-b border-gray-800 pb-1.5">
              <span>{currentCam.id} TELEMETRY</span>
              <span className="text-[10px] text-emerald-400">ENCRYPTION SECURE</span>
            </div>
            <p className="text-[11px] text-gray-300 font-sans leading-relaxed">
              {currentCam.description}
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 pt-1">
              <div>PAN: {currentCam.panAngle}°</div>
              <div>THREAT: <span className="text-emerald-400 font-bold">{currentCam.threatLevel}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
