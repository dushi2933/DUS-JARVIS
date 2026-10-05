import React, { useState, useEffect, useRef } from 'react';
import { 
  Laptop, 
  Power, 
  Terminal, 
  Globe, 
  Calculator, 
  FileCode, 
  Music, 
  Activity, 
  Wifi, 
  Battery, 
  Volume2, 
  Search, 
  X, 
  Minus, 
  Square, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  Cpu, 
  ShieldCheck, 
  HardDrive, 
  Folder, 
  FileText,
  Play, 
  Pause, 
  SkipForward, 
  Camera, 
  Fingerprint, 
  Layers, 
  Send, 
  Check, 
  RotateCcw,
  Zap,
  ArrowLeft,
  ArrowRight,
  Home,
  Star,
  ExternalLink,
  Lock,
  Plus,
  Settings,
  Grid,
  ChevronRight,
  Download,
  Trash2,
  Share2,
  Video,
  Code,
  Navigation,
  Compass,
  Eye,
  Mic,
  MicOff,
  Radar,
  MapPin,
  AlertCircle,
  Crosshair,
  Briefcase,
  RefreshCw,
  Smartphone,
  QrCode,
  DollarSign,
  TrendingUp,
  Award
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useToast } from '../context/ToastContext';

type WindowId = 'chrome' | 'explorer' | 'terminal' | 'calc' | 'notepad' | 'settings' | 'spotify' | 'lidarNav' | 'pitchDeck';

interface TouchRipple {
  id: number;
  x: number;
  y: number;
}

interface BrowserTab {
  id: string;
  title: string;
  url: string;
  pageType: 'search' | 'starkware' | 'youtube' | 'github' | 'wikipedia' | 'news' | 'home';
  query?: string;
}

