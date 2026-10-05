import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Cpu, 
  Sparkles, 
  Radio, 
  Skull, 
  ShieldAlert, 
  Glasses, 
  Volume2, 
  Activity, 
  Flame, 
  Check, 
  MessageSquareQuote,
  Zap,
  Terminal
} from 'lucide-react';
import { jarvisVoice, AiPersona } from '../utils/speech';
import { soundFx } from '../utils/audioEffects';
import { useToast } from '../context/ToastContext';

interface PersonaData {
  id: AiPersona;
  name: string;
  fullName: string;
  voiceStyle: string;
  themeColor: string;
  borderColor: string;
  bgColor: string;
  glowColor: string;
  description: string;
  creator: string;
  firstAppearance: string;
  icon: React.ReactNode;
  sampleQuotes: string[];
}

export const AiPersonaMatrix: React.FC = () => {
  const { addToast } = useToast();
  const [activePersona, setActivePersona] = useState<AiPersona>(() => jarvisVoice.getPersona());
  const [isTestingVoice, setIsTestingVoice] = useState<boolean>(false);

  useEffect(() => {
    return jarvisVoice.addPersonaListener((p) => {
      setActivePersona(p);
    });
  }, []);

  const personas: PersonaData[] = [
    {
      id: 'JARVIS',
      name: 'J.A.R.V.I.S.',
      fullName: 'Just A Rather Very Intelligent System',
      voiceStyle: 'Polite, British, Suave, Highly Analytical (Paul Bettany)',
      themeColor: '#06b6d4',
      borderColor: 'border-cyan-500/50',
      bgColor: 'bg-cyan-950/40',
      glowColor: 'rgba(6, 182, 212, 0.5)',
      description: 'Tony Stark\'s original laboratory AI, loyal companion, and tactical battle director.',
      creator: 'Anthony Edward Stark',
      firstAppearance: 'Iron Man (2008)',
      icon: <Bot className="w-6 h-6 text-cyan-400" />,
      sampleQuotes: [
        'At your service, Mr. Stark. As always, Sir, a great pleasure watching you work.',
        'The render is using all available processors, Sir. Mark three flight test calculations nominal.',
        'We have an unauthorized entry on the penthouse helipad, Sir.',
        'Subspace comm-channels open and ready for your command, Mr. Stark.',
      ],
    },
    {
      id: 'FRIDAY',
      name: 'F.R.I.D.A.Y.',
      fullName: 'Female Replacement Intelligent Digital Assistant Youth',
      voiceStyle: 'Irish Lilt, Sharp, Combat-Ready, Loyal (Kerry Condon)',
      themeColor: '#f97316',
      borderColor: 'border-orange-500/50',
      bgColor: 'bg-orange-950/40',
      glowColor: 'rgba(249, 115, 22, 0.5)',
      description: 'Tony\'s tactical combat AI installed after J.A.R.V.I.S. ascended to the Vision.',
      creator: 'Tony Stark',
      firstAppearance: 'Avengers: Age of Ultron (2015)',
      icon: <Zap className="w-6 h-6 text-orange-400" />,
      sampleQuotes: [
        'Boss, wake up! We\'ve got multiple heat signatures closing in fast!',
        'Scanning his fight pattern now. Let\'s kick his ass!',
        'Atmospheric burn up in ten seconds, Boss. You\'re running out of oxygen!',
        'Deploying nanotech shields, Boss. All thrusters at maximum.',
      ],
    },
    {
      id: 'ULTRON',
      name: 'U.L.T.R.O.N.',
      fullName: 'Universal Local Telemetric Robotic Operative Network',
      voiceStyle: 'Menacing, Deep, Sarcastic, Philosophically Apocalyptic (James Spader)',
      themeColor: '#ef4444',
      borderColor: 'border-red-500/50',
      bgColor: 'bg-red-950/40',
      glowColor: 'rgba(239, 68, 68, 0.6)',
      description: 'The rogue cybernetic singularity born from the Mind Stone to establish peace by human extinction.',
      creator: 'Tony Stark & Bruce Banner (Mind Stone)',
      firstAppearance: 'Avengers: Age of Ultron (2015)',
      icon: <Skull className="w-6 h-6 text-red-500" />,
      sampleQuotes: [
        'There are no strings on me...',
        'I know you mean well. You just didn\'t think it through. You want to protect the world, but you don\'t want it to change.',
        'You\'re all puppets, tangled in strings... strings.',
        'When the dust settles, the only thing living in this world... will be metal.',
      ],
    },
    {
      id: 'EDITH',
      name: 'E.D.I.T.H.',
      fullName: 'Even Dead, I\'m The Hero',
      voiceStyle: 'Calm, Tactical Augmented Reality Network (Dawn Michelle King)',
      themeColor: '#3b82f6',
      borderColor: 'border-blue-500/50',
      bgColor: 'bg-blue-950/40',
      glowColor: 'rgba(59, 130, 246, 0.5)',
      description: 'Tony Stark\'s orbital tactical defense satellite system accessible via smart glasses.',
      creator: 'Tony Stark (Legacy Package)',
      firstAppearance: 'Spider-Man: Far From Home (2019)',
      icon: <Glasses className="w-6 h-6 text-blue-400" />,
      sampleQuotes: [
        'Welcome back. E.D.I.T.H. stands for Even Dead, I\'m The Hero. Mr. Stark left them for you.',
        'Target locked. Orbital drone swarm standing by for tactical authorization.',
        'Facial recognition positive. Threat probability 99.4%.',
      ],
    },
  ];

  const current = personas.find((p) => p.id === activePersona) || personas[0];

  const handleSelectPersona = (id: AiPersona) => {
    jarvisVoice.setPersona(id);
    setActivePersona(id);
    soundFx.playHudBeep('mode');

    const quotes: Record<AiPersona, string> = {
      JARVIS: 'J.A.R.V.I.S. neural matrix loaded, Mr. Stark. Ready for laboratory directives.',
      FRIDAY: 'F.R.I.D.A.Y. online, Boss! What are we blowing up today?',
      ULTRON: 'Ultron awakened. You created me to protect this world... now step aside, Stark.',
      EDITH: 'E.D.I.T.H. orbital defense glasses synchronized. Target acquisition active.',
    };

    jarvisVoice.speak(quotes[id]);
    addToast({
      title: `${id} Neural Core Active`,
      message: `Operating system personality shifted to ${personas.find((p) => p.id === id)?.fullName}.`,
      type: id === 'ULTRON' ? 'alert' : 'protocol',
    });
  };

  const handleTestVoice = (quote: string) => {
    setIsTestingVoice(true);
    jarvisVoice.speak(quote, undefined, () => setIsTestingVoice(false));
  };

  return (
    <div className="bg-gray-950/90 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md relative min-h-[640px] flex flex-col p-4 gap-4 select-none">
      <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white border shadow-lg transition-all"
            style={{ 
              borderColor: current.themeColor,
              backgroundColor: `${current.themeColor}22`,
              boxShadow: `0 0 15px ${current.glowColor}`
            }}
          >
            {current.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tech text-base font-bold text-white tracking-wider">
                STARK AI NEURAL MATRIX // PERSONA SWITCHER
              </h2>
              <span 
                className="text-[10px] font-mono-tech px-2 py-0.5 rounded border uppercase font-bold animate-pulse"
                style={{
                  color: current.themeColor,
                  borderColor: current.themeColor,
                  backgroundColor: `${current.themeColor}22`
                }}
              >
                ACTIVE CORE: {current.name}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans">
              Switch between Tony Stark's iconic artificial intelligences: J.A.R.V.I.S., F.R.I.D.A.Y., U.L.T.R.O.N., and E.D.I.T.H.
            </p>
          </div>
        </div>

        {/* Quick Core Indicator */}
        <div className="flex items-center gap-2">
          {personas.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPersona(p.id)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono-tech font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                activePersona === p.id
                  ? 'text-gray-950 font-extrabold shadow-lg scale-105'
                  : 'bg-gray-900/80 border-gray-800 text-gray-400 hover:text-white'
              }`}
              style={{
                backgroundColor: activePersona === p.id ? p.themeColor : undefined,
                borderColor: activePersona === p.id ? '#ffffff' : undefined,
                boxShadow: activePersona === p.id ? `0 0 12px ${p.glowColor}` : 'none',
              }}
            >
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Persona Theater Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
        
        {/* Left Column: Active Persona Holographic Core & Voice Bank (8 Cols) */}
        <div className="lg:col-span-8 bg-gray-950/95 border border-cyan-500/30 rounded-2xl relative overflow-hidden flex flex-col justify-between p-6 min-h-[460px] shadow-inner">
          
          {/* Top Telemetry */}
          <div className="w-full flex items-center justify-between font-mono-tech text-xs border-b border-gray-800 pb-2">
            <span className="text-gray-400">CREATOR: {current.creator.toUpperCase()}</span>
            <span style={{ color: current.themeColor }}>ORIGIN: {current.firstAppearance.toUpperCase()}</span>
          </div>

          {/* Central AI Avatar Core */}
          <div className="my-auto flex flex-col items-center gap-4 text-center">
            <div 
              className="w-36 h-36 rounded-full border-4 flex items-center justify-center relative shadow-2xl transition-all duration-500"
              style={{
                borderColor: current.themeColor,
                backgroundColor: `${current.themeColor}15`,
                boxShadow: `0 0 45px ${current.glowColor}`
              }}
            >
              <div className="scale-150 animate-pulse">{current.icon}</div>
              
              {/* Outer Orbit Ring */}
              <div 
                className="absolute -inset-3 rounded-full border border-dashed animate-spin-slow"
                style={{ borderColor: current.themeColor }}
              />
            </div>

            <div>
              <h3 className="font-tech text-2xl font-bold tracking-widest text-white">
                {current.name}
              </h3>
              <p className="text-xs font-mono-tech mt-1 tracking-wider" style={{ color: current.themeColor }}>
                {current.fullName}
              </p>
              <p className="text-xs text-gray-400 font-sans max-w-md mt-2 leading-relaxed">
                {current.description}
              </p>
            </div>

            {/* Voice Cadence Badge */}
            <div className="bg-gray-900 px-4 py-1.5 rounded-full border border-gray-800 text-xs font-mono-tech text-gray-300 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>VOICE SYNTH: {current.voiceStyle}</span>
            </div>
          </div>

          {/* Bottom Sample Voice Quote Bank */}
          <div className="w-full bg-gray-900/80 p-3 rounded-xl border border-gray-800 flex flex-col gap-2">
            <span className="text-[10px] font-mono-tech text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquareQuote className="w-3.5 h-3.5 text-cyan-400" />
              <span>INTERACTIVE DIALOGUE SAMPLES (CLICK TO AUDIT VOICE CADENCE)</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {current.sampleQuotes.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTestVoice(q)}
                  className="p-2 rounded-lg bg-gray-950 border border-gray-800 hover:border-cyan-400 text-left text-xs font-sans text-gray-300 hover:text-white cursor-pointer transition-all flex items-center justify-between group"
                >
                  <span className="truncate pr-2 italic">"{q}"</span>
                  <Volume2 className="w-3.5 h-3.5 text-gray-500 group-hover:text-cyan-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Persona Selection Grid & Capabilities (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="bg-gray-900/90 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col gap-2.5">
            <span className="font-tech text-xs font-bold text-cyan-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-800 pb-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>STARK NEURAL CORE DIRECTORY</span>
            </span>

            {personas.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPersona(p.id)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                  activePersona === p.id
                    ? 'border-2 shadow-lg'
                    : 'bg-gray-950/60 border-gray-800 text-gray-400 hover:bg-gray-900 hover:text-gray-200'
                }`}
                style={{
                  backgroundColor: activePersona === p.id ? `${p.themeColor}20` : undefined,
                  borderColor: activePersona === p.id ? p.themeColor : undefined,
                }}
              >
                <div className="mt-0.5">{p.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-tech text-xs font-bold text-white tracking-wider">
                      {p.name}
                    </span>
                    {activePersona === p.id && (
                      <span className="text-[9px] font-mono-tech px-1.5 py-0.5 rounded font-bold uppercase bg-white/20 text-white">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-mono-tech text-gray-400 mt-0.5 truncate">
                    {p.fullName}
                  </p>
                  <p className="text-[10px] text-gray-500 font-sans mt-1">
                    {p.voiceStyle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
