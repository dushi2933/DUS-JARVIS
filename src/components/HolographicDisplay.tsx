import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  Layers, 
  Eye, 
  Maximize2, 
  Zap, 
  Radio, 
  Globe, 
  Crosshair, 
  Sliders, 
  Volume2, 
  Cpu, 
  Compass, 
  ShieldCheck,
  RefreshCw,
  Box,
  Flame,
  Info
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useTheme } from '../context/ThemeContext';

export type HologramModel = 'SUIT_MARK85' | 'GAUNTLET_EXPLODED' | 'EARTH_SATELLITE' | 'ARC_QUANTUM';
export type HoloColor = 'cyan' | 'gold' | 'red' | 'emerald';

export const HolographicDisplay: React.FC = () => {
  const { themeConfig } = useTheme();

  // Hologram state
  const [selectedModel, setSelectedModel] = useState<HologramModel>('SUIT_MARK85');
  const [holoColor, setHoloColor] = useState<HoloColor>('cyan');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [rotY, setRotY] = useState<number>(25);
  const [rotX, setRotX] = useState<number>(10);
  const [zoom, setZoom] = useState<number>(1.0);
  const [explodedView, setExplodedView] = useState<boolean>(false);
  const [scanlineDensity, setScanlineDensity] = useState<number>(85);
  const [flickerActive, setFlickerActive] = useState<boolean>(false);

  // Mouse drag rotation tracking
  const isDraggingRef = useRef<boolean>(false);
  const prevMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Sound & Voice on model switch
  const handleSelectModel = (model: HologramModel) => {
    soundFx.playHologramActivate();
    setSelectedModel(model);
    setFlickerActive(true);
    setTimeout(() => setFlickerActive(false), 250);

    const names: Record<HologramModel, string> = {
      SUIT_MARK85: 'Iron Man Mark 85 armor schematic',
      GAUNTLET_EXPLODED: 'Nanotech Gauntlet exploded component assembly',
      EARTH_SATELLITE: 'Stark Global Satellite Defense Network',
      ARC_QUANTUM: 'New Element Arc Reactor quantum magnetic core',
    };
    jarvisVoice.speak(`Projecting 3D volumetric hologram of ${names[model]}, Sir.`);
  };

  // Auto-rotation loop
  useEffect(() => {
    let animId: number;
    const loop = () => {
      if (autoRotate && !isDraggingRef.current) {
        setRotY((prev) => (prev + 0.6) % 360);
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [autoRotate]);

  // Mouse handlers for dragging the 3D hologram in space
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - prevMousePosRef.current.x;
    const dy = e.clientY - prevMousePosRef.current.y;
    setRotY((prev) => (prev + dx * 0.7) % 360);
    setRotX((prev) => Math.max(-60, Math.min(60, prev - dy * 0.7)));
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Color mapping
  const colorMap = {
    cyan: {
      primary: '#06b6d4',
      accent: '#22d3ee',
      glow: 'rgba(6, 182, 212, 0.65)',
      beam: 'from-cyan-500/20 via-cyan-400/5 to-transparent',
      border: 'border-cyan-500/40',
      badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-400/50',
    },
    gold: {
      primary: '#eab308',
      accent: '#facc15',
      glow: 'rgba(234, 179, 8, 0.65)',
      beam: 'from-amber-500/20 via-amber-400/5 to-transparent',
      border: 'border-amber-500/40',
      badge: 'bg-amber-950/80 text-amber-300 border-amber-400/50',
    },
    red: {
      primary: '#ef4444',
      accent: '#f87171',
      glow: 'rgba(239, 68, 68, 0.65)',
      beam: 'from-red-500/20 via-red-400/5 to-transparent',
      border: 'border-red-500/40',
      badge: 'bg-red-950/80 text-red-300 border-red-400/50',
    },
    emerald: {
      primary: '#10b981',
      accent: '#34d399',
      glow: 'rgba(16, 185, 129, 0.65)',
      beam: 'from-emerald-500/20 via-emerald-400/5 to-transparent',
      border: 'border-emerald-500/40',
      badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-400/50',
    },
  };

  const c = colorMap[holoColor];

  // Helper 3D projection math
  const radY = (rotY * Math.PI) / 180;
  const radX = (rotX * Math.PI) / 180;

  const projectPoint = (x: number, y: number, z: number, offsetDistance: number = 0) => {
    // Apply exploded displacement if toggled
    const expX = x + (offsetDistance ? (x / (Math.hypot(x, y, z) || 1)) * offsetDistance : 0);
    const expY = y + (offsetDistance ? (y / (Math.hypot(x, y, z) || 1)) * offsetDistance : 0);
    const expZ = z + (offsetDistance ? (z / (Math.hypot(x, y, z) || 1)) * offsetDistance : 0);

    // Rotate around Y
    const x1 = expX * Math.cos(radY) + expZ * Math.sin(radY);
    const z1 = -expX * Math.sin(radY) + expZ * Math.cos(radY);

    // Rotate around X
    const y2 = expY * Math.cos(radX) - z1 * Math.sin(radX);
    const z2 = expY * Math.sin(radX) + z1 * Math.cos(radX);

    // Perspective projection
    const fov = 420;
    const scale = (fov / (fov + z2)) * zoom;
    const screenX = 250 + x1 * scale;
    const screenY = 230 + y2 * scale;

    return { x: screenX, y: screenY, z: z2, scale };
  };

  return (
    <div className="bg-gray-950/90 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md relative min-h-[680px] flex flex-col p-4 gap-4 select-none">
      <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

      {/* Hologram Display Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white border shadow-lg transition-all"
            style={{ 
              backgroundColor: `${c.primary}22`,
              borderColor: c.primary,
              boxShadow: `0 0 15px ${c.glow}` 
            }}
          >
            <Sparkles className="w-5 h-5" style={{ color: c.accent }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tech text-base font-bold text-cyan-200 tracking-wider">
                STARK VOLUMETRIC HOLOGRAPHIC PROJECTION DECK
              </h2>
              <span className={`text-[10px] font-mono-tech px-2 py-0.5 rounded border uppercase font-bold animate-pulse ${c.badge}`}>
                PHOTON EMITTER: ACTIVE
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans">
              Interactive 360° wireframe projection with exploded nanotech assembly & orbital radar
            </p>
          </div>
        </div>

        {/* Emitter Color Frequency Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono-tech text-gray-400 hidden sm:inline">
            LASER FREQUENCY:
          </span>
          {(['cyan', 'gold', 'red', 'emerald'] as const).map((color) => (
            <button
              key={color}
              onClick={() => {
                soundFx.playHudBeep('subtle');
                setHoloColor(color);
              }}
              title={`Switch to ${color.toUpperCase()} photon frequency`}
              className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                holoColor === color ? 'scale-125 shadow-lg' : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                backgroundColor: colorMap[color].primary,
                borderColor: holoColor === color ? '#ffffff' : colorMap[color].accent,
                boxShadow: holoColor === color ? `0 0 12px ${colorMap[color].glow}` : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Holographic Theater Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
        
        {/* Left Column: Holographic Projection Stage (8 Cols) */}
        <div 
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="lg:col-span-8 bg-gray-950/95 border border-cyan-500/30 rounded-2xl relative overflow-hidden flex flex-col items-center justify-between min-h-[460px] cursor-grab active:cursor-grabbing shadow-inner group"
        >
          {/* Emitter Light Cone Background Effect from Bottom Projector */}
          <div 
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[420px] h-[360px] bg-gradient-to-t ${c.beam} rounded-t-full blur-2xl pointer-events-none transition-all duration-500`} 
          />

          {/* Hologram Scanlines & Chromatic Aberration */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40 holo-scanlines" 
            style={{ opacity: scanlineDensity / 100 }}
          />

          {/* Top Stage Telemetry Badge */}
          <div className="w-full flex items-center justify-between p-3 relative z-10 font-mono-tech text-xs">
            <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-lg border border-gray-800 text-gray-300 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: c.accent }} />
              <span className="font-bold text-cyan-200 uppercase">
                {selectedModel.replace('_', ' ')}
              </span>
              <span>·</span>
              <span>Y: {Math.round(rotY)}°</span>
              <span>X: {Math.round(rotX)}°</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playHudBeep('subtle');
                  setAutoRotate(!autoRotate);
                }}
                className={`px-2.5 py-1 rounded-lg border text-xs font-mono-tech font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                  autoRotate 
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300' 
                    : 'bg-gray-900 border-gray-700 text-gray-400'
                }`}
              >
                <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin-slow' : ''}`} />
                <span>{autoRotate ? '360° SPIN ON' : 'SPIN PAUSED'}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playHudBeep('mode');
                  setExplodedView(!explodedView);
                }}
                className={`px-2.5 py-1 rounded-lg border text-xs font-mono-tech font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                  explodedView 
                    ? 'bg-amber-950/80 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]' 
                    : 'bg-gray-900 border-gray-700 text-gray-400'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>{explodedView ? 'EXPLODED: ACTIVE' : 'EXPLODE NANO'}</span>
              </button>
            </div>
          </div>

          {/* Central 3D SVG Hologram Viewport */}
          <div className="relative w-full max-w-[500px] h-[360px] flex items-center justify-center pointer-events-none">
            
            {/* SVG Wireframe Engine */}
            <svg
              viewBox="0 0 500 460"
              className={`w-full h-full overflow-visible transition-opacity ${flickerActive ? 'opacity-30' : 'opacity-100'}`}
              style={{ filter: `drop-shadow(0 0 8px ${c.glow})` }}
            >
              <defs>
                <radialGradient id="holoCoreGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="50%" stopColor={c.accent} stopOpacity="0.6" />
                  <stop offset="100%" stopColor={c.primary} stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* ======================================================= */}
              {/* MODEL 1: MARK 85 ARMOR WIREFRAME HOLOGRAPHIC SCHEMATIC */}
              {/* ======================================================= */}
              {selectedModel === 'SUIT_MARK85' && (
                <g>
                  {/* Helmet Node */}
                  {(() => {
                    const p = projectPoint(0, -90, 0, explodedView ? 35 : 0);
                    return (
                      <g>
                        <ellipse cx={p.x} cy={p.y} rx={22 * p.scale} ry={28 * p.scale} fill="none" stroke={c.accent} strokeWidth="1.8" />
                        <line x1={p.x - 10 * p.scale} y1={p.y - 4 * p.scale} x2={p.x + 10 * p.scale} y2={p.y - 4 * p.scale} stroke="#ffffff" strokeWidth="2.5" />
                        <circle cx={p.x} cy={p.y} r={3 * p.scale} fill="#ffffff" />
                      </g>
                    );
                  })()}

                  {/* Torso & Chest Uni-Beam Plate */}
                  {(() => {
                    const p1 = projectPoint(-45, -50, 10, explodedView ? 20 : 0);
                    const p2 = projectPoint(45, -50, 10, explodedView ? 20 : 0);
                    const p3 = projectPoint(30, 20, 10, explodedView ? 20 : 0);
                    const p4 = projectPoint(-30, 20, 10, explodedView ? 20 : 0);
                    const core = projectPoint(0, -20, 15, explodedView ? 20 : 0);

                    return (
                      <g>
                        <polygon
                          points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`}
                          fill={`${c.primary}15`}
                          stroke={c.primary}
                          strokeWidth="2"
                        />
                        {/* Glowing Chest Uni-Beam */}
                        <circle cx={core.x} cy={core.y} r={14 * core.scale} fill="url(#holoCoreGlow)" />
                        <circle cx={core.x} cy={core.y} r={8 * core.scale} fill="none" stroke="#ffffff" strokeWidth="2" />
                      </g>
                    );
                  })()}

                  {/* Left & Right Shoulders / Arms */}
                  {[-1, 1].map((side) => {
                    const sh = projectPoint(side * 65, -45, 0, explodedView ? 40 : 0);
                    const elb = projectPoint(side * 85, 5, -10, explodedView ? 40 : 0);
                    const hand = projectPoint(side * 95, 55, 0, explodedView ? 40 : 0);

                    return (
                      <g key={side}>
                        <line x1={sh.x} y1={sh.y} x2={elb.x} y2={elb.y} stroke={c.accent} strokeWidth="2" />
                        <line x1={elb.x} y1={elb.y} x2={hand.x} y2={hand.y} stroke={c.primary} strokeWidth="2" strokeDasharray="3 2" />
                        <circle cx={hand.x} cy={hand.y} r={7 * hand.scale} fill="none" stroke={c.accent} strokeWidth="1.5" />
                        <circle cx={hand.x} cy={hand.y} r={3 * hand.scale} fill="#ffffff" />
                      </g>
                    );
                  })}

                  {/* Left & Right Legs / Boots */}
                  {[-1, 1].map((side) => {
                    const hip = projectPoint(side * 25, 25, 0, explodedView ? 25 : 0);
                    const knee = projectPoint(side * 32, 90, 5, explodedView ? 25 : 0);
                    const boot = projectPoint(side * 36, 160, -5, explodedView ? 25 : 0);

                    return (
                      <g key={side}>
                        <line x1={hip.x} y1={hip.y} x2={knee.x} y2={knee.y} stroke={c.primary} strokeWidth="2.5" />
                        <line x1={knee.x} y1={knee.y} x2={boot.x} y2={boot.y} stroke={c.accent} strokeWidth="2" />
                        <circle cx={boot.x} cy={boot.y} r={8 * boot.scale} fill="none" stroke={c.accent} strokeWidth="2" />
                        <ellipse cx={boot.x} cy={boot.y + 4} rx={12 * boot.scale} ry={5 * boot.scale} fill={`${c.primary}22`} stroke={c.primary} />
                      </g>
                    );
                  })}
                </g>
              )}

              {/* ======================================================= */}
              {/* MODEL 2: GAUNTLET EXPLODED NANO-ASSEMBLY                */}
              {/* ======================================================= */}
              {selectedModel === 'GAUNTLET_EXPLODED' && (
                <g>
                  {/* Palm Repulsor Lens (Center piece) */}
                  {(() => {
                    const center = projectPoint(0, 0, 0, 0);
                    return (
                      <g>
                        <circle cx={center.x} cy={center.y} r={40 * center.scale} fill="url(#holoCoreGlow)" />
                        <circle cx={center.x} cy={center.y} r={32 * center.scale} fill="none" stroke="#ffffff" strokeWidth="2.5" />
                        <circle cx={center.x} cy={center.y} r={48 * center.scale} fill="none" stroke={c.accent} strokeWidth="1.5" strokeDasharray="6 4" />
                      </g>
                    );
                  })()}

                  {/* Exploded Nano-Armor Plates around the gauntlet */}
                  {[0, 60, 120, 180, 240, 300].map((deg, idx) => {
                    const rad = (deg * Math.PI) / 180;
                    const dist = explodedView ? 95 : 55;
                    const p = projectPoint(Math.cos(rad) * dist, Math.sin(rad) * dist, Math.sin(rad * 2) * 20);

                    return (
                      <g key={idx}>
                        <polygon
                          points={`
                            ${p.x - 18 * p.scale},${p.y - 10 * p.scale}
                            ${p.x + 18 * p.scale},${p.y - 12 * p.scale}
                            ${p.x + 12 * p.scale},${p.y + 14 * p.scale}
                            ${p.x - 12 * p.scale},${p.y + 12 * p.scale}
                          `}
                          fill={`${c.primary}25`}
                          stroke={c.accent}
                          strokeWidth="1.5"
                        />
                        <line x1={250} y1={230} x2={p.x} y2={p.y} stroke={c.primary} strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
                      </g>
                    );
                  })}

                  {/* Finger Servo Tendons Array */}
                  {[-45, -20, 5, 30, 55].map((xOffset, i) => {
                    const base = projectPoint(xOffset, -60, 0, explodedView ? 40 : 0);
                    const tip = projectPoint(xOffset * 1.3, -130, 15, explodedView ? 65 : 0);

                    return (
                      <g key={i}>
                        <line x1={base.x} y1={base.y} x2={tip.x} y2={tip.y} stroke={c.primary} strokeWidth="2.5" />
                        <circle cx={tip.x} cy={tip.y} r={5 * tip.scale} fill={c.accent} />
                      </g>
                    );
                  })}
                </g>
              )}

              {/* ======================================================= */}
              {/* MODEL 3: STARK GLOBAL SATELLITE DEFENSE GRID            */}
              {/* ======================================================= */}
              {selectedModel === 'EARTH_SATELLITE' && (
                <g>
                  {/* Holographic Earth Sphere Core */}
                  {(() => {
                    const center = projectPoint(0, 0, 0, 0);
                    return (
                      <g>
                        <circle cx={center.x} cy={center.y} r={75 * center.scale} fill={`${c.primary}15`} stroke={c.accent} strokeWidth="2" />
                        {/* Latitude / Longitude Ellipses */}
                        <ellipse cx={center.x} cy={center.y} rx={75 * center.scale} ry={25 * center.scale} fill="none" stroke={c.primary} strokeWidth="1.2" strokeDasharray="4 3" />
                        <ellipse cx={center.x} cy={center.y} rx={25 * center.scale} ry={75 * center.scale} fill="none" stroke={c.primary} strokeWidth="1.2" strokeDasharray="4 3" />
                      </g>
                    );
                  })()}

                  {/* Orbital Satellites in 3D Motion */}
                  {[0, 72, 144, 216, 288].map((angle, i) => {
                    const orbitalRad = ((angle + rotY * 1.4) * Math.PI) / 180;
                    const satDist = explodedView ? 140 : 105;
                    const satX = Math.cos(orbitalRad) * satDist;
                    const satY = Math.sin(orbitalRad * 0.8) * (satDist * 0.45);
                    const satZ = Math.sin(orbitalRad) * satDist;

                    const p = projectPoint(satX, satY, satZ);

                    return (
                      <g key={i}>
                        <line x1={250} y1={230} x2={p.x} y2={p.y} stroke={c.accent} strokeWidth="1" strokeDasharray="2 3" opacity="0.3" />
                        <circle cx={p.x} cy={p.y} r={6 * p.scale} fill="#ffffff" />
                        <circle cx={p.x} cy={p.y} r={12 * p.scale} fill="none" stroke={c.accent} strokeWidth="1.5" className="animate-ping" />
                        <text x={p.x + 10} y={p.y - 6} fill={c.accent} fontSize="9" fontFamily="monospace" fontWeight="bold">
                          STARK-SAT-0{i + 1}
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* ======================================================= */}
              {/* MODEL 4: ARC REACTOR QUANTUM CORE                       */}
              {/* ======================================================= */}
              {selectedModel === 'ARC_QUANTUM' && (
                <g>
                  {/* Concentric rotating magnetic containment rings */}
                  {[40, 70, 100, 130].map((radius, idx) => {
                    const center = projectPoint(0, 0, (idx - 1.5) * (explodedView ? 45 : 10));
                    return (
                      <ellipse
                        key={idx}
                        cx={center.x}
                        cy={center.y}
                        rx={radius * center.scale}
                        ry={(radius * 0.65) * center.scale}
                        fill="none"
                        stroke={idx % 2 === 0 ? c.accent : '#ffffff'}
                        strokeWidth={idx === 1 ? '3' : '1.8'}
                        strokeDasharray={idx === 2 ? '12 8' : 'none'}
                      />
                    );
                  })}

                  {/* Core Quantum Emitter */}
                  {(() => {
                    const cPoint = projectPoint(0, 0, 0);
                    return (
                      <g>
                        <circle cx={cPoint.x} cy={cPoint.y} r={32 * cPoint.scale} fill="url(#holoCoreGlow)" />
                        <circle cx={cPoint.x} cy={cPoint.y} r={16 * cPoint.scale} fill="#ffffff" />
                      </g>
                    );
                  })()}
                </g>
              )}
            </svg>
          </div>

          {/* Projector Base Pedestal Graphic at Bottom */}
          <div className="w-full flex flex-col items-center justify-center p-3 relative z-10 border-t border-gray-900 bg-gray-950/80 backdrop-blur-md">
            <div 
              className="w-48 h-3 rounded-full border border-gray-800 shadow-xl mb-1 relative overflow-hidden"
              style={{ backgroundColor: `${c.primary}30` }}
            >
              <div 
                className="h-full rounded-full animate-pulse" 
                style={{ backgroundColor: c.accent, boxShadow: `0 0 12px ${c.glow}` }}
              />
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono-tech text-gray-400">
              <span className="flex items-center gap-1">
                <Compass className="w-3 h-3 text-cyan-400" /> DRAG TO ROTATE
              </span>
              <span>·</span>
              <span>ZOOM: {(zoom * 100).toFixed(0)}%</span>
              <span>·</span>
              <span style={{ color: c.accent }}>RESOLUTION: 8K VOLUMETRIC</span>
            </div>
          </div>
        </div>

        {/* Right Column: Model Library & Nanotech Diagnostics (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          
          {/* Section 1: Holographic Model Catalog */}
          <div className="bg-gray-900/90 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col gap-2.5">
            <span className="font-tech text-xs font-bold text-cyan-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-800 pb-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>3D HOLOGRAPHIC BLUEPRINTS</span>
            </span>

            {[
              {
                id: 'SUIT_MARK85' as HologramModel,
                title: 'MARK 85 NANO-ARMOR',
                desc: 'Full suit wireframe with chest unibeam & micro-thrusters',
                icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />,
              },
              {
                id: 'GAUNTLET_EXPLODED' as HologramModel,
                title: 'GAUNTLET EXPLODED VIEW',
                desc: 'Palm repulsor lens, micro-servos & magnetic coils',
                icon: <Zap className="w-4 h-4 text-amber-400" />,
              },
              {
                id: 'EARTH_SATELLITE' as HologramModel,
                title: 'SATELLITE DEFENSE RADAR',
                desc: '3D orbital globe tracking Stark security satellites',
                icon: <Globe className="w-4 h-4 text-emerald-400" />,
              },
              {
                id: 'ARC_QUANTUM' as HologramModel,
                title: 'ARC QUANTUM CORE',
                desc: 'Magnetic confinement ring matrix with plasma emitter',
                icon: <Flame className="w-4 h-4 text-red-400" />,
              },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectModel(item.id)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                  selectedModel === item.id
                    ? 'bg-cyan-950/70 border-cyan-400 text-cyan-100 shadow-md'
                    : 'bg-gray-950/60 border-gray-800 text-gray-400 hover:bg-gray-900 hover:text-gray-200'
                }`}
              >
                <div className="mt-0.5">{item.icon}</div>
                <div>
                  <div className="font-tech text-xs font-bold text-cyan-200">
                    {item.title}
                  </div>
                  <div className="text-[11px] font-sans text-gray-400 mt-0.5 leading-snug">
                    {item.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Section 2: Hologram Emitter Calibration Sliders */}
          <div className="bg-gray-900/90 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col gap-3">
            <span className="font-tech text-xs font-bold text-cyan-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-800 pb-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>EMITTER OPTICS CALIBRATION</span>
            </span>

            {/* Slider 1: Zoom / Volumetric Scale */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono-tech text-gray-300 mb-1">
                <span>VOLUMETRIC SCALE</span>
                <span className="text-cyan-300 font-bold">{(zoom * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.5"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Slider 2: Scanline Photon Density */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono-tech text-gray-300 mb-1">
                <span>PHOTON SCANLINE DENSITY</span>
                <span className="text-cyan-300 font-bold">{scanlineDensity}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={scanlineDensity}
                onChange={(e) => setScanlineDensity(parseInt(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
              <button
                onClick={() => {
                  soundFx.playHudBeep('subtle');
                  setRotX(10);
                  setRotY(25);
                  setZoom(1.0);
                }}
                className="text-xs text-gray-400 hover:text-cyan-300 underline font-mono-tech cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Camera View</span>
              </button>

              <span className="text-[10px] font-mono-tech text-emerald-400">
                FIELD STABILITY: 99.8%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