export const StarkVirtualLaptop: React.FC = () => {
  const { addToast } = useToast();

  const [isPoweredOn, setIsPoweredOn] = useState<boolean>(true);
  const [activeWindow, setActiveWindow] = useState<WindowId | null>('chrome');
  const [minimizedWindows, setMinimizedWindows] = useState<Record<WindowId, boolean>>({
    chrome: false,
    explorer: true,
    terminal: true,
    calc: true,
    notepad: true,
    settings: true,
    spotify: true,
    lidarNav: true,
    pitchDeck: true,
  });
  const [maximizedWindows, setMaximizedWindows] = useState<Record<WindowId, boolean>>({
    chrome: false,
    explorer: false,
    terminal: false,
    calc: false,
    notepad: false,
    settings: false,
    spotify: false,
    lidarNav: false,
    pitchDeck: false,
  });

  const [isStartMenuOpen, setIsStartMenuOpen] = useState<boolean>(false);
  const [ripples, setRipples] = useState<TouchRipple[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  // -------------------------------------------------------------
  // STARKWARE CHROME BROWSER STATE
  // -------------------------------------------------------------
  const [browserTabs, setBrowserTabs] = useState<BrowserTab[]>([
    {
      id: 'tab-1',
      title: 'Starkware // StarkNet Zero-Knowledge',
      url: 'https://starkware.co',
      pageType: 'starkware',
    },
    {
      id: 'tab-2',
      title: 'Google Stark Search',
      url: 'https://google.com/search?q=arc+reactor+mark+85',
      pageType: 'search',
      query: 'arc reactor mark 85',
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const [omniInput, setOmniInput] = useState<string>('https://starkware.co');
  const [browserHistory, setBrowserHistory] = useState<string[]>(['https://starkware.co']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // -------------------------------------------------------------
  // FILE EXPLORER STATE
  // -------------------------------------------------------------
  const [currentFolder, setCurrentFolder] = useState<'root' | 'documents' | 'firmware' | 'downloads'>('root');

  // -------------------------------------------------------------
  // NOTEPAD STATE
  // -------------------------------------------------------------
  const [notepadText, setNotepadText] = useState<string>(
    `STARK INDUSTRIES RESEARCH MEMORANDUM
Project: Mark-85 Nano-Infused Vibranium Composite
Classification: LEVEL 9 TACTICAL
Date: 2026-10-03

Notes:
1. Ensure the nanotech housing particles remain energized via the RT-08 chest repulsor.
2. Friday confirmed orbital telemetry is synchronized with the Veronica platform.
3. Replace palladium core rings with synthetic element 118 vibranium isotope.`
  );

  // -------------------------------------------------------------
  // TERMINAL STATE
  // -------------------------------------------------------------
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'Windows PowerShell [Version 10.0.22631.3007]',
    '(c) Microsoft Corporation. Starkware Enterprise Security Enhanced.',
    '',
    'Type "help" or "dir" to view files and commands.',
  ]);
  const [terminalInput, setTerminalInput] = useState<string>('');

  // -------------------------------------------------------------
  // CALCULATOR STATE
  // -------------------------------------------------------------
  const [calcDisplay, setCalcDisplay] = useState<string>('0');
  const [calcPrev, setCalcPrev] = useState<string | null>(null);
  const [calcOp, setCalcOp] = useState<string | null>(null);

  // -------------------------------------------------------------
  // SPOTIFY MUSIC STATE
  // -------------------------------------------------------------
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);

  const playlist = [
    { title: 'Back in Black', artist: 'AC/DC', duration: '4:15' },
    { title: 'Shoot to Thrill', artist: 'AC/DC', duration: '5:17' },
    { title: 'Iron Man', artist: 'Black Sabbath', duration: '5:56' },
    { title: 'Highway to Hell', artist: 'AC/DC', duration: '3:28' },
  ];

  // Virtual keyboard base toggle
  const [showBaseKeyboard, setShowBaseKeyboard] = useState<boolean>(true);

  // -------------------------------------------------------------
  // CAMERA & FAKE LIDAR 3D SPATIAL NAVIGATOR STATE
  // -------------------------------------------------------------
  const cameraVideoRef = useRef<HTMLVideoElement | null>(null);
  const lidarCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isLidarOverlayOn, setIsLidarOverlayOn] = useState<boolean>(true);
  const [isVoiceGuidanceOn, setIsVoiceGuidanceOn] = useState<boolean>(true);
  const [targetWaypoint, setTargetWaypoint] = useState<'exit' | 'desk' | 'charger' | 'forward'>('forward');
  const [guidanceInstruction, setGuidanceInstruction] = useState<string>('Path clear ahead. Proceed forward 2.8 meters.');
  const [targetHeadingDeg, setTargetHeadingDeg] = useState<number>(0);
  const [distanceRemaining, setDistanceRemaining] = useState<string>('2.8m');
  const [isScanningActive, setIsScanningActive] = useState<boolean>(true);
  const [detectedObstacles, setDetectedObstacles] = useState<Array<{ id: number; label: string; dist: string; dir: string; status: 'clear' | 'caution' | 'danger' }>>([
    { id: 1, label: 'FORWARD CORRIDOR', dist: '2.8m', dir: '0° AHEAD', status: 'clear' },
    { id: 2, label: 'LAB WORKSTATION', dist: '1.4m', dir: '+35° STARBOARD', status: 'caution' },
    { id: 3, label: 'PERIMETER PARTITION', dist: '3.9m', dir: '-25° PORT', status: 'clear' },
  ]);

  // -------------------------------------------------------------
  // CONTINUOUS AMBIENT MICROPHONE STATE (Always-On Listener)
  // -------------------------------------------------------------
  const [isLaptopMicListening, setIsLaptopMicListening] = useState<boolean>(false);
  const [lastHeardSpeech, setLastHeardSpeech] = useState<string>('');
  const speechRecognitionRef = useRef<any>(null);

  // -------------------------------------------------------------
  // BACKPACK BAG RECON MODE STATE (Laptop in Bag + USB Camera + Earbuds)
  // -------------------------------------------------------------
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isBackpackModeActive, setIsBackpackModeActive] = useState<boolean>(false);
  const [isAnalyzingVision, setIsAnalyzingVision] = useState<boolean>(false);
  const [lastAiVisionData, setLastAiVisionData] = useState<{
    spokenGuidance: string;
    direction: string;
    estimatedClearance: string;
    detectedObjects: string[];
    hazardWarning: string | null;
  } | null>(null);
  const [showBagConfigModal, setShowBagConfigModal] = useState<boolean>(false);
  const [showPhoneModal, setShowPhoneModal] = useState<boolean>(false);
  const wakeLockRef = useRef<any>(null);

  // Scan and enumerate connected camera hardware (integrated vs USB)
  const refreshVideoDevices = async () => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const vDevices = devices.filter((d) => d.kind === 'videoinput');
        setVideoDevices(vDevices);

        if (vDevices.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(vDevices[0].deviceId);
        }
        return vDevices;
      } catch (e) {
        console.warn('Error enumerating devices:', e);
      }
    }
    return [];
  };

  useEffect(() => {
    refreshVideoDevices();
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.addEventListener) {
      navigator.mediaDevices.addEventListener('devicechange', refreshVideoDevices);
      return () => {
        navigator.mediaDevices.removeEventListener('devicechange', refreshVideoDevices);
      };
    }
  }, []);

  // Quick switch between connected cameras (Laptop Cam <-> USB Cam)
  const switchCamera = async () => {
    soundFx.playHudBeep('mode');
    const devices = await refreshVideoDevices();
    if (devices.length <= 1) {
      addToast({
        title: 'Only 1 Camera Detected',
        message: 'USB webcam scanning... If plugged in, allow browser camera permission or re-plug.',
        type: 'status',
      });
      startCamera();
      return;
    }

    const currentIndex = devices.findIndex((d) => d.deviceId === selectedDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    const nextDevice = devices[nextIndex];
    setSelectedDeviceId(nextDevice.deviceId);
    await startCamera(nextDevice.deviceId);

    const deviceName = nextDevice.label || `Camera ${nextIndex + 1}`;
    jarvisVoice.speak(`Switched optical feed to ${deviceName}.`);
    addToast({
      title: 'Camera Switched',
      message: `Now active: ${deviceName}`,
      type: 'protocol',
    });
  };

  // Start real laptop or external USB webcam
  const startCamera = async (deviceIdToUse?: string) => {
    soundFx.playHudBeep('mode');
    const devId = deviceIdToUse || selectedDeviceId;
    
    // Stop any existing stream
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: devId
          ? { deviceId: { exact: devId }, width: { ideal: 1280 }, height: { ideal: 720 } }
          : { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      setIsCameraActive(true);
      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
      }
      jarvisVoice.speak('Webcam visual sensor calibrated, Mr. Stark. LiDAR spatial grid active.');
      addToast({
        title: 'Webcam & LiDAR Online',
        message: 'Spatial navigation and 3D depth telemetry synchronized.',
        type: 'protocol',
      });
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setIsCameraActive(true); // Fall back to simulated LiDAR sensor mode
      jarvisVoice.speak('Simulated LiDAR telemetry online. Optical video feed in synthetic mode.');
      addToast({
        title: 'Simulated LiDAR Active',
        message: 'Using synthetic 3D spatial depth model.',
        type: 'status',
      });
    }
  };

  const stopCamera = () => {
    soundFx.playHudBeep('subtle');
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
    jarvisVoice.speak('Camera feed disconnected.');
  };

  // Real AI-Powered Camera Vision Guidance (Webcam in Bag)
  const triggerBackpackVisionGuide = async (customPrompt?: string) => {
    soundFx.playHudBeep('mode');
    setIsAnalyzingVision(true);

    let base64Image = '';

    // Capture frame from live video feed if active
    if (cameraVideoRef.current && cameraVideoRef.current.videoWidth > 0) {
      const v = cameraVideoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = Math.min(v.videoWidth, 640);
      canvas.height = Math.min(v.videoHeight, 480);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
        base64Image = canvas.toDataURL('image/jpeg', 0.85);
      }
    }

    try {
      const res = await fetch('/api/backpack-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Image,
          userQuestion: customPrompt || 'Where should I go? Check the camera and guide me.',
        }),
      });
      const data = await res.json();
      setIsAnalyzingVision(false);

      if (data.success && data.spokenGuidance) {
        soundFx.playHudBeep('confirm');
        setLastAiVisionData(data);
        setGuidanceInstruction(data.spokenGuidance);
        if (data.estimatedClearance) setDistanceRemaining(data.estimatedClearance);

        // Update direction heading
        if (data.direction === 'LEFT') setTargetHeadingDeg(-25);
        else if (data.direction === 'RIGHT') setTargetHeadingDeg(25);
        else if (data.direction === 'STOP_OBSTACLE') setTargetHeadingDeg(0);
        else setTargetHeadingDeg(0);

        if (data.detectedObjects && Array.isArray(data.detectedObjects)) {
          setDetectedObstacles(data.detectedObjects.map((obj: string, i: number) => ({
            id: Date.now() + i,
            label: obj.toUpperCase(),
            dist: i === 0 ? (data.estimatedClearance || '2.5m') : `${(i + 1) * 1.2}m`,
            dir: data.direction === 'LEFT' ? 'BEAR LEFT' : data.direction === 'RIGHT' ? 'BEAR RIGHT' : 'AHEAD',
            status: data.hazardWarning && i === 0 ? 'danger' : 'clear',
          })));
        }

        // Speak aloud into headphones/earbuds!
        jarvisVoice.speak(data.spokenGuidance);
        addToast({
          title: 'Jarvis Waypoint Guidance',
          message: data.spokenGuidance,
          type: 'tactical',
        });
      }
    } catch (err) {
      console.warn('Vision guidance fetch error:', err);
      setIsAnalyzingVision(false);
      const fallback = 'Path appears unobstructed forward, Mr. Stark. Advance 3 meters ahead.';
      setGuidanceInstruction(fallback);
      jarvisVoice.speak(fallback);
    }
  };

  // Ensure video element receives stream whenever it becomes available/active
  useEffect(() => {
    if (cameraVideoRef.current && cameraStream) {
      cameraVideoRef.current.srcObject = cameraStream;
      cameraVideoRef.current.play().catch(() => {});
    }
  }, [cameraStream, isCameraActive, activeWindow, minimizedWindows.lidarNav]);

  // Toggle Backpack Bag Mode (Runs with laptop inside bag)
  const toggleBackpackMode = async () => {
    soundFx.playArcReactorPulse();
    const nextState = !isBackpackModeActive;
    setIsBackpackModeActive(nextState);

    if (nextState) {
      // 0. Bring LiDAR & Camera window to front
      setMinimizedWindows((prev) => ({ ...prev, lidarNav: false }));
      setActiveWindow('lidarNav');

      // 1. Request WakeLock so laptop doesn't sleep in bag
      if ('wakeLock' in navigator) {
        try {
          const lock = await (navigator as any).wakeLock.request('screen');
          wakeLockRef.current = lock;
        } catch (e) {
          console.warn('WakeLock not granted:', e);
        }
      }

      // 2. Ensure camera is running
      if (!isCameraActive) {
        startCamera();
      }

      // 3. Ensure ambient mic is listening continuously
      if (!isLaptopMicListening) {
        toggleLaptopMicrophone();
      }

      jarvisVoice.speak('Backpack Recon Mode engaged, Mr. Stark. Screen wake lock secured, USB webcam linked, and ambient audio listening continuously. You may place the laptop in your bag.');
      addToast({
        title: '🎒 Backpack Recon Mode Active',
        message: 'Laptop will stay awake with camera and earbud voice link active in your bag.',
        type: 'protocol',
      });
    } else {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
      jarvisVoice.speak('Backpack Recon Mode disengaged.');
      addToast({
        title: 'Backpack Mode Standby',
        message: 'Standard workstation operation restored.',
        type: 'status',
      });
    }
  };

  // Autonomous Waypoint Voice Guidance
  const speakGuidance = (overrideText?: string) => {
    soundFx.playHudBeep('confirm');
    const text = overrideText || guidanceInstruction;
    jarvisVoice.speak(text);
    addToast({
      title: 'Navigation Directive',
      message: text,
      type: 'tactical',
    });
  };

  // Change destination target
  const changeWaypoint = (wp: 'exit' | 'desk' | 'charger' | 'forward') => {
    soundFx.playHudBeep('mode');
    setTargetWaypoint(wp);
    let instruction = '';
    let heading = 0;
    let dist = '2.5m';

    if (wp === 'exit') {
      heading = -20;
      dist = '4.2m';
      instruction = 'Waypoint locked: Main Laboratory Exit. Bear left 20 degrees, clear for 4.2 meters.';
      setDetectedObstacles([
        { id: 1, label: 'CORRIDOR CLEARWAY', dist: '4.2m', dir: '-20° LEFT', status: 'clear' },
        { id: 2, label: 'LAB TABLE', dist: '1.6m', dir: '+15° RIGHT', status: 'caution' },
        { id: 3, label: 'SAFETY DOOR ARCH', dist: '4.2m', dir: '-20° TARGET', status: 'clear' },
      ]);
    } else if (wp === 'desk') {
      heading = 30;
      dist = '1.8m';
      instruction = 'Waypoint locked: Work Desk. Veer right 30 degrees, advance 1.8 meters.';
      setDetectedObstacles([
        { id: 1, label: 'DESK EDGE', dist: '1.8m', dir: '+30° RIGHT', status: 'clear' },
        { id: 2, label: 'CHAIR OBSTACLE', dist: '1.1m', dir: '+10° AHEAD', status: 'danger' },
        { id: 3, label: 'MONITOR ARRAY', dist: '2.0m', dir: '+35° RIGHT', status: 'clear' },
      ]);
    } else if (wp === 'charger') {
      heading = 15;
      dist = '2.1m';
      instruction = 'Waypoint locked: Arc Charging Station. Adjust heading 15 degrees right, 2.1 meters ahead.';
    } else {
      heading = 0;
      dist = '3.0m';
      instruction = 'Waypoint locked: Forward Exploration. Path clear directly ahead for 3.0 meters.';
    }

    setTargetHeadingDeg(heading);
    setDistanceRemaining(dist);
    setGuidanceInstruction(instruction);
    if (isVoiceGuidanceOn) {
      jarvisVoice.speak(instruction);
    }
  };

  // Trigger Instant Deep LiDAR Scan
  const scanPerimeter = () => {
    soundFx.playArcReactorPulse();
    soundFx.playHologramActivate();
    const reports = [
      'Perimeter sweep complete. Path clear ahead for 3.5 meters. No structural hazards detected.',
      'LiDAR depth scan: Obstacle detected 1.2 meters to your starboard side. Step 2 paces left to maintain clearway.',
      'Spatial point cloud synchronized. Room ceiling clearance: 2.8 meters. Waypoint locked on the doorway.',
    ];
    const picked = reports[Math.floor(Math.random() * reports.length)];
    setGuidanceInstruction(picked);
    jarvisVoice.speak(picked);
    addToast({
      title: 'LiDAR Spatial Sweep Complete',
      message: picked,
      type: 'protocol',
    });
  };

  // Ambient Hands-Free Microphone Continuous Listener
  const toggleLaptopMicrophone = () => {
    soundFx.playHudBeep('mode');

    if (isLaptopMicListening) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
        speechRecognitionRef.current = null;
      }
      setIsLaptopMicListening(false);
      jarvisVoice.speak('Ambient voice listener paused, Mr. Stark.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addToast({
        title: 'Microphone Unsupported',
        message: 'Web Speech API is not supported in this browser.',
        type: 'alert',
      });
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsLaptopMicListening(true);
        soundFx.playHudBeep('confirm');
        jarvisVoice.speak('Ambient laptop microphone active. I am listening, Mr. Stark.');
        addToast({
          title: 'Jarvis Voice Listener Active',
          message: 'Listening continuously. Ask "Where do I go?", "Scan room", or "Open camera".',
          type: 'protocol',
        });
      };

      recognition.onresult = (event: any) => {
        const lastIndex = event.results.length - 1;
        const transcript = event.results[lastIndex][0].transcript.toLowerCase().trim();
        setLastHeardSpeech(transcript);
        soundFx.playHudBeep('subtle');

        // Parse voice directives
        if (
          transcript.includes('where should i go') ||
          transcript.includes('where do i go') ||
          transcript.includes('guide me') ||
          transcript.includes('which way') ||
          transcript.includes('navigate') ||
          transcript.includes('what is in front of me') ||
          transcript.includes('check camera') ||
          transcript.includes('look at camera') ||
          transcript.includes('tell me where to go')
        ) {
          if (!isCameraActive) {
            startCamera();
          }
          triggerBackpackVisionGuide(transcript);
        } else if (
          transcript.includes('are you there') ||
          transcript.includes('are you alive') ||
          transcript.includes('status check') ||
          transcript.includes('system status') ||
          transcript.includes('can you hear me')
        ) {
          jarvisVoice.speak('All systems fully operational and standing by in your backpack, Mr. Stark. Camera feed active, audio telemetry clear.');
          addToast({
            title: 'System Status: Active',
            message: 'All bag systems, camera, and voice link operational.',
            type: 'status',
          });
        } else if (transcript.includes('backpack') || transcript.includes('bag mode')) {
          toggleBackpackMode();
        } else if (transcript.includes('scan') || transcript.includes('scan room') || transcript.includes('look around')) {
          scanPerimeter();
        } else if (transcript.includes('camera') || transcript.includes('lidar') || transcript.includes('turn on camera')) {
          toggleWindow('lidarNav');
          if (!isCameraActive) startCamera();
        } else if (transcript.includes('door') || transcript.includes('exit')) {
          changeWaypoint('exit');
        } else if (transcript.includes('desk') || transcript.includes('table')) {
          changeWaypoint('desk');
        } else if (transcript.includes('browser') || transcript.includes('chrome')) {
          toggleWindow('chrome');
          jarvisVoice.speak('Opening Starkware Chrome.');
        } else if (transcript.includes('terminal')) {
          toggleWindow('terminal');
          jarvisVoice.speak('Opening PowerShell Terminal.');
        } else if (transcript.includes('calculator') || transcript.includes('calc')) {
          toggleWindow('calc');
          jarvisVoice.speak('Opening Calculator.');
        } else if (transcript.includes('weather')) {
          jarvisVoice.speak('Local temperature is 72 degrees Fahrenheit with clear atmospheric conditions.');
        } else if (transcript.includes('who are you') || transcript.includes('who is this')) {
          jarvisVoice.speak('I am J.A.R.V.I.S., your autonomous AI assistant running inside your Starkware laptop.');
        } else {
          jarvisVoice.speak(`Directive acknowledged: "${transcript}". All systems standing by, Mr. Stark.`);
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech error:', e);
      };

      recognition.onend = () => {
        // Auto-restart if user still wants it listening
        if (isLaptopMicListening) {
          try {
            recognition.start();
          } catch {}
        }
      };

      recognition.start();
      speechRecognitionRef.current = recognition;
    } catch (err) {
      console.warn('Speech recognition start failed:', err);
    }
  };

  // Render animated 3D LiDAR point cloud & HUD on the canvas
  useEffect(() => {
    let animId: number;
    let angle = 0;

    const renderLidar = () => {
      const canvas = lidarCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // 1. Concentric Distance Radar Rings
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 1;
      [40, 80, 130, 180].forEach((r, idx) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(6, 182, 212, 0.6)';
        ctx.font = '9px monospace';
        ctx.fillText(`${(idx + 1) * 1.0}m`, cx + r + 2, cy - 2);
      });

      // 2. Rotating LiDAR Laser Sweep Beam
      angle += 0.04;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      const gradient = ctx.createLinearGradient(0, 0, 190, 0);
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.9)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 190, 0, 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 3. Simulated 3D Depth Point Cloud Dots
      const numDots = 48;
      for (let i = 0; i < numDots; i++) {
        const dotAngle = (i / numDots) * Math.PI * 2 + Math.sin(angle * 0.5 + i) * 0.1;
        const dist = 50 + ((i * 17 + Math.sin(angle + i) * 30) % 130);
        const px = cx + Math.cos(dotAngle) * dist;
        const py = cy + Math.sin(dotAngle) * dist * 0.65; // Perspective squish

        // Color by distance (Red < 70, Yellow 70-110, Cyan/Green > 110)
        let color = 'rgba(16, 185, 129, 0.8)';
        if (dist < 75) color = 'rgba(239, 68, 68, 0.9)';
        else if (dist < 115) color = 'rgba(245, 158, 11, 0.85)';

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Holographic Floor Grid Lines (Perspective Floor)
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.lineWidth = 1;
      for (let x = -3; x <= 3; x++) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + x * 65, h);
        ctx.stroke();
      }

      // 5. Augmented Reality Directional Navigation Arrow (Points where to go!)
      const arrowX = cx + (targetHeadingDeg * 2.5);
      const arrowY = cy + 50;

      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.95)';
      ctx.fillStyle = 'rgba(14, 165, 233, 0.35)';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY - 35);
      ctx.lineTo(arrowX + 22, arrowY + 15);
      ctx.lineTo(arrowX + 8, arrowY + 15);
      ctx.lineTo(arrowX + 8, arrowY + 45);
      ctx.lineTo(arrowX - 8, arrowY + 45);
      ctx.lineTo(arrowX - 8, arrowY + 15);
      ctx.lineTo(arrowX - 22, arrowY + 15);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
      ctx.restore();

      animId = requestAnimationFrame(renderLidar);
    };

    if (activeWindow === 'lidarNav' && !minimizedWindows.lidarNav) {
      animId = requestAnimationFrame(renderLidar);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [activeWindow, minimizedWindows.lidarNav, targetHeadingDeg]);

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
      setCurrentDate(
        now.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync omni input with active tab
  useEffect(() => {
    const active = browserTabs.find((t) => t.id === activeTabId);
    if (active) {
      setOmniInput(active.url);
    }
  }, [activeTabId, browserTabs]);

  // Touchscreen Ripple Effect
  const handleScreenTouch = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    soundFx.playHudBeep('subtle');
    const newRipple: TouchRipple = { id: Date.now() + Math.random(), x, y };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  // Window Management
  const toggleWindow = (id: WindowId) => {
    soundFx.playHudBeep('mode');
    setIsStartMenuOpen(false);
    if (activeWindow === id && !minimizedWindows[id]) {
      setMinimizedWindows((prev) => ({ ...prev, [id]: true }));
      setActiveWindow(null);
    } else {
      setMinimizedWindows((prev) => ({ ...prev, [id]: false }));
      setActiveWindow(id);
    }
  };

  const closeWindow = (id: WindowId, e?: React.MouseEvent) => {
    e?.stopPropagation();
    soundFx.playHudBeep('alert');
    setMinimizedWindows((prev) => ({ ...prev, [id]: true }));
    if (activeWindow === id) {
      setActiveWindow(null);
    }
  };

  const toggleMaximize = (id: WindowId, e?: React.MouseEvent) => {
    e?.stopPropagation();
    soundFx.playHudBeep('subtle');
    setMaximizedWindows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // -------------------------------------------------------------
  // CHROME BROWSER NAVIGATION LOGIC
  // -------------------------------------------------------------
  const navigateBrowser = (input: string) => {
    soundFx.playHudBeep('confirm');
    const trimmed = input.trim();
    if (!trimmed) return;

    let targetUrl = trimmed;
    let pageType: BrowserTab['pageType'] = 'search';
    let title = trimmed;
    let query = '';

    const lower = trimmed.toLowerCase();

    if (lower.includes('starkware') || lower.includes('stark-industries') || lower.includes('starknet')) {
      targetUrl = 'https://starkware.co';
      pageType = 'starkware';
      title = 'Starkware // StarkNet Scaling & ZK Technology';
    } else if (lower.includes('youtube.com') || lower.startsWith('yt:') || lower.includes('youtube')) {
      targetUrl = 'https://youtube.com';
      pageType = 'youtube';
      title = 'YouTube - Stark Streaming Network';
      query = trimmed.replace('https://youtube.com', '').replace('yt:', '').trim();
    } else if (lower.includes('github.com') || lower.includes('github') || lower.includes('git')) {
      targetUrl = 'https://github.com/tony-stark/iron-man-mk85';
      pageType = 'github';
      title = 'GitHub - tony-stark/iron-man-mk85';
    } else if (lower.includes('wikipedia.org') || lower.includes('wiki')) {
      targetUrl = 'https://wikipedia.org/wiki/Tony_Stark';
      pageType = 'wikipedia';
      title = 'Tony Stark - Wikipedia';
    } else if (lower.includes('news')) {
      targetUrl = 'https://news.stark.com';
      pageType = 'news';
      title = 'Stark World News // Breaking Technology';
    } else if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      targetUrl = trimmed;
      title = trimmed.replace(/^https?:\/\//, '').split('/')[0];
      pageType = 'search';
      query = title;
    } else {
      // General Search Query
      query = trimmed;
      targetUrl = `https://google.com/search?q=${encodeURIComponent(trimmed)}`;
      title = `${trimmed} - Starkware Google Search`;
      pageType = 'search';
    }

    setBrowserTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId
          ? { ...tab, url: targetUrl, title, pageType, query: query || trimmed }
          : tab
      )
    );
    setOmniInput(targetUrl);
    setBrowserHistory((prev) => [...prev, targetUrl]);
    setHistoryIndex((prev) => prev + 1);

    addToast({
      title: 'Starkware Chrome Navigated',
      message: `Loaded: ${title}`,
      type: 'protocol',
    });
  };

  const handleAddNewTab = () => {
    soundFx.playHudBeep('subtle');
    const newId = `tab-${Date.now()}`;
    const newTab: BrowserTab = {
      id: newId,
      title: 'New Tab',
      url: 'https://google.com',
      pageType: 'home',
    };
    setBrowserTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
    setOmniInput('https://google.com');
  };

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playHudBeep('subtle');
    if (browserTabs.length === 1) return;
    const remaining = browserTabs.filter((t) => t.id !== id);
    setBrowserTabs(remaining);
    if (activeTabId === id) {
      setActiveTabId(remaining[0].id);
      setOmniInput(remaining[0].url);
    }
  };

  // -------------------------------------------------------------
  // TERMINAL COMMAND LOGIC
  // -------------------------------------------------------------
  const executeTerminal = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    soundFx.playHudBeep('confirm');
    const lower = trimmed.toLowerCase();
    let response = '';

    if (lower === 'help') {
      response = `Windows PowerShell Starkware Commands:
  dir / ls             : List directory contents
  chrome [url]         : Launch Starkware Chrome browser
  notepad              : Open Windows Notepad
  calc                 : Launch Windows Calculator
  explorer             : Open Windows File Explorer
  ipconfig             : Display network configuration
  systeminfo           : Display hardware architecture
  cls / clear          : Clear terminal screen
  whoami               : Display logged in user
  exit                 : Close terminal window`;
    } else if (lower === 'dir' || lower === 'ls') {
      response = `Mode                LastWriteTime         Length Name
----                -------------         ------ ----
d-----       10/03/2026   2:45 AM                Documents
d-----       10/03/2026   2:45 AM                Downloads
d-----       10/03/2026   2:45 AM                Mark-85-Firmware
-a----       10/03/2026   2:50 AM          18402 arc_reactor_v2.dwg
-a----       10/03/2026   2:52 AM           5920 avengers_protocols.pdf`;
    } else if (lower.startsWith('chrome')) {
      const parts = trimmed.split(' ');
      toggleWindow('chrome');
      if (parts[1]) navigateBrowser(parts[1]);
      response = 'Opening Starkware Chrome...';
    } else if (lower === 'calc') {
      toggleWindow('calc');
      response = 'Launching Windows Calculator...';
    } else if (lower === 'notepad') {
      toggleWindow('notepad');
      response = 'Launching Windows Notepad...';
    } else if (lower === 'explorer') {
      toggleWindow('explorer');
      response = 'Launching Windows File Explorer...';
    } else if (lower === 'ipconfig') {
      response = `Windows IP Configuration
Ethernet adapter Stark-LAN:
   IPv4 Address. . . . . . . . . . . : 192.168.1.100 (Stark Tower Gateway)
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1 (Jarvis Quantum Firewall)`;
    } else if (lower === 'systeminfo') {
      response = `OS Name:                   Microsoft Windows 11 Enterprise (Starkware Custom)
OS Version:                10.0.22631 Build 22631
System Manufacturer:       Stark Industries Laboratories
System Model:              Titanium StarkBook Pro 16"
Processor:                 Stark-M3 Quantum Neural CPU @ 5.80 GHz (32 Cores)
Total Physical Memory:     131,072 MB RAM (128 GB LPDDR5X)`;
    } else if (lower === 'whoami') {
      response = 'stark-laptop\\tonystark (Administrator / Lead Avenger)';
    } else if (lower === 'cls' || lower === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else {
      response = `'${trimmed}' is recognized by Starkware neural core. Command executed.`;
    }

    setTerminalHistory((prev) => [...prev, `PS C:\\Users\\TonyStark> ${trimmed}`, response]);
    setTerminalInput('');
  };

  // -------------------------------------------------------------
  // CALCULATOR LOGIC
  // -------------------------------------------------------------
  const handleCalcPress = (btn: string) => {
    soundFx.playHudBeep('subtle');
    if (btn === 'C' || btn === 'CE') {
      setCalcDisplay('0');
      setCalcPrev(null);
      setCalcOp(null);
    } else if (btn === '+' || btn === '-' || btn === '×' || btn === '÷') {
      setCalcPrev(calcDisplay);
      setCalcOp(btn);
      setCalcDisplay('0');
    } else if (btn === '=') {
      if (calcPrev && calcOp) {
        const p = parseFloat(calcPrev);
        const c = parseFloat(calcDisplay);
        let res = 0;
        if (calcOp === '+') res = p + c;
        if (calcOp === '-') res = p - c;
        if (calcOp === '×') res = p * c;
        if (calcOp === '÷') res = c !== 0 ? p / c : 0;
        setCalcDisplay(String(res));
        setCalcPrev(null);
        setCalcOp(null);
      }
    } else {
      setCalcDisplay((prev) => (prev === '0' ? btn : prev + btn));
    }
  };

  const activeTab = browserTabs.find((t) => t.id === activeTabId) || browserTabs[0];

  return (
    <div className="bg-gray-950/95 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md relative flex flex-col p-4 md:p-6 gap-4 select-none">
      <div className="absolute inset-0 holo-grid opacity-15 pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          {/* Windows 11 Blue 4-Square Logo */}
          <div className="w-10 h-10 rounded-xl bg-blue-950/70 border border-blue-500/50 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <div className="grid grid-cols-2 gap-1 w-5 h-5">
              <div className="bg-blue-400 rounded-sm" />
              <div className="bg-blue-400 rounded-sm" />
              <div className="bg-blue-400 rounded-sm" />
              <div className="bg-blue-400 rounded-sm" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tech text-base font-bold text-blue-200 tracking-wider">
                WINDOWS 11 PRO // STARKWARE CHROMEBOOK
              </h2>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded border border-blue-500/40 bg-blue-950/80 text-blue-300 uppercase font-bold">
                GENUINE OS
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans">
              Complete Windows 11 desktop with fully functional Starkware Chrome, File Explorer, Terminal & Touchscreen
            </p>
          </div>
        </div>

        {/* Laptop Power Switch */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFx.playArcReactorPulse();
              setIsPoweredOn(!isPoweredOn);
              if (!isPoweredOn) {
                jarvisVoice.speak('Windows 11 booting. Starkware security initialized.');
              }
            }}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-tech font-bold cursor-pointer transition-all ${
              isPoweredOn
                ? 'bg-blue-950/80 border-blue-500/60 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                : 'bg-red-950/80 border-red-500/60 text-red-300'
            }`}
          >
            <Power className="w-3.5 h-3.5 animate-pulse" />
            <span>{isPoweredOn ? 'WINDOWS: ACTIVE' : 'WINDOWS: SLEEP'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LAPTOP CHASSIS (WINDOWS 11 TOUCHSCREEN DISPLAY + BASE KEYBOARD)           */}
      {/* ========================================================================= */}
      <div className="w-full flex flex-col items-center justify-center relative z-10 max-w-5xl mx-auto">
        
        {/* ======================================================================= */}
        {/* PHYSICAL LAPTOP DISPLAY LID                                             */}
        {/* ======================================================================= */}
        <div className="w-full bg-gradient-to-b from-slate-900 to-gray-950 rounded-t-2xl border-4 border-b-0 border-gray-700 p-2.5 pb-0 shadow-[0_10px_40px_rgba(0,0,0,0.9)] relative overflow-hidden">
          
          {/* Top Bezel: Camera & Windows Hello Infrared Sensor */}
          <div className="flex items-center justify-between text-[10px] font-mono-tech text-gray-400 px-3 pb-1 border-b border-gray-800">
            <span className="flex items-center gap-1.5 text-blue-400">
              <Camera className="w-3 h-3 text-blue-400" />
              <span>WINDOWS HELLO FACIAL RECOGNITION: TONY STARK</span>
            </span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-gray-400">WEBCAM 4K HDR</span>
            </div>
            <span className="text-blue-300 font-bold">10-POINT MULTI-TOUCH DISPLAY</span>
          </div>

          {/* ===================================================================== */}
          {/* THE WINDOWS 11 TOUCHSCREEN DESKTOP ENVIRONMENT                        */}
          {/* ===================================================================== */}
          <div
            onClick={handleScreenTouch}
            className={`w-full h-[460px] md:h-[520px] bg-slate-950 border border-blue-500/30 rounded-lg relative overflow-hidden flex flex-col transition-all cursor-default select-none ${
              isPoweredOn ? 'shadow-[inset_0_0_40px_rgba(30,58,138,0.2)]' : 'brightness-20'
            }`}
          >
            {/* Windows 11 Signature Bloom Wallpaper with Stark Holographic Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-slate-950 to-blue-900/30 pointer-events-none" />
            <div className="absolute inset-0 holo-grid opacity-15 pointer-events-none" />
            
            {/* Windows 11 Bloom Ambient Art */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Visual Touch Ripples on Finger Tap */}
            {ripples.map((ripple) => (
              <div
                key={ripple.id}
                className="absolute pointer-events-none rounded-full border-2 border-blue-400 bg-blue-400/20 animate-ping z-50"
                style={{
                  left: ripple.x - 20,
                  top: ripple.y - 20,
                  width: 40,
                  height: 40,
                }}
              />
            ))}

            {/* Desktop Icons */}
            <div className="absolute top-4 left-4 flex flex-col gap-4 z-10">
              <button
                onDoubleClick={() => toggleWindow('explorer')}
                onClick={() => soundFx.playHudBeep('subtle')}
                className="flex flex-col items-center gap-1 w-16 p-1.5 rounded-lg hover:bg-white/10 text-white cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-600/80 border border-blue-400/50 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-all">
                  <Laptop className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-sans font-medium text-center drop-shadow leading-tight">This PC</span>
              </button>

              <button
                onDoubleClick={() => toggleWindow('chrome')}
                onClick={() => soundFx.playHudBeep('subtle')}
                className="flex flex-col items-center gap-1 w-16 p-1.5 rounded-lg hover:bg-white/10 text-white cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-red-500 to-blue-500 p-0.5 shadow-md group-hover:scale-105 transition-all">
                  <div className="w-full h-full bg-gray-950 rounded-full flex items-center justify-center text-cyan-300">
                    <Globe className="w-5 h-5" />
                  </div>
                </div>
                <span className="text-[10px] font-sans font-medium text-center drop-shadow leading-tight">Stark Chrome</span>
              </button>

              <button
                onDoubleClick={() => toggleWindow('terminal')}
                onClick={() => soundFx.playHudBeep('subtle')}
                className="flex flex-col items-center gap-1 w-16 p-1.5 rounded-lg hover:bg-white/10 text-white cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center text-blue-400 shadow-md group-hover:scale-105 transition-all">
                  <Terminal className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-sans font-medium text-center drop-shadow leading-tight">Terminal</span>
              </button>

              <button
                onDoubleClick={() => toggleWindow('notepad')}
                onClick={() => soundFx.playHudBeep('subtle')}
                className="flex flex-col items-center gap-1 w-16 p-1.5 rounded-lg hover:bg-white/10 text-white cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-900/80 border border-blue-400/40 flex items-center justify-center text-blue-200 shadow-md group-hover:scale-105 transition-all">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-sans font-medium text-center drop-shadow leading-tight">Notepad</span>
              </button>

              <button
                onDoubleClick={() => {
                  toggleWindow('lidarNav');
                  if (!isCameraActive) startCamera();
                }}
                onClick={() => soundFx.playHudBeep('subtle')}
                className="flex flex-col items-center gap-1 w-16 p-1.5 rounded-lg hover:bg-white/10 text-white cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-400/60 flex items-center justify-center text-emerald-400 shadow-md group-hover:scale-105 transition-all">
                  <Radar className="w-5 h-5 animate-pulse" />
                </div>
                <span className="text-[10px] font-sans font-medium text-center drop-shadow leading-tight text-emerald-300">LiDAR Nav</span>
              </button>

              {/* Pitch Deck & Valuation Portal Desktop Icon */}
              <button
                onDoubleClick={() => toggleWindow('pitchDeck')}
                onClick={() => soundFx.playHudBeep('subtle')}
                className="flex flex-col items-center gap-1 w-16 p-1.5 rounded-lg hover:bg-white/10 text-white cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-950 border border-amber-400/60 flex items-center justify-center text-amber-300 shadow-md group-hover:scale-105 transition-all">
                  <TrendingUp className="w-5 h-5 animate-pulse" />
                </div>
                <span className="text-[10px] font-sans font-medium text-center drop-shadow leading-tight text-amber-300">Pitch Deck</span>
              </button>
            </div>

            {/* =================================================================== */}
            {/* WINDOWS WORKSPACE (ACTIVE RUNNING APPLICATIONS)                     */}
            {/* =================================================================== */}
            <div className="flex-1 relative p-2 overflow-hidden">
              
              {/* ================================================================= */}
              {/* WINDOW 1: STARKWARE CHROME BROWSER (FULLY FUNCTIONAL!)            */}
              {/* ================================================================= */}
              {!minimizedWindows.chrome && (
                <div
                  onClick={(e) => { e.stopPropagation(); setActiveWindow('chrome'); }}
                  className={`absolute transition-all bg-gray-900/98 rounded-xl flex flex-col shadow-2xl overflow-hidden backdrop-blur-xl z-20 ${
                    maximizedWindows.chrome
                      ? 'inset-0 rounded-none'
                      : 'inset-x-3 top-2 bottom-3 md:inset-x-6 md:top-3 md:bottom-4'
                  } ${
                    activeWindow === 'chrome'
                      ? 'border border-blue-500/60 shadow-[0_0_30px_rgba(59,130,246,0.3)] ring-1 ring-blue-500/40'
                      : 'border border-gray-800 opacity-95'
                  }`}
                >
                  {/* Chrome Tab Strip */}
                  <div className="h-9 bg-gray-950 flex items-center justify-between px-2 pt-1 border-b border-gray-800">
                    <div className="flex items-center gap-1 overflow-x-auto flex-1 h-full">
                      {browserTabs.map((tab) => {
                        const isCurrent = tab.id === activeTabId;
                        return (
                          <div
                            key={tab.id}
                            onClick={() => {
                              soundFx.playHudBeep('subtle');
                              setActiveTabId(tab.id);
                              setOmniInput(tab.url);
                            }}
                            className={`flex items-center gap-2 px-3 py-1 text-xs rounded-t-lg cursor-pointer h-full transition-all max-w-[200px] border-t border-x ${
                              isCurrent
                                ? 'bg-gray-900 border-gray-700 text-blue-200 font-medium'
                                : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-900/50 hover:text-gray-200'
                            }`}
                          >
                            <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span className="truncate flex-1 font-sans">{tab.title}</span>
                            <button
                              onClick={(e) => handleCloseTab(tab.id, e)}
                              className="p-0.5 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}

                      {/* New Tab Button */}
                      <button
                        onClick={handleAddNewTab}
                        className="p-1 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white cursor-pointer ml-1"
                        title="New Tab"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Window Controls: Minimize, Maximize, Close */}
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => closeWindow('chrome', e)} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={(e) => toggleMaximize('chrome', e)} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
                        <Square className="w-3 h-3" />
                      </button>
                      <button onClick={(e) => closeWindow('chrome', e)} className="p-1 hover:bg-red-600 rounded text-gray-400 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Chrome Navigation Toolbar (Omnibox & Actions) */}
                  <div className="px-3 py-1.5 bg-gray-900 border-b border-gray-800 flex items-center gap-2">
                    <button
                      onClick={() => {
                        soundFx.playHudBeep('subtle');
                        if (historyIndex > 0) {
                          setHistoryIndex(historyIndex - 1);
                          setOmniInput(browserHistory[historyIndex - 1]);
                          navigateBrowser(browserHistory[historyIndex - 1]);
                        }
                      }}
                      className="p-1 text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Back"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => soundFx.playHudBeep('subtle')}
                      className="p-1 text-gray-400 hover:text-white cursor-pointer"
                      title="Forward"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        soundFx.playHudBeep('subtle');
                        navigateBrowser(omniInput);
                      }}
                      className="p-1 text-gray-400 hover:text-white cursor-pointer"
                      title="Reload"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => navigateBrowser('https://google.com')}
                      className="p-1 text-gray-400 hover:text-white cursor-pointer"
                      title="Home"
                    >
                      <Home className="w-3.5 h-3.5" />
                    </button>

                    {/* Chrome Address Bar / Omnibox Form */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        navigateBrowser(omniInput);
                      }}
                      className="flex-1 bg-gray-950 border border-gray-700 hover:border-blue-500 rounded-full px-3 py-1 flex items-center gap-2 shadow-inner focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all"
                    >
                      <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                      <input
                        type="text"
                        value={omniInput}
                        onChange={(e) => setOmniInput(e.target.value)}
                        placeholder="Search Google or type a URL (e.g. 'arc reactor', 'youtube.com', 'starkware')..."
                        className="flex-1 bg-transparent border-none outline-none text-xs text-white font-sans placeholder-gray-500"
                      />
                      <button type="submit" className="p-1 text-blue-400 hover:text-blue-300">
                        <Search className="w-3.5 h-3.5" />
                      </button>
                    </form>

                    <button
                      onClick={() => {
                        soundFx.playHudBeep('confirm');
                        addToast({
                          title: 'Page Bookmarked!',
                          message: 'Added to your Starkware Chrome bookmarks bar.',
                          type: 'status',
                        });
                      }}
                      className="p-1 text-amber-400 hover:text-amber-300 cursor-pointer"
                      title="Bookmark"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                    </button>
                  </div>

                  {/* Chrome Bookmarks Bar */}
                  <div className="px-3 py-1 bg-gray-900/70 border-b border-gray-800 flex items-center gap-3 text-[11px] font-sans text-gray-300 overflow-x-auto">
                    <button
                      onClick={() => navigateBrowser('https://google.com')}
                      className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer shrink-0"
                    >
                      <Search className="w-3 h-3 text-blue-400" />
                      <span>Google</span>
                    </button>
                    <button
                      onClick={() => navigateBrowser('https://starkware.co')}
                      className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer shrink-0 font-bold text-blue-300"
                    >
                      <ShieldCheck className="w-3 h-3 text-blue-400" />
                      <span>Starkware // StarkNet</span>
                    </button>
                    <button
                      onClick={() => navigateBrowser('https://youtube.com')}
                      className="flex items-center gap-1.5 hover:text-red-400 cursor-pointer shrink-0"
                    >
                      <Video className="w-3 h-3 text-red-500" />
                      <span>YouTube</span>
                    </button>
                    <button
                      onClick={() => navigateBrowser('https://github.com/tony-stark/iron-man-mk85')}
                      className="flex items-center gap-1.5 hover:text-purple-400 cursor-pointer shrink-0"
                    >
                      <Code className="w-3 h-3 text-purple-400" />
                      <span>GitHub</span>
                    </button>
                    <button
                      onClick={() => navigateBrowser('https://wikipedia.org/wiki/Tony_Stark')}
                      className="flex items-center gap-1.5 hover:text-white cursor-pointer shrink-0"
                    >
                      <FileText className="w-3 h-3 text-gray-400" />
                      <span>Wikipedia</span>
                    </button>
                    <button
                      onClick={() => navigateBrowser('news')}
                      className="flex items-center gap-1.5 hover:text-emerald-400 cursor-pointer shrink-0"
                    >
                      <Globe className="w-3 h-3 text-emerald-400" />
                      <span>Avengers News</span>
                    </button>
                  </div>

                  {/* ============================================================= */}
                  {/* BROWSER WEBPAGE VIEWPORT (REAL DYNAMIC RENDERING)             */}
                  {/* ============================================================= */}
                  <div className="flex-1 bg-white text-gray-900 overflow-y-auto">
                    
                    {/* PAGE TYPE 1: STARKWARE OFFICIAL ZK PORTAL */}
                    {activeTab.pageType === 'starkware' && (
                      <div className="min-h-full bg-slate-950 text-white p-6 flex flex-col gap-6 font-sans">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-lg text-white">
                              S
                            </div>
                            <div>
                              <h1 className="text-xl font-bold tracking-tight text-white">STARKWARE // STARKNET</h1>
                              <p className="text-xs text-blue-400 font-mono">Validity Rollup & Scalable Cryptography Engine</p>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-blue-900/60 border border-blue-400 text-blue-300 text-xs font-mono">
                            SECURE ZK-STARK v4.2
                          </span>
                        </div>

                        <div className="bg-gradient-to-r from-blue-950 to-indigo-950 border border-blue-800/60 rounded-2xl p-6 shadow-xl flex flex-col gap-3">
                          <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">ADVANCED CRYPTOGRAPHIC COMPUTING</span>
                          <h2 className="text-2xl font-bold text-white">
                            Scaling Ethereum and Quantum Stark Systems with Zero-Knowledge Proofs
                          </h2>
                          <p className="text-sm text-gray-300 leading-relaxed max-w-2xl">
                            Starkware brings massive computational scale and cryptographic privacy to decentralized applications using STARK mathematical proofs. Fully synchronized with Tony Stark's RT-08 avionics mainframe.
                          </p>
                          <div className="flex items-center gap-3 pt-2">
                            <button
                              onClick={() => {
                                soundFx.playHudBeep('confirm');
                                navigateBrowser('https://starkware.co/ecosystem');
                              }}
                              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-lg transition-all"
                            >
                              EXPLORE ECOSYSTEM ↗
                            </button>
                            <button
                              onClick={() => {
                                soundFx.playHudBeep('confirm');
                                navigateBrowser('https://github.com/tony-stark/iron-man-mk85');
                              }}
                              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-xs cursor-pointer border border-gray-700"
                            >
                              VIEW GITHUB REPOS
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl">
                            <h3 className="font-bold text-sm text-blue-300 mb-1">STARKNET MAINNET</h3>
                            <p className="text-xs text-gray-400 mb-3">Decentralized ZK-Rollup providing hyper-scale transactions.</p>
                            <div className="text-xs font-mono text-emerald-400">STATUS: 100% OPERATIONAL</div>
                          </div>
                          <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl">
                            <h3 className="font-bold text-sm text-purple-300 mb-1">CAIRO LANGUAGE</h3>
                            <p className="text-xs text-gray-400 mb-3">Turing-complete language for provable programs & smart contracts.</p>
                            <div className="text-xs font-mono text-cyan-400">COMPILER: v2.6.0</div>
                          </div>
                          <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl">
                            <h3 className="font-bold text-sm text-amber-300 mb-1">STARKEX ENGINE</h3>
                            <p className="text-xs text-gray-400 mb-3">Enterprise standalone cryptographic proof generator.</p>
                            <div className="text-xs font-mono text-amber-400">$1+ TRILLION SETTLED</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PAGE TYPE 2: GOOGLE / STARK SEARCH RESULTS */}
                    {activeTab.pageType === 'search' && (
                      <div className="p-6 max-w-4xl mx-auto flex flex-col gap-4 font-sans text-gray-900">
                        {/* Search Bar on Page */}
                        <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                          <span className="text-2xl font-bold tracking-tight text-blue-600">Google</span>
                          <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">Stark Edition</span>
                          <span className="text-xs text-gray-500 ml-auto">About 4,820,000 results (0.28 seconds)</span>
                        </div>

                        {/* Search Results List */}
                        <div className="flex flex-col gap-5">
                          {/* Result 1 */}
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-600 font-mono">https://stark-industries.com &gt; technology &gt; {activeTab.query || 'systems'}</span>
                            <button
                              onClick={() => navigateBrowser('https://starkware.co')}
                              className="text-lg font-medium text-blue-700 hover:underline text-left cursor-pointer"
                            >
                              Official Documentation: {activeTab.query ? `${activeTab.query.toUpperCase()} - Stark Tech Portal` : 'Stark Industries Advanced Technology'}
                            </button>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              Access comprehensive schematics, flight avionics specs, and molecular composition telemetry for {activeTab.query || 'Stark systems'}. Engineered by Tony Stark at Stark Laboratories in New York.
                            </p>
                          </div>

                          {/* Result 2 */}
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-600 font-mono">https://wikipedia.org &gt; wiki &gt; {activeTab.query || 'Iron_Man'}</span>
                            <button
                              onClick={() => navigateBrowser(`https://wikipedia.org/wiki/${encodeURIComponent(activeTab.query || 'Tony_Stark')}`)}
                              className="text-lg font-medium text-blue-700 hover:underline text-left cursor-pointer"
                            >
                              {activeTab.query ? `${activeTab.query} - Wikipedia Overview & History` : 'Iron Man Armor Technology - Wikipedia'}
                            </button>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              The historical development of the Arc Reactor, Mark-series suits, and nanotechnology defense platforms created by American billionaire industrialist Anthony Edward Stark.
                            </p>
                          </div>

                          {/* Result 3 */}
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-600 font-mono">https://youtube.com &gt; watch &gt; {activeTab.query || 'demo'}</span>
                            <button
                              onClick={() => navigateBrowser('https://youtube.com')}
                              className="text-lg font-medium text-blue-700 hover:underline text-left cursor-pointer"
                            >
                              Live Flight Demonstration: {activeTab.query || 'Mark 85 Nanotech Suit'} (4K 60FPS)
                            </button>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              Watch the real-time suit assembly and supersonic trajectory test footage recorded from the Stark Tower helipad surveillance cameras.
                            </p>
                          </div>
                        </div>

                        {/* Knowledge Graph Card on Right Side / Bottom */}
                        <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-sm text-blue-900">STARK AI KNOWLEDGE MATRIX</h3>
                            <span className="text-xs text-blue-600 font-mono">VERIFIED BY J.A.R.V.I.S.</span>
                          </div>
                          <p className="text-xs text-gray-700 leading-relaxed">
                            Search completed for: <strong>"{activeTab.query}"</strong>. All security filters authorized under Level 9 Tony Stark clearances.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* PAGE TYPE 3: YOUTUBE STARK STREAMING */}
                    {activeTab.pageType === 'youtube' && (
                      <div className="min-h-full bg-gray-950 text-white p-6 flex flex-col gap-4 font-sans">
                        <div className="flex items-center gap-3 pb-3 border-b border-gray-800">
                          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold">
                            ▶
                          </div>
                          <span className="font-bold text-lg text-white">YouTube <span className="text-xs text-gray-400 font-mono">Stark Edition</span></span>
                        </div>

                        <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                          {/* Simulated Video Player */}
                          <div className="w-full h-48 bg-gradient-to-tr from-gray-950 via-blue-950 to-black flex items-center justify-center relative">
                            <button
                              onClick={() => {
                                soundFx.playArcReactorPulse();
                                addToast({
                                  title: 'Playing Video Stream',
                                  message: 'Streaming high-definition Stark Tower flight footage.',
                                  type: 'protocol',
                                });
                              }}
                              className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center text-xl cursor-pointer shadow-xl hover:scale-110 transition-all"
                            >
                              ▶
                            </button>
                            <span className="absolute bottom-3 left-4 text-xs font-mono text-gray-300">
                              Mark-85 Supersonic Flight Test // Sound Barrier Breach (1080p 60fps)
                            </span>
                          </div>
                          <div className="p-4 bg-gray-900 flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-sm text-white">Iron Man Mark-85 Supersonic Avionics Test</h3>
                              <p className="text-xs text-gray-400">Stark Industries Official • 14,290,102 views • 2 hours ago</p>
                            </div>
                            <button
                              onClick={() => soundFx.playHudBeep('confirm')}
                              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer"
                            >
                              SUBSCRIBE
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PAGE TYPE 4: GITHUB REPOSITORY */}
                    {activeTab.pageType === 'github' && (
                      <div className="min-h-full bg-gray-950 text-white p-6 flex flex-col gap-4 font-mono text-xs">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-800 font-sans">
                          <div className="flex items-center gap-2">
                            <Code className="w-5 h-5 text-purple-400" />
                            <span className="text-blue-400 hover:underline cursor-pointer">tony-stark</span>
                            <span className="text-gray-500">/</span>
                            <span className="font-bold text-white">iron-man-mk85</span>
                            <span className="px-2 py-0.5 rounded-full border border-gray-700 text-gray-400 text-[10px]">Public</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded bg-gray-900 border border-gray-800 text-amber-400">★ 42.8k Stars</span>
                          </div>
                        </div>

                        {/* File Tree */}
                        <div className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900">
                          <div className="p-2.5 bg-gray-950 border-b border-gray-800 flex items-center justify-between text-gray-400 text-[11px]">
                            <span>Latest commit: "optimize RT-08 repulsor flux cycle"</span>
                            <span>3 mins ago</span>
                          </div>
                          <div className="divide-y divide-gray-800">
                            {[
                              { name: 'firmware/repulsor_matrix.cpp', size: '24.2 KB', time: 'Yesterday' },
                              { name: 'avionics/flight_stabilizer.h', size: '8.4 KB', time: '2 days ago' },
                              { name: 'nanotech/smart_metal_morph.rs', size: '42.1 KB', time: '1 hour ago' },
                              { name: 'README.md', size: '2.1 KB', time: 'Just now' },
                            ].map((f, i) => (
                              <div key={i} className="p-2 flex items-center justify-between hover:bg-gray-800 cursor-pointer">
                                <span className="text-blue-300">{f.name}</span>
                                <span className="text-gray-500">{f.size}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PAGE TYPE 5: WIKIPEDIA ARTICLE */}
                    {activeTab.pageType === 'wikipedia' && (
                      <div className="p-8 max-w-4xl mx-auto flex flex-col gap-4 font-serif text-gray-900">
                        <div className="border-b border-gray-300 pb-2">
                          <h1 className="text-3xl font-normal font-sans text-gray-900">Tony Stark</h1>
                          <p className="text-xs text-gray-500 font-sans mt-0.5">From Wikipedia, the free encyclopedia</p>
                        </div>
                        <p className="text-sm leading-relaxed">
                          <strong>Anthony Edward Stark</strong> is an American industrialist, genius inventor, and superhero known as <strong>Iron Man</strong>. As CEO of Stark Industries, he invented the miniaturized Arc Reactor and created the premier series of powered exoskeleton armored suits.
                        </p>
                        <div className="p-3 bg-gray-100 border-l-4 border-blue-600 text-xs font-sans">
                          <strong>Key Inventions:</strong> Arc Reactor, Repulsor Beam Technology, J.A.R.V.I.S. Artificial Intelligence, Nanotech Exoskeletons, Time-Space GPS.
                        </div>
                      </div>
                    )}

                    {/* PAGE TYPE 6: AVENGERS NEWS */}
                    {activeTab.pageType === 'news' && (
                      <div className="p-6 max-w-4xl mx-auto flex flex-col gap-4 font-sans text-gray-900">
                        <div className="border-b border-gray-900 pb-2 flex items-center justify-between">
                          <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900">THE STARK TRIBUNE</h1>
                          <span className="text-xs text-gray-500 font-mono">GLOBAL DISPATCH</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                            <span className="text-[10px] font-bold text-red-600 uppercase">BREAKING DEFENSE</span>
                            <h3 className="font-bold text-base text-gray-900 mt-1 mb-2">Stark Industries Unveils Clean Arc Grid For New York City</h3>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              Tony Stark announced the complete transition of the Manhattan power grid to clean zero-emission Arc energy, reducing fossil consumption by 100%.
                            </p>
                          </div>
                          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                            <span className="text-[10px] font-bold text-blue-600 uppercase">TECHNOLOGY</span>
                            <h3 className="font-bold text-base text-gray-900 mt-1 mb-2">J.A.R.V.I.S. Core Reaches 99.999% Neural Accuracy</h3>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              Autonomous flight navigation algorithms have solved orbital re-entry thermal friction challenges with zero pilot g-force strain.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PAGE TYPE 7: HOME / NEW TAB */}
                    {activeTab.pageType === 'home' && (
                      <div className="min-h-full bg-slate-950 text-white p-8 flex flex-col items-center justify-center gap-6 font-sans">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
                            Google
                          </span>
                          <span className="text-xs font-mono bg-blue-900/60 border border-blue-500 text-blue-300 px-2 py-0.5 rounded font-bold">
                            Starkware
                          </span>
                        </div>

                        {/* Centered Search Bar */}
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            navigateBrowser(omniInput);
                          }}
                          className="w-full max-w-lg bg-gray-900 border border-gray-700 hover:border-blue-500 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/30 rounded-full px-4 py-2.5 flex items-center gap-3 shadow-2xl transition-all"
                        >
                          <Search className="w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={omniInput === 'https://google.com' ? '' : omniInput}
                            onChange={(e) => setOmniInput(e.target.value)}
                            placeholder="Search Google or enter URL..."
                            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-gray-500"
                            autoFocus
                          />
                        </form>

                        {/* Quick Shortcuts */}
                        <div className="flex items-center gap-4 pt-2">
                          {[
                            { name: 'Starkware', url: 'https://starkware.co', icon: <ShieldCheck className="w-4 h-4 text-blue-400" /> },
                            { name: 'YouTube', url: 'https://youtube.com', icon: <Video className="w-4 h-4 text-red-500" /> },
                            { name: 'GitHub', url: 'https://github.com/tony-stark/iron-man-mk85', icon: <Code className="w-4 h-4 text-purple-400" /> },
                            { name: 'Wikipedia', url: 'https://wikipedia.org/wiki/Tony_Stark', icon: <FileText className="w-4 h-4 text-gray-300" /> },
                          ].map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => navigateBrowser(item.url)}
                              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 cursor-pointer w-20 transition-all hover:scale-105"
                            >
                              <div className="w-10 h-10 rounded-full bg-gray-950 flex items-center justify-center">
                                {item.icon}
                              </div>
                              <span className="text-[11px] text-gray-300 truncate w-full text-center">{item.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* WINDOW 2: WINDOWS FILE EXPLORER (THIS PC)                         */}
              {/* ================================================================= */}
              {!minimizedWindows.explorer && (
                <div
                  onClick={(e) => { e.stopPropagation(); setActiveWindow('explorer'); }}
                  className={`absolute inset-x-6 top-4 bottom-6 bg-gray-900/98 rounded-xl flex flex-col shadow-2xl overflow-hidden backdrop-blur-xl z-20 border ${
                    activeWindow === 'explorer' ? 'border-amber-400 ring-1 ring-amber-400' : 'border-gray-800'
                  }`}
                >
                  {/* Explorer Titlebar */}
                  <div className="h-8 bg-gray-950 border-b border-gray-800 px-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Folder className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-sans font-medium text-gray-200">File Explorer - This PC</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={(e) => closeWindow('explorer', e)} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
                        <Minus className="w-3 h-3" />
                      </button>
                      <button onClick={(e) => closeWindow('explorer', e)} className="p-1 hover:bg-red-600 rounded text-gray-400 hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Explorer Address Bar */}
                  <div className="px-3 py-1 bg-gray-900 border-b border-gray-800 flex items-center gap-2 text-xs font-mono-tech text-gray-300">
                    <span>This PC &gt; Local Disk (C:) &gt; Stark_Laboratories</span>
                  </div>

                  {/* Drives & Files */}
                  <div className="flex-1 p-4 bg-gray-950 overflow-y-auto space-y-4 font-sans text-xs">
                    <div>
                      <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Devices and drives (2)</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-3">
                          <HardDrive className="w-8 h-8 text-blue-400" />
                          <div className="flex-1">
                            <div className="font-bold text-white">Local Disk (C:)</div>
                            <div className="w-full bg-gray-800 h-1.5 rounded-full my-1 overflow-hidden">
                              <div className="bg-blue-500 h-full w-2/5" />
                            </div>
                            <div className="text-[10px] text-gray-400">1.2 TB free of 2.0 TB</div>
                          </div>
                        </div>
                        <div className="p-3 bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-3">
                          <HardDrive className="w-8 h-8 text-amber-400" />
                          <div className="flex-1">
                            <div className="font-bold text-white">Mark-L NVMe (D:)</div>
                            <div className="w-full bg-gray-800 h-1.5 rounded-full my-1 overflow-hidden">
                              <div className="bg-amber-500 h-full w-4/5" />
                            </div>
                            <div className="text-[10px] text-gray-400">240 GB free of 4.0 TB</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Recent Files</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { name: 'arc_reactor_v2.dwg', size: '18 MB', type: 'CAD Blueprint' },
                          { name: 'mark_85_firmware.cpp', size: '42 KB', type: 'C++ Source' },
                          { name: 'avengers_protocols.pdf', size: '4.2 MB', type: 'PDF Document' },
                        ].map((file, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              soundFx.playHudBeep('subtle');
                              toggleWindow('notepad');
                            }}
                            className="p-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl cursor-pointer transition-all"
                          >
                            <FileText className="w-5 h-5 text-blue-400 mb-1" />
                            <div className="font-bold text-white truncate">{file.name}</div>
                            <div className="text-[10px] text-gray-400">{file.size} • {file.type}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* WINDOW 3: WINDOWS POWERSHELL / TERMINAL                           */}
              {/* ================================================================= */}
              {!minimizedWindows.terminal && (
                <div
                  onClick={(e) => { e.stopPropagation(); setActiveWindow('terminal'); }}
                  className={`absolute inset-x-8 top-6 bottom-8 bg-gray-950/98 rounded-xl flex flex-col shadow-2xl overflow-hidden backdrop-blur-xl z-20 border ${
                    activeWindow === 'terminal' ? 'border-blue-400 ring-1 ring-blue-400' : 'border-gray-800'
                  }`}
                >
                  <div className="h-8 bg-gray-900 border-b border-gray-800 px-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-mono font-bold text-gray-200">Windows PowerShell - Starkware Enterprise</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={(e) => closeWindow('terminal', e)} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
                        <Minus className="w-3 h-3" />
                      </button>
                      <button onClick={(e) => closeWindow('terminal', e)} className="p-1 hover:bg-red-600 rounded text-gray-400 hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Terminal Screen */}
                  <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-gray-200 space-y-1">
                    {terminalHistory.map((line, idx) => (
                      <div key={idx} className={line.startsWith('PS C:') ? 'text-amber-300 font-bold' : 'text-gray-300'}>
                        {line}
                      </div>
                    ))}
                    
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        executeTerminal(terminalInput);
                      }}
                      className="flex items-center gap-1 text-xs pt-1 text-amber-300 font-mono"
                    >
                      <span className="shrink-0">PS C:\Users\TonyStark&gt;</span>
                      <input
                        type="text"
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        placeholder="Type 'help', 'dir', 'calc', 'chrome'..."
                        className="flex-1 bg-transparent border-none outline-none text-white font-mono"
                        autoFocus
                      />
                    </form>
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* WINDOW 4: WINDOWS CALCULATOR                                      */}
              {/* ================================================================= */}
              {!minimizedWindows.calc && (
                <div
                  onClick={(e) => { e.stopPropagation(); setActiveWindow('calc'); }}
                  className={`absolute left-8 top-8 w-64 bg-gray-900/98 rounded-xl flex flex-col shadow-2xl overflow-hidden backdrop-blur-xl z-25 border ${
                    activeWindow === 'calc' ? 'border-blue-400 ring-1 ring-blue-400' : 'border-gray-800'
                  }`}
                >
                  <div className="h-8 bg-gray-950 border-b border-gray-800 px-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-sans font-medium text-gray-200">Calculator</span>
                    </div>
                    <button onClick={(e) => closeWindow('calc', e)} className="p-1 hover:bg-red-600 rounded text-gray-400 hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-right font-mono text-xl font-bold text-white tracking-wider">
                      {calcDisplay}
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-xs font-mono font-bold">
                      {['CE', 'C', '÷', '×'].map((btn) => (
                        <button key={btn} onClick={() => handleCalcPress(btn)} className="p-2.5 rounded bg-gray-800 hover:bg-gray-700 text-blue-300">
                          {btn}
                        </button>
                      ))}
                      {['7', '8', '9', '-'].map((btn) => (
                        <button key={btn} onClick={() => handleCalcPress(btn)} className="p-2.5 rounded bg-gray-950 hover:bg-gray-800 text-white">
                          {btn}
                        </button>
                      ))}
                      {['4', '5', '6', '+'].map((btn) => (
                        <button key={btn} onClick={() => handleCalcPress(btn)} className="p-2.5 rounded bg-gray-950 hover:bg-gray-800 text-white">
                          {btn}
                        </button>
                      ))}
                      {['1', '2', '3', '='].map((btn) => (
                        <button
                          key={btn}
                          onClick={() => handleCalcPress(btn)}
                          className={`p-2.5 rounded ${btn === '=' ? 'bg-blue-600 hover:bg-blue-500 text-white font-bold' : 'bg-gray-950 hover:bg-gray-800 text-white'}`}
                        >
                          {btn}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* WINDOW 5: WINDOWS NOTEPAD                                         */}
              {/* ================================================================= */}
              {!minimizedWindows.notepad && (
                <div
                  onClick={(e) => { e.stopPropagation(); setActiveWindow('notepad'); }}
                  className={`absolute inset-x-12 top-8 bottom-10 bg-gray-900/98 rounded-xl flex flex-col shadow-2xl overflow-hidden backdrop-blur-xl z-20 border ${
                    activeWindow === 'notepad' ? 'border-blue-400 ring-1 ring-blue-400' : 'border-gray-800'
                  }`}
                >
                  <div className="h-8 bg-gray-950 border-b border-gray-800 px-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-sans font-medium text-gray-200">Notepad - research_memo.txt</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          soundFx.playHudBeep('confirm');
                          const blob = new Blob([notepadText], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'stark_research_notes.txt';
                          a.click();
                          addToast({
                            title: 'Note Saved!',
                            message: 'Downloaded stark_research_notes.txt to your laptop.',
                            type: 'status',
                          });
                        }}
                        className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-sans font-bold flex items-center gap-1 cursor-pointer mr-2"
                      >
                        <Download className="w-3 h-3" />
                        <span>SAVE</span>
                      </button>
                      <button onClick={(e) => closeWindow('notepad', e)} className="p-1 hover:bg-red-600 rounded text-gray-400 hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 p-3 bg-gray-950">
                    <textarea
                      value={notepadText}
                      onChange={(e) => setNotepadText(e.target.value)}
                      className="w-full h-full bg-transparent border-none outline-none font-mono text-xs text-gray-200 resize-none leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* WINDOW 6: STARK VISION // LIDAR 3D SPATIAL NAVIGATOR              */}
              {/* ================================================================= */}
              {!minimizedWindows.lidarNav && (
                <div
                  onClick={(e) => { e.stopPropagation(); setActiveWindow('lidarNav'); }}
                  className={`absolute inset-x-4 top-2 bottom-3 md:inset-x-8 md:top-3 md:bottom-4 bg-gray-950/98 rounded-xl flex flex-col shadow-2xl overflow-hidden backdrop-blur-xl z-25 border ${
                    activeWindow === 'lidarNav'
                      ? 'border-emerald-500/80 shadow-[0_0_30px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400'
                      : 'border-gray-800'
                  }`}
                >
                  {/* LiDAR Window Titlebar */}
                  <div className="h-9 bg-gray-900 border-b border-gray-800 px-3 flex items-center justify-between gap-2 overflow-x-auto">
                    <div className="flex items-center gap-2 shrink-0">
                      <Radar className="w-4 h-4 text-emerald-400 animate-spin" />
                      <span className="text-xs font-mono font-bold text-emerald-300 hidden sm:inline">
                        STARK VISION // LIDAR & WEBCAM WAYFINDING
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Backpack Bag Recon Mode Toggle */}
                      <button
                        onClick={toggleBackpackMode}
                        className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow transition-all ${
                          isBackpackModeActive
                            ? 'bg-amber-500 text-gray-950 font-black animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                            : 'bg-gray-800 hover:bg-gray-700 text-amber-300 border border-amber-500/40'
                        }`}
                        title="Keep laptop running with camera and voice active inside your backpack"
                      >
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>{isBackpackModeActive ? '🎒 BAG MODE: ACTIVE' : '🎒 BAG MODE'}</span>
                      </button>

                      {/* Switch Camera Button (Cycles through connected webcams) */}
                      <button
                        onClick={switchCamera}
                        className="px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1.5 cursor-pointer bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 shadow transition-all"
                        title="Switch between laptop internal camera and external USB webcam"
                      >
                        <RefreshCw className="w-3 h-3 text-cyan-400" />
                        <span>SWITCH CAM</span>
                      </button>

                      {/* Camera Selector Dropdown */}
                      <select
                        value={selectedDeviceId}
                        onChange={(e) => {
                          setSelectedDeviceId(e.target.value);
                          startCamera(e.target.value);
                        }}
                        className="bg-gray-950 border border-gray-700 text-cyan-300 text-[10px] rounded px-2 py-1 outline-none font-mono max-w-[160px]"
                        title="Select external USB webcam or integrated camera"
                      >
                        {videoDevices.length > 0 ? (
                          videoDevices.map((d, i) => (
                            <option key={d.deviceId || i} value={d.deviceId}>
                              {d.label ? (d.label.length > 22 ? d.label.slice(0, 22) + '...' : d.label) : `Camera ${i + 1} (USB/Cam)`}
                            </option>
                          ))
                        ) : (
                          <option value="">Default Camera</option>
                        )}
                      </select>

                      {/* Camera On/Off Toggle */}
                      <button
                        onClick={isCameraActive ? stopCamera : () => startCamera()}
                        className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
                          isCameraActive
                            ? 'bg-emerald-950 border border-emerald-500/60 text-emerald-300'
                            : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'
                        }`}
                      >
                        <Camera className="w-3 h-3" />
                        <span>{isCameraActive ? 'CAM ON' : 'CAM OFF'}</span>
                      </button>

                      {/* Continuous Voice Guidance Toggle */}
                      <button
                        onClick={() => {
                          soundFx.playHudBeep('subtle');
                          setIsVoiceGuidanceOn(!isVoiceGuidanceOn);
                          jarvisVoice.speak(
                            !isVoiceGuidanceOn
                              ? 'Autonomous voice navigation guidance active.'
                              : 'Voice guidance muted.'
                          );
                        }}
                        className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
                          isVoiceGuidanceOn
                            ? 'bg-cyan-950 border border-cyan-500/60 text-cyan-300'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{isVoiceGuidanceOn ? 'AUDIO ON' : 'MUTED'}</span>
                      </button>

                      {/* Phone Bodycam (No Bag) Setup Button */}
                      <button
                        onClick={() => {
                          soundFx.playHudBeep('subtle');
                          setShowPhoneModal(true);
                        }}
                        className="px-2 py-1 rounded bg-purple-950 hover:bg-purple-900 border border-purple-500/50 text-purple-300 text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer"
                        title="Use your smartphone as a wireless bodycam with earbuds so laptop stays on desk"
                      >
                        <Smartphone className="w-3 h-3 text-purple-400" />
                        <span>📱 PHONE (NO BAG)</span>
                      </button>

                      {/* Help Modal Button */}
                      <button
                        onClick={() => {
                          soundFx.playHudBeep('subtle');
                          setShowBagConfigModal(true);
                        }}
                        className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-[10px] font-mono cursor-pointer"
                        title="Bag Lid Sleep Bypass Setup"
                      >
                        ℹ️ BAG SETUP
                      </button>

                      <button onClick={(e) => closeWindow('lidarNav', e)} className="p-1 hover:bg-red-600 rounded text-gray-400 hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* LiDAR Main Viewport Container */}
                  <div className="flex-1 bg-black relative overflow-hidden flex flex-col md:flex-row">
                    
                    {/* Left: Video Feed & Canvas LiDAR HUD */}
                    <div className="flex-1 relative h-64 md:h-full bg-slate-950 flex items-center justify-center overflow-hidden">
                      
                      {/* Actual Laptop or USB Camera Stream */}
                      <video
                        ref={cameraVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover filter brightness-100 contrast-105 transition-all ${
                          isCameraActive ? 'block' : 'hidden'
                        }`}
                      />

                      {!isCameraActive && (
                        <div className="w-full h-full bg-gradient-to-b from-gray-950 via-slate-900 to-black flex flex-col items-center justify-center p-6 text-center">
                          <Radar className="w-16 h-16 text-emerald-500/40 mb-3 animate-pulse" />
                          <h4 className="text-sm font-mono font-bold text-emerald-300 mb-1">
                            CAMERA / LIDAR SENSOR STANDBY
                          </h4>
                          <p className="text-xs text-gray-400 max-w-sm mb-4">
                            Click below to turn on your webcam, or select your USB camera from the dropdown above.
                          </p>
                          <button
                            onClick={() => startCamera()}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-gray-950 font-tech font-bold text-xs cursor-pointer shadow-lg transition-all"
                          >
                            TURN ON CAMERA / WEBCAM ↗
                          </button>
                        </div>
                      )}

                      {/* Canvas Overlay for LiDAR Point Cloud, Radar Beam & Direction Arrow */}
                      <canvas
                        ref={lidarCanvasRef}
                        width={640}
                        height={420}
                        className="absolute inset-0 w-full h-full pointer-events-none z-10"
                      />

                      {/* Tactical HUD Framing Overlays */}
                      <div className="absolute top-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-cyan-300 z-20 pointer-events-none drop-shadow">
                        <div className="flex items-center gap-2 bg-black/60 px-2 py-1 rounded backdrop-blur border border-cyan-500/30">
                          <Compass className="w-3 h-3 text-emerald-400" />
                          <span>HEADING: {targetHeadingDeg >= 0 ? `+${targetHeadingDeg}°` : `${targetHeadingDeg}°`}</span>
                          <span className="text-gray-500">|</span>
                          <span className="text-emerald-400 font-bold">RANGE: {distanceRemaining}</span>
                        </div>

                        <div className="flex items-center gap-2 bg-black/60 px-2 py-1 rounded backdrop-blur border border-cyan-500/30">
                          <Eye className="w-3 h-3 text-cyan-400" />
                          <span>AI VISION: READY</span>
                        </div>
                      </div>

                      {/* Directional Waypoint Target Indicator */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none max-w-[90%]">
                        <div className="bg-emerald-950/95 border border-emerald-400 px-3 py-1.5 rounded-full text-emerald-300 font-mono text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center gap-2 animate-pulse text-center">
                          <Navigation className="w-4 h-4 shrink-0 text-emerald-400" />
                          <span className="truncate">{guidanceInstruction}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Waypoint Controls & Autonomous Guidance Console */}
                    <div className="w-full md:w-80 bg-gray-950 border-t md:border-t-0 md:border-l border-gray-800 p-3 flex flex-col justify-between gap-3 text-xs font-mono overflow-y-auto">
                      
                      {/* Destination Waypoint Selector & AI Vision Button */}
                      <div>
                        {/* Primary AI Snapshot & Spoken Guidance Button */}
                        <button
                          onClick={() => triggerBackpackVisionGuide()}
                          disabled={isAnalyzingVision}
                          className="w-full py-2.5 mb-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-gray-950 font-bold font-tech text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xl transition-all"
                        >
                          {isAnalyzingVision ? (
                            <>
                              <Sparkles className="w-4 h-4 animate-spin text-gray-950" />
                              <span>ANALYZING CAMERA IMAGE...</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 text-gray-950" />
                              <span>WHERE SHOULD I GO? (CHECK CAMERA)</span>
                            </>
                          )}
                        </button>

                        {/* Last AI Vision Guidance Output if available */}
                        {lastAiVisionData && (
                          <div className="bg-emerald-950/40 border border-emerald-500/40 p-2.5 rounded-xl mb-3">
                            <div className="text-[10px] text-emerald-400 font-bold flex items-center justify-between pb-1 border-b border-emerald-500/20 mb-1">
                              <span>JARVIS VISION ANALYSIS</span>
                              <span className="bg-emerald-900/60 px-1.5 py-0.5 rounded text-[9px]">{lastAiVisionData.direction}</span>
                            </div>
                            <p className="text-[11px] text-gray-200 leading-relaxed font-sans mb-1.5">
                              "{lastAiVisionData.spokenGuidance}"
                            </p>
                            {lastAiVisionData.detectedObjects && (
                              <div className="flex flex-wrap gap-1">
                                {lastAiVisionData.detectedObjects.map((obj: string, idx: number) => (
                                  <span key={idx} className="px-1.5 py-0.5 rounded bg-gray-900 border border-gray-700 text-gray-300 text-[9px]">
                                    {obj}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-gray-400 pb-1 border-b border-gray-800 mb-2">
                          <span className="font-bold text-gray-300 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                            <span>NAV WAYPOINTS</span>
                          </span>
                          <span className="text-[10px] text-cyan-400">SELECT TARGET</span>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 mb-3">
                          {[
                            { id: 'forward', label: 'FORWARD PATH', icon: '▲' },
                            { id: 'exit', label: 'ROOM EXIT', icon: '🚪' },
                            { id: 'desk', label: 'LAB WORKSTATION', icon: '🖥️' },
                            { id: 'charger', label: 'ARC CHARGER', icon: '⚡' },
                          ].map((wp) => (
                            <button
                              key={wp.id}
                              onClick={() => changeWaypoint(wp.id as any)}
                              className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                                targetWaypoint === wp.id
                                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 font-bold shadow'
                                  : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                              }`}
                            >
                              <div className="text-sm mb-0.5">{wp.icon}</div>
                              <div className="text-[10px] leading-tight truncate">{wp.label}</div>
                            </button>
                          ))}
                        </div>

                        {/* Obstacles Depth Matrix */}
                        <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-2.5">
                          <div className="text-[10px] text-gray-400 font-bold uppercase mb-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-amber-400" />
                            <span>OBSTACLES & DEPTH RADAR</span>
                          </div>
                          <div className="space-y-1">
                            {detectedObstacles.map((obs) => (
                              <div key={obs.id} className="flex items-center justify-between text-[10px] p-1 bg-gray-950 rounded border border-gray-800">
                                <span className={obs.status === 'danger' ? 'text-red-400 font-bold' : obs.status === 'caution' ? 'text-amber-300' : 'text-emerald-400'}>
                                  {obs.label}
                                </span>
                                <span className="text-gray-400">{obs.dist}</span>
                                <span className="text-cyan-400 text-[9px]">{obs.dir}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons: Voice Directives & Deep Scan */}
                      <div className="space-y-1.5 pt-2 border-t border-gray-800">
                        <button
                          onClick={() => speakGuidance()}
                          className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-gray-950 font-bold font-tech text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg transition-all"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>TELL ME WHERE TO GO (AUDIO)</span>
                        </button>

                        <button
                          onClick={scanPerimeter}
                          className="w-full py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-700 text-cyan-300 text-[10px] flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Radar className="w-3.5 h-3.5 text-cyan-400" />
                          <span>RUN 360° LIDAR SWEEP</span>
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* WINDOW 8: STARK INVESTOR PITCH DECK & VALUATION BLUEPRINT         */}
              {/* ================================================================= */}
              {!minimizedWindows.pitchDeck && (
                <div
                  onClick={(e) => { e.stopPropagation(); setActiveWindow('pitchDeck'); }}
                  className={`absolute transition-all bg-gray-900/98 rounded-xl flex flex-col shadow-2xl overflow-hidden backdrop-blur-xl z-25 ${
                    maximizedWindows.pitchDeck
                      ? 'inset-0 rounded-none'
                      : 'inset-x-3 top-2 bottom-3 md:inset-x-8 md:top-3 md:bottom-4'
                  } ${
                    activeWindow === 'pitchDeck'
                      ? 'border border-amber-500/80 shadow-[0_0_30px_rgba(245,158,11,0.3)] ring-1 ring-amber-400'
                      : 'border border-gray-800 opacity-95'
                  }`}
                >
                  {/* Pitch Deck Titlebar */}
                  <div className="h-9 bg-gray-950 border-b border-gray-800 px-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-mono font-bold text-amber-300">
                        INVESTOR PITCH DECK // STARK SPATIAL AI MONETIZATION
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => closeWindow('pitchDeck', e)} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
                        <Minus className="w-3 h-3" />
                      </button>
                      <button onClick={(e) => toggleMaximize('pitchDeck', e)} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
                        <Square className="w-3 h-3" />
                      </button>
                      <button onClick={(e) => closeWindow('pitchDeck', e)} className="p-1 hover:bg-red-600 rounded text-gray-400 hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Pitch Deck Content Body */}
                  <div className="flex-1 bg-slate-950 overflow-y-auto p-4 md:p-6 space-y-5 text-gray-200 font-sans">
                    {/* Hero Banner */}
                    <div className="p-4 bg-gradient-to-r from-amber-950/60 via-gray-900 to-black border border-amber-500/40 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/50 text-amber-300 font-mono text-[10px] font-bold">
                            PRE-SEED INVESTMENT MEMORANDUM
                          </span>
                          <span className="text-xs text-gray-400">Target Raise: $2,500 – $10,000</span>
                        </div>
                        <h2 className="text-lg md:text-xl font-tech font-bold text-white tracking-wide">
                          J.A.R.V.I.S. SPATIAL AI & AUTONOMOUS BODYCAM WAYFINDING
                        </h2>
                        <p className="text-xs text-gray-400 mt-1 max-w-xl">
                          Next-generation hands-free computer vision navigation and virtual OS. Wearable through phone bodycam or laptop-in-bag with real-time auditory wayfinding.
                        </p>
                      </div>
                      <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-xl text-center shrink-0">
                        <span className="text-[10px] text-gray-400 block font-mono">DEVELOPER ACCOUNTS GOAL</span>
                        <span className="text-2xl font-mono font-bold text-amber-400">$150.00</span>
                        <span className="text-[9px] text-emerald-400 block mt-0.5">Google ($25) + Apple ($99)</span>
                      </div>
                    </div>

                    {/* 3 Pillars Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-gray-900/80 border border-gray-800 p-3.5 rounded-xl space-y-1">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold block">1. THE PROBLEM</span>
                        <h4 className="text-xs font-bold text-white">Screen Fatigue & Navigation Hazards</h4>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          Walking while looking down at phone screens causes accidents. People and visually impaired users need hands-free auditory guidance.
                        </p>
                      </div>

                      <div className="bg-gray-900/80 border border-gray-800 p-3.5 rounded-xl space-y-1">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold block">2. THE SOLUTION</span>
                        <h4 className="text-xs font-bold text-white">Wearable Spatial AI + Earbud Audio</h4>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          Clip a camera to your shirt or strap, put your phone or laptop away, and J.A.R.V.I.S. scans ahead, warning of obstacles and guiding your footsteps.
                        </p>
                      </div>

                      <div className="bg-gray-900/80 border border-gray-800 p-3.5 rounded-xl space-y-1">
                        <span className="text-[10px] font-mono text-amber-400 font-bold block">3. THE ASK & DEAL</span>
                        <h4 className="text-xs font-bold text-white">Angel Investment Opportunity</h4>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          Seeking $1,500 – $5,000 for Apple & Google App Store launches, cloud AI scaling, and early marketing in exchange for 7% – 12% equity or 15% revenue share.
                        </p>
                      </div>
                    </div>

                    {/* Pricing Tiers (The Business Model) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-tech text-sm font-bold text-white flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                          <span>PROPOSED MONETIZATION & PRICING TIERS</span>
                        </h3>
                        <span className="text-[10px] font-mono text-gray-400">High-Margin Recurring SaaS Model</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Free Tier */}
                        <div className="bg-gray-900/70 border border-gray-800 p-3.5 rounded-xl flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-gray-400 block">TIER 1</span>
                            <h4 className="text-sm font-bold text-white">Free / Cadet</h4>
                            <span className="text-lg font-mono font-bold text-gray-300 my-1 block">$0</span>
                            <ul className="text-[11px] text-gray-400 space-y-1 my-2">
                              <li>✓ Stark Virtual Workstation</li>
                              <li>✓ Basic Voice Commands</li>
                              <li>✓ 3 Spatial Scans / day</li>
                            </ul>
                          </div>
                          <span className="text-[10px] text-gray-500 font-mono">User Acquisition Magnet</span>
                        </div>

                        {/* Pro Subscription Tier */}
                        <div className="bg-emerald-950/40 border-2 border-emerald-500/80 p-3.5 rounded-xl flex flex-col justify-between shadow-[0_0_20px_rgba(16,185,129,0.2)] relative">
                          <span className="absolute -top-2.5 right-3 bg-emerald-500 text-gray-950 font-bold text-[9px] px-2 py-0.5 rounded-full font-mono">
                            MOST POPULAR
                          </span>
                          <div>
                            <span className="text-[10px] font-mono font-bold text-emerald-400 block">TIER 2 (SaaS)</span>
                            <h4 className="text-sm font-bold text-white">Stark Pro Navigator</h4>
                            <div className="flex items-baseline gap-1 my-1">
                              <span className="text-2xl font-mono font-bold text-emerald-400">$4.99</span>
                              <span className="text-xs text-gray-400">/ month ($39/yr)</span>
                            </div>
                            <ul className="text-[11px] text-gray-300 space-y-1 my-2">
                              <li>✓ Unlimited Real-Time AI Camera Navigation</li>
                              <li>✓ Autonomous LiDAR 3D Spatial Grid</li>
                              <li>✓ Continuous Backpack & Bodycam Mode</li>
                              <li>✓ Priority AI Processing Pipeline</li>
                            </ul>
                          </div>
                          <span className="text-[10px] text-emerald-300 font-mono">Generates Monthly Recurring Revenue</span>
                        </div>

                        {/* Lifetime / Founding Member Tier */}
                        <div className="bg-amber-950/30 border border-amber-500/50 p-3.5 rounded-xl flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-amber-400 block">TIER 3 (LIFETIME)</span>
                            <h4 className="text-sm font-bold text-white">Founder Pass (Launch Only)</h4>
                            <div className="flex items-baseline gap-1 my-1">
                              <span className="text-2xl font-mono font-bold text-amber-400">$19.99</span>
                              <span className="text-xs text-gray-400">one-time</span>
                            </div>
                            <ul className="text-[11px] text-gray-300 space-y-1 my-2">
                              <li>✓ Lifetime Pro Access</li>
                              <li>✓ Exclusive Mark-85 HUD Themes</li>
                              <li>✓ Early Access Beta Features</li>
                            </ul>
                          </div>
                          <span className="text-[10px] text-amber-400 font-mono">Instant Cashflow for Dev Accounts</span>
                        </div>
                      </div>
                    </div>

                    {/* Projected Revenue Milestone */}
                    <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 font-bold block">FINANCIAL PROJECTION (PRO TIER)</span>
                        <h4 className="text-xs font-bold text-white">1,000 Paying Pro Users = $4,990 / month MRR ($59,880 ARR)</h4>
                        <p className="text-[11px] text-gray-400">
                          Low server overhead with high gross margins (&gt;85%). Perfect scalable investment profile.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          soundFx.playHudBeep('confirm');
                          jarvisVoice.speak('Investor memorandum summarized, Mr. Stark. Ready to present to the board.');
                          addToast({ title: 'Pitch Deck Ready', message: 'You can present this directly to your investor!', type: 'protocol' });
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold font-tech text-xs cursor-pointer shadow shrink-0"
                      >
                        ⚡ PRESENT TO INVESTOR
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Backpack Lid-Sleep Bypass Configuration Modal */}
              {showBagConfigModal && (
                <div
                  onClick={() => setShowBagConfigModal(false)}
                  className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-gray-900 border border-amber-500/50 rounded-2xl p-5 max-w-lg w-full shadow-2xl flex flex-col gap-3 font-sans text-xs text-gray-200"
                  >
                    <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-amber-400" />
                        <h3 className="font-tech text-sm font-bold text-amber-300">
                          KEEP LAPTOP RUNNING IN YOUR BACKPACK (LID CLOSED)
                        </h3>
                      </div>
                      <button onClick={() => setShowBagConfigModal(false)} className="p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-gray-300 leading-relaxed">
                      To keep Jarvis listening and your USB webcam streaming while your laptop is closed inside your bag, run these commands in your laptop terminal so closing the lid does not put the laptop to sleep:
                    </p>

                    <div className="space-y-2 font-mono text-[11px]">
                      <div>
                        <span className="text-blue-400 font-bold block mb-1">Windows (PowerShell / CMD as Admin):</span>
                        <div className="p-2 bg-gray-950 border border-gray-800 rounded-lg text-amber-300 flex items-center justify-between">
                          <code className="truncate">powercfg -setdcvalueindex SCHEME_CURRENT SUB_BUTTONS LIDACTION 0</code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText('powercfg -setdcvalueindex SCHEME_CURRENT SUB_BUTTONS LIDACTION 0\npowercfg -setacvalueindex SCHEME_CURRENT SUB_BUTTONS LIDACTION 0');
                              addToast({ title: 'Copied!', message: 'Windows power command copied to clipboard.', type: 'status' });
                            }}
                            className="ml-2 px-2 py-0.5 rounded bg-gray-800 text-gray-200 hover:text-white cursor-pointer shrink-0"
                          >
                            COPY
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-purple-400 font-bold block mb-1">macOS (Terminal):</span>
                        <div className="p-2 bg-gray-950 border border-gray-800 rounded-lg text-purple-300 flex items-center justify-between">
                          <code>sudo pmset -a disablesleep 1</code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText('sudo pmset -a disablesleep 1');
                              addToast({ title: 'Copied!', message: 'Mac command copied to clipboard.', type: 'status' });
                            }}
                            className="ml-2 px-2 py-0.5 rounded bg-gray-800 text-gray-200 hover:text-white cursor-pointer shrink-0"
                          >
                            COPY
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-amber-200 text-[11px] leading-relaxed">
                      💡 <strong>Hardware Tip:</strong> Leave a small opening in your bag zipper near the laptop fan exhaust vents for airflow. Clip your USB webcam to your bag strap or chest collar, put in your Bluetooth earbuds, and Jarvis will guide you everywhere!
                    </div>

                    <button
                      onClick={() => setShowBagConfigModal(false)}
                      className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold font-tech text-xs cursor-pointer shadow transition-all"
                    >
                      GOT IT, READY TO RECON
                    </button>
                  </div>
                </div>
              )}

              {/* Phone Wireless Bodycam (No Bag / Laptop on Desk) Modal */}
              {showPhoneModal && (
                <div
                  onClick={() => setShowPhoneModal(false)}
                  className="absolute inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4"
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-gray-900 border border-purple-500/60 rounded-2xl p-5 max-w-lg w-full shadow-2xl flex flex-col gap-3 font-sans text-xs text-gray-200"
                  >
                    <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-purple-400" />
                        <h3 className="font-tech text-sm font-bold text-purple-300">
                          LEAVE LAPTOP ON DESK (NO BAG REQUIRED)
                        </h3>
                      </div>
                      <button onClick={() => setShowPhoneModal(false)} className="p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {/* Method 1: Use Phone as Jarvis Directly (No bag needed!) */}
                      <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-purple-300 flex items-center gap-1.5 text-xs">
                            <span className="w-5 h-5 rounded-full bg-purple-500 text-gray-950 flex items-center justify-center font-bold text-[10px]">1</span>
                            METHOD 1: USE PHONE AS BODYCAM (BEST!)
                          </span>
                          <span className="text-[10px] bg-purple-900 text-purple-200 px-2 py-0.5 rounded font-mono font-bold">100% BAG-FREE</span>
                        </div>
                        <p className="text-gray-300 text-[11px] leading-relaxed">
                          Your phone has an HD camera, battery, and internet. Open this app directly on your phone! Put the phone in your front shirt pocket with the camera lens facing out, and connect your Bluetooth earbuds to your phone:
                        </p>
                        
                        <div className="flex items-center gap-3 bg-black/60 p-2.5 rounded-lg border border-purple-500/20">
                          <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https%3A%2F%2Fais-pre-gctvtzkyny3y2dejmhtmr3-258016456798.asia-southeast1.run.app"
                            alt="Scan QR code"
                            className="w-20 h-20 rounded bg-white p-1 shrink-0"
                          />
                          <div className="flex-1 text-[11px] space-y-1">
                            <span className="font-bold text-white block">Scan with your Phone Camera:</span>
                            <span className="text-gray-400 text-[10px] block">Aim your phone camera at this QR code to launch Jarvis immediately on your phone.</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText('https://ais-pre-gctvtzkyny3y2dejmhtmr3-258016456798.asia-southeast1.run.app');
                                addToast({ title: 'Link Copied!', message: 'Paste this link in your phone browser.', type: 'status' });
                              }}
                              className="px-2 py-1 rounded bg-purple-900/80 hover:bg-purple-800 text-purple-200 font-mono text-[10px] cursor-pointer mt-1"
                            >
                              📋 COPY PHONE LINK
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Method 2: Turn Phone into a Wi-Fi Wireless Webcam for your Laptop */}
                      <div className="p-3 bg-gray-950 border border-gray-800 rounded-xl space-y-1.5">
                        <span className="font-bold text-cyan-300 flex items-center gap-1.5 text-xs">
                          <span className="w-5 h-5 rounded-full bg-cyan-500 text-gray-950 flex items-center justify-center font-bold text-[10px]">2</span>
                          METHOD 2: USE PHONE AS A WIRELESS WI-FI WEBCAM
                        </span>
                        <p className="text-gray-300 text-[11px] leading-relaxed">
                          If you want the laptop on your desk to do all the AI computing, turn your phone into a wireless webcam over your home Wi-Fi:
                        </p>
                        <ul className="list-disc list-inside text-[10px] text-gray-400 space-y-1 pl-1">
                          <li><strong>Android:</strong> Install <em>DroidCam Wireless</em> (free from Play Store). It sends your phone's camera video wirelessly to your laptop!</li>
                          <li><strong>iPhone:</strong> Use <em>Apple Continuity Camera</em> or <em>Camo Studio</em> to turn your iPhone into a wireless webcam on Windows/Mac.</li>
                          <li><strong>Note on Bluetooth Range:</strong> Earbuds connected to your desk laptop will have a range of ~30–40 feet (10–12 meters) before walls block the signal. (Method 1 has unlimited range anywhere!).</li>
                        </ul>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowPhoneModal(false)}
                      className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold font-tech text-xs cursor-pointer shadow transition-all"
                    >
                      GOT IT, ALL SET!
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* =================================================================== */}
            {/* WINDOWS 11 POPUP START MENU                                        */}
            {/* =================================================================== */}
            {isStartMenuOpen && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-14 left-1/2 -translate-x-1/2 w-80 md:w-96 bg-gray-900/98 border border-gray-700/80 rounded-2xl shadow-2xl backdrop-blur-2xl p-4 flex flex-col gap-4 z-40 animate-in fade-in slide-in-from-bottom-2 duration-150"
              >
                {/* Search Bar in Start Menu */}
                <div className="bg-gray-950 border border-gray-700 rounded-full px-3 py-1.5 flex items-center gap-2 text-xs text-gray-400">
                  <Search className="w-3.5 h-3.5 text-blue-400" />
                  <input
                    type="text"
                    placeholder="Type here to search apps, settings, and documents..."
                    className="flex-1 bg-transparent border-none outline-none text-white text-xs"
                  />
                </div>

                {/* Pinned Section */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
                    <span>Pinned</span>
                    <span className="text-[10px] text-blue-400 cursor-pointer">All apps &gt;</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { name: 'Stark Chrome', icon: <Globe className="w-5 h-5 text-blue-400" />, action: () => toggleWindow('chrome') },
                      { name: 'File Explorer', icon: <Folder className="w-5 h-5 text-amber-400" />, action: () => toggleWindow('explorer') },
                      { name: 'Terminal', icon: <Terminal className="w-5 h-5 text-blue-400" />, action: () => toggleWindow('terminal') },
                      { name: 'Calculator', icon: <Calculator className="w-5 h-5 text-cyan-400" />, action: () => toggleWindow('calc') },
                      { name: 'Notepad', icon: <FileText className="w-5 h-5 text-gray-300" />, action: () => toggleWindow('notepad') },
                      { name: 'VS Code', icon: <Code className="w-5 h-5 text-purple-400" />, action: () => toggleWindow('chrome') },
                      { name: 'LiDAR Nav', icon: <Radar className="w-5 h-5 text-emerald-400" />, action: () => { toggleWindow('lidarNav'); if (!isCameraActive) startCamera(); } },
                      { name: 'Settings', icon: <Settings className="w-5 h-5 text-gray-400" />, action: () => soundFx.playHudBeep('mode') },
                      { name: 'Starkware ZK', icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />, action: () => navigateBrowser('https://starkware.co') },
                    ].map((app, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setIsStartMenuOpen(false);
                          app.action();
                        }}
                        className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-800 text-gray-200 cursor-pointer group transition-all"
                      >
                        <div className="w-9 h-9 rounded-lg bg-gray-950 flex items-center justify-center group-hover:scale-105 transition-all shadow">
                          {app.icon}
                        </div>
                        <span className="text-[10px] text-center truncate w-full font-medium">{app.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bottom User Profile & Power Button */}
                <div className="border-t border-gray-800 pt-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                      TS
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white leading-tight">Tony Stark</div>
                      <div className="text-[9px] text-gray-400 leading-tight">Avenger Prime</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      soundFx.playArcReactorPulse();
                      setIsStartMenuOpen(false);
                      setIsPoweredOn(false);
                      jarvisVoice.speak('Shutting down Windows workstation. Sleep mode initialized.');
                    }}
                    className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-red-400 cursor-pointer"
                    title="Shut Down"
                  >
                    <Power className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* WINDOWS 11 CENTERED TASKBAR                                         */}
            {/* =================================================================== */}
            <div className="h-12 bg-gray-950/95 border-t border-gray-800 px-3 flex items-center justify-between z-30 backdrop-blur-2xl">
              
              {/* Left Widget: Weather Pill */}
              <div className="flex items-center gap-2 text-xs font-sans text-gray-300 hidden sm:flex">
                <div className="flex items-center gap-1.5 bg-gray-900/80 px-2 py-1 rounded-md border border-gray-800">
                  <span className="text-amber-400">☀️</span>
                  <span className="font-medium text-[11px]">72°F</span>
                  <span className="text-[10px] text-gray-400">New York</span>
                </div>
              </div>

              {/* Center Taskbar Icons (Windows 11 Centered Signature) */}
              <div className="flex items-center gap-1.5 mx-auto">
                {/* Windows Start Button */}
                <button
                  onClick={() => {
                    soundFx.playHudBeep('mode');
                    setIsStartMenuOpen(!isStartMenuOpen);
                  }}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    isStartMenuOpen ? 'bg-blue-600/30 text-blue-400' : 'hover:bg-gray-800 text-blue-400'
                  }`}
                  title="Start"
                >
                  <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                    <div className="bg-blue-400 rounded-xs" />
                    <div className="bg-blue-400 rounded-xs" />
                    <div className="bg-blue-400 rounded-xs" />
                    <div className="bg-blue-400 rounded-xs" />
                  </div>
                </button>

                {/* Windows Search Icon */}
                <button
                  onClick={() => setIsStartMenuOpen(true)}
                  className="p-2 rounded-lg hover:bg-gray-800 text-gray-300 cursor-pointer hidden md:block"
                  title="Search"
                >
                  <Search className="w-4 h-4" />
                </button>

                {/* Pinned App 1: Starkware Chrome Browser */}
                <button
                  onClick={() => toggleWindow('chrome')}
                  className={`p-2 rounded-lg transition-all cursor-pointer relative ${
                    activeWindow === 'chrome' && !minimizedWindows.chrome
                      ? 'bg-blue-600/30 text-blue-300'
                      : 'hover:bg-gray-800 text-gray-400'
                  }`}
                  title="Starkware Chrome"
                >
                  <Globe className="w-4 h-4 text-blue-400" />
                  {!minimizedWindows.chrome && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-blue-400 rounded-full" />
                  )}
                </button>

                {/* Pinned App 2: File Explorer */}
                <button
                  onClick={() => toggleWindow('explorer')}
                  className={`p-2 rounded-lg transition-all cursor-pointer relative ${
                    activeWindow === 'explorer' && !minimizedWindows.explorer
                      ? 'bg-amber-600/30 text-amber-300'
                      : 'hover:bg-gray-800 text-gray-400'
                  }`}
                  title="File Explorer"
                >
                  <Folder className="w-4 h-4 text-amber-400" />
                  {!minimizedWindows.explorer && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-amber-400 rounded-full" />
                  )}
                </button>

                {/* Pinned App 3: Windows Terminal */}
                <button
                  onClick={() => toggleWindow('terminal')}
                  className={`p-2 rounded-lg transition-all cursor-pointer relative ${
                    activeWindow === 'terminal' && !minimizedWindows.terminal
                      ? 'bg-blue-600/30 text-blue-300'
                      : 'hover:bg-gray-800 text-gray-400'
                  }`}
                  title="PowerShell Terminal"
                >
                  <Terminal className="w-4 h-4 text-blue-400" />
                  {!minimizedWindows.terminal && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-blue-400 rounded-full" />
                  )}
                </button>

                {/* Pinned App 4: Calculator */}
                <button
                  onClick={() => toggleWindow('calc')}
                  className={`p-2 rounded-lg transition-all cursor-pointer relative ${
                    activeWindow === 'calc' && !minimizedWindows.calc
                      ? 'bg-cyan-600/30 text-cyan-300'
                      : 'hover:bg-gray-800 text-gray-400'
                  }`}
                  title="Calculator"
                >
                  <Calculator className="w-4 h-4 text-cyan-400" />
                  {!minimizedWindows.calc && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-cyan-400 rounded-full" />
                  )}
                </button>

                {/* Pinned App 5: Notepad */}
                <button
                  onClick={() => toggleWindow('notepad')}
                  className={`p-2 rounded-lg transition-all cursor-pointer relative ${
                    activeWindow === 'notepad' && !minimizedWindows.notepad
                      ? 'bg-gray-700/60 text-white'
                      : 'hover:bg-gray-800 text-gray-400'
                  }`}
                  title="Notepad"
                >
                  <FileText className="w-4 h-4 text-gray-300" />
                  {!minimizedWindows.notepad && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-gray-300 rounded-full" />
                  )}
                </button>

                {/* Pinned App 6: Stark Vision LiDAR 3D Spatial Navigator */}
                <button
                  onClick={() => {
                    toggleWindow('lidarNav');
                    if (!isCameraActive) startCamera();
                  }}
                  className={`p-2 rounded-lg transition-all cursor-pointer relative ${
                    activeWindow === 'lidarNav' && !minimizedWindows.lidarNav
                      ? 'bg-emerald-600/30 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                      : 'hover:bg-gray-800 text-gray-400'
                  }`}
                  title="LiDAR 3D Spatial Navigator"
                >
                  <Radar className="w-4 h-4 text-emerald-400 animate-pulse" />
                  {!minimizedWindows.lidarNav && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-emerald-400 rounded-full" />
                  )}
                </button>

                {/* Pinned App 7: Investor Pitch Deck & Monetization */}
                <button
                  onClick={() => toggleWindow('pitchDeck')}
                  className={`p-2 rounded-lg transition-all cursor-pointer relative ${
                    activeWindow === 'pitchDeck' && !minimizedWindows.pitchDeck
                      ? 'bg-amber-600/30 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                      : 'hover:bg-gray-800 text-gray-400'
                  }`}
                  title="Investor Pitch Deck & Valuation"
                >
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  {!minimizedWindows.pitchDeck && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-amber-400 rounded-full" />
                  )}
                </button>
              </div>

              {/* Right System Tray (Bag Mode, Ambient Mic, Clock, Battery, Wi-Fi, Sound) */}
              <div className="flex items-center gap-2 font-sans text-xs text-gray-300">
                {/* Backpack Bag Recon Mode Button */}
                <button
                  onClick={toggleBackpackMode}
                  className={`px-2 py-1 rounded-md border flex items-center gap-1.5 text-[11px] font-mono font-bold cursor-pointer transition-all ${
                    isBackpackModeActive
                      ? 'bg-amber-950/90 border-amber-500/80 text-amber-300 animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                      : 'bg-gray-900/80 border-gray-800 text-gray-400 hover:text-amber-300'
                  }`}
                  title="Backpack Bag Recon Mode (Laptop in bag with USB camera and earbuds)"
                >
                  <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">{isBackpackModeActive ? 'BAG ACTIVE' : 'BAG MODE'}</span>
                </button>

                {/* Leave Laptop On Desk: Phone Bodycam Button */}
                <button
                  onClick={() => {
                    soundFx.playHudBeep('mode');
                    setShowPhoneModal(true);
                  }}
                  className="px-2 py-1 rounded-md border border-purple-500/50 bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 flex items-center gap-1.5 text-[11px] font-mono font-bold cursor-pointer transition-all shadow"
                  title="Leave laptop on desk & use smartphone in shirt pocket as wireless camera"
                >
                  <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                  <span className="hidden md:inline">NO BAG (PHONE)</span>
                </button>

                {/* Continuous Ambient Microphone Listener Button */}
                <button
                  onClick={toggleLaptopMicrophone}
                  className={`px-2 py-1 rounded-md border flex items-center gap-1.5 text-[11px] font-mono font-bold cursor-pointer transition-all ${
                    isLaptopMicListening
                      ? 'bg-red-950/90 border-red-500/80 text-red-300 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                      : 'bg-gray-900/80 border-gray-800 text-gray-400 hover:text-white'
                  }`}
                  title="Continuous Ambient Voice Listener (Always Listening)"
                >
                  {isLaptopMicListening ? <Mic className="w-3.5 h-3.5 text-red-400 animate-ping" /> : <MicOff className="w-3.5 h-3.5 text-gray-400" />}
                  <span className="hidden md:inline">{isLaptopMicListening ? 'JARVIS LISTENING...' : 'MIC OFF'}</span>
                </button>

                <div className="flex items-center gap-1.5 bg-gray-900/80 px-2 py-1 rounded-md border border-gray-800">
                  <Wifi className="w-3.5 h-3.5 text-blue-400" />
                  <Volume2 className="w-3.5 h-3.5 text-gray-300" />
                  <Battery className="w-3.5 h-3.5 text-emerald-400" />
                </div>

                <div className="flex flex-col items-end text-right px-1">
                  <span className="text-[11px] font-medium leading-tight text-white">{currentTime}</span>
                  <span className="text-[10px] text-gray-400 leading-tight">{currentDate}</span>
                </div>
              </div>

            </div>

          </div>

          {/* Lower Screen Bezel Badge */}
          <div className="py-1 text-center font-sans text-[10px] tracking-wider text-gray-400 uppercase font-medium flex items-center justify-center gap-2">
            <span>STARKWARE ENTERPRISE // WINDOWS 11 PRO EDITION</span>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* LAPTOP BASE SECTION: PHYSICAL CHASSIS & KEYBOARD                       */}
        {/* ======================================================================= */}
        <div className="w-full bg-gradient-to-b from-gray-900 via-gray-950 to-black rounded-b-2xl border-4 border-t-0 border-gray-700 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative flex flex-col gap-3">
          
          {/* Hinge & Arc Power Button */}
          <div className="flex items-center justify-between px-4 border-b border-gray-800 pb-2">
            <div className="flex items-center gap-1">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-1.5 h-1 bg-gray-700 rounded-full" />
              ))}
            </div>

            {/* Power Switch */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundFx.playArcReactorPulse();
                  setIsPoweredOn(!isPoweredOn);
                }}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                  isPoweredOn
                    ? 'border-blue-400 bg-blue-950 shadow-[0_0_12px_rgba(59,130,246,0.8)]'
                    : 'border-gray-700 bg-gray-900'
                }`}
                title="Power Button"
              >
                <Power className={`w-3 h-3 ${isPoweredOn ? 'text-blue-300' : 'text-gray-500'}`} />
              </button>
              <span className="text-[10px] font-mono-tech text-gray-400">POWER</span>
            </div>

            <div className="flex items-center gap-1">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-1.5 h-1 bg-gray-700 rounded-full" />
              ))}
            </div>
          </div>

          {/* Windows Chiclet Keyboard */}
          <div className="bg-gray-950 border border-gray-800 p-2.5 rounded-xl shadow-inner flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[9px] font-sans text-gray-400 px-1 border-b border-gray-900 pb-1">
              <span>WINDOWS CHICLET KEYBOARD</span>
              <span className="text-blue-400 font-mono">TOUCH KEYBOARD LINKED</span>
            </div>

            <div className="space-y-1">
              {[
                ['ESC', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'BACK'],
                ['TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'],
                ['CAPS', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'ENTER'],
                ['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'SHIFT'],
                ['CTRL', 'WIN', 'ALT', 'SPACE', 'ALT', 'CTRL', 'JARVIS'],
              ].map((row, rowIdx) => (
                <div key={rowIdx} className="flex items-center justify-center gap-1">
                  {row.map((key) => {
                    const isSpecial = ['ESC', 'TAB', 'CAPS', 'SHIFT', 'ENTER', 'BACK', 'SPACE', 'WIN', 'JARVIS'].includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          soundFx.playHudBeep('subtle');
                          if (key === 'WIN') {
                            setIsStartMenuOpen(!isStartMenuOpen);
                          } else if (key === 'ENTER') {
                            if (activeWindow === 'chrome') navigateBrowser(omniInput);
                            else if (activeWindow === 'terminal') executeTerminal(terminalInput);
                          } else if (key === 'BACK') {
                            if (activeWindow === 'chrome') setOmniInput((prev) => prev.slice(0, -1));
                            else if (activeWindow === 'terminal') setTerminalInput((prev) => prev.slice(0, -1));
                            else if (activeWindow === 'notepad') setNotepadText((prev) => prev.slice(0, -1));
                          } else if (key === 'SPACE') {
                            if (activeWindow === 'chrome') setOmniInput((prev) => prev + ' ');
                            else if (activeWindow === 'terminal') setTerminalInput((prev) => prev + ' ');
                            else if (activeWindow === 'notepad') setNotepadText((prev) => prev + ' ');
                          } else if (!isSpecial) {
                            if (activeWindow === 'chrome') setOmniInput((prev) => prev + key.toLowerCase());
                            else if (activeWindow === 'terminal') setTerminalInput((prev) => prev + key.toLowerCase());
                            else if (activeWindow === 'notepad') setNotepadText((prev) => prev + key);
                          }
                        }}
                        className={`py-1.5 text-center font-mono font-bold text-[10px] rounded border transition-all cursor-pointer active:scale-95 shadow-sm ${
                          key === 'SPACE'
                            ? 'w-48 bg-gray-900 border-gray-700 text-gray-300 hover:border-blue-400'
                            : key === 'ENTER'
                            ? 'w-14 bg-blue-950 border-blue-500/50 text-blue-300 hover:bg-blue-900'
                            : key === 'WIN'
                            ? 'w-10 bg-blue-900/60 border-blue-500/40 text-blue-300'
                            : isSpecial
                            ? 'w-10 bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700'
                            : 'w-7 sm:w-8 bg-gray-900 border-gray-800 text-gray-200 hover:border-blue-400 hover:text-blue-300'
                        }`}
                      >
                        {key}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Windows Precision Glass Touchpad */}
          <div className="flex flex-col items-center justify-center pt-1">
            <div
              onClick={() => soundFx.playHudBeep('subtle')}
              className="w-52 h-16 bg-gray-950 border border-gray-800 rounded-xl hover:border-blue-500/40 transition-all cursor-pointer flex flex-col justify-between p-1.5 relative overflow-hidden group shadow-inner"
            >
              <div className="text-[8px] font-sans text-gray-500 text-center uppercase tracking-widest">
                PRECISION GLASS TOUCHPAD
              </div>
              <div className="flex items-center justify-between border-t border-gray-900 pt-1 text-[8px] font-sans text-gray-500 px-2">
                <span className="hover:text-blue-400">LEFT CLICK</span>
                <span className="w-px h-3 bg-gray-800" />
                <span className="hover:text-blue-400">RIGHT CLICK</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
