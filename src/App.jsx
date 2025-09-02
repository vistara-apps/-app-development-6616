import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { 
  Coins, 
  Clock, 
  Lock, 
  Vote, 
  BarChart3, 
  TrendingUp,
  Users,
  Wallet,
  Plus,
  Settings
} from 'lucide-react';
import TokenGenerator from './components/TokenGenerator';
import VestingScheduler from './components/VestingScheduler';
import TokenGating from './components/TokenGating';
import DAOTools from './components/DAOTools';
import Dashboard from './components/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'token-generator', label: 'Create Token', icon: Coins },
    { id: 'vesting', label: 'Vesting', icon: Clock },
    { id: 'gating', label: 'Token Gating', icon: Lock },
    { id: 'dao', label: 'DAO Tools', icon: Vote },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'token-generator':
        return <TokenGenerator />;
      case 'vesting':
        return <VestingScheduler />;
      case 'gating':
        return <TokenGating />;
      case 'dao':
        return <DAOTools />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-dark via-bg to-purple-dark">
      {/* Header */}
      <header className="border-b border-gray-700 bg-surface/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-medium to-accent rounded-lg flex items-center justify-center">
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-text-primary">TokenSmith</h1>
                  <p className="text-xs text-text-secondary">Mint, Vest, and Gate with Ease</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-purple-dark/30 rounded-lg px-3 py-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span className="text-sm text-text-secondary">Base Network</span>
              </div>
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-surface/50 backdrop-blur-sm border-r border-gray-700 min-h-screen">
          <div className="p-6">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === item.id
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-text-secondary hover:text-text-primary hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="mt-8 p-4 bg-gradient-to-r from-purple-dark/30 to-accent/20 rounded-lg border border-purple-medium/30">
              <h3 className="text-sm font-medium text-text-primary mb-3">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-text-secondary">Tokens Created</span>
                  <span className="text-xs text-accent font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-text-secondary">Active Vesting</span>
                  <span className="text-xs text-accent font-medium">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-text-secondary">DAO Proposals</span>
                  <span className="text-xs text-accent font-medium">3</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="animate-fade-in">
            {renderActiveComponent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;