import React from 'react';
import { 
  Shield, 
  Zap, 
  AlertTriangle, 
  Activity, 
  Bell, 
  X, 
  Radio, 
  Crosshair, 
  Flame,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { ToastItem, ToastType } from '../types/toast';

export const JarvisToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastCard: React.FC<{ toast: ToastItem; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const getTheme = (type: ToastType) => {
    switch (type) {
      case 'protocol':
        return {
          border: 'border-amber-500/70 border-l-amber-400',
          bg: 'bg-gray-950/95',
          glow: 'glow-arc-gold',
          iconColor: 'text-amber-400',
          titleColor: 'text-amber-300',
          badgeText: 'PROTOCOL DIRECTIVE',
          badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
          barColor: 'bg-amber-400',
          icon: <Shield className="w-4 h-4 text-amber-400 shrink-0" />,
        };
      case 'alert':
        return {
          border: 'border-red-500/70 border-l-red-500',
          bg: 'bg-gray-950/95',
          glow: 'glow-arc-red',
          iconColor: 'text-red-400',
          titleColor: 'text-red-300',
          badgeText: 'MISSION ALERT',
          badgeBg: 'bg-red-950/80 text-red-300 border-red-500/40',
          barColor: 'bg-red-500',
          icon: <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />,
        };
      case 'tactical':
        return {
          border: 'border-cyan-500/70 border-l-cyan-400',
          bg: 'bg-gray-950/95',
          glow: 'glow-arc-blue',
          iconColor: 'text-cyan-400',
          titleColor: 'text-cyan-200',
          badgeText: 'TACTICAL TELEMETRY',
          badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
          barColor: 'bg-cyan-400',
          icon: <Zap className="w-4 h-4 text-cyan-400 shrink-0" />,
        };
      case 'status':
      default:
        return {
          border: 'border-emerald-500/60 border-l-emerald-400',
          bg: 'bg-gray-950/95',
          glow: 'shadow-[0_0_15px_rgba(16,185,129,0.25)]',
          iconColor: 'text-emerald-400',
          titleColor: 'text-emerald-200',
          badgeText: 'SYSTEM STATUS',
          badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
          barColor: 'bg-emerald-400',
          icon: <Activity className="w-4 h-4 text-emerald-400 shrink-0" />,
        };
    }
  };

  const theme = getTheme(toast.type);
  const duration = toast.durationMs || 4500;

  return (
    <div
      className={`pointer-events-auto relative overflow-hidden rounded-xl border border-l-4 ${theme.border} ${theme.bg} ${theme.glow} p-3.5 backdrop-blur-md shadow-2xl transition-all animate-toast-slide-in group`}
      style={{
        boxShadow:
          toast.type === 'alert'
            ? '0 0 20px rgba(239, 68, 68, 0.35)'
            : toast.type === 'protocol'
            ? '0 0 20px rgba(245, 158, 11, 0.35)'
            : '0 0 20px rgba(6, 182, 212, 0.35)',
      }}
    >
      {/* Hologram scanline & grid texture */}
      <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 mb-1.5 relative z-10">
        <div className="flex items-center gap-2">
          {theme.icon}
          <span
            className={`text-[9px] font-mono-tech tracking-wider font-bold px-1.5 py-0.5 rounded border uppercase ${theme.badgeBg}`}
          >
            {theme.badgeText}
          </span>
          <span className="text-[10px] text-gray-500 font-mono-tech">
            {toast.timestamp}
          </span>
        </div>

        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-800/60 transition-colors cursor-pointer"
          aria-label="Dismiss Alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Title & Body */}
      <div className="relative z-10 pl-6">
        <h4 className={`text-xs font-tech font-bold tracking-wide uppercase ${theme.titleColor} mb-0.5`}>
          {toast.title}
        </h4>
        <p className="text-[11px] text-gray-300 font-sans leading-relaxed">
          {toast.message}
        </p>
      </div>

      {/* Auto-dismiss progress countdown line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-800/80 overflow-hidden">
        <div
          className={`h-full ${theme.barColor} transition-all ease-linear`}
          style={{
            animation: `toast-progress ${duration}ms linear forwards`,
          }}
        />
      </div>

      <style>{`
        @keyframes toast-progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};
