/**
 * J.A.R.V.I.S. Wake Word ("Jarvis" / "Hey Jarvis") Detection Engine
 * Allows Mr. Tony Stark to speak naturally without manual button clicks.
 */

import { soundFx } from './audioEffects';
import { jarvisVoice } from './speech';

interface IWindowWithSpeech extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export type WakeWordStatus = 
  | 'DISABLED' 
  | 'LISTENING_FOR_WAKE_WORD' 
  | 'WAKE_WORD_TRIGGERED' 
  | 'CAPTURING_COMMAND' 
  | 'PROCESSING';

export interface WakeWordEvents {
  onStatusChange?: (status: WakeWordStatus) => void;
  onWakeWordTriggered?: () => void;
  onInterimSpeech?: (transcript: string) => void;
  onCommandDetected?: (command: string) => void;
  onError?: (err: string) => void;
}

export class JarvisWakeWordEngine {
  private recognition: any = null;
  private isEnabled: boolean = false;
  private isManuallyStopped: boolean = false;
  private status: WakeWordStatus = 'DISABLED';
  private events: WakeWordEvents = {};
  private activeCaptureTimeout: any = null;
  private currentCapturedBuffer: string = '';
  private restartDebounce: any = null;

  constructor() {
    this.initEngine();
  }

  private initEngine(): boolean {
    if (typeof window === 'undefined') return false;

    const win = window as unknown as IWindowWithSpeech;
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRec) {
      console.warn('[J.A.R.V.I.S. WAKE] Web Speech API not supported in this browser environment.');
      return false;
    }

    try {
      this.recognition = new SpeechRec();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        if (this.status !== 'WAKE_WORD_TRIGGERED' && this.status !== 'CAPTURING_COMMAND') {
          this.setStatus('LISTENING_FOR_WAKE_WORD');
        }
      };

      this.recognition.onresult = (event: any) => {
        // Do not process speech while J.A.R.V.I.S. is talking to prevent feedback loop
        if (jarvisVoice.isVoiceActive()) {
          return;
        }

        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece;
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        const candidateText = (finalTranscript || interimTranscript).trim();
        if (!candidateText) return;

        this.events.onInterimSpeech?.(candidateText);
        this.processSpeechInput(candidateText, !!finalTranscript);
      };

      this.recognition.onerror = (event: any) => {
        if (event.error === 'no-speech') {
          // Normal background silence, disregard
          return;
        }
        if (event.error === 'aborted') {
          return;
        }
        console.warn('[J.A.R.V.I.S. WAKE] Speech recognition event:', event.error);
        this.events.onError?.(event.error);
      };

      this.recognition.onend = () => {
        if (this.isEnabled && !this.isManuallyStopped) {
          // Auto-restart to maintain persistent passive listening
          clearTimeout(this.restartDebounce);
          this.restartDebounce = setTimeout(() => {
            this.safeStart();
          }, 300);
        } else {
          this.setStatus('DISABLED');
        }
      };

