import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Users, Zap, Heart, Crown, Filter, MapPin, ArrowLeft, Gem, Mic, MicOff } from "lucide-react";

interface VoiceCallScreenProps {
  onStartCall: () => void;
  isPremium: boolean;
  hasUnlimitedCalls?: boolean;
  coinBalance: number;
  matchPreference: "anyone" | "men" | "women";
  onChangePreference: (pref: "anyone" | "men" | "women") => void;
  onRequestUpgrade: () => void;
  onBack?: () => void;
  onBuyCoins?: () => void;
  onSpendCoins: (amount: number) => void;
}

export function VoiceCallScreen({
  onStartCall,
  isPremium,
  hasUnlimitedCalls = false,
  coinBalance,
  matchPreference,
  onChangePreference,
  onRequestUpgrade,
  onBack,
  onBuyCoins,
  onSpendCoins,
}: VoiceCallScreenProps) {
  const canMakeCall = isPremium || hasUnlimitedCalls || coinBalance >= 20;

  const handleStartCall = () => {
    if (isPremium || hasUnlimitedCalls) {
      onStartCall();
    } else if (coinBalance >= 20) {
      onSpendCoins(20);
      onStartCall();
    } else {
      // This shouldn't happen as button should be disabled
      onBuyCoins?.();
    }
  };

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
      {/* Header */}
      <div className="bg-gradient-primary pt-12 sm:pt-16 pb-6 sm:pb-8 px-3 sm:px-4 md:px-6 rounded-b-3xl shadow-warm">
        <div className="flex items-center justify-between mb-3 sm:mb-4 text-white">
          {onBack && (
            <Button 
              onClick={onBack}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full w-10 h-10 sm:w-12 sm:h-12"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          )}
          <div className="flex-1" />
          {onBuyCoins && (
            <Button 
              onClick={onBuyCoins}
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 p-2 sm:p-3 rounded-full min-h-10 min-w-10 sm:min-h-12 sm:min-w-12"
            >
              <Gem className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          )}
        </div>
        <div className="text-center text-white">
          <Phone className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 animate-float" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 font-dancing">Voice Chat</h1>
          <p className="text-white/90 font-poppins text-sm sm:text-base md:text-lg">Connect through voice only</p>
        </div>
      </div>

      <div className="px-3 sm:px-4 md:px-6 -mt-4 sm:-mt-6 space-y-4 sm:space-y-6">
        <div className="max-w-4xl mx-auto w-full space-y-4 sm:space-y-6">
          {/* Premium/Coin Requirement Card */}
          <Card className="shadow-card rounded-xl sm:rounded-2xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-premium/10 to-primary/10 p-4 sm:p-6">
              <CardTitle className="font-poppins text-base sm:text-lg md:text-xl flex items-center gap-2">
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-premium" />
                Voice Chat Access
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {hasUnlimitedCalls ? (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium font-poppins text-primary">Unlimited Calls Active</p>
                      <p className="text-xs text-muted-foreground font-poppins">
                        No limits on voice calls for 24 hours
                      </p>
                    </div>
                    <Badge className="bg-primary text-white font-poppins flex-shrink-0">Active</Badge>
                  </div>
                </div>
              ) : isPremium ? (
                <div className="bg-premium/10 border border-premium/20 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-premium flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium font-poppins text-premium">Premium Member</p>
                      <p className="text-xs text-muted-foreground font-poppins">
                        Unlimited voice calls included
                      </p>
                    </div>
                    <Badge className="bg-premium text-white font-poppins flex-shrink-0">Active</Badge>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-coin/10 border border-coin/20 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Gem className="w-4 h-4 sm:w-5 sm:h-5 text-coin flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium font-poppins">Pay per Call</p>
                        <p className="text-xs text-muted-foreground font-poppins">
                          20 coins per voice call
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-coin font-poppins">20 coins</p>
                        <p className="text-xs text-muted-foreground font-poppins">
                          You have: {coinBalance}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-premium/10 border border-premium/20 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-premium flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium font-poppins">Or Go Premium</p>
                        <p className="text-xs text-muted-foreground font-poppins">
                          Unlimited voice calls + all features
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
                </div>
              )}
            </CardContent>
          </Card>

          {/* Match Preferences Card */}
          <Card className="shadow-card rounded-xl sm:rounded-2xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 sm:p-6">
              <CardTitle className="font-poppins text-base sm:text-lg md:text-xl flex items-center gap-2">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                {isPremium ? "Who do you want to talk to?" : "Voice Match Preference (Premium)"}
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
                        Voice calls are matched randomly for free users. Premium users can choose.
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
              {!isPremium && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-3 sm:p-4 mt-3">
                  <div className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-2">
                      <Phone className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800 font-poppins">Random Voice Matching</span>
                    </div>
                    <p className="text-xs text-purple-600 font-poppins">
                      Connect with anyone for authentic voice conversations
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Start Call Button */}
          <Card className="shadow-card rounded-xl sm:rounded-2xl border-0 overflow-hidden">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="mb-4 sm:mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse-warm">
                  <Phone className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 font-poppins">Ready to Talk?</h3>
                <p className="text-muted-foreground font-poppins text-sm sm:text-base">
                  Start a voice-only conversation and connect through words
                </p>
              </div>
              
              <Button 
                onClick={handleStartCall}
                disabled={!canMakeCall}
                className="w-full h-12 sm:h-14 md:h-16 font-poppins font-bold text-lg sm:text-xl rounded-xl sm:rounded-2xl mb-3 sm:mb-4"
                variant="gradient"
                size="lg"
              >
                <Phone className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" />
                {hasUnlimitedCalls ? "Start Unlimited Voice Chat" : 
                 isPremium ? "Start Targeted Voice Chat" : 
                 `Start Random Voice Chat (20 coins)`}
              </Button>
              
              {!canMakeCall && (
                <p className="text-sm text-destructive font-poppins mb-3">
                  Not enough coins. You need 20 coins to start a voice call.
                </p>
              )}
              
              <div className="flex items-center justify-center gap-3 sm:gap-4 text-sm text-muted-foreground font-poppins">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Instant Connect</span>
                </div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">
                    {hasUnlimitedCalls ? "Unlimited Voice" : 
                     isPremium ? "Targeted Voice" : 
                     "Random Voice"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
         
        </div>
      </div>
    </div>
  );
}