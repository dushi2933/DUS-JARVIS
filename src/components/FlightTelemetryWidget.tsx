import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { 
  Plane, 
  Wind, 
  Gauge, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Zap, 
  Activity, 
  Compass, 
  Layers, 
  Flame, 
  ShieldAlert,
  Sliders,
  Crosshair,
  Sparkles,
  Eye,
  Radio
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { useTheme } from '../context/ThemeContext';

interface FlightTelemetryWidgetProps {
  flightStabilizersPower: number; // e.g. 25%
  repulsorCharge: number; // 0 - 100
  arcReactorOutputGW: number; // e.g. 4.5
}

interface TelemetryPoint {
  time: number;
  altitude: number; // in feet (0 to 50,000)
  velocityMach: number; // in Mach (0 to 3.8)
  airDensity: number; // kg/m^3 (0.15 to 1.225)
}

interface PredictedPoint {
  time: number;
  altitude: number;
  altUpper: number;
  altLower: number;
  velocityMach: number;
  label?: string;
}

export const FlightTelemetryWidget: React.FC<FlightTelemetryWidgetProps> = ({
  flightStabilizersPower,
  repulsorCharge,
  arcReactorOutputGW,
}) => {
  const { themeConfig } = useTheme();

  const [flightMode, setFlightMode] = useState<'CRUISE' | 'CLIMB' | 'DIVE' | 'SUPERSONIC'>('CRUISE');
  const [altitude, setAltitude] = useState<number>(28500); // ft
  const [velocityMach, setVelocityMach] = useState<number>(1.85); // Mach
  const [pitchAngle, setPitchAngle] = useState<number>(4); // degrees
  const [isPredictivePathEnabled, setIsPredictivePathEnabled] = useState<boolean>(true);
  const [predictionHorizonSecs, setPredictionHorizonSecs] = useState<number>(8); // 8 seconds forward

  const [history, setHistory] = useState<TelemetryPoint[]>(() => {
    const pts: TelemetryPoint[] = [];
    for (let i = 0; i < 20; i++) {
      const alt = 25000 + i * 200 + Math.sin(i) * 300;
      pts.push({
        time: i,
        altitude: alt,
        velocityMach: 1.6 + Math.cos(i * 0.5) * 0.2,
        airDensity: +(1.225 * Math.exp(-alt / 29000)).toFixed(3),
      });
    }
    return pts;
  });

  // Calculate barometric air density based on standard atmospheric model: rho = rho0 * exp(-h/H)
  const currentAirDensity = +(1.225 * Math.exp(-altitude / 29000)).toFixed(3);
  // Dynamic pressure q = 0.5 * rho * v^2 in kPa
  const speedMps = velocityMach * 340.29; // Mach to m/s
  const dynamicPressureKPa = +(0.5 * currentAirDensity * (speedMps ** 2) / 1000).toFixed(1);

  // Power routing scale factor (from suit gauntlet stabilizers)
  const stabilizerEfficiency = Math.max(0.2, flightStabilizersPower / 50);

  // Dynamic Flight simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setAltitude((prevAlt) => {
        let delta = 0;
        if (flightMode === 'CLIMB') delta = 450 * stabilizerEfficiency;
        else if (flightMode === 'DIVE') delta = -600;
        else if (flightMode === 'SUPERSONIC') delta = 250 * stabilizerEfficiency;
        else delta = (Math.sin(Date.now() / 2000) * 80);

        const newAlt = Math.max(500, Math.min(52000, prevAlt + delta));
        return Math.round(newAlt);
      });

      setVelocityMach((prevMach) => {
        let targetMach = 1.6;
        if (flightMode === 'SUPERSONIC') targetMach = 2.8 + (repulsorCharge / 100) * 0.8;
        else if (flightMode === 'CLIMB') targetMach = 1.35 * stabilizerEfficiency;
        else if (flightMode === 'DIVE') targetMach = 2.2;
        else targetMach = 1.5 + (flightStabilizersPower / 100) * 0.5;

        const jitter = (Math.random() - 0.5) * 0.04;
        return +(prevMach + (targetMach - prevMach) * 0.12 + jitter).toFixed(2);
      });

      setPitchAngle(() => {
        if (flightMode === 'CLIMB') return 18;
        if (flightMode === 'DIVE') return -22;
        if (flightMode === 'SUPERSONIC') return 8;
        return 2;
      });

      // Append to chart history
      setHistory((prev) => {
        const nextTime = (prev[prev.length - 1]?.time || 0) + 1;
        const newPoint: TelemetryPoint = {
          time: nextTime,
          altitude,
          velocityMach,
          airDensity: currentAirDensity,
        };
        return [...prev.slice(1), newPoint];
      });
    }, 700);

    return () => clearInterval(interval);
  }, [flightMode, stabilizerEfficiency, repulsorCharge, flightStabilizersPower, altitude, velocityMach, currentAirDensity]);

  // SVG Chart Dimensions
  const chartWidth = 380;
  const chartHeight = 125;
  const padding = 16;

  const minAlt = 10000;
  const maxAlt = 52000;
  const minMach = 0.5;
  const maxMach = 3.6;

  // D3-CALCULATED PREDICTIVE FLIGHT TRAJECTORY
  // Uses kinematic extrapolation: y(t) = y0 + vy*t + 0.5*a*t^2 with atmospheric drag modeling
  const { predictedPoints, estimatedApogee, verticalRateFpm } = useMemo(() => {
    const pts: PredictedPoint[] = [];
    const lastHistory = history[history.length - 1] || { time: 0, altitude, velocityMach, airDensity: currentAirDensity };

    // Vertical velocity in ft/sec
    // 1 Mach = approx 1116.4 ft/s. Component along vertical = Mach * 1116.4 * sin(pitchAngle)
    const pitchRad = (pitchAngle * Math.PI) / 180;
    const speedFps = velocityMach * 1116.4;
    const vVerticalFps = speedFps * Math.sin(pitchRad);
    const vRateFpm = Math.round(vVerticalFps * 60);

    // Thrust acceleration from repulsors & arc power
    const thrustAccFps2 = (repulsorCharge / 100) * 15 * stabilizerEfficiency;

    // Build extrapolation forward
    let peakAlt = altitude;
    const numFutureSteps = 8;
    for (let step = 1; step <= numFutureSteps; step++) {
      const dt = (step / numFutureSteps) * predictionHorizonSecs;
      
      // Altitude prediction with damping
      const dampingFactor = Math.exp(-dt * 0.08);
      const deltaAlt = (vVerticalFps * dt + 0.5 * thrustAccFps2 * (dt ** 2)) * dampingFactor;
      const nominalAlt = Math.max(500, Math.min(maxAlt, Math.round(altitude + deltaAlt)));

      if (nominalAlt > peakAlt) peakAlt = nominalAlt;

      // Cone of uncertainty (aerodynamic turbulence widening over time)
      const uncertainty = Math.round(dt * 120 * (1 / stabilizerEfficiency));

      pts.push({
        time: lastHistory.time + step,
        altitude: nominalAlt,
        altUpper: Math.min(maxAlt, nominalAlt + uncertainty),
        altLower: Math.max(500, nominalAlt - uncertainty),
        velocityMach: +(velocityMach + (flightMode === 'SUPERSONIC' ? 0.05 * step : 0)).toFixed(2),
        label: step % 2 === 0 ? `+${dt.toFixed(0)}s` : undefined,
      });
    }

    return {
      predictedPoints: pts,
      estimatedApogee: peakAlt,
      verticalRateFpm: vRateFpm,
    };
  }, [history, altitude, velocityMach, pitchAngle, flightMode, repulsorCharge, stabilizerEfficiency, predictionHorizonSecs]);

  // D3 SCALES
  const totalTimePoints = history.length + (isPredictivePathEnabled ? predictedPoints.length : 0);

  const xScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([0, totalTimePoints - 1])
      .range([padding, chartWidth - padding]);
  }, [totalTimePoints, chartWidth, padding]);

  const yScaleAlt = useMemo(() => {
    return d3.scaleLinear()
      .domain([minAlt, maxAlt])
      .range([chartHeight - padding, padding]);
  }, [minAlt, maxAlt, chartHeight, padding]);

  const yScaleMach = useMemo(() => {
    return d3.scaleLinear()
      .domain([minMach, maxMach])
      .range([chartHeight - padding, padding]);
  }, [minMach, maxMach, chartHeight, padding]);

  // D3 LINE GENERATORS
  // 1. Historical Altitude line
  const d3AltLine = useMemo(() => {
    return d3.line<TelemetryPoint>()
      .x((_, i) => xScale(i))
      .y((d) => yScaleAlt(Math.min(maxAlt, Math.max(minAlt, d.altitude))))
      .curve(d3.curveMonotoneX);
  }, [xScale, yScaleAlt, minAlt, maxAlt]);

  // 2. Historical Altitude Area
  const d3AltArea = useMemo(() => {
    return d3.area<TelemetryPoint>()
      .x((_, i) => xScale(i))
      .y0(chartHeight - padding)
      .y1((d) => yScaleAlt(Math.min(maxAlt, Math.max(minAlt, d.altitude))))
      .curve(d3.curveMonotoneX);
  }, [xScale, yScaleAlt, chartHeight, padding, minAlt, maxAlt]);

  // 3. Historical Mach line
  const d3MachLine = useMemo(() => {
    return d3.line<TelemetryPoint>()
      .x((_, i) => xScale(i))
      .y((d) => yScaleMach(Math.min(maxMach, Math.max(minMach, d.velocityMach))))
      .curve(d3.curveMonotoneX);
  }, [xScale, yScaleMach, minMach, maxMach]);

  // 4. PREDICTIVE D3 Line (Connecting from last historical point through predictions)
  const combinedPredictiveData = useMemo(() => {
    if (!isPredictivePathEnabled) return [];
    const last = history[history.length - 1];
    if (!last) return [];

    const startPt: PredictedPoint = {
      time: last.time,
      altitude: last.altitude,
      altUpper: last.altitude,
      altLower: last.altitude,
      velocityMach: last.velocityMach,
    };

    return [startPt, ...predictedPoints];
  }, [isPredictivePathEnabled, history, predictedPoints]);

  const d3PredictiveLine = useMemo(() => {
    const startIndex = history.length - 1;
    return d3.line<PredictedPoint>()
      .x((_, i) => xScale(startIndex + i))
      .y((d) => yScaleAlt(Math.min(maxAlt, Math.max(minAlt, d.altitude))))
      .curve(d3.curveMonotoneX);
  }, [xScale, yScaleAlt, history.length, minAlt, maxAlt]);

  // 5. PREDICTIVE D3 Uncertainty Corridor (Area of Probability)
  const d3PredictiveArea = useMemo(() => {
    const startIndex = history.length - 1;
    return d3.area<PredictedPoint>()
      .x((_, i) => xScale(startIndex + i))
      .y0((d) => yScaleAlt(Math.min(maxAlt, Math.max(minAlt, d.altLower))))
      .y1((d) => yScaleAlt(Math.min(maxAlt, Math.max(minAlt, d.altUpper))))
      .curve(d3.curveMonotoneX);
  }, [xScale, yScaleAlt, history.length, minAlt, maxAlt]);

  const altSvgPath = d3AltLine(history) || '';
  const areaSvgPath = d3AltArea(history) || '';
  const machSvgPath = d3MachLine(history) || '';
  const predictiveSvgPath = combinedPredictiveData.length > 0 ? (d3PredictiveLine(combinedPredictiveData) || '') : '';
  const predictiveAreaSvgPath = combinedPredictiveData.length > 0 ? (d3PredictiveArea(combinedPredictiveData) || '') : '';

  // Terminal target point coords
  const terminalIndex = history.length + predictedPoints.length - 1;
  const terminalX = xScale(terminalIndex);
  const terminalY = yScaleAlt(Math.min(maxAlt, Math.max(minAlt, predictedPoints[predictedPoints.length - 1]?.altitude || altitude)));

  const isSupersonic = velocityMach >= 1.0;

  return (
    <div className="bg-gray-950/85 border border-cyan-500/30 rounded-xl p-3.5 backdrop-blur-md shadow-xl flex flex-col gap-3 relative overflow-hidden group hover:border-cyan-400/50 transition-all select-none">
      <div className="absolute inset-0 holo-grid opacity-15 pointer-events-none" />

      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 relative z-10 border-b border-gray-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
            <Plane className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-tech text-xs font-bold text-cyan-200 tracking-wider">
                FLIGHT ALTITUDE & PREDICTIVE PATH TELEMETRY
              </h4>
              {isSupersonic && (
                <span className="text-[9px] font-mono-tech px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold animate-pulse">
                  SUPERSONIC
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-400 font-mono-tech">
              D3 KINEMATIC TRAJECTORY SOLVER · VECTOR: <span className="text-cyan-300 font-bold">{verticalRateFpm > 0 ? `+${verticalRateFpm}` : verticalRateFpm} FT/MIN</span>
            </p>
          </div>
        </div>

        {/* Controls: Mode Selector & Predictive Toggle */}
        <div className="flex items-center gap-1.5">
          {/* Predictive Vector Toggle Button */}
          <button
            onClick={() => {
              soundFx.playHudBeep('mode');
              setIsPredictivePathEnabled(!isPredictivePathEnabled);
            }}
            className={`px-2 py-1 rounded text-[10px] font-mono-tech font-bold cursor-pointer transition-all flex items-center gap-1 border ${
              isPredictivePathEnabled
                ? 'bg-purple-950/80 text-purple-300 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                : 'bg-gray-900 border-gray-800 text-gray-500 hover:text-gray-300'
            }`}
          >
            <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
            <span>{isPredictivePathEnabled ? 'PREDICTIVE VECTOR: ON' : 'PREDICTION: OFF'}</span>
          </button>

          {/* Mode Selector Chips */}
          <div className="flex items-center gap-1 bg-gray-900/90 p-0.5 rounded-lg border border-gray-800">
            {(['CRUISE', 'CLIMB', 'DIVE', 'SUPERSONIC'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  soundFx.playHudBeep('subtle');
                  setFlightMode(mode);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold cursor-pointer transition-all ${
                  flightMode === mode
                    ? 'bg-cyan-600 text-gray-950 font-extrabold shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                    : 'text-gray-400 hover:text-cyan-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary 4 Telemetry Gauges (Altitude, Velocity, Air Density, Predicted Apogee) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 relative z-10 font-mono-tech">
        {/* Metric 1: Current Altitude */}
        <div className="bg-gray-900/80 p-2 rounded-lg border border-cyan-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] text-gray-400">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-cyan-400" /> ALTITUDE
            </span>
            <span className="text-cyan-300 font-bold">MSL</span>
          </div>
          <div className="text-sm font-bold text-cyan-100 mt-1">
            {altitude.toLocaleString()} <span className="text-[10px] text-cyan-400 font-normal">FT</span>
          </div>
          <div className="text-[9px] text-gray-500 mt-0.5">
            PITCH: {pitchAngle > 0 ? `+${pitchAngle}°` : `${pitchAngle}°`}
          </div>
        </div>

        {/* Metric 2: Air Velocity / Mach */}
        <div className="bg-gray-900/80 p-2 rounded-lg border border-amber-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] text-gray-400">
            <span className="flex items-center gap-1">
              <Gauge className="w-3 h-3 text-amber-400" /> VELOCITY
            </span>
            <span className="text-amber-400 font-bold">MACH</span>
          </div>
          <div className="text-sm font-bold text-amber-300 mt-1">
            M {velocityMach.toFixed(2)} <span className="text-[10px] text-amber-400 font-normal">({Math.round(velocityMach * 767)} MPH)</span>
          </div>
          <div className="text-[9px] text-gray-500 mt-0.5">
            POWER: {flightStabilizersPower}%
          </div>
        </div>

        {/* Metric 3: Atmospheric Air Density */}
        <div className="bg-gray-900/80 p-2 rounded-lg border border-emerald-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] text-gray-400">
            <span className="flex items-center gap-1">
              <Wind className="w-3 h-3 text-emerald-400" /> AIR DENSITY (ρ)
            </span>
            <span className="text-emerald-400 font-bold">ATM</span>
          </div>
          <div className="text-sm font-bold text-emerald-300 mt-1">
            {currentAirDensity} <span className="text-[10px] text-emerald-400 font-normal">kg/m³</span>
          </div>
          <div className="text-[9px] text-gray-500 mt-0.5">
            Q-PRESS: {dynamicPressureKPa} kPa
          </div>
        </div>

        {/* Metric 4: D3 Predicted Apogee & Horizon */}
        <div className="bg-purple-950/40 p-2 rounded-lg border border-purple-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] text-purple-300">
            <span className="flex items-center gap-1">
              <Crosshair className="w-3 h-3 text-purple-400" /> EST. APOGEE
            </span>
            <span className="text-[9px] px-1 rounded bg-purple-900/80 font-bold">D3</span>
          </div>
          <div className="text-sm font-bold text-purple-200 mt-1">
            {estimatedApogee.toLocaleString()} <span className="text-[10px] text-purple-400 font-normal">FT</span>
          </div>
          <div className="text-[9px] text-purple-400/80 mt-0.5">
            HORIZON: +{predictionHorizonSecs}s PROJECTION
          </div>
        </div>
      </div>

      {/* SVG Multi-Layer Chart: D3 Altitude Profile + D3 Mach Curve + D3 Predictive Trajectory Line */}
      <div className="bg-gray-950 border border-gray-800 rounded-lg p-2.5 relative z-10 flex flex-col gap-1 shadow-inner">
        <div className="flex items-center justify-between text-[10px] font-mono-tech text-gray-400 px-1 border-b border-gray-800/80 pb-1.5">
          <span className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-1 bg-cyan-400 rounded-full inline-block" />
              <span className="text-cyan-300">Actual Altitude</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-1 bg-amber-400 rounded-full inline-block" />
              <span className="text-amber-300">Mach Curve</span>
            </span>
            {isPredictivePathEnabled && (
              <span className="flex items-center gap-1">
                <span className="w-3 h-1 border-t-2 border-dashed border-purple-400 inline-block" />
                <span className="text-purple-300 font-bold">D3 Predictive Flight Path (+{predictionHorizonSecs}s)</span>
              </span>
            )}
          </span>
          <span className="text-gray-500 font-semibold hidden sm:inline">
            KINEMATICS OVERLAY
          </span>
        </div>

        <div className="relative w-full h-[125px] flex items-center justify-center">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Actual Altitude Area Gradient */}
              <linearGradient id="altAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
              </linearGradient>

              {/* D3 Predictive Confidence Corridor Gradient */}
              <linearGradient id="predictiveCorridorGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.08" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#1f2937" strokeDasharray="3 3" />
            <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="#1f2937" strokeDasharray="3 3" />
            <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#1f2937" />

            {/* Mach 1.0 Threshold Transonic dotted guideline */}
            <line
              x1={padding}
              y1={yScaleMach(1.0)}
              x2={chartWidth - padding}
              y2={yScaleMach(1.0)}
              stroke="#eab308"
              strokeDasharray="2 2"
              strokeOpacity="0.35"
            />

            {/* Historical Altitude Gradient Area Fill */}
            <path d={areaSvgPath} fill="url(#altAreaGrad)" />

            {/* D3 Predictive Uncertainty Corridor Fill */}
            {isPredictivePathEnabled && predictiveAreaSvgPath && (
              <path d={predictiveAreaSvgPath} fill="url(#predictiveCorridorGrad)" />
            )}

            {/* Historical Altitude Line */}
            <path
              d={altSvgPath}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Mach Velocity Line */}
            <path
              d={machSvgPath}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* D3 PREDICTIVE FLIGHT PATH TRAJECTORY LINE */}
            {isPredictivePathEnabled && predictiveSvgPath && (
              <path
                d={predictiveSvgPath}
                fill="none"
                stroke="#c084fc"
                strokeWidth="2.5"
                strokeDasharray="6 3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(192, 132, 252, 0.7))',
                }}
              />
            )}

            {/* Current Position Dot */}
            <circle
              cx={xScale(history.length - 1)}
              cy={yScaleAlt(altitude)}
              r="4"
              fill="#22d3ee"
              stroke="#083344"
              strokeWidth="1.5"
            />
            <circle
              cx={xScale(history.length - 1)}
              cy={yScaleAlt(altitude)}
              r="7"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="1"
              className="animate-ping"
            />

            {/* D3 Predictive Future Waypoints */}
            {isPredictivePathEnabled && combinedPredictiveData.map((pt, idx) => {
              if (idx === 0) return null; // skip start
              const cx = xScale(history.length - 1 + idx);
              const cy = yScaleAlt(Math.min(maxAlt, Math.max(minAlt, pt.altitude)));
              return (
                <g key={idx}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r="2.5"
                    fill="#a855f7"
                    stroke="#ffffff"
                    strokeWidth="0.8"
                  />
                  {pt.label && (
                    <text
                      x={cx}
                      y={cy - 7}
                      textAnchor="middle"
                      fill="#d8b4fe"
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {pt.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* D3 Terminal Intercept / Apogee Reticle */}
            {isPredictivePathEnabled && (
              <g transform={`translate(${terminalX}, ${terminalY})`}>
                <circle r="6" fill="none" stroke="#e879f9" strokeWidth="1.5" strokeDasharray="3 2" className="animate-spin-slow" />
                <line x1="-8" y1="0" x2="8" y2="0" stroke="#f43f5e" strokeWidth="1" />
                <line x1="0" y1="-8" x2="0" y2="8" stroke="#f43f5e" strokeWidth="1" />
                <text
                  x="10"
                  y="3"
                  fill="#f43f5e"
                  fontSize="8"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  TARGET APOGEE
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Bottom Trajectory Legend & Horizon Slider */}
        <div className="flex items-center justify-between text-[9px] font-mono-tech text-gray-500 pt-1 border-t border-gray-800/60 px-1">
          <span>0s (NOW)</span>
          <span className="text-cyan-400 font-semibold">T+{(predictionHorizonSecs / 2).toFixed(0)}s HORIZON</span>
          <span className="text-purple-300 font-bold">T+{predictionHorizonSecs}s PROJECTED APOGEE</span>
        </div>
      </div>
    </div>
  );
};
