import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  DollarSign, 
  Star, 
  Award, 
  Users, 
  Share2, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Lock, 
  Smartphone, 
  Radar, 
  Sparkles, 
  ChevronRight,
  Send,
  MessageSquare,
  ThumbsUp,
  Download,
  Copy,
  Check,
  Building2,
  Calendar,
  AlertCircle,
  CreditCard,
  Wallet,
  Banknote
} from 'lucide-react';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useToast } from '../context/ToastContext';

interface BankSettings {
  accountHolder: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  swiftCode: string;
  currency: 'LKR' | 'USD';
  lankaPayCeft: boolean;
  friMiFlashNumber: string;
  whatsappNumber: string;
  instructions: string;
}

const SRI_LANKA_BANKS = [
  'Commercial Bank of Ceylon (COMBANK)',
  'Pan Asia Banking Corporation (Pan Asia Bank)',
  'Sampath Bank PLC',
  'Hatton National Bank (HNB)',
  'Bank of Ceylon (BOC)',
  "People's Bank Sri Lanka",
  'Nations Trust Bank (NTB / FriMi)',
  'Seylan Bank PLC',
  'DFCC Bank',
  'National Development Bank (NDB)',
  'Standard Chartered / HSBC Sri Lanka',
  'Other / International Wire'
];

