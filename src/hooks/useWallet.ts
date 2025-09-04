import { useState, useCallback, useEffect } from 'react';
import { WalletState } from '@/types/wallet';

// Define types for the Ethereum provider
interface RequestArguments {
  method: string;
  params?: unknown[];
}

interface EthereumProvider {
  request: (args: RequestArguments) => Promise<unknown>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
}

// Define error types
interface EthereumRpcError extends Error {
  code: number;
  message: string;
  data?: unknown;
}

// Define specific response types
type EthAccountsResponse = string[];
type EthChainIdResponse = string;
type EthGetBalanceResponse = string;

// Extend Window interface with properly typed ethereum
declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    error: null,
    chainId: null,
    balance: null,
  });

  // Check if MetaMask is installed
  const isMetamaskInstalled = typeof window !== 'undefined' && !!window.ethereum?.isMetaMask;

  // Function to get balance
  const getBalance = useCallback(async (address: string): Promise<string | null> => {
    try {
      if (!window.ethereum) {
        throw new Error('Ethereum provider not available');
      }

      const balanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      }) as EthGetBalanceResponse;
      
      // Convert hex balance to ETH (wei to ETH)
      const balanceWei = parseInt(balanceHex, 16);
      const balanceEth = balanceWei / 1e18;
      
      return balanceEth.toFixed(4);
    } catch (error) {
      console.error('Error getting balance:', error);
      return null;
    }
  }, []);

  // Function to update wallet state with current account info
  const updateWalletState = useCallback(async (address: string) => {
    try {
      if (!window.ethereum) {
        throw new Error('Ethereum provider not available');
      }

      const chainId = await window.ethereum.request({ 
        method: 'eth_chainId' 
      }) as EthChainIdResponse;
      
      const balance = await getBalance(address);
      
      setWalletState(prev => ({
        ...prev,
        address,
        chainId,
        balance,
        isConnected: true,
        isConnecting: false,
        error: null,
      }));

      // Store connection state in localStorage for auto-reconnect
      localStorage.setItem('walletConnected', 'true');
    } catch (error) {
      console.error('Error updating wallet state:', error);
      setWalletState(prev => ({
        ...prev,
        error: 'Failed to update wallet information',
        isConnecting: false,
      }));
    }
  }, [getBalance]);

  // Wallet connection
  const connect = useCallback(async () => {
    if (!isMetamaskInstalled) {
      setWalletState(prev => ({
        ...prev,
        error: 'MetaMask is not installed',
      }));
      return;
    }

    setWalletState(prev => ({
      ...prev,
      isConnecting: true,
      error: null,
    }));

    try {
      if (!window.ethereum) {
        throw new Error('Ethereum provider not available');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as EthAccountsResponse;

      if (accounts && accounts.length > 0) {
        await updateWalletState(accounts[0]);
      }
    } catch (error) {
      console.error('Connection error:', error);
      
      const rpcError = error as EthereumRpcError;
      let errorMessage = 'Failed to connect wallet';
      
      if (rpcError.code === 4001) {
        errorMessage = 'Connection rejected by user';
      }
      
      setWalletState(prev => ({
        ...prev,
        error: errorMessage,
        isConnecting: false,
      }));
    }
  }, [isMetamaskInstalled, updateWalletState]);

  // Wallet disconnection
  const disconnect = useCallback(() => {
    setWalletState({
      address: null,
      isConnected: false,
      isConnecting: false,
      error: null,
      chainId: null,
      balance: null,
    });

    // Remove connection state from localStorage
    localStorage.removeItem('walletConnected');
  }, []);

  // Network switching
  const switchNetwork = useCallback(async (chainId: string) => {
    try {
      if (!window.ethereum) {
        throw new Error('Ethereum provider not available');
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
      
      // After switching, update the wallet state
      if (walletState.address) {
        await updateWalletState(walletState.address);
      }
    } catch (error) {
      console.error('Network switch error:', error);
      
      const rpcError = error as EthereumRpcError;
      let errorMessage = 'Failed to switch network';
      
      if (rpcError.code === 4902) {
        errorMessage = 'This network is not added to MetaMask';
      } else if (rpcError.code === 4001) {
        errorMessage = 'Network switch rejected by user';
      }
      
      setWalletState(prev => ({
        ...prev,
        error: errorMessage,
      }));
    }
  }, [walletState.address, updateWalletState]);

  // Auto-reconnect on page load if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      const wasConnected = localStorage.getItem('walletConnected') === 'true';
      
      if (wasConnected && isMetamaskInstalled && window.ethereum) {
        try {
          // Check if we're already connected
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          }) as EthAccountsResponse;

          if (accounts && accounts.length > 0) {
            await updateWalletState(accounts[0]);
          }
        } catch (error) {
          console.error('Auto-connect failed:', error);
          localStorage.removeItem('walletConnected');
        }
      }
    };

    autoConnect();
  }, [isMetamaskInstalled, updateWalletState]);

  // Handle account changes
  useEffect(() => {
    if (!isMetamaskInstalled || !window.ethereum) return;

    const handleAccountsChanged = (accounts: unknown) => {
      const accountArray = accounts as string[];
      if (accountArray.length === 0) {
        // User disconnected all accounts
        disconnect();
      } else if (accountArray[0] !== walletState.address) {
        // User switched accounts
        updateWalletState(accountArray[0]);
      }
    };

    // Handle chain changes
    const handleChainChanged = () => {
      // MetaMask recommends reloading the page on network change
      window.location.reload();
    };

    // Subscribe to events
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    // Cleanup
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [isMetamaskInstalled, walletState.address, updateWalletState, disconnect]);

  return {
    ...walletState,
    isMetamaskInstalled,
    connect,
    disconnect,
    switchNetwork,
  };
};







