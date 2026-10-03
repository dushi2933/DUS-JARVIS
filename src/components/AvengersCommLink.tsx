import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Users, 
  UserPlus, 
  Send, 
  Sparkles, 
  CheckCheck, 
  Shield, 
  Zap, 
  Flame, 
  Smile, 
  Paperclip, 
  MoreVertical, 
  Search, 
  Lock, 
  Volume2, 
  Activity, 
  Radio, 
  Clock, 
  CornerDownRight, 
  X,
  Plus
} from 'lucide-react';
import { 
  AvengerContact, 
  AvengerId, 
  AvengersChatMessage, 
  AvengersCallState 
} from '../types/avengersComms';
import { RealFriendsCommBridge } from './RealFriendsCommBridge';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useToast } from '../context/ToastContext';

export const AvengersCommLink: React.FC = () => {
  const { addToast } = useToast();
  const [commsMode, setCommsMode] = useState<'avengers' | 'real_friends'>('avengers');

  const contacts: AvengerContact[] = [
    {
      id: 'thor',
      name: 'Thor Odinson',
      alias: 'God of Thunder',
      status: 'ONLINE',
      statusMessage: 'Drinking mead in New Asgard. Stormbreaker is sharp.',
      location: 'New Asgard, Tønsberg',
      badgeColor: 'border-sky-400 text-sky-300 bg-sky-950/60',
      accentColor: '#38bdf8',
      avatarBg: 'bg-gradient-to-tr from-sky-600 to-indigo-700',
      avatarSymbol: '⚡',
      phoneNumber: '+1 (800) THOR-BIFROST',
      unreadCount: 1,
    },
    {
      id: 'hulk',
      name: 'Dr. Bruce Banner',
      alias: 'The Incredible Hulk',
      status: 'IN_LAB',
      statusMessage: 'Calibrating gamma particle dampers. Resting HR: 74 BPM.',
      location: 'Avengers Compound Lab B',
      badgeColor: 'border-emerald-500 text-emerald-300 bg-emerald-950/60',
      accentColor: '#10b981',
      avatarBg: 'bg-gradient-to-tr from-emerald-600 to-teal-800',
      avatarSymbol: '🧪',
      phoneNumber: '+1 (800) GAMMA-SMASH',
      unreadCount: 0,
    },
    {
      id: 'loki',
      name: 'Loki Laufeyson',
      alias: 'God of Mischief',
      status: 'TVA',
      statusMessage: 'Contemplating glorious purpose across the sacred timeline.',
      location: 'TVA Null-Time Zone / Asgard',
      badgeColor: 'border-amber-400 text-amber-300 bg-amber-950/60',
      accentColor: '#f59e0b',
      avatarBg: 'bg-gradient-to-tr from-green-700 to-yellow-600',
      avatarSymbol: '👑',
      phoneNumber: '+1 (800) MISCHIEF-TVA',
      unreadCount: 2,
    },
    {
      id: 'cap',
      name: 'Steve Rogers',
      alias: 'Captain America',
      status: 'ONLINE',
      statusMessage: 'Training session in Brooklyn gym. "Language, Stark."',
      location: 'Brooklyn, NY',
      badgeColor: 'border-blue-400 text-blue-300 bg-blue-950/60',
      accentColor: '#60a5fa',
      avatarBg: 'bg-gradient-to-tr from-blue-700 to-red-600',
      avatarSymbol: '🛡️',
      phoneNumber: '+1 (800) CAP-BROOKLYN',
      unreadCount: 0,
    },
    {
      id: 'spiderman',
      name: 'Peter Parker',
      alias: 'Spider-Man',
      status: 'QUEENS',
      statusMessage: 'Studying for AP Physics between rooftop patrols!',
      location: 'Queens, New York',
      badgeColor: 'border-red-400 text-red-300 bg-red-950/60',
      accentColor: '#ef4444',
      avatarBg: 'bg-gradient-to-tr from-red-600 to-blue-700',
      avatarSymbol: '🕷️',
      phoneNumber: '+1 (800) QUEENS-SPIDEY',
      unreadCount: 0,
    },
  ];

  // Active chat channel: 'group' or specific avenger id
  const [selectedChatId, setSelectedChatId] = useState<string>('group');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Call State (1-on-1 or Group Call)
  const [callState, setCallState] = useState<AvengersCallState>({
    isActive: false,
    status: 'RINGING',
    isGroupCall: false,
    participants: [],
    durationSecs: 0,
    isMuted: false,
    isVideoOn: true,
  });

  // Chat message history
  const [messages, setMessages] = useState<AvengersChatMessage[]>([
    {
      id: 'm1',
      senderId: 'thor',
      senderName: 'Thor Odinson',
      text: 'Man of Iron! Does Stark Tower have that Midgardian ale I am fond of? I have slain three frost beasts and require refreshment!',
      timestamp: '14:22',
      isRead: true,
      isGroup: true,
    },
    {
      id: 'm2',
      senderId: 'loki',
      senderName: 'Loki Laufeyson',
      text: 'Must you bellow in the group channel like a wounded bilgesnipe, brother? Some of us are orchestrating delicate temporal anomalies.',
      timestamp: '14:23',
      isRead: true,
      isGroup: true,
    },
    {
      id: 'm3',
      senderId: 'hulk',
      senderName: 'Dr. Bruce Banner',
      text: 'Guys, relax. Tony, I just checked the telemetry on your gauntlet repulsors from the compound. Capacitors look clean.',
      timestamp: '14:25',
      isRead: true,
      isGroup: true,
    },
    {
      id: 'm4',
      senderId: 'tony',
      senderName: 'Tony Stark',
      text: 'Thor, the cellar is stocked. Loki, behave yourself or I send DUM-E with a fire extinguisher. Bruce, coffee is brewing at the penthouse.',
      timestamp: '14:26',
      isRead: true,
      isGroup: true,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Call duration counter
  useEffect(() => {
    let interval: any = null;
    if (callState.isActive && callState.status === 'CONNECTED') {
      interval = setInterval(() => {
        setCallState((prev) => ({ ...prev, durationSecs: prev.durationSecs + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState.isActive, callState.status]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    soundFx.playHudBeep('mode');
    const newMsg: AvengersChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'tony',
      senderName: 'Tony Stark',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
      isGroup: selectedChatId === 'group',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Trigger AI / In-character response
    const isGroup = selectedChatId === 'group';
    const charId = isGroup ? 'thor' : selectedChatId;
    setIsTyping(isGroup ? 'Thor & Loki are typing...' : `${contacts.find((c) => c.id === charId)?.name} is typing...`);

    try {
      const res = await fetch('/api/avengers/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId: charId,
          message: text.trim(),
          isGroup,
        }),
      });

      const data = await res.json();
      setIsTyping(null);

      if (data.messages && Array.isArray(data.messages)) {
        data.messages.forEach((m: any, idx: number) => {
          setTimeout(() => {
            soundFx.playHudBeep('subtle');
            setMessages((prev) => [
              ...prev,
              {
                id: `reply-${Date.now()}-${idx}`,
                senderId: m.senderId || charId,
                senderName: m.senderName || 'Avenger',
                text: m.text,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isRead: true,
                isGroup,
              },
            ]);

            // Speak response in voice if in 1-on-1 or active call
            if (callState.isActive || !isGroup) {
              jarvisVoice.speak(`${m.senderName} says: ${m.text}`);
            }
          }, idx * 1200);
        });
      }
    } catch (e) {
      setIsTyping(null);
      console.warn('Avengers chat error:', e);
    }
  };

  // Initiate Group Call (Calls Thor, Hulk, Loki, Cap simultaneously)
  const handleStartGroupCall = () => {
    soundFx.playHudBeep('alert');
    setCallState({
      isActive: true,
      status: 'CALLING',
      isGroupCall: true,
      participants: ['thor', 'hulk', 'loki', 'cap'],
      durationSecs: 0,
      isMuted: false,
      isVideoOn: true,
    });

    jarvisVoice.speak('Initiating encrypted group conference call to Thor, Bruce Banner, and Loki.');
    addToast({
      title: 'Avengers Group Call Dialing',
      message: 'Subspace frequencies open to New Asgard, Avengers Compound, and TVA.',
      type: 'protocol',
    });

    // Pick up after 2.5 seconds
    setTimeout(() => {
      soundFx.playHudBeep('confirm');
      setCallState((prev) => ({ ...prev, status: 'CONNECTED' }));
      jarvisVoice.speak('All channels connected, Mr. Stark. Thor, Banner, and Loki are on the line.');
      addToast({
        title: 'Avengers Group Call Connected',
        message: 'Thor, Dr. Banner, and Loki are now live on the holographic comms bridge.',
        type: 'tactical',
      });
    }, 2400);
  };

  // Initiate 1-on-1 Call with specific contact (Thor, Hulk, or Loki)
  const handleStartDirectCall = (contact: AvengerContact) => {
    soundFx.playHudBeep('alert');
    setCallState({
      isActive: true,
      status: 'CALLING',
      isGroupCall: false,
      targetContact: contact,
      participants: [contact.id],
      durationSecs: 0,
      isMuted: false,
      isVideoOn: true,
    });

    jarvisVoice.speak(`Calling ${contact.name}, Mr. Stark.`);
    addToast({
      title: `Calling ${contact.name}`,
      message: `Establishing direct quantum bridge to ${contact.location}...`,
      type: 'tactical',
    });

    setTimeout(() => {
      soundFx.playHudBeep('confirm');
      setCallState((prev) => ({ ...prev, status: 'CONNECTED' }));
      jarvisVoice.speak(`${contact.name} has answered the comm-link.`);
      addToast({
        title: `${contact.name} Connected`,
        message: `Secure channel active with ${contact.name}.`,
        type: 'status',
      });
    }, 2200);
  };

  const handleEndCall = () => {
    soundFx.playHudBeep('mode');
    setCallState((prev) => ({ ...prev, isActive: false, status: 'ENDED' }));
    jarvisVoice.speak('Comms bridge disconnected, Mr. Stark.');
    addToast({
      title: 'Comms Call Concluded',
      message: 'Subspace transmission terminated. Frequencies secured.',
      type: 'status',
    });
  };

  const formatCallDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.alias.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeContact = contacts.find((c) => c.id === selectedChatId);

  return (
    <div className="bg-gray-950/80 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md relative min-h-[640px] flex flex-col">
      <div className="absolute inset-0 holo-grid opacity-15 pointer-events-none" />

      {/* Top Banner: WhatsApp / Stark Comms Header */}
      <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border-b border-cyan-500/20 px-4 py-3 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-cyan-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] border border-emerald-400/40">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tech text-base font-bold text-cyan-200 tracking-wider">
                STARK COMM-LINK // AVENGERS INITIATIVE
              </h2>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-bold uppercase">
                QUANTUM ENCRYPTED
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans">
              Instant messaging & holographic audio-video calls with Thor, Bruce Banner, and Loki
            </p>
          </div>
        </div>

        {/* Global Group Call & Mode Switcher Buttons */}
        <div className="flex items-center gap-2">
          {/* Sub-mode switcher */}
          <div className="flex items-center gap-1 bg-gray-900 p-1 rounded-xl border border-gray-800">
            <button
              onClick={() => {
                soundFx.playHudBeep('subtle');
                setCommsMode('avengers');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-tech font-bold transition-all cursor-pointer ${
                commsMode === 'avengers'
                  ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-400/50 glow-arc-blue'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              ⚡ AVENGERS
            </button>
            <button
              onClick={() => {
                soundFx.playHudBeep('mode');
                setCommsMode('real_friends');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-tech font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                commsMode === 'real_friends'
                  ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-400/50 glow-arc-blue'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>CALL REAL FRIENDS</span>
            </button>
          </div>

          {commsMode === 'avengers' && (
            <button
              onClick={handleStartGroupCall}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-gray-950 font-tech font-extrabold text-xs tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.5)] cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <Users className="w-4 h-4" />
              <span>START AVENGERS GROUP CALL</span>
            </button>
          )}
        </div>
      </div>

      {commsMode === 'real_friends' ? (
        <div className="p-2 relative z-10 flex-1 flex flex-col">
          <RealFriendsCommBridge />
        </div>
      ) : (
      /* Main Split Layout: Left Contacts Column (WhatsApp-Style), Right Chat/Comms Stream */
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 relative z-10">
        
        {/* ============================================================== */}
        {/* LEFT COLUMN: Channels & Contacts (4 Cols)                       */}
        {/* ============================================================== */}
        <div className="md:col-span-4 border-r border-cyan-500/20 bg-gray-950/90 flex flex-col">
          {/* Search Bar */}
          <div className="p-3 border-b border-gray-800">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Avengers contacts..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-xs text-cyan-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Group Channel Tab */}
          <div className="p-2 border-b border-gray-800/80">
            <button
              onClick={() => {
                soundFx.playHudBeep('subtle');
                setSelectedChatId('group');
              }}
              className={`w-full p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-3 ${
                selectedChatId === 'group'
                  ? 'bg-cyan-950/70 border-cyan-400/70 text-cyan-100 glow-arc-blue'
                  : 'bg-gray-900/60 border-gray-800 text-gray-300 hover:bg-gray-850 hover:text-white'
              }`}
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white text-lg font-bold border border-cyan-400/50 shadow-md shrink-0">
                <Users className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-tech text-xs font-bold text-cyan-200 truncate">
                    Avengers Initiative (Group)
                  </h4>
                  <span className="text-[10px] text-gray-500 font-mono-tech">NOW</span>
                </div>
                <p className="text-[11px] text-gray-400 font-sans truncate mt-0.5">
                  Thor, Bruce, Loki, Cap, Peter
                </p>
              </div>
            </button>
          </div>

          {/* Individual Contacts List (Thor, Hulk, Loki, etc.) */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[460px]">
            <div className="px-2 py-1 text-[10px] font-mono-tech text-gray-400 uppercase tracking-wider">
              DIRECT CHANNELS & PHONE LINES:
            </div>

            {filteredContacts.map((contact) => {
              const isSelected = selectedChatId === contact.id;
              return (
                <div
                  key={contact.id}
                  onClick={() => {
                    soundFx.playHudBeep('subtle');
                    setSelectedChatId(contact.id);
                  }}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 text-cyan-100 glow-arc-blue'
                      : 'bg-gray-950/40 border-gray-900 text-gray-300 hover:bg-gray-900/80 hover:text-white'
                  }`}
                >
                  {/* Avatar Icon */}
                  <div
                    className={`w-11 h-11 rounded-full ${contact.avatarBg} flex items-center justify-center text-white text-lg font-bold border border-white/20 shadow-md shrink-0 relative`}
                  >
                    <span>{contact.avatarSymbol}</span>
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-gray-950" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-tech text-xs font-bold text-gray-200 truncate">
                        {contact.name}
                      </h4>
                      <span className="text-[10px] text-gray-500 font-mono-tech">
                        {contact.id === 'thor' ? 'ASGARD' : contact.id === 'loki' ? 'TVA' : 'EARTH'}
                      </span>
                    </div>

                    <p className="text-[10px] text-gray-400 font-sans truncate">
                      {contact.alias}
                    </p>

                    <p className="text-[10px] text-gray-500 font-mono-tech truncate mt-0.5">
                      {contact.statusMessage}
                    </p>
                  </div>

                  {/* Direct Call Quick Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartDirectCall(contact);
                    }}
                    title={`Call ${contact.name}`}
                    className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 transition-all cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: WhatsApp-Style Messages & Audio/Video Comms (8 Cols) */}
        {/* ============================================================== */}
        <div className="md:col-span-8 flex flex-col bg-gray-950/60">
          
          {/* Active Chat Header */}
          <div className="p-3 border-b border-gray-800 bg-gray-900/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedChatId === 'group' ? (
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white border border-cyan-400/50">
                  <Users className="w-5 h-5" />
                </div>
              ) : (
                <div className={`w-10 h-10 rounded-full ${activeContact?.avatarBg} flex items-center justify-center text-white text-lg border border-white/20`}>
                  <span>{activeContact?.avatarSymbol}</span>
                </div>
              )}

              <div>
                <h3 className="font-tech text-sm font-bold text-cyan-200">
                  {selectedChatId === 'group' ? 'Avengers Initiative: Assembly' : activeContact?.name}
                </h3>
                <p className="text-[11px] text-emerald-400 font-mono-tech">
                  {selectedChatId === 'group'
                    ? 'Thor, Bruce Banner, Loki, Cap, Spider-Man (5 Members Online)'
                    : `${activeContact?.alias} · ${activeContact?.location} · ${activeContact?.phoneNumber}`}
                </p>
              </div>
            </div>

            {/* Quick Action Call Buttons for Current Chat */}
            <div className="flex items-center gap-2">
              {selectedChatId === 'group' ? (
                <button
                  onClick={handleStartGroupCall}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-gray-950 font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>GROUP CALL</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => activeContact && handleStartDirectCall(activeContact)}
                    className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-700 text-emerald-400 cursor-pointer"
                    title="Audio Call"
                  >
                    <Phone className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => activeContact && handleStartDirectCall(activeContact)}
                    className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-700 text-cyan-400 cursor-pointer"
                    title="Hologram Video Call"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quick Preset Transmission Chips for Tony */}
          <div className="px-3 py-2 bg-gray-900/40 border-b border-gray-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono-tech">
            <span className="text-gray-500 font-bold uppercase text-[9px] mr-1">PRESETS:</span>
            {[
              'Avengers Assemble at Stark Tower penthouse.',
              'Thor, we need lightning in the Arc Reactor core.',
              'Bruce, is code green authorized today?',
              'Loki, stop meddling with the quantum relay.',
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(preset)}
                className="px-2.5 py-1 rounded-full bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 whitespace-nowrap cursor-pointer transition-all hover:border-cyan-400"
              >
                "{preset.slice(0, 32)}..."
              </button>
            ))}
          </div>

          {/* Chat Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[340px] max-h-[380px]">
            {messages.map((msg) => {
              const isMe = msg.senderId === 'tony';
              const senderContact = contacts.find((c) => c.id === msg.senderId);

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    {!isMe && (
                      <span className="text-xs font-tech font-bold" style={{ color: senderContact?.accentColor || '#38bdf8' }}>
                        {msg.senderName}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-500 font-mono-tech">
                      {msg.timestamp}
                    </span>
                  </div>

                  <div
                    className={`max-w-md p-3 rounded-2xl text-xs font-sans leading-relaxed relative shadow-md ${
                      isMe
                        ? 'bg-cyan-900/60 border border-cyan-500/40 text-cyan-100 rounded-tr-none'
                        : 'bg-gray-900/80 border border-gray-800 text-gray-200 rounded-tl-none'
                    }`}
                  >
                    <p>{msg.text}</p>

                    <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-gray-400 font-mono-tech">
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs font-mono-tech text-cyan-400 animate-pulse pl-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isTyping}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Bar */}
          <div className="p-3 border-t border-gray-800 bg-gray-900/90 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              placeholder={`Send encrypted message to ${selectedChatId === 'group' ? 'Avengers Initiative' : activeContact?.name}...`}
              className="flex-1 py-2 px-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-cyan-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-sans"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim()}
              className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-gray-950 font-bold transition-all disabled:opacity-40 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      )}

      {/* ============================================================== */}
      {/* ACTIVE CALL MODAL (Holographic Video Call with Thor, Hulk, Loki) */}
      {/* ============================================================== */}
      {callState.isActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-gray-950 border border-cyan-500/50 rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative overflow-hidden flex flex-col gap-4">
            <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

            {/* Call Header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <div>
                  <h3 className="font-tech text-base font-bold text-cyan-200">
                    {callState.isGroupCall
                      ? '⚡ AVENGERS INITIATIVE: FULL GROUP CONFERENCE'
                      : `📞 SECURE COMM-LINK: ${callState.targetContact?.name}`}
                  </h3>
                  <p className="text-xs font-mono-tech text-gray-400">
                    STATUS: <span className="text-emerald-400 font-bold">{callState.status}</span> · TIME: {formatCallDuration(callState.durationSecs)} · 4096-BIT QUANTUM LINK
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-tech px-2 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                  {callState.isGroupCall ? '4 PARTICIPANTS' : 'DIRECT LINE'}
                </span>
              </div>
            </div>

            {/* Video Call Grid */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Tile 1: Tony Stark (You) */}
              <div className="relative rounded-xl border border-cyan-500/40 bg-gray-900/90 overflow-hidden min-h-[170px] flex flex-col items-center justify-center p-3 shadow-lg">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white text-2xl font-bold border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                  🤖
                </div>
                <span className="font-tech text-xs font-bold text-amber-300 mt-2">
                  Tony Stark (You)
                </span>
                <span className="text-[10px] text-gray-400 font-mono-tech">
                  Stark Tower Penthouse
                </span>
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[9px] font-mono-tech text-emerald-400 bg-black/60 px-1.5 py-0.5 rounded">
                  <Activity className="w-3 h-3" /> AUDIO LIVE
                </div>
              </div>

              {/* Tile 2: Thor */}
              <div className="relative rounded-xl border border-sky-400/50 bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 overflow-hidden min-h-[170px] flex flex-col items-center justify-center p-3 shadow-lg group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold border-2 border-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.6)]">
                  ⚡
                </div>
                <span className="font-tech text-xs font-bold text-sky-300 mt-2">
                  Thor Odinson
                </span>
                <span className="text-[10px] text-gray-400 font-mono-tech">
                  New Asgard · Stormbreaker Armed
                </span>
                <div className="absolute top-2 right-2 text-sky-400 text-xs animate-pulse">
                  ⚡⚡
                </div>
                <div className="absolute bottom-2 left-2 text-[9px] font-mono-tech text-sky-300 bg-black/60 px-1.5 py-0.5 rounded">
                  BIFROST CHANNEL
                </div>
              </div>

              {/* Tile 3: Bruce Banner / Hulk */}
              <div className="relative rounded-xl border border-emerald-500/50 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 overflow-hidden min-h-[170px] flex flex-col items-center justify-center p-3 shadow-lg">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-800 flex items-center justify-center text-white text-2xl font-bold border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.6)]">
                  🧪
                </div>
                <span className="font-tech text-xs font-bold text-emerald-300 mt-2">
                  Dr. Bruce Banner
                </span>
                <span className="text-[10px] text-gray-400 font-mono-tech">
                  Avengers Compound · 74 BPM
                </span>
                <div className="absolute bottom-2 left-2 text-[9px] font-mono-tech text-emerald-400 bg-black/60 px-1.5 py-0.5 rounded">
                  GAMMA SPECTRAL
                </div>
              </div>

              {/* Tile 4: Loki */}
              <div className="relative rounded-xl border border-amber-500/50 bg-gradient-to-br from-green-950 via-slate-900 to-amber-950 overflow-hidden min-h-[170px] flex flex-col items-center justify-center p-3 shadow-lg">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-green-700 to-yellow-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.6)]">
                  👑
                </div>
                <span className="font-tech text-xs font-bold text-amber-300 mt-2">
                  Loki Laufeyson
                </span>
                <span className="text-[10px] text-gray-400 font-mono-tech">
                  TVA Sacred Timeline
                </span>
                <div className="absolute top-2 right-2 text-amber-400 text-xs animate-spin-slow">
                  ✨
                </div>
                <div className="absolute bottom-2 left-2 text-[9px] font-mono-tech text-amber-300 bg-black/60 px-1.5 py-0.5 rounded">
                  TIME DILATION
                </div>
              </div>
            </div>

            {/* Live Holographic Audio Feed Subtitle */}
            <div className="relative z-10 bg-gray-900/90 border border-cyan-500/30 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-2 text-xs font-mono-tech text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold">LIVE AUDIO CARRIER:</span>
                <span className="text-gray-300 italic">
                  {callState.status === 'CALLING'
                    ? 'Dialing Thor, Bruce Banner, and Loki across subspace relays...'
                    : '"Thor: Greetings Stark! Tell me of this battle you summon us for!"'}
                </span>
              </div>
            </div>

            {/* Call Control Buttons */}
            <div className="relative z-10 flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setCallState((p) => ({ ...p, isMuted: !p.isMuted }))}
                className={`p-3 rounded-full border cursor-pointer transition-all ${
                  callState.isMuted
                    ? 'bg-red-950 border-red-500 text-red-400'
                    : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-cyan-400'
                }`}
                title={callState.isMuted ? 'Unmute Mic' : 'Mute Mic'}
              >
                {callState.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setCallState((p) => ({ ...p, isVideoOn: !p.isVideoOn }))}
                className={`p-3 rounded-full border cursor-pointer transition-all ${
                  !callState.isVideoOn
                    ? 'bg-red-950 border-red-500 text-red-400'
                    : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-cyan-400'
                }`}
                title={callState.isVideoOn ? 'Turn Video Off' : 'Turn Video On'}
              >
                {callState.isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={handleEndCall}
                className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-tech font-bold text-xs tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.7)] cursor-pointer transition-all hover:scale-105 active:scale-95"
              >
                <PhoneOff className="w-4 h-4" />
                <span>DISCONNECT CALL</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
