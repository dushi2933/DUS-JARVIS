import { MarkProfile } from '../types/gauntlet';

export const MARK_PROFILES: Record<string, MarkProfile> = {
  'MK-III': {
    id: 'MK-III',
    name: 'Mark III Classic',
    subtitle: 'Gold-Titanium Armored Prototype',
    primaryColor: '#dc2626', // Crimson Red
    accentColor: '#eab308', // Gold
    glowColor: '#38bdf8', // Cyan Arc Glow
    material: '99.8% Gold-Titanium Alloy with Ceramic Heat Matrix',
    baseOutputGW: 2.8,
    description: 'The iconic suit worn during the Gulmira deployment. Robust hydraulic knuckle drives with dual pneumatic wrist stabilizing thrusters.',
    features: [
      'Twin high-impact forearm flares',
      'Direct plasma palm channel',
      'Hydraulic grip rated for 2.4 metric tons',
      'Integrated sub-sonic repulsor flight attitude control',
    ],
  },
  'MK-VII': {
    id: 'MK-VII',
    name: 'Mark VII Heavy Combat',
    subtitle: 'Rapid Deployment Pod Configuration',
    primaryColor: '#b91c1c',
    accentColor: '#ca8a04',
    glowColor: '#67e8f9',
    material: 'Triple-Reinforced Titanium-Steel Composite',
    baseOutputGW: 3.4,
    description: 'Battle of New York frontline weapon system. Features wrist-mounted micro-missile arrays and high-capacity repulsor discharge capacitors.',
    features: [
      'Wrist-mounted 6-missile micro launcher bay',
      'High-energy triple laser cutters',
      'Heavy thruster stabilization fins',
      'Enhanced magnetic gauntlet recall anchor',
    ],
  },
  'MK-50': {
    id: 'MK-50',
    name: 'Mark L (50) Nanotech',
    subtitle: 'Bleeding Edge Reconfigurable Housing',
    primaryColor: '#e11d48',
    accentColor: '#f59e0b',
    glowColor: '#06b6d4',
    material: 'Dynamic Programmable Carbon Nanoparticles',
    baseOutputGW: 4.5,
    description: 'Direct neural interface gauntlet constructed from billions of cohesive nanites. Can morph into energy shields, repulsor cannons, and nano-blade weaponry.',
    features: [
      'Zero-lag neural impulse synchronization',
      'Morphing repulsor focal array (shields/cannons)',
      'Autonomous cellular nanite armor self-repair',
      'Sub-atomic particle deceleration barrier',
    ],
  },
  'MK-85': {
    id: 'MK-85',
    name: 'Mark LXXXV Quantum',
    subtitle: 'Nanotech Vibranium Weave Apex System',
    primaryColor: '#991b1b',
    accentColor: '#d97706',
    glowColor: '#22d3ee',
    material: 'Nanite Matrix infused with Wakandan Vibranium Weave',
    baseOutputGW: 5.8,
    description: 'The definitive Iron Man armor created for the Battle of Earth. Capable of channeling cosmic and gamma energy loads with unprecedented heat dissipation.',
    features: [
      'Quantum energy dispersion grid',
      'Multi-spectral repulsor hyper-burst',
      'Vibranium kinetic absorption mesh',
      'Auxiliary unibeam conduit coupling',
    ],
  },
  'STEALTH': {
    id: 'STEALTH',
    name: 'Mark XV Stealth Obsidian',
    subtitle: 'Radar-Absorbing Night Ops Chassis',
    primaryColor: '#18181b',
    accentColor: '#38bdf8',
    glowColor: '#a855f7',
    material: 'Multi-layer Carbon Nanotube Radar Absorbent Coating',
    baseOutputGW: 3.1,
    description: 'Specialized low-observable infiltration gauntlet. Features silent repulsor damping baffles and infrared cloaking shields.',
    features: [
      'Silent acoustic wave cancellation dampers',
      'Infrared and radar absorption skin',
      'EMP stun discharge arc',
      'Ultraviolet frequency repulsor tuning',
    ],
  },
};
