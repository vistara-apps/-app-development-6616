import React, { useState } from 'react';
import { Coins, Zap, Shield, Settings, AlertCircle, CheckCircle } from 'lucide-react';
import { usePaymentContext } from '../hooks/usePaymentContext';

const TokenGenerator = () => {
  const [tokenConfig, setTokenConfig] = useState({
    name: '',
    symbol: '',
    totalSupply: '',
    decimals: '18',
    mintable: false,
    burnable: false,
    pausable: false,
    tokenType: 'ERC-20'
  });

  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState(null);
  const [paid, setPaid] = useState(false);
  const { createSession } = usePaymentContext();

  const handleInputChange = (field, value) => {
    setTokenConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayment = async () => {
    try {
      await createSession();
      setPaid(true);
      handleDeploy();
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const handleDeploy = async () => {
    if (!paid) {
      await handlePayment();
      return;
    }

    setIsDeploying(true);
    
    // Simulate deployment process
    setTimeout(() => {
      setDeploymentResult({
        success: true,
        contractAddress: '0x' + Math.random().toString(16).substr(2, 40),
        txHash: '0x' + Math.random().toString(16).substr(2, 64),
        gasUsed: '0.00124 ETH'
      });
      setIsDeploying(false);
    }, 3000);
  };

  const estimatedCost = () => {
    let baseCost = 0.001;
    if (tokenConfig.mintable) baseCost += 0.0005;
    if (tokenConfig.burnable) baseCost += 0.0005;
    if (tokenConfig.pausable) baseCost += 0.0005;
    return baseCost.toFixed(4);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">Create Token</h2>
          <p className="text-text-secondary mt-1">Deploy custom tokens on the Base network</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Token Configuration Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Token Configuration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Token Name *
                </label>
                <input
                  type="text"
                  placeholder="My Awesome Token"
                  className="input-field w-full"
                  value={tokenConfig.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Symbol *
                </label>
                <input
                  type="text"
                  placeholder="MAT"
                  className="input-field w-full"
                  value={tokenConfig.symbol}
                  onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Total Supply *
                </label>
                <input
                  type="number"
                  placeholder="1000000"
                  className="input-field w-full"
                  value={tokenConfig.totalSupply}
                  onChange={(e) => handleInputChange('totalSupply', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Decimals
                </label>
                <select
                  className="input-field w-full"
                  value={tokenConfig.decimals}
                  onChange={(e) => handleInputChange('decimals', e.target.value)}
                >
                  <option value="18">18 (Standard)</option>
                  <option value="6">6 (USDC Style)</option>
                  <option value="8">8 (Bitcoin Style)</option>
                  <option value="0">0 (No Decimals)</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Token Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => handleInputChange('tokenType', 'ERC-20')}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    tokenConfig.tokenType === 'ERC-20'
                      ? 'border-accent bg-accent/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="font-medium text-text-primary">ERC-20</div>
                  <div className="text-sm text-text-secondary">Standard fungible token</div>
                </button>
                <button
                  onClick={() => handleInputChange('tokenType', 'BEP-20')}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    tokenConfig.tokenType === 'BEP-20'
                      ? 'border-accent bg-accent/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="font-medium text-text-primary">BEP-20</div>
                  <div className="text-sm text-text-secondary">Binance Smart Chain compatible</div>
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Features */}
          <div className="card">
            <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Advanced Features
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-600 rounded-lg">
                <div>
                  <div className="font-medium text-text-primary">Mintable</div>
                  <div className="text-sm text-text-secondary">Allow creating new tokens after deployment</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={tokenConfig.mintable}
                    onChange={(e) => handleInputChange('mintable', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-600 rounded-lg">
                <div>
                  <div className="font-medium text-text-primary">Burnable</div>
                  <div className="text-sm text-text-secondary">Allow token holders to burn their tokens</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={tokenConfig.burnable}
                    onChange={(e) => handleInputChange('burnable', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-600 rounded-lg">
                <div>
                  <div className="font-medium text-text-primary">Pausable</div>
                  <div className="text-sm text-text-secondary">Add ability to pause all token transfers</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={tokenConfig.pausable}
                    onChange={(e) => handleInputChange('pausable', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Deployment Summary */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-medium text-text-primary mb-4">Deployment Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-secondary">Token Name:</span>
                <span className="text-text-primary font-medium">
                  {tokenConfig.name || 'Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Symbol:</span>
                <span className="text-text-primary font-medium">
                  {tokenConfig.symbol || 'Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Supply:</span>
                <span className="text-text-primary font-medium">
                  {tokenConfig.totalSupply ? Number(tokenConfig.totalSupply).toLocaleString() : 'Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Type:</span>
                <span className="text-text-primary font-medium">{tokenConfig.tokenType}</span>
              </div>
            </div>

            <hr className="my-4 border-gray-600" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text-secondary">Base Cost:</span>
                <span className="text-text-primary">$0.001</span>
              </div>
              {tokenConfig.mintable && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Mintable:</span>
                  <span className="text-text-primary">+$0.0005</span>
                </div>
              )}
              {tokenConfig.burnable && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Burnable:</span>
                  <span className="text-text-primary">+$0.0005</span>
                </div>
              )}
              {tokenConfig.pausable && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Pausable:</span>
                  <span className="text-text-primary">+$0.0005</span>
                </div>
              )}
              <hr className="border-gray-600" />
              <div className="flex justify-between font-medium">
                <span className="text-text-primary">Total Cost:</span>
                <span className="text-accent">${estimatedCost()}</span>
              </div>
            </div>

            <button
              onClick={paid ? handleDeploy : handlePayment}
              disabled={!tokenConfig.name || !tokenConfig.symbol || !tokenConfig.totalSupply || isDeploying}
              className="w-full btn-accent mt-6 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeploying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                  <span>Deploying...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>{paid ? 'Deploy Token' : `Pay ${estimatedCost()} USD & Deploy`}</span>
                </>
              )}
            </button>
          </div>

          {/* Deployment Result */}
          {deploymentResult && (
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-medium text-text-primary">Deployment Successful!</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-text-secondary">Contract Address:</span>
                  <div className="text-accent font-mono break-all">
                    {deploymentResult.contractAddress}
                  </div>
                </div>
                <div>
                  <span className="text-text-secondary">Transaction Hash:</span>
                  <div className="text-accent font-mono break-all">
                    {deploymentResult.txHash}
                  </div>
                </div>
                <div>
                  <span className="text-text-secondary">Gas Used:</span>
                  <div className="text-text-primary">{deploymentResult.gasUsed}</div>
                </div>
              </div>

              <button className="w-full btn-secondary mt-4">
                View on Base Explorer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenGenerator;