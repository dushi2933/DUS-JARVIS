import React, { useState, useEffect } from 'react';
import { 
  Fingerprint, 
  Eye, 
  Mic, 
  Activity, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw,
  Cpu,
  Zap,
  Sparkles
} from 'lucide-react';
import { BiometricScanType, BiometricStatus } from '../types/starkSecurity';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useToast } from '../context/ToastContext';

interface BiometricAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onAuthenticationSuccess: () => void;
  onLockSystem: () => void;
}

export const BiometricAuthModal: React.FC<BiometricAuthModalProps> = ({
  isOpen,
  onClose,
  isAuthenticated,
  onAuthenticationSuccess,
  onLockSystem,
}) => {
  const { addToast } = useToast();
  const [activeScanType, setActiveScanType] = useState<BiometricScanType>('retina');
  const [scanStatus, setScanStatus] = useState<BiometricStatus>(isAuthenticated ? 'AUTHENTICATED' : 'LOCKED');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanDetails, setScanDetails] = useState<string>('Standing by for biometric verification.');

  useEffect(() => {
    setScanStatus(isAuthenticated ? 'AUTHENTICATED' : 'LOCKED');
    setScanProgress(isAuthenticated ? 100 : 0);
  }, [isAuthenticated]);

  if (!isOpen) return null;

  const handleStartScan = (scanType: BiometricScanType = activeScanType) => {
    setActiveScanType(scanType);
    setScanStatus('SCANNING');
    setScanProgress(0);
    soundFx.playHudBeep('mode');

    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setScanProgress(current);

      if (current === 30) {
        soundFx.playHudBeep('subtle');
        if (scanType === 'retina') setScanDetails('Tracing corneal curvature and vascular capillary network...');
        if (scanType === 'palm') setScanDetails('Analyzing dermal ridge friction and palm curvature...');
        if (scanType === 'voiceprint') setScanDetails('Deconstructing harmonic acoustic spectral frequencies...');
        if (scanType === 'arcSynapse') setScanDetails('Synchronizing with palladium/nanite cardiac rhythm...');
      } else if (current === 70) {
        soundFx.playHudBeep('subtle');
        setScanDetails('Cross-referencing Stark Industries Executive Registry [Level Alpha-1]...');
      } else if (current >= 100) {
        clearInterval(interval);
        setScanStatus('AUTHENTICATED');
        soundFx.playHudBeep('confirm');
        jarvisVoice.speak('Biometric verification confirmed. Welcome back, Mr. Stark. All armor protocols unlocked.');
        addToast({
          title: 'Biometric Access Granted',
          message: 'Clearance Level Alpha-1 verified for Tony Stark. Full command authority restored.',
          type: 'status',
        });
        onAuthenticationSuccess();
      }
    }, 120);
  };

  const handleLockSuit = () => {
    soundFx.playHudBeep('alert');
    setScanStatus('LOCKED');
    setScanProgress(0);
    setScanDetails('Suit locked. Weapon systems and flight gyros require biometric re-authorization.');
    jarvisVoice.speak('All systems locked, Sir. Biometric authentication required to disengage security lock.');
    addToast({
      title: 'Security Lockdown Engaged',
      message: 'Armor systems placed in safe standby. Weapons offline.',
      type: 'protocol',
    });
    onLockSystem();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-gray-950 border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden flex flex-col gap-5">
        {/* Hologram background grid */}
        <div className="absolute inset-0 holo-grid opacity-25 pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
              scanStatus === 'AUTHENTICATED'
                ? 'bg-emerald-950/60 border-emerald-400 text-emerald-400 glow-arc-blue'
                : scanStatus === 'SCANNING'
                ? 'bg-cyan-950/60 border-cyan-400 text-cyan-400 animate-pulse'
                : 'bg-red-950/60 border-red-500 text-red-400 glow-arc-red'
            }`}>
              {scanStatus === 'AUTHENTICATED' ? (
                <ShieldCheck className="w-5 h-5" />
              ) : scanStatus === 'SCANNING' ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-tech text-base font-bold tracking-wider text-cyan-200 uppercase">
                  STARK INDUSTRIES BIOMETRIC CLEARANCE TERMINAL
                </h3>
                <span className={`text-[10px] font-mono-tech px-2 py-0.5 rounded border uppercase font-bold ${
                  scanStatus === 'AUTHENTICATED'
                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                    : 'bg-red-950/80 text-red-400 border-red-500/40'
                }`}>
                  {scanStatus === 'AUTHENTICATED' ? 'AUTHORIZED: ALPHA-1' : 'ACCESS: RESTRICTED'}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-sans">
                Neural cryptographic protocol · Subject: Mr. Tony Stark
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playHudBeep('subtle');
              onClose();
            }}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scan Method Switcher Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 relative z-10">
          {[
            { id: 'retina', label: 'Retinal Scanner', icon: <Eye className="w-4 h-4" />, desc: 'Vascular Optic' },
            { id: 'palm', label: 'Palm Geometry', icon: <Fingerprint className="w-4 h-4" />, desc: 'Capacitive Grid' },
            { id: 'voiceprint', label: 'Voiceprint Match', icon: <Mic className="w-4 h-4" />, desc: 'Spectral Audio' },
            { id: 'arcSynapse', label: 'Arc Synapse', icon: <Activity className="w-4 h-4" />, desc: 'Cardiac Rhythm' },
          ].map((method) => {
            const isSelected = activeScanType === method.id;
            return (
              <button
                key={method.id}
                onClick={() => {
                  soundFx.playHudBeep('subtle');
                  setActiveScanType(method.id as BiometricScanType);
                  if (scanStatus === 'LOCKED') {
                    handleStartScan(method.id as BiometricScanType);
                  }
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200 glow-arc-blue'
                    : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-tech text-xs font-bold">
                  {method.icon}
                  <span>{method.label}</span>
                </div>
                <div className="text-[10px] text-gray-500 font-mono-tech">{method.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Central Holographic Biometric Scanner Visualizer */}
        <div className="relative z-10 bg-gray-900/80 border border-cyan-500/30 rounded-xl p-6 flex flex-col items-center justify-center min-h-[220px] overflow-hidden">
          {/* Laser Sweep Animation */}
          {scanStatus === 'SCANNING' && (
            <div className="absolute inset-x-0 h-1 bg-cyan-400 glow-arc-blue animate-pulse z-20"
                 style={{
                   animation: 'scanLaser 1.4s ease-in-out infinite alternate',
                 }}
            />
          )}

          <style>{`
            @keyframes scanLaser {
              0% { top: 10%; opacity: 0.2; }
              50% { opacity: 1; }
              100% { top: 90%; opacity: 0.2; }
            }
          `}</style>

          {/* Scanner Graphic by Type */}
          <div className="relative w-36 h-36 flex items-center justify-center mb-4">
            {/* Outer Rotating Calibration Rings */}
            <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/40 animate-spin-slow" />
            <div className="absolute inset-2 rounded-full border border-amber-500/30 animate-spin-reverse-slow" />

            {/* Inner Sensor Visual */}
            <div className={`w-28 h-28 rounded-full border-2 flex items-center justify-center transition-all ${
              scanStatus === 'AUTHENTICATED'
                ? 'border-emerald-400 bg-emerald-950/40 glow-arc-blue text-emerald-300'
                : scanStatus === 'SCANNING'
                ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 animate-pulse'
                : 'border-red-500/60 bg-red-950/30 text-red-400'
            }`}>
              {activeScanType === 'retina' && (
                <div className="relative flex items-center justify-center">
                  <Eye className="w-12 h-12" />
                  <div className="absolute w-6 h-6 rounded-full border border-cyan-300 animate-ping opacity-60" />
                </div>
              )}
              {activeScanType === 'palm' && (
                <div className="relative flex items-center justify-center">
                  <Fingerprint className="w-12 h-12" />
                </div>
              )}
              {activeScanType === 'voiceprint' && (
                <div className="flex items-center gap-1">
                  {[4, 8, 14, 10, 6, 12, 16, 9, 5].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full bg-cyan-400 transition-all ${
                        scanStatus === 'SCANNING' ? 'animate-pulse' : ''
                      }`}
                      style={{ height: `${h * 2}px` }}
                    />
                  ))}
                </div>
              )}
              {activeScanType === 'arcSynapse' && (
                <div className="relative flex items-center justify-center">
                  <Activity className="w-12 h-12" />
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar & Status Text */}
          <div className="w-full max-w-md flex flex-col items-center gap-1.5 text-center">
            <div className="flex items-center justify-between w-full text-xs font-mono-tech">
              <span className="text-gray-400 uppercase">
                {activeScanType} ANALYSIS:
              </span>
              <span className={`font-bold ${
                scanStatus === 'AUTHENTICATED' ? 'text-emerald-400' : 'text-cyan-300'
              }`}>
                {scanProgress}%
              </span>
            </div>

            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden border border-gray-700">
              <div
                className={`h-full transition-all duration-200 ${
                  scanStatus === 'AUTHENTICATED'
                    ? 'bg-emerald-400'
                    : 'bg-cyan-400 glow-arc-blue'
                }`}
                style={{ width: `${scanProgress}%` }}
              />
            </div>

            <p className="text-xs text-gray-300 font-mono-tech mt-1">
              {scanStatus === 'AUTHENTICATED'
                ? 'IDENTIFICATION VERIFIED: TONY STARK · EXECUTIVE PRIVILEGES UNLOCKED'
                : scanDetails}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10 pt-2 border-t border-gray-800">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-gray-400">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>ENCRYPTION: QUANTUM 4096-BIT RSA · STARK SATELLITE SYNC</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {scanStatus === 'AUTHENTICATED' ? (
              <button
                onClick={handleLockSuit}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-500/50 text-red-300 text-xs font-tech font-bold cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>LOCK ARMOR SYSTEMS</span>
              </button>
            ) : (
              <button
                onClick={() => handleStartScan(activeScanType)}
                disabled={scanStatus === 'SCANNING'}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-gray-950 text-xs font-tech font-bold cursor-pointer transition-all flex items-center justify-center gap-2 glow-arc-blue disabled:opacity-50"
              >
                <Unlock className="w-4 h-4" />
                <span>{scanStatus === 'SCANNING' ? 'SCANNING BIOMETRICS...' : 'START BIOMETRIC SCAN'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 text-xs font-tech font-bold cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
