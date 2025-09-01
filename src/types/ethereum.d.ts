interface EthereumProvider {
  request(args: { method: string; params?: any[] }): Promise<any>;
  on(eventName: string, handler: (...args: any[]) => void): void;
  removeListener?(eventName: string, handler: (...args: any[]) => void): void;
  selectedAddress?: string;
  chainId?: string;
  isMetaMask?: boolean;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export {};