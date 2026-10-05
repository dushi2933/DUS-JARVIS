import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Sparkles, Volume2, Radio, Terminal, Bot, Zap, ShieldAlert } from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useToast } from '../context/ToastContext';
import { JarvisDialogue, GauntletState } from '../types/gauntlet';

interface JarvisVoiceCoreProps {
  gauntletState: GauntletState;
  onExecuteAction: (action: string, parameter: string | null) => void;
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
}

export const JarvisVoiceCore: React.FC<JarvisVoiceCoreProps> = ({
  gauntletState,
  onExecuteAction,
  isProcessing,
  setIsProcessing,
}) => {
  const { addToast } = useToast();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSpeechEnabled, setVoiceSpeechEnabled] = useState(true);
  const [dialogueHistory, setDialogueHistory] = useState<JarvisDialogue[]>([
    {
      id: 'init-1',
      sender: 'jarvis',
      text: 'Welcome back, Mr. Stark. J.A.R.V.I.S. neural telemetry is fully initialized. Your Iron Man Gauntlet stands primed and synchronized at your command, Sir.',
      tacticalAdvice: 'Arc Reactor capacitors nominal. All satellite, weather, timer, and cross-platform publishing threads active.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat terminal
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dialogueHistory, isProcessing]);

  // Handle Speech Recognition setup
  useEffect(() => {
    jarvisVoice.initRecognition(
      (transcript) => {
        setIsListening(false);
        soundFx.playHudBeep('confirm');
        handleSendCommand(transcript);
      },
      (err) => {
        setIsListening(false);
        console.warn('Speech recognition warning:', err);
      },
      () => {
        setIsListening(false);
      }
    );
  }, []);

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
        // Fallback prompt
        addToast({
          title: 'Speech Recognition Unavailable',
          message: 'Microphone speech recognition is not supported or was blocked. You can type commands in the Stark console below!',
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

    // Add user message
    const userMsg: JarvisDialogue = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setDialogueHistory((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const response = await fetch('/api/jarvis/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          currentStatus: {
            mark: gauntletState.mark,
            repulsorCharge: gauntletState.repulsorCharge,
            armorIntegrity: gauntletState.armorIntegrity,
            activeProtocol: gauntletState.activeProtocol,
            missiles: gauntletState.missileCount,
            temperature: gauntletState.temperatureKelvin,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('J.A.R.V.I.S. neural link timeout');
      }

      const data = await response.json();
      const jarvisText = data.spokenResponse || 'Directive acknowledged, Miss Lyssandra.';

      const jarvisMsg: JarvisDialogue = {
        id: `jarvis-${Date.now()}`,
        sender: 'jarvis',
        text: jarvisText,
        action: data.action,
        tacticalAdvice: data.tacticalAdvice,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setDialogueHistory((prev) => [...prev, jarvisMsg]);

      // Execute gauntlet hardware action if returned by J.A.R.V.I.S.
      if (data.action && data.action !== 'none') {
        onExecuteAction(data.action, data.parameter || null);
      }

      // Speak aloud in British cadence if enabled
      if (voiceSpeechEnabled) {
        setIsSpeaking(true);
        await jarvisVoice.speak(
          jarvisText,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        );
      }
    } catch (err) {
      console.error(err);
      const fallbackMsg: JarvisDialogue = {
        id: `jarvis-err-${Date.now()}`,
        sender: 'jarvis',
        text: 'Auxiliary backup active, Miss Lyssandra. Stark servers are rebooting, but local gauntlet telemetry is intact.',
        tacticalAdvice: 'Local neural buffers managing hardware.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setDialogueHistory((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const quickCommands = [
    'Jarvis, what is the weather today?',
    'Jarvis, set a 5 minute timer',
    'Jarvis, charge repulsors to 100%',
    'Jarvis, fire repulsor blast!',
    'Jarvis, how do I publish to Windows and Mac?',
    'Jarvis, initiate combat protocol',
    'Jarvis, switch to Mark 50 Nanotech',
    'Jarvis, fetch Stark intel news',
  ];

  return (
    <div className="bg-gray-900/60 border border-cyan-500/20 rounded-xl p-4 flex flex-col h-full backdrop-blur-sm relative overflow-hidden">
      {/* Background Holographic Scanlines */}
      <div className="absolute inset-0 holo-scanlines opacity-40 pointer-events-none" />

      {/* Top Bar: J.A.R.V.I.S. Core Header & Voice Wave */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-3 relative z-10">
        <div className="flex items-center gap-3">
          {/* Hologram Arc Core Visualizer */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            {/* Outer Rotating Ring */}
            <div
              className={`absolute inset-0 rounded-full border border-dashed border-cyan-400/50 ${
                isSpeaking || isListening ? 'animate-spin' : 'animate-spin-slow'
              }`}
            />
            {/* Middle Rotating Ring */}
            <div
              className={`absolute inset-1 rounded-full border border-amber-400/40 ${
                isSpeaking ? 'animate-spin-reverse-slow' : ''
              }`}
            />
            {/* Center Pulsing Arc Core */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                isSpeaking
                  ? 'bg-cyan-300 glow-arc-blue scale-110'
                  : isListening
                  ? 'bg-amber-300 glow-arc-gold scale-110'
                  : isProcessing
                  ? 'bg-purple-400 animate-ping'
                  : 'bg-cyan-500/40 border border-cyan-300'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-gray-950 font-bold" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-tech font-bold text-sm tracking-wider text-cyan-300">
                J.A.R.V.I.S. ARTIFICIAL INTELLIGENCE
              </span>
              <span className="text-gray-500 text-xs">·</span>
              <span className="text-[11px] font-mono-tech text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>
            <p className="text-xs text-gray-400">
              {isSpeaking
                ? 'Speaking response to Miss Lyssandra...'
                : isListening
                ? 'Listening to your voice command...'
                : isProcessing
                ? 'Processing Stark neural algorithms...'
                : 'Awaiting directive from Miss Lyssandra'}
            </p>
          </div>
        </div>

        {/* Voice Speech Aloud Toggle */}
        <button
          onClick={() => {
            soundFx.playHudBeep('subtle');
            setVoiceSpeechEnabled(!voiceSpeechEnabled);
            if (voiceSpeechEnabled) jarvisVoice.cancelSpeech();
          }}
          title={voiceSpeechEnabled ? 'Mute J.A.R.V.I.S. Voice' : 'Enable J.A.R.V.I.S. Voice'}
          className={`px-2.5 py-1 rounded text-xs font-mono-tech flex items-center gap-1.5 border transition-all ${
            voiceSpeechEnabled
              ? 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300'
              : 'border-gray-800 bg-gray-900 text-gray-500'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {voiceSpeechEnabled ? 'VOICE ON' : 'VOICE MUTED'}
          </span>
        </button>
      </div>

      {/* Center: Dialogue Log Terminal */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 min-h-[220px] max-h-[340px] text-xs font-mono-tech relative z-10">
        {dialogueHistory.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg border transition-all ${
              msg.sender === 'user'
                ? 'bg-cyan-950/20 border-cyan-500/30 ml-6 text-cyan-100'
                : 'bg-gray-950/70 border-gray-800 mr-6 text-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1 text-[10px] text-gray-400">
              <span className="font-bold flex items-center gap-1">
                {msg.sender === 'user' ? (
                  <>
                    <span className="text-cyan-400">TONY STARK</span>
                    <span className="text-gray-500">[CREATOR]</span>
                  </>
                ) : (
                  <>
                    <span className="text-amber-400">J.A.R.V.I.S.</span>
                    <span className="text-gray-500">[STARK AI]</span>
                  </>
                )}
              </span>
              <span>{msg.timestamp}</span>
            </div>

            <p className="text-xs leading-relaxed text-slate-100 font-sans">
              {msg.text}
            </p>

            {msg.tacticalAdvice && (
              <div className="mt-2 pt-2 border-t border-gray-800/80 flex items-start gap-1.5 text-[11px] text-cyan-300/80">
                <Terminal className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                <span>{msg.tacticalAdvice}</span>
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="p-3 rounded-lg border border-cyan-500/20 bg-gray-950/50 mr-6 flex items-center gap-2 text-cyan-400 text-xs animate-pulse">
            <Radio className="w-4 h-4 animate-spin" />
            <span>J.A.R.V.I.S. calculating trajectory & protocols...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Voice Command Preset Suggestions */}
      <div className="my-2 relative z-10">
        <div className="text-[10px] uppercase font-tech text-gray-400 mb-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Quick Tactical Commands:</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {quickCommands.map((cmd, i) => (
            <button
              key={i}
              onClick={() => handleSendCommand(cmd)}
              disabled={isProcessing}
              className="px-2.5 py-1 rounded bg-gray-800/60 hover:bg-cyan-950/60 hover:border-cyan-400/50 border border-gray-700/60 text-gray-300 hover:text-cyan-200 text-[11px] whitespace-nowrap transition-all cursor-pointer font-sans"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Command Bar: Mic Button + Text Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendCommand(inputText);
        }}
        className="flex items-center gap-2 mt-auto relative z-10 pt-2 border-t border-gray-800"
      >
        {/* Push to Talk / Voice Command Mic Button */}
        <button
          type="button"
          onClick={toggleListen}
          title={isListening ? 'Stop Listening' : 'Speak to J.A.R.V.I.S.'}
          className={`p-2.5 rounded-lg border transition-all flex items-center justify-center shrink-0 cursor-pointer ${
            isListening
              ? 'bg-red-500 text-white border-red-400 animate-pulse glow-arc-red'
              : 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-300'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Command Input Box */}
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? 'Listening to speech...' : 'Issue directive to J.A.R.V.I.S...'}
            disabled={isProcessing}
            className="w-full bg-gray-950/80 border border-cyan-500/30 rounded-lg px-3 py-2 text-xs text-cyan-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono-tech"
          />
          <span className="absolute right-2 top-2 text-[10px] text-gray-600 font-mono-tech">
            PRESS ↵
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!inputText.trim() || isProcessing}
          className="p-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-gray-950 font-bold transition-all shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
