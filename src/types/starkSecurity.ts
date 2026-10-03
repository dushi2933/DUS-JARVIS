export type BiometricScanType = 'retina' | 'palm' | 'voiceprint' | 'arcSynapse';

export type BiometricStatus = 'LOCKED' | 'SCANNING' | 'AUTHENTICATED' | 'ACCESS_DENIED';

export interface BiometricProfile {
  userName: string;
  clearanceLevel: 'ALPHA-1' | 'OMEGA' | 'RESTRICTED';
  retinaVascularMatch: number; // e.g. 99.98%
  palmRidgeDensity: number;
  voiceprintHarmonicScore: number;
  neuralSynapseHz: number;
  lastAuthenticated: string;
}

export type CameraFeedId = 
  | 'CAM-01-WORKSHOP'
  | 'CAM-02-HELIPAD'
  | 'CAM-03-REACTOR'
  | 'CAM-04-ARMORY'
  | 'CAM-05-AIRSPACE'
  | 'CAM-06-MALIBU';

export type CameraFilterMode = 'OPTICAL' | 'THERMAL_IR' | 'NIGHT_VISION' | 'HUD_WIREFRAME';

export interface StarkCameraFeed {
  id: CameraFeedId;
  name: string;
  location: string;
  status: 'ONLINE' | 'ACTIVE_ALERT' | 'STANDBY';
  panAngle: number;
  zoomLevel: number;
  infraredTempC: number;
  motionDetected: boolean;
  threatLevel: 'NOMINAL' | 'ELEVATED' | 'CRITICAL';
  description: string;
}
