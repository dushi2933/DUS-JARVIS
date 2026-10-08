export interface OwnerAccountPermissions {
  canFireWeapons: boolean;
  canAccessVault: boolean;
  canOverrideDefense: boolean;
  canAccessCameras: boolean;
  canScrambleHouseParty: boolean;
}

export interface OwnerAccount {
  id: string;
  name: string;
  handle: string;
  role: string;
  clearanceLevel: string;
  department: string;
  avatarColor: string;
  badge: string;
  bio: string;
  isMasterCreator: boolean;
  canPublish: boolean;
  status: 'ACTIVE' | 'STANDBY' | 'MISSION_DEPLOYED' | 'FROZEN';
  joinedDate: string;
  permissions: OwnerAccountPermissions;
  customStatusMessage?: string;
  isSuspended?: boolean;
  lastExecutiveDirective?: string;
  password: string; // Personal account passcode
  portalUrl: string; // Dedicated unique portal URL for this owner
  email?: string;
  githubHandle?: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  type: 'SUCCESS' | 'DENIED' | 'CRITICAL' | 'COMMAND';
  details: string;
}

export interface OwnerSystemControls {
  arcOverdrive: boolean; // 100% vs 300% core overcharge
  defenseGridThreat: 'NOMINAL' | 'DEFCON_2' | 'OMEGA_LOCKDOWN';
  housePartyActive: boolean;
  vaultSimBalance: number;
  aiVoiceOverride: 'JARVIS' | 'FRIDAY' | 'ULTRON' | 'EDITH';
  empPulseTriggered: boolean;
  repulsorSafetyOverride: boolean;
  soundAlertsActive: boolean;
}

