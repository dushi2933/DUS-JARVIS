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
  Printer,
  Github,
  Package,
  Copy,
  Check
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { useToast } from '../context/ToastContext';
import { useOwnerAuth } from '../context/OwnerAuthContext';
import { Lock, Unlock, KeyRound } from 'lucide-react';

interface PublishGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishGuideModal: React.FC<PublishGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addToast } = useToast();
  const { isMasterPublishUnlocked, requireMasterPublishAccess } = useOwnerAuth();
  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const [copiedGithub, setCopiedGithub] = React.useState(false);

  const GITHUB_REPO_URL = 'https://github.com/dushi2933/DUS-JARVIS';
  const GITHUB_RELEASES_URL = 'https://github.com/dushi2933/DUS-JARVIS/releases';

  const downloadSourceZip = () => {
    requireMasterPublishAccess(() => {
      soundFx.playArcReactorPulse();
      const link = document.createElement('a');
      link.href = '/api/download/project-source.zip';
      link.download = 'jarvis-ironman-gauntlet-source.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast({
        title: 'Downloading Source ZIP',
        message: 'Downloading complete J.A.R.V.I.S. source code (.zip) to your laptop!',
        type: 'status',
      });
    });
  };

  const downloadExe = () => {
    requireMasterPublishAccess(() => {
      soundFx.playArcReactorPulse();
      const link = document.createElement('a');
      link.href = '/api/download/jarvis-gauntlet-setup.exe';
      link.download = 'JARVIS-IronMan-Gauntlet-Setup.exe';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast({
        title: 'Downloading .exe Installer',
        message: 'Downloading JARVIS-IronMan-Gauntlet-Setup.exe for Windows 10/11!',
        type: 'status',
      });
    });
  };

  const copyGithubLink = () => {
    requireMasterPublishAccess(() => {
      soundFx.playHudBeep('confirm');
      navigator.clipboard.writeText(GITHUB_REPO_URL);
      setCopiedGithub(true);
      setTimeout(() => setCopiedGithub(false), 2500);
      addToast({
        title: 'GitHub Link Copied',
        message: 'GitHub repository link copied to clipboard!',
        type: 'protocol',
      });
    });
  };

  const copyUrl = () => {
    requireMasterPublishAccess(() => {
      soundFx.playHudBeep('confirm');
      navigator.clipboard.writeText(currentUrl);
      addToast({
        title: 'Link Copied',
        message: 'J.A.R.V.I.S. Gauntlet URL copied to clipboard! You can share this link with anyone.',
        type: 'protocol'
      });
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/50 border border-cyan-400/40 flex items-center justify-center text-cyan-400 glow-arc-blue shrink-0">
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

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1.5 border ${
              isMasterPublishUnlocked
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                : 'bg-red-950/80 border-red-500 text-red-300'
            }`}>
              {isMasterPublishUnlocked ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-red-400" />}
              <span>{isMasterPublishUnlocked ? 'CREATOR UNLOCKED' : 'CREATOR PASSCODE REQUIRED'}</span>
            </span>
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

          {/* Step 2: GitHub Repository dushi2933/DUS-JARVIS & Windows (.exe) */}
          <div className="bg-gradient-to-r from-gray-950 via-slate-900 to-cyan-950/50 border-2 border-cyan-500/50 rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-tech font-bold text-sm text-cyan-300">
                <Github className="w-4 h-4 text-cyan-400" />
                <span>Step 2: Connected GitHub Repository: DUS-JARVIS</span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/50 px-2 py-0.5 rounded font-bold">
                REPO CONNECTED: dushi2933/DUS-JARVIS
              </span>
            </div>

            {/* GitHub Repo Status & Releases Info */}
            <div className="bg-gray-900/90 border border-cyan-500/40 rounded-lg p-3 text-xs space-y-2 text-cyan-100 font-mono-tech">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>GitHub Repository: github.com/dushi2933/DUS-JARVIS</span>
                </div>
                <a
                  href="https://github.com/dushi2933/DUS-JARVIS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded bg-cyan-900 hover:bg-cyan-800 text-cyan-200 text-[11px] font-bold flex items-center gap-1 border border-cyan-500/40"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>OPEN ON GITHUB</span>
                </a>
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                Your repository <strong>dushi2933/DUS-JARVIS</strong> is live on GitHub! Note that direct releases links show 404 until a release is drafted on GitHub. You can download the full code right now as a <strong>.ZIP</strong>, or download the <strong>Windows .EXE Launcher</strong>:
              </p>
            </div>

            <p className="leading-relaxed text-gray-300">
              Or download the complete source code (.zip) or Windows executable (.exe) directly right here without needing GitHub:
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Direct Full Source Code ZIP Download */}
              <button
                onClick={downloadSourceZip}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-tech font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.4)] border border-emerald-400/50"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD SOURCE (.ZIP)</span>
              </button>

              {/* Windows .EXE Installer */}
              <button
                onClick={downloadExe}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-tech font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-400/50"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD WINDOWS .EXE</span>
              </button>

              <button
                onClick={copyGithubLink}
                className="px-3 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-cyan-300 border border-cyan-500/40 font-mono text-[11px] flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedGithub ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedGithub ? 'COPIED!' : 'COPY GITHUB LINK'}</span>
              </button>
            </div>
          </div>

          {/* Step 3: Publish & Share Live Link */}
          <div className="bg-gray-950/60 border border-amber-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 font-tech font-bold text-sm text-amber-300 mb-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>Step 3: Publishing & Sharing the Live URL</span>
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
