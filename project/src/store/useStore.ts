import { create } from 'zustand';
import { Alert, TrendPrediction } from '../types/algorand';

interface AppState {
  // UI State
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  currentView: string;
  activeTimeframe: '1H' | '24H' | '7D' | '30D';
  theme: 'dark' | 'cyber';
  
  // Data State
  alerts: Alert[];
  predictions: TrendPrediction[];
  watchlist: string[];
  
  // Settings
  alertThresholds: {
    whaleMovement: number;
    networkCongestion: number;
    unusualActivity: number;
  };
  
  // Actions
  toggleSidebar: () => void;
  toggleCommandPalette: () => void;
  setCurrentView: (view: string) => void;
  setActiveTimeframe: (timeframe: '1H' | '24H' | '7D' | '30D') => void;
  setTheme: (theme: 'dark' | 'cyber') => void;
  addAlert: (alert: Alert) => void;
  removeAlert: (id: string) => void;
  addToWatchlist: (address: string) => void;
  removeFromWatchlist: (address: string) => void;
  updateAlertThresholds: (thresholds: { whaleMovement: number; networkCongestion: number; unusualActivity: number; }) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial State
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  currentView: 'dashboard',
  activeTimeframe: '24H',
  theme: 'cyber',
  alerts: [],
  predictions: [],
  watchlist: [],
  alertThresholds: {
    whaleMovement: Number(import.meta.env.VITE_WHALE_MOVEMENT_THRESHOLD) || 1000000, // 1M ALGO
    networkCongestion: Number(import.meta.env.VITE_NETWORK_CONGESTION_THRESHOLD) || 80, // TPS threshold
    unusualActivity: Number(import.meta.env.VITE_UNUSUAL_ACTIVITY_THRESHOLD) || 500, // Transaction threshold
  },

  // Actions
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  
  setCurrentView: (view) => set({ currentView: view }),
  
  setActiveTimeframe: (timeframe) => set({ activeTimeframe: timeframe }),
  
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem('algometrics-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  },
  
  addAlert: (alert) => set((state) => ({ 
    alerts: [alert, ...state.alerts].slice(0, 100) // Keep only last 100 alerts
  })),
  
  removeAlert: (id) => set((state) => ({
    alerts: state.alerts.filter(alert => alert.id !== id)
  })),
  
  addToWatchlist: (address) => set((state) => ({
    watchlist: state.watchlist.includes(address) 
      ? state.watchlist 
      : [...state.watchlist, address]
  })),
  
  removeFromWatchlist: (address) => set((state) => ({
    watchlist: state.watchlist.filter(addr => addr !== address)
  })),
  
  updateAlertThresholds: (thresholds) => set((state) => ({
    alertThresholds: { ...state.alertThresholds, ...thresholds }
  })),
}));