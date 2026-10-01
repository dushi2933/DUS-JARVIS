/**
 * J.A.R.V.I.S. Speech Recognition & Synthesis Engine
 * Provides natural British cadence voice output and speech-to-text voice command recognition.
 */

// Speech Recognition Type Shim
interface IWindowWithSpeech extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export class JarvisSpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private recognition: any = null;
  private isListening: boolean = false;
  private isSpeaking: boolean = false;
  private speechQueue: string[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoice();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoice();
      }
    }
  }

  private initVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prioritize British English male / refined voices for J.A.R.V.I.S. persona
    const preferredVoices = [
      'Daniel', // macOS/iOS iconic UK male
      'Google UK English Male',
      'en-GB',
      'Oliver',
      'George',
      'Arthur',
      'English (United Kingdom)',
    ];

    let chosen: SpeechSynthesisVoice | null = null;
    for (const pref of preferredVoices) {
      chosen = voices.find(
        (v) => v.name.includes(pref) || v.lang.includes(pref)
      ) || null;
      if (chosen) break;
    }

    // Fallback to any en-GB or any English voice
    if (!chosen) {
      chosen =
        voices.find((v) => v.lang.startsWith('en-GB')) ||
        voices.find((v) => v.lang.startsWith('en')) ||
        voices[0] ||
        null;
    }
    this.voice = chosen;
  }

  /**
   * Speak text in J.A.R.V.I.S. persona
   */
  public speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth || !('speechSynthesis' in window)) {
        onEnd?.();
        resolve();
        return;
      }

      // Stop previous utterance
      this.synth.cancel();

      // Clean markdown formatting if any from text
      const cleanText = text
        .replace(/[*_#`~[\]]/g, '')
        .replace(/https?:\/\/\S+/g, '')
        .trim();

      if (!cleanText) {
        onEnd?.();
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      if (this.voice) {
        utterance.voice = this.voice;
      }
      // Calm, sophisticated cadence
      utterance.pitch = 0.95;
      utterance.rate = 1.05;

      utterance.onstart = () => {
        this.isSpeaking = true;
        onStart?.();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        onEnd?.();
        resolve();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis warning:', e);
        this.isSpeaking = false;
        onEnd?.();
        resolve();
      };

      this.synth.speak(utterance);
    });
  }

  public cancelSpeech() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  public isVoiceActive(): boolean {
    return this.isSpeaking;
  }

  /**
   * Initialize speech recognition
   */
  public initRecognition(
    onResult: (transcript: string) => void,
    onError?: (err: any) => void,
    onEnd?: () => void
  ): boolean {
    const win = window as unknown as IWindowWithSpeech;
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRec) {
      return false;
    }

    try {
      this.recognition = new SpeechRec();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        onError?.(event);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd?.();
      };

      return true;
    } catch (e) {
      console.warn('Failed to init speech recognition:', e);
      return false;
    }
  }

  public startListening(): boolean {
    if (!this.recognition) return false;
    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (e) {
      console.warn('Speech recognition start error:', e);
      return false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignored
      }
      this.isListening = false;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const jarvisVoice = new JarvisSpeechEngine();
