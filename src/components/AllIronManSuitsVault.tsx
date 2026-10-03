import React, { useState } from 'react';
import { 
  Shield, 
  Zap, 
  Layers, 
  Activity, 
  Flame, 
  Check, 
  Eye, 
  Filter, 
  Cpu, 
  Search,
  Sparkles,
  Info
} from 'lucide-react';
import { ArmorMark } from '../types/gauntlet';
import { soundFx } from '../utils/audioEffects';
import { jarvisVoice } from '../utils/speech';
import { useToast } from '../context/ToastContext';

export interface DetailedSuit {
  mark: string;
  name: string;
  codeName?: string;
  category: 'CLASSIC' | 'HOUSE_PARTY' | 'AVENGERS' | 'NANOTECH';
  year: number;
  movie: string;
  reactorType: string;
  armorMaterial: string;
  specialty: string;
  weapons: string[];
  maxSpeedMach: number;
  hullIntegrity: number;
  isEquippable: boolean;
  colorScheme: string;
}

export const ALL_SUITS_CATALOG: DetailedSuit[] = [
  {
    mark: 'MK-I',
    name: 'Mark I',
    codeName: 'CAVE PROTOTYPE',
    category: 'CLASSIC',
    year: 2008,
    movie: 'Iron Man (2008)',
    reactorType: 'Original Palladium Arc Core (3 GJ/sec)',
    armorMaterial: 'Cast Iron & High-Tensile Scrap Plate',
    specialty: 'Cave extraction escape suit built with Ho Yinsen',
    weapons: ['Dual Arm Flame-Throwers', 'Single Micro-Rocket Shell'],
    maxSpeedMach: 0.2,
    hullIntegrity: 65,
    isEquippable: false,
    colorScheme: 'from-gray-700 to-stone-900',
  },
  {
    mark: 'MK-II',
    name: 'Mark II',
    codeName: 'CHROME AERODYNAMICS',
    category: 'CLASSIC',
    year: 2008,
    movie: 'Iron Man (2008)',
    reactorType: 'Refined Ring Palladium Core',
    armorMaterial: 'High-Polish Raw Chrome Aluminum',
    specialty: 'Supersonic aerodynamic flight test platform (icing problem at 40,000 ft)',
    weapons: ['Twin Palm Repulsors', 'Chest Arc Unibeam'],
    maxSpeedMach: 2.1,
    hullIntegrity: 78,
    isEquippable: false,
    colorScheme: 'from-slate-300 to-gray-500',
  },
  {
    mark: 'MK-III',
    name: 'Mark III',
    codeName: 'HOT-ROD RED & GOLD',
    category: 'CLASSIC',
    year: 2008,
    movie: 'Iron Man (2008)',
    reactorType: 'High-Output Palladium Arc Core',
    armorMaterial: 'Gold-Titanium Alloy with Automotive Lacquer',
    specialty: 'The definitive classic Iron Man battle suit (Gulmira combat & Iron Monger duel)',
    weapons: ['Dual Palm Repulsors', 'Chest Unibeam', 'Shoulder Micro-Guns', 'Anti-Tank Forearm Missile'],
    maxSpeedMach: 3.2,
    hullIntegrity: 88,
    isEquippable: true,
    colorScheme: 'from-red-600 via-amber-500 to-red-700',
  },
  {
    mark: 'MK-IV',
    name: 'Mark IV',
    codeName: 'STARK EXPO EDITION',
    category: 'CLASSIC',
    year: 2010,
    movie: 'Iron Man 2 (2010)',
    reactorType: 'Palladium Generator (High Voltage)',
    armorMaterial: 'Refined Gold-Titanium Composite',
    specialty: 'Streamlined maintenance access with automatic dressing gantry',
    weapons: ['Palm Repulsors', 'Unibeam Projector', 'Flares'],
    maxSpeedMach: 3.4,
    hullIntegrity: 90,
    isEquippable: false,
    colorScheme: 'from-red-600 to-amber-600',
  },
  {
    mark: 'MK-V',
    name: 'Mark V',
    codeName: 'SUITCASE EMERGENCY SUIT',
    category: 'CLASSIC',
    year: 2010,
    movie: 'Iron Man 2 (2010)',
    reactorType: 'Miniaturized Portable Arc Core',
    armorMaterial: 'Lightweight Interlocking Titanium Ribs',
    specialty: 'Collapsible portable briefcase armor for immediate emergency deployment (Monaco GP)',
    weapons: ['Low-Amp Palm Repulsors', 'Emergency Flash Lasers'],
    maxSpeedMach: 1.2,
    hullIntegrity: 62,
    isEquippable: false,
    colorScheme: 'from-red-500 via-slate-300 to-red-600',
  },
  {
    mark: 'MK-VI',
    name: 'Mark VI',
    codeName: 'TRIANGULAR NEW ELEMENT',
    category: 'CLASSIC',
    year: 2010,
    movie: 'Iron Man 2 / The Avengers',
    reactorType: 'Synthesized Vibranium New Element (Vibranium/Badassium isotope)',
    armorMaterial: 'Reinforced Gold-Titanium with Triangular Core Housing',
    specialty: 'Powered by the clean new element; withstood Thor\'s 400% lightning overload',
    weapons: ['200-Petawatt Single-Use Laser Cutters', 'Wrist Micro-Missile Pod', 'Arm Lasers'],
    maxSpeedMach: 4.1,
    hullIntegrity: 94,
    isEquippable: false,
    colorScheme: 'from-red-700 via-amber-500 to-red-800',
  },
  {
    mark: 'MK-VII',
    name: 'Mark VII',
    codeName: 'BATTLE OF NEW YORK',
    category: 'CLASSIC',
    year: 2012,
    movie: 'The Avengers (2012)',
    reactorType: 'Circular High-Density Arc Core',
    armorMaterial: 'Heavy Ballistic Gold-Titanium with Back Thruster Pods',
    specialty: 'Autonomous laser-guided pod deployment attaching to Tony mid-air over Stark Tower',
    weapons: ['Triple-Barrel Arm Lasers', 'Shoulder Swarm Micro-Missiles', 'Knee Flares', 'Heavy Unibeam'],
    maxSpeedMach: 4.5,
    hullIntegrity: 96,
    isEquippable: true,
    colorScheme: 'from-red-600 via-amber-600 to-gray-800',
  },
  {
    mark: 'MK-XVI',
    name: 'Mark XVI',
    codeName: 'NIGHTCLUB',
    category: 'HOUSE_PARTY',
    year: 2013,
    movie: 'Iron Man 3 (2013)',
    reactorType: 'Vibranium-Isotope Stealth Core',
    armorMaterial: 'Carbon-Nanotube Radar-Absorbent Black/Gold Plating',
    specialty: 'Deep stealth reconnaissance with active color camouflage pigmentation',
    weapons: ['Silent Repulsors', 'Thermal Camouflage Field'],
    maxSpeedMach: 3.8,
    hullIntegrity: 82,
    isEquippable: false,
    colorScheme: 'from-neutral-900 via-yellow-700 to-neutral-950',
  },
  {
    mark: 'MK-XVII',
    name: 'Mark XVII',
    codeName: 'HEARTBREAKER',
    category: 'HOUSE_PARTY',
    year: 2013,
    movie: 'Iron Man 3 (2013)',
    reactorType: 'Oversized Artillery Arc RT Core (10 GJ/sec)',
    armorMaterial: 'Heavy Reinforced Blast-Resistant Composite',
    specialty: 'Artillery-level oversized RT chest unibeam projector capable of repulsor shield bubbles',
    weapons: ['Massive RT Unibeam Blast', 'Heavy Repulsor Cannons'],
    maxSpeedMach: 3.5,
    hullIntegrity: 98,
    isEquippable: false,
    colorScheme: 'from-red-700 via-amber-600 to-neutral-900',
  },
  {
    mark: 'MK-XXV',
    name: 'Mark XXV',
    codeName: 'STRIKER / THUMPER',
    category: 'HOUSE_PARTY',
    year: 2013,
    movie: 'Iron Man 3 (2013)',
    reactorType: 'Pneumatic Power Distribution Core',
    armorMaterial: 'High-Temperature Industrial Hazard Shielding',
    specialty: 'Equipped with dual pneumatic jackhammer forearms to pulverize reinforced concrete',
    weapons: ['Dual Heavy Pneumatic Jackhammers', 'Thermal Defense Core'],
    maxSpeedMach: 2.8,
    hullIntegrity: 99,
    isEquippable: false,
    colorScheme: 'from-gray-800 via-yellow-500 to-gray-900',
  },
  {
    mark: 'MK-XXXIII',
    name: 'Mark XXXIII',
    codeName: 'SILVER CENTURION',
    category: 'HOUSE_PARTY',
    year: 2013,
    movie: 'Iron Man 3 (2013)',
    reactorType: 'Enhanced Magnetic Arc Core',
    armorMaterial: 'Polished Silver & Crimson Vibranium Composite',
    specialty: 'Enhanced energy shielding and retractable vibranium forearm blades',
    weapons: ['Retractable Forearm Energy Blades', 'Magnetic Pulse Forcefield'],
    maxSpeedMach: 4.2,
    hullIntegrity: 94,
    isEquippable: false,
    colorScheme: 'from-slate-200 via-red-600 to-slate-400',
  },
  {
    mark: 'MK-XXXVIII',
    name: 'Mark XXXVIII',
    codeName: 'IGOR',
    category: 'HOUSE_PARTY',
    year: 2013,
    movie: 'Iron Man 3 (2013)',
    reactorType: 'Quadruple Industrial Hydraulic Power Core',
    armorMaterial: 'Massive Structural Steel & Tungsten Plates',
    specialty: 'Heavy lifting spinal stabilizer capable of holding up collapsing oil tanker derricks',
    weapons: ['Hydraulic Crushing Clamps', 'Impact Shock Absorbers'],
    maxSpeedMach: 1.8,
    hullIntegrity: 100,
    isEquippable: false,
    colorScheme: 'from-blue-700 via-gray-400 to-blue-900',
  },
  {
    mark: 'MK-XXXIX',
    name: 'Mark XXXIX',
    codeName: 'STARBOOST / GEMINI',
    category: 'HOUSE_PARTY',
    year: 2013,
    movie: 'Iron Man 3 (2013)',
    reactorType: 'Zero-Atmosphere Plasma Core',
    armorMaterial: 'Thermal Radiation-Reflective Ceramic Matrix',
    specialty: 'Sub-orbital space travel with integrated oxygen tanks and conformal thruster pack',
    weapons: ['Dual Conformal Thrusters', 'Solar Flare Repulsor Beam'],
    maxSpeedMach: 7.2,
    hullIntegrity: 95,
    isEquippable: false,
    colorScheme: 'from-stone-100 via-neutral-800 to-amber-500',
  },
  {
    mark: 'MK-XL',
    name: 'Mark XL',
    codeName: 'SHOTGUN',
    category: 'HOUSE_PARTY',
    year: 2013,
    movie: 'Iron Man 3 (2013)',
    reactorType: 'Hyper-Velocity Afterburner Core',
    armorMaterial: 'Ultra-Lightweight Scramjet Titanium Aero-Shell',
    specialty: 'Designed for hyper-velocity flight exceeding Mach 5 with needle-nose aerodynamic fairing',
    weapons: ['Mach 5 Sonic Concussion Repulsors', 'Rapid-Fire Micro-Thrusters'],
    maxSpeedMach: 5.6,
    hullIntegrity: 89,
    isEquippable: false,
    colorScheme: 'from-gray-600 via-slate-400 to-gray-800',
  },
  {
    mark: 'MK-XLI',
    name: 'Mark XLI',
    codeName: 'BONES',
    category: 'HOUSE_PARTY',
    year: 2013,
    movie: 'Iron Man 3 (2013)',
    reactorType: 'Segmented Multi-Node Arc Bus',
    armorMaterial: 'Modular Independent Skeleton Plating',
    specialty: 'Can split its limbs, torso, and helmet into autonomous guided flying pieces and recombine',
    weapons: ['Separable Independent Guided Limbs', 'Omni-Directional Repulsors'],
    maxSpeedMach: 4.4,
    hullIntegrity: 91,
    isEquippable: false,
    colorScheme: 'from-black via-amber-600 to-neutral-900',
  },
  {
    mark: 'MK-XLII',
    name: 'Mark XLII',
    codeName: 'PRODIGAL SON',
    category: 'AVENGERS',
    year: 2013,
    movie: 'Iron Man 3 (2013)',
    reactorType: 'Vibranium-Isotope Sub-Skin Core',
    armorMaterial: 'Gold-Heavy Autonomous Modular Plates',
    specialty: 'Prehensile autonomous propulsion; individual armor pieces fly to Tony via micro-chips in his body',
    weapons: ['Prehensile Flying Segments', 'Concussive Repulsor Blasts'],
    maxSpeedMach: 4.3,
    hullIntegrity: 92,
    isEquippable: false,
    colorScheme: 'from-amber-400 via-amber-600 to-red-700',
  },
  {
    mark: 'MK-XLIII',
    name: 'Mark XLIII',
    codeName: 'AGE OF ULTRON BATTLE SUIT',
    category: 'AVENGERS',
    year: 2015,
    movie: 'Avengers: Age of Ultron (2015)',
    reactorType: 'Infrared Multi-Spectrum Arc Core',
    armorMaterial: 'Reinforced Gold-Titanium with Sentry AI Interface',
    specialty: 'Sokovia Hydra base assault; features Autonomous Sentry mode while Tony investigates on foot',
    weapons: ['Micro-Missile Shoulder Racks', 'High-Output Unibeam', 'Infrared Scan Matrix'],
    maxSpeedMach: 4.8,
    hullIntegrity: 97,
    isEquippable: false,
    colorScheme: 'from-red-600 via-amber-500 to-red-800',
  },
  {
    mark: 'MK-XLIV',
    name: 'Mark XLIV',
    codeName: 'HULKBUSTER (VERONICA)',
    category: 'AVENGERS',
    year: 2015,
    movie: 'Avengers: Age of Ultron (2015)',
    reactorType: '11 Multi-Arc Reactor Network (Quad-Core Chest)',
    armorMaterial: 'Dual-Layered Heavy Vibranium-Steel Composite',
    specialty: 'Orbital satellite drop armor to subdue the Hulk; includes rapid-replacement limb dock & jackhammer punch',
    weapons: ['Hydraulic Jackhammer Fist', 'Repulsor Concussion Shocker', 'Sedative Gas Sprayers', 'Chemical Sleep Clamps'],
    maxSpeedMach: 2.2,
    hullIntegrity: 100,
    isEquippable: false,
    colorScheme: 'from-red-700 via-amber-500 to-red-950',
  },
  {
    mark: 'MK-XLV',
    name: 'Mark XLV',
    codeName: 'SOKOVIA ULTRON FINALE',
    category: 'AVENGERS',
    year: 2015,
    movie: 'Avengers: Age of Ultron (2015)',
    reactorType: 'Hexagonal New Element Reactor',
    armorMaterial: 'Streamlined Chrome-Trimmed Vibranium Alloy',
    specialty: 'First suit integrated with F.R.I.D.A.Y. AI; decimated Ultron drone army in Sokovia church',
    weapons: ['Hexagonal High-Density Unibeam', 'Triple-Output Repulsors'],
    maxSpeedMach: 5.1,
    hullIntegrity: 98,
    isEquippable: false,
    colorScheme: 'from-red-600 via-amber-400 to-red-900',
  },
  {
    mark: 'MK-XLVI',
    name: 'Mark XLVI',
    codeName: 'CIVIL WAR COMMAND ARMOR',
    category: 'AVENGERS',
    year: 2016,
    movie: 'Captain America: Civil War (2016)',
    reactorType: 'Miniature Multi-Arc Sensor Array Core',
    armorMaterial: 'Foldable Titanium Composite with Collapsible Helmet',
    specialty: 'Equipped with 28 miniature arc reactor sensor nodes around the chassis for 360-degree battlefield telemetry',
    weapons: ['Acoustic Disruption Pulse', 'EMP Darts', 'Laser Slicers', 'F.R.I.D.A.Y. Combat Fight Pattern Scanner'],
    maxSpeedMach: 5.2,
    hullIntegrity: 97,
    isEquippable: false,
    colorScheme: 'from-red-600 via-amber-500 to-neutral-900',
  },
  {
    mark: 'MK-XLVII',
    name: 'Mark XLVII',
    codeName: 'HOMECOMING SILVER ACCENT',
    category: 'AVENGERS',
    year: 2017,
    movie: 'Spider-Man: Homecoming (2017)',
    reactorType: 'Next-Gen Multi-Frequency Arc Core',
    armorMaterial: 'Silver-Plated Midsection Homage to Ultimate Iron Man',
    specialty: 'Remote telepresence piloting while Tony was in India; Ferry stabilization thruster arrays',
    weapons: ['Water-Stabilization Repulsor Web', 'Remote Drone Transponders'],
    maxSpeedMach: 5.3,
    hullIntegrity: 98,
    isEquippable: false,
    colorScheme: 'from-red-600 via-slate-300 to-red-800',
  },
  {
    mark: 'MK-L',
    name: 'Mark L (Mark 50)',
    codeName: 'BLEEDING EDGE NANOTECH',
    category: 'NANOTECH',
    year: 2018,
    movie: 'Avengers: Infinity War (2018)',
    reactorType: 'RT-08 Nanotech Arc Reactor Housing Unit',
    armorMaterial: 'Solidified Liquid Nanoparticles (Nanotechnology)',
    specialty: 'Stored inside chest housing unit; instantaneously morphs into energy blades, shields, foot wings, or cannon arrays',
    weapons: ['Nanotech Battering Rams', 'Energy Blade', 'Zero-G Wing Thrusters', 'Micro-Missile Barrage', 'Energy Shield'],
    maxSpeedMach: 8.5,
    hullIntegrity: 99,
    isEquippable: true,
    colorScheme: 'from-red-600 via-cyan-400 to-amber-500',
  },
  {
    mark: 'MK-LXXXV',
    name: 'Mark LXXXV (Mark 85)',
    codeName: 'THE ULTIMATE NANO ARMOR',
    category: 'NANOTECH',
    year: 2019,
    movie: 'Avengers: Endgame (2019)',
    reactorType: 'Quantum Singularity Arc Core with Cosmic Energy Channelling',
    armorMaterial: 'Vibranium-Infused Smart Nanite Matrix with Gold Musculature',
    specialty: 'Classic comic-accurate gold sleeves; housed all 6 Infinity Stones for the decisive cosmic snap ("I am Iron Man")',
    weapons: ['Lightning Refocuser Back Array', 'Energy Shield', 'Nano Blade', 'Nano Gauntlet Infinity Housing', 'Maximum Unibeam'],
    maxSpeedMach: 9.8,
    hullIntegrity: 100,
    isEquippable: true,
    colorScheme: 'from-red-600 via-amber-400 to-cyan-300',
  },
];