      return true;
    } catch (e) {
      console.warn('[J.A.R.V.I.S. WAKE] Recognition initialization failed:', e);
      return false;
    }
  }

  private setStatus(newStatus: WakeWordStatus) {
    this.status = newStatus;
    this.events.onStatusChange?.(newStatus);
  }

  public registerEvents(events: WakeWordEvents) {
    this.events = { ...this.events, ...events };
  }

  private processSpeechInput(text: string, isFinal: boolean) {
    const lower = text.toLowerCase();

    // Check if user is speaking wake word or variants
    const wakeWordPattern = /\b(jarvis|hey jarvis|ok jarvis|okay jarvis|hello jarvis|mr jarvis|hi jarvis)\b/i;
    const match = lower.match(wakeWordPattern);

    if (match) {
      const matchIndex = match.index || 0;
      const matchedPhrase = match[0];
      const remainder = text.slice(matchIndex + matchedPhrase.length).replace(/^[,\s.!?-]+/, '').trim();

      // Trigger wake reaction if not already triggered
      if (this.status !== 'WAKE_WORD_TRIGGERED' && this.status !== 'CAPTURING_COMMAND') {
        this.setStatus('WAKE_WORD_TRIGGERED');
        soundFx.playHudBeep('mode');
        this.events.onWakeWordTriggered?.();
      }

      // If user provided a command right after the wake word in the same sentence:
      // e.g. "Jarvis, charge repulsors to 100%"
      if (remainder.length > 2) {
        this.currentCapturedBuffer = remainder;
        this.setStatus('CAPTURING_COMMAND');

        // If sentence ended or has sufficient length, execute after short natural pause
        if (isFinal) {
          this.executeDetectedCommand(this.currentCapturedBuffer);
        } else {
          clearTimeout(this.activeCaptureTimeout);
          this.activeCaptureTimeout = setTimeout(() => {
            if (this.currentCapturedBuffer) {
              this.executeDetectedCommand(this.currentCapturedBuffer);
            }
          }, 1400);
        }
        return;
      }

      // If user only said "Jarvis", acknowledge and stay in active command capture mode
      if (remainder.length === 0 && (isFinal || lower.trim() === 'jarvis' || lower.trim() === 'hey jarvis')) {
        this.setStatus('CAPTURING_COMMAND');
        jarvisVoice.speak('At your service, Mr. Stark.', undefined, () => {
          // Once acknowledgement finishes, wait for command
          clearTimeout(this.activeCaptureTimeout);
          this.activeCaptureTimeout = setTimeout(() => {
            if (this.status === 'CAPTURING_COMMAND' && !this.currentCapturedBuffer) {
              this.setStatus('LISTENING_FOR_WAKE_WORD');
            }
          }, 7000);
        });
        return;
      }
    }

    // If already in active command capturing mode and user continues speaking
    if (this.status === 'CAPTURING_COMMAND' && text.length > 0) {
      // Strip any wake words if repeated
      const cleanCommand = text.replace(/^(hey|ok|okay|hello|hi)?\s*jarvis[, ]*/i, '').trim();
      if (cleanCommand.length > 0) {
        this.currentCapturedBuffer = cleanCommand;

        clearTimeout(this.activeCaptureTimeout);
        if (isFinal) {
          this.executeDetectedCommand(this.currentCapturedBuffer);
        } else {
          this.activeCaptureTimeout = setTimeout(() => {
            this.executeDetectedCommand(this.currentCapturedBuffer);
          }, 1300);
        }
      }
    }
  }

  private executeDetectedCommand(cmd: string) {
    clearTimeout(this.activeCaptureTimeout);
    const finalCmd = cmd.trim();
    if (!finalCmd) {
      this.setStatus('LISTENING_FOR_WAKE_WORD');
      return;
    }

    this.setStatus('PROCESSING');
    this.currentCapturedBuffer = '';
    this.events.onCommandDetected?.(finalCmd);

    // Return to passive wake listening after processing
    setTimeout(() => {
      if (this.isEnabled) {
        this.setStatus('LISTENING_FOR_WAKE_WORD');
      }
    }, 2000);
  }

  public enable(): boolean {
    if (!this.recognition) {
      const ok = this.initEngine();
      if (!ok) return false;
    }

    this.isEnabled = true;
    this.isManuallyStopped = false;
    return this.safeStart();
  }

  public disable() {
    this.isEnabled = false;
    this.isManuallyStopped = true;
    clearTimeout(this.activeCaptureTimeout);
    clearTimeout(this.restartDebounce);
    try {
      this.recognition?.stop();
    } catch (e) {
      // Ignored
    }
    this.setStatus('DISABLED');
  }

  private safeStart(): boolean {
    try {
      this.recognition.start();
      this.setStatus('LISTENING_FOR_WAKE_WORD');
      return true;
    } catch (e: any) {
      // If already started, it's fine
      if (e?.name === 'InvalidStateError') {
        this.setStatus('LISTENING_FOR_WAKE_WORD');
        return true;
      }
      console.warn('[J.A.R.V.I.S. WAKE] Failed to start:', e);
      return false;
    }
  }

  public getStatus(): WakeWordStatus {
    return this.status;
  }

  public isListening(): boolean {
    return this.isEnabled;
  }
}

export const jarvisWakeEngine = new JarvisWakeWordEngine();