// import { useState, useCallback, useEffect } from 'react';
// import { WalletState } from '@/types/wallet';

// // Define types for the Ethereum provider
// interface RequestArguments {
//   method: string;
//   params?: unknown[];
// }

// interface EthereumProvider {
//   request: (args: RequestArguments) => Promise<unknown>;
//   on: (event: string, callback: (...args: unknown[]) => void) => void;
//   removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
//   isMetaMask?: boolean;
// }

// // Define error types
// interface EthereumRpcError extends Error {
//   code: number;
//   message: string;
//   data?: unknown;
// }

// // Define specific response types
// type EthAccountsResponse = string[];
// type EthChainIdResponse = string;
// type EthGetBalanceResponse = string;

// // Extend Window interface with properly typed ethereum
// declare global {
//   interface Window {
//     ethereum?: EthereumProvider;
//   }
// }

// export const useWallet = () => {
//   const [walletState, setWalletState] = useState<WalletState>({
//     address: null,
//     isConnected: false,
//     isConnecting: false,
//     error: null,
//     chainId: null,
//     balance: null,
//   });

//   // Check if MetaMask is installed
//   const isMetamaskInstalled = typeof window !== 'undefined' && !!window.ethereum?.isMetaMask;

//   // Function to get balance
//   const getBalance = useCallback(async (address: string): Promise<string | null> => {
//     try {
//       if (!window.ethereum) {
//         throw new Error('Ethereum provider not available');
//       }

//       const balanceHex = await window.ethereum.request({
//         method: 'eth_getBalance',
//         params: [address, 'latest'],
//       }) as EthGetBalanceResponse;
      
//       // Convert hex balance to ETH (wei to ETH)
//       const balanceWei = parseInt(balanceHex, 16);
//       const balanceEth = balanceWei / 1e18;
      
//       return balanceEth.toFixed(4);
//     } catch (error) {
//       console.error('Error getting balance:', error);
//       return null;
//     }
//   }, []);

//   // Function to update wallet state with current account info
//   const updateWalletState = useCallback(async (address: string) => {
//     try {
//       if (!window.ethereum) {
//         throw new Error('Ethereum provider not available');
//       }

//       const chainId = await window.ethereum.request({ 
//         method: 'eth_chainId' 
//       }) as EthChainIdResponse;
      
//       const balance = await getBalance(address);
      
//       setWalletState(prev => ({
//         ...prev,
//         address,
//         chainId,
//         balance,
//         isConnected: true,
//         isConnecting: false,
//         error: null,
//       }));

//       // Store connection state in localStorage for auto-reconnect
//       localStorage.setItem('walletConnected', 'true');
//     } catch (error) {
//       console.error('Error updating wallet state:', error);
//       setWalletState(prev => ({
//         ...prev,
//         error: 'Failed to update wallet information',
//         isConnecting: false,
//       }));
//     }
//   }, [getBalance]);

