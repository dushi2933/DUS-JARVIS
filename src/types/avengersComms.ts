export type AvengerId = 
  | 'thor'
  | 'hulk'
  | 'loki'
  | 'cap'
  | 'widow'
  | 'spiderman'
  | 'rhodey';

export type AvengerStatus = 
  | 'ONLINE' 
  | 'IN_BATTLE' 
  | 'IN_LAB' 
  | 'OFF-WORLD' 
  | 'ASGARD' 
  | 'TVA' 
  | 'QUEENS';

export interface AvengerContact {
  id: AvengerId;
  name: string;
  alias: string;
  status: AvengerStatus;
  statusMessage: string;
  location: string;
  badgeColor: string;
  accentColor: string;
  avatarBg: string;
  avatarSymbol: string;
  phoneNumber: string;
  unreadCount: number;
}

export interface AvengersChatMessage {
  id: string;
  senderId: AvengerId | 'tony';
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  isGroup: boolean;
}

export interface AvengersCallState {
  isActive: boolean;
  status: 'CALLING' | 'CONNECTED' | 'ENDED' | 'RINGING';
  isGroupCall: boolean;
  targetContact?: AvengerContact;
  participants: AvengerId[];
  durationSecs: number;
  isMuted: boolean;
  isVideoOn: boolean;
}
