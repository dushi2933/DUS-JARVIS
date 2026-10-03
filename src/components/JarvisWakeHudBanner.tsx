import React from 'react';
import { Mic, MicOff, Sparkles, Radio, Volume2, Shield } from 'lucide-react';
import { WakeWordStatus } from '../utils/wakeWord';

interface JarvisWakeHudBannerProps {
  status: WakeWordStatus;
  isEnabled: boolean;
  interimTranscript: string;
  onToggleWakeWord: () => void;
}

export const JarvisWakeHudBanner: React.FC<JarvisWakeHudBannerProps> = ({
  status,
  isEnabled,
  interimTranscript,
  onToggleWakeWord,
}) => {
  const isTriggered = status === 'WAKE_WORD_TRIGGERED' || status === 'CAPTURING_COMMAND';
  const isProcessing = status === 'PROCESSING';

  return (
    <div
      className={`relative overflow-hidden rounded-xl border transition-all p-3 backdrop-blur-md shadow-xl ${
        isTriggered
          ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 glow-arc-blue scale-[1.01]'
          : isProcessing
          ? 'bg-amber-950/80 border-amber-400 text-amber-200 glow-arc-gold'
          : isEnabled
          ? 'bg-gray-950/80 border-cyan-500/30 text-gray-300'
          : 'bg-gray-950/60 border-gray-800 text-gray-500'
      }`}
    >
      <div className="absolute inset-0 holo-grid opacity-15 pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 relative z-10">
        {/* Left Side: Status & Wake Prompt */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
              isTriggered
                ? 'bg-cyan-500 text-gray-950 border-white shadow-[0_0_15px_rgba(6,182,212,0.8)] animate-pulse'
                : isProcessing
                ? 'bg-amber-500 text-gray-950 border-amber-300 animate-spin'
                : isEnabled
                ? 'bg-cyan-950/60 text-cyan-400 border-cyan-500/40'
                : 'bg-gray-900 text-gray-600 border-gray-800'
            }`}
          >
            {isEnabled ? (
              <Mic className={`w-4 h-4 ${isTriggered ? 'animate-bounce' : ''}`} />
            ) : (
              <MicOff className="w-4 h-4" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-tech text-xs font-bold tracking-wider uppercase text-cyan-200">
                {isTriggered
                  ? '⚡ J.A.R.V.I.S. LISTENING'
                  : isProcessing
                  ? '⚡ PROCESSING DIRECTIVE'
                  : isEnabled
                  ? 'HOTWORD RADAR: ACTIVE'
                  : 'WAKE WORD: STANDBY'}
              </span>

              <span
                className={`text-[9px] font-mono-tech px-2 py-0.5 rounded border uppercase font-bold ${
                  isTriggered
                    ? 'bg-cyan-500 text-gray-950 border-white font-extrabold animate-pulse'
                    : isEnabled
                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                    : 'bg-gray-900 text-gray-500 border-gray-800'
                }`}
              >
                {isTriggered ? 'HOTWORD ENGAGED' : isEnabled ? 'SAY "JARVIS"' : 'OFFLINE'}
              </span>
            </div>

            <p className="text-[11px] font-sans text-gray-300">
              {isTriggered ? (
                <span className="text-cyan-300 font-semibold font-mono-tech">
                  "{interimTranscript || 'Listening for Mr. Stark\'s command...'}"
                </span>
              ) : isProcessing ? (
                <span className="text-amber-300 font-mono-tech animate-pulse">
                  Executing tactical directive with Stark neural core...
                </span>
              ) : isEnabled ? (
                <span>
                  Ambient listening enabled. Just say <strong className="text-cyan-300">"Jarvis"</strong> or <strong className="text-cyan-300">"Jarvis, charge repulsors"</strong> anytime!
                </span>
              ) : (
                <span>
                  Click <strong className="text-gray-300">"ENABLE WAKE WORD"</strong> to speak to J.A.R.V.I.S. hands-free like in the movies.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right Side: Waveform Animation & Toggle Button */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          {/* Animated Audio Equalizer Bars when listening */}
          {isEnabled && (
            <div className="flex items-end gap-1 h-5 px-2 py-1 bg-black/40 rounded border border-gray-800">
              {[8, 14, 20, 12, 18, 10, 16].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isTriggered
                      ? 'bg-cyan-300 animate-pulse'
                      : 'bg-cyan-600/70'
                  }`}
                  style={{
                    height: isTriggered ? `${Math.min(20, h * 1.2)}px` : `${Math.max(4, h * 0.4)}px`,
                  }}
                />
              ))}
            </div>
          )}

          <button
            onClick={onToggleWakeWord}
            className={`px-3 py-1.5 rounded-lg text-xs font-tech font-bold tracking-wider cursor-pointer transition-all flex items-center gap-1.5 ${
              isEnabled
                ? 'bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-400 text-cyan-200 glow-arc-blue'
                : 'bg-cyan-600 hover:bg-cyan-500 text-gray-950 font-extrabold glow-arc-blue'
            }`}
          >
            {isEnabled ? (
              <>
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>HOTWORD: ON</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5" />
                <span>ACTIVATE "JARVIS" MIC</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
