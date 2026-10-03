export type SuitPartCategory = 
  | 'helmet'
  | 'chest'
  | 'gauntletRight'
  | 'gauntletLeft'
  | 'backFlight'
  | 'shoulders'
  | 'hipPods'
  | 'bootJets';

export interface SuitSubsystemPart {
  id: SuitPartCategory;
  name: string;
  codename: string;
  location: string;
  integrity: number; // 0 - 100
  powerDrawGW: number;
  tempKelvin: number;
  status: 'OPTIMAL' | 'CALIBRATING' | 'OVERHEATED' | 'DAMAGED';
  keyFeatures: string[];
  operationalSpecs: {
    material: string;
    voltageOrThrust: string;
    coolingType: string;
    responseTimeMs: number;
  };
  actions: {
    label: string;
    actionId: string;
    description: string;
  }[];
}
