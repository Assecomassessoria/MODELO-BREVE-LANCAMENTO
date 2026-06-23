export interface WindSettings {
  intensity: number; // Scale parameter of the feDisplacementMap filter (e.g. 10 - 100)
  speed: number;     // Speed multiplier of the time increment (e.g. 0.5 - 3)
}

export interface TowerData {
  id: string;
  name: string;
  height: string;
  floors: number;
  highlight: string;
  description: string;
  widthClass: string;
  heightClass: string;
  alignClass: string;
  shadowClass: string;
  bgGradient: string;
}

export interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  role: 'buyer' | 'broker' | 'investor';
  acceptedTerms: boolean;
}
