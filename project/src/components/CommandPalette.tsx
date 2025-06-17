import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';

const commands = [
  { id: 'search-wallet', label: 'Search Wallet', shortcut: '⌘ W', category: 'Navigation' },
  { id: 'whale-tracker', label: 'Open Whale Tracker', shortcut: '⌘ T', category: 'Navigation' },
  { id: 'defi-analytics', label: 'View DeFi Analytics', shortcut: '⌘ D', category: 'Navigation' },
  { id: 'alerts', label: 'Manage Alerts', shortcut: '⌘ A', category: 'Navigation' },
  { id: 'export-data', label: 'Export Data', shortcut: '⌘ E', category: 'Actions' },
  { id: 'settings', label: 'Open Settings', shortcut: '⌘ ,', category: 'Actions' },
  { id: 'help', label: 'Help & Documentation', shortcut: '⌘ ?', category: 'Help' },
];

export function CommandPalette() {
  const { commandPaletteOpen, toggleCommandPalette } = useStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = commands.filter(
    command =>
      command.label.toLowerCase().includes(query.toLowerCase()) ||
      command.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleCommandPalette();
      }

      if (!commandPaletteOpen) return;

      if (e.key === 'Escape') {
        toggleCommandPalette();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, filteredCommands, selectedIndex, toggleCommandPalette]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const executeCommand = (commandId: string) => {
    const { setCurrentView } = useStore.getState();
    
    switch (commandId) {
      case 'whale-tracker':
        setCurrentView('whales');
        break;
      case 'defi-analytics':
        setCurrentView('defi');
        break;
      case 'alerts':
        setCurrentView('alerts');
        break;
      case 'nft-analytics':
        setCurrentView('nft');
        break;
      case 'bridge-monitor':
        setCurrentView('bridge');
        break;
      case 'ecosystem-map':
        setCurrentView('ecosystem');
        break;
      case 'portfolio-xray':
        setCurrentView('portfolio');
        break;
      case 'dashboard':
        setCurrentView('dashboard');
        break;
      case 'export-data':
        // Export current view data as JSON
        const currentData = {
          timestamp: new Date().toISOString(),
          view: useStore.getState().currentView,
          exported: true
        };
        const blob = new Blob([JSON.stringify(currentData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `algometrics-export-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        break;
      case 'help':
        window.open('https://github.com/algorand/docs', '_blank');
        break;
      case 'search-wallet':
        const address = prompt('Enter wallet address to analyze:');
        if (address) {
          setCurrentView('portfolio');
          // You could pass the address to the portfolio component here
        }
        break;
      default:
        console.log('Unknown command:', commandId);
    }
    
    toggleCommandPalette();
    setQuery('');
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCommandPalette}
          />
          
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg glass-card border border-white/20 z-50"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-4">
                <Search className="w-5 h-5 text-neon-blue" />
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400"
                  autoFocus
                />
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {filteredCommands.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No commands found
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredCommands.map((command, index) => (
                      <motion.button
                        key={command.id}
                        onClick={() => executeCommand(command.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                          index === selectedIndex
                            ? 'bg-neon-green/20 text-neon-green'
                            : 'hover:bg-white/10 text-gray-300'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div>
                          <div className="font-medium">{command.label}</div>
                          <div className="text-xs text-gray-400">{command.category}</div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">{command.shortcut}</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}