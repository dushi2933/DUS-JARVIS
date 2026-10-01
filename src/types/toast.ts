export type ToastType = 'status' | 'protocol' | 'alert' | 'tactical';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  timestamp: string;
  durationMs?: number;
  iconType?: 'shield' | 'zap' | 'bell' | 'activity' | 'terminal' | 'flame' | 'check';
}
