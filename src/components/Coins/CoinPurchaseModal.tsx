import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Coins, X, Zap, CreditCard } from "lucide-react";
import { RAZORPAY_KEY_ID } from "@/config/payments";

interface CoinPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (pack: string) => void;
}

const coinPacks = [
  { 
    id: "small", 
    coins: 30, 
    price: "₹29", 
    originalPrice: "₹49",
    badge: null,
    bonus: null 
  },
  { 
    id: "medium", 
    coins: 100, 
    price: "₹99", 
    originalPrice: "₹149",
    badge: "Most Popular",
    bonus: "+20 Bonus" 
  },
  { 
    id: "large", 
    coins: 350, 
    price: "₹299", 
    originalPrice: "₹499",
    badge: "Best Value",
    bonus: "+100 Bonus" 
  },
];

export function CoinPurchaseModal({ isOpen, onClose, onPurchase }: CoinPurchaseModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="bg-gradient-secondary text-white p-6 text-center relative">
          <Button 
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <Coins className="w-16 h-16 mx-auto mb-4 animate-float" />
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Buy Coins
            </DialogTitle>
          </DialogHeader>
          <p className="text-white/90">Use coins to unlock profiles and features</p>
        </div>

        <div className="p-6 space-y-4">
          {coinPacks.map((pack) => (
            <Card 
              key={pack.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-warm border-2 ${
                pack.badge === "Most Popular" ? "border-primary shadow-warm" : "border-border"
              }`}
              onClick={() => onPurchase(pack.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-coin/10 rounded-full">
                      <Coins className="w-6 h-6 text-coin" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg">{pack.coins} Coins</span>
                        {pack.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {pack.badge}
                          </Badge>
                        )}
                      </div>
                      {pack.bonus && (
                        <p className="text-sm text-green-600 font-medium">{pack.bonus}</p>
                      )}
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-primary">{pack.price}</span>
                        <span className="text-sm text-muted-foreground line-through">
                          {pack.originalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="gradient" size="sm">
                    <CreditCard className="w-4 h-4 mr-1" />
                    Buy
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-semibold text-foreground font-poppins">Payment Methods</h4>
            <div className="flex space-x-2">
              <Badge variant="outline" className="flex items-center space-x-1 font-poppins">
                <Zap className="w-3 h-3" />
                <span>UPI</span>
              </Badge>
              <Badge variant="outline" className="font-poppins">Netbanking</Badge>
              <Badge variant="outline" className="font-poppins">Cards</Badge>
            </div>
            <p className="text-xs text-muted-foreground font-poppins">
              Secure payments powered by Razorpay
            </p>
            <p className="text-[10px] text-muted-foreground font-poppins">
              Razorpay ID: rzp_live_h3TuNA7JPL56Dh
            </p>
          </div>

          <div className="text-center">
            <Button variant="outline" className="w-full font-poppins h-12 rounded-xl">
              Watch Ad to Earn 50 Coins
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}