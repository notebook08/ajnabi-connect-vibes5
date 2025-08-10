import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Crown, AlertCircle, Gem, Filter, Bell, Coins } from "lucide-react";
import { Treasure } from "@/components/ui/icons";
import videoChatIllustration from "@/assets/video-chat-illustration.jpg";

interface HomeScreenProps {
  onStartMatch: () => void;
  onBuyCoins: () => void;
  onUpgradePremium: () => void;
  onOpenSpinWheel: () => void;
  matchPreference: "anyone" | "men" | "women";
  onChangePreference: (pref: "anyone" | "men" | "women") => void;
  isPremium: boolean;
  onRequestUpgrade: () => void;
}

export function HomeScreen({ 
  onStartMatch, 
  onBuyCoins, 
  onUpgradePremium, 
  onOpenSpinWheel,
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
        className={`relative flex-1 h-12 sm:h-14 md:h-16 lg:h-18 rounded-xl sm:rounded-2xl border-2 text-xs sm:text-sm md:text-base font-medium transition-all duration-300 overflow-hidden
           ${isActive 
             ? "bg-gradient-primary text-white border-transparent shadow-warm scale-105" 
             : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
           }
           ${locked ? "opacity-60" : ""}`}
        aria-disabled={locked}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-1">
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl">{emoji}</span>
          <span className="font-poppins font-semibold text-[10px] sm:text-xs md:text-sm">{label}</span>
          {locked && (
            <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
              <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-premium" />
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
      
      {/* Header - Responsive padding and sizing */}
      <div className="relative bg-gradient-primary pb-4 sm:pb-6 md:pb-8 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between pt-3 sm:pt-4 md:pt-6 mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="font-dancing text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 truncate">
              AjnabiCam
            </h1>
            <p className="text-white/90 font-poppins text-xs sm:text-sm md:text-base lg:text-lg">Connect with strangers worldwide</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Button 
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </Button>
            <Button 
              onClick={onOpenSpinWheel}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 animate-pulse-warm"
            >
              <Treasure className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </Button>
            
            {/* Coin Balance Display */}
            <div 
              onClick={() => window.location.hash = '#coins'}
              className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-full px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform shadow-lg"
            >
              <div className="p-1 bg-white/20 rounded-full">
                <Coins className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="text-white">
                <p className="text-[10px] sm:text-xs font-medium font-poppins leading-none">Your Coins</p>
                <p className="text-sm sm:text-base font-bold font-poppins leading-none">{coinBalance}</p>
              </div>
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  onBuyCoins();
                }}
                variant="outline"
                size="sm"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 h-6 sm:h-7 px-2 sm:px-3 text-xs font-poppins rounded-lg"
              >
                + Buy
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive container */}
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 -mt-3 sm:-mt-4 md:-mt-6 space-y-3 sm:space-y-4 md:space-y-6 pb-16 sm:pb-20 md:pb-24 safe-area-bottom">
        <div className="max-w-4xl mx-auto w-full">
          {/* Premium Banner */}
          <Card className="bg-gradient-premium shadow-card border-0 rounded-xl sm:rounded-2xl overflow-hidden">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <Crown className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="text-white font-semibold font-poppins text-sm sm:text-base md:text-lg truncate">Go Premium</h3>
                    <p className="text-white/80 text-xs sm:text-sm md:text-base">Unlimited matches & features</p>
                  </div>
                </div>
                <Button 
                  onClick={onUpgradePremium}
                  variant="outline" 
                  size="sm"
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30 font-poppins h-7 sm:h-8 md:h-10 px-2 sm:px-3 md:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm flex-shrink-0"
                >
                  Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Video Chat Section */}
          <Card className="shadow-card rounded-xl sm:rounded-2xl overflow-hidden border-0">
            <CardHeader className="text-center p-3 sm:p-4 md:p-6">
              <div className="mx-auto mb-3 sm:mb-4 overflow-hidden rounded-lg sm:rounded-xl">
                <img 
                  src={videoChatIllustration} 
              
              <Button 
                onClick={onStartMatch}
                className="w-full h-10 sm:h-12 md:h-14 lg:h-16 font-poppins font-semibold text-sm sm:text-base md:text-lg lg:text-xl rounded-xl"
                variant="gradient"
                size="lg"
              >
                <Video className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3" />
                {isPremium ? "Find Someone to Chat" : "Find Random Match"}
              </Button>
              
              <div className="text-center space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm text-muted-foreground font-poppins">
                  💡 Tip: After 3 chats, watch an ad to earn 50 coins!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Limited Time Offer */}
          <Card className="border-2 border-primary shadow-warm rounded-xl sm:rounded-2xl border-primary/20 bg-primary/5">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground font-poppins text-sm sm:text-base">Limited Time Offer!</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground font-poppins">
                    Only 500 premium spots left at ₹29/day.
                  </p>
                </div>
                <Button 
                  onClick={onUpgradePremium} 
                  variant="outline" 
                  size="sm" 
                  className="font-poppins h-7 sm:h-8 md:h-10 px-2 sm:px-3 md:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm flex-shrink-0"
                >
                  Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Limited Time Offer */}
          <Card className="border-2 border-primary shadow-warm rounded-xl sm:rounded-2xl border-primary/20 bg-primary/5">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground font-poppins text-sm sm:text-base">Limited Time Offer!</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground font-poppins">
                    Only 500 premium spots left at ₹29/day.
                  </p>
                </div>
                <Button 
                  onClick={onUpgradePremium} 
                  variant="outline" 
                  size="sm" 
                  className="font-poppins h-7 sm:h-8 md:h-10 px-2 sm:px-3 md:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm flex-shrink-0"
                >
                  Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Bottom Safe Area */}
      <div className="safe-area-bottom" />
    </div>
  );
}