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
  Share2, 
  Copy, 
  Check, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Flame, 
  Radio, 
  Activity, 
  Wifi, 
  Maximize2, 
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  MessageCircle,
  Eye,
  Settings
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useToast } from '../context/ToastContext';

interface PeerConnectionState {
  peerId: string;
  userName: string;
  stream?: MediaStream;
}

interface RealChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

export type CamouflageStyle = 'facetime' | 'whatsapp' | 'android-messages' | 'stark';

export const RealFriendsCommBridge: React.FC = () => {
  const { addToast } = useToast();

  // Room & Identity
  const [roomId, setRoomId] = useState<string>('');
  const [inputRoomId, setInputRoomId] = useState<string>('');
  const [userName, setUserName] = useState<string>('Tony Stark');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [activePeers, setActivePeers] = useState<PeerConnectionState[]>([]);

  // Camouflage format mode ('facetime' | 'whatsapp' | 'android-messages' | 'stark')
  const [camouflageMode, setCamouflageMode] = useState<CamouflageStyle>('facetime');
  const [friendDirectNumber, setFriendDirectNumber] = useState<string>('');
  const [isReceiverFaceTimeView, setIsReceiverFaceTimeView] = useState<boolean>(false);
  const [isReceiverWhatsAppView, setIsReceiverWhatsAppView] = useState<boolean>(false);
  const [isReceiverAndroidMessagesView, setIsReceiverAndroidMessagesView] = useState<boolean>(false);

  // Media Controls
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState<boolean>(true);
  const [callDuration, setCallDuration] = useState<number>(0);

  // Chat & Co-op events
  const [chatMessages, setChatMessages] = useState<RealChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isFiringRepulsor, setIsFiringRepulsor] = useState<boolean>(false);

  // Refs for WebRTC & WebSocket
  const wsRef = useRef<WebSocket | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const myPeerIdRef = useRef<string>(`stark-pilot-${Math.random().toString(36).substring(2, 7)}`);

  // Detect URL params on boot
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const freqFromUrl = params.get('freq') || params.get('room');
    const camoParam = params.get('camo') || params.get('view');

    if (freqFromUrl) {
      setInputRoomId(freqFromUrl.toUpperCase());
    } else {
      const generated = `STARK-${Math.floor(1000 + Math.random() * 9000)}`;
      setInputRoomId(generated);
    }

    if (camoParam === 'facetime') {
      setIsReceiverFaceTimeView(true);
      setCamouflageMode('facetime');
    } else if (camoParam === 'whatsapp') {
      setIsReceiverWhatsAppView(true);
      setCamouflageMode('whatsapp');
    } else if (camoParam === 'android' || camoParam === 'messages' || camoParam === 'android-messages') {
      setIsReceiverAndroidMessagesView(true);
      setCamouflageMode('android-messages');
    }
  }, []);

  // Call timer
  useEffect(() => {
    let timer: any = null;
    if (isConnected) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isConnected]);

  // STUN ICE servers for real peer-to-peer WebRTC connection
  const rtcConfig: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
    ],
  };

  // Start Local Media Stream (Camera & Mic)
  const initLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (err) {
      console.warn('[COMM BRIDGE] Camera unavailable, falling back to audio only:', err);
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current = audioStream;
        setIsVideoEnabled(false);
        return audioStream;
      } catch (audioErr) {
        console.warn('[COMM BRIDGE] Microphone unavailable or denied:', audioErr);
        addToast({
          title: 'Media Access Notice',
          message: 'Microphone or camera permission was not granted. You can still use tactical chat and co-op repulsors!',
          type: 'alert',
        });
        return null;
      }
    }
  };

  // Connect to Room via WebSocket signaling
  const handleJoinFrequency = async () => {
    const targetRoom = inputRoomId.trim().toUpperCase() || `STARK-${Math.floor(1000 + Math.random() * 9000)}`;
    setRoomId(targetRoom);

    soundFx.playHudBeep('mode');
    jarvisVoice.speak(`Establishing quantum comms bridge on frequency ${targetRoom}, Mr. Stark.`);

    // Initialize local media
    const localStream = await initLocalStream();

    // Connect WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/comm-bridge`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      soundFx.playHudBeep('confirm');
      addToast({
        title: 'Tactical Frequency Online',
        message: `Connected to Channel: ${targetRoom}. Send the disguised link to your friends!`,
        type: 'protocol',
      });

      // Join room message
      ws.send(
        JSON.stringify({
          type: 'join',
          roomId: targetRoom,
          peerId: myPeerIdRef.current,
          userName: userName || 'Tony Stark',
        })
      );
    };

    ws.onmessage = async (event) => {
      try {
        const msg = JSON.parse(event.data);

        // Room state with existing peers
        if (msg.type === 'room-state') {
          for (const peer of msg.peers) {
            await createPeerConnection(peer.peerId, peer.userName, true, localStream);
          }
        }

        // New peer joined
        if (msg.type === 'peer-joined') {
          soundFx.playHudBeep('alert');
          jarvisVoice.speak(`${msg.userName} has entered the comms channel.`);
          addToast({
            title: 'Friend Joined Frequency',
            message: `${msg.userName} connected to tactical channel ${targetRoom}.`,
            type: 'tactical',
          });
          await createPeerConnection(msg.peerId, msg.userName, false, localStream);
        }

        // WebRTC Offer
        if (msg.type === 'offer') {
          let pc = peerConnectionsRef.current.get(msg.fromPeerId);
          if (!pc) {
            pc = await createPeerConnection(msg.fromPeerId, msg.fromUserName || 'Friend', false, localStream);
          }
          await pc.setRemoteDescription(new RTCSessionDescription(msg.offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          ws.send(
            JSON.stringify({
              type: 'answer',
              targetPeerId: msg.fromPeerId,
              fromPeerId: myPeerIdRef.current,
              answer,
            })
          );
        }

        // WebRTC Answer
        if (msg.type === 'answer') {
          const pc = peerConnectionsRef.current.get(msg.fromPeerId);
          if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(msg.answer));
          }
        }

        // ICE Candidate
        if (msg.type === 'ice-candidate') {
          const pc = peerConnectionsRef.current.get(msg.fromPeerId);
          if (pc && msg.candidate) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
            } catch (e) {
              console.warn('ICE candidate addition failed:', e);
            }
          }
        }

        // Real-time Chat
        if (msg.type === 'chat') {
          soundFx.playHudBeep('subtle');
          setChatMessages((prev) => [
            ...prev,
            {
              id: `chat-${Date.now()}-${Math.random()}`,
              sender: msg.fromUserName,
              text: msg.text,
              timestamp: msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }

        // Co-Op Repulsor Blast from friend!
        if (msg.type === 'suit-telemetry' && msg.isFiring) {
          soundFx.playRepulsorBlast();
          addToast({
            title: 'Co-Op Repulsor Discharged!',
            message: `${msg.fromUserName || 'Friend'} fired their repulsors in sync with your armor!`,
            type: 'alert',
          });
          setIsFiringRepulsor(true);
          setTimeout(() => setIsFiringRepulsor(false), 500);
        }

        // Peer left
        if (msg.type === 'peer-left') {
          const pc = peerConnectionsRef.current.get(msg.peerId);
          if (pc) {
            pc.close();
            peerConnectionsRef.current.delete(msg.peerId);
          }
          setActivePeers((prev) => prev.filter((p) => p.peerId !== msg.peerId));
          addToast({
            title: 'Friend Disconnected',
            message: 'A participant left the tactical frequency.',
            type: 'status',
          });
        }
      } catch (err) {
        console.warn('Comm bridge message error:', err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };
  };

  // Create WebRTC Peer Connection
  const createPeerConnection = async (
    peerId: string,
    peerName: string,
    isInitiator: boolean,
    stream: MediaStream | null
  ) => {
    const pc = new RTCPeerConnection(rtcConfig);
    peerConnectionsRef.current.set(peerId, pc);

    // Add local tracks to send to friend
    if (stream) {
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    }

    // Handle remote incoming stream from friend
    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      setActivePeers((prev) => {
        const existing = prev.find((p) => p.peerId === peerId);
        if (existing) {
          return prev.map((p) => (p.peerId === peerId ? { ...p, stream: remoteStream } : p));
        }
        return [...prev, { peerId, userName: peerName, stream: remoteStream }];
      });
    };

    // Send local ICE candidates to friend
    pc.onicecandidate = (event) => {
      if (event.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'ice-candidate',
            targetPeerId: peerId,
            fromPeerId: myPeerIdRef.current,
            candidate: event.candidate,
          })
        );
      }
    };

    // If initiator, create and send SDP offer
    if (isInitiator) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      wsRef.current?.send(
        JSON.stringify({
          type: 'offer',
          targetPeerId: peerId,
          fromPeerId: myPeerIdRef.current,
          fromUserName: userName || 'Tony Stark',
          offer,
        })
      );
    }

    return pc;
  };

  // Disconnect & Leave Channel
  const handleLeaveFrequency = () => {
    soundFx.playHudBeep('alert');
    wsRef.current?.close();
    wsRef.current = null;

    peerConnectionsRef.current.forEach((pc) => pc.close());
    peerConnectionsRef.current.clear();

    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;

    setIsConnected(false);
    setActivePeers([]);
    jarvisVoice.speak('Subspace comms bridge closed, Mr. Stark.');
    addToast({
      title: 'Channel Disconnected',
      message: 'Frequency closed and camera/mic feeds released safely.',
      type: 'status',
    });
  };

  // Toggle Mute / Mic
  const handleToggleAudio = () => {
    if (localStreamRef.current) {
      const nextState = !isAudioEnabled;
      localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = nextState));
      setIsAudioEnabled(nextState);
      soundFx.playHudBeep('subtle');
    }
  };

  // Toggle Camera
  const handleToggleVideo = () => {
    if (localStreamRef.current) {
      const nextState = !isVideoEnabled;
      localStreamRef.current.getVideoTracks().forEach((t) => (t.enabled = nextState));
      setIsVideoEnabled(nextState);
      soundFx.playHudBeep('subtle');
    }
  };

  // Generate disguised / camouflaged invite link
  const getDisguisedInviteLink = (style: CamouflageStyle) => {
    const base = `${window.location.origin}${window.location.pathname}`;
    const code = roomId || inputRoomId;
    return `${base}?freq=${code}&camo=${style}`;
  };

  // Copy disguised link to clipboard
  const handleCopyDisguisedLink = (style: CamouflageStyle) => {
    const link = getDisguisedInviteLink(style);
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    soundFx.playHudBeep('confirm');
    
    const label =
      style === 'facetime'
        ? 'FaceTime Call Link'
        : style === 'whatsapp'
        ? 'WhatsApp Call Link'
        : style === 'android-messages'
        ? 'Android Messages RCS Link'
        : 'Stark Quantum Link';
    addToast({
      title: `${label} Copied!`,
      message: `Your friends will see a clean ${style.toUpperCase()} incoming call interface when they open it!`,
      type: 'status',
    });
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Send directly via WhatsApp to friends
  const handleSendViaWhatsApp = () => {
    const link = getDisguisedInviteLink(camouflageMode);
    const text = encodeURIComponent(
      camouflageMode === 'facetime'
        ? `Hey! Tony Stark is inviting you to a FaceTime Video Call: ${link}`
        : camouflageMode === 'whatsapp'
        ? `Hey! Tony Stark is calling you on WhatsApp Video Call. Tap to join: ${link}`
        : camouflageMode === 'android-messages'
        ? `Hey! Tony Stark is calling you on Android RCS Video. Tap to connect: ${link}`
        : `Hey! Join my Stark Iron Man Gauntlet Tactical Call: ${link}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
    addToast({
      title: 'WhatsApp Dispatched',
      message: 'Opening WhatsApp to share call invitation with your friends...',
      type: 'status',
    });
  };

  // Send directly via Android Messages (SMS/RCS)
  const handleSendViaAndroidMessages = () => {
    const link = getDisguisedInviteLink(camouflageMode);
    const text = encodeURIComponent(
      camouflageMode === 'android-messages'
        ? `Hey! Tony Stark is calling you on Android Messages RCS Video Call. Tap to connect: ${link}`
        : camouflageMode === 'facetime'
        ? `Hey! Tony Stark is inviting you to a FaceTime Video Call: ${link}`
        : camouflageMode === 'whatsapp'
        ? `Hey! Tony Stark is calling you on WhatsApp Video Call. Tap to join: ${link}`
        : `Hey! Join my Stark Iron Man Gauntlet Tactical Call: ${link}`
    );
    window.open(`sms:?body=${text}`, '_self');
    addToast({
      title: 'Android Messages Dispatched',
      message: 'Opening Android Messages / SMS app to send call invitation to your friend...',
      type: 'status',
    });
  };

  // Direct Apple FaceTime URI launcher
  const handleDirectFaceTimeDial = () => {
    if (!friendDirectNumber) {
      addToast({
        title: 'Number / Apple ID Required',
        message: 'Please enter your friend\'s phone number or Apple ID email to dial directly.',
        type: 'alert',
      });
      return;
    }
    const clean = friendDirectNumber.trim();
    window.location.href = `facetime:${clean}`;
    addToast({
      title: 'Dialing FaceTime',
      message: `Handing off call to Apple FaceTime for ${clean}...`,
      type: 'status',
    });
  };

  // Send Chat message to all connected friends
  const handleSendChatMessage = () => {
    if (!chatInput.trim() || !wsRef.current) return;
    const text = chatInput.trim();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    wsRef.current.send(
      JSON.stringify({
        type: 'chat',
        fromUserName: userName || 'Tony Stark',
        text,
        timestamp: time,
      })
    );

    setChatMessages((prev) => [
      ...prev,
      {
        id: `chat-${Date.now()}`,
        sender: userName || 'Tony Stark (You)',
        text,
        timestamp: time,
      },
    ]);
    setChatInput('');
    soundFx.playHudBeep('mode');
  };

  // Trigger Co-Op Repulsor Blast
  const handleFireCoopRepulsor = () => {
    soundFx.playRepulsorBlast();
    setIsFiringRepulsor(true);
    setTimeout(() => setIsFiringRepulsor(false), 500);

    if (wsRef.current && isConnected) {
      wsRef.current.send(
        JSON.stringify({
          type: 'suit-telemetry',
          fromUserName: userName || 'Tony Stark',
          isFiring: true,
        })
      );
    }

    addToast({
      title: 'Co-Op Repulsor Blast Synchronized!',
      message: 'Broadcasting high-energy plasma discharge across all connected friends!',
      type: 'alert',
    });
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // =========================================================================
  // RECEIVER VIEW: AUTHENTIC APPLE FACETIME WEB INTERFACE (WHAT FRIEND SEES)
  // =========================================================================
  if (isReceiverFaceTimeView && !isConnected) {
    return (
      <div className="bg-[#1c1c1e] text-white rounded-3xl p-8 max-w-lg mx-auto shadow-2xl border border-gray-700/60 flex flex-col items-center justify-between min-h-[580px] font-sans relative overflow-hidden">
        {/* Apple Status bar mock */}
        <div className="w-full flex items-center justify-between text-xs text-gray-400 font-medium">
          <span>FaceTime Video</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>End-to-End Encrypted</span>
          </div>
        </div>

        {/* Center Calling Card */}
        <div className="flex flex-col items-center gap-4 text-center my-auto">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-4xl shadow-2xl border-4 border-gray-600/50 relative">
            <span>👤</span>
            <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#1c1c1e] flex items-center justify-center text-xs">
              📹
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Tony Stark
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              is FaceTiming you from Stark Tower...
            </p>
          </div>

          <div className="w-full max-w-xs mt-2">
            <label className="text-xs text-gray-400 block mb-1">Your Name:</label>
            <input
              type="text"
              value={userName === 'Tony Stark' ? 'Friend' : userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-gray-800 border border-gray-700 text-sm text-white text-center focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        {/* FaceTime Green Accept & Red Decline Action Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={handleJoinFrequency}
            className="w-full py-4 rounded-2xl bg-[#34c759] hover:bg-[#30b753] text-white font-semibold text-base flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(52,199,89,0.5)] cursor-pointer transition-all active:scale-98"
          >
            <Video className="w-5 h-5" />
            <span>Join FaceTime Call</span>
          </button>

          <button
            onClick={() => setIsReceiverFaceTimeView(false)}
            className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium cursor-pointer"
          >
            Switch to Stark HUD Operator View
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RECEIVER VIEW: AUTHENTIC WHATSAPP WEB VIDEO CALL (WHAT FRIEND SEES)
  // =========================================================================
  if (isReceiverWhatsAppView && !isConnected) {
    return (
      <div className="bg-[#0b141a] text-white rounded-3xl p-8 max-w-lg mx-auto shadow-2xl border border-gray-800 flex flex-col items-center justify-between min-h-[580px] font-sans relative overflow-hidden">
        {/* WhatsApp Header Mock */}
        <div className="w-full flex items-center justify-between text-xs text-[#25D366] font-medium border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span className="font-bold tracking-wide">WhatsApp Call</span>
          </div>
          <span className="text-gray-400">🔒 End-to-end encrypted</span>
        </div>

        {/* Center Caller Card */}
        <div className="flex flex-col items-center gap-4 text-center my-auto">
          <div className="w-28 h-28 rounded-full bg-[#1f2c34] flex items-center justify-center text-4xl shadow-2xl border-4 border-[#25D366]/40 relative animate-pulse">
            <span>⚡</span>
            <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#25D366] border-2 border-[#0b141a] flex items-center justify-center text-xs text-black">
              📞
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Tony Stark
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              WhatsApp Incoming Video Call...
            </p>
          </div>

          <div className="w-full max-w-xs mt-2">
            <label className="text-xs text-gray-400 block mb-1">Your Name:</label>
            <input
              type="text"
              value={userName === 'Tony Stark' ? 'Friend' : userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-[#1f2c34] border border-gray-700 text-sm text-white text-center focus:outline-none focus:border-[#25D366]"
            />
          </div>
        </div>

        {/* WhatsApp Green Answer Button */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={handleJoinFrequency}
            className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-gray-950 font-bold text-base flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(37,211,102,0.5)] cursor-pointer transition-all active:scale-98"
          >
            <PhoneCall className="w-5 h-5 text-gray-950" />
            <span>Answer Video Call</span>
          </button>

          <button
            onClick={() => setIsReceiverWhatsAppView(false)}
            className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium cursor-pointer"
          >
            Switch to Stark HUD Operator View
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RECEIVER VIEW: AUTHENTIC GOOGLE / ANDROID MESSAGES RCS (WHAT FRIEND SEES)
  // =========================================================================
  if (isReceiverAndroidMessagesView && !isConnected) {
    return (
      <div className="bg-[#181a1f] text-white rounded-3xl p-8 max-w-lg mx-auto shadow-2xl border border-blue-900/40 flex flex-col items-center justify-between min-h-[580px] font-sans relative overflow-hidden">
        {/* Google Messages Header Mock */}
        <div className="w-full flex items-center justify-between text-xs text-blue-400 font-medium border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
              💬
            </div>
            <span className="font-bold tracking-wide text-white">Google Messages</span>
          </div>
          <span className="text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 font-mono-tech text-[10px]">
            ● RCS Chat Connected
          </span>
        </div>

        {/* Center Caller Card */}
        <div className="flex flex-col items-center gap-4 text-center my-auto">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-4xl shadow-2xl border-4 border-blue-500/40 relative animate-pulse">
            <span>⚡</span>
            <span className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-[#1a73e8] border-2 border-[#181a1f] flex items-center justify-center text-xs text-white">
              📹
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Tony Stark
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Android RCS Video Call Request...
            </p>
            <span className="text-[11px] text-blue-300 font-mono-tech mt-1 block">
              End-to-end encrypted with Google RCS
            </span>
          </div>

          <div className="w-full max-w-xs mt-2">
            <label className="text-xs text-gray-400 block mb-1">Your Name:</label>
            <input
              type="text"
              value={userName === 'Tony Stark' ? 'Friend' : userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-[#282a30] border border-gray-700 text-sm text-white text-center focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>

        {/* Android RCS Action Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={handleJoinFrequency}
            className="w-full py-4 rounded-2xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-base flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(26,115,232,0.5)] cursor-pointer transition-all active:scale-98"
          >
            <Video className="w-5 h-5 text-white" />
            <span>Join Android RCS Video Call</span>
          </button>

          <button
            onClick={() => setIsReceiverAndroidMessagesView(false)}
            className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium cursor-pointer"
          >
            Switch to Stark HUD Operator View
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PRIMARY TONY STARK OPERATOR VIEW
  // =========================================================================
  return (
    <div className="bg-gray-950/80 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md relative min-h-[640px] flex flex-col p-4 gap-4">
      <div className="absolute inset-0 holo-grid opacity-15 pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-[0_0_15px_rgba(6,182,212,0.5)] border border-cyan-400/40">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tech text-base font-bold text-cyan-200 tracking-wider">
                REAL-WORLD CO-OP COMM BRIDGE // FACETIME & WHATSAPP
              </h2>
              <span className={`text-[10px] font-mono-tech px-2 py-0.5 rounded border uppercase font-bold ${
                isConnected
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40 animate-pulse'
                  : 'bg-gray-900 text-gray-400 border-gray-800'
              }`}>
                {isConnected ? `ACTIVE: ${roomId}` : 'STANDBY'}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans">
              Mask your call invites as authentic Apple FaceTime or WhatsApp video calls for your friends
            </p>
          </div>
        </div>

        {/* Call Timer or Invite Button */}
        {isConnected && (
          <div className="flex items-center gap-2">
            <div className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-lg flex items-center gap-2 font-mono-tech text-xs text-cyan-300">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span>LIVE: {formatDuration(callDuration)}</span>
            </div>

            <button
              onClick={() => handleCopyDisguisedLink(camouflageMode)}
              className="px-3 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-200 text-xs font-tech font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'LINK COPIED!' : 'INVITE LINK'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Camouflage & Quick Share Header Bar */}
      <div className="bg-gray-900/90 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-tech font-bold text-gray-300 uppercase">
            INVITATION CAMOUFLAGE:
          </span>
          {(['facetime', 'whatsapp', 'android-messages', 'stark'] as const).map((style) => (
            <button
              key={style}
              onClick={() => {
                soundFx.playHudBeep('subtle');
                setCamouflageMode(style);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono-tech font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                camouflageMode === style
                  ? style === 'facetime'
                    ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.6)]'
                    : style === 'whatsapp'
                    ? 'bg-emerald-600 text-gray-950 font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.6)]'
                    : style === 'android-messages'
                    ? 'bg-blue-600 text-white font-extrabold shadow-[0_0_12px_rgba(26,115,232,0.6)]'
                    : 'bg-cyan-600 text-gray-950 font-extrabold shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                  : 'bg-gray-950 border border-gray-800 text-gray-400 hover:text-gray-200'
              }`}
            >
              {style === 'facetime' && '📹 MASK AS FACETIME'}
              {style === 'whatsapp' && '💬 MASK AS WHATSAPP'}
              {style === 'android-messages' && '🤖 MASK AS ANDROID RCS'}
              {style === 'stark' && '⚡ STARK QUANTUM'}
            </button>
          ))}
        </div>

        {/* Quick Send to Friends via WhatsApp / Android Messages / FaceTime */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSendViaWhatsApp}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-gray-950 font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>SEND WHATSAPP</span>
          </button>

          <button
            onClick={handleSendViaAndroidMessages}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(26,115,232,0.4)] transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>SEND ANDROID MSG</span>
          </button>

          <button
            onClick={() => handleCopyDisguisedLink(camouflageMode)}
            className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-cyan-200 font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>COPY LINK</span>
          </button>
        </div>
      </div>

      {/* Pre-Call Setup Bar (If not yet connected) */}
      {!isConnected ? (
        <div className="bg-gray-900/80 border border-cyan-500/20 rounded-xl p-5 flex flex-col gap-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Left Column: Room Code & Name */}
            <div className="w-full md:w-1/2 space-y-3">
              <div>
                <label className="text-xs font-tech font-bold text-gray-300 uppercase block mb-1">
                  YOUR PILOT HANDLE / CALLSIGN:
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Tony Stark, War Machine, Sarah..."
                  className="w-full py-2 px-3 rounded-lg bg-gray-950 border border-gray-800 text-xs text-cyan-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono-tech"
                />
              </div>

              <div>
                <label className="text-xs font-tech font-bold text-gray-300 uppercase block mb-1">
                  TACTICAL FREQUENCY / ROOM CODE:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputRoomId}
                    onChange={(e) => setInputRoomId(e.target.value.toUpperCase())}
                    placeholder="e.g. STARK-4829"
                    className="flex-1 py-2 px-3 rounded-lg bg-gray-950 border border-gray-800 text-xs text-cyan-300 font-mono-tech font-bold focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={() => {
                      const nextCode = `STARK-${Math.floor(1000 + Math.random() * 9000)}`;
                      setInputRoomId(nextCode);
                      soundFx.playHudBeep('subtle');
                    }}
                    title="Generate New Frequency Code"
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Direct Apple FaceTime / Phone Dialer Handshake */}
              <div className="pt-2 border-t border-gray-800">
                <label className="text-xs font-tech font-bold text-gray-300 uppercase block mb-1">
                  DIRECT DIAL (APPLE FACETIME / PHONE):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={friendDirectNumber}
                    onChange={(e) => setFriendDirectNumber(e.target.value)}
                    placeholder="Friend's Phone or Apple ID email..."
                    className="flex-1 py-2 px-3 rounded-lg bg-gray-950 border border-gray-800 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-400"
                  />
                  <button
                    onClick={handleDirectFaceTimeDial}
                    className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-tech font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>FACETIME</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Connection & Camouflage Explanation */}
            <div className="w-full md:w-1/2 bg-gray-950/70 border border-cyan-500/30 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-inner">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-tech text-xs font-bold text-cyan-200 uppercase">
                    SEAMLESS FRIEND DISGUISE MODE:
                  </h4>
                  <p className="text-[11px] text-gray-300 font-sans mt-0.5 leading-relaxed">
                    When you send a link to your friend, it appears as <strong>{camouflageMode.toUpperCase()}</strong>. When they tap it, they see an authentic <strong>{camouflageMode === 'facetime' ? 'Apple FaceTime Video' : 'WhatsApp Video'}</strong> incoming call screen on their device, while you get your full Iron Man Cockpit HUD!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                <button
                  onClick={handleJoinFrequency}
                  className="flex-1 py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-gray-950 font-tech font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.6)] cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>START CALL (OPEN CAMERA & MIC)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Main Call Viewport (When Connected) */}
      {isConnected && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
          
          {/* Left: Video Grids (Tony + Friends) - 8 Cols */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[380px]">
              
              {/* Local Video Tile (You) */}
              <div className="relative rounded-2xl border border-cyan-500/40 bg-gray-900 overflow-hidden flex items-center justify-center shadow-lg group">
                {/* Real video feed */}
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${!isVideoEnabled ? 'hidden' : ''}`}
                />

                {/* If video off: Hologram Avatar Placeholder */}
                {!isVideoEnabled && (
                  <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white text-2xl font-bold border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-pulse">
                      🤖
                    </div>
                    <span className="font-tech text-xs font-bold text-cyan-200">
                      {userName} (You)
                    </span>
                    <span className="text-[10px] font-mono-tech text-gray-500">CAMERA MUTED</span>
                  </div>
                )}

                {/* Tactical HUD Overlay for Tony */}
                <div className="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded backdrop-blur-sm border border-gray-800 text-[10px] font-mono-tech text-cyan-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{userName} (YOU)</span>
                </div>

                <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded backdrop-blur-sm border border-gray-800 text-[10px] font-mono-tech text-gray-300 flex items-center gap-2">
                  <span>{isAudioEnabled ? '🎤 MIC ON' : '🔇 MUTED'}</span>
                  <span>·</span>
                  <span>{isVideoEnabled ? '📹 CAM ON' : 'CAM OFF'}</span>
                </div>

                {isFiringRepulsor && (
                  <div className="absolute inset-0 bg-cyan-400/40 glow-arc-blue flex items-center justify-center animate-ping pointer-events-none">
                    <span className="font-tech text-lg font-bold text-white tracking-widest">
                      REPULSOR DISCHARGE!
                    </span>
                  </div>
                )}
              </div>

              {/* Remote Video Tile (Friend) */}
              {activePeers.length > 0 ? (
                activePeers.map((peer) => (
                  <div
                    key={peer.peerId}
                    className="relative rounded-2xl border border-emerald-500/50 bg-gray-900 overflow-hidden flex items-center justify-center shadow-lg"
                  >
                    <video
                      autoPlay
                      playsInline
                      ref={(el) => {
                        if (el && peer.stream) {
                          el.srcObject = peer.stream;
                        }
                      }}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded backdrop-blur-sm border border-gray-800 text-[10px] font-mono-tech text-emerald-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{peer.userName || 'FRIEND'}</span>
                    </div>

                    <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded backdrop-blur-sm border border-gray-800 text-[10px] font-mono-tech text-gray-300">
                      QUANTUM P2P CONNECTED
                    </div>
                  </div>
                ))
              ) : (
                /* Empty Waiting Tile for Friend */
                <div className="relative rounded-2xl border border-dashed border-gray-800 bg-gray-950/60 flex flex-col items-center justify-center p-6 text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 animate-spin-slow">
                    <Radio className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-tech text-xs font-bold text-cyan-200 uppercase">
                      WAITING FOR YOUR FRIEND TO JOIN...
                    </h4>
                    <p className="text-[11px] text-gray-400 font-sans mt-1">
                      Send your disguised link via WhatsApp or text:
                    </p>
                    <div className="font-mono-tech text-sm font-bold text-amber-300 mt-1 select-all">
                      {roomId}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      onClick={handleSendViaWhatsApp}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-gray-950 font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>SEND WHATSAPP INVITE</span>
                    </button>

                    <button
                      onClick={() => handleCopyDisguisedLink(camouflageMode)}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-cyan-200 text-xs font-tech font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isCopied ? 'COPIED!' : `COPY ${camouflageMode.toUpperCase()} LINK`}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* In-Call Action Control Bar */}
            <div className="bg-gray-900/90 border border-cyan-500/20 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleAudio}
                  className={`p-2.5 rounded-xl border text-xs font-mono-tech flex items-center gap-2 cursor-pointer transition-all ${
                    isAudioEnabled
                      ? 'bg-gray-800 border-gray-700 text-gray-200 hover:border-cyan-400'
                      : 'bg-red-950/80 border-red-500 text-red-300'
                  }`}
                  title={isAudioEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
                >
                  {isAudioEnabled ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4 text-red-400" />}
                  <span>{isAudioEnabled ? 'MIC ON' : 'MUTED'}</span>
                </button>

                <button
                  onClick={handleToggleVideo}
                  className={`p-2.5 rounded-xl border text-xs font-mono-tech flex items-center gap-2 cursor-pointer transition-all ${
                    isVideoEnabled
                      ? 'bg-gray-800 border-gray-700 text-gray-200 hover:border-cyan-400'
                      : 'bg-red-950/80 border-red-500 text-red-300'
                  }`}
                  title={isVideoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
                >
                  {isVideoEnabled ? <Video className="w-4 h-4 text-cyan-400" /> : <VideoOff className="w-4 h-4 text-red-400" />}
                  <span>{isVideoEnabled ? 'CAM ON' : 'CAM OFF'}</span>
                </button>
              </div>

              {/* Co-Op Repulsor Blast Button */}
              <button
                onClick={handleFireCoopRepulsor}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:scale-105 active:scale-95 text-white font-tech font-bold text-xs tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.6)] transition-all"
              >
                <Flame className="w-4 h-4 text-amber-300" />
                <span>FIRE CO-OP REPULSOR BLAST</span>
              </button>

              <button
                onClick={handleLeaveFrequency}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-tech font-bold text-xs tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all"
              >
                <PhoneOff className="w-4 h-4" />
                <span>DISCONNECT CALL</span>
              </button>
            </div>
          </div>

          {/* Right: In-Call Tactical Friend Chat (4 Cols) */}
          <div className="lg:col-span-4 bg-gray-900/80 border border-cyan-500/20 rounded-xl p-3 flex flex-col justify-between min-h-[380px]">
            <div>
              <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-2">
                <span className="font-tech text-xs font-bold text-cyan-200 uppercase flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>TACTICAL FRIEND COMMS</span>
                </span>
                <span className="text-[10px] font-mono-tech text-emerald-400">
                  {activePeers.length + 1} ONLINE
                </span>
              </div>

              {/* Chat Stream */}
              <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
                {chatMessages.length === 0 ? (
                  <p className="text-[11px] text-gray-500 font-mono-tech text-center py-8">
                    Send a message to your friend on this frequency...
                  </p>
                ) : (
                  chatMessages.map((msg) => (
                    <div key={msg.id} className="bg-gray-950/80 p-2 rounded-lg border border-gray-800 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-cyan-400 font-tech font-bold mb-0.5">
                        <span>{msg.sender}</span>
                        <span className="text-gray-500 font-mono-tech">{msg.timestamp}</span>
                      </div>
                      <p className="text-gray-200 font-sans text-[11px] leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Input */}
            <div className="flex items-center gap-1.5 pt-2 border-t border-gray-800 mt-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendChatMessage();
                }}
                placeholder="Type transmission to friend..."
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-gray-950 border border-gray-800 text-xs text-cyan-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={handleSendChatMessage}
                disabled={!chatInput.trim()}
                className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-gray-950 cursor-pointer disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
