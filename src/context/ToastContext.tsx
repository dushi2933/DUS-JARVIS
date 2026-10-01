import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastItem, ToastType } from '../types/toast';
import { soundFx } from '../utils/audioEffects';

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const addToast = useCallback(
    (toast: Omit<ToastItem, 'id' | 'timestamp'>) => {
      const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newToast: ToastItem = {
        ...toast,
        id,
        timestamp,
        durationMs: toast.durationMs ?? 4500,
      };

      // Sound chirp corresponding to priority
      try {
        if (toast.type === 'protocol' || toast.type === 'alert') {
          soundFx.playHudBeep('alert');
        } else if (toast.type === 'tactical') {
          soundFx.playHudBeep('confirm');
        } else {
          soundFx.playHudBeep('subtle');
        }
      } catch (e) {
        // audio context fallback
      }

      // Prepend so latest appears at top
      setToasts((prev) => [newToast, ...prev.slice(0, 4)]); // max 5 active toasts

      // Auto-dismiss
      const duration = newToast.durationMs || 4500;
      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAllToasts }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
