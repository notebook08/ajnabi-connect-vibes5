import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Crown, AlertCircle, Gem, Filter, Bell } from "lucide-react";
import { CoinBalance } from "./CoinBalance";
import videoChatIllustration from "@/assets/video-chat-illustration.jpg";

interface HomeScreenProps {
  onStartMatch: () => void;
  onBuyCoins: () => void;
  onUpgradePremium: () => void;
  matchPreference: "anyone" | "men" | "women";
  onChangePreference: (pref: "anyone" | "men" | "women") => void;
  isPremium: boolean;
  onRequestUpgrade: () => void;
}

export function HomeScreen({ 
  onStartMatch, 
  onBuyCoins, 
  onUpgradePremium, 
  matchPreference, 
  onChangePreference, 
  isPremium, 
  onRequestUpgrade 
}: HomeScreenProps) {
  const [coinBalance] = useState(100);

  const PreferenceButton = ({
    value,
    label,
    emoji,
  }: { value: "anyone" | "men" | "women"; label: string; emoji: string }) => {
    const locked = !isPremium && value !== "anyone";
    const isActive = matchPreference === value;
    return (
      <button
        onClick={() => (locked ? onRequestUpgrade() : onChangePreference(value))}
        className={`relative flex-1 h-16 rounded-2xl border-2 text-sm font-medium transition-all duration-300 overflow-hidden
           ${isActive 
             ? "bg-gradient-primary text-white border-transparent shadow-warm scale-105" 
             : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
           }
           ${locked ? "opacity-60" : ""}`}
        aria-disabled={locked}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-1">
          <span className="text-xl">{emoji}</span>
          <span className="font-poppins font-semibold text-xs">{label}</span>
          {locked && (
            <div className="absolute top-1 right-1">
              <Crown className="w-3 h-3 text-premium" />
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Status Bar Safe Area */}
      <div className="safe-area-top bg-gradient-primary" />
      
      {/* Header */}
      <div className="relative bg-gradient-primary pb-6 px-4 sm:px-6">
        <div className="flex items-center justify-between pt-4 mb-6">
          <div className="flex-1">
            <h1 className="font-dancing text-3xl sm:text-4xl font-bold text-white mb-1">
              AjnabiCam
            </h1>
            <p className="text-white/90 font-poppins text-sm sm:text-base">Connect with strangers worldwide</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full w-10 h-10"
            >
              <Bell className="w-5 h-5" />
            </Button>
            <Button 
              onClick={onBuyCoins}
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 p-3 rounded-full min-h-10 min-w-10"
            >
              <Gem className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 -mt-4 space-y-4 sm:space-y-6 pb-20 sm:pb-24 safe-area-bottom">
        {/* Coin Balance */}
        <CoinBalance balance={coinBalance} onBuyCoins={onBuyCoins} />

        {/* Premium Banner */}
        <Card className="bg-gradient-premium shadow-card border-0 rounded-xl sm:rounded-2xl overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                <div>
                  <h3 className="text-white font-semibold font-poppins text-sm sm:text-base">Go Premium</h3>
                  <p className="text-white/80 text-xs sm:text-sm">Unlimited matches & features</p>
                </div>
              </div>
              <Button 
                onClick={onUpgradePremium}
                variant="outline" 
                size="sm"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 font-poppins h-8 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm"
              >
                Upgrade
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Video Chat Section */}
        <Card className="shadow-card rounded-xl sm:rounded-2xl overflow-hidden border-0">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 overflow-hidden rounded-lg sm:rounded-xl">
              <img 
                src={videoChatIllustration} 
                alt="Video Chat" 
                className="w-full h-32 sm:h-48 object-cover"
              />
            </div>
            <CardTitle className="font-poppins text-lg sm:text-xl">Start Video Chat</CardTitle>
            <p className="text-muted-foreground text-xs sm:text-sm font-poppins">
              Connect with someone new and have meaningful conversations
            </p>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            {/* Match Preferences */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-sm font-poppins">Who do you want to meet?</h4>
              </div>
              <div className="flex items-center gap-2">
                <PreferenceButton value="anyone" label="Everyone" emoji="🌟" />
                <PreferenceButton value="men" label="Men" emoji="👨" />
                <PreferenceButton value="women" label="Women" emoji="👩" />
              </div>
              {!isPremium && (
                <div className="bg-premium/10 border border-premium/20 rounded-lg sm:rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-premium" />
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium font-poppins">Premium Feature</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground font-poppins">
                        Filter by gender with Premium
                      </p>
                    </div>
                    <Button 
                      onClick={onRequestUpgrade} 
                      variant="outline" 
                      size="sm"
                      className="border-premium text-premium hover:bg-premium hover:text-white font-poppins h-7 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-xs"
                    >
                      Upgrade
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <Button 
              onClick={onStartMatch}
              className="w-full h-12 sm:h-14 font-poppins font-semibold text-base sm:text-lg rounded-xl"
              variant="gradient"
              size="lg"
            >
              <Video className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              Find Someone to Chat
            </Button>
            
            <div className="text-center space-y-2">
              <p className="text-xs sm:text-sm text-muted-foreground font-poppins">
                💡 Tip: After 3 chats, watch an ad to earn 50 coins!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Limited Time Offer */}
        <Card className="border-2 border-primary shadow-warm rounded-xl sm:rounded-2xl border-primary/20 bg-primary/5">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-foreground font-poppins text-sm sm:text-base">Limited Time Offer!</h4>
                <p className="text-xs sm:text-sm text-muted-foreground font-poppins">
                  Only 500 premium spots left at ₹29/day.
                </p>
              </div>
              <Button onClick={onUpgradePremium} variant="outline" size="sm" className="font-poppins h-8 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm">
                Upgrade
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Bottom Safe Area */}
      <div className="safe-area-bottom" />
    </div>
  );
}