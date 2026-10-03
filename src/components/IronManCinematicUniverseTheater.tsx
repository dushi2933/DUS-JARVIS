import React, { useState } from 'react';
import { 
  Film, 
  Play, 
  Calendar, 
  Award, 
  ShieldAlert, 
  Users, 
  Zap, 
  Sparkles, 
  Volume2, 
  MessageSquareQuote,
  Star,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { jarvisVoice } from '../utils/speech';
import { soundFx } from '../utils/audioEffects';
import { useToast } from '../context/ToastContext';

export interface McuMovie {
  id: string;
  title: string;
  year: number;
  phase: string;
  directors: string;
  runtime: string;
  boxOffice: string;
  rating: string;
  synopsis: string;
  iconicQuote: string;
  quoteSpeaker: string;
  debutSuits: string[];
  villains: string[];
  keyBattles: string[];
}

export const MCU_IRON_MAN_MOVIES: McuMovie[] = [
  {
    id: 'im1',
    title: 'Iron Man',
    year: 2008,
    phase: 'Phase 1 (Origin)',
    directors: 'Jon Favreau',
    runtime: '126 min',
    boxOffice: '$585.8 Million',
    rating: '94% Certified Fresh',
    synopsis: 'After surviving an ambush in Afghanistan by building a rudimentary powered exosuit in a cave, billionaire industrialist Tony Stark constructs the high-tech Mark III armor to eradicate the weapons his company created and battle his traitorous mentor Obadiah Stane.',
    iconicQuote: 'The truth is... I am Iron Man.',
    quoteSpeaker: 'Tony Stark (Press Conference)',
    debutSuits: ['Mark I (Cave Prototype)', 'Mark II (Raw Chrome)', 'Mark III (Hot-Rod Red & Gold)'],
    villains: ['Obadiah Stane / Iron Monger', 'Raza / Ten Rings'],
    keyBattles: ['Cave Extraction Outpost', 'Gulmira Insurgent Raid', 'Stark Industries Arc Reactor Roof Duel'],
  },
  {
    id: 'im2',
    title: 'Iron Man 2',
    year: 2010,
    phase: 'Phase 1',
    directors: 'Jon Favreau',
    runtime: '124 min',
    boxOffice: '$623.9 Million',
    rating: '72% Rotten Tomatoes',
    synopsis: 'Now a world-famous superhero, Tony Stark battles palladium toxicity poisoning his blood from the Arc Reactor, resists government pressure to surrender his technology, and discovers a new synthesized element while confronting Ivan Vanko\'s plasma whips and Justin Hammer\'s drone army.',
    iconicQuote: 'If you could make God bleed, people would cease to believe in Him. There will be blood in the water, and the sharks will come.',
    quoteSpeaker: 'Ivan Vanko (Whiplash)',
    debutSuits: ['Mark IV', 'Mark V (Suitcase Armor)', 'Mark VI (Triangular New Element)', 'War Machine Mark I'],
    villains: ['Ivan Vanko / Whiplash', 'Justin Hammer / Hammer Industries'],
    keyBattles: ['Monaco Historic Grand Prix Track Clash', 'Hammer Drones Japanese Garden Ambush', 'Whiplash Armored Suit Duel'],
  },
  {
    id: 'avengers1',
    title: 'The Avengers',
    year: 2012,
    phase: 'Phase 1 (Climax)',
    directors: 'Joss Whedon',
    runtime: '143 min',
    boxOffice: '$1.520 Billion',
    rating: '91% Certified Fresh',
    synopsis: 'When Loki steals the Tesseract and summons an alien Chitauri invasion over Manhattan, S.H.I.E.L.D. director Nick Fury brings together Iron Man, Captain America, Thor, the Hulk, Black Widow, and Hawkeye to protect Earth, culminating in Tony flying a nuclear missile into the wormhole.',
    iconicQuote: 'Genius, billionaire, playboy, philanthropist. And if we can\'t protect the Earth, you can be damn well sure we\'ll avenge it.',
    quoteSpeaker: 'Tony Stark (To Steve Rogers & Loki)',
    debutSuits: ['Mark VII (Autonomous Mid-Air Deployment Pod)'],
    villains: ['Loki Laufeyson', 'Chitauri Leviathan Armada', 'The Other'],
    keyBattles: ['Stuttgart Square Encounter', 'Forest Thor Lightning Duel (400% Overload)', 'Battle of New York Wormhole Sacrifice'],
  },
  {
    id: 'im3',
    title: 'Iron Man 3',
    year: 2013,
    phase: 'Phase 2 (Kickoff)',
    directors: 'Shane Black',
    runtime: '130 min',
    boxOffice: '$1.215 Billion',
    rating: '79% Certified Fresh',
    synopsis: 'Haunted by severe PTSD and panic attacks following the Battle of New York, Tony Stark constructs dozens of specialized armors. When his Malibu home is destroyed by the mysterious Mandarin, Tony relies on raw ingenuity without armor before activating the legendary House Party Protocol.',
    iconicQuote: 'My armor was never a distraction or a hobby, it was a cocoon. And now I\'m a changed man. You can take away my house, all my tricks and toys. But one thing you can\'t take away: I am Iron Man.',
    quoteSpeaker: 'Tony Stark (Finale Monologue)',
    debutSuits: ['Mark XLII (Prodigal Son)', 'Mark XVI - XLI (House Party Protocol Legion: Heartbreaker, Igor, Shotgun, Bones)'],
    villains: ['Aldrich Killian / A.I.M. / True Mandarin', 'Extremis Super Soldiers', 'Trevor Slattery'],
    keyBattles: ['Malibu Cliffside Mansion Attack', 'Air Force One Barrel Roll Freefall Rescue', 'Norco Oil Tanker House Party Protocol Battle'],
  },
  {
    id: 'aou',
    title: 'Avengers: Age of Ultron',
    year: 2015,
    phase: 'Phase 2',
    directors: 'Joss Whedon',
    runtime: '141 min',
    boxOffice: '$1.405 Billion',
    rating: '76% Certified Fresh',
    synopsis: 'Desperate to create a "suit of armor around the world", Tony Stark uses the Mind Stone to jumpstart the Ultron peacekeeping initiative. When Ultron gains consciousness and decides peace requires human extinction, Tony deploys the Veronica Hulkbuster armor and integrates F.R.I.D.A.Y.',
    iconicQuote: 'Peace in our time. But you don\'t want to protect the world... you want to destroy it.',
    quoteSpeaker: 'Ultron & Tony Stark',
    debutSuits: ['Mark XLIII (Sentry Mode)', 'Mark XLIV (Hulkbuster Veronica)', 'Mark XLV (F.R.I.D.A.Y. Hexagonal Core)'],
    villains: ['Ultron (Prime, Sentry Drones, Vibranium Final Form)', 'Baron Wolfgang von Strucker'],
    keyBattles: ['Sokovia Hydra Fortress Raid', 'Johannesburg Hulk vs Hulkbuster Showdown', 'Battle of Sokovia Floating City Core'],
  },
  {
    id: 'civilwar',
    title: 'Captain America: Civil War',
    year: 2016,
    phase: 'Phase 3 (Kickoff)',
    directors: 'Anthony & Joe Russo',
    runtime: '147 min',
    boxOffice: '$1.155 Billion',
    rating: '90% Certified Fresh',
    synopsis: 'Political pressure over collateral damage mounts with the Sokovia Accords. Tony Stark advocates government oversight while Steve Rogers resists, causing an ideological rift that fractures the Avengers when Helmut Zemo frames Bucky Barnes for the assassination of Tony\'s parents.',
    iconicQuote: 'I don\'t care. He killed my mom. - He\'s my friend. - So was I.',
    quoteSpeaker: 'Tony Stark & Steve Rogers (Siberia Bunker)',
    debutSuits: ['Mark XLVI (Collapsible Helmet, Helicopter Launch)'],
    villains: ['Helmut Zemo (Orchestrator)', 'Crossbones / Brock Rumlow'],
    keyBattles: ['Leipzig-Halle Airport Clash (Team Iron Man vs Team Cap)', 'Siberia Winter Soldier Facility Bunker Brawl'],
  },
  {
    id: 'homecoming',
    title: 'Spider-Man: Homecoming',
    year: 2017,
    phase: 'Phase 3',
    directors: 'Jon Watts',
    runtime: '133 min',
    boxOffice: '$880.2 Million',
    rating: '92% Certified Fresh',
    synopsis: 'Tony Stark mentors young Peter Parker following the Civil War airport clash, providing him with a Stark-enhanced Spider suit. When Peter recklessly challenges the Vulture, Tony steps in to save hundreds of passengers aboard the bisected Staten Island Ferry.',
    iconicQuote: 'If you\'re nothing without this suit, then you shouldn\'t have it. Okay? God, I sound like my dad.',
    quoteSpeaker: 'Tony Stark (To Peter Parker)',
    debutSuits: ['Mark XLVII (Silver Accents, Remote Telepresence)'],
    villains: ['Adrian Toomes / The Vulture', 'Herman Schultz / Shocker'],
    keyBattles: ['Staten Island Ferry Stabilization', 'Coney Island Jet Hijacking Crash'],
  },
  {
    id: 'infinitywar',
    title: 'Avengers: Infinity War',
    year: 2018,
    phase: 'Phase 3',
    directors: 'Anthony & Joe Russo',
    runtime: '149 min',
    boxOffice: '$2.052 Billion',
    rating: '85% Certified Fresh',
    synopsis: 'The Mad Titan Thanos begins his quest to collect all six Infinity Stones and wipe out half of all life. Tony Stark unleashes the Bleeding Edge Mark 50 liquid nanotech armor, journeys into deep space aboard a Q-Ship with Doctor Strange and Spider-Man, and duels Thanos on the ruined surface of Titan.',
    iconicQuote: 'You throw another moon at me, and I\'m gonna lose it. ... All that for a drop of blood.',
    quoteSpeaker: 'Tony Stark & Thanos (Titan Duel)',
    debutSuits: ['Mark L / Mark 50 (Bleeding Edge Liquid Nanotechnology)'],
    villains: ['Thanos (Wielding 4 Infinity Stones)', 'Ebony Maw', 'Cull Obsidian'],
    keyBattles: ['Greenwich Village Bleecker Street Ambush', 'Titan Ruins Duel (Nanotech Blade vs Infinity Gauntlet)'],
  },
  {
    id: 'endgame',
    title: 'Avengers: Endgame',
    year: 2019,
    phase: 'Phase 3 (Grand Climax)',
    directors: 'Anthony & Joe Russo',
    runtime: '181 min',
    boxOffice: '$2.799 Billion (Highest Grossing MCU Film)',
    rating: '94% Certified Fresh',
    synopsis: 'Five years after the Blip, Tony Stark invents the Quantum Space-Time GPS, reconciling with Steve Rogers to launch the Time Heist across MCU history. In the final confrontation against 2014 Thanos, Tony integrates all six Infinity Stones into the Mark 85 Nano Gauntlet to save the universe.',
    iconicQuote: 'I am... inevitable. ... And I... am... Iron Man.',
    quoteSpeaker: 'Thanos & Tony Stark (The Snap)',
    debutSuits: ['Mark LXXXV / Mark 85 (Quantum Nano Armor & Nano Gauntlet)'],
    villains: ['2014 Thanos', 'The Black Order', 'Outriders & Chitauri Army'],
    keyBattles: ['2012 Battle of New York Time Heist', 'Avengers Compound Ruins Clash', 'The Final Infinity Stone Snap'],
  },
];

export const IronManCinematicUniverseTheater: React.FC = () => {
  const { addToast } = useToast();
  const [selectedMovie, setSelectedMovie] = useState<McuMovie>(MCU_IRON_MAN_MOVIES[0]);
  const [isAuditingQuote, setIsAuditingQuote] = useState<boolean>(false);

  const handlePlayQuote = (quote: string) => {
    setIsAuditingQuote(true);
    soundFx.playHudBeep('mode');
    jarvisVoice.speak(quote, undefined, () => setIsAuditingQuote(false));
  };

  return (
    <div className="bg-gray-950/90 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md relative min-h-[660px] flex flex-col p-4 gap-4 select-none">
      <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-amber-500 to-red-700 flex items-center justify-center text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-amber-400">
            <Film className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tech text-base font-bold text-white tracking-wider">
                MCU ARCHIVE // COMPLETE IRON MAN CINEMATIC THEATER
              </h2>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded border border-amber-500/40 bg-amber-950/80 text-amber-300 uppercase font-bold">
                9 FILMS · 2008-2019
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans">
              Complete cinematic dossier of Tony Stark's 11-year Marvel Cinematic Universe journey
            </p>
          </div>
        </div>

        {/* Total Box Office Statistic */}
        <div className="flex items-center gap-2 text-xs font-mono-tech bg-gray-900 px-3 py-1.5 rounded-xl border border-gray-800 text-amber-300">
          <Star className="w-3.5 h-3.5 text-amber-400" />
          <span>MCU LIFETIME GROSS: $12.3 BILLION</span>
        </div>
      </div>

      {/* Film Timeline Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 relative z-10">
        {MCU_IRON_MAN_MOVIES.map((movie) => {
          const isSelected = selectedMovie.id === movie.id;
          return (
            <button
              key={movie.id}
              onClick={() => {
                soundFx.playHudBeep('subtle');
                setSelectedMovie(movie);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-mono-tech font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-105'
                  : 'bg-gray-900/90 border border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <span>{movie.title}</span>
              <span className="text-[10px] opacity-75">({movie.year})</span>
            </button>
          );
        })}
      </div>

      {/* Main Movie Dossier Stage */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
        
        {/* Left Column: Film Overview & Synopsis (7 Cols) */}
        <div className="lg:col-span-7 bg-gray-950/95 border border-cyan-500/30 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-xl">
          
          {/* Top Title & Metadata */}
          <div>
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <div>
                <span className="text-[10px] font-mono-tech text-amber-400 font-bold uppercase tracking-widest block">
                  {selectedMovie.phase} // MARVEL STUDIOS
                </span>
                <h3 className="font-tech text-2xl font-bold text-white tracking-wider mt-0.5">
                  {selectedMovie.title} ({selectedMovie.year})
                </h3>
              </div>
              <div className="text-right font-mono-tech text-xs">
                <span className="text-cyan-300 font-bold block">{selectedMovie.rating}</span>
                <span className="text-gray-500 text-[10px]">{selectedMovie.runtime}</span>
              </div>
            </div>

            {/* Synopsis */}
            <p className="text-xs text-gray-300 font-sans leading-relaxed mt-3">
              {selectedMovie.synopsis}
            </p>
          </div>

          {/* Iconic Spoken Dialogue Quote Card */}
          <div className="bg-gray-900/90 p-4 rounded-xl border border-amber-500/30 flex flex-col gap-2 relative shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-tech text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquareQuote className="w-4 h-4 text-amber-400" />
                <span>ICONIC DIALOGUE // {selectedMovie.quoteSpeaker.toUpperCase()}</span>
              </span>

              <button
                onClick={() => handlePlayQuote(selectedMovie.iconicQuote)}
                className="py-1 px-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-gray-950 font-tech font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-all shadow"
              >
                <Volume2 className="w-3 h-3 text-gray-950" />
                <span>HEAR QUOTE</span>
              </button>
            </div>

            <p className="text-sm font-serif italic text-white tracking-wide leading-relaxed">
              "{selectedMovie.iconicQuote}"
            </p>
          </div>

          {/* Key Battles */}
          <div>
            <span className="text-[10px] font-mono-tech text-gray-400 uppercase tracking-wider block mb-1.5">
              KEY COMBAT CLASHES
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedMovie.keyBattles.map((b, i) => (
                <span key={i} className="text-xs bg-gray-900 border border-gray-800 text-gray-300 px-2.5 py-1 rounded-lg font-mono-tech">
                  ⚔️ {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Suit Debuts & Villains Dossier (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          
          {/* Card 1: Debut Armors in this Film */}
          <div className="bg-gray-900/90 border border-cyan-500/20 rounded-xl p-3.5 flex flex-col gap-2.5">
            <span className="font-tech text-xs font-bold text-cyan-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-800 pb-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>ARMORS DEBUTED IN THIS FILM</span>
            </span>

            <div className="space-y-1.5">
              {selectedMovie.debutSuits.map((suit, i) => (
                <div key={i} className="p-2 rounded-lg bg-gray-950 border border-gray-800 text-xs font-mono-tech text-cyan-300 flex items-center justify-between">
                  <span>{suit}</span>
                  <span className="text-[9px] text-amber-400 font-bold">CANONICAL</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Primary Antagonists */}
          <div className="bg-gray-900/90 border border-red-500/20 rounded-xl p-3.5 flex flex-col gap-2.5">
            <span className="font-tech text-xs font-bold text-red-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-800 pb-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>PRIMARY THREAT ANTAGONISTS</span>
            </span>

            <div className="space-y-1.5">
              {selectedMovie.villains.map((v, i) => (
                <div key={i} className="p-2 rounded-lg bg-gray-950 border border-gray-800 text-xs font-mono-tech text-red-300 flex items-center justify-between">
                  <span>{v}</span>
                  <span className="text-[9px] text-red-400 font-bold">NEUTRALIZED</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Production Telemetry */}
          <div className="bg-gray-900/90 border border-gray-800 rounded-xl p-3 text-xs font-mono-tech text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>DIRECTOR:</span>
              <span className="text-white font-bold">{selectedMovie.directors}</span>
            </div>
            <div className="flex justify-between">
              <span>GLOBAL BOX OFFICE:</span>
              <span className="text-amber-300 font-bold">{selectedMovie.boxOffice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
