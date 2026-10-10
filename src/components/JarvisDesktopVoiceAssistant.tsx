import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  Search, 
  Music, 
  Globe, 
  Play, 
  Pause, 
  ExternalLink, 
  Code, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  Sparkles, 
  Clock, 
  Calendar, 
  Sun, 
  Bot, 
  Volume2, 
  Youtube, 
  BookOpen, 
  Cpu, 
  FolderGit2, 
  Radio, 
  FileText,
  Sliders,
  RotateCw,
  X,
  Zap,
  Flame,
  Activity,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useToast } from '../context/ToastContext';

interface WikipediaResult {
  title: string;
  extract: string;
  description?: string;
  thumbnail?: { source: string };
  content_urls?: { desktop: { page: string } };
}

export interface JarvisDesktopVoiceAssistantProps {
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onSwitchToMode1?: () => void;
}

export const JarvisDesktopVoiceAssistant: React.FC<JarvisDesktopVoiceAssistantProps> = ({
  isFullscreen = false,
  onToggleFullscreen,
  onSwitchToMode1,
}) => {
  const { addToast } = useToast();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isRotatingCore, setIsRotatingCore] = useState(true);
  const [latestSpeech, setLatestSpeech] = useState<string>(
    'Jarvis Desktop Voice Assistant online, Mr. Stark. Ready for voice directives, Wikipedia queries, and system dispatch.'
  );

  // Keyboard shortcut listener for Fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen && onToggleFullscreen) {
        onToggleFullscreen();
      }
      if (
        (e.key === 'f' || e.key === 'F') &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        if (onToggleFullscreen) {
          onToggleFullscreen();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, onToggleFullscreen]);
  
  // Wikipedia Search State
  const [wikiLoading, setWikiLoading] = useState(false);
  const [wikiResult, setWikiResult] = useState<WikipediaResult | null>(null);
  const [showWikiOverlay, setShowWikiOverlay] = useState(false);

  // Music Player State
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string>('AC/DC - Back in Black');
  const [showMusicOverlay, setShowMusicOverlay] = useState(false);

  // App Launcher & Python Script Modals
  const [showLauncherOverlay, setShowLauncherOverlay] = useState(false);
  const [showPythonModal, setShowPythonModal] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Armor Telemetry Hover State
  const [hoveredArmorSector, setHoveredArmorSector] = useState<string | null>(null);
  const [corePulse, setCorePulse] = useState(false);

  // Voice Command History
  const [recentDirectives, setRecentDirectives] = useState<string[]>([
    'Search Wikipedia for Tony Stark',
    'Play music',
    'What time is it?',
    'Open YouTube'
  ]);

  // Real Wikipedia API Search
  const searchWikipedia = async (query: string) => {
    setWikiLoading(true);
    setShowWikiOverlay(true);
    soundFx.playHudBeep('mode');
    setCorePulse(true);
    setTimeout(() => setCorePulse(false), 2000);

    try {
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query.trim())}`);
      if (!response.ok) {
        throw new Error('Wikipedia article not found');
      }
      const data: WikipediaResult = await response.json();
      setWikiResult(data);
      
      const speechSummary = `According to Wikipedia: ${data.extract.slice(0, 240)}...`;
      setLatestSpeech(speechSummary);
      jarvisVoice.speak(speechSummary);
      soundFx.playArcReactorPulse();

      addToast({
        title: 'Wikipedia Result Found',
        message: `Loaded summary for "${data.title}"`,
        type: 'protocol',
      });
    } catch {
      // Fallback search with search endpoint
      try {
        const searchResp = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&namespace=0&format=json&origin=*`);
        const searchData = await searchResp.json();
        if (searchData && searchData[1] && searchData[1].length > 0) {
          const firstTitle = searchData[1][0];
          const secondResp = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(firstTitle)}`);
          const data2: WikipediaResult = await secondResp.json();
          setWikiResult(data2);
          const speechSummary = `According to Wikipedia: ${data2.extract.slice(0, 240)}...`;
          setLatestSpeech(speechSummary);
          jarvisVoice.speak(speechSummary);
        } else {
          throw new Error('Not found');
        }
      } catch {
        const errorMsg = `I apologize, Sir. I could not find a Wikipedia page for "${query}".`;
        setLatestSpeech(errorMsg);
        jarvisVoice.speak(errorMsg);
      }
    } finally {
      setWikiLoading(false);
    }
  };

  // Process voice/text directive
  const handleCommand = (cmdText: string) => {
    const cleanCmd = cmdText.trim();
    if (!cleanCmd) return;
    setInputText('');

    setRecentDirectives(prev => [cleanCmd, ...prev.filter(c => c !== cleanCmd)].slice(0, 5));
    const lower = cleanCmd.toLowerCase();

    // 1. Wikipedia search command
    if (lower.startsWith('search wikipedia for ') || lower.startsWith('wikipedia ') || lower.includes('who is ') || lower.includes('what is ')) {
      let query = cleanCmd;
      if (lower.startsWith('search wikipedia for ')) query = cleanCmd.replace(/search wikipedia for /i, '');
      else if (lower.startsWith('wikipedia ')) query = cleanCmd.replace(/wikipedia /i, '');
      else if (lower.startsWith('who is ')) query = cleanCmd.replace(/who is /i, '');
      else if (lower.startsWith('what is ')) query = cleanCmd.replace(/what is /i, '');
      searchWikipedia(query);
      return;
    }

    // 2. Play music command
    if (lower.includes('play music') || lower.includes('play song') || lower.includes('music')) {
      setIsPlayingMusic(true);
      setShowMusicOverlay(true);
      soundFx.playArcReactorPulse();
      const reply = `Playing ${currentTrack} on the laboratory high-fidelity soundstage, Sir.`;
      setLatestSpeech(reply);
      jarvisVoice.speak(reply);
      return;
    }

    // 3. Open Browser commands
    if (lower.includes('open youtube') || lower.includes('youtube')) {
      window.open('https://www.youtube.com', '_blank');
      const reply = 'Opening YouTube in desktop window, Sir.';
      setLatestSpeech(reply);
      jarvisVoice.speak(reply);
      return;
    }

    if (lower.includes('open google') || lower.includes('google')) {
      window.open('https://www.google.com', '_blank');
      const reply = 'Opening Google search engine, Sir.';
      setLatestSpeech(reply);
      jarvisVoice.speak(reply);
      return;
    }

    if (lower.includes('open github') || lower.includes('github')) {
      window.open('https://github.com/dushi2933/DUS-JARVIS', '_blank');
      const reply = 'Opening your GitHub repository DUS-JARVIS, Sir.';
      setLatestSpeech(reply);
      jarvisVoice.speak(reply);
      return;
    }

    if (lower.includes('open stackoverflow') || lower.includes('stack overflow')) {
      window.open('https://stackoverflow.com', '_blank');
      const reply = 'Opening StackOverflow developer knowledge base, Sir.';
      setLatestSpeech(reply);
      jarvisVoice.speak(reply);
      return;
    }

    // 4. Time command
    if (lower.includes('time') || lower.includes('what time')) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const reply = `The current system time is ${now}, Sir.`;
      setLatestSpeech(reply);
      jarvisVoice.speak(reply);
      return;
    }

    // 5. Date command
    if (lower.includes('date') || lower.includes('today')) {
      const today = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const reply = `Today is ${today}, Sir.`;
      setLatestSpeech(reply);
      jarvisVoice.speak(reply);
      return;
    }

    // Default conversational reply
    const defaultReplies = [
      `Directive acknowledged: "${cleanCmd}". Processing neural voice task, Mr. Stark.`,
      `Telemetry synchronized, Sir. All quantum systems functional.`,
      `Voice task logged in central registers, Sir. Anything else?`,
    ];
    const picked = defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
    setLatestSpeech(picked);
    jarvisVoice.speak(picked);
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
        addToast({
          title: 'Jarvis Voice Recognition Active',
          message: 'Speak now (e.g. "Search Wikipedia for Iron Man" or "Play music").',
          type: 'status',
        });
      }
    }
  };

  // Python Script Code for VS Code
  const pythonScriptCode = `"""
================================================================================
          JARVIS DESKTOP VOICE ASSISTANT - PYTHON VS CODE EDITION
================================================================================
Created for: Lisara Kodikara (jdushi@gmail.com) / Tony Stark
Repository: https://github.com/dushi2933/DUS-JARVIS
Compilation Environment: Visual Studio Code Editor (Python 3.10+)
Required Packages:
    pip install pyttsx3 speechrecognition wikipedia pyaudio
================================================================================
"""

