import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Users, Crown, Star, AlertCircle } from "lucide-react";
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
    <div className="pb-20 px-4 pt-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Welcome to AjnabiCam</h1>
        <p className="text-muted-foreground">Start meaningful conversations</p>
      </div>

      {/* Coin Balance */}
      <CoinBalance balance={coinBalance} onBuyCoins={onBuyCoins} />

      {/* Premium Banner */}
      <Card className="bg-gradient-premium shadow-card border-none">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="w-8 h-8 text-white" />
              <div>
                <h3 className="text-white font-semibold">Go Premium</h3>
                <p className="text-white/80 text-sm">Unlimited matches & features</p>
              </div>
            </div>
            <Button 
              onClick={onUpgradePremium}
              variant="outline" 
              size="sm"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              Upgrade
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Video Chat Section */}
      <Card className="shadow-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 overflow-hidden rounded-xl">
            <img 
              src={videoChatIllustration} 
              alt="Video Chat" 
              className="w-full h-48 object-cover"
            />
          </div>
          <CardTitle>Start Video Chat</CardTitle>
          <p className="text-muted-foreground text-sm">
            Connect with someone new and have meaningful conversations
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={onStartMatch}
            className="w-full"
            variant="gradient"
            size="lg"
          >
            <Video className="w-5 h-5 mr-2" />
            Find Someone to Chat
          </Button>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              💡 Tip: After 3 chats, watch an ad to earn 50 coins!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">12.5K+</p>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-secondary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">4.8</p>
            <p className="text-sm text-muted-foreground">User Rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Limited Time Offer */}
      <Card className="border-2 border-primary shadow-warm">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground">Limited Time Offer!</h4>
              <p className="text-sm text-muted-foreground">
                Only 500 premium spots left at ₹29/day. Join our Telegram for exclusive deals!
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Join Telegram
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}