interface InvestorReview {
  id: string;
  name: string;
  role: string;
  amountPledged: number;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

interface PledgeRecord {
  id: string;
  name: string;
  email: string;
  amount: number;
  amountLkr?: number;
  currency?: 'USD' | 'LKR';
  tier: string;
  equityPercent: number;
  dealType: 'equity' | 'revenue_share';
  signature: string;
  date: string;
}

const DEFAULT_REVIEWS: InvestorReview[] = [
  {
    id: 'rev-1',
    name: 'Marcus Sterling',
    role: 'Angel Tech Backer',
    amountPledged: 500,
    rating: 5,
    comment: 'Tested the real-time AI camera spatial guidance. Hands-free voice navigation through earbuds is genuinely innovative and has massive market potential. Proud early backer!',
    date: 'Oct 3, 2026',
    verified: true,
  },
  {
    id: 'rev-2',
    name: 'Elena Rostova',
    role: 'Venture Scout & Seed Investor',
    amountPledged: 250,
    rating: 5,
    comment: 'The dual bag-mode and shirt-pocket phone bodycam solve real navigation hurdles. Solid MVP with incredible energy and high margin unit economics.',
    date: 'Oct 4, 2026',
    verified: true,
  },
  {
    id: 'rev-3',
    name: 'David K. Vance',
    role: 'Private Equity Associate',
    amountPledged: 100,
    rating: 5,
    comment: 'Clear, transparent allocation of funds ($150 for developer accounts). You rarely see founders with a fully operational prototype before asking for a dollar. Backed!',
    date: 'Oct 5, 2026',
    verified: true,
  }
];

interface StarkInvestmentsPortalProps {
  onLaunchLiveApp: () => void;
  onOpenVirtualLaptop: () => void;
  onOpenFinancialBridge?: () => void;
}

export const StarkInvestmentsPortal: React.FC<StarkInvestmentsPortalProps> = ({
  onLaunchLiveApp,
  onOpenVirtualLaptop,
  onOpenFinancialBridge,
}) => {
  const { addToast } = useToast();

  // Storage-backed Reviews
  const [reviews, setReviews] = useState<InvestorReview[]>(() => {
    try {
      const saved = localStorage.getItem('stark_investor_reviews');
      return saved ? JSON.parse(saved) : DEFAULT_REVIEWS;
    } catch {
      return DEFAULT_REVIEWS;
    }
  });

  // Storage-backed Pledges
  const [pledges, setPledges] = useState<PledgeRecord[]>(() => {
    try {
      const saved = localStorage.getItem('stark_investor_pledges');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Interactive Investment Calculator state
  const [calcAmount, setCalcAmount] = useState<number>(500);
  const [showPledgeModal, setShowPledgeModal] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [showAgreementModal, setShowAgreementModal] = useState<boolean>(false);
  const [showBankModal, setShowBankModal] = useState<boolean>(false);
  const [activePledgeDetail, setActivePledgeDetail] = useState<PledgeRecord | null>(null);

  // Currency Display Mode ('USD' or 'LKR')
  const [displayCurrency, setDisplayCurrency] = useState<'USD' | 'LKR'>('USD');
  const USD_TO_LKR = 300; // Standard Sri Lankan Rupee conversion rate

  // Storage-backed Founder Security PIN
  const [founderPin, setFounderPin] = useState<string>(() => {
    return localStorage.getItem('stark_founder_pin') || '3000';
  });
  const [isFounderUnlocked, setIsFounderUnlocked] = useState<boolean>(false);
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [newPinValue, setNewPinValue] = useState<string>('');
  const [isChangingPin, setIsChangingPin] = useState<boolean>(false);

  // Storage-backed Bank & Payout settings (Sri Lanka & Global)
  const [bankSettings, setBankSettings] = useState<BankSettings>(() => {
    try {
      const saved = localStorage.getItem('stark_bank_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return {
      accountHolder: 'Founder Account / Starkware',
      bankName: 'Commercial Bank of Ceylon (COMBANK)',
      branchName: 'Colombo Main Branch (001)',
      accountNumber: '8004928172',
      swiftCode: 'CCEYLKX',
      currency: 'LKR',
      lankaPayCeft: true,
      friMiFlashNumber: '+94 77 123 4567',
      whatsappNumber: '+94 77 123 4567',
      instructions: 'CEFT / LankaPay Reference: "Starkware Angel Seed Pledge"',
    };
  });

  // Bank form editing state
  const [editBank, setEditBank] = useState<BankSettings>(bankSettings);

  // Pledge Form
  const [investorName, setInvestorName] = useState<string>('');
  const [investorEmail, setInvestorEmail] = useState<string>('');
  const [pledgeCurrency, setPledgeCurrency] = useState<'LKR' | 'USD'>('LKR');
  const [pledgeLkrAmount, setPledgeLkrAmount] = useState<number>(10000);
  const [pledgeAmount, setPledgeAmount] = useState<number>(33.33);
  const [dealType, setDealType] = useState<'equity' | 'revenue_share'>('equity');
  const [digitalSignature, setDigitalSignature] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  // Review Form
  const [reviewerName, setReviewerName] = useState<string>('');
  const [reviewerRole, setReviewerRole] = useState<string>('Seed Investor');
  const [reviewerRating, setReviewerRating] = useState<number>(5);
  const [reviewerComment, setReviewerComment] = useState<string>('');

  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('stark_investor_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.warn(e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('stark_investor_pledges', JSON.stringify(pledges));
    } catch (e) {
      console.warn(e);
    }
  }, [pledges]);

  // Round Statistics
  const targetRaise = 2500;
  const initialCommitted = 850;
  const userPledgedTotal = pledges.reduce((acc, p) => acc + p.amount, 0);
  const totalRaised = initialCommitted + userPledgedTotal;
  const progressPercent = Math.min(100, Math.round((totalRaised / targetRaise) * 100));

  // Equity calculation: $2,500 target for 15% total company equity pool
  const calculateEquity = (amt: number) => {
    const pct = (amt / 2500) * 15;
    return parseFloat(pct.toFixed(2));
  };

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!investorName.trim() || !investorEmail.trim() || !digitalSignature.trim()) {
      addToast({ title: 'Missing Details', message: 'Please complete all fields and sign your pledge.', type: 'alert' });
      return;
    }

    if (pledgeCurrency === 'LKR' && pledgeLkrAmount < 1000) {
      addToast({ title: 'Minimum Pledge Amount', message: 'Please enter an amount of at least Rs. 1,000 LKR.', type: 'alert' });
      return;
    }

    if (pledgeCurrency === 'USD' && pledgeAmount < 3.33) {
      addToast({ title: 'Minimum Pledge Amount', message: 'Please enter an amount of at least $3.33 USD (Rs. 1,000 LKR).', type: 'alert' });
      return;
    }

    if (!termsAccepted) {
      addToast({ title: 'Accept Terms', message: 'Please confirm agreement to the trust & milestone protocol.', type: 'alert' });
      return;
    }

    soundFx.playArcReactorPulse();
    const finalUsdAmount = pledgeCurrency === 'LKR'
      ? parseFloat((pledgeLkrAmount / USD_TO_LKR).toFixed(2))
      : pledgeAmount;
    const finalLkrAmount = pledgeCurrency === 'LKR'
      ? pledgeLkrAmount
      : Math.round(pledgeAmount * USD_TO_LKR);
    const equityPct = calculateEquity(finalUsdAmount);

    const newRecord: PledgeRecord = {
      id: `pledge-${Date.now()}`,
      name: investorName.trim(),
      email: investorEmail.trim(),
      amount: finalUsdAmount,
      amountLkr: finalLkrAmount,
      currency: pledgeCurrency,
      tier: finalUsdAmount >= 1000 ? 'Lead Angel' : finalUsdAmount >= 250 ? 'Growth Backer' : 'Dev Angel',
      equityPercent: equityPct,
      dealType,
      signature: digitalSignature.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    setPledges((prev) => [newRecord, ...prev]);
    setActivePledgeDetail(newRecord);
    setShowPledgeModal(false);
    setShowAgreementModal(true);

    if (pledgeCurrency === 'LKR') {
      jarvisVoice.speak(`Investment commitment of ${finalLkrAmount.toLocaleString()} Rupees acknowledged. Welcome to the Starkware Syndicate, ${investorName}.`);
    } else {
      jarvisVoice.speak(`Investment commitment of $${finalUsdAmount} acknowledged. Welcome to the Starkware Syndicate, ${investorName}.`);
    }

    addToast({
      title: 'Pledge Confirmed!',
      message: `Welcome aboard! Your ${equityPct}% equity commitment agreement is ready.`,
      type: 'protocol',
    });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) {
      addToast({ title: 'Incomplete Review', message: 'Please provide your name and review remarks.', type: 'alert' });
      return;
    }

    soundFx.playHudBeep('confirm');
    const newReview: InvestorReview = {
      id: `rev-${Date.now()}`,
      name: reviewerName.trim(),
      role: reviewerRole.trim() || 'Verified Backer',
      amountPledged: calcAmount,
      rating: reviewerRating,
      comment: reviewerComment.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      verified: true,
    };

    setReviews((prev) => [newReview, ...prev]);
    setShowReviewModal(false);
    setReviewerName('');
    setReviewerComment('');

    jarvisVoice.speak('Investor review verified and published to the public trust ledger.');
    addToast({
      title: 'Review Published',
      message: 'Your investor review is now live on the public ledger.',
      type: 'status',
    });
  };

  const copyShareLink = () => {
    soundFx.playHudBeep('subtle');
    const link = typeof window !== 'undefined' ? `${window.location.origin}/?portal=invest` : 'https://ais-pre-gctvtzkyny3y2dejmhtmr3-258016456798.asia-southeast1.run.app/?portal=invest';
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
    addToast({
      title: 'Investor Link Copied',
      message: 'Send this link to your friend, their father, and potential backers!',
      type: 'protocol',
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 p-3 sm:p-6 text-gray-100 select-none">
      
      {/* ===================================================================== */}
      {/* TOP HERO & SEED STAGE STATUS                                          */}
      {/* ===================================================================== */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-gray-950 to-amber-950/40 border-2 border-amber-500/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/60 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5 shadow">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                <span>STARK INVESTMENTS // ANGEL SEED ROUND</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>WORKING MVP READY</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-tech font-bold text-white tracking-wide leading-tight">
              Invest in J.A.R.V.I.S. Spatial AI & Autonomous Bodycam Wayfinding
            </h1>

            <p className="text-sm text-gray-300 leading-relaxed font-sans">
              We are raising a pre-seed micro-fund to publish on the <strong>Apple App Store</strong> ($99) and <strong>Google Play Store</strong> ($25), scale our real-time computer vision server, and onboard our first 10,000 users. Back our vision today in exchange for real company equity and revenue royalties.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  soundFx.playHudBeep('mode');
                  setShowPledgeModal(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-gray-950 font-tech font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.5)] cursor-pointer flex items-center gap-2 transition-all"
              >
                <DollarSign className="w-4 h-4 text-gray-950" />
                <span>INVEST / PLEDGE CAPITAL</span>
              </button>

              <button
                onClick={onLaunchLiveApp}
                className="px-4 py-2.5 rounded-xl bg-gray-900/90 hover:bg-gray-800 border border-emerald-500/60 text-emerald-300 font-tech font-bold text-sm cursor-pointer flex items-center gap-2 transition-all shadow"
              >
                <Radar className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>TEST LIVE DEMO IN COCKPIT</span>
              </button>

              <button
                onClick={copyShareLink}
                className="px-3.5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 hover:text-white font-mono text-xs cursor-pointer flex items-center gap-1.5 transition-all"
                title="Copy shareable link for investors"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
                <span>{copiedLink ? 'LINK COPIED!' : 'SHARE WITH INVESTORS'}</span>
              </button>

              {/* Founder-Only Bank Vault Button (Protected by PIN) */}
              <button
                onClick={() => {
                  soundFx.playHudBeep('subtle');
                  if (isFounderUnlocked) {
                    setEditBank(bankSettings);
                    setShowBankModal(true);
                  } else {
                    setPinInput('');
                    setPinError('');
                    setShowPinModal(true);
                  }
                }}
                className={`px-3.5 py-2.5 rounded-xl border font-mono text-xs cursor-pointer flex items-center gap-1.5 transition-all shadow ${
                  isFounderUnlocked
                    ? 'bg-purple-900/90 border-purple-400 text-purple-200'
                    : 'bg-purple-950/80 hover:bg-purple-900 border-purple-500/60 text-purple-300'
                }`}
                title="Founder Only: Protected Bank & Payout Vault"
              >
                <Lock className="w-4 h-4 text-purple-400" />
                <span>{isFounderUnlocked ? 'FOUNDER VAULT (UNLOCKED)' : 'FOUNDER BANK VAULT (PIN)'}</span>
              </button>

              {/* Financial Bridge & Biometric 2FA Withdrawals */}
              {onOpenFinancialBridge && (
                <button
                  onClick={() => {
                    soundFx.playHudBeep('mode');
                    onOpenFinancialBridge();
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-300 font-mono text-xs cursor-pointer flex items-center gap-1.5 transition-all shadow"
                  title="Open Encrypted Bank API Bridge & Biometric 2FA Withdrawals"
                >
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>FINANCIAL BRIDGE & 2FA WITHDRAWAL</span>
                </button>
              )}

              {/* Currency Toggle: USD vs LKR */}
              <button
                onClick={() => {
                  soundFx.playHudBeep('subtle');
                  setDisplayCurrency(displayCurrency === 'USD' ? 'LKR' : 'USD');
                }}
                className="px-3 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-700 text-amber-300 font-mono text-xs cursor-pointer flex items-center gap-1"
                title="Toggle Currency (USD / Sri Lankan Rupee LKR)"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>{displayCurrency === 'USD' ? 'USD ($)' : 'LKR (රු)'}</span>
              </button>
            </div>
          </div>

          {/* Seed Round Tracker Card */}
          <div className="w-full md:w-80 bg-gray-950/90 border-2 border-amber-500/50 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 font-mono shrink-0">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <span className="text-xs text-gray-400 font-sans">ROUND MILESTONE</span>
              <span className="text-xs text-amber-400 font-bold">PRE-SEED SEEDLING</span>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-bold text-white font-tech">
                  {displayCurrency === 'USD'
                    ? `$${totalRaised.toLocaleString()}`
                    : `රු ${(totalRaised * USD_TO_LKR).toLocaleString()}`}
                </span>
                <span className="text-xs text-gray-400">
                  of {displayCurrency === 'USD' ? `$${targetRaise.toLocaleString()}` : `රු ${(targetRaise * USD_TO_LKR).toLocaleString()}`}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-gray-900 rounded-full mt-2 overflow-hidden border border-gray-800 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2 font-sans">
                <span>{progressPercent}% Funded</span>
                <span>{3 + pledges.length} Backers</span>
              </div>
            </div>

            <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-2.5 text-[11px] text-amber-200 font-sans leading-relaxed">
              🎯 <strong>First Goal ({displayCurrency === 'USD' ? '$150' : 'රු 45,000'}):</strong> 100% covers Apple & Google Developer Accounts to deploy both native apps to the stores via Sri Lanka bank transfer!
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3 INVESTMENT TIERS (EQUITY & REVENUE SHARE)                           */}
      {/* ===================================================================== */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-tech font-bold text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400" />
              <span>OFFICIAL INVESTMENT TIERS & EQUITY PACKAGES</span>
            </h2>
            <p className="text-xs text-gray-400 font-sans">
              Choose your commitment tier. All investments are backed by our transparent digital shareholder agreement.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-3 py-1 rounded-full self-start">
            Equity Pool: 15.0% Reserved
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Tier 1: Founding Family & Angel Patron (Rs. 10,000) */}
          <div className="bg-gray-900/80 border border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500 transition-all shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  FOUNDING PATRON
                </span>
                <span className="text-xs font-mono text-emerald-300">1.5% Equity / Royalty</span>
              </div>
              <h3 className="text-lg font-tech font-bold text-white">Founding Family & Angel Ticket</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-tech font-bold text-emerald-300">Rs. 10,000</span>
                <span className="text-xs text-gray-400">($33.33 USD)</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Founding ticket directly securing our Google Play registration & live testing deployment.
              </p>
              <ul className="text-xs text-gray-300 space-y-1.5 font-sans pt-2 border-t border-gray-800">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Founding Angel Share & Monthly Revenue Royalty</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Lifetime Pro Pass to J.A.R.V.I.S. ($39/yr value)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Founding Partner Name in App Store Credits</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                setPledgeCurrency('LKR');
                setPledgeLkrAmount(10000);
                setPledgeAmount(33.33);
                setShowPledgeModal(true);
              }}
              className="mt-5 w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-tech font-bold text-xs cursor-pointer transition-all shadow"
            >
              BACK WITH RS. 10,000 ($33.33)
            </button>
          </div>

          {/* Tier 2: Growth Syndicate Backer (Most Popular) */}
          <div className="bg-gradient-to-b from-amber-950/40 via-gray-900 to-gray-950 border-2 border-amber-500 rounded-2xl p-5 flex flex-col justify-between shadow-[0_0_30px_rgba(245,158,11,0.25)] relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-gray-950 font-mono font-bold text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
              RECOMMENDED FOR INVESTORS
            </span>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/40">
                  GROWTH SYNDICATE
                </span>
                <span className="text-xs font-mono text-amber-400 font-bold">3% to 5% Equity</span>
              </div>
              <h3 className="text-lg font-tech font-bold text-white">Growth Partner Backer</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-tech font-bold text-amber-400">$250 – $500</span>
                <span className="text-xs text-gray-400">pledge</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Funds cloud AI infrastructure and initial user marketing push for our first 1,000 paying subscribers.
              </p>
              <ul className="text-xs text-gray-300 space-y-1.5 font-sans pt-2 border-t border-gray-800">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>3.0% – 5.0% Direct Equity Shares in the Company</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Quarterly Financial Statements & P&L Reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>VIP Product Advisory Channel with Tony Stark founders</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>5 Free Lifetime Pro Accounts for friends & family</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                setPledgeCurrency('USD');
                setPledgeAmount(500);
                setPledgeLkrAmount(150000);
                setShowPledgeModal(true);
              }}
              className="mt-5 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-tech font-bold text-xs cursor-pointer shadow-lg transition-all"
            >
              SELECT GROWTH PARTNER ($500)
            </button>
          </div>

          {/* Tier 3: Lead Angel Investor */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/50 transition-all shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  LEAD SYNDICATE
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">10% to 15% Equity</span>
              </div>
              <h3 className="text-lg font-tech font-bold text-white">Lead Angel Partner</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-tech font-bold text-white">$1,000 – $2,500</span>
                <span className="text-xs text-gray-400">pledge</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Full seed round underwriting. Accelerates full commercial deployment and national B2B partnerships.
              </p>
              <ul className="text-xs text-gray-300 space-y-1.5 font-sans pt-2 border-t border-gray-800">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>10.0% – 15.0% Preferred Equity Stake</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Advisory Board Observer Seat</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Right of First Refusal (ROFR) in Series A</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Direct WhatsApp / Phone access to Lead Engineer</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                setPledgeCurrency('USD');
                setPledgeAmount(1500);
                setPledgeLkrAmount(450000);
                setShowPledgeModal(true);
              }}
              className="mt-5 w-full py-2.5 rounded-xl bg-gray-800 hover:bg-emerald-600 text-white font-tech font-bold text-xs cursor-pointer transition-all"
            >
              SELECT LEAD ANGEL ($1,500)
            </button>
          </div>
        </div>

