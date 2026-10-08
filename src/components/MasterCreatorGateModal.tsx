import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  KeyRound, 
  ShieldAlert, 
  Sparkles, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { useOwnerAuth } from '../context/OwnerAuthContext';
import { soundFx } from '../utils/audioEffects';

export const MasterCreatorGateModal: React.FC = () => {
  const { 
    isMasterGateModalOpen, 
    closeMasterGateModal, 
    unlockMasterPublishWithPin,
    isMasterPublishUnlocked 
  } = useOwnerAuth();

  const [pinInput, setPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isMasterGateModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    const result = unlockMasterPublishWithPin(pinInput);
    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setPinInput('');
      }, 1000);
    } else {
      setErrorMessage(result.message);
      soundFx.playHudBeep('alert');
    }
  };

  const handleDigitClick = (digit: string) => {
    soundFx.playHudBeep('subtle');
    if (pinInput.length < 10) {
      setPinInput((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    soundFx.playHudBeep('subtle');
    setPinInput((prev) => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/90 backdrop-blur-md animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 border-2 border-amber-500/80 rounded-3xl max-w-md w-full p-6 relative shadow-[0_0_50px_rgba(245,158,11,0.35)] flex flex-col gap-4 font-sans text-gray-200"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            soundFx.playHudBeep('subtle');
            closeMasterGateModal();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Iron Man Creator Crest */}
        <div className="flex items-center gap-3 border-b border-gray-800 pb-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border-2 border-amber-500 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)] shrink-0 animate-pulse">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/40 uppercase">
                RESTRICTED // CLASSIFIED GATEWAY
              </span>
            </div>
            <h3 className="font-tech text-base font-bold text-white tracking-wide mt-0.5">
              MASTER CREATOR ACCESS GATE
            </h3>
          </div>
        </div>

        {/* Security Warning Banner */}
        <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-2xl text-xs text-amber-200 font-sans leading-relaxed flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-white mb-0.5">INSTALL & PUBLISHING PIPELINE IS LOCKED</p>
            <p className="text-[11px] text-gray-300">
              Per executive security directives, <strong>only the Lead System Creator</strong> is authorized to build, download binaries, install apps, or publish to app stores.
            </p>
          </div>
        </div>

        {/* PIN Input & Keypad Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-mono text-gray-300 block mb-1.5 font-bold">
              ENTER MASTER CREATOR SECURITY PASSCODE:
            </label>
            <div className="relative">
              <input
                type="password"
                autoFocus
                placeholder="••••"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full bg-gray-950 border-2 border-amber-500/60 focus:border-amber-400 rounded-2xl px-4 py-3 text-center text-amber-300 font-mono font-bold tracking-widest text-2xl outline-none shadow-inner"
              />
              {pinInput && (
                <button
                  type="button"
                  onClick={() => setPinInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>

          {/* Quick On-Screen Touch Numpad */}
          <div className="grid grid-cols-3 gap-2 bg-gray-950/60 p-3 rounded-2xl border border-gray-800">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((btn) => {
              const isClear = btn === 'C';
              const isBack = btn === '⌫';
              return (
                <button
                  key={btn}
                  type="button"
                  onClick={() => {
                    if (isClear) setPinInput('');
                    else if (isBack) handleBackspace();
                    else handleDigitClick(btn);
                  }}
                  className={`py-2 rounded-xl font-mono font-bold text-sm transition-all cursor-pointer ${
                    isClear || isBack
                      ? 'bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-white text-xs'
                      : 'bg-gray-900 border border-gray-800 text-gray-200 hover:border-amber-500 hover:text-amber-300 hover:bg-amber-950/40 active:scale-95'
                  }`}
                >
                  {btn}
                </button>
              );
            })}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-xs font-mono flex items-center gap-2 animate-shake">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {isSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Master Key Verified! Publishing Pipeline Unlocked.</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-gray-950 font-tech font-bold text-xs tracking-wider cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4" />
            <span>AUTHORIZE & UNLOCK PUBLISHING</span>
          </button>
        </form>

        <div className="text-[10px] text-gray-500 text-center font-mono">
          🔒 Stark Industries Cryptographic Gate • Creator Biometrics Active
        </div>
      </div>
    </div>
  );
};