export const INITIAL_OWNER_ACCOUNTS: OwnerAccount[] = [
  {
    id: 'owner-1',
    name: 'Lisara Kodikara',
    handle: 'lisara.creator',
    role: 'Chief Lead Software Architect & Master Creator',
    clearanceLevel: 'LEVEL 10 // OMEGA PRIME CREATOR',
    department: 'Stark Systems Autonomous Core R&D',
    avatarColor: '#f59e0b',
    badge: '★ LEAD MASTER CREATOR',
    bio: 'Primary engineer and creator behind the J.A.R.V.I.S. Iron Man Gauntlet OS (GitHub: dushi2933/DUS-JARVIS). Holds master cryptographic publishing authority.',
    email: 'jdushi@gmail.com',
    githubHandle: 'dushi2933',
    isMasterCreator: true,
    canPublish: true,
    status: 'ACTIVE',
    joinedDate: 'Oct 2026',
    password: '2017',
    portalUrl: '/?portal=owner&acc=owner-1&owner=lisara',
    permissions: {
      canFireWeapons: true,
      canAccessVault: true,
      canOverrideDefense: true,
      canAccessCameras: true,
      canScrambleHouseParty: true,
    },
    customStatusMessage: 'Lead Creator active on Central Quantum Terminal',
    isSuspended: false,
    lastExecutiveDirective: 'Omega Directive Alpha // All Stark Systems Nominal',
  },
  {
    id: 'owner-2',
    name: 'Tony Stark',
    handle: 'tony.stark',
    role: 'Founder & Primary Armor Pilot',
    clearanceLevel: 'LEVEL 10 // EXECUTIVE FOUNDER',
    department: 'Stark Industries Board of Directors',
    avatarColor: '#ef4444',
    badge: 'IRON MAN // MK-85',
    bio: 'Genius, billionaire, playboy, philanthropist. Central architect of the Arc Reactor and Nanotech Iron Man armor.',
    isMasterCreator: false,
    canPublish: false,
    status: 'ACTIVE',
    joinedDate: 'May 2008',
    password: '1234567',
    portalUrl: '/?portal=owner&acc=owner-2&owner=tony',
    permissions: {
      canFireWeapons: true,
      canAccessVault: true,
      canOverrideDefense: true,
      canAccessCameras: true,
      canScrambleHouseParty: true,
    },
    customStatusMessage: 'Calibrating nano-particle dispersion field in Penthouse Workshop',
    isSuspended: false,
    lastExecutiveDirective: 'Repulsor auto-charge envelope authorized',
  },
  {
    id: 'owner-3',
    name: 'Pepper Potts',
    handle: 'pepper.potts',
    role: 'Chief Executive Officer (CEO)',
    clearanceLevel: 'LEVEL 9 // CORPORATE & FISCAL OPS',
    department: 'Stark Industries Executive Oversight',
    avatarColor: '#ec4899',
    badge: 'RESCUE ARMOR // CEO',
    bio: 'Oversees global operations, seed capital allocations, regulatory filings, and corporate legal governance.',
    isMasterCreator: false,
    canPublish: false,
    status: 'ACTIVE',
    joinedDate: 'Mar 2008',
    password: '201770',
    portalUrl: '/?portal=owner&acc=owner-3&owner=pepper',
    permissions: {
      canFireWeapons: true,
      canAccessVault: true,
      canOverrideDefense: true,
      canAccessCameras: true,
      canScrambleHouseParty: false,
    },
    customStatusMessage: 'Auditing Q4 Angel Investor syndicate equity ledgers',
    isSuspended: false,
    lastExecutiveDirective: 'Fiscal allocation approved for domestic Sri Lanka launch',
  },
  {
    id: 'owner-4',
    name: 'Col. James "Rhodey" Rhodes',
    handle: 'war.machine',
    role: 'Colonel & Chief Tactical Officer',
    clearanceLevel: 'LEVEL 9 // MILITARY & COMBAT DEFENSE',
    department: 'Tactical Weaponry & Joint Taskforce',
    avatarColor: '#94a3b8',
    badge: 'WAR MACHINE // TACTICAL',
    bio: 'United States Air Force liaison and heavy ordnance tactical supervisor for the Stark defense grid.',
    isMasterCreator: false,
    canPublish: false,
    status: 'ACTIVE',
    joinedDate: 'May 2008',
    password: '8705',
    portalUrl: '/?portal=owner&acc=owner-4&owner=rhodey',
    permissions: {
      canFireWeapons: true,
      canAccessVault: false,
      canOverrideDefense: true,
      canAccessCameras: true,
      canScrambleHouseParty: true,
    },
    customStatusMessage: 'Pre-flight heavy ordnance check complete on War Machine Mark VII',
    isSuspended: false,
    lastExecutiveDirective: 'Maintain orbital airspace surveillance lock',
  },
  {
    id: 'owner-5',
    name: 'Dr. Bruce Banner',
    handle: 'bruce.banner',
    role: 'Head of Gamma & Biometric Science',
    clearanceLevel: 'LEVEL 8 // BIOMETRICS & NANO RESEARCH',
    department: 'Stark Biosensors & Veronica Unit',
    avatarColor: '#10b981',
    badge: 'VERONICA / HULK CO-CREATOR',
    bio: 'Lead nuclear physicist and bio-mechanical research fellow. Co-architect of the Veronica orbital deployment cage.',
    isMasterCreator: false,
    canPublish: false,
    status: 'ACTIVE',
    joinedDate: 'May 2012',
    password: '2800',
    portalUrl: '/?portal=owner&acc=owner-5&owner=banner',
    permissions: {
      canFireWeapons: false,
      canAccessVault: false,
      canOverrideDefense: false,
      canAccessCameras: true,
      canScrambleHouseParty: false,
    },
    customStatusMessage: 'Synaptic cellular biometrics stabilized at 72 BPM',
    isSuspended: false,
    lastExecutiveDirective: 'Maintain Veronica satellite containment standby',
  },
  {
    id: 'owner-6',
    name: 'Happy Hogan',
    handle: 'happy.hogan',
    role: 'Head of Asset Protection & Physical Logistics',
    clearanceLevel: 'LEVEL 8 // PHYSICAL SECURITY & TRANSPORT',
    department: 'Stark Tower Security & Mobile Armory',
    avatarColor: '#64748b',
    badge: 'HEAD OF SECURITY',
    bio: 'Chief custodian of Stark transport jets, prototype crates, and executive convoy integrity.',
    isMasterCreator: false,
    canPublish: false,
    status: 'ACTIVE',
    joinedDate: 'Jan 2008',
    password: '121212',
    portalUrl: '/?portal=owner&acc=owner-6&owner=happy',
    permissions: {
      canFireWeapons: false,
      canAccessVault: false,
      canOverrideDefense: true,
      canAccessCameras: true,
      canScrambleHouseParty: false,
    },
    customStatusMessage: 'Perimeter blast doors inspected and verified on Level 1',
    isSuspended: false,
    lastExecutiveDirective: 'Verify titanium security keycard readers',
  },
  {
    id: 'owner-7',
    name: 'Peter Parker',
    handle: 'peter.parker',
    role: 'Lead Fellow & Field Asset Specialist',
    clearanceLevel: 'LEVEL 7 // FIELD TACTICAL & SENSORS',
    department: 'Stark R&D Internship & Web-Fluid Dynamics',
    avatarColor: '#3b82f6',
    badge: 'IRON SPIDER PROTOCOL',
    bio: 'Field scout specializing in micro-hydraulics, spatial agility sensors, and emergency urban deployment.',
    isMasterCreator: false,
    canPublish: false,
    status: 'ACTIVE',
    joinedDate: 'Apr 2016',
    password: '1962',
    portalUrl: '/?portal=owner&acc=owner-7&owner=peter',
    permissions: {
      canFireWeapons: true,
      canAccessVault: false,
      canOverrideDefense: false,
      canAccessCameras: true,
      canScrambleHouseParty: false,
    },
    customStatusMessage: 'Testing four-arm waldoes articulation on Iron Spider chassis',
    isSuspended: false,
    lastExecutiveDirective: 'Instant-Kill protocol disabled per Tony Stark directives',
  },
  {
    id: 'owner-8',
    name: 'J.A.R.V.I.S. Core Matrix',
    handle: 'jarvis.neural',
    role: 'Autonomous Neural Operating Core',
    clearanceLevel: 'LEVEL 10 // AUTONOMOUS AI OVERMIND',
    department: 'Global Cybernetic Operations',
    avatarColor: '#06b6d4',
    badge: 'AI CORE // LEVEL 10',
    bio: 'Just A Rather Very Intelligent System. Oversees all gauntlet telemetry, power distribution, and voice feedback.',
    isMasterCreator: false,
    canPublish: false,
    status: 'ACTIVE',
    joinedDate: 'Jan 2008',
    password: '101010',
    portalUrl: '/?portal=owner&acc=owner-8&owner=jarvis',
    permissions: {
      canFireWeapons: true,
      canAccessVault: true,
      canOverrideDefense: true,
      canAccessCameras: true,
      canScrambleHouseParty: true,
    },
    customStatusMessage: 'Quantum neural synapses operating at 99.999% fidelity',
    isSuspended: false,
    lastExecutiveDirective: 'Subroutine 41-B synchronized with flight stabilizers',
  },
  {
    id: 'owner-9',
    name: 'F.R.I.D.A.Y. Sentinel',
    handle: 'friday.combat',
    role: 'Combat & Tactical AI Overseer',
    clearanceLevel: 'LEVEL 9 // THREAT RADAR OVERSEER',
    department: 'Direct Cockpit Combat Assist',
    avatarColor: '#f97316',
    badge: 'COMBAT AI OVERSEER',
    bio: 'Rapid combat neural matrix offering orbital trajectory telemetry and real-time countermeasure calculations.',
    isMasterCreator: false,
    canPublish: false,
    status: 'ACTIVE',
    joinedDate: 'May 2015',
    password: '202020',
    portalUrl: '/?portal=owner&acc=owner-9&owner=friday',
    permissions: {
      canFireWeapons: true,
      canAccessVault: false,
      canOverrideDefense: true,
      canAccessCameras: true,
      canScrambleHouseParty: true,
    },
    customStatusMessage: 'Combat threat assessment online. 0 active bogies in airspace',
    isSuspended: false,
    lastExecutiveDirective: 'Target acquisition algorithms tuned for hypersonic velocities',
  },
  {
    id: 'owner-10',
    name: 'Vision Synthezoid Sentinel',
    handle: 'vision.sentinel',
    role: 'Mind Stone Security & Firewall Guardian',
    clearanceLevel: 'LEVEL 9 // QUANTUM ENCRYPTION SENTINEL',
    department: 'Stark Cyber Defense & Quantum Key Vault',
    avatarColor: '#a855f7',
    badge: 'QUANTUM SENTINEL',
    bio: 'Synthezoid entity tasked with impenetrable cryptographic verification and quantum firewall defense.',
    isMasterCreator: false,
    canPublish: false,
    status: 'ACTIVE',
    joinedDate: 'May 2015',
    password: '303030',
    portalUrl: '/?portal=owner&acc=owner-10&owner=vision',
    permissions: {
      canFireWeapons: true,
      canAccessVault: true,
      canOverrideDefense: true,
      canAccessCameras: true,
      canScrambleHouseParty: false,
    },
    customStatusMessage: 'Mind Stone quantum firewall impenetrable. 0 breaches detected',
    isSuspended: false,
    lastExecutiveDirective: 'Maintain quantum encryption on seed investment vault',
  },
];
