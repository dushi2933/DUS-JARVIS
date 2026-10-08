import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  OwnerAccount, 
  OwnerAccountPermissions,
  SecurityAuditLog, 
  OwnerSystemControls, 
  INITIAL_OWNER_ACCOUNTS 
} from '../types/ownerAuth';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';

interface OwnerAuthContextType {
  isOwnerUnlocked: boolean;
  isMasterPublishUnlocked: boolean;
  currentAccount: OwnerAccount;
  ownerAccounts: OwnerAccount[];
  auditLogs: SecurityAuditLog[];
  systemControls: OwnerSystemControls;
  isMasterGateModalOpen: boolean;
  
  // Authentication & Session
  unlockOwnerWithPin: (pin: string) => { success: boolean; message: string; isMaster: boolean };
  unlockMasterPublishWithPin: (pin: string) => { success: boolean; message: string };
  lockOwner: () => void;
  lockMasterPublish: () => void;
  switchAccount: (id: string) => void;
  
  // Full Account Command & Control
  updateAccount: (id: string, updates: Partial<OwnerAccount>) => void;
  changeAccountPassword: (id: string, newPassword: string) => void;
  assumeControlOfAccount: (id: string) => void;
  toggleAccountSuspension: (id: string) => void;
  toggleAccountPermission: (id: string, permKey: keyof OwnerAccountPermissions) => void;
  sendDirectiveToAccount: (id: string, directiveText: string) => void;
  createCustomAccount: (account: Omit<OwnerAccount, 'id' | 'joinedDate'>) => void;
  deleteAccount: (id: string) => { success: boolean; message: string };
  resetToDefaultAccounts: () => void;

  // System Overrides
  updateSystemControls: (updates: Partial<OwnerSystemControls>) => void;
  addAuditLog: (actor: string, action: string, type: 'SUCCESS' | 'DENIED' | 'CRITICAL' | 'COMMAND', details: string) => void;
  
  // Guard for Install / Publish buttons
  requireMasterPublishAccess: (callback: () => void) => void;
  closeMasterGateModal: () => void;
}

const OwnerAuthContext = createContext<OwnerAuthContextType | undefined>(undefined);

const MASTER_PUBLISH_KEY = '2017';
const OWNER_PASS_1 = '1234567';