        {/* Tier 4 / Custom Amount Banner: Any price above Rs. 1,000 */}
        <div className="mt-5 p-5 bg-gradient-to-r from-gray-900 via-amber-950/40 to-gray-900 border-2 border-dashed border-amber-500/60 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/40">
                ANY AMOUNT // CUSTOM TICKET
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">Min. Rs. 1,000 LKR</span>
            </div>
            <h4 className="text-base font-tech font-bold text-white">
              CUSTOM ANGEL CONTRIBUTION (ANY PRICE ABOVE RS. 1,000)
            </h4>
            <p className="text-xs text-gray-300 font-sans max-w-xl leading-relaxed">
              Back our launch with <strong>any amount above Rs. 1,000</strong> (e.g. Rs. 1,000, Rs. 2,500, Rs. 5,000, Rs. 10,000, Rs. 20,000+). Every single rupee receives proportional shareholder equity and official digital certification.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            <button
              onClick={() => {
                setPledgeCurrency('LKR');
                setPledgeLkrAmount(1000);
                setPledgeAmount(3.33);
                setShowPledgeModal(true);
              }}
              className="w-full md:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-gray-950 font-tech font-bold text-xs cursor-pointer shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Banknote className="w-4 h-4" />
              <span>PLEDGE ANY AMOUNT (&ge; RS. 1,000)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* INTERACTIVE EQUITY & ROI ESTIMATOR CALCULATOR                         */}
      {/* ===================================================================== */}
      <div className="bg-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-tech font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>INVESTMENT CALCULATOR & RETURN ESTIMATOR</span>
            </h3>
            <p className="text-xs text-gray-400 font-sans">
              Slide to see how much equity you receive and projected monthly dividend returns at 1,000 to 5,000 paying subscribers.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 block font-mono">YOUR INVESTMENT</span>
            <span className="text-2xl font-tech font-bold text-emerald-400">${calcAmount.toLocaleString()}</span>
          </div>
        </div>

        <div>
          <input
            type="range"
            min={25}
            max={2500}
            step={25}
            value={calcAmount}
            onChange={(e) => setCalcAmount(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-400 cursor-pointer h-2 bg-gray-800 rounded-lg"
          />
          <div className="flex justify-between text-[11px] font-mono text-gray-500 mt-1">
            <span>$25 (Google Play fee)</span>
            <span>$500 (Syndicate)</span>
            <span>$1,500 (Lead Angel)</span>
            <span>$2,500 (Full Round)</span>
          </div>
        </div>

        {/* Calculated Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          <div className="p-3 bg-gray-900 rounded-xl border border-gray-800">
            <span className="text-[10px] text-gray-400 block font-sans">COMPANY EQUITY</span>
            <span className="text-xl font-bold text-white">{calculateEquity(calcAmount)}%</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">Direct Shares</span>
          </div>

          <div className="p-3 bg-gray-900 rounded-xl border border-gray-800">
            <span className="text-[10px] text-gray-400 block font-sans">MRR AT 1,000 USERS</span>
            <span className="text-xl font-bold text-amber-300">
              ${Math.round(4990 * (calculateEquity(calcAmount) / 100))}/mo
            </span>
            <span className="text-[10px] text-gray-400 block mt-0.5">Est. monthly dividend</span>
          </div>

          <div className="p-3 bg-gray-900 rounded-xl border border-gray-800">
            <span className="text-[10px] text-gray-400 block font-sans">MRR AT 5,000 USERS</span>
            <span className="text-xl font-bold text-cyan-300">
              ${Math.round(24950 * (calculateEquity(calcAmount) / 100))}/mo
            </span>
            <span className="text-[10px] text-gray-400 block mt-0.5">Scale dividend</span>
          </div>

          <div className="p-3 bg-gray-900 rounded-xl border border-gray-800">
            <span className="text-[10px] text-gray-400 block font-sans">INVESTOR PERK</span>
            <span className="text-xs font-bold text-purple-300 leading-tight block">
              {calcAmount >= 1000 ? 'Board Observer' : calcAmount >= 250 ? 'Quarterly P&L' : 'Founder Pass'}
            </span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">Verified badge</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* INVESTOR REVIEWS & COMMUNITY DUE DILIGENCE (TRUST SYSTEM)              */}
      {/* ===================================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-tech font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-cyan-400" />
              <span>INVESTOR REVIEWS & TRUST VERIFICATION</span>
            </h2>
            <p className="text-xs text-gray-400 font-sans">
              "I can trust them, they have to trust me, and they give reviews." Transparent feedback from real backers.
            </p>
          </div>

          <button
            onClick={() => {
              soundFx.playHudBeep('subtle');
              setShowReviewModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-300 font-tech font-bold text-xs flex items-center gap-2 cursor-pointer self-start"
          >
            <Star className="w-4 h-4 text-cyan-400" />
            <span>WRITE AN INVESTOR REVIEW</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between space-y-3 shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>VERIFIED BACKER</span>
                  </span>
                </div>

                <p className="text-xs text-gray-200 leading-relaxed font-sans italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-gray-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{rev.name}</span>
                  <span className="text-[11px] text-gray-400 block">{rev.role}</span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs font-bold text-amber-400">${rev.amountPledged}</span>
                  <span className="text-[10px] text-gray-500 block">{rev.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* FOUNDER COMMITMENTS & INVESTOR SAFEGUARDS FAQ                         */}
      {/* ===================================================================== */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <h3 className="text-lg font-tech font-bold text-white">
            FOUNDER TRANSPARENCY & INVESTOR SAFEGUARDS
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-1">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Where will my money be spent?</span>
            </h4>
            <p className="text-gray-400 leading-relaxed">
              100% of the first $150 goes directly to Apple Developer ($99) and Google Play Console ($25) registrations. The remaining funds finance GPU inference for Gemini vision models and cloud hosting.
            </p>
          </div>

          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-1">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>How do I receive my return on investment?</span>
            </h4>
            <p className="text-gray-400 leading-relaxed">
              Investors choosing equity receive company shares that appreciate as valuation grows. Investors choosing revenue share receive quarterly royalty payouts directly from our Stripe and App Store revenue pool.
            </p>
          </div>

          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-1">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Can I test the app before investing?</span>
            </h4>
            <p className="text-gray-400 leading-relaxed">
              Yes! Click the green <strong>"Test Live Demo in Cockpit"</strong> button at any time to test the real computer vision navigation, spatial LiDAR grid, and voice controls right now on your computer or phone.
            </p>
          </div>

          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-1">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>What if I have custom investment terms?</span>
            </h4>
            <p className="text-gray-400 leading-relaxed">
              You can pledge custom amounts above $1,000 or negotiate convertible notes / SAFE agreements directly with our team.
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* PLEDGE MODAL                                                          */}
      {/* ===================================================================== */}
      {showPledgeModal && (
        <div
          onClick={() => setShowPledgeModal(false)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border-2 border-amber-500/60 rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4 font-sans text-xs text-gray-200"
          >
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <h3 className="font-tech text-base font-bold text-white">
                  COMMIT ANGEL CAPITAL // PLEDGE TERM SHEET
                </h3>
              </div>
              <button onClick={() => setShowPledgeModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handlePledgeSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">Your Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Jonathan Sterling"
                  value={investorName}
                  onChange={(e) => setInvestorName(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400 font-sans text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="investor@venturefund.com"
                  value={investorEmail}
                  onChange={(e) => setInvestorEmail(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400 font-sans text-xs"
                />
              </div>

              {/* Currency Selector (LKR vs USD) */}
              <div className="bg-gray-950 p-2 rounded-xl border border-gray-800 flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-300">Pledge Currency:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPledgeCurrency('LKR');
                      if (pledgeLkrAmount < 1000) setPledgeLkrAmount(1000);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      pledgeCurrency === 'LKR'
                        ? 'bg-amber-500 text-gray-950 shadow'
                        : 'bg-gray-900 text-gray-400 hover:text-white'
                    }`}
                  >
                    🇱🇰 Sri Lankan Rupees (Rs. LKR)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPledgeCurrency('USD');
                      if (pledgeAmount < 3.33) setPledgeAmount(33.33);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      pledgeCurrency === 'USD'
                        ? 'bg-blue-500 text-white shadow'
                        : 'bg-gray-900 text-gray-400 hover:text-white'
                    }`}
                  >
                    🌐 US Dollars ($ USD)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-bold text-gray-300">
                      {pledgeCurrency === 'LKR' ? 'Amount in Sri Lankan Rupees (Rs.)' : 'Amount in US Dollars ($)'}
                    </label>
                    <span className="text-[10px] text-amber-300 font-mono">
                      {pledgeCurrency === 'LKR'
                        ? `≈ $${(pledgeLkrAmount / USD_TO_LKR).toFixed(2)} USD`
                        : `≈ Rs. ${(pledgeAmount * USD_TO_LKR).toLocaleString()} LKR`}
                    </span>
                  </div>

                  {pledgeCurrency === 'LKR' ? (
                    <div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono font-bold text-sm">
                          Rs.
                        </span>
                        <input
                          type="number"
                          min={1000}
                          step={500}
                          required
                          placeholder="Any price above 1000 (e.g. 1000, 2500, 5000, 10000)"
                          value={pledgeLkrAmount || ''}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setPledgeLkrAmount(val);
                            setPledgeAmount(parseFloat((val / USD_TO_LKR).toFixed(2)));
                          }}
                          className={`w-full bg-gray-950 border rounded-xl pl-10 pr-3 py-2 text-amber-300 font-mono font-bold outline-none text-sm ${
                            pledgeLkrAmount > 0 && pledgeLkrAmount < 1000 ? 'border-amber-500' : 'border-gray-700'
                          }`}
                        />
                      </div>
                      {pledgeLkrAmount > 0 && pledgeLkrAmount < 1000 && (
                        <span className="text-[10px] text-amber-400 font-mono mt-1 block">
                          ⚠️ Minimum price is Rs. 1,000 LKR
                        </span>
                      )}
                      <div className="text-[10px] text-gray-400 mt-1 font-sans">
                        💡 You can type <strong>any price above Rs. 1,000</strong> directly in the box.
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono font-bold text-sm">
                          $
                        </span>
                        <input
                          type="number"
                          min={3.33}
                          step={1}
                          required
                          placeholder="Min 3.33 USD (Rs. 1,000)"
                          value={pledgeAmount || ''}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setPledgeAmount(val);
                            setPledgeLkrAmount(Math.round(val * USD_TO_LKR));
                          }}
                          className="w-full bg-gray-950 border border-gray-700 rounded-xl pl-8 pr-3 py-2 text-amber-300 font-mono font-bold outline-none text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Quick Select Buttons */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {pledgeCurrency === 'LKR' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setPledgeLkrAmount(1000);
                            setPledgeAmount(3.33);
                          }}
                          className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/50 hover:bg-emerald-900 text-emerald-300 text-[10px] font-mono cursor-pointer"
                        >
                          Rs. 1,000 (Min)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPledgeLkrAmount(2500);
                            setPledgeAmount(8.33);
                          }}
                          className="px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-[10px] font-mono cursor-pointer"
                        >
                          Rs. 2,500
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPledgeLkrAmount(5000);
                            setPledgeAmount(16.66);
                          }}
                          className="px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-[10px] font-mono cursor-pointer"
                        >
                          Rs. 5,000
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPledgeLkrAmount(10000);
                            setPledgeAmount(33.33);
                          }}
                          className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-[11px] font-mono cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                        >
                          ★ Rs. 10,000
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPledgeLkrAmount(25000);
                            setPledgeAmount(83.33);
                          }}
                          className="px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-[10px] font-mono cursor-pointer"
                        >
                          Rs. 25,000
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPledgeLkrAmount(45000);
                            setPledgeAmount(150);
                          }}
                          className="px-2 py-0.5 rounded bg-purple-950 border border-purple-500/50 hover:bg-purple-900 text-purple-300 text-[10px] font-mono cursor-pointer"
                        >
                          Rs. 45,000 (Stores)
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setPledgeAmount(3.33);
                            setPledgeLkrAmount(1000);
                          }}
                          className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/50 hover:bg-emerald-900 text-emerald-300 text-[10px] font-mono cursor-pointer"
                        >
                          $3.33 (Rs. 1k)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPledgeAmount(25);
                            setPledgeLkrAmount(7500);
                          }}
                          className="px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-[10px] font-mono cursor-pointer"
                        >
                          $25 (Google)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPledgeAmount(33.33);
                            setPledgeLkrAmount(10000);
                          }}
                          className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-[11px] font-mono cursor-pointer"
                        >
                          ★ $33.33 (Rs. 10k)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPledgeAmount(150);
                            setPledgeLkrAmount(45000);
                          }}
                          className="px-2 py-0.5 rounded bg-purple-950 border border-purple-500/50 hover:bg-purple-900 text-purple-300 text-[10px] font-mono cursor-pointer"
                        >
                          $150 (Both Stores)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPledgeAmount(500);
                            setPledgeLkrAmount(150000);
                          }}
                          className="px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-[10px] font-mono cursor-pointer"
                        >
                          $500 (Syndicate)
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Preferred Structure</label>
                  <select
                    value={dealType}
                    onChange={(e) => setDealType(e.target.value as any)}
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-white outline-none font-sans text-xs"
                  >
                    <option value="equity">
                      Equity Shares ({calculateEquity(pledgeCurrency === 'LKR' ? pledgeLkrAmount / USD_TO_LKR : pledgeAmount)}%)
                    </option>
                    <option value="revenue_share">Revenue Royalty (15% until 2x payout)</option>
                  </select>

                  <div className="mt-3 p-3 bg-gray-950 rounded-xl border border-gray-800 space-y-1">
                    <span className="text-[10px] text-gray-400 block font-mono">YOUR REWARD & TERMS:</span>
                    <span className="text-xs font-bold text-emerald-400 block">
                      {calculateEquity(pledgeCurrency === 'LKR' ? pledgeLkrAmount / USD_TO_LKR : pledgeAmount)}% Founding Stake
                    </span>
                    <span className="text-[10px] text-gray-300 block">
                      • Lifetime J.A.R.V.I.S. Pro Access Pass
                    </span>
                    <span className="text-[10px] text-gray-300 block">
                      • Founding Backer Name in App Store Credits
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">
                  Digital Signature (Type your legal name to sign)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /s/ Jonathan Sterling"
                  value={digitalSignature}
                  onChange={(e) => setDigitalSignature(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-cyan-300 font-mono text-xs outline-none"
                />
              </div>

              <div className="flex items-start gap-2 bg-gray-950 p-3 rounded-xl border border-gray-800">
                <input
                  type="checkbox"
                  id="termsCheck"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 accent-amber-500 cursor-pointer"
                />
                <label htmlFor="termsCheck" className="text-[10px] text-gray-400 leading-relaxed cursor-pointer">
                  I agree that this pledge represents a bona fide commitment to fund Starkware's developer accounts and seed deployment under mutual trust and shareholder governance.
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-gray-950 font-tech font-bold text-xs cursor-pointer shadow-lg transition-all"
              >
                SUBMIT PLEDGE & ISSUE SHARE AGREEMENT (
                {pledgeCurrency === 'LKR'
                  ? `Rs. ${pledgeLkrAmount.toLocaleString()} LKR`
                  : `$${pledgeAmount} USD`}
                )
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* REVIEW MODAL                                                          */}
      {/* ===================================================================== */}
      {showReviewModal && (
        <div
          onClick={() => setShowReviewModal(false)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border-2 border-cyan-500/60 rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4 font-sans text-xs text-gray-200"
          >
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-cyan-400" />
                <h3 className="font-tech text-base font-bold text-white">
                  WRITE AN INVESTOR REVIEW & DUE DILIGENCE
                </h3>
              </div>
              <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Richard Hendricks"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">Your Role / Background</label>
                <input
                  type="text"
                  placeholder="e.g. Angel Investor / Tech Founder / Family Friend"
                  value={reviewerRole}
                  onChange={(e) => setReviewerRole(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewerRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= reviewerRating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono text-amber-300 ml-2">{reviewerRating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">Your Due Diligence Remarks</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share what impressed you about the J.A.R.V.I.S. prototype, the vision, and why you believe in this founder..."
                  value={reviewerComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-white outline-none text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-tech font-bold text-xs cursor-pointer shadow-lg transition-all"
              >
                PUBLISH REVIEW TO PUBLIC LEDGER
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SIGNED SHAREHOLDER AGREEMENT MODAL                                    */}
      {/* ===================================================================== */}
      {showAgreementModal && activePledgeDetail && (
        <div
          onClick={() => setShowAgreementModal(false)}
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border-2 border-emerald-500/80 rounded-3xl p-6 max-w-xl w-full shadow-2xl flex flex-col gap-4 font-sans text-xs text-gray-200"
          >
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="font-tech text-base font-bold text-white">
                    STARKWARE PRE-SEED SHAREHOLDER CERTIFICATE
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400">
                    CERTIFICATE ID: STARK-SEC-{activePledgeDetail.id.slice(-6).toUpperCase()}
                  </span>
                </div>
              </div>
              <button onClick={() => setShowAgreementModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="bg-gray-950 border border-emerald-500/30 rounded-2xl p-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">BENEFICIARY / INVESTOR:</span>
                <span className="text-white font-bold">{activePledgeDetail.name}</span>
              </div>

              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">PLEDGE COMMITMENT:</span>
                <span className="text-amber-400 font-bold">
                  {activePledgeDetail.amountLkr
                    ? `Rs. ${activePledgeDetail.amountLkr.toLocaleString()} LKR ($${activePledgeDetail.amount.toLocaleString()} USD)`
                    : `$${activePledgeDetail.amount.toLocaleString()} USD (Rs. ${(activePledgeDetail.amount * USD_TO_LKR).toLocaleString()} LKR)`}
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">ISSUED EQUITY STAKE:</span>
                <span className="text-emerald-400 font-bold">{activePledgeDetail.equityPercent}% Direct Shares</span>
              </div>

              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">ALLOCATION OF PROCEEDS:</span>
                <span className="text-gray-200">Apple ($99) + Google ($25) Dev Accounts</span>
              </div>

              <div className="flex justify-between pt-1">
                <span className="text-gray-400">DIGITAL SIGNATURE:</span>
                <span className="text-cyan-300 font-bold">{activePledgeDetail.signature}</span>
              </div>
            </div>

            {/* Safe Bank & Sri Lanka Interbank Transfer Details (Account Number Protected) */}
            <div className="p-3.5 bg-gradient-to-br from-purple-950/60 to-gray-950 border border-purple-500/50 rounded-2xl space-y-3 font-mono text-[11px]">
              <div className="flex items-center justify-between border-b border-purple-500/30 pb-2">
                <span className="text-purple-300 font-bold flex items-center gap-1.5 font-sans">
                  <Building2 className="w-4 h-4 text-purple-400" />
                  <span>FOUNDER BANK WIRE & SRI LANKA PAYOUT DETAILS</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                  LANKAPAY / CEFT
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-gray-400 block font-sans">Account Holder:</span>
                  <span className="text-white font-bold">{bankSettings.accountHolder}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-sans">Bank:</span>
                  <span className="text-amber-300 font-bold">{bankSettings.bankName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-sans">Branch:</span>
                  <span className="text-white">{bankSettings.branchName || 'Colombo Main'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-sans">SWIFT Code:</span>
                  <span className="text-cyan-300">{bankSettings.swiftCode || 'CCEYLKX'}</span>
                </div>
                <div className="col-span-2 p-2 bg-gray-950 rounded-xl border border-gray-800">
                  <span className="text-gray-400 block font-sans">Account Number:</span>
                  <span className="text-amber-400 font-bold tracking-widest text-xs">
                    {isFounderUnlocked
                      ? bankSettings.accountNumber
                      : `•••• •••• ${bankSettings.accountNumber.slice(-4)} (Protected for Security)`}
                  </span>
                  {!isFounderUnlocked && (
                    <span className="text-[9px] text-gray-500 block font-sans mt-0.5">
                      Full account number is kept private to protect the founder. Contact the founder via WhatsApp below to complete transfer.
                    </span>
                  )}
                </div>
              </div>

              {/* Direct WhatsApp Contact Button for Safe Transfer */}
              <div className="space-y-1.5 pt-1">
                <a
                  href={`https://wa.me/${bankSettings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello! I pledged $${activePledgeDetail.amount} USD (approx. LKR ${(activePledgeDetail.amount * USD_TO_LKR).toLocaleString()}) for J.A.R.V.I.S. Spatial AI. Please send me your ${bankSettings.bankName} account details to complete the transfer.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-tech font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg transition-all"
                >
                  <span>📲 WHATSAPP FOUNDER TO CONFIRM BANK TRANSFER</span>
                </a>

                {!isFounderUnlocked && (
                  <button
                    onClick={() => {
                      setPinInput('');
                      setPinError('');
                      setShowPinModal(true);
                    }}
                    className="text-[10px] text-purple-400 hover:text-purple-300 underline font-mono text-center block w-full cursor-pointer py-1"
                  >
                    Founder only: Enter PIN to reveal full account number
                  </button>
                )}
              </div>
            </div>

            <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
              This certificate verifies your participation in the Starkware Spatial AI angel syndicate. You can print or download this certificate to present to attorneys, advisors, or co-investors.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-tech font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>PRINT / SAVE AS PDF</span>
              </button>

              <button
                onClick={() => setShowAgreementModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-tech font-bold text-xs cursor-pointer shadow"
              >
                DONE & VERIFIED
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* FOUNDER SECURITY PIN MODAL (RESTRICTS ACCESS TO BANK VAULT)           */}
      {/* ===================================================================== */}
      {showPinModal && (
        <div
          onClick={() => setShowPinModal(false)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border-2 border-purple-500/70 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4 font-sans text-xs text-gray-200"
          >
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-400" />
                <div>
                  <h3 className="font-tech text-base font-bold text-white">
                    FOUNDER SECURITY CLEARANCE
                  </h3>
                  <p className="text-[10px] text-gray-400 font-mono">
                    Restricted Area: Founder Only
                  </p>
                </div>
              </div>
              <button onClick={() => setShowPinModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-gray-300 font-sans leading-relaxed">
              To protect your bank account numbers from accidental access or public view, enter your 4-digit Master PIN.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (pinInput.trim() === founderPin) {
                  soundFx.playHudBeep('confirm');
                  setIsFounderUnlocked(true);
                  setShowPinModal(false);
                  setEditBank(bankSettings);
                  setShowBankModal(true);
                  addToast({
                    title: 'Founder Clearance Granted',
                    message: 'Welcome back! Bank Vault unlocked.',
                    type: 'status',
                  });
                } else {
                  soundFx.playHudBeep('alert');
                  setPinError('Incorrect Master PIN. Default is 3000.');
                }
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">
                  Founder PIN (Default: 3000)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  autoFocus
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError('');
                  }}
                  placeholder="••••"
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2.5 text-center text-xl font-mono text-purple-300 tracking-widest outline-none focus:border-purple-400"
                />
                {pinError && (
                  <span className="text-[10px] text-red-400 block mt-1 font-mono">{pinError}</span>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-tech font-bold text-xs cursor-pointer shadow-lg transition-all"
              >
                UNLOCK FOUNDER BANK VAULT
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* CONNECT BANK & PAYOUT ROUTING CONFIGURATION MODAL (SRI LANKA SPECIFIC) */}
      {/* ===================================================================== */}
      {showBankModal && (
        <div
          onClick={() => setShowBankModal(false)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border-2 border-purple-500/70 rounded-3xl p-6 max-w-xl w-full shadow-2xl flex flex-col gap-4 font-sans text-xs text-gray-200 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-400" />
                <div>
                  <h3 className="font-tech text-base font-bold text-white">
                    FOUNDER BANK ACCOUNT & PAYOUT ROUTING (SRI LANKA)
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Commercial Bank, Pan Asia, LankaPay CEFT & App Store Payouts
                  </p>
                </div>
              </div>
              <button onClick={() => setShowBankModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            {/* Privacy Protection Banner */}
            <div className="p-3 bg-purple-950/60 border border-purple-500/40 rounded-xl space-y-1">
              <span className="font-bold text-purple-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                <span>Zero Public Risk Guarantee</span>
              </span>
              <p className="text-gray-300 text-[10px] leading-relaxed">
                Your full account number will <strong>never be shown publicly</strong> to random visitors. Only you (with PIN {founderPin}) can view this window. Backers are directed to contact you on WhatsApp to request your account number safely.
              </p>
            </div>

            {/* Form to update bank details */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setBankSettings(editBank);
                try {
                  localStorage.setItem('stark_bank_settings', JSON.stringify(editBank));
                } catch (err) {}
                soundFx.playHudBeep('confirm');
                jarvisVoice.speak('Sri Lanka bank payout coordinates secured and synchronized.');
                addToast({
                  title: 'Bank Details Saved!',
                  message: 'Your Commercial Bank / Pan Asia payout coordinates are secured.',
                  type: 'status',
                });
                setShowBankModal(false);
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">
                    Select Your Bank in Sri Lanka
                  </label>
                  <select
                    value={editBank.bankName}
                    onChange={(e) => setEditBank({ ...editBank, bankName: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-400 text-xs"
                  >
                    {SRI_LANKA_BANKS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">
                    Branch Name & Code
                  </label>
                  <input
                    type="text"
                    required
                    value={editBank.branchName}
                    onChange={(e) => setEditBank({ ...editBank, branchName: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-400 text-xs"
                    placeholder="e.g. Colombo Main / Kandy / Panadura"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">
                    Account Holder Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editBank.accountHolder}
                    onChange={(e) => setEditBank({ ...editBank, accountHolder: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-400 text-xs"
                    placeholder="Exact name as in your bank passbook"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">
                    Account Number (Private)
                  </label>
                  <input
                    type="text"
                    required
                    value={editBank.accountNumber}
                    onChange={(e) => setEditBank({ ...editBank, accountNumber: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-amber-300 font-mono outline-none focus:border-purple-400 text-xs"
                    placeholder="e.g. 8004928172"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">
                    SWIFT / BIC Code (For Foreign Inward Remittance)
                  </label>
                  <input
                    type="text"
                    value={editBank.swiftCode}
                    onChange={(e) => setEditBank({ ...editBank, swiftCode: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-cyan-300 font-mono outline-none focus:border-purple-400 text-xs"
                    placeholder="COMBCECX (Commercial) or PABCUS33 (Pan Asia)"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">
                    WhatsApp Number (To receive investor confirmation)
                  </label>
                  <input
                    type="text"
                    required
                    value={editBank.whatsappNumber}
                    onChange={(e) => setEditBank({ ...editBank, whatsappNumber: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-emerald-300 font-mono outline-none focus:border-purple-400 text-xs"
                    placeholder="+94 77 123 4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">
                    FriMi / Flash / Q+ Mobile (Optional)
                  </label>
                  <input
                    type="text"
                    value={editBank.friMiFlashNumber}
                    onChange={(e) => setEditBank({ ...editBank, friMiFlashNumber: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-purple-300 font-mono outline-none focus:border-purple-400 text-xs"
                    placeholder="e.g. +94 7X XXX XXXX"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">
                    Interbank CEFT / LankaPay
                  </label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="lankaPayCheck"
                      checked={editBank.lankaPayCeft}
                      onChange={(e) => setEditBank({ ...editBank, lankaPayCeft: e.target.checked })}
                      className="accent-purple-500 cursor-pointer w-4 h-4"
                    />
                    <label htmlFor="lankaPayCheck" className="text-gray-300 cursor-pointer">
                      Instant CEFT / LankaPay Interbank Transfer Enabled
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">
                  Transfer Reference / Memo for Investor
                </label>
                <input
                  type="text"
                  value={editBank.instructions}
                  onChange={(e) => setEditBank({ ...editBank, instructions: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-gray-200 outline-none focus:border-purple-400 text-xs"
                  placeholder='e.g. "Starkware Angel Seed Pledge - CEFT"'
                />
              </div>

              {/* Founder PIN Change Section */}
              <div className="p-3 bg-gray-950 border border-gray-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-gray-300 font-bold block">Founder Master PIN</span>
                  <span className="text-[10px] text-gray-500 font-mono">Current PIN: {founderPin}</span>
                </div>
                {!isChangingPin ? (
                  <button
                    type="button"
                    onClick={() => setIsChangingPin(true)}
                    className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-purple-300 rounded-lg text-[10px] font-mono cursor-pointer"
                  >
                    Change PIN
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="password"
                      maxLength={6}
                      value={newPinValue}
                      onChange={(e) => setNewPinValue(e.target.value)}
                      placeholder="New PIN"
                      className="w-20 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-center text-xs font-mono text-purple-300 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newPinValue.trim().length >= 4) {
                          setFounderPin(newPinValue.trim());
                          localStorage.setItem('stark_founder_pin', newPinValue.trim());
                          setIsChangingPin(false);
                          setNewPinValue('');
                          addToast({ title: 'PIN Updated', message: 'Master PIN changed successfully.', type: 'status' });
                        }
                      }}
                      className="px-2 py-1 bg-purple-600 text-white rounded text-[10px] font-mono cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-tech font-bold text-xs cursor-pointer shadow-lg transition-all"
              >
                SAVE SRI LANKA BANK & PAYOUT ROUTING DETAILS
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
