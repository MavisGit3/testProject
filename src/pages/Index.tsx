import { WalletCard } from "../components/WalletCard";
import { TestInstructions } from "../components/TestInstructions";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-crypto bg-clip-text text-transparent">
            MetaMask Integration Test
          </h1>
          <p className="text-muted-foreground text-lg">
            Blockchain Developer Challenge - 60 Minutes
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
          {/* Test Instructions */}
          <div>
            <TestInstructions />
          </div>
          
          {/* Wallet Connection */}
          <div className="space-y-6">
            <WalletCard />
            
            {/* Additional Info */}
            <div className="text-center text-sm text-muted-foreground">
              <p>
                Make sure you have MetaMask installed and are on a supported network.
              </p>
              <p className="mt-1">
                Test on Ethereum Mainnet, Goerli, or Sepolia for best results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;