import pyttsx3
import speech_recognition as sr
import datetime
import wikipedia
import webbrowser
import os
import sys

engine = pyttsx3.init('sapi5')
voices = engine.getProperty('voices')
engine.setProperty('voice', voices[0].id)
engine.setProperty('rate', 190)

def speak(audio):
    print(f"J.A.R.V.I.S.: {audio}")
    engine.say(audio)
    engine.runAndWait()

def wishMe():
    hour = int(datetime.datetime.now().hour)
    if hour >= 0 and hour < 12:
        speak("Good Morning, Mr. Stark!")
    elif hour >= 12 and hour < 18:
        speak("Good Afternoon, Sir!")
    else:
        speak("Good Evening, Sir!")
    speak("Jarvis Desktop Voice Assistant online. How may I assist you?")

def takeCommand():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("\\n[LISTENING...] Speak into your microphone...")
        r.pause_threshold = 1.0
        r.adjust_for_ambient_noise(source)
        audio = r.listen(source)

    try:
        print("[RECOGNIZING...] Processing neural voice patterns...")
        query = r.recognize_google(audio, language='en-in')
        print(f"User Directive: {query}\\n")
    except Exception as e:
        print("Say that again please, Sir...")
        return "None"
    return query

if __name__ == "__main__":
    wishMe()
    while True:
        query = takeCommand().lower()

        if 'wikipedia' in query:
            speak('Searching Wikipedia database, Sir...')
            query = query.replace("wikipedia", "").strip()
            try:
                results = wikipedia.summary(query, sentences=3)
                speak("According to Wikipedia:")
                print(results)
                speak(results)
            except Exception as e:
                speak("I apologize, Sir. No matching Wikipedia record was found.")

        elif 'open youtube' in query:
            speak("Opening YouTube, Sir.")
            webbrowser.open("https://www.youtube.com")

        elif 'open google' in query:
            speak("Opening Google search engine, Sir.")
            webbrowser.open("https://www.google.com")

        elif 'open github' in query:
            speak("Opening your DUS-JARVIS GitHub repository, Sir.")
            webbrowser.open("https://github.com/dushi2933/DUS-JARVIS")

        elif 'the time' in query:
            strTime = datetime.datetime.now().strftime("%H:%M:%S")
            speak(f"Sir, the current time is {strTime}")

        elif 'play music' in query:
            speak("Playing music on soundstage, Sir.")
            webbrowser.open("https://www.youtube.com/results?search_query=ac+dc+back+in+black")

        elif 'quit' in query or 'exit' in query:
            speak("Powering down Jarvis. Have a splendid day, Mr. Stark.")
            sys.exit()
