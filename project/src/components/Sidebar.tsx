import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Wallet, 
  TrendingUp, 
  Bell, 
  Map, 
  Search, 
  Vote, 
  Shield, 
  Users, 
  Link, 
  Image, 
  Zap,
  Trophy,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../store/useStore';

const menuItems = [
  { icon: BarChart3, label: 'Dashboard', id: 'dashboard', active: true },
  { icon: Wallet, label: 'Whale Tracker', id: 'whales' },
  { icon: TrendingUp, label: 'DeFi Analytics', id: 'defi' },
  { icon: Bell, label: 'Smart Alerts', id: 'alerts' },
  { icon: Map, label: 'Ecosystem Map', id: 'ecosystem' },
  { icon: Search, label: 'Portfolio X-Ray', id: 'portfolio' },
  { icon: Link, label: 'Bridge Monitor', id: 'bridge' },
  { icon: Image, label: 'NFT Analytics', id: 'nft' }
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, currentView, setCurrentView } = useStore();

  return (
    <motion.aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] glass-card border-r border-white/10 z-40 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 256 }}
    >
      <div className="p-4 h-full flex flex-col">
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 w-6 h-6 bg-space-800 border border-white/20 rounded-full flex items-center justify-center hover:bg-space-700 transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>

        {/* Menu Items */}
        <nav className="flex-1 space-y-1 mt-2">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group ${
                currentView === item.id
                  ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
                  : 'hover:bg-white/10 text-gray-300 hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon className={`w-5 h-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    className="font-medium text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              
              {currentView === item.id && !sidebarCollapsed && (
                <motion.div
                  className="ml-auto w-2 h-2 bg-neon-green rounded-full"
                  layoutId="activeIndicator"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </nav>

        {/* Footer */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              className="pt-4 border-t border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-xs text-gray-400 space-y-1">
                <p>Connected via Nodely API</p>
                <p className="text-neon-green">Mainnet Active</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}