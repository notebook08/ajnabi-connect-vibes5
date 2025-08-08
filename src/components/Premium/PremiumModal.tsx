import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Check, 
  Zap, 
  Heart, 
  MessageCircle, 
  X,
  Sparkles 
} from "lucide-react";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (plan: string) => void;
}

const premiumFeatures = [
  { icon: Zap, text: "No ads forever" },
  { icon: Heart, text: "Unlimited profile unlocks" },
  { icon: MessageCircle, text: "Priority matching" },
  { icon: Sparkles, text: "Chat assistant (Beta)" },
];

const plans = [
  { id: "day", duration: "1 Day", price: "₹29", originalPrice: "₹49", badge: "Most Popular" },
  { id: "week", duration: "1 Week", price: "₹199", originalPrice: "₹299", badge: null },
  { id: "month", duration: "1 Month", price: "₹299", originalPrice: "₹499", badge: "Best Value" },
  { id: "lifetime", duration: "Lifetime", price: "₹899", originalPrice: "₹1999", badge: "Limited Time" },
];

export function PremiumModal({ isOpen, onClose, onSubscribe }: PremiumModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="bg-gradient-premium text-white p-6 text-center relative">
          <Button 
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <Crown className="w-16 h-16 mx-auto mb-4 animate-float" />
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Upgrade to Premium
            </DialogTitle>
          </DialogHeader>
          <p className="text-white/90">Unlock all features & enjoy unlimited connections</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Features */}
          <div className="space-y-3">
            {premiumFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="p-1 bg-primary/10 rounded-full">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">{feature.text}</span>
                  <Check className="w-4 h-4 text-green-500 ml-auto" />
                </div>
              );
            })}
          </div>

          {/* Plans */}
          <div className="space-y-3">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-warm border-2 ${
                  plan.badge === "Most Popular" ? "border-primary shadow-warm" : "border-border"
                }`}
                onClick={() => onSubscribe(plan.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{plan.duration}</span>
                        {plan.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {plan.badge}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-lg font-bold text-primary">{plan.price}</span>
                        <span className="text-sm text-muted-foreground line-through">
                          {plan.originalPrice}
                        </span>
                      </div>
                    </div>
                    <Button variant="gradient" size="sm">
                      Select
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p className="font-poppins">⚡ Limited time offer - Only 500 spots left at these prices!</p>
            <p className="text-[10px] mt-2 font-poppins">Razorpay ID: rzp_live_h3TuNA7JPL56Dh</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}