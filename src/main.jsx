import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Import context providers
import { TokenProvider } from './context/TokenContext';
import { VestingProvider } from './context/VestingContext';
import { GatingProvider } from './context/GatingContext';
import { DAOProvider } from './context/DAOContext';
import ErrorBoundary from './components/ErrorBoundary';

// Create query client
const queryClient = new QueryClient();

// Create wagmi config
const wagmiConfig = getDefaultConfig({
  appName: "TokenSmith",
  projectId: "9f4bd472c01ba49282b42e5e1874c2af",
  chains: [mainnet, polygon, optimism, arbitrum, base],
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary showDetails={false}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <TokenProvider>
              <VestingProvider>
                <GatingProvider>
                  <DAOProvider>
                    <App />
                  </DAOProvider>
                </GatingProvider>
              </VestingProvider>
            </TokenProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
