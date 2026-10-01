import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Bell, 
  Plus, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Trash2, 
  AlertCircle, 
  Sparkles,
  Volume2
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useToast } from '../context/ToastContext';

export interface ActiveTimer {
  id: string;
  label: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
}

export interface ReminderItem {
  id: string;
  title: string;
  timeStr: string;
  priority: 'TACTICAL' | 'NORMAL' | 'URGENT';
  completed: boolean;
}

interface RemindersTimersHubProps {
  externalTimerTrigger?: number | null;
}

export const RemindersTimersHub: React.FC<RemindersTimersHubProps> = ({
  externalTimerTrigger,
}) => {
  const { addToast } = useToast();
  const [timers, setTimers] = useState<ActiveTimer[]>([
    {
      id: 'timer-1',
      label: 'Repulsor Capacitor Thermal Dissipation',
      totalSeconds: 180,
      remainingSeconds: 180,
      isRunning: false,
    },
    {
      id: 'timer-2',
      label: 'Gauntlet Neural Sync Session',
      totalSeconds: 300,
      remainingSeconds: 300,
      isRunning: false,
    },
  ]);

  const [reminders, setReminders] = useState<ReminderItem[]>([
    {
      id: 'rem-1',
      title: 'Review Gold-Titanium alloy 3D print tolerances',
      timeStr: 'Today at 14:00',
      priority: 'TACTICAL',
      completed: false,
    },
    {
      id: 'rem-2',
      title: 'Test Web Speech API microphone voice latency',
      timeStr: 'Today at 16:30',
      priority: 'URGENT',
      completed: true,
    },
    {
      id: 'rem-3',
      title: 'Inspect NeoPixel Arc Reactor wiring & solder points',
      timeStr: 'Tomorrow at 10:00',
      priority: 'NORMAL',
      completed: false,
    },
  ]);

  const [newReminderText, setNewReminderText] = useState('');
  const [newReminderPriority, setNewReminderPriority] = useState<'TACTICAL' | 'NORMAL' | 'URGENT'>('TACTICAL');
  const [customMinutes, setCustomMinutes] = useState('5');
  const [customTimerLabel, setCustomTimerLabel] = useState('Stark Diagnostic Timer');

  // Handle external voice-triggered timer from J.A.R.V.I.S.
  useEffect(() => {
    if (externalTimerTrigger && externalTimerTrigger > 0) {
      addQuickTimer(externalTimerTrigger, 'Voice Commanded Directive');
    }
  }, [externalTimerTrigger]);

  // Request browser notification permissions
  const requestNotificationPerm = () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  // Timer interval ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) =>
        prev.map((t) => {
          if (!t.isRunning || t.remainingSeconds <= 0) return t;

          const nextRemaining = t.remainingSeconds - 1;

          if (nextRemaining === 0) {
            // Trigger alarm!
            soundFx.playHudBeep('alert');
            jarvisVoice.speak(`Timer concluded, Mr. Stark: ${t.label}`);
            addToast({
              title: 'Mission Chronometer Concluded',
              message: `Countdown "${t.label}" has elapsed, Mr. Stark.`,
              type: 'alert',
            });
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('J.A.R.V.I.S. Alert', {
                body: `Timer expired for Mr. Stark: ${t.label}`,
                icon: '/icon.svg',
              });
            }
          }

          return {
            ...t,
            remainingSeconds: nextRemaining,
            isRunning: nextRemaining > 0,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addQuickTimer = (seconds: number, label: string) => {
    soundFx.playHudBeep('confirm');
    requestNotificationPerm();
    const newTimer: ActiveTimer = {
      id: `timer-${Date.now()}`,
      label,
      totalSeconds: seconds,
      remainingSeconds: seconds,
      isRunning: true,
    };
    setTimers((prev) => [newTimer, ...prev]);
    addToast({
      title: 'Chronometer Established',
      message: `${Math.round(seconds / 60)} min timer engaged for "${label}".`,
      type: 'status',
    });
  };

  const toggleTimer = (id: string) => {
    soundFx.playHudBeep('subtle');
    setTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isRunning: !t.isRunning } : t))
    );
  };

  const resetTimer = (id: string) => {
    soundFx.playHudBeep('subtle');
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, remainingSeconds: t.totalSeconds, isRunning: false } : t
      )
    );
  };

  const deleteTimer = (id: string) => {
    soundFx.playHudBeep('subtle');
    setTimers((prev) => prev.filter((t) => t.id !== id));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Add Reminder
  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderText.trim()) return;

    soundFx.playHudBeep('confirm');
    const newRem: ReminderItem = {
      id: `rem-${Date.now()}`,
      title: newReminderText.trim(),
      timeStr: 'Scheduled Alert',
      priority: newReminderPriority,
      completed: false,
    };

    setReminders((prev) => [newRem, ...prev]);
    setNewReminderText('');
  };

  const toggleReminder = (id: string) => {
    soundFx.playHudBeep('subtle');
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const deleteReminder = (id: string) => {
    soundFx.playHudBeep('subtle');
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="bg-gray-900/60 border border-cyan-500/20 rounded-xl p-4 flex flex-col backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-400/40 flex items-center justify-center glow-arc-blue">
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-tech text-sm font-bold tracking-wider text-cyan-200">
              J.A.R.V.I.S. TIMERS & TACTICAL REMINDERS
            </h3>
            <p className="text-[11px] text-gray-400 font-sans">
              Precision Chronometer & Mission Scheduling for Miss Lisara
            </p>
          </div>
        </div>

        {/* Quick Voice Command Note */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-amber-300 font-mono-tech bg-amber-950/30 px-2.5 py-1 rounded border border-amber-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Say: "Jarvis, set a 10 minute timer"</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Left 6 cols: Active Timers & Quick Add */}
        <div className="lg:col-span-6 space-y-4">
          {/* Quick Preset Buttons */}
          <div className="bg-gray-950/60 p-3 rounded-xl border border-gray-800">
            <span className="text-[11px] font-mono-tech uppercase text-gray-400 mb-2 block">
              Quick Timer Presets:
            </span>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '1 MIN', secs: 60 },
                { label: '5 MIN', secs: 300 },
                { label: '15 MIN', secs: 900 },
                { label: '30 MIN', secs: 1800 },
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => addQuickTimer(p.secs, `${p.label} Directive`)}
                  className="py-1.5 px-2 rounded bg-gray-800/80 hover:bg-cyan-950/80 hover:border-cyan-400/50 border border-gray-700 text-cyan-200 text-xs font-tech font-bold transition-all cursor-pointer"
                >
                  +{p.label}
                </button>
              ))}
            </div>

            {/* Custom Timer Input */}
            <div className="mt-3 pt-3 border-t border-gray-800/80 flex items-center gap-2">
              <input
                type="text"
                value={customTimerLabel}
                onChange={(e) => setCustomTimerLabel(e.target.value)}
                placeholder="Timer label..."
                className="flex-1 bg-gray-900 border border-gray-700 rounded px-2.5 py-1 text-xs text-cyan-100 font-mono-tech focus:outline-none focus:border-cyan-400"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  className="w-14 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-cyan-100 font-mono-tech text-center focus:outline-none focus:border-cyan-400"
                />
                <span className="text-xs text-gray-400 font-mono-tech">min</span>
              </div>
              <button
                onClick={() => {
                  const mins = parseInt(customMinutes, 10) || 5;
                  addQuickTimer(mins * 60, customTimerLabel || 'Custom Timer');
                }}
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-gray-950 font-tech font-bold text-xs rounded cursor-pointer"
              >
                START
              </button>
            </div>
          </div>

          {/* Timers List */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-mono-tech uppercase text-gray-400 block">
              Active Gauntlet Countdown Queues:
            </span>

            {timers.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-gray-800 text-center text-xs text-gray-500 font-mono-tech">
                No active timers. Launch a preset above or ask J.A.R.V.I.S.
              </div>
            ) : (
              timers.map((t) => {
                const progressPct = ((t.totalSeconds - t.remainingSeconds) / t.totalSeconds) * 100;
                const isFinished = t.remainingSeconds === 0;

                return (
                  <div
                    key={t.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isFinished
                        ? 'border-red-500 bg-red-950/30 animate-pulse'
                        : t.isRunning
                        ? 'border-cyan-500/40 bg-cyan-950/20'
                        : 'border-gray-800 bg-gray-950/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-tech text-xs font-bold text-gray-200 truncate">
                        {t.label}
                      </span>
                      <span
                        className={`font-mono-tech text-lg font-bold ${
                          isFinished ? 'text-red-400 animate-bounce' : 'text-cyan-300'
                        }`}
                      >
                        {formatTime(t.remainingSeconds)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mb-2.5">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          isFinished ? 'bg-red-500' : 'bg-cyan-400 glow-arc-blue'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleTimer(t.id)}
                          className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 flex items-center gap-1 cursor-pointer font-mono-tech text-[11px]"
                        >
                          {t.isRunning ? (
                            <>
                              <Pause className="w-3 h-3 text-amber-400" /> PAUSE
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 text-emerald-400" /> RESUME
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => resetTimer(t.id)}
                          className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer font-mono-tech text-[11px]"
                        >
                          <RotateCcw className="w-3 h-3" /> RESET
                        </button>
                      </div>

                      <button
                        onClick={() => deleteTimer(t.id)}
                        className="p-1 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Remove Timer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 6 cols: Reminders & Mission Directives */}
        <div className="lg:col-span-6 space-y-4">
          {/* Add Reminder Form */}
          <form onSubmit={handleAddReminder} className="bg-gray-950/60 p-3 rounded-xl border border-gray-800">
            <span className="text-[11px] font-mono-tech uppercase text-gray-400 mb-2 block flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Record New Mission Reminder:</span>
            </span>

            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newReminderText}
                onChange={(e) => setNewReminderText(e.target.value)}
                placeholder="Directive details (e.g., Calibrate finger servos)..."
                className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-xs text-cyan-100 font-mono-tech focus:outline-none focus:border-amber-400"
              />
              <select
                value={newReminderPriority}
                onChange={(e) => setNewReminderPriority(e.target.value as any)}
                className="bg-gray-900 border border-gray-700 text-xs font-mono-tech text-gray-300 rounded px-2 focus:outline-none"
              >
                <option value="TACTICAL">Tactical</option>
                <option value="URGENT">Urgent</option>
                <option value="NORMAL">Normal</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-tech font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD TO STARK DIRECTIVE QUEUE</span>
            </button>
          </form>

          {/* Reminders List */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono-tech uppercase text-gray-400 block">
              Active Directives for Miss Lisara:
            </span>

            {reminders.map((rem) => (
              <div
                key={rem.id}
                className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                  rem.completed
                    ? 'border-gray-800/60 bg-gray-950/40 opacity-60'
                    : 'border-cyan-500/20 bg-gray-950/70'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleReminder(rem.id)}
                    className="mt-0.5 cursor-pointer"
                  >
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        rem.completed ? 'text-emerald-400' : 'text-gray-600 hover:text-gray-400'
                      }`}
                    />
                  </button>

                  <div>
                    <div
                      className={`text-xs font-sans ${
                        rem.completed ? 'line-through text-gray-500' : 'text-gray-200'
                      }`}
                    >
                      {rem.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] font-mono-tech">
                      <span className="text-gray-500">{rem.timeStr}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded uppercase font-bold text-[9px] ${
                          rem.priority === 'URGENT'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : rem.priority === 'TACTICAL'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {rem.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteReminder(rem.id)}
                  className="text-gray-600 hover:text-red-400 p-1 cursor-pointer transition-colors"
                  title="Remove Directive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
