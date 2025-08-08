import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Crown, AlertCircle, Gem } from "lucide-react";
import { CoinBalance } from "./CoinBalance";
import videoChatIllustration from "@/assets/video-chat-illustration.jpg";

interface HomeScreenProps {
  onStartMatch: () => void;
  onBuyCoins: () => void;
  onUpgradePremium: () => void;
}

export function HomeScreen({ onStartMatch, onBuyCoins, onUpgradePremium }: HomeScreenProps) {
  const [coinBalance] = useState(100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with App Name and Treasure Chest */}
      <div className="relative bg-gradient-primary pt-12 pb-8 px-4 rounded-b-3xl shadow-warm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1 className="font-dancing text-4xl font-bold text-white mb-1">
              AjnabiCam
            </h1>
            <p className="text-white/90 font-poppins text-sm">Connect with strangers worldwide</p>
          </div>
          <Button 
            onClick={onBuyCoins}
            variant="outline"
            size="sm"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30 p-3 rounded-full"
          >
            <Gem className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="px-4 -mt-6 space-y-6 pb-24">
        {/* Coin Balance */}
        <CoinBalance balance={coinBalance} onBuyCoins={onBuyCoins} />

        {/* Premium Banner */}
        <Card className="bg-gradient-premium shadow-card border-none rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="w-8 h-8 text-white" />
                <div>
                  <h3 className="text-white font-semibold font-poppins">Go Premium</h3>
                  <p className="text-white/80 text-sm">Unlimited matches & features</p>
                </div>
              </div>
              <Button 
                onClick={onUpgradePremium}
                variant="outline" 
                size="sm"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 font-poppins"
              >
                Upgrade
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Video Chat Section */}
        <Card className="shadow-card rounded-2xl overflow-hidden">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 overflow-hidden rounded-xl">
              <img 
                src={videoChatIllustration} 
                alt="Video Chat" 
                className="w-full h-48 object-cover"
              />
            </div>
            <CardTitle className="font-poppins text-xl">Start Video Chat</CardTitle>
            <p className="text-muted-foreground text-sm font-poppins">
              Connect with someone new and have meaningful conversations
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={onStartMatch}
              className="w-full h-14 font-poppins font-semibold text-lg"
              variant="gradient"
              size="lg"
            >
              <Video className="w-6 h-6 mr-3" />
              Find Someone to Chat
            </Button>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground font-poppins">
                💡 Tip: After 3 chats, watch an ad to earn 50 coins!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Limited Time Offer */}
        <Card className="border-2 border-primary shadow-warm rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-foreground font-poppins">Limited Time Offer!</h4>
                <p className="text-sm text-muted-foreground font-poppins">
                  Only 500 premium spots left at ₹29/day. Secure payments via Razorpay.
                </p>
              </div>
              <Button onClick={onUpgradePremium} variant="outline" size="sm" className="font-poppins">
                Upgrade
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}