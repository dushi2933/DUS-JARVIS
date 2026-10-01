export type ArmorMark = 'MK-III' | 'MK-VII' | 'MK-50' | 'MK-85' | 'STEALTH';

export type ProtocolType = 'IDLE' | 'COMBAT' | 'HOUSE_PARTY' | 'CLEAN_SLATE' | 'FLIGHT' | 'SENTRY';

export type RepulsorLens = 'PULSE' | 'LASER' | 'ION_SHIELD';
export type CapacitorType = 'PALLADIUM' | 'VIBRANIUM_ION' | 'NANITE_FLOW' | 'QUANTUM';

export interface GauntletState {
  mark: ArmorMark;
  repulsorCharge: number; // 0 - 100
  repulsorMaxPower: number; // e.g. 100
  isCharging: boolean;
  isFiring: boolean;
  temperatureKelvin: number;
  armorIntegrity: number; // 0 - 100
  missileCount: number; // 0 - 6
  missileBayOpen: boolean;
  activeProtocol: ProtocolType;
  servoAngles: {
    thumb: number; // 0 - 90
    index: number;
    middle: number;
    ring: number;
    pinky: number;
  };
  powerRouting: {
    repulsors: number; // %
    flightStabilizers: number;
    kineticShield: number;
    nanoRepair: number;
  };
  lens: RepulsorLens;
  capacitor: CapacitorType;
  arcReactorOutputGW: number;
}

export interface JarvisDialogue {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  action?: string;
  tacticalAdvice?: string;
  timestamp: string;
}

export interface MarkProfile {
  id: ArmorMark;
  name: string;
  subtitle: string;
  primaryColor: string;
  accentColor: string;
  glowColor: string;
  material: string;
  baseOutputGW: number;
  description: string;
  features: string[];
}
