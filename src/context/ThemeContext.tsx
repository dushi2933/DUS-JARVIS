import React, { createContext, useContext, useState, useEffect } from 'react';

export type StarkTheme = 
  | 'stark-cyan' 
  | 'whatsapp-emerald' 
  | 'android-messages'
  | 'hotrod-crimson' 
  | 'stealth-onyx' 
  | 'loki-asgard';

export interface ThemeConfig {
  id: StarkTheme;
  name: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  glowClass: string;
  borderClass: string;
  bgGlow: string;
  textGlow: string;
  badgeBg: string;
}

export const THEME_CONFIGS: Record<StarkTheme, ThemeConfig> = {
  'stark-cyan': {
    id: 'stark-cyan',
    name: 'Arc Reactor Cyan',
    description: 'Iconic Mark 50 nanotech cyan matrix with J.A.R.V.I.S. neural link',
    primaryColor: '#06b6d4',
    accentColor: '#22d3ee',
    glowClass: 'glow-arc-blue',
    borderClass: 'border-cyan-500/40',
    bgGlow: 'bg-cyan-950/40',
    textGlow: 'text-cyan-300',
    badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
  },
  'whatsapp-emerald': {
    id: 'whatsapp-emerald',
    name: 'WhatsApp Tactical Emerald',
    description: 'WhatsApp encrypted dark matrix with high-contrast emerald phosphor',
    primaryColor: '#25D366',
    accentColor: '#10b981',
    glowClass: 'shadow-[0_0_20px_rgba(37,211,102,0.5)]',
    borderClass: 'border-emerald-500/50',
    bgGlow: 'bg-emerald-950/40',
    textGlow: 'text-emerald-300',
    badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
  },
  'android-messages': {
    id: 'android-messages',
    name: 'Android RCS Messages & Material Blue',
    description: 'Google Messages Material You dynamic cobalt blue & RCS teal phosphor',
    primaryColor: '#1a73e8',
    accentColor: '#34a853',
    glowClass: 'shadow-[0_0_20px_rgba(26,115,232,0.5)]',
    borderClass: 'border-blue-500/50',
    bgGlow: 'bg-blue-950/40',
    textGlow: 'text-blue-300',
    badgeBg: 'bg-blue-950/80 text-blue-300 border-blue-500/40',
  },
  'hotrod-crimson': {
    id: 'hotrod-crimson',
    name: 'Mark III Hot-Rod Crimson',
    description: 'Classic Tony Stark red & gold hot-rod automotive lacquer',
    primaryColor: '#ef4444',
    accentColor: '#f59e0b',
    glowClass: 'glow-arc-red',
    borderClass: 'border-red-500/50',
    bgGlow: 'bg-red-950/40',
    textGlow: 'text-amber-300',
    badgeBg: 'bg-red-950/80 text-amber-300 border-amber-500/40',
  },
  'stealth-onyx': {
    id: 'stealth-onyx',
    name: 'Stealth Carbon & Ultraviolet',
    description: 'Radar-absorbent stealth carbon composite with ultraviolet HUD',
    primaryColor: '#a855f7',
    accentColor: '#c084fc',
    glowClass: 'shadow-[0_0_20px_rgba(168,85,247,0.5)]',
    borderClass: 'border-purple-500/40',
    bgGlow: 'bg-purple-950/40',
    textGlow: 'text-purple-300',
    badgeBg: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
  },
  'loki-asgard': {
    id: 'loki-asgard',
    name: 'Asgardian Royal Gold & Jade',
    description: 'TVA null-time gold with Loki mischief jade luminescence',
    primaryColor: '#f59e0b',
    accentColor: '#10b981',
    glowClass: 'glow-arc-gold',
    borderClass: 'border-amber-500/40',
    bgGlow: 'bg-amber-950/40',
    textGlow: 'text-amber-200',
    badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
  },
};

interface ThemeContextType {
  currentTheme: StarkTheme;
  themeConfig: ThemeConfig;
  setTheme: (theme: StarkTheme) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<StarkTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stark_gauntlet_theme') as StarkTheme;
      if (saved && THEME_CONFIGS[saved]) return saved;
    }
    return 'stark-cyan';
  });

  const themeConfig = THEME_CONFIGS[currentTheme];

  useEffect(() => {
    localStorage.setItem('stark_gauntlet_theme', currentTheme);
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const cycleTheme = () => {
    const themeKeys = Object.keys(THEME_CONFIGS) as StarkTheme[];
    const nextIdx = (themeKeys.indexOf(currentTheme) + 1) % themeKeys.length;
    setCurrentTheme(themeKeys[nextIdx]);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themeConfig,
        setTheme: setCurrentTheme,
        cycleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
