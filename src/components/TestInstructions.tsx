import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Clock, FileText } from "lucide-react";

export const TestInstructions = () => {
  const requirements = [
    "Connect/disconnect MetaMask wallet",
    "Display wallet address when connected", 
    "Show wallet balance in ETH",
    "Handle connection errors gracefully",
    "Display current network information",
    "Auto-reconnect on page refresh if previously connected",
    "Handle account/network changes in MetaMask"
  ];

  const bonusFeatures = [
    "Add network switching functionality",
    "Implement transaction history display",
    "Add token balance display (ERC-20)",
    "Style improvements or animations"
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-card border-border shadow-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-crypto">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl">Blockchain Developer Test</CardTitle>
            <CardDescription>MetaMask Integration Challenge</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2 text-warning">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">Time Limit: 60 minutes</span>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-foreground">Required Features:</h3>
          <ul className="space-y-2">
            {requirements.map((requirement, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <CheckSquare className="h-4 w-4 text-success shrink-0" />
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-foreground">Bonus Features:</h3>
          <ul className="space-y-2">
            {bonusFeatures.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckSquare className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">Evaluation Criteria</Badge>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
            <li>• Code quality and organization</li>
            <li>• Error handling implementation</li>
            <li>• TypeScript usage and type safety</li>
            <li>• User experience and interface design</li>
            <li>• Completion within time limit</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};