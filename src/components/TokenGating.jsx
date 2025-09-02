import React, { useState } from 'react';
import { Lock, Key, Eye, EyeOff, Settings, Shield } from 'lucide-react';

const TokenGating = () => {
  const [gates, setGates] = useState([
    {
      id: 1,
      name: 'Premium Content Access',
      token: 'MYTOKEN',
      minBalance: '100',
      contentType: 'Blog Posts',
      isActive: true,
      accessCount: 247
    },
    {
      id: 2,
      name: 'VIP Community',
      token: 'MYTOKEN',
      minBalance: '1000',
      contentType: 'Discord Channel',
      isActive: true,
      accessCount: 89
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGate, setNewGate] = useState({
    name: '',
    token: '',
    minBalance: '',
    contentType: 'webpage',
    description: '',
    accessLevel: 'view'
  });

  const [previewAccess, setPreviewAccess] = useState(false);
  const [userTokenBalance, setUserTokenBalance] = useState('150');

  const createGate = () => {
    const newId = gates.length + 1;
    const gate = {
      id: newId,
      ...newGate,
      isActive: true,
      accessCount: 0
    };
    
    setGates(prev => [...prev, gate]);
    setNewGate({
      name: '',
      token: '',
      minBalance: '',
      contentType: 'webpage',
      description: '',
      accessLevel: 'view'
    });
    setShowCreateForm(false);
  };

  const toggleGate = (id) => {
    setGates(prev => prev.map(gate => 
      gate.id === id ? { ...gate, isActive: !gate.isActive } : gate
    ));
  };

  const checkAccess = (minBalance) => {
    return parseFloat(userTokenBalance) >= parseFloat(minBalance);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">Token Gating</h2>
          <p className="text-text-secondary mt-1">Create exclusive access based on token ownership</p>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Lock className="w-4 h-4" />
          <span>Create Gate</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gates List */}
        <div className="lg:col-span-2 space-y-4">
          {gates.map((gate) => (
            <div key={gate.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${gate.isActive ? 'bg-green-400/20' : 'bg-gray-400/20'}`}>
                    <Lock className={`w-5 h-5 ${gate.isActive ? 'text-green-400' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-text-primary">{gate.name}</h3>
                    <p className="text-text-secondary text-sm">{gate.contentType}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleGate(gate.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    gate.isActive 
                      ? 'bg-green-400/20 text-green-400' 
                      : 'bg-gray-400/20 text-gray-400'
                  }`}
                >
                  {gate.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-text-secondary text-sm">Required Token:</span>
                  <p className="text-text-primary font-medium">{gate.token}</p>
                </div>
                <div>
                  <span className="text-text-secondary text-sm">Minimum Balance:</span>
                  <p className="text-text-primary font-medium">{gate.minBalance}</p>
                </div>
                <div>
                  <span className="text-text-secondary text-sm">Content Type:</span>
                  <p className="text-text-primary font-medium">{gate.contentType}</p>
                </div>
                <div>
                  <span className="text-text-secondary text-sm">Total Access:</span>
                  <p className="text-text-primary font-medium">{gate.accessCount}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="btn-secondary flex-1">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </button>
                <button className="btn-secondary">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Access Preview */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Access Preview
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Your Token Balance
                </label>
                <input
                  type="number"
                  placeholder="Enter balance to test"
                  className="input-field w-full"
                  value={userTokenBalance}
                  onChange={(e) => setUserTokenBalance(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-text-primary">Access Status:</h4>
                {gates.map((gate) => (
                  <div key={gate.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <span className="text-sm text-text-primary">{gate.name}</span>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      checkAccess(gate.minBalance)
                        ? 'bg-green-400/20 text-green-400'
                        : 'bg-red-400/20 text-red-400'
                    }`}>
                      {checkAccess(gate.minBalance) ? 'Granted' : 'Denied'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sample Gated Content */}
          <div className="card">
            <h3 className="text-lg font-medium text-text-primary mb-4">Sample Gated Content</h3>
            
            {checkAccess('100') ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-green-400">
                  <Key className="w-4 h-4" />
                  <span className="text-sm font-medium">Access Granted</span>
                </div>
                <div className="p-4 bg-green-400/10 border border-green-400/30 rounded-lg">
                  <h4 className="font-medium text-text-primary mb-2">Premium Content</h4>
                  <p className="text-text-secondary text-sm">
                    This is exclusive content only available to token holders with 100+ MYTOKEN.
                    You have {userTokenBalance} tokens, so you can access this content!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-red-400">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-medium">Access Denied</span>
                </div>
                <div className="p-4 bg-red-400/10 border border-red-400/30 rounded-lg">
                  <h4 className="font-medium text-text-primary mb-2">Premium Content Locked</h4>
                  <p className="text-text-secondary text-sm">
                    You need at least 100 MYTOKEN to access this content. 
                    You currently have {userTokenBalance} tokens.
                  </p>
                  <button className="btn-accent mt-3 text-sm">
                    Get MYTOKEN
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Gate Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-text-primary">Create Token Gate</h3>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="text-text-secondary hover:text-text-primary"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Gate Name *
                </label>
                <input
                  type="text"
                  placeholder="Premium Access"
                  className="input-field w-full"
                  value={newGate.name}
                  onChange={(e) => setNewGate(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Token Symbol *
                </label>
                <input
                  type="text"
                  placeholder="MYTOKEN"
                  className="input-field w-full"
                  value={newGate.token}
                  onChange={(e) => setNewGate(prev => ({ ...prev, token: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Minimum Balance *
                </label>
                <input
                  type="number"
                  placeholder="100"
                  className="input-field w-full"
                  value={newGate.minBalance}
                  onChange={(e) => setNewGate(prev => ({ ...prev, minBalance: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Content Type
                </label>
                <select
                  className="input-field w-full"
                  value={newGate.contentType}
                  onChange={(e) => setNewGate(prev => ({ ...prev, contentType: e.target.value }))}
                >
                  <option value="webpage">Webpage</option>
                  <option value="blog">Blog Posts</option>
                  <option value="discord">Discord Channel</option>
                  <option value="course">Online Course</option>
                  <option value="download">File Download</option>
                  <option value="stream">Live Stream</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe what users get access to..."
                  className="input-field w-full h-20 resize-none"
                  value={newGate.description}
                  onChange={(e) => setNewGate(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={createGate}
                  disabled={!newGate.name || !newGate.token || !newGate.minBalance}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Gate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenGating;