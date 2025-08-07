import { Coins, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CoinBalanceProps {
  balance: number;
  onBuyCoins: () => void;
}

export function CoinBalance({ balance, onBuyCoins }: CoinBalanceProps) {
  return (
    <Card className="bg-gradient-secondary shadow-card rounded-2xl border-none">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-full">
            <Coins className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white/80 text-sm font-poppins">Your Coins</p>
            <p className="text-white text-xl font-bold font-poppins">{balance}</p>
          </div>
        </div>
        <Button 
          onClick={onBuyCoins}
          variant="coin"
          size="sm"
          className="bg-white/20 text-white hover:bg-white/30 font-poppins"
        >
          <Plus className="w-4 h-4 mr-1" />
          Buy
        </Button>
      </CardContent>
    </Card>
  );
}