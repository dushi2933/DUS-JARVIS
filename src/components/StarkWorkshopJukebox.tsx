import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Radio, 
  Disc, 
  Activity, 
  Sliders, 
  Music, 
  Flame,
  Zap,
  Repeat
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useToast } from '../context/ToastContext';

interface Track {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  description: string;
}

export const StarkWorkshopJukebox: React.FC = () => {
  const { addToast } = useToast();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState<number>(0);
  const [isRadioScannerOn, setIsRadioScannerOn] = useState<boolean>(true);
  const [atcTransmission, setAtcTransmission] = useState<string>(
    'NY-APP: "Stark-One, radar contact 12 miles south of JFK, climb and maintain flight level 450."'
  );

  const tracks: Track[] = [
    {
      id: 't1',
      title: 'HIGH VOLTAGE // BACK IN BLACK',
      genre: 'Classic Hard Rock',
      bpm: 118,
      description: 'Iconic Tony Stark garage driving guitar riff with punchy overdriven rhythm',
    },
    {
      id: 't2',
      title: 'CYBERPUNK LAB DRIFT',
      genre: 'Retro Synthwave',
      bpm: 124,
      description: 'Analog arpeggios with deep resonant saw bass for late-night wrenching',
    },
    {
      id: 't3',
      title: 'SUPERSONIC AFTERBURNER',
      genre: 'Fast Tech D&B',
      bpm: 140,
      description: 'Mach 3 high-tempo flight groove with sub-atmospheric drum syncopation',
    },
    {
      id: 't4',
      title: 'ARC REACTOR HARMONICS',
      genre: 'Deep Ambient Drone',
      bpm: 65,
      description: 'Soothing pure sine-wave resonance modeled on Mark 50 nanotech idling',
    },
  ];

  const currentTrack = tracks[currentTrackIdx];

  // Synthesizer Audio loop using Web Audio API
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<any>(null);

  // Play synthetic beat step
  const playSynthBeat = (step: number) => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;

      // 1. Kick on beat 0 and 2
      if (step % 2 === 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      }

      // 2. Snare / Clack on beat 1 and 3
      if (step % 2 === 1) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      }

      // 3. Melodic lead note based on track
      const oscLead = ctx.createOscillator();
      const gainLead = ctx.createGain();
      const scale = currentTrackIdx === 0 
        ? [164.81, 196.00, 220.00, 246.94, 293.66] // E minor pentatonic rock
        : currentTrackIdx === 1
        ? [220, 261.63, 329.63, 392, 440] // Synthwave
        : currentTrackIdx === 2
        ? [146.83, 174.61, 220, 293.66, 349.23] // D minor fast
        : [110, 130.81, 164.81, 196]; // Ambient drone

      const note = scale[step % scale.length];
      oscLead.type = currentTrackIdx === 0 ? 'sawtooth' : currentTrackIdx === 1 ? 'square' : 'sine';
      oscLead.frequency.setValueAtTime(note, now);
      gainLead.gain.setValueAtTime(0.06, now);
      gainLead.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      oscLead.connect(gainLead);
      gainLead.connect(ctx.destination);
      oscLead.start(now);
      oscLead.stop(now + 0.22);
    } catch (e) {
      // Audio fallback
    }
  };

  // Music playback interval
  useEffect(() => {
    if (isPlaying) {
      let step = 0;
      const msPerBeat = (60 / currentTrack.bpm) * 1000 * 0.5;
      intervalRef.current = setInterval(() => {
        playSynthBeat(step);
        step = (step + 1) % 8;
      }, msPerBeat);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentTrackIdx]);

  // ATC Radio Scanner chatter loop
  useEffect(() => {
    const atcLines = [
      'NY-APP: "Stark-One, radar contact 12 miles south of JFK, climb and maintain flight level 450."',
      'SHIELD-HQ: "Iron Man, bifrost energy spike registered in sector 4. Recon satellite in position."',
      'BOS-CTR: "Stark flight, you have unrestricted supersonic transit clearance over eastern seaboard."',
      'STARK-COMM: "J.A.R.V.I.S., all workshop telemetry nominal. Gauntlet capacitor at full charge."',
      'NORAD-AIR: "Unidentified high-speed vector confirmed as Tony Stark. Standing down alert status."',
    ];

    const atcInterval = setInterval(() => {
      if (isRadioScannerOn) {
        const nextMsg = atcLines[Math.floor(Math.random() * atcLines.length)];
        setAtcTransmission(nextMsg);
      }
    }, 4500);

    return () => clearInterval(atcInterval);
  }, [isRadioScannerOn]);

  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    soundFx.playHudBeep('mode');
    if (nextState) {
      jarvisVoice.speak(`Queueing ${currentTrack.title}, Mr. Stark.`);
    }
  };

  const handleNextTrack = () => {
    soundFx.playHudBeep('confirm');
    const nextIdx = (currentTrackIdx + 1) % tracks.length;
    setCurrentTrackIdx(nextIdx);
    jarvisVoice.speak(`Switching track to ${tracks[nextIdx].title}.`);
  };

  return (
    <div className="bg-gray-950/90 border border-red-500/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md relative min-h-[640px] flex flex-col p-4 gap-4 select-none">
      <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-500/20 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-400 flex items-center justify-center text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
            <Disc className={`w-5 h-5 ${isPlaying ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tech text-base font-bold text-red-200 tracking-wider">
                STARK SOUNDSTAGE // WORKSHOP JUKEBOX & ATC RADIO
              </h2>
              <span className={`text-[10px] font-mono-tech px-2 py-0.5 rounded border uppercase font-bold ${
                isPlaying ? 'bg-red-950 text-red-300 border-red-500 animate-pulse' : 'bg-gray-900 text-gray-400 border-gray-800'
              }`}>
                {isPlaying ? 'AUDIO SYNTH ACTIVE' : 'PAUSED'}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans">
              Authentic synthesizer rock garage tracks & real-time FAA/SHIELD tactical radio scanner
            </p>
          </div>
        </div>

        {/* Radio Scanner Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFx.playHudBeep('subtle');
              setIsRadioScannerOn(!isRadioScannerOn);
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono-tech font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              isRadioScannerOn
                ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50 shadow-md'
                : 'bg-gray-900 text-gray-500 border-gray-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{isRadioScannerOn ? 'ATC SCANNER: LIVE' : 'SCANNER: MUTED'}</span>
          </button>
        </div>
      </div>

      {/* Main Jukebox Visualizer & Equalizer */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
        
        {/* Left: Player Stage & Audioreactive Equalizer (8 Cols) */}
        <div className="lg:col-span-8 bg-gray-950/95 border border-red-500/30 rounded-2xl relative overflow-hidden flex flex-col items-center justify-between p-6 min-h-[460px] shadow-inner">
          
          {/* Top ATC Radio Banner */}
          <div className="w-full bg-gray-900/80 p-3 rounded-xl border border-gray-800 flex items-center gap-3">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse shrink-0" />
            <div className="flex-1 overflow-hidden">
              <span className="text-[10px] font-mono-tech text-gray-500 block">TACTICAL RADIO COMM CHANNEL</span>
              <p className="text-xs font-mono-tech text-emerald-300 font-semibold truncate animate-pulse">
                {atcTransmission}
              </p>
            </div>
          </div>

          {/* Center Jukebox Turntable / Arc Reactor Visualizer */}
          <div className="my-auto flex flex-col items-center gap-4 text-center">
            <div className={`w-40 h-40 rounded-full border-4 border-dashed border-red-500/50 bg-gray-900 flex items-center justify-center relative shadow-[0_0_35px_rgba(239,68,68,0.4)] ${
              isPlaying ? 'animate-spin-slow' : ''
            }`}>
              <div className="w-28 h-28 rounded-full border-2 border-amber-400 bg-red-950/80 flex items-center justify-center">
                <Music className="w-10 h-10 text-amber-300" />
              </div>
            </div>

            <div>
              <span className="text-xs font-mono-tech text-amber-400 font-bold block tracking-wider">
                {currentTrack.genre.toUpperCase()} · {currentTrack.bpm} BPM
              </span>
              <h3 className="font-tech text-lg font-bold text-white tracking-widest mt-0.5">
                {currentTrack.title}
              </h3>
              <p className="text-xs text-gray-400 font-sans max-w-sm mt-1 leading-relaxed">
                {currentTrack.description}
              </p>
            </div>

            {/* Audioreactive Equalizer Bars */}
            <div className="flex items-end justify-center gap-1.5 h-16 w-full max-w-md pt-2">
              {[45, 80, 60, 95, 30, 75, 100, 85, 40, 90, 70, 55, 85, 65, 95, 40, 70].map((height, i) => (
                <div
                  key={i}
                  className="w-3 rounded-t-sm transition-all duration-150"
                  style={{
                    height: isPlaying ? `${Math.max(15, Math.min(100, height + Math.sin(i + Date.now()) * 25))}%` : '8%',
                    backgroundColor: i % 2 === 0 ? '#ef4444' : '#f59e0b',
                    boxShadow: isPlaying ? '0 0 8px rgba(239,68,68,0.5)' : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Bottom Player Controls Bar */}
          <div className="w-full bg-gray-900/90 border border-gray-800 rounded-xl p-3 flex items-center justify-between">
            <button
              onClick={togglePlay}
              className="py-2.5 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-tech font-bold text-xs tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'PAUSE PLAYBACK' : 'PLAY SYNTH TRACK'}</span>
            </button>

            <button
              onClick={handleNextTrack}
              className="py-2.5 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-tech font-bold text-xs flex items-center gap-2 cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
              <span>NEXT TRACK</span>
            </button>
          </div>
        </div>

        {/* Right: Tracklist Catalog (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="bg-gray-900/90 border border-red-500/20 rounded-xl p-3.5 flex flex-col gap-2.5">
            <span className="font-tech text-xs font-bold text-red-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-800 pb-2">
              <Music className="w-4 h-4 text-red-400" />
              <span>WORKSHOP SOUNDSTAGE PLAYLIST</span>
            </span>

            {tracks.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => {
                  soundFx.playHudBeep('mode');
                  setCurrentTrackIdx(idx);
                  setIsPlaying(true);
                }}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                  currentTrackIdx === idx
                    ? 'bg-red-950/70 border-red-500 text-white shadow-md'
                    : 'bg-gray-950/60 border-gray-800 text-gray-400 hover:bg-gray-900 hover:text-gray-200'
                }`}
              >
                <div className="mt-1">
                  {currentTrackIdx === idx && isPlaying ? (
                    <Activity className="w-4 h-4 text-red-400 animate-bounce" />
                  ) : (
                    <Disc className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <div>
                  <div className="font-tech text-xs font-bold text-red-200">{t.title}</div>
                  <div className="text-[10px] font-mono-tech text-amber-400 mt-0.5">{t.genre} · {t.bpm} BPM</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
