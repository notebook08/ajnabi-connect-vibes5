import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CoinBalance } from "./CoinBalance";
import { CoinHeader } from "./CoinHeader";
import { Video, Users, Zap, Heart, Crown, Filter, MapPin, Gem, Phone, Flame, Gift, Eye } from "lucide-react";

interface HomeScreenProps {
  onStartMatch: () => void;
  onBuyCoins: () => void;
  onUpgradePremium: () => void;
  onOpenSpinWheel: () => void;
  matchPreference: "anyone" | "men" | "women";
  onChangePreference: (pref: "anyone" | "men" | "women") => void;
  isPremium: boolean;
  hasUnlimitedCalls?: boolean;
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
  hasUnlimitedCalls = false,
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
        <div className="flex justify-end gap-3 mb-4">
          <div className="w-40">
            <div 
              className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl px-4 py-3 cursor-pointer hover:scale-105 transition-transform shadow-warm"
              onClick={() => window.location.hash = '#recent-activity'}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 rounded-full">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-xs font-poppins font-medium">Activity</p>
                    <p className="text-white text-sm font-bold font-poppins">5 new</p>
                  </div>
                </div>
                <Button 
                  size="sm"
                  className="bg-yellow-400 hover:bg-yellow-500 text-purple-800 font-poppins font-semibold h-6 px-2 rounded-lg border-0 shadow-none text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.hash = '#recent-activity';
                  }}
                >
                  View
                </Button>
              </div>
            </div>
          </div>
          <div className="w-40">
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
          <Card className="shadow-card rounded-xl sm:rounded-2xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 sm:p-6">
              <CardTitle className="font-poppins text-base sm:text-lg md:text-xl flex items-center gap-2">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                Chat Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <Button
                  onClick={onStartMatch}
                  className="h-16 sm:h-20 md:h-24 rounded-xl sm:rounded-2xl bg-gradient-secondary text-white hover:scale-105 transition-transform border-0 shadow-warm"
                >
                  <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-2">
                    <Video className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                    <div className="text-sm sm:text-base md:text-lg font-bold font-poppins">Video Call</div>
                    <div className="text-xs sm:text-sm opacity-90 font-poppins">Start matching</div>
                  </div>
                </Button>
                
                <Button
                  onClick={() => {/* Navigate to voice tab */}}
                  className={`h-16 sm:h-20 md:h-24 rounded-xl sm:rounded-2xl text-white hover:scale-105 transition-transform border-0 shadow-warm ${
                    hasUnlimitedCalls 
                      ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                      : "bg-gradient-to-r from-purple-500 to-pink-500"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-2">
                    <Phone className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                    <div className="text-sm sm:text-base md:text-lg font-bold font-poppins">Voice Only</div>
                    <div className="text-xs sm:text-sm opacity-90 font-poppins">
                      {hasUnlimitedCalls ? "Unlimited" : "Audio chat"}
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

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

          {/* Main Action Button */}
          <Button 
            onClick={onStartMatch}
            className="w-full h-12 sm:h-14 md:h-16 font-poppins font-bold text-lg sm:text-xl rounded-xl sm:rounded-2xl"
            variant="gradient"
            size="lg"
          >
            <Video className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" />
            {isPremium ? "Start Targeted Matching" : "Start Random Matching"}
          </Button>

          {/* Voice Chat Promotion or Status */}
          <Card className="shadow-card rounded-xl sm:rounded-2xl border-0 border-l-4 border-l-premium">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="p-2 sm:p-3 bg-premium/10 rounded-full flex-shrink-0">
                    {hasUnlimitedCalls ? (
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    ) : (
                      <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-premium" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold font-poppins text-sm sm:text-base">
                      {hasUnlimitedCalls ? "Unlimited Voice Calls" : "Daily Spin Wheel"}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground font-poppins">
                      {hasUnlimitedCalls ? "Talk as long as you want" : "Win coins and rewards every day"}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={hasUnlimitedCalls ? onBuyCoins : onOpenSpinWheel} 
                  variant="outline" 
                  size="sm"
                  className="font-poppins flex-shrink-0"
                >
                  {hasUnlimitedCalls ? "Manage" : "Spin Now"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}