export const OwnerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Owner Panel Unlock status
  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('stark_owner_unlocked') === 'true';
  });

  // Master Creator Install/Publish Key (2017) status - STRICTLY LOCKED (false) BY DEFAULT
  const [isMasterPublishUnlocked, setIsMasterPublishUnlocked] = useState<boolean>(false);

  // Clear any legacy storage on mount so Install/Publish is NEVER unlocked without entering PIN into the gate
  useEffect(() => {
    try {
      sessionStorage.removeItem('stark_master_publish_unlocked');
      localStorage.removeItem('stark_master_publish_unlocked');
    } catch (e) {
      // ignore
    }
  }, []);

  // 10 Owner Accounts list
  const [ownerAccounts, setOwnerAccounts] = useState<OwnerAccount[]>(() => {
    try {
      const saved = localStorage.getItem('stark_owner_accounts_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge to ensure each account has a valid password and portalUrl
          return parsed.map((item: any) => {
            const initial = INITIAL_OWNER_ACCOUNTS.find((init) => init.id === item.id);
            return {
              ...(initial || {}),
              ...item,
              password: item.password || initial?.password || '1234567',
              portalUrl: item.portalUrl || initial?.portalUrl || `/?portal=owner&acc=${item.id}`,
            };
          });
        }
      }
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_OWNER_ACCOUNTS;
  });

  // Current active profile
  const [currentAccountId, setCurrentAccountId] = useState<string>(() => {
    return localStorage.getItem('stark_current_owner_id') || 'owner-1';
  });

  // System Controls state (Sick Controls)
  const [systemControls, setSystemControls] = useState<OwnerSystemControls>(() => {
    try {
      const saved = localStorage.getItem('stark_system_controls');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return {
      arcOverdrive: false,
      defenseGridThreat: 'NOMINAL',
      housePartyActive: false,
      vaultSimBalance: 2500000,
      aiVoiceOverride: 'JARVIS',
      empPulseTriggered: false,
      repulsorSafetyOverride: true,
      soundAlertsActive: true,
    };
  });

  // Security Audit Log
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>(() => {
    try {
      const saved = localStorage.getItem('stark_security_audit_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return [
      {
        id: 'log-init-1',
        timestamp: new Date().toLocaleTimeString(),
        actor: 'SYSTEM KERNEL',
        action: 'STARK EXECUTIVE SECURITY PROTOCOL INITIALIZED',
        type: 'SUCCESS',
        details: '10 Executive Owner accounts loaded. Master Gate 2017 Armed.',
      },
    ];
  });

  // Gate Modal State
  const [isMasterGateModalOpen, setIsMasterGateModalOpen] = useState<boolean>(false);
  const [pendingPublishCallback, setPendingPublishCallback] = useState<(() => void) | null>(null);

  // Sync state to storage
  useEffect(() => {
    localStorage.setItem('stark_owner_unlocked', isOwnerUnlocked ? 'true' : 'false');
  }, [isOwnerUnlocked]);

  useEffect(() => {
    localStorage.setItem('stark_owner_accounts_list', JSON.stringify(ownerAccounts));
  }, [ownerAccounts]);

  useEffect(() => {
    localStorage.setItem('stark_current_owner_id', currentAccountId);
  }, [currentAccountId]);

  useEffect(() => {
    localStorage.setItem('stark_system_controls', JSON.stringify(systemControls));
  }, [systemControls]);

  useEffect(() => {
    localStorage.setItem('stark_security_audit_logs', JSON.stringify(auditLogs.slice(0, 50)));
  }, [auditLogs]);

  const addAuditLog = useCallback((
    actor: string, 
    action: string, 
    type: 'SUCCESS' | 'DENIED' | 'CRITICAL' | 'COMMAND', 
    details: string
  ) => {
    const newEntry: SecurityAuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      actor,
      action,
      type,
      details,
    };
    setAuditLogs((prev) => [newEntry, ...prev.slice(0, 49)]);
  }, []);

  const currentAccount = ownerAccounts.find((a) => a.id === currentAccountId) || ownerAccounts[0];

  // Unlock Owner Panel (via Normal Owner 1234567, 201770, Master 2017, or any of the 10 account passcodes)
  const unlockOwnerWithPin = useCallback((pin: string) => {
    const clean = pin.trim();

    // Check individual account passwords first
    const matchedAccount = ownerAccounts.find((a) => a.password === clean);
    if (matchedAccount) {
      if (matchedAccount.isSuspended) {
        soundFx.playHudBeep('alert');
        jarvisVoice.speak(`Access rejected. Account credentials for ${matchedAccount.name} are currently suspended.`);
        return { success: false, message: `Access Denied: Account for ${matchedAccount.name} is currently frozen.`, isMaster: false };
      }

      setIsOwnerUnlocked(true);
      setCurrentAccountId(matchedAccount.id);

      // Normal Owner console login NEVER unlocks Install/Publish pipeline.
      // Master Creator (2017) must be entered specifically into the Master Creator Gate to unlock publishing.
      const isMaster = matchedAccount.isMasterCreator || clean === MASTER_PUBLISH_KEY;

      addAuditLog(
        matchedAccount.name,
        'OWNER ACCOUNT LOGGED IN',
        'SUCCESS',
        `Personal passcode verified for ${matchedAccount.name} (${matchedAccount.role}).`
      );
      soundFx.playArcReactorPulse();
      jarvisVoice.speak(`${matchedAccount.name} credentials verified. Clearance level: ${matchedAccount.clearanceLevel}. Console ready.`);
      return { success: true, message: `Welcome ${matchedAccount.name}! Owner Console Online.`, isMaster };
    }

    // Check Normal Owner Passwords (1234567 or 201770) or Master Key (2017)
    if (clean === OWNER_PASS_1 || clean === '201770' || clean === MASTER_PUBLISH_KEY) {
      setIsOwnerUnlocked(true);
      const isMaster = clean === MASTER_PUBLISH_KEY;

      addAuditLog(
        currentAccount.name,
        'OWNER PANEL AUTHORIZED',
        'SUCCESS',
        `Authenticated via Owner Passcode override. Clearance level: EXECUTIVE.`
      );
      soundFx.playArcReactorPulse();
      jarvisVoice.speak(`Owner clearance confirmed. System console online, Mr. Stark.`);
      return { success: true, message: 'Owner Authorization Confirmed!', isMaster };
    }

    addAuditLog(
      'UNKNOWN VISITOR',
      'OWNER ACCESS REJECTED',
      'DENIED',
      `Invalid passcode attempt entered: "••••". Security alert flagged.`
    );
    soundFx.playHudBeep('alert');
    return { success: false, message: 'Invalid Passcode! Access to Owner Suite denied.', isMaster: false };
  }, [currentAccount, ownerAccounts, addAuditLog]);

  // Unlock ONLY Master Creator Publish Access (STRICTLY via 2017)
  const unlockMasterPublishWithPin = useCallback((pin: string) => {
    const clean = pin.trim();
    if (clean === MASTER_PUBLISH_KEY) {
      setIsMasterPublishUnlocked(true);
      setIsOwnerUnlocked(true);
      addAuditLog(
        'Lisara Kodikara (Creator)',
        'MASTER CREATOR PUBLISH AUTHORIZED',
        'SUCCESS',
        `Master cryptographic key accepted. Install & Distribution pipeline unlocked.`
      );
      soundFx.playRepulsorBlast();
      jarvisVoice.speak('Master creator clearance verified. Distribution, installer, and app publish pipelines authorized.');
      
      if (pendingPublishCallback) {
        pendingPublishCallback();
        setPendingPublishCallback(null);
      }
      setIsMasterGateModalOpen(false);

      return { success: true, message: 'Master Creator Pass Verified! Publishing unlocked.' };
    }

    addAuditLog(
      'UNAUTHORIZED ACTOR',
      'PUBLISH ACCESS DENIED',
      'CRITICAL',
      `Failed attempt to bypass Install/Publish Gate. Input: "••••".`
    );
    soundFx.playHudBeep('alert');
    jarvisVoice.speak('Access denied. Security protocol violation logged.');
    return { success: false, message: 'Access Denied: Only the Master Creator with the secret key (2017) can access install and publish buttons.' };
  }, [pendingPublishCallback, addAuditLog]);

  const lockOwner = useCallback(() => {
    setIsOwnerUnlocked(false);
    setIsMasterPublishUnlocked(false);
    localStorage.removeItem('stark_owner_unlocked');
    sessionStorage.removeItem('stark_master_publish_unlocked');
    soundFx.playHudBeep('subtle');
    addAuditLog(currentAccount.name, 'OWNER PANEL LOCKED', 'COMMAND', 'Executive session terminated by user.');
  }, [currentAccount, addAuditLog]);

  const lockMasterPublish = useCallback(() => {
    setIsMasterPublishUnlocked(false);
    sessionStorage.removeItem('stark_master_publish_unlocked');
    soundFx.playHudBeep('alert');
    addAuditLog(currentAccount.name, 'PUBLISH PIPELINE LOCKED', 'COMMAND', 'Master publishing key locked.');
    jarvisVoice.speak('Publishing pipeline locked. Secret passcode will be required to re-engage.');
  }, [currentAccount, addAuditLog]);

  const switchAccount = useCallback((id: string) => {
    const acc = ownerAccounts.find((a) => a.id === id);
    if (acc) {
      setCurrentAccountId(id);
      soundFx.playHudBeep('mode');
      addAuditLog(acc.name, 'EXECUTIVE PROFILE SWITCHED', 'SUCCESS', `Active terminal profile assigned to ${acc.name} (${acc.role}).`);
      jarvisVoice.speak(`Terminal synchronized to ${acc.name}. Clearance level: ${acc.clearanceLevel}.`);
    }
  }, [ownerAccounts, addAuditLog]);

  // FULL ACCOUNT CONTROL POWERS
  const updateAccount = useCallback((id: string, updates: Partial<OwnerAccount>) => {
    setOwnerAccounts((prev) => {
      const updated = prev.map((acc) => {
        if (acc.id === id) {
          return { ...acc, ...updates };
        }
        return acc;
      });
      return updated;
    });
    soundFx.playHudBeep('confirm');
    const acc = ownerAccounts.find((a) => a.id === id);
    if (acc) {
      addAuditLog(
        currentAccount.name, 
        `ACCOUNT MODIFIED: ${acc.name}`, 
        'COMMAND', 
        `Updated fields: ${Object.keys(updates).join(', ')}`
      );
    }
  }, [currentAccount, ownerAccounts, addAuditLog]);

  const changeAccountPassword = useCallback((id: string, newPassword: string) => {
    const clean = newPassword.trim();
    if (!clean) return;
    setOwnerAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === id) {
          return { ...acc, password: clean };
        }
        return acc;
      })
    );
    soundFx.playHudBeep('confirm');
    const target = ownerAccounts.find((a) => a.id === id);
    if (target) {
      jarvisVoice.speak(`Passcode updated for ${target.name}.`);
      addAuditLog(
        currentAccount.name,
        `PASSCODE CHANGED: ${target.name}`,
        'COMMAND',
        `New passcode updated: ${clean.length > 2 ? clean.slice(0, 2) + '••••' : '••••'}`
      );
    }
  }, [ownerAccounts, currentAccount, addAuditLog]);

  const assumeControlOfAccount = useCallback((id: string) => {
    const target = ownerAccounts.find((a) => a.id === id);
    if (!target) return;

    setCurrentAccountId(id);
    soundFx.playRepulsorBlast();
    jarvisVoice.speak(`Direct terminal override initiated. You now possess full executive control as ${target.name}.`);
    addAuditLog(
      currentAccount.name,
      `DIRECT CONTROL ASSUMED: ${target.name}`,
      'CRITICAL',
      `Full executive impersonation active. Clearance: ${target.clearanceLevel}`
    );
  }, [ownerAccounts, currentAccount, addAuditLog]);

  const toggleAccountSuspension = useCallback((id: string) => {
    setOwnerAccounts((prev) => {
      return prev.map((acc) => {
        if (acc.id === id) {
          const nextSuspended = !acc.isSuspended;
          const nextStatus = nextSuspended ? 'FROZEN' : 'ACTIVE';
          soundFx.playHudBeep(nextSuspended ? 'alert' : 'confirm');
          jarvisVoice.speak(
            nextSuspended 
              ? `Account credentials for ${acc.name} have been frozen by executive order.`
              : `Account credentials for ${acc.name} have been restored.`
          );
          addAuditLog(
            currentAccount.name,
            nextSuspended ? `ACCOUNT FROZEN: ${acc.name}` : `ACCOUNT RESTORED: ${acc.name}`,
            nextSuspended ? 'CRITICAL' : 'SUCCESS',
            `Status shifted to ${nextStatus}. Access tokens ${nextSuspended ? 'revoked' : 'reactivated'}.`
          );
          return { ...acc, isSuspended: nextSuspended, status: nextStatus };
        }
        return acc;
      });
    });
  }, [currentAccount, addAuditLog]);

  const toggleAccountPermission = useCallback((id: string, permKey: keyof OwnerAccountPermissions) => {
    setOwnerAccounts((prev) => {
      return prev.map((acc) => {
        if (acc.id === id) {
          const currentVal = acc.permissions?.[permKey] ?? false;
          const nextVal = !currentVal;
          soundFx.playHudBeep('mode');
          addAuditLog(
            currentAccount.name,
            `PERMISSION TOGGLE: ${acc.name}`,
            'COMMAND',
            `${String(permKey)} set to ${nextVal ? 'ALLOWED' : 'REVOKED'}`
          );
          return {
            ...acc,
            permissions: {
              ...acc.permissions,
              [permKey]: nextVal,
            },
          };
        }
        return acc;
      });
    });
  }, [currentAccount, addAuditLog]);

  const sendDirectiveToAccount = useCallback((id: string, directiveText: string) => {
    const text = directiveText.trim();
    if (!text) return;

    setOwnerAccounts((prev) => {
      return prev.map((acc) => {
        if (acc.id === id) {
          soundFx.playHudBeep('alert');
          jarvisVoice.speak(`Priority directive dispatched to ${acc.name}: ${text}`);
          addAuditLog(
            currentAccount.name,
            `DIRECTIVE DISPATCHED TO ${acc.name.toUpperCase()}`,
            'COMMAND',
            `Order: "${text}"`
          );
          return { ...acc, lastExecutiveDirective: text };
        }
        return acc;
      });
    });
  }, [currentAccount, addAuditLog]);

  const createCustomAccount = useCallback((accountData: Omit<OwnerAccount, 'id' | 'joinedDate'>) => {
    const accId = `owner-${Date.now()}`;
    const newAcc: OwnerAccount = {
      ...accountData,
      id: accId,
      portalUrl: accountData.portalUrl || `/?portal=owner&acc=${accId}&owner=${encodeURIComponent(accountData.handle || 'user')}`,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };
    setOwnerAccounts((prev) => [...prev, newAcc]);
    soundFx.playArcReactorPulse();
    jarvisVoice.speak(`New executive owner account registered for ${newAcc.name}. Terminal clearance initialized.`);
    addAuditLog(
      currentAccount.name,
      `NEW OWNER CREATED: ${newAcc.name}`,
      'SUCCESS',
      `Clearance: ${newAcc.clearanceLevel}. Handle: @${newAcc.handle}`
    );
  }, [currentAccount, addAuditLog]);

  const deleteAccount = useCallback((id: string) => {
    const target = ownerAccounts.find((a) => a.id === id);
    if (!target) return { success: false, message: 'Account not found.' };
    if (target.isMasterCreator || target.id === 'owner-1') {
      soundFx.playHudBeep('alert');
      return { success: false, message: 'Cannot delete Master Creator Lisara Kodikara account!' };
    }

    setOwnerAccounts((prev) => prev.filter((a) => a.id !== id));
    if (currentAccountId === id) {
      setCurrentAccountId('owner-1');
    }
    soundFx.playHudBeep('alert');
    jarvisVoice.speak(`Account credentials for ${target.name} purged from Stark Executive Registry.`);
    addAuditLog(
      currentAccount.name,
      `ACCOUNT PURGED: ${target.name}`,
      'CRITICAL',
      `Account record deleted from persistent store.`
    );
    return { success: true, message: `Account for ${target.name} successfully deleted.` };
  }, [ownerAccounts, currentAccountId, currentAccount, addAuditLog]);

  const resetToDefaultAccounts = useCallback(() => {
    setOwnerAccounts(INITIAL_OWNER_ACCOUNTS);
    setCurrentAccountId('owner-1');
    soundFx.playArcReactorPulse();
    jarvisVoice.speak('All 10 Stark Industries Executive Owner profiles restored to factory baseline.');
    addAuditLog(
      'SYSTEM KERNEL',
      'OWNER ACCOUNTS RESET TO DEFAULT',
      'CRITICAL',
      'Restored the 10 original Stark Executive accounts.'
    );
  }, [addAuditLog]);

  const updateSystemControls = useCallback((updates: Partial<OwnerSystemControls>) => {
    setSystemControls((prev) => {
      const next = { ...prev, ...updates };
      return next;
    });
  }, []);

  // Guard for Install / Publish Buttons
  const requireMasterPublishAccess = useCallback((callback: () => void) => {
    if (isMasterPublishUnlocked) {
      callback();
    } else {
      soundFx.playHudBeep('alert');
      setPendingPublishCallback(() => callback);
      setIsMasterGateModalOpen(true);
    }
  }, [isMasterPublishUnlocked]);

  const closeMasterGateModal = useCallback(() => {
    setIsMasterGateModalOpen(false);
    setPendingPublishCallback(null);
  }, []);

  return (
    <OwnerAuthContext.Provider
      value={{
        isOwnerUnlocked,
        isMasterPublishUnlocked,
        currentAccount,
        ownerAccounts,
        auditLogs,
        systemControls,
        isMasterGateModalOpen,
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
        requireMasterPublishAccess,
        closeMasterGateModal,
      }}
    >
      {children}
    </OwnerAuthContext.Provider>
  );
};

export const useOwnerAuth = (): OwnerAuthContextType => {
  const ctx = useContext(OwnerAuthContext);
  if (!ctx) {
    throw new Error('useOwnerAuth must be used within an OwnerAuthProvider');
  }
  return ctx;
};