export const AllIronManSuitsVault: React.FC<{
  currentMark: ArmorMark;
  onEquipSuit: (mark: ArmorMark) => void;
}> = ({ currentMark, onEquipSuit }) => {
  const { addToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSuit, setSelectedSuit] = useState<DetailedSuit>(ALL_SUITS_CATALOG[ALL_SUITS_CATALOG.length - 1]);

  const filteredSuits = ALL_SUITS_CATALOG.filter((suit) => {
    const matchesCat = selectedCategory === 'ALL' || suit.category === selectedCategory;
    const matchesQuery = 
      suit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (suit.codeName && suit.codeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      suit.movie.toLowerCase().includes(searchQuery.toLowerCase()) ||
      suit.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleEquip = (suit: DetailedSuit) => {
    soundFx.playRepulsorCharge();
    if (suit.mark === 'MK-III' || suit.mark === 'MK-VII' || suit.mark === 'MK-L' || suit.mark === 'MK-LXXXV') {
      const markMap: Record<string, ArmorMark> = {
        'MK-III': 'MK-III',
        'MK-VII': 'MK-VII',
        'MK-L': 'MK-50',
        'MK-LXXXV': 'MK-85',
      };
      onEquipSuit(markMap[suit.mark]);
    }

    jarvisVoice.speak(`Arming ${suit.name} ${suit.codeName || ''}. Telemetry synchronized with gauntlet HUD.`);
    addToast({
      title: `${suit.name} Equipped!`,
      message: `Chassis configured to ${suit.name} (${suit.specialty.slice(0, 50)}...).`,
      type: 'protocol',
    });
  };

  return (
    <div className="bg-gray-950/90 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md relative min-h-[660px] flex flex-col p-4 gap-4 select-none">
      <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-amber-500 to-red-700 flex items-center justify-center text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-amber-400">
            <Shield className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tech text-base font-bold text-white tracking-wider">
                STARK HALL OF ARMORS // COMPLETE CANONICAL SUIT VAULT
              </h2>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded border border-cyan-500/40 bg-cyan-950/80 text-cyan-300 uppercase font-bold animate-pulse">
                {ALL_SUITS_CATALOG.length} SUITS CATALOGED
              </span>
            </div>
            <p className="text-xs text-gray-400 font-sans">
              From the Mark I cave prototype to the Mark 85 Infinity Gauntlet armor — specs, loadouts, and gauntlet calibration
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Mark, weapon, movie..."
              className="py-1.5 pl-8 pr-3 rounded-lg bg-gray-900 border border-gray-800 text-xs text-cyan-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono-tech w-56"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 relative z-10">
        {[
          { id: 'ALL', label: 'ALL 24 CANONICAL MARKS' },
          { id: 'CLASSIC', label: 'CLASSIC MCU (MK I - VII)' },
          { id: 'HOUSE_PARTY', label: 'HOUSE PARTY PROTOCOL (MK XVI - XLI)' },
          { id: 'AVENGERS', label: 'AGE OF ULTRON & CIVIL WAR' },
          { id: 'NANOTECH', label: 'NANOTECH & ENDGAME (MK 50 & 85)' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              soundFx.playHudBeep('subtle');
              setSelectedCategory(cat.id);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech font-bold whitespace-nowrap cursor-pointer transition-all ${
              selectedCategory === cat.id
                ? 'bg-cyan-600 text-gray-950 font-extrabold shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                : 'bg-gray-900/90 border border-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Vault Grid + Selected Suit Hologram Inspector */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
        
        {/* Left Column: Suits Catalog Grid (7 Cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
          {filteredSuits.map((suit) => {
            const isSelected = selectedSuit.mark === suit.mark;
            return (
              <div
                key={suit.mark}
                onClick={() => {
                  soundFx.playHudBeep('subtle');
                  setSelectedSuit(suit);
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg'
                    : 'bg-gray-950/70 border-gray-800 hover:border-gray-700 text-gray-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono-tech font-bold text-amber-400 block">
                      {suit.mark}
                    </span>
                    <h4 className="font-tech text-xs font-bold text-white tracking-wider">
                      {suit.name} {suit.codeName ? `// ${suit.codeName}` : ''}
                    </h4>
                  </div>
                  <span className="text-[9px] font-mono-tech px-1.5 py-0.5 rounded bg-black/60 border border-gray-800 text-cyan-300">
                    {suit.year}
                  </span>
                </div>

                <p className="text-[11px] font-sans text-gray-400 line-clamp-2 leading-snug">
                  {suit.specialty}
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono-tech pt-1 border-t border-gray-800/60">
                  <span className="text-gray-500">{suit.movie}</span>
                  <span className="text-cyan-400 font-bold">MACH {suit.maxSpeedMach}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: High-Tech Inspector for Selected Suit (5 Cols) */}
        <div className="lg:col-span-5 bg-gray-900/95 border border-cyan-500/30 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-xl">
          {/* Top Dossier Header */}
          <div className="border-b border-gray-800 pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono-tech text-amber-400 font-bold uppercase tracking-widest block">
                {selectedSuit.category.replace('_', ' ')} // CLASSIFIED DOSSIER
              </span>
              <h3 className="font-tech text-lg font-bold text-white tracking-wider">
                {selectedSuit.name} {selectedSuit.codeName ? `"${selectedSuit.codeName}"` : ''}
              </h3>
              <p className="text-xs text-gray-400 font-sans mt-0.5">{selectedSuit.movie}</p>
            </div>

            <button
              onClick={() => handleEquip(selectedSuit)}
              className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-tech font-bold text-xs tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>EQUIP SUIT</span>
            </button>
          </div>

          {/* Technical Specs List */}
          <div className="space-y-2 text-xs font-mono-tech">
            <div className="p-2 rounded-lg bg-gray-950 border border-gray-800">
              <span className="text-gray-500 block text-[10px]">ARC REACTOR POWER SOURCE</span>
              <span className="text-cyan-300 font-bold">{selectedSuit.reactorType}</span>
            </div>

            <div className="p-2 rounded-lg bg-gray-950 border border-gray-800">
              <span className="text-gray-500 block text-[10px]">CHASSIS COMPOSITION</span>
              <span className="text-amber-300 font-bold">{selectedSuit.armorMaterial}</span>
            </div>

            <div className="p-2 rounded-lg bg-gray-950 border border-gray-800">
              <span className="text-gray-500 block text-[10px]">TACTICAL MISSION CAPABILITY</span>
              <p className="text-gray-300 font-sans text-xs mt-0.5 leading-relaxed">{selectedSuit.specialty}</p>
            </div>

            <div className="p-2 rounded-lg bg-gray-950 border border-gray-800">
              <span className="text-gray-500 block text-[10px]">INTEGRATED WEAPONS LOADOUT</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedSuit.weapons.map((w, i) => (
                  <span key={i} className="text-[10px] bg-red-950/60 border border-red-500/40 text-red-300 px-2 py-0.5 rounded">
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="grid grid-cols-3 gap-2 text-center p-2 rounded-xl bg-gray-950 border border-gray-800 text-[11px] font-mono-tech">
            <div>
              <span className="text-gray-500 block text-[9px]">MAX FLIGHT</span>
              <span className="text-cyan-300 font-bold">MACH {selectedSuit.maxSpeedMach}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[9px]">HULL RESISTANCE</span>
              <span className="text-emerald-300 font-bold">{selectedSuit.hullIntegrity}%</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[9px]">CANONICAL YEAR</span>
              <span className="text-amber-300 font-bold">{selectedSuit.year}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
