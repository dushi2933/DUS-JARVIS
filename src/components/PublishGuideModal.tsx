import React from 'react';
import { 
  X, 
  Download, 
  Globe, 
  Laptop, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  Cpu, 
  Share2, 
  ShieldCheck,
  Printer
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { useToast } from '../context/ToastContext';

interface PublishGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishGuideModal: React.FC<PublishGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addToast } = useToast();
  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyUrl = () => {
    soundFx.playHudBeep('confirm');
    navigator.clipboard.writeText(currentUrl);
    addToast({
      title: 'Link Copied',
      message: 'J.A.R.V.I.S. Gauntlet URL copied to clipboard! You can share this link with anyone.',
      type: 'protocol'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/85 backdrop-blur-md">
      <div className="bg-gray-900 border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl glow-arc-blue max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            soundFx.playHudBeep('subtle');
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-cyan-500/20 pb-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/50 border border-cyan-400/40 flex items-center justify-center text-cyan-400 glow-arc-blue">
            <Download className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h2 className="font-tech text-lg font-bold text-cyan-200">
              INSTALL & PUBLISH J.A.R.V.I.S. ON YOUR LAPTOP
            </h2>
            <p className="text-xs text-gray-400 font-sans">
              Deployment & Desktop PWA Guide for Miss Lyssandra
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4 text-xs font-sans text-gray-200">
          {/* Step 1: Install to Laptop as Desktop App */}
          <div className="bg-gray-950/60 border border-cyan-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 font-tech font-bold text-sm text-cyan-300 mb-2">
              <Laptop className="w-4 h-4 text-cyan-400" />
              <span>Step 1: Install J.A.R.V.I.S. on Your Laptop (PWA App)</span>
            </div>
            <p className="leading-relaxed text-gray-300 mb-3">
              This app is fully PWA (Progressive Web App) compliant! You can run it on your laptop just like Spotify or Discord without any browser address bar.
            </p>
            <div className="space-y-2 font-mono-tech text-[11px] text-gray-300 bg-gray-900/80 p-3 rounded-lg border border-gray-800">
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">A.</span>
                <span>In Google Chrome / Microsoft Edge / Brave: Look at the right side of the address bar at the top and click the <strong>"Install app"</strong> icon (or click the three dots menu → <strong>"Install J.A.R.V.I.S. Iron Man Gauntlet OS"</strong>).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">B.</span>
                <span>In Safari on Mac: Click <strong>File → Add to Dock</strong> to add J.A.R.V.I.S. directly to your macOS Dock as a standalone application.</span>
              </div>
            </div>
          </div>

          {/* Step 2: Publish & Share Live Link */}
          <div className="bg-gray-950/60 border border-amber-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 font-tech font-bold text-sm text-amber-300 mb-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>Step 2: Publishing & Sharing the Live URL</span>
            </div>
            <p className="leading-relaxed text-gray-300 mb-3">
              Your app is hosted live on Cloud Run. You can share your link directly, or publish the source code to GitHub and Vercel!
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={copyUrl}
                className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-tech font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>COPY APP URL TO SHARE</span>
              </button>
            </div>
          </div>

          {/* Step 3: Making the Physical Iron Man Gauntlet */}
          <div className="bg-gray-950/60 border border-emerald-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 font-tech font-bold text-sm text-emerald-300 mb-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Step 3: Roadmap for Physical Gauntlet Hardware</span>
            </div>
            <p className="leading-relaxed text-gray-300 mb-2">
              Since you want to build the physical gauntlet next, here are the exact parts Tony Stark makers use:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 text-[11px] font-mono-tech">
              <li><strong>Gauntlet Frame:</strong> 3D print free Mark 50 or Mark 3 files from Thingiverse / Printables in red/gold PLA.</li>
              <li><strong>Palm Repulsor:</strong> 12-LED or 16-LED circular WS2812B NeoPixel ring covered with frosted acrylic lens.</li>
              <li><strong>Sound & Bluetooth:</strong> Connect an ESP32 microcontroller with Web Bluetooth so this laptop app can trigger real LED blasts!</li>
              <li><strong>Finger Servos:</strong> SG90 micro-servos connected by fishing line to pull fingers for motorized articulation.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-gray-800 flex justify-end">
          <button
            onClick={() => {
              soundFx.playHudBeep('subtle');
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-gray-950 font-tech font-bold text-xs tracking-wider transition-all cursor-pointer"
          >
            DISMISS & RETURN TO GAUNTLET HUD
          </button>
        </div>
      </div>
    </div>
  );
};
