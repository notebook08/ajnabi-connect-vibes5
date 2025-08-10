import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CoinBalance } from "./CoinBalance";
import { CoinHeader } from "./CoinHeader";
import { Video, Users, Zap, Heart, Crown, Filter, MapPin, Gem, Phone, Flame, Gift } from "lucide-react";

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

export default function HomeScreen({
  onStartMatch,
  onBuyCoins,
  onUpgradePremium,
  onOpenSpinWheel,
  matchPreference,
  onChangePreference,
  isPremium,
  onRequestUpgrade,
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
        className={`relative flex-1 h-16 sm:h-18 md:h-20 lg:h-24 rounded-xl sm:rounded-2xl border-2 text-sm font-medium transition-all duration-300 overflow-hidden
           ${isActive 
             ? "bg-gradient-primary text-white border-transparent shadow-warm scale-105" 
             : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
           }
           ${locked ? "opacity-60" : ""}`}
        aria-disabled={locked}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-1 sm:space-y-2">
          <span className="text-xl sm:text-2xl md:text-3xl">{emoji}</span>
          <span className="font-poppins font-semibold text-xs sm:text-sm md:text-base">{label}</span>
          {locked && (
            <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
              <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-premium" />
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-16 sm:pb-20 md:pb-24 safe-area-top safe-area-bottom">
      {/* Header with gradient background */}
      <div className="bg-gradient-primary pt-12 sm:pt-16 pb-6 sm:pb-8 px-3 sm:px-4 md:px-6 rounded-b-3xl shadow-warm">
        {/* Coin Header */}
        <div className="flex justify-end mb-4">
          <div className="w-48">
            <CoinHeader 
              balance={coinBalance} 
              onOpenCoins={() => window.location.hash = '#coins'} 
            />
          </div>
        </div>
        
        <div className="text-center text-white">
          <Video className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 animate-float" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 font-dancing">AjnabiCam</h1>
          <p className="text-white/90 font-poppins text-sm sm:text-base md:text-lg">Connect. Chat. Care.</p>
        </div>
      </div>

      <div className="px-3 sm:px-4 md:px-6 -mt-4 sm:-mt-6 space-y-4 sm:space-y-6">
        <div className="max-w-4xl mx-auto w-full space-y-4 sm:space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Card className="shadow-card rounded-xl sm:rounded-2xl border-0 bg-gradient-secondary text-white cursor-pointer hover:scale-105 transition-transform" onClick={onStartMatch}>
              <CardContent className="p-4 sm:p-6 text-center">
                <Video className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 animate-float" />
                <div className="text-lg sm:text-xl font-bold font-poppins">Video Chat</div>
                <div className="text-xs sm:text-sm opacity-90 font-poppins">Start matching</div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card rounded-xl sm:rounded-2xl border-0 bg-gradient-premium text-white cursor-pointer hover:scale-105 transition-transform" onClick={onOpenSpinWheel}>
              <CardContent className="p-4 sm:p-6 text-center">
                <Gift className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 animate-pulse" />
                <div className="text-lg sm:text-xl font-bold font-poppins">Daily Spin</div>
                <div className="text-xs sm:text-sm opacity-90 font-poppins">Win rewards</div>
              </CardContent>
            </Card>
          </div>

          {/* Match Preferences Card */}
          <Card className="shadow-card rounded-xl sm:rounded-2xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 sm:p-6">
              <CardTitle className="font-poppins text-base sm:text-lg md:text-xl flex items-center gap-2">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                {isPremium ? "Who do you want to meet?" : "Match Preference (Premium Only)"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <PreferenceButton value="anyone" label="Everyone" emoji="🌟" />
                <PreferenceButton value="men" label="Men" emoji="👨" />
                <PreferenceButton value="women" label="Women" emoji="👩" />
              </div>
              {!isPremium && (
                <div className="bg-premium/10 border border-premium/20 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-premium flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium font-poppins">Premium Feature</p>
                      <p className="text-xs text-muted-foreground font-poppins">
                        Free users get random matches. Premium users can choose gender preference.
                      </p>
                    </div>
                    <Button 
                      onClick={onRequestUpgrade} 
                      variant="outline" 
                      size="sm"
                      className="border-premium text-premium hover:bg-premium hover:text-white font-poppins flex-shrink-0"
                    >
                      Upgrade
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Card className="shadow-card rounded-xl sm:rounded-2xl border-0 bg-gradient-secondary text-white">
              <CardContent className="p-3 sm:p-4 text-center">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold font-poppins">2.4K</div>
                <div className="text-xs sm:text-sm opacity-90 font-poppins">People Online</div>
              </CardContent>
            </Card>
            <Card className="shadow-card rounded-xl sm:rounded-2xl border-0 bg-gradient-premium text-white">
              <CardContent className="p-3 sm:p-4 text-center">
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold font-poppins">5km</div>
                <div className="text-xs sm:text-sm opacity-90 font-poppins">Search Radius</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Action Card */}
          <Card className="shadow-card rounded-xl sm:rounded-2xl border-0 overflow-hidden">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="mb-4 sm:mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse-warm">
                  <Heart className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 font-poppins">Ready to Connect?</h3>
                <p className="text-muted-foreground font-poppins text-sm sm:text-base">
                  Start a video chat with someone new and make meaningful connections
                </p>
              </div>
              
              <Button 
                onClick={onStartMatch}
                className="w-full h-12 sm:h-14 md:h-16 font-poppins font-bold text-lg sm:text-xl rounded-xl sm:rounded-2xl mb-3 sm:mb-4"
                variant="gradient"
                size="lg"
              >
                <Video className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" />
                {isPremium ? "Start Targeted Matching" : "Start Random Matching"}
              </Button>
              
              <div className="flex items-center justify-center gap-3 sm:gap-4 text-sm text-muted-foreground font-poppins">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Instant Connect</span>
                </div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">{isPremium ? "Targeted" : "Random"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voice Chat Promotion */}
          <Card className="shadow-card rounded-xl sm:rounded-2xl border-0 border-l-4 border-l-secondary">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="p-2 sm:p-3 bg-secondary/10 rounded-full flex-shrink-0">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold font-poppins text-sm sm:text-base">Try Voice Chat</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground font-poppins">
                      Connect through voice-only conversations
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => {/* Navigate to voice tab */}} 
                  variant="outline" 
                  size="sm"
                  className="font-poppins flex-shrink-0"
                >
                  Try Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="shadow-card rounded-xl sm:rounded-2xl border-0 border-l-4 border-l-primary">
            <CardContent className="p-4 sm:p-6">
              <h4 className="font-semibold mb-2 sm:mb-3 font-poppins flex items-center gap-2 text-sm sm:text-base">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Pro Tips for Better Connections
              </h4>
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground font-poppins">
                <p>• Be yourself and smile during video calls</p>
                <p>• Ask interesting questions to break the ice</p>
                <p>• Keep conversations positive and fun</p>
                <p>• Respect others and report inappropriate behavior</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}