`;

  const copyPythonCode = () => {
    soundFx.playHudBeep('confirm');
    navigator.clipboard.writeText(pythonScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
    addToast({
      title: 'Python Script Copied',
      message: 'jarvis_desktop_assistant.py copied for VS Code!',
      type: 'protocol',
    });
  };

  const downloadPythonScript = () => {
    soundFx.playArcReactorPulse();
    const blob = new Blob([pythonScriptCode], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jarvis_desktop_assistant.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast({
      title: 'Python Script Downloaded',
      message: 'jarvis_desktop_assistant.py downloaded for VS Code Editor!',
      type: 'status',
    });
  };

  return (
    <div className={`relative w-full ${isFullscreen ? 'h-full flex flex-col justify-between rounded-none border-0' : 'rounded-2xl border border-cyan-500/40 min-h-[580px]'} bg-[#020508] overflow-hidden select-none font-mono text-cyan-200 shadow-[0_0_45px_rgba(0,240,255,0.22)]`}>
      
      {/* 1. Deep Technical Blueprint Grid Background (Matching User Image) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-45"
        style={{
          backgroundColor: '#020407',
          backgroundImage: `
            linear-gradient(to right, rgba(0, 240, 255, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 240, 255, 0.12) 1px, transparent 1px),
            linear-gradient(to right, rgba(0, 240, 255, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 240, 255, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px, 80px 80px, 16px 16px, 16px 16px'
        }}
      />

      {/* Blueprint Vignette & CRT Scanlines */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_50%,rgba(1,3,6,0.88)_100%)]" />
      <div className="absolute inset-0 pointer-events-none holo-scanlines opacity-25" />

      {/* Top Technical Blueprint Header */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 p-3.5 lg:p-4 border-b border-cyan-500/30 bg-[#030812]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {/* STARK INDUSTRIES Italic Logo (from user image) */}
          <div className="flex items-center gap-2">
            <span className="font-tech text-base sm:text-lg font-black tracking-widest text-cyan-400 italic">
              STARK INDUSTRIES
            </span>
            <span className="text-cyan-500/60 font-mono text-sm tracking-tighter">
              //
            </span>
          </div>

          <span className="text-[11px] font-mono text-cyan-300 font-bold border-l border-cyan-500/30 pl-3 hidden sm:inline">
            JARVIS DESKTOP VOICE ASSISTANT · BLUEPRINT HUD MATRIX
          </span>
        </div>

        {/* Tactical Voice Directives & VS Code Button */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Full Screen Mode Toggle */}
          {onToggleFullscreen && (
            <button
              onClick={() => {
                soundFx.playHudBeep('subtle');
                onToggleFullscreen();
              }}
              className={`px-3 py-1.5 rounded-lg border font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow transition-all ${
                isFullscreen
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-400 hover:bg-emerald-900 shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400'
                  : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-500/50'
              }`}
              title={isFullscreen ? 'Exit Full Screen Mode (ESC)' : 'Expand to Full Screen Mode'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-emerald-400" /> : <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isFullscreen ? 'EXIT FULL SCREEN' : 'FULL SCREEN'}</span>
            </button>
          )}

          {/* Switch to Mode 1 (Blueprint) */}
          {onSwitchToMode1 && (
            <button
              onClick={() => {
                soundFx.playHudBeep('mode');
                onSwitchToMode1();
              }}
              className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow transition-all"
              title="Switch to Mode 1: Blueprint Schematic HUD"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">MODE 1 (BLUEPRINT)</span>
            </button>
          )}

          <button
            onClick={() => setShowPythonModal(true)}
            className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-cyan-300 border border-cyan-500/40 font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow transition-all"
          >
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">VS CODE PYTHON (.PY)</span>
            <span className="sm:hidden">PYTHON</span>
          </button>

          <button
            onClick={() => setShowLauncherOverlay(!showLauncherOverlay)}
            className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/50 font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>LAUNCHERS</span>
          </button>

          <button
            onClick={() => setShowMusicOverlay(!showMusicOverlay)}
            className="px-3 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/50 font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Music className="w-3.5 h-3.5 text-amber-400" />
            <span>MUSIC</span>
          </button>
        </div>
      </div>

      {/* Main Blueprint Canvas: Matches the user's reference image */}
      <div className={`relative z-10 grid grid-cols-1 lg:grid-cols-12 ${
        isFullscreen
          ? 'flex-1 min-h-0 overflow-y-auto lg:overflow-hidden p-3 lg:p-6 gap-4 lg:gap-6'
          : 'min-h-[580px] p-4 lg:p-6 gap-6'
      } items-center`}>
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Mechanical Stator Diagram + ROTATING J.A.R.V.I.S. VOICE CORE */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 flex flex-col justify-between h-full space-y-6">
          
          {/* 1. Stator Mechanical Drawing (120 deg angle callout) */}
          <div className="relative p-4 rounded-xl border border-cyan-500/30 bg-[#020710]/75 backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono border-b border-cyan-500/20 pb-2">
              <span className="text-cyan-400 font-bold tracking-wider">MECHANICAL STATOR DIAGRAM</span>
              <span className="text-gray-400">DWG. #85-AR-01</span>
            </div>

            {/* Circular Mechanical Stator Drawing */}
            <div className="relative flex items-center justify-center py-2">
              <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-[0_0_8px_rgba(0,240,255,0.3)]">
                <line x1="100" y1="10" x2="100" y2="190" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
                <line x1="10" y1="100" x2="190" y2="100" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />

                <circle cx="100" cy="100" r="85" fill="none" stroke="#00f0ff" strokeWidth="0.8" opacity="0.5" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="#00f0ff" strokeWidth="1" strokeDasharray="6 4" opacity="0.6" />
                
                <path d="M 100 15 A 85 85 0 0 1 173 57" fill="none" stroke="#00f0ff" strokeWidth="1" />
                <text x="145" y="45" fill="#00f0ff" fontSize="9" fontFamily="monospace" fontWeight="bold">120°</text>
                
                {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg, i) => {
                  const rad = (deg * Math.PI) / 180;
                  const x1 = 100 + 45 * Math.cos(rad);
                  const y1 = 100 + 45 * Math.sin(rad);
                  const x2 = 100 + 68 * Math.cos(rad);
                  const y2 = 100 + 68 * Math.sin(rad);
                  return (
                    <g key={i}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00f0ff" strokeWidth="2.5" opacity="0.85" />
                      <circle cx={x2} cy={y2} r="2" fill="#ef4444" opacity="0.7" />
                    </g>
                  );
                })}

                <circle cx="100" cy="100" r="32" fill="none" stroke="#00f0ff" strokeWidth="1.2" opacity="0.9" />
                <circle cx="100" cy="100" r="16" fill="none" stroke="#ef4444" strokeWidth="1.2" opacity="0.8" />
                <circle cx="100" cy="100" r="6" fill="#00f0ff" />

                <line x1="100" y1="100" x2="35" y2="40" stroke="#00f0ff" strokeWidth="0.8" opacity="0.7" />
                <line x1="35" y1="40" x2="15" y2="40" stroke="#00f0ff" strokeWidth="0.8" opacity="0.7" />
                <text x="18" y="36" fill="#00f0ff" fontSize="8" fontFamily="monospace">Ø 88.4mm</text>
              </svg>
            </div>

            <div className="text-[10px] text-gray-400 font-mono space-y-1">
              <div className="flex justify-between">
                <span>STATOR FLUX:</span>
                <span className="text-cyan-300">10-POLE COLD FLUX</span>
              </div>
              <div className="flex justify-between">
                <span>VOICE THREAD:</span>
                <span className="text-emerald-400">pyttsx3 // SAPI5 ENG</span>
              </div>
            </div>
          </div>

          {/* 2. ROTATING J.A.R.V.I.S. VOICE CORE (Interactive Voice Listener from image) */}
          <div 
            onClick={toggleListen}
            className={`p-4 rounded-xl border relative cursor-pointer shadow-[0_0_25px_rgba(0,240,255,0.3)] transition-all group ${
              isListening
                ? 'bg-red-950/40 border-red-500 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.6)]'
                : 'bg-gradient-to-br from-gray-950 via-[#030914] to-cyan-950/40 border-cyan-500/40 hover:border-cyan-400'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] mb-2">
              <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                <Mic className={`w-3.5 h-3.5 ${isListening ? 'text-red-400 animate-bounce' : 'text-cyan-400'}`} />
                <span>J.A.R.V.I.S. VOICE CORE</span>
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                isListening
                  ? 'bg-red-950 text-red-300 border-red-500'
                  : 'bg-cyan-950 text-cyan-300 border-cyan-500/30'
              }`}>
                {isListening ? 'RECORDING VOICE...' : 'CLICK TO SPEAK'}
              </span>
            </div>

            {/* Concentric Rotating J.A.R.V.I.S. Circular Core Emblem (Identical to image) */}
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
              <svg 
                viewBox="0 0 200 200" 
                className={`w-full h-full drop-shadow-[0_0_12px_rgba(0,240,255,0.5)] ${isRotatingCore ? 'animate-spin-slow' : ''}`}
              >
                <circle cx="100" cy="100" r="92" fill="none" stroke={isListening ? "#ef4444" : "#00f0ff"} strokeWidth="1" opacity="0.6" />
                
                {Array.from({ length: 32 }).map((_, i) => {
                  const deg = (i * 360) / 32;
                  const rad = (deg * Math.PI) / 180;
                  const x1 = 100 + 82 * Math.cos(rad);
                  const y1 = 100 + 82 * Math.sin(rad);
                  const x2 = 100 + 91 * Math.cos(rad);
                  const y2 = 100 + 91 * Math.sin(rad);
                  return (
                    <line 
                      key={i} 
                      x1={x1} 
                      y1={y1} 
                      x2={x2} 
                      y2={y2} 
                      stroke={isListening ? "#ef4444" : "#00f0ff"} 
                      strokeWidth={i % 4 === 0 ? "2.5" : "1"} 
                      opacity={i % 4 === 0 ? "0.9" : "0.5"} 
                    />
                  );
                })}

                <circle 
                  cx="100" 
                  cy="100" 
                  r="74" 
                  fill="none" 
                  stroke={isListening ? "#ef4444" : "#00f0ff"} 
                  strokeWidth="2.5" 
                  strokeDasharray="18 10 6 10" 
                  opacity="0.8" 
                />

                <path 
                  d="M 100 28 A 72 72 0 0 1 172 100" 
                  fill="none" 
                  stroke={isListening ? "#ef4444" : "#00f0ff"} 
                  strokeWidth="4" 
                  opacity="0.75" 
                />
                <path 
                  d="M 100 172 A 72 72 0 0 1 28 100" 
                  fill="none" 
                  stroke={isListening ? "#ef4444" : "#00f0ff"} 
                  strokeWidth="4" 
                  opacity="0.75" 
                />

                <circle cx="100" cy="100" r="58" fill="#040812" stroke={isListening ? "#ef4444" : "#00f0ff"} strokeWidth="1.5" opacity="0.9" />
              </svg>

              {/* Centered J.A.R.V.I.S. Text with Glowing Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <div className={`w-16 h-16 rounded-full border flex flex-col items-center justify-center shadow-[inset_0_0_15px_rgba(0,240,255,0.4)] ${
                  isListening
                    ? 'border-red-500 bg-red-950/80 shadow-[inset_0_0_20px_rgba(239,68,68,0.7)]'
                    : 'border-cyan-400/50 bg-cyan-950/60'
                }`}>
                  <span className="font-tech text-xs sm:text-sm font-black tracking-widest text-cyan-200 text-glow-cyan">
                    J.A.R.V.I.S.
                  </span>
                  <div className={`w-6 h-0.5 mt-0.5 rounded-full ${isListening ? 'bg-red-400 animate-pulse' : 'bg-cyan-400'}`} />
                </div>
              </div>
            </div>

            <p className="text-[10px] text-cyan-300 font-mono text-center mt-1">
              {isListening ? 'LISTENING... SPEAK YOUR DIRECTIVE' : 'CLICK EMBLEM TO SPEAK'}
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTER COLUMN: FULL IRON MAN WIREFRAME SCHEMATIC + WIKIPEDIA HUD PROJECTION */}
        {/* ========================================================================= */}
        <div className={`lg:col-span-6 flex flex-col items-center justify-center relative ${isFullscreen ? 'h-full justify-center' : 'min-h-[520px]'}`}>
          
          {/* Wikipedia Holographic Overlay Box (when active) */}
          {showWikiOverlay && wikiResult && (
            <div className="absolute inset-x-2 top-2 z-30 p-4 bg-gray-950/95 border-2 border-cyan-400 rounded-xl shadow-[0_0_35px_rgba(0,240,255,0.5)] backdrop-blur-md animate-fade-in">
              <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2 mb-2">
                <div className="flex items-center gap-2 text-cyan-300 font-tech font-bold text-sm">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>WIKIPEDIA HOLOGRAPHIC PROJECTION // {wikiResult.title}</span>
                </div>
                <button
                  onClick={() => setShowWikiOverlay(false)}
                  className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 text-xs font-mono">
                {wikiResult.thumbnail && (
                  <img
                    src={wikiResult.thumbnail.source}
                    alt={wikiResult.title}
                    className="w-24 h-24 rounded-lg object-cover float-right ml-3 border border-cyan-500/40 shadow"
                  />
                )}
                <p className="text-gray-200 leading-relaxed font-sans">
                  {wikiResult.extract}
                </p>
              </div>

              {wikiResult.content_urls && (
                <div className="mt-3 pt-2 border-t border-gray-800 flex justify-between items-center text-xs">
                  <span className="text-[10px] text-gray-400 font-mono">Real In-App Wikipedia Search Completed</span>
                  <a
                    href={wikiResult.content_urls.desktop.page}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 font-bold underline flex items-center gap-1"
                  >
                    <span>Read Full Article on Wikipedia</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Central Iron Man Wireframe Blueprint SVG (Identical to reference image) */}
          <div className={`relative w-full ${isFullscreen ? 'max-w-[460px] max-h-[52vh]' : 'max-w-[440px]'} aspect-[4/5] flex items-center justify-center`}>
            <svg 
              viewBox="0 0 400 520" 
              className="w-full h-full drop-shadow-[0_0_22px_rgba(0,240,255,0.45)] cursor-pointer"
            >
              <defs>
                <radialGradient id="arcCoreGlowAssistant" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="30%" stopColor="#38bdf8" />
                  <stop offset="70%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>

              {/* Helmet with Visor Optic */}
              <g 
                onClick={() => handleCommand('What time is it?')}
                onMouseEnter={() => setHoveredArmorSector('HELMET & COGNITIVE HUD (CLICK FOR TIME)')}
                onMouseLeave={() => setHoveredArmorSector(null)}
              >
                <path 
                  d="M 180 40 C 180 32, 220 32, 220 40 C 230 46, 234 65, 230 85 C 226 95, 218 102, 200 105 C 182 102, 174 95, 170 85 C 166 65, 170 46, 180 40 Z" 
                  fill="rgba(2, 6, 14, 0.7)" 
                  stroke="#00f0ff" 
                  strokeWidth="2" 
                />
                <path 
                  d="M 182 52 L 218 52 L 222 75 L 210 95 L 190 95 L 178 75 Z" 
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="1.2" 
                />
                <line x1="183" y1="68" x2="195" y2="70" stroke="#00f0ff" strokeWidth="2.5" className="glow-blueprint-cyan" />
                <line x1="217" y1="68" x2="205" y2="70" stroke="#00f0ff" strokeWidth="2.5" className="glow-blueprint-cyan" />
                <line x1="195" y1="95" x2="205" y2="95" stroke="#10b981" strokeWidth="1.5" />
              </g>

              {/* Neck & Collar */}
              <path d="M 185 105 L 175 120 L 225 120 L 215 105 Z" fill="none" stroke="#00f0ff" strokeWidth="1.2" />

              {/* Shoulders */}
              <g onMouseEnter={() => setHoveredArmorSector('PORT SHOULDER')} onMouseLeave={() => setHoveredArmorSector(null)}>
                <path d="M 172 120 L 140 130 C 132 142, 134 162, 145 175 L 165 160 Z" fill="rgba(3, 7, 18, 0.6)" stroke="#00f0ff" strokeWidth="1.8" />
                <path d="M 145 135 L 138 152 L 155 162" fill="none" stroke="#ef4444" strokeWidth="1" />
                <circle cx="152" cy="148" r="4" fill="none" stroke="#10b981" strokeWidth="1" />
              </g>

              <g onMouseEnter={() => setHoveredArmorSector('STARBOARD SHOULDER')} onMouseLeave={() => setHoveredArmorSector(null)}>
                <path d="M 228 120 L 260 130 C 268 142, 266 162, 255 175 L 235 160 Z" fill="rgba(3, 7, 18, 0.6)" stroke="#00f0ff" strokeWidth="1.8" />
                <path d="M 255 135 L 262 152 L 245 162" fill="none" stroke="#ef4444" strokeWidth="1" />
                <circle cx="248" cy="148" r="4" fill="none" stroke="#10b981" strokeWidth="1" />
              </g>

              {/* Chest & Arc Reactor Core */}
              <g 
                onClick={() => {
                  soundFx.playArcReactorPulse();
                  handleCommand('Search Wikipedia for Iron Man');
                }}
                onMouseEnter={() => setHoveredArmorSector('ARC REACTOR // CLICK FOR WIKIPEDIA "IRON MAN"')}
                onMouseLeave={() => setHoveredArmorSector(null)}
              >
                <path d="M 165 125 L 235 125 L 245 185 L 232 230 L 168 230 L 155 185 Z" fill="rgba(2, 6, 14, 0.8)" stroke="#00f0ff" strokeWidth="2" />
                <path d="M 175 135 L 190 155 L 210 155 L 225 135" fill="none" stroke="#ef4444" strokeWidth="1.2" />
                <path d="M 162 175 L 175 220 L 200 230 L 225 220 L 238 175" fill="none" stroke="#ef4444" strokeWidth="1.2" />

                <line x1="200" y1="125" x2="200" y2="170" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
                <line x1="200" y1="205" x2="200" y2="230" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

                <path d="M 178 185 C 176 195, 176 205, 178 215" fill="none" stroke="#ef4444" strokeWidth="2" />
                <path d="M 222 185 C 224 195, 224 205, 222 215" fill="none" stroke="#ef4444" strokeWidth="2" />

                {/* Glowing Circular Arc Core */}
                <g className="filter drop-shadow-[0_0_15px_rgba(0,240,255,0.95)]">
                  <circle cx="200" cy="188" r="18" fill="none" stroke="#00f0ff" strokeWidth="2.5" />
                  <circle cx="200" cy="188" r="12" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 2" />
                  <circle cx="200" cy="188" r="8" fill="url(#arcCoreGlowAssistant)" />
                  <circle cx="200" cy="188" r="3" fill="#ffffff" />
                </g>
              </g>

              {/* Arms & Hands */}
              <g 
                onClick={() => handleCommand('Play music')}
                onMouseEnter={() => setHoveredArmorSector('PORT GAUNTLET // CLICK TO PLAY MUSIC')}
                onMouseLeave={() => setHoveredArmorSector(null)}
              >
                <path d="M 148 178 L 138 230 L 152 232 L 160 180 Z" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
                <line x1="138" y1="230" x2="152" y2="232" stroke="#10b981" strokeWidth="2" />
                <path d="M 136 235 L 126 310 L 144 315 L 154 237 Z" fill="none" stroke="#00f0ff" strokeWidth="1.8" />
                <path d="M 130 250 L 148 255 L 142 295" fill="none" stroke="#ef4444" strokeWidth="1" />
                <path d="M 126 312 L 120 348 L 138 350 L 144 316 Z" fill="none" stroke="#ef4444" strokeWidth="1.2" />
                <circle cx="130" cy="330" r="3.5" fill="#00f0ff" className="glow-blueprint-cyan" />
              </g>

              <g 
                onClick={() => handleCommand('Open YouTube')}
                onMouseEnter={() => setHoveredArmorSector('STARBOARD GAUNTLET // CLICK TO OPEN YOUTUBE')}
                onMouseLeave={() => setHoveredArmorSector(null)}
              >
                <path d="M 252 178 L 262 230 L 248 232 L 240 180 Z" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
                <line x1="262" y1="230" x2="248" y2="232" stroke="#10b981" strokeWidth="2" />
                <path d="M 264 235 L 274 310 L 256 315 L 246 237 Z" fill="none" stroke="#00f0ff" strokeWidth="1.8" />
                <path d="M 270 250 L 252 255 L 258 295" fill="none" stroke="#ef4444" strokeWidth="1" />
                <path d="M 274 312 L 280 348 L 262 350 L 256 316 Z" fill="none" stroke="#ef4444" strokeWidth="1.2" />
                <circle cx="270" cy="330" r="3.5" fill="#00f0ff" className="glow-blueprint-cyan" />
              </g>

              {/* Abdomen & Pelvis */}
              <path d="M 168 230 L 172 285 L 228 285 L 232 230 Z" fill="none" stroke="#00f0ff" strokeWidth="1.8" />
              <line x1="170" y1="248" x2="230" y2="248" stroke="#ef4444" strokeWidth="1" />
              <line x1="171" y1="266" x2="229" y2="266" stroke="#ef4444" strokeWidth="1" />
              <path d="M 172 285 L 180 325 L 200 335 L 220 325 L 228 285 Z" fill="none" stroke="#00f0ff" strokeWidth="1.8" />

              {/* Legs */}
              <path d="M 175 328 L 165 405 L 192 405 L 198 335 Z" fill="none" stroke="#00f0ff" strokeWidth="1.8" />
              <line x1="165" y1="405" x2="192" y2="405" stroke="#10b981" strokeWidth="2.5" />
              <path d="M 172 345 L 188 345 L 185 390" fill="none" stroke="#ef4444" strokeWidth="1" />

              <path d="M 225 328 L 235 405 L 208 405 L 202 335 Z" fill="none" stroke="#00f0ff" strokeWidth="1.8" />
              <line x1="235" y1="405" x2="208" y2="405" stroke="#10b981" strokeWidth="2.5" />
              <path d="M 228 345 L 212 345 L 215 390" fill="none" stroke="#ef4444" strokeWidth="1" />

              {/* Telemetry Coordinate Markers */}
              <line x1="70" y1="188" x2="160" y2="188" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
              <text x="35" y="191" fill="#00f0ff" fontSize="8" fontFamily="monospace">CORE Z-0</text>
            </svg>
          </div>

          {/* Interactive Telemetry Indicator */}
          <div className="mt-2 text-center">
            {hoveredArmorSector ? (
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/80 border border-amber-500/50 px-3 py-1 rounded-full animate-pulse shadow">
                {hoveredArmorSector}
              </span>
            ) : (
              <span className="text-xs font-mono text-cyan-400/80">
                VOICE DIRECTIVES ACTIVE · CLICK ARMOR SECTORS OR SAY DIRECTIVE
              </span>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Exploded Isotope Assembly & 3 Orthogonal Views (from image) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 flex flex-col justify-between h-full space-y-6">
          
          {/* Top-Right: Exploded Isotope Housing Unit Drawing with Braided Harness */}
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-[#020710]/75 backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono border-b border-cyan-500/20 pb-2">
              <span className="text-cyan-400 font-bold tracking-wider">ISOTOPE HOUSING UNIT</span>
              <span className="text-gray-400">DWG. #85-CORE-3D</span>
            </div>

            <div className="flex items-center justify-center py-1">
              <svg viewBox="0 0 180 120" className="w-44 h-28 drop-shadow-[0_0_8px_rgba(0,240,255,0.3)]">
                <path d="M 20 50 C 40 40, 50 75, 75 60" fill="none" stroke="#ef4444" strokeWidth="2.5" />
                <path d="M 20 58 C 42 48, 52 83, 75 68" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
                <path d="M 20 66 C 45 56, 55 90, 75 75" fill="none" stroke="#10b981" strokeWidth="1.5" />

                <ellipse cx="110" cy="60" rx="35" ry="42" fill="#040914" stroke="#00f0ff" strokeWidth="2" />
                <ellipse cx="110" cy="60" rx="26" ry="32" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="5 3" />
                <ellipse cx="110" cy="60" rx="14" ry="18" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
                <circle cx="110" cy="60" r="5" fill="#00f0ff" />

                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, idx) => {
                  const rad = (deg * Math.PI) / 180;
                  const x = 110 + 35 * Math.cos(rad);
                  const y = 60 + 42 * Math.sin(rad);
                  return <circle key={idx} cx={x} cy={y} r="2" fill="#10b981" />;
                })}

                <line x1="145" y1="40" x2="175" y2="30" stroke="#00f0ff" strokeWidth="0.8" />
                <text x="145" y="24" fill="#00f0ff" fontSize="7" fontFamily="monospace">CORE #01</text>
              </svg>
            </div>

            <div className="text-[10px] text-gray-400 font-mono space-y-1">
              <div className="flex justify-between">
                <span>VOICE RECOGNIZER:</span>
                <span className="text-cyan-300">speech_recognition</span>
              </div>
              <div className="flex justify-between">
                <span>WIKIPEDIA ENGINE:</span>
                <span className="text-emerald-400">REST API v1 / wikipedia</span>
              </div>
            </div>
          </div>

          {/* Bottom-Right: 3 Orthogonal Elevations (Front, Side Profile, Rear Dorsal) */}
          <div 
            onClick={() => handleCommand('What is today date?')}
            className="p-4 rounded-xl border border-cyan-500/30 bg-[#020710]/75 backdrop-blur-sm space-y-3 cursor-pointer hover:border-cyan-400 transition-all"
          >
            <div className="flex items-center justify-between text-[11px] font-mono border-b border-cyan-500/20 pb-2">
              <span className="text-cyan-400 font-bold tracking-wider">ORTHOGONAL ELEVATIONS</span>
              <span className="text-emerald-400 font-bold">FRONT · SIDE · REAR</span>
            </div>

            <div className="relative py-2">
              <svg viewBox="0 0 240 140" className="w-full h-32 drop-shadow-[0_0_6px_rgba(0,240,255,0.25)]">
                {/* 1. Front */}
                <g transform="translate(10, 5)">
                  <text x="25" y="10" fill="#00f0ff" fontSize="7" textAnchor="middle" fontFamily="monospace">FRONT</text>
                  <ellipse cx="25" cy="20" rx="6" ry="8" fill="none" stroke="#00f0ff" strokeWidth="1" />
                  <path d="M 17 28 L 33 28 L 30 55 L 20 55 Z" fill="none" stroke="#00f0ff" strokeWidth="1" />
                  <circle cx="25" cy="38" r="2.5" fill="#00f0ff" />
                  <line x1="16" y1="30" x2="10" y2="65" stroke="#ef4444" strokeWidth="1" />
                  <line x1="34" y1="30" x2="40" y2="65" stroke="#ef4444" strokeWidth="1" />
                  <line x1="21" y1="55" x2="18" y2="105" stroke="#00f0ff" strokeWidth="1" />
                  <line x1="29" y1="55" x2="32" y2="105" stroke="#00f0ff" strokeWidth="1" />
                  <rect x="15" y="75" width="20" height="8" fill="rgba(255,255,255,0.2)" stroke="#ffffff" strokeWidth="0.8" />
                </g>

                {/* 2. Profile */}
                <g transform="translate(85, 5)">
                  <text x="25" y="10" fill="#00f0ff" fontSize="7" textAnchor="middle" fontFamily="monospace">PROFILE</text>
                  <ellipse cx="25" cy="20" rx="7" ry="8" fill="none" stroke="#00f0ff" strokeWidth="1" />
                  <path d="M 22 28 C 34 35, 30 50, 24 55 Z" fill="none" stroke="#00f0ff" strokeWidth="1" />
                  <line x1="24" y1="32" x2="22" y2="65" stroke="#ef4444" strokeWidth="1" />
                  <path d="M 23 55 L 25 80 L 22 105" fill="none" stroke="#00f0ff" strokeWidth="1" />
                  <rect x="21" y="75" width="8" height="8" fill="rgba(255,255,255,0.2)" stroke="#ffffff" strokeWidth="0.8" />
                </g>

                {/* 3. Dorsal (Rear) */}
                <g transform="translate(160, 5)">
                  <text x="25" y="10" fill="#00f0ff" fontSize="7" textAnchor="middle" fontFamily="monospace">DORSAL</text>
                  <ellipse cx="25" cy="20" rx="6" ry="8" fill="none" stroke="#00f0ff" strokeWidth="1" />
                  <path d="M 17 28 L 33 28 L 30 55 L 20 55 Z" fill="none" stroke="#00f0ff" strokeWidth="1" />
                  <path d="M 21 34 L 29 34 L 27 46 L 23 46 Z" fill="none" stroke="#ef4444" strokeWidth="1" />
                  <line x1="16" y1="30" x2="10" y2="65" stroke="#ef4444" strokeWidth="1" />
                  <line x1="34" y1="30" x2="40" y2="65" stroke="#ef4444" strokeWidth="1" />
                  <line x1="21" y1="55" x2="18" y2="105" stroke="#00f0ff" strokeWidth="1" />
                  <line x1="29" y1="55" x2="32" y2="105" stroke="#00f0ff" strokeWidth="1" />
                  <rect x="15" y="75" width="20" height="8" fill="rgba(255,255,255,0.2)" stroke="#ffffff" strokeWidth="0.8" />
                </g>
              </svg>
            </div>

            <div className="text-[10px] text-gray-400 font-mono space-y-1">
              <div className="flex justify-between">
                <span>SYSTEM TARGET:</span>
                <span className="text-cyan-300">VS CODE PYTHON 3.10+</span>
              </div>
              <div className="flex justify-between">
                <span>STATUS:</span>
                <span className="text-emerald-400 font-bold">100% ERROR FREE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FOOTER BAR: J.A.R.V.I.S. VOCAL SPEECH SYNTHESIZER & DIRECTIVE INPUT       */}
      {/* ========================================================================= */}
      <div className={`relative z-20 ${isFullscreen ? 'p-3 lg:p-3.5 space-y-2' : 'p-4 space-y-3'} border-t border-cyan-500/30 bg-[#030812]/95 backdrop-blur-md`}>
        {/* Active Speech Box */}
        <div className="p-3 bg-gray-950/90 rounded-xl border border-cyan-500/30 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-400 flex items-center justify-center shrink-0 text-cyan-300 shadow">
            <Volume2 className="w-4 h-4" />
          </div>
          <div className="flex-1 space-y-0.5">
            <span className="text-[10px] text-gray-400 font-mono font-bold block">
              J.A.R.V.I.S. DESKTOP ASSISTANT AUDITORY FEEDBACK:
            </span>
            <p className="text-xs text-cyan-100 font-mono leading-relaxed">
              "{latestSpeech}"
            </p>
          </div>
        </div>

        {/* Directive Command Input Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          {/* Quick Voice Command Shortcuts */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-[11px]">
            <span className="text-gray-500 font-bold shrink-0">DIRECTIVES:</span>
            {[
              'Search Wikipedia for Tony Stark',
              'Search Wikipedia for Iron Man',
              'Play music',
              'What time is it?',
              'Open YouTube',
              'Open Google',
              'Open GitHub',
            ].map(cmd => (
              <button
                key={cmd}
                onClick={() => handleCommand(cmd)}
                className="px-2.5 py-1 rounded bg-gray-900 hover:bg-cyan-950 border border-gray-700 hover:border-cyan-400 text-cyan-300 shrink-0 cursor-pointer transition-all text-[11px]"
              >
                {cmd}
              </button>
            ))}
          </div>

          {/* Input Box and Voice Mic */}
          <div className="flex items-center gap-2 w-full sm:flex-1">
            <button
              onClick={toggleListen}
              className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
                isListening
                  ? 'bg-red-600 border-red-400 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.7)]'
                  : 'bg-cyan-950/90 hover:bg-cyan-900 border-cyan-400 text-cyan-300'
              }`}
              title={isListening ? 'Stop Listening' : 'Click to Speak Voice Directive'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCommand(inputText)}
              placeholder="Voice or type directive (e.g. 'Search Wikipedia for Iron Man', 'Play music', 'Open YouTube')..."
              className="flex-1 bg-gray-950 border border-gray-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 font-mono focus:outline-none"
            />

            <button
              onClick={() => handleCommand(inputText)}
              disabled={!inputText.trim()}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-gray-950 font-tech font-bold text-xs flex items-center gap-1 cursor-pointer disabled:opacity-40 transition-all shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>SEND</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL OVERLAY: Python Desktop Voice Assistant Script for VS Code         */}
      {/* ========================================================================= */}
      {showPythonModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#03060b] border-2 border-cyan-500/50 rounded-2xl max-w-3xl w-full p-5 space-y-4 shadow-[0_0_50px_rgba(0,240,255,0.3)]">
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
              <div>
                <h3 className="font-tech text-base font-bold text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-cyan-400" />
                  <span>JARVIS DESKTOP VOICE ASSISTANT — PYTHON SCRIPT FOR VS CODE</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Complete error-free desktop voice assistant source code compiled for VS Code Editor.
                </p>
              </div>
              <button
                onClick={() => setShowPythonModal(false)}
                className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyPythonCode}
                className="px-3.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600 font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'COPIED TO CLIPBOARD!' : 'COPY CODE'}</span>
              </button>

              <button
                onClick={downloadPythonScript}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-gray-950 font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>DOWNLOAD JARVIS.PY</span>
              </button>
            </div>

            <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 font-mono text-xs text-cyan-100 max-h-[380px] overflow-y-auto space-y-1">
              <pre className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {pythonScriptCode}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL OVERLAY: Tactical Music Player                                     */}
      {/* ========================================================================= */}
      {showMusicOverlay && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#03060b] border-2 border-amber-500/50 rounded-2xl max-w-xl w-full p-5 space-y-4 shadow-[0_0_40px_rgba(245,158,11,0.25)]">
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
              <div className="flex items-center gap-2 text-amber-300 font-tech font-bold text-base">
                <Music className="w-5 h-5 text-amber-400" />
                <span>STARK VOICE MUSIC PLAYER</span>
              </div>
              <button
                onClick={() => setShowMusicOverlay(false)}
                className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-gray-950 border border-cyan-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-400 font-bold block">CURRENT TRACK</span>
                <span className="font-tech text-base font-bold text-white">{currentTrack}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-gray-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  {isPlayingMusic ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlayingMusic ? 'PAUSE' : 'PLAY'}</span>
                </button>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(currentTrack)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-red-950 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-1"
                >
                  <Youtube className="w-3.5 h-3.5 text-red-400" />
                  <span>YOUTUBE</span>
                </a>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs text-gray-400 font-bold block">TRACK LIST:</span>
              {[
                'AC/DC - Back in Black',
                'AC/DC - Shoot to Thrill',
                'Black Sabbath - Iron Man',
                'Ramin Djawadi - Driving With The Top Down',
              ].map(track => (
                <button
                  key={track}
                  onClick={() => {
                    setCurrentTrack(track);
                    setIsPlayingMusic(true);
                    soundFx.playArcReactorPulse();
                    jarvisVoice.speak(`Switching to ${track}, Sir.`);
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs font-mono flex items-center justify-between cursor-pointer ${
                    currentTrack === track
                      ? 'bg-amber-950/80 border-amber-400 text-amber-200 font-bold'
                      : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{track}</span>
                  {currentTrack === track && <span className="text-[10px] text-amber-300">ACTIVE</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL OVERLAY: Voice Browser & System Launcher                           */}
      {/* ========================================================================= */}
      {showLauncherOverlay && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#03060b] border-2 border-emerald-500/50 rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-[0_0_40px_rgba(16,185,129,0.25)]">
            <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
              <div className="flex items-center gap-2 text-emerald-300 font-tech font-bold text-base">
                <Globe className="w-5 h-5 text-emerald-400" />
                <span>VOICE SYSTEM & BROWSER LAUNCHERS</span>
              </div>
              <button
                onClick={() => setShowLauncherOverlay(false)}
                className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { name: 'Google Search', url: 'https://google.com' },
                { name: 'YouTube', url: 'https://youtube.com' },
                { name: 'GitHub (DUS-JARVIS)', url: 'https://github.com/dushi2933/DUS-JARVIS' },
                { name: 'Wikipedia', url: 'https://wikipedia.org' },
                { name: 'Stack Overflow', url: 'https://stackoverflow.com' },
                { name: 'Gmail (jdushi@gmail.com)', url: 'https://mail.google.com' },
                { name: 'ChatGPT', url: 'https://chatgpt.com' },
                { name: 'Google Maps', url: 'https://maps.google.com' },
              ].map(item => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    soundFx.playHudBeep('mode');
                    jarvisVoice.speak(`Launching ${item.name}, Sir.`);
                  }}
                  className="p-3 rounded-xl bg-gray-900 hover:bg-cyan-950 border border-gray-700 hover:border-cyan-400 flex items-center justify-between transition-all group cursor-pointer text-xs font-mono"
                >
                  <span className="text-white group-hover:text-cyan-300">{item.name}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-cyan-400" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
