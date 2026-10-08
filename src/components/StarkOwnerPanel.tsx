import React, { useState } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  Flame, 
  Lock, 
  Unlock, 
  Crown, 
  KeyRound, 
  Users, 
  Radio, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Terminal, 
  Bot, 
  Volume2, 
  Download, 
  Sparkles, 
  RotateCcw, 
  Cpu, 
  Laptop, 
  FolderDown, 
  CheckCircle2,
  Crosshair,
  Building2,
  PhoneCall,
  Sliders,
  Send,
  UserCheck,
  UserX,
  Edit3,
  Plus,
  Trash2,
  X,
  Eye,
  Check,
  Copy,
  Globe,
  ExternalLink,
  Key,
  Github
} from 'lucide-react';
import { useOwnerAuth } from '../context/OwnerAuthContext';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useToast } from '../context/ToastContext';
import { OwnerAccount, OwnerAccountPermissions } from '../types/ownerAuth';

interface StarkOwnerPanelProps {
  onOpenPublishing: () => void;
  onNavigateTab: (tab: string) => void;
}

export const StarkOwnerPanel: React.FC<StarkOwnerPanelProps> = ({
  onOpenPublishing,
  onNavigateTab,
}) => {
  const { 
    isOwnerUnlocked, 
    isMasterPublishUnlocked,
    currentAccount,
    ownerAccounts,
    auditLogs,
    systemControls,
    unlockOwnerWithPin,
    unlockMasterPublishWithPin,
    lockOwner,
    lockMasterPublish,
    switchAccount,
    updateAccount,
    changeAccountPassword,
    assumeControlOfAccount,
    toggleAccountSuspension,
    toggleAccountPermission,
    sendDirectiveToAccount,
    createCustomAccount,
    deleteAccount,
    resetToDefaultAccounts,
    updateSystemControls,
    addAuditLog,
    requireMasterPublishAccess
  } = useOwnerAuth();

  const { addToast } = useToast();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'controls' | 'accounts' | 'publishing' | 'logs'>('accounts');
  const [testSpeechText, setTestSpeechText] = useState('Executive Stark directives confirmed.');

  // Dedicated Change Passcode Modal State
  const [changingPasswordAccount, setChangingPasswordAccount] = useState<OwnerAccount | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // Control state for specific account management
  const [managingAccount, setManagingAccount] = useState<OwnerAccount | null>(null);
  const [directiveInputs, setDirectiveInputs] = useState<Record<string, string>>({});
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    role: '',
    clearanceLevel: '',
    department: '',
    customStatusMessage: '',
    password: '',
  });

  // New Account Modal State
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [newAccountData, setNewAccountData] = useState({
    name: '',
    handle: '',
    role: '',
    clearanceLevel: 'LEVEL 8 // TACTICAL ASSET',
    department: 'Stark Strategic Operations',
    avatarColor: '#06b6d4',
    badge: 'EXECUTIVE ASSET',
    bio: '',
    password: '',
  });

  // Unlock Owner Panel handler
  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    const res = unlockOwnerWithPin(pinInput);
    if (res.success) {
      setPinInput('');
      addToast({
        title: 'Executive Clearance Granted',
        message: `Welcome, ${currentAccount.name}. Owner control suite online.`,
        type: 'protocol',
      });
    } else {
      setPinError(res.message);
    }
  };

  // Open manage modal for an account
  const handleOpenAccountControl = (acc: OwnerAccount) => {
    soundFx.playHudBeep('subtle');
    setManagingAccount(acc);
    setEditFormData({
      role: acc.role,
      clearanceLevel: acc.clearanceLevel,
      department: acc.department,
      customStatusMessage: acc.customStatusMessage || '',
      password: acc.password || '',
    });
    setIsEditingProfile(false);
  };

  // Dedicated Save Password handler
  const handleSavePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changingPasswordAccount) return;
    const cleanPass = newPasswordInput.trim();
    if (!cleanPass) {
      addToast({
        title: 'Passcode Required',
        message: 'Please enter a valid passcode.',
        type: 'alert',
      });
      return;
    }
    changeAccountPassword(changingPasswordAccount.id, cleanPass);
    if (managingAccount && managingAccount.id === changingPasswordAccount.id) {
      setManagingAccount((prev) => (prev ? { ...prev, password: cleanPass } : null));
    }
    addToast({
      title: 'Passcode (PS) Changed!',
      message: `${changingPasswordAccount.name}'s passcode is now "${cleanPass}". You can immediately use it to log in!`,
      type: 'protocol',
    });
    setChangingPasswordAccount(null);
    setNewPasswordInput('');
  };

  // Save edited profile
  const handleSaveProfileEdit = () => {
    if (!managingAccount) return;
    updateAccount(managingAccount.id, editFormData);
    setManagingAccount((prev) => prev ? { ...prev, ...editFormData } : null);
    setIsEditingProfile(false);
    addToast({
      title: 'Profile Updated',
      message: `Updated executive credentials for ${managingAccount.name}.`,
      type: 'status',
    });
  };

  // Dispatch directive to account
  const handleSendDirective = (accId: string) => {
    const text = (directiveInputs[accId] || '').trim();
    if (!text) return;
    sendDirectiveToAccount(accId, text);
    setDirectiveInputs((prev) => ({ ...prev, [accId]: '' }));
    addToast({
      title: 'Directive Dispatched',
      message: `Executive order transmitted to terminal: "${text}"`,
      type: 'tactical',
    });
  };

  // Create new account
  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountData.name.trim()) return;

    const customPass = newAccountData.password.trim() || String(Math.floor(100000 + Math.random() * 900000));
    const handleClean = newAccountData.handle.trim() || newAccountData.name.toLowerCase().replace(/\s+/g, '.');
    const accSlug = handleClean.replace(/[^a-z0-9]/gi, '');

    createCustomAccount({
      name: newAccountData.name.trim(),
      handle: handleClean,
      role: newAccountData.role.trim() || 'Stark Executive Specialist',
      clearanceLevel: newAccountData.clearanceLevel,
      department: newAccountData.department,
      avatarColor: newAccountData.avatarColor,
      badge: newAccountData.badge,
      bio: newAccountData.bio.trim() || 'Registered Stark Industries Executive Owner asset.',
      isMasterCreator: false,
      canPublish: false,
      status: 'ACTIVE',
      password: customPass,
      portalUrl: `/?portal=owner&owner=${encodeURIComponent(accSlug)}`,
      permissions: {
        canFireWeapons: true,
        canAccessVault: false,
        canOverrideDefense: false,
        canAccessCameras: true,
        canScrambleHouseParty: false,
      },
      customStatusMessage: 'Active on personal Stark terminal uplink',
      isSuspended: false,
      lastExecutiveDirective: 'Initialize terminal diagnostics',
    });

    setIsAddAccountModalOpen(false);
    setNewAccountData({
      name: '',
      handle: '',
      role: '',
      clearanceLevel: 'LEVEL 8 // TACTICAL ASSET',
      department: 'Stark Strategic Operations',
      avatarColor: '#06b6d4',
      badge: 'EXECUTIVE ASSET',
      bio: '',
      password: '',
    });
    addToast({
      title: 'Executive Account Created',
      message: 'New owner profile successfully registered into the Stark Executive Suite.',
      type: 'protocol',
    });
  };

  // If not unlocked, show Locked Security Vault (NO PASSWORDS EXPOSED!)
  if (!isOwnerUnlocked) {
    return (
      <div className="bg-gray-950/90 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-10 shadow-[0_0_60px_rgba(245,158,11,0.25)] flex flex-col items-center justify-center max-w-2xl mx-auto my-8 relative overflow-hidden text-center backdrop-blur-md">
        <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center space-y-4 max-w-md w-full">
          <div className="w-20 h-20 rounded-3xl bg-amber-950/80 border-2 border-amber-500 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.6)] animate-pulse">
            <Crown className="w-10 h-10" />
          </div>

          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider mb-2">
              RESTRICTED // STARK EXECUTIVE PROTOCOL
            </div>
            <h2 className="text-2xl font-tech font-bold text-white tracking-wide">
              OWNER EXECUTIVE COMMAND SUITE
            </h2>
            <p className="text-xs text-gray-400 font-sans mt-1 leading-relaxed">
              Restricted to Stark Industries Executive Owners. Enter your authorized security passcode to unlock full account controls and system overrides.
            </p>
          </div>

          {/* Secure Login Form */}
          <form onSubmit={handleUnlockSubmit} className="w-full space-y-3 pt-2">
            <div className="relative">
              <input
                type="password"
                placeholder="••••••"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full bg-gray-900 border-2 border-amber-500/50 focus:border-amber-400 rounded-2xl px-4 py-3 text-center text-amber-300 font-mono font-bold tracking-widest text-2xl outline-none shadow-inner"
              />
            </div>

            {pinError && (
              <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-xs font-mono flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-gray-950 font-tech font-bold text-xs tracking-wider cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>AUTHENTICATE & UNLOCK OWNER SUITE</span>
            </button>
          </form>

          {/* Executive Passcode & URL Directory */}
          <div className="w-full pt-4 border-t border-amber-500/20 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5" />
                <span>EXECUTIVE PASSCODE DIRECTORY:</span>
              </span>
              <span className="text-[10px] font-mono text-gray-400">1-CLICK AUTO-LOGIN</span>
            </div>

            {/* Quick action buttons for the 3 key passcodes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  setPinInput('2017');
                  const res = unlockOwnerWithPin('2017');
                  if (res.success) {
                    addToast({
                      title: 'Master Creator Clearance Granted',
                      message: 'Welcome, Lisara Kodikara. Install & Publish features unlocked.',
                      type: 'protocol',
                    });
                  }
                }}
                className="p-2.5 rounded-xl bg-gradient-to-r from-amber-950/80 to-yellow-950/60 border border-amber-500/60 hover:border-amber-400 text-left cursor-pointer transition-all hover:scale-[1.02]"
              >
                <div className="text-[10px] text-amber-400 font-bold flex items-center justify-between">
                  <span>★ MASTER CREATOR</span>
                  <span className="text-amber-300 font-tech font-bold text-xs">2017</span>
                </div>
                <div className="text-white text-xs font-bold mt-0.5">Lisara Kodikara (Dushi)</div>
                <div className="text-[9px] text-amber-300/80 mt-0.5 font-mono">jdushi@gmail.com</div>
                <div className="text-[9px] text-gray-400 mt-0.5">Unlocks Install & Publish</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPinInput('1234567');
                  const res = unlockOwnerWithPin('1234567');
                  if (res.success) {
                    addToast({
                      title: 'Owner Clearance Granted',
                      message: 'Welcome, Tony Stark. Normal Owner Console online.',
                      type: 'protocol',
                    });
                  }
                }}
                className="p-2.5 rounded-xl bg-gradient-to-r from-red-950/80 to-gray-900 border border-red-500/60 hover:border-red-400 text-left cursor-pointer transition-all hover:scale-[1.02]"
              >
                <div className="text-[10px] text-red-400 font-bold flex items-center justify-between">
                  <span>👑 NORMAL OWNER</span>
                  <span className="text-red-300 font-tech font-bold text-xs">1234567</span>
                </div>
                <div className="text-white text-xs font-bold mt-0.5">Tony Stark</div>
                <div className="text-[9px] text-gray-400 mt-1">Founder Executive Access</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPinInput('201770');
                  const res = unlockOwnerWithPin('201770');
                  if (res.success) {
                    addToast({
                      title: 'Owner Clearance Granted',
                      message: 'Welcome, Pepper Potts. Normal Owner Console online.',
                      type: 'protocol',
                    });
                  }
                }}
                className="p-2.5 rounded-xl bg-gradient-to-r from-pink-950/80 to-gray-900 border border-pink-500/60 hover:border-pink-400 text-left cursor-pointer transition-all hover:scale-[1.02]"
              >
                <div className="text-[10px] text-pink-400 font-bold flex items-center justify-between">
                  <span>👑 NORMAL OWNER</span>
                  <span className="text-pink-300 font-tech font-bold text-xs">201770</span>
                </div>
                <div className="text-white text-xs font-bold mt-0.5">Pepper Potts</div>
                <div className="text-[9px] text-gray-400 mt-1">CEO Executive Access</div>
              </button>
            </div>

            {/* Complete 10 Accounts Quick Matrix */}
            <div className="bg-gray-900/90 rounded-2xl p-3 border border-gray-800 space-y-2">
              <span className="text-[10px] font-mono text-gray-400 block font-bold">
                ALL 10 OWNER ACCOUNTS & PASSCODES:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {ownerAccounts.map((acc, idx) => (
                  <div
                    key={acc.id}
                    className="p-2 rounded-xl bg-gray-950/70 border border-gray-800 flex items-center justify-between text-xs font-mono hover:border-gray-700"
                  >
                    <div className="truncate pr-2">
                      <div className="text-white font-bold truncate text-[11px] flex items-center gap-1">
                        <span>#{idx + 1} {acc.name}</span>
                        {acc.isMasterCreator && <Crown className="w-3 h-3 text-amber-400 shrink-0" />}
                      </div>
                      <div className="text-[9px] text-gray-400 truncate">
                        Passcode: <span className="text-amber-300 font-bold">{acc.password}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPinInput(acc.password);
                        const res = unlockOwnerWithPin(acc.password);
                        if (res.success) {
                          addToast({
                            title: `Logged in as ${acc.name}`,
                            message: `Clearance: ${acc.clearanceLevel}`,
                            type: 'protocol',
                          });
                        }
                      }}
                      className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 text-[10px] font-bold shrink-0 cursor-pointer"
                    >
                      LOGIN
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-gray-500 font-mono pt-2">
            🔒 Protected by Stark Cybernetics • Biometric Clearance Required
          </div>
        </div>
      </div>
    );
  }

  // SICK CONTROLS ACTIONS
  const handleToggleArcOverdrive = () => {
    const next = !systemControls.arcOverdrive;
    updateSystemControls({ arcOverdrive: next });
    if (next) {
      soundFx.playRepulsorBlast();
      jarvisVoice.speak('Arc core limiters disengaged. Output overcharged to 300 percent, Mr. Stark.');
      addAuditLog(currentAccount.name, 'ARC OVERDRIVE ENGAGED', 'CRITICAL', 'Core power limiters bypassed. Output pegged at 300% (13.5 GW).');
      addToast({
        title: '⚡ ARC CORE OVERDRIVE AT 300%',
        message: 'Tri-arc plasma capacitors energized to maximum theoretical threshold!',
        type: 'alert',
      });
    } else {
      soundFx.playArcReactorPulse();
      jarvisVoice.speak('Arc core returned to nominal 100 percent governor.');
      addAuditLog(currentAccount.name, 'ARC GOVERNOR RESTORED', 'COMMAND', 'Core returned to 100% nominal output.');
      addToast({
        title: 'Arc Core Nominal',
        message: 'Core throttled back to 100% stable operating envelope.',
        type: 'status',
      });
    }
  };

  const handleToggleDefenseThreat = (level: 'NOMINAL' | 'DEFCON_2' | 'OMEGA_LOCKDOWN') => {
    updateSystemControls({ defenseGridThreat: level });
    if (level === 'OMEGA_LOCKDOWN') {
      soundFx.playHudBeep('alert');
      jarvisVoice.speak('Code Red Omega Lockdown activated! Blast doors sealed across all 93 floors of Stark Tower.');
      addAuditLog(currentAccount.name, 'OMEGA LOCKDOWN ARMED', 'CRITICAL', 'Full titanium shutter seal deployed across Stark Tower complex.');
      addToast({
        title: '🚨 OMEGA LOCKDOWN ARMED',
        message: 'Stark Tower perimeter sealed. Kinetic sentry repulsors on automated kill-switch.',
        type: 'alert',
      });
    } else if (level === 'DEFCON_2') {
      soundFx.playHudBeep('alert');
      jarvisVoice.speak('Defcon 2 elevated threat armed. Satellite radar scanned.');
      addAuditLog(currentAccount.name, 'DEFCON 2 ARMED', 'COMMAND', 'Elevated orbital radar tracking active.');
      addToast({
        title: 'DEFCON 2 Threat State',
        message: 'Radar scanning airspace for supersonic bogies.',
        type: 'tactical',
      });
    } else {
      soundFx.playHudBeep('confirm');
      jarvisVoice.speak('Perimeter status returned to nominal.');
      addAuditLog(currentAccount.name, 'DEFENSE GRID NOMINAL', 'SUCCESS', 'All threat alerts disengaged.');
      addToast({
        title: 'Defense Grid Nominal',
        message: 'Perimeter secure. All systems green.',
        type: 'status',
      });
    }
  };

  const handleScrambleHouseParty = () => {
    const next = !systemControls.housePartyActive;
    updateSystemControls({ housePartyActive: next });
    if (next) {
      soundFx.playRepulsorBlast();
      jarvisVoice.speak('House Party Protocol verified! All 85 Iron Man suits scrambling from subterranean wine cellar.');
      addAuditLog(currentAccount.name, 'HOUSE PARTY PROTOCOL SCRAMBLED', 'CRITICAL', 'All 85 Marks airborne on remote telepresence grid.');
      addToast({
        title: '🚀 HOUSE PARTY SQUADRON AIRBORNE',
        message: 'Marks 1 through 85 launched simultaneously on swarm neural link!',
        type: 'alert',
      });
    } else {
      soundFx.playHudBeep('mode');
      jarvisVoice.speak('All suits ordered back to subterranean gantry docking stations.');
      addAuditLog(currentAccount.name, 'HOUSE PARTY SUITS RECALLED', 'COMMAND', 'Suits returning to Malibu vault.');
      addToast({
        title: 'House Party Suits Recalled',
        message: 'Armor squadron safely docked in subterranean holding bays.',
        type: 'status',
      });
    }
  };

  const handleInjectVaultLiquidity = () => {
    soundFx.playArcReactorPulse();
    const newBal = systemControls.vaultSimBalance + 100000;
    updateSystemControls({ vaultSimBalance: newBal });
    jarvisVoice.speak('One hundred thousand dollars simulated liquidity credited to Stark Treasury.');
    addAuditLog(currentAccount.name, 'TREASURY LIQUIDITY INJECTION', 'SUCCESS', 'Simulated capital transfer of +$100,000 completed.');
    addToast({
      title: 'Vault Capital Injected',
      message: `+$100,000 USD added to reserve pool. Total Balance: $${newBal.toLocaleString()}`,
      type: 'protocol',
    });
  };

  const handleTriggerEmpWave = () => {
    soundFx.playRepulsorBlast();
    updateSystemControls({ empPulseTriggered: true });
    jarvisVoice.speak('Electromagnetic pulse discharged! Local threat telemetry wiped clean.');
    addAuditLog(currentAccount.name, 'EMP PULSE DISCHARGED', 'CRITICAL', '500-megawatt electromagnetic burst cleared all active radar signatures.');
    addToast({
      title: '⚡ 500MW EMP PULSE DISCHARGED',
      message: 'All hostile radar locks and sensor interference purged!',
      type: 'alert',
    });
    setTimeout(() => {
      updateSystemControls({ empPulseTriggered: false });
    }, 3000);
  };

  const handleTestSpeech = () => {
    if (!testSpeechText.trim()) return;
    soundFx.playHudBeep('confirm');
    jarvisVoice.speak(testSpeechText.trim());
    addToast({
      title: 'Voice Synthesizer Test',
      message: `Announced: "${testSpeechText.trim()}"`,
      type: 'status',
    });
  };

  return (
    <div className={`space-y-6 ${systemControls.defenseGridThreat === 'OMEGA_LOCKDOWN' ? 'border-2 border-red-500 p-4 rounded-3xl bg-red-950/20' : ''}`}>
      {/* Top Executive Header */}
      <div className="bg-gradient-to-r from-amber-950/80 via-gray-900 to-slate-900 border-2 border-amber-500/60 rounded-3xl p-5 sm:p-6 shadow-[0_0_35px_rgba(245,158,11,0.25)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-left">
          <div className="relative">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-gray-950 font-tech font-bold text-xl shadow-[0_0_20px_rgba(245,158,11,0.6)]"
              style={{ backgroundColor: currentAccount.avatarColor }}
            >
              {currentAccount.name.slice(0, 2).toUpperCase()}
            </div>
            {currentAccount.isMasterCreator && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-gray-950 rounded-full p-1 shadow">
                <Crown className="w-3 h-3" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/50">
                {currentAccount.clearanceLevel}
              </span>
              <span className={`text-xs font-mono font-bold ${currentAccount.isSuspended ? 'text-red-400' : 'text-emerald-400'}`}>
                {currentAccount.isSuspended ? 'FROZEN / SUSPENDED' : currentAccount.status}
              </span>
            </div>
            <h2 className="text-xl font-tech font-bold text-white tracking-wide mt-0.5">
              CURRENT TERMINAL COMMAND: {currentAccount.name}
            </h2>
            <p className="text-xs text-gray-300 font-sans">
              {currentAccount.role} • <span className="text-amber-400 font-mono">{currentAccount.department}</span>
            </p>
          </div>
        </div>

        {/* Top Actions: Lock Owner / Status */}
        <div className="flex items-center gap-2">
          {/* Classified Publish Status Indicator (NO EXPOSED PASSWORDS) */}
          <div className={`px-3 py-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 ${
            isMasterPublishUnlocked
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              : 'bg-red-950/80 border-red-500 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
          }`}>
            {isMasterPublishUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>
              {isMasterPublishUnlocked ? 'PUBLISH PIPELINE: UNLOCKED' : 'PUBLISH PIPELINE: RESTRICTED'}
            </span>
          </div>

          {/* Change Current Owner Passcode (PS) */}
          <button
            onClick={() => {
              setChangingPasswordAccount(currentAccount);
              setNewPasswordInput(currentAccount.password);
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-mono text-xs cursor-pointer transition-all flex items-center gap-1.5"
            title="Change your personal owner passcode (PS)"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>CHANGE MY PS ({currentAccount.password})</span>
          </button>

          <button
            onClick={lockOwner}
            className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 font-mono text-xs cursor-pointer transition-all flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>LOCK SUITE</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-800 pb-2 overflow-x-auto">
        {[
          { id: 'accounts', label: '👥 Executive Account Command (Control Any Account)', icon: <Users className="w-4 h-4 text-cyan-400" /> },
          { id: 'controls', label: '⚡ Sick Overdrive Controls', icon: <Zap className="w-4 h-4 text-amber-400" /> },
          { id: 'publishing', label: '🔒 Master Creator Publishing Gate', icon: <KeyRound className="w-4 h-4 text-emerald-400" /> },
          { id: 'logs', label: '📋 Live Security Audit Logs', icon: <Terminal className="w-4 h-4 text-purple-400" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              soundFx.playHudBeep('subtle');
              setActiveSubTab(tab.id as any);
            }}
            className={`px-4 py-2.5 rounded-xl font-tech font-bold text-xs flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
              activeSubTab === tab.id
                ? 'bg-amber-500 text-gray-950 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                : 'bg-gray-900/80 border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: EXECUTIVE ACCOUNT COMMAND (CONTROL ANY ACCOUNT)                 */}
      {/* ===================================================================== */}
      {activeSubTab === 'accounts' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-3">
            <div>
              <h3 className="font-tech text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <span>EXECUTIVE ACCOUNT COMMAND CONSOLE ({ownerAccounts.length} ACCOUNTS)</span>
              </h3>
              <p className="text-xs text-gray-400 font-sans mt-0.5">
                Full authority to assume command, toggle individual tactical permissions, dispatch real-time orders, and freeze or edit any account.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddAccountModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-gray-950 font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD NEW OWNER ACCOUNT</span>
              </button>

              <button
                onClick={resetToDefaultAccounts}
                title="Restore the 10 original Stark Executive accounts"
                className="px-2.5 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white border border-gray-700 font-mono text-xs flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET 10 DEFAULTS</span>
              </button>
            </div>
          </div>

          {/* Accounts Grid with Direct Command Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {ownerAccounts.map((acc, index) => {
              const isCurrent = currentAccount.id === acc.id;
              const isSuspended = acc.isSuspended;
              return (
                <div
                  key={acc.id}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-amber-950/30 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.3)]'
                      : isSuspended
                      ? 'bg-red-950/20 border-red-500/50'
                      : 'bg-gray-900/80 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-950 font-tech font-bold text-base shrink-0 shadow"
                          style={{ backgroundColor: acc.avatarColor }}
                        >
                          #{index + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-tech font-bold text-white text-base">
                              {acc.name}
                            </h4>
                            {acc.isMasterCreator && (
                              <span title="Master Creator">
                                <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-gray-400 block">
                            @{acc.handle}
                          </span>
                          {acc.email && (
                            <span className="text-[10px] font-mono text-amber-300/90 block">
                              ✉ {acc.email}
                            </span>
                          )}
                          {acc.githubHandle && (
                            <span className="text-[10px] font-mono text-cyan-400/90 block">
                              ⌥ github.com/{acc.githubHandle}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gray-950 border border-gray-700 text-amber-300">
                          {acc.badge}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          isSuspended ? 'bg-red-950 text-red-300 border border-red-500/50' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {isSuspended ? 'CREDENTIALS FROZEN' : acc.status}
                        </span>
                      </div>
                    </div>

                    {/* Role & Clearance Card */}
                    <div className="p-3 bg-gray-950/80 rounded-xl border border-gray-800 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-gray-400">CLEARANCE:</span>
                        <span className="text-cyan-300 font-mono font-bold">{acc.clearanceLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">ROLE:</span>
                        <span className="text-gray-200 font-sans">{acc.role}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">DEPARTMENT:</span>
                        <span className="text-amber-400 font-mono">{acc.department}</span>
                      </div>
                      {acc.customStatusMessage && (
                        <div className="pt-1 border-t border-gray-800 text-[11px] text-gray-400 italic">
                          " {acc.customStatusMessage} "
                        </div>
                      )}
                    </div>

                    {/* Passcode & Dedicated Portal URL Card */}
                    <div className="p-3 bg-amber-950/20 rounded-xl border border-amber-500/30 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-amber-300 font-mono font-bold text-[11px]">
                          <Key className="w-3.5 h-3.5 text-amber-400" />
                          <span>PASSCODE:</span>
                          <span className="px-2 py-0.5 rounded bg-gray-900 border border-amber-500/50 text-amber-200 tracking-wider">
                            {acc.password}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setChangingPasswordAccount(acc);
                              setNewPasswordInput(acc.password);
                            }}
                            className="px-2 py-1 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/50 text-cyan-200 font-mono text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                            title={`Change passcode for ${acc.name}`}
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>CHANGE PS</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(acc.password);
                              addToast({
                                title: 'Passcode Copied',
                                message: `Passcode "${acc.password}" copied for ${acc.name}!`,
                                type: 'status',
                              });
                            }}
                            className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                          >
                            <Copy className="w-3 h-3" />
                            <span>COPY PIN</span>
                          </button>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-amber-500/20 flex flex-col gap-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                          <span className="flex items-center gap-1 text-cyan-300">
                            <Globe className="w-3 h-3" />
                            <span>DEDICATED PORTAL URL:</span>
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                const fullUrl = `${window.location.origin}${acc.portalUrl || `/?portal=owner&acc=${acc.id}`}`;
                                navigator.clipboard?.writeText(fullUrl);
                                addToast({
                                  title: 'Portal URL Copied',
                                  message: `Personal URL for ${acc.name} copied!`,
                                  type: 'status',
                                });
                              }}
                              className="px-2 py-0.5 rounded bg-gray-900 hover:bg-gray-800 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] flex items-center gap-1 cursor-pointer"
                            >
                              <Copy className="w-2.5 h-2.5" />
                              <span>COPY URL</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                switchAccount(acc.id);
                                window.history.pushState({}, '', acc.portalUrl || `/?portal=owner&acc=${acc.id}`);
                                addToast({
                                  title: 'Switched to Dedicated Portal',
                                  message: `Active session linked to ${acc.name}`,
                                  type: 'protocol',
                                });
                              }}
                              className="px-2 py-0.5 rounded bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/50 text-cyan-200 font-mono text-[10px] flex items-center gap-1 cursor-pointer"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              <span>LINK</span>
                            </button>
                          </div>
                        </div>
                        <div className="text-[10px] font-mono text-cyan-200 bg-gray-950 px-2 py-1 rounded border border-gray-800 truncate select-all">
                          {typeof window !== 'undefined' ? `${window.location.origin}${acc.portalUrl || `/?portal=owner&acc=${acc.id}`}` : acc.portalUrl}
                        </div>
                      </div>
                    </div>

                    {/* Permissions Quick Matrix */}
                    <div className="bg-gray-950/50 p-2.5 rounded-xl border border-gray-800 space-y-1.5">
                      <div className="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wider flex items-center justify-between">
                        <span>TACTICAL PERMISSIONS MATRIX:</span>
                        <span className="text-amber-400">TOGGLEABLE</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { key: 'canFireWeapons', label: 'Repulsor Weapons', active: acc.permissions?.canFireWeapons },
                          { key: 'canAccessVault', label: 'Treasury Vault', active: acc.permissions?.canAccessVault },
                          { key: 'canOverrideDefense', label: 'Defense Grid', active: acc.permissions?.canOverrideDefense },
                          { key: 'canAccessCameras', label: 'Stark CCTV', active: acc.permissions?.canAccessCameras },
                          { key: 'canScrambleHouseParty', label: 'House Party', active: acc.permissions?.canScrambleHouseParty },
                        ].map((p) => (
                          <button
                            key={p.key}
                            onClick={() => toggleAccountPermission(acc.id, p.key as any)}
                            title={`Toggle ${p.label} for ${acc.name}`}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer transition-all border ${
                              p.active
                                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                                : 'bg-gray-900 border-gray-800 text-gray-500 hover:text-gray-300'
                            }`}
                          >
                            {p.active ? '✓' : '✗'} {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Direct Directive Dispatcher */}
                    <div className="flex items-center gap-1.5 bg-gray-950 p-1.5 rounded-xl border border-gray-800">
                      <input
                        type="text"
                        placeholder={`Order ${acc.name.split(' ')[0]}...`}
                        value={directiveInputs[acc.id] || ''}
                        onChange={(e) => setDirectiveInputs({ ...directiveInputs, [acc.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendDirective(acc.id);
                        }}
                        className="flex-1 bg-transparent px-2.5 py-1 text-xs text-white outline-none placeholder:text-gray-600 font-sans"
                      />
                      <button
                        onClick={() => handleSendDirective(acc.id)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>DISPATCH</span>
                      </button>
                    </div>

                    {acc.lastExecutiveDirective && (
                      <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 p-2 rounded-lg border border-cyan-500/30">
                        ⚡ Active Directive: {acc.lastExecutiveDirective}
                      </div>
                    )}
                  </div>

                  {/* Primary Command Actions */}
                  <div className="mt-4 pt-3 border-t border-gray-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {/* Assume Direct Control */}
                      <button
                        onClick={() => assumeControlOfAccount(acc.id)}
                        className={`px-3 py-1.5 rounded-xl font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                          isCurrent
                            ? 'bg-amber-500 text-gray-950 shadow'
                            : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{isCurrent ? 'COMMAND ACTIVE' : 'TAKE COMMAND'}</span>
                      </button>

                      {/* Manage & Edit Drawer */}
                      <button
                        onClick={() => handleOpenAccountControl(acc)}
                        className="px-2.5 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-mono text-xs flex items-center gap-1 cursor-pointer"
                        title="Configure profile and deep controls"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>MANAGE</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Freeze / Unfreeze */}
                      <button
                        onClick={() => toggleAccountSuspension(acc.id)}
                        className={`px-2.5 py-1.5 rounded-xl font-mono text-xs flex items-center gap-1 cursor-pointer transition-all ${
                          isSuspended
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-300'
                        }`}
                        title={isSuspended ? "Restore credentials" : "Remotely freeze account"}
                      >
                        <UserX className="w-3.5 h-3.5" />
                        <span>{isSuspended ? 'UNFREEZE' : 'FREEZE'}</span>
                      </button>

                      {/* Delete Account (Only for custom accounts) */}
                      {!acc.isMasterCreator && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${acc.name} from the Executive Registry?`)) {
                              deleteAccount(acc.id);
                            }
                          }}
                          className="p-1.5 rounded-xl bg-gray-800 hover:bg-red-950 text-gray-400 hover:text-red-300 border border-gray-700 hover:border-red-500 transition-all cursor-pointer"
                          title="Purge account record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: SICK CONTROLS                                                 */}
      {/* ===================================================================== */}
      {activeSubTab === 'controls' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Control 1: Arc Core Overdrive 300% */}
            <div className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
              systemControls.arcOverdrive
                ? 'bg-gradient-to-br from-amber-950/60 to-red-950/40 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.4)]'
                : 'bg-gray-900/80 border-gray-800'
            }`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/40">
                    POWER SUBSYSTEM
                  </span>
                  <span className={`text-xs font-mono font-bold ${systemControls.arcOverdrive ? 'text-red-400 animate-pulse' : 'text-gray-400'}`}>
                    {systemControls.arcOverdrive ? '300% OVERDRIVE' : '100% NOMINAL'}
                  </span>
                </div>
                <h3 className="text-base font-tech font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span>ARC CORE OVERDRIVE (300%)</span>
                </h3>
                <p className="text-xs text-gray-300 font-sans leading-relaxed">
                  Bypasses the safety governor on Tony Stark's chest Arc Reactor. Boosts repulsor plasma yield by 3x.
                </p>
              </div>

              <button
                onClick={handleToggleArcOverdrive}
                className={`mt-4 w-full py-2.5 rounded-xl font-tech font-bold text-xs cursor-pointer transition-all shadow ${
                  systemControls.arcOverdrive
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)]'
                    : 'bg-amber-500 hover:bg-amber-400 text-gray-950'
                }`}
              >
                {systemControls.arcOverdrive ? 'DISENGAGE OVERDRIVE (RETURN TO 100%)' : 'ENGAGE 300% ARC OVERDRIVE'}
              </button>
            </div>

            {/* Control 2: House Party Protocol Remote Strike */}
            <div className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
              systemControls.housePartyActive
                ? 'bg-gradient-to-br from-red-950/60 to-amber-950/40 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]'
                : 'bg-gray-900/80 border-gray-800'
            }`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-500/40">
                    FLEET DEPLOYMENT
                  </span>
                  <span className={`text-xs font-mono font-bold ${systemControls.housePartyActive ? 'text-red-400 animate-pulse' : 'text-gray-400'}`}>
                    {systemControls.housePartyActive ? '85 SUITS AIRBORNE' : 'VAULT DOCKED'}
                  </span>
                </div>
                <h3 className="text-base font-tech font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-400" />
                  <span>HOUSE PARTY PROTOCOL</span>
                </h3>
                <p className="text-xs text-gray-300 font-sans leading-relaxed">
                  Remote scrambles all 85 Iron Man suits (Mark 1 through Mark 85) simultaneously from subterranean holding silos.
                </p>
              </div>

              <button
                onClick={handleScrambleHouseParty}
                className={`mt-4 w-full py-2.5 rounded-xl font-tech font-bold text-xs cursor-pointer transition-all shadow ${
                  systemControls.housePartyActive
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                }`}
              >
                {systemControls.housePartyActive ? 'RECALL SQUADRON TO MALIBU' : 'SCRAMBLE ALL 85 SUITS (ALPHA STRIKE)'}
              </button>
            </div>

            {/* Control 3: Stark Tower Defense Grid & Omega Lockdown */}
            <div className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
              systemControls.defenseGridThreat === 'OMEGA_LOCKDOWN'
                ? 'bg-red-950/70 border-red-500 shadow-[0_0_35px_rgba(239,68,68,0.6)] animate-pulse'
                : 'bg-gray-900/80 border-gray-800'
            }`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-500/40">
                    PERIMETER DEFENSE
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {systemControls.defenseGridThreat}
                  </span>
                </div>
                <h3 className="text-base font-tech font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                  <span>STARK TOWER DEFENSE GRID</span>
                </h3>
                <p className="text-xs text-gray-300 font-sans leading-relaxed">
                  Triggers pneumatic titanium blast shutters across all 93 penthouse floors and arms automated exterior turrets.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-1.5 mt-4">
                <button
                  onClick={() => handleToggleDefenseThreat('NOMINAL')}
                  className={`py-2 rounded-lg font-mono text-[10px] font-bold cursor-pointer transition-all ${
                    systemControls.defenseGridThreat === 'NOMINAL'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  NOMINAL
                </button>
                <button
                  onClick={() => handleToggleDefenseThreat('DEFCON_2')}
                  className={`py-2 rounded-lg font-mono text-[10px] font-bold cursor-pointer transition-all ${
                    systemControls.defenseGridThreat === 'DEFCON_2'
                      ? 'bg-amber-500 text-gray-950 font-extrabold'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  DEFCON 2
                </button>
                <button
                  onClick={() => handleToggleDefenseThreat('OMEGA_LOCKDOWN')}
                  className={`py-2 rounded-lg font-mono text-[10px] font-bold cursor-pointer transition-all ${
                    systemControls.defenseGridThreat === 'OMEGA_LOCKDOWN'
                      ? 'bg-red-600 text-white font-extrabold shadow-[0_0_15px_rgba(239,68,68,0.8)]'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  OMEGA
                </button>
              </div>
            </div>

            {/* Control 4: Executive Treasury Liquidity Injection */}
            <div className="p-5 rounded-2xl border-2 border-gray-800 bg-gray-900/80 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                    TREASURY & SEED
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-300">
                    ${systemControls.vaultSimBalance.toLocaleString()} USD
                  </span>
                </div>
                <h3 className="text-base font-tech font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span>VAULT CAPITAL INJECTION</span>
                </h3>
                <p className="text-xs text-gray-300 font-sans leading-relaxed">
                  Simulate direct balance infusion into the Stark Seed Treasury to underwrite new Google & Apple store releases.
                </p>
              </div>

              <button
                onClick={handleInjectVaultLiquidity}
                className="mt-4 w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-tech font-bold text-xs cursor-pointer transition-all shadow"
              >
                + INJECT $100,000 USD (RS. 30M LKR)
              </button>
            </div>

            {/* Control 5: Global EMP Shockwave */}
            <div className="p-5 rounded-2xl border-2 border-gray-800 bg-gray-900/80 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
                    TACTICAL DISRUPTION
                  </span>
                  <span className="text-xs font-mono text-cyan-400">
                    {systemControls.empPulseTriggered ? 'BURST DISCHARGED' : 'CHARGED'}
                  </span>
                </div>
                <h3 className="text-base font-tech font-bold text-white flex items-center gap-2">
                  <Radio className="w-5 h-5 text-cyan-400" />
                  <span>500MW EMP RADAR PURGE</span>
                </h3>
                <p className="text-xs text-gray-300 font-sans leading-relaxed">
                  Detonate an orbital EMP wave that clears all hostile radar signatures and resets spatial tracking arrays.
                </p>
              </div>

              <button
                onClick={handleTriggerEmpWave}
                className="mt-4 w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-gray-950 font-tech font-bold text-xs cursor-pointer transition-all shadow"
              >
                DETONATE 500MW EMP WAVE
              </button>
            </div>

            {/* Control 6: Master Voice Synthesizer Broadcast */}
            <div className="p-5 rounded-2xl border-2 border-gray-800 bg-gray-900/80 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-500/40">
                    AUDIO CORE OVERRIDE
                  </span>
                  <span className="text-xs font-mono text-blue-400">
                    LIVE SPEECH
                  </span>
                </div>
                <h3 className="text-base font-tech font-bold text-white flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-blue-400" />
                  <span>VOICE BROADCAST OVERRIDE</span>
                </h3>
                <input
                  type="text"
                  value={testSpeechText}
                  onChange={(e) => setTestSpeechText(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-1.5 text-white font-sans text-xs outline-none"
                  placeholder="Type any announcement for Jarvis..."
                />
              </div>

              <button
                onClick={handleTestSpeech}
                className="mt-4 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-tech font-bold text-xs cursor-pointer transition-all shadow"
              >
                BROADCAST THROUGH J.A.R.V.I.S.
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: MASTER CREATOR PUBLISHING & INSTALL GATE                        */}
      {/* ===================================================================== */}
      {activeSubTab === 'publishing' && (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-gray-900 via-amber-950/30 to-gray-900 border-2 border-amber-500/60 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-500 flex items-center justify-center text-amber-400 shadow">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/40">
                  CLASSIFIED SECURITY DIRECTIVE
                </span>
                <h3 className="text-lg font-tech font-bold text-white tracking-wide">
                  INSTALL & PUBLISH ACCESS GATEWAY
                </h3>
              </div>
            </div>

            <p className="text-xs text-gray-300 font-sans leading-relaxed max-w-2xl">
              Per executive security directives, <strong>all Install & Publish buttons across the application</strong> are strictly locked. Only the Lead System Creator with the classified master passcode can bypass the gate to access the native app distribution commands, Electron packaging scripts, APK downloads, or PWA installers.
            </p>

            <div className="p-4 bg-gray-950 rounded-2xl border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-gray-400 block">CURRENT PUBLISH PIPELINE STATUS:</span>
                <span className={`text-base font-tech font-bold flex items-center gap-2 ${
                  isMasterPublishUnlocked ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {isMasterPublishUnlocked ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  <span>{isMasterPublishUnlocked ? 'PIPELINE UNLOCKED (CREATOR AUTHORIZED)' : 'PIPELINE RESTRICTED (CREATOR PASSCODE REQUIRED)'}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isMasterPublishUnlocked ? (
                  <button
                    onClick={lockMasterPublish}
                    className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-tech font-bold text-xs cursor-pointer shadow transition-all flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>RELOCK PIPELINE NOW</span>
                  </button>
                ) : (
                  <button
                    onClick={() => requireMasterPublishAccess(() => {})}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-gray-950 font-tech font-bold text-xs cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all flex items-center gap-2"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>AUTHENTICATE CREATOR ACCESS</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    requireMasterPublishAccess(() => {
                      onOpenPublishing();
                    });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white border border-gray-700 font-tech font-bold text-xs cursor-pointer transition-all flex items-center gap-2"
                >
                  <FolderDown className="w-4 h-4" />
                  <span>TEST ACCESS TO PUBLISHING CENTER</span>
                </button>
              </div>
            </div>

            {/* Direct Windows .exe & GitHub Repository Action Card */}
            <div className="p-5 bg-gradient-to-r from-gray-950 via-slate-900 to-cyan-950/40 border border-cyan-500/40 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gray-900 border border-cyan-400 flex items-center justify-center text-cyan-300">
                    <Github className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-tech text-sm font-bold text-white">
                      OFFICIAL GITHUB REPO & WINDOWS .EXE RELEASE
                    </h4>
                    <span className="text-[11px] font-mono text-cyan-300">
                      Release v1.0.0 · JARVIS-IronMan-Gauntlet-Setup.exe (Windows 10 / 11)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="/api/download/jarvis-gauntlet-setup.exe"
                    download="JARVIS-IronMan-Gauntlet-Setup.exe"
                    onClick={(e) => {
                      if (!isMasterPublishUnlocked) {
                        e.preventDefault();
                        requireMasterPublishAccess(() => {
                          const link = document.createElement('a');
                          link.href = '/api/download/jarvis-gauntlet-setup.exe';
                          link.download = 'JARVIS-IronMan-Gauntlet-Setup.exe';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        });
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow border border-cyan-400/40 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>DOWNLOAD .EXE</span>
                  </a>

                  <a
                    href="https://github.com/dushi2933/DUS-JARVIS"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!isMasterPublishUnlocked) {
                        e.preventDefault();
                        requireMasterPublishAccess(() => {
                          window.open('https://github.com/dushi2933/DUS-JARVIS', '_blank');
                        });
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white border border-gray-600 font-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GITHUB</span>
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: LIVE SECURITY AUDIT LOGS                                       */}
      {/* ===================================================================== */}
      {activeSubTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div>
              <h3 className="font-tech text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-purple-400" />
                <span>CHRONOLOGICAL SECURITY AUDIT TRAIL</span>
              </h3>
              <p className="text-xs text-gray-400 font-sans mt-0.5">
                Immutable runtime ledger recording all owner authentications, master pass entries, and protocol overrides.
              </p>
            </div>
            <span className="text-xs font-mono text-purple-400 font-bold bg-purple-950 px-2 py-0.5 rounded border border-purple-500/40">
              {auditLogs.length} EVENTS RECORDED
            </span>
          </div>

          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 font-mono text-xs space-y-2 max-h-96 overflow-y-auto">
            {auditLogs.map((log) => (
              <div 
                key={log.id} 
                className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-[10px]">{log.timestamp}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.type === 'SUCCESS'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                      : log.type === 'CRITICAL'
                      ? 'bg-red-950 text-red-400 border border-red-500/40'
                      : log.type === 'DENIED'
                      ? 'bg-amber-950 text-amber-400 border border-amber-500/40'
                      : 'bg-blue-950 text-blue-400 border border-blue-500/40'
                  }`}>
                    {log.type}
                  </span>
                  <span className="text-amber-300 font-bold">{log.actor}</span>
                  <span className="text-gray-300">» {log.action}</span>
                </div>
                <span className="text-[11px] text-gray-400 sm:text-right">{log.details}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: MANAGE & CONFIGURE SPECIFIC ACCOUNT                            */}
      {/* ===================================================================== */}
      {managingAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/90 backdrop-blur-md">
          <div className="bg-gray-900 border-2 border-amber-500/80 rounded-3xl max-w-xl w-full p-6 relative shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setManagingAccount(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-gray-800 pb-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-950 font-tech font-bold text-base shrink-0 shadow"
                style={{ backgroundColor: managingAccount.avatarColor }}
              >
                {managingAccount.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                  EXECUTIVE ACCOUNT CONTROL SUITE
                </span>
                <h3 className="text-lg font-tech font-bold text-white">
                  {managingAccount.name} (@{managingAccount.handle})
                </h3>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  assumeControlOfAccount(managingAccount.id);
                  setManagingAccount(null);
                }}
                className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-tech font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
              >
                <UserCheck className="w-4 h-4" />
                <span>ASSUME DIRECT COMMAND</span>
              </button>

              <button
                onClick={() => {
                  toggleAccountSuspension(managingAccount.id);
                  setManagingAccount((prev) => prev ? { ...prev, isSuspended: !prev.isSuspended } : null);
                }}
                className={`py-2.5 px-3 rounded-xl font-tech font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  managingAccount.isSuspended
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-red-950 hover:bg-red-900 text-red-300 border border-red-500/40'
                }`}
              >
                <UserX className="w-4 h-4" />
                <span>{managingAccount.isSuspended ? 'RESTORE CREDENTIALS' : 'FREEZE CREDENTIALS'}</span>
              </button>
            </div>

            {/* Profile Fields Editor */}
            <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-300">EXECUTIVE CREDENTIALS:</span>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingProfile ? 'CANCEL EDIT' : 'EDIT CREDENTIALS'}</span>
                </button>
              </div>

              {isEditingProfile ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-mono text-gray-400 block mb-1">ROLE / TITLE:</label>
                    <input
                      type="text"
                      value={editFormData.role}
                      onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-gray-400 block mb-1">CLEARANCE LEVEL:</label>
                    <select
                      value={editFormData.clearanceLevel}
                      onChange={(e) => setEditFormData({ ...editFormData, clearanceLevel: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                    >
                      <option value="LEVEL 10 // OMEGA PRIME CREATOR">LEVEL 10 // OMEGA PRIME CREATOR</option>
                      <option value="LEVEL 10 // EXECUTIVE FOUNDER">LEVEL 10 // EXECUTIVE FOUNDER</option>
                      <option value="LEVEL 9 // CORPORATE & FISCAL OPS">LEVEL 9 // CORPORATE & FISCAL OPS</option>
                      <option value="LEVEL 9 // MILITARY & COMBAT DEFENSE">LEVEL 9 // MILITARY & COMBAT DEFENSE</option>
                      <option value="LEVEL 8 // BIOMETRICS & NANO RESEARCH">LEVEL 8 // BIOMETRICS & NANO RESEARCH</option>
                      <option value="LEVEL 8 // PHYSICAL SECURITY & TRANSPORT">LEVEL 8 // PHYSICAL SECURITY & TRANSPORT</option>
                      <option value="LEVEL 7 // FIELD TACTICAL & SENSORS">LEVEL 7 // FIELD TACTICAL & SENSORS</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-gray-400 block mb-1">DEPARTMENT:</label>
                    <input
                      type="text"
                      value={editFormData.department}
                      onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-gray-400 block mb-1">CUSTOM STATUS NOTE:</label>
                    <input
                      type="text"
                      value={editFormData.customStatusMessage}
                      onChange={(e) => setEditFormData({ ...editFormData, customStatusMessage: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-gray-400 block mb-1">PERSONAL PASSCODE / PIN:</label>
                    <input
                      type="text"
                      value={editFormData.password}
                      onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-amber-300 font-mono font-bold outline-none"
                    />
                  </div>
                  <button
                    onClick={handleSaveProfileEdit}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-tech font-bold text-xs cursor-pointer shadow"
                  >
                    SAVE CREDENTIAL CHANGES
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-900 items-center">
                    <span className="text-gray-400">Passcode (PS):</span>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-300 font-mono font-bold">{managingAccount.password}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setChangingPasswordAccount(managingAccount);
                          setNewPasswordInput(managingAccount.password);
                        }}
                        className="px-2 py-0.5 rounded bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 font-mono text-[10px] cursor-pointer"
                      >
                        CHANGE PS
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-900">
                    <span className="text-gray-400">Clearance:</span>
                    <span className="text-cyan-300 font-mono font-bold">{managingAccount.clearanceLevel}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-900">
                    <span className="text-gray-400">Role:</span>
                    <span className="text-white">{managingAccount.role}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-900">
                    <span className="text-gray-400">Department:</span>
                    <span className="text-amber-400 font-mono">{managingAccount.department}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-900">
                    <span className="text-gray-400">Portal URL:</span>
                    <span className="text-cyan-300 font-mono text-[11px] truncate max-w-[200px]">{managingAccount.portalUrl || `/?portal=owner&acc=${managingAccount.id}`}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">Bio:</span>
                    <span className="text-gray-300 text-right max-w-xs">{managingAccount.bio}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Tactical Permissions Toggles */}
            <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 space-y-2">
              <span className="text-xs font-mono font-bold text-amber-300 block">TACTICAL PERMISSION PRIVILEGES:</span>
              <div className="space-y-1.5">
                {[
                  { key: 'canFireWeapons', label: 'Repulsor Blast & Micro-Missiles' },
                  { key: 'canAccessVault', label: 'Treasury Vault & Seed Capital' },
                  { key: 'canOverrideDefense', label: 'Stark Tower Defense Grid' },
                  { key: 'canAccessCameras', label: 'CCTV Surveillance Camera Feeds' },
                  { key: 'canScrambleHouseParty', label: 'House Party Squadron Scramble' },
                ].map((p) => {
                  const isGranted = managingAccount.permissions?.[p.key as keyof OwnerAccountPermissions] ?? false;
                  return (
                    <div key={p.key} className="flex items-center justify-between p-2 rounded-xl bg-gray-900/60">
                      <span className="text-xs text-gray-300">{p.label}</span>
                      <button
                        onClick={() => {
                          toggleAccountPermission(managingAccount.id, p.key as any);
                          setManagingAccount((prev) => prev ? {
                            ...prev,
                            permissions: {
                              ...prev.permissions,
                              [p.key]: !isGranted
                            }
                          } : null);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                          isGranted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {isGranted ? 'GRANTED' : 'DENIED'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: REGISTER NEW OWNER ACCOUNT                                    */}
      {/* ===================================================================== */}
      {isAddAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/90 backdrop-blur-md">
          <div className="bg-gray-900 border-2 border-cyan-500/80 rounded-3xl max-w-md w-full p-6 relative shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddAccountModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-gray-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                  STARK EXECUTIVE REGISTRY
                </span>
                <h3 className="text-base font-tech font-bold text-white">
                  ENROLL NEW OWNER ACCOUNT
                </h3>
              </div>
            </div>

            <form onSubmit={handleCreateAccountSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-gray-300 block mb-1">FULL NAME:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Hansen, Nick Fury..."
                  value={newAccountData.name}
                  onChange={(e) => setNewAccountData({ ...newAccountData, name: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-300 block mb-1">HANDLE (@HANDLE):</label>
                <input
                  type="text"
                  placeholder="e.g. fury.shield"
                  value={newAccountData.handle}
                  onChange={(e) => setNewAccountData({ ...newAccountData, handle: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-300 block mb-1">PERSONAL PASSCODE / PIN:</label>
                <input
                  type="text"
                  placeholder="e.g. 556677 (or leave blank to auto-generate)"
                  value={newAccountData.password}
                  onChange={(e) => setNewAccountData({ ...newAccountData, password: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono font-bold outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-300 block mb-1">ROLE / TITLE:</label>
                <input
                  type="text"
                  placeholder="e.g. S.H.I.E.L.D. Director"
                  value={newAccountData.role}
                  onChange={(e) => setNewAccountData({ ...newAccountData, role: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-300 block mb-1">CLEARANCE LEVEL:</label>
                <select
                  value={newAccountData.clearanceLevel}
                  onChange={(e) => setNewAccountData({ ...newAccountData, clearanceLevel: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="LEVEL 9 // STRATEGIC ADVISOR">LEVEL 9 // STRATEGIC ADVISOR</option>
                  <option value="LEVEL 8 // TACTICAL ASSET">LEVEL 8 // TACTICAL ASSET</option>
                  <option value="LEVEL 7 // FIELD AGENT">LEVEL 7 // FIELD AGENT</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-300 block mb-1">AVATAR COLOR:</label>
                <div className="flex gap-2">
                  {['#06b6d4', '#f59e0b', '#ef4444', '#10b981', '#a855f7', '#ec4899', '#3b82f6'].map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setNewAccountData({ ...newAccountData, avatarColor: col })}
                      className={`w-7 h-7 rounded-lg cursor-pointer border-2 ${newAccountData.avatarColor === col ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-300 block mb-1">BIO / DESCRIPTION:</label>
                <textarea
                  rows={2}
                  placeholder="Asset description..."
                  value={newAccountData.bio}
                  onChange={(e) => setNewAccountData({ ...newAccountData, bio: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-gray-950 font-tech font-bold text-xs cursor-pointer shadow transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>CONFIRM & ENROLL ASSET</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Dedicated Change Passcode (PS) Modal */}
      {changingPasswordAccount && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gray-900 border-2 border-amber-500/80 rounded-3xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(245,158,11,0.35)] relative">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-tech font-bold text-gray-950 text-base shadow"
                  style={{ backgroundColor: changingPasswordAccount.avatarColor }}
                >
                  {changingPasswordAccount.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-tech text-base font-bold text-white flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-amber-400" />
                    <span>CHANGE PASSCODE (PS)</span>
                  </h3>
                  <p className="text-[11px] font-mono text-amber-300">Target Asset: {changingPasswordAccount.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChangingPasswordAccount(null)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePasswordChange} className="mt-4 space-y-4">
              <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 text-xs">
                <div className="flex justify-between items-center text-gray-400">
                  <span>CURRENT ACTIVE PASSCODE:</span>
                  <span className="font-mono text-amber-300 font-bold px-2 py-0.5 rounded bg-gray-900 border border-gray-700">
                    {changingPasswordAccount.password}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-gray-300 block mb-1 font-bold">
                  ENTER NEW PASSCODE / PIN:
                </label>
                <input
                  type="text"
                  required
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="e.g. 1234567, 201770, 888999, etc."
                  className="w-full bg-gray-950 border border-amber-500/60 rounded-xl px-3.5 py-2.5 text-base font-mono text-amber-300 font-bold outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  autoFocus
                />
                <span className="text-[10px] text-gray-500 font-mono mt-1 block">
                  This new passcode will immediately be required to log into this owner account.
                </span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-gray-400 font-bold uppercase">QUICK PRESETS:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['1234567', '201770', '2017', '999888', '777000'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setNewPasswordInput(preset)}
                      className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-amber-300 font-mono text-xs cursor-pointer transition-all"
                    >
                      {preset}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setNewPasswordInput(String(Math.floor(100000 + Math.random() * 900000)))}
                    className="px-2.5 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-mono text-xs cursor-pointer transition-all"
                  >
                    🎲 Random 6-Digit
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setChangingPasswordAccount(null)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono text-xs cursor-pointer transition-all"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-tech font-bold text-xs cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>SAVE NEW PASSCODE</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
