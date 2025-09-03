import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWallet } from "../hooks/useWallet";
import { Wallet, ExternalLink, AlertCircle, CheckCircle, Loader2, ChevronDown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

export const WalletCard = () => {
  const { 
    address, 
    isConnected, 
    isConnecting, 
    error, 
    chainId, 
    balance,
    connect, 
    disconnect, 
    isMetamaskInstalled,
  } = useWallet();

  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);

  // Format address to show first 6 and last 4 characters
  const formatAddress = (addr: string): string => {
    if (addr.length <= 10) return addr;
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // Map chain IDs to human-readable names
  const getChainName = (id: string): string => {
    const chainIdMap: Record<string, string> = {
      '0x1': 'Ethereum Mainnet',
      '0x5': 'Goerli Testnet',
      '0xaa36a7': 'Sepolia Testnet',
      '0x89': 'Polygon Mainnet',
      '0x13881': 'Mumbai Testnet',
      '0xa4b1': 'Arbitrum One',
      '0xa': 'Optimism',
    };
    
    return chainIdMap[id] || `Chain ${id}`;
  };

  // Common networks for switching
  const commonNetworks = [
    { id: '0x1', name: 'Ethereum Mainnet' },
    { id: '0x5', name: 'Goerli Testnet' },
    { id: '0xaa36a7', name: 'Sepolia Testnet' },
    { id: '0x89', name: 'Polygon Mainnet' },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-crypto">
            <Wallet className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-xl font-bold">MetaMask Wallet</CardTitle>
          <CardDescription>
            Connect your MetaMask wallet to get started
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!isMetamaskInstalled && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                MetaMask not detected. Please{" "}
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  install MetaMask <ExternalLink className="h-3 w-3" />
                </a>{" "}
                to continue.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isConnected && address && (
            <div className="space-y-3 rounded-lg bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Status</span>
                <Badge variant="default" className="bg-gradient-success text-white">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Connected
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Address</span>
                <code className="text-sm font-mono">{formatAddress(address)}</code>
              </div>
              
              {chainId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Network</span>
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-sm"
                      onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                    >
                      {getChainName(chainId)}
                      <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                    
                    {showNetworkDropdown && (
                      <div className="absolute right-0 mt-1 w-48 rounded-md border bg-background shadow-lg z-10">
                        {commonNetworks.map(network => (
                          <div 
                            key={network.id}
                            className="px-4 py-2 text-sm hover:bg-muted cursor-pointer"
                            onClick={() => {
                              setShowNetworkDropdown(false);
                            }}
                          >
                            {network.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {balance && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Balance</span>
                  <span className="text-sm font-mono">{Number(balance).toFixed(4)} ETH</span>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            {!isConnected ? (
              <Button 
                onClick={connect}
                disabled={!isMetamaskInstalled || isConnecting}
                className="flex-1 bg-gradient-crypto hover:shadow-glow transition-all duration-200"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </>
                )}
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={disconnect}
                className="flex-1"
              >
                Disconnect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};