//   // Wallet connection
//   const connect = useCallback(async () => {
//     if (!isMetamaskInstalled) {
//       setWalletState(prev => ({
//         ...prev,
//         error: 'MetaMask is not installed',
//       }));
//       return;
//     }

//     setWalletState(prev => ({
//       ...prev,
//       isConnecting: true,
//       error: null,
//     }));

//     try {
//       if (!window.ethereum) {
//         throw new Error('Ethereum provider not available');
//       }

//       // Request account access
//       const accounts = await window.ethereum.request({
//         method: 'eth_requestAccounts',
//       }) as EthAccountsResponse;

//       if (accounts && accounts.length > 0) {
//         await updateWalletState(accounts[0]);
//       }
//     } catch (error) {
//       console.error('Connection error:', error);
      
//       const rpcError = error as EthereumRpcError;
//       let errorMessage = 'Failed to connect wallet';
      
//       if (rpcError.code === 4001) {
//         errorMessage = 'Connection rejected by user';
//       }
      
//       setWalletState(prev => ({
//         ...prev,
//         error: errorMessage,
//         isConnecting: false,
//       }));
//     }
//   }, [isMetamaskInstalled, updateWalletState]);

//   // Wallet disconnection
//   const disconnect = useCallback(() => {
//     setWalletState({
//       address: null,
//       isConnected: false,
//       isConnecting: false,
//       error: null,
//       chainId: null,
//       balance: null,
//     });

//     // Remove connection state from localStorage
//     localStorage.removeItem('walletConnected');
//   }, []);

//   // Network switching
//   const switchNetwork = useCallback(async (chainId: string) => {
//     try {
//       if (!window.ethereum) {
//         throw new Error('Ethereum provider not available');
//       }

//       await window.ethereum.request({
//         method: 'wallet_switchEthereumChain',
//         params: [{ chainId }],
//       });
      
//       // After switching, update the wallet state
//       if (walletState.address) {
//         await updateWalletState(walletState.address);
//       }
//     } catch (error) {
//       console.error('Network switch error:', error);
      
//       const rpcError = error as EthereumRpcError;
//       let errorMessage = 'Failed to switch network';
      
//       if (rpcError.code === 4902) {
//         errorMessage = 'This network is not added to MetaMask';
//       } else if (rpcError.code === 4001) {
//         errorMessage = 'Network switch rejected by user';
//       }
      
//       setWalletState(prev => ({
//         ...prev,
//         error: errorMessage,
//       }));
//     }
//   }, [walletState.address, updateWalletState]);

//   // Auto-reconnect on page load if previously connected
//   useEffect(() => {
//     const autoConnect = async () => {
//       const wasConnected = localStorage.getItem('walletConnected') === 'true';
      
//       if (wasConnected && isMetamaskInstalled && window.ethereum) {
//         try {
//           // Check if we're already connected
//           const accounts = await window.ethereum.request({
//             method: 'eth_accounts',
//           }) as EthAccountsResponse;

//           if (accounts && accounts.length > 0) {
//             await updateWalletState(accounts[0]);
//           }
//         } catch (error) {
//           console.error('Auto-connect failed:', error);
//           localStorage.removeItem('walletConnected');
//         }
//       }
//     };

//     autoConnect();
//   }, [isMetamaskInstalled, updateWalletState]);

//   // Handle account changes
//   useEffect(() => {
//     if (!isMetamaskInstalled || !window.ethereum) return;

//     const handleAccountsChanged = (accounts: unknown) => {
//       const accountArray = accounts as string[];
//       if (accountArray.length === 0) {
//         // User disconnected all accounts
//         disconnect();
//       } else if (accountArray[0] !== walletState.address) {
//         // User switched accounts
//         updateWalletState(accountArray[0]);
//       }
//     };

//     // Handle chain changes
//     const handleChainChanged = () => {
//       // MetaMask recommends reloading the page on network change
//       window.location.reload();
//     };

//     // Subscribe to events
//     window.ethereum.on('accountsChanged', handleAccountsChanged);
//     window.ethereum.on('chainChanged', handleChainChanged);

//     // Cleanup
//     return () => {
//       if (window.ethereum) {
//         window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
//         window.ethereum.removeListener('chainChanged', handleChainChanged);
//       }
//     };
//   }, [isMetamaskInstalled, walletState.address, updateWalletState, disconnect]);

//   return {
//     ...walletState,
//     isMetamaskInstalled,
//     connect,
//     disconnect,
//     switchNetwork,
//   };
// };