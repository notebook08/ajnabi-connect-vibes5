import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Users, Zap, Heart, Crown, Filter, MapPin, ArrowLeft, Gem } from "lucide-react";

interface MatchScreenProps {
  onStartMatch: () => void;
  isPremium: boolean;
  matchPreference: "anyone" | "men" | "women";
  onChangePreference: (pref: "anyone" | "men" | "women") => void;
  onRequestUpgrade: () => void;
  onBack?: () => void;
  onBuyCoins?: () => void;
}

export function MatchScreen({
  onStartMatch,
  isPremium,
  matchPreference,
  onChangePreference,
  onRequestUpgrade,
  onBack,
  onBuyCoins,
}: MatchScreenProps) {
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
          <Video className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 animate-float" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 font-dancing">Find Your Match</h1>
          <p className="text-white/90 font-poppins text-sm sm:text-base md:text-lg">Connect with amazing people nearby</p>
        </div>
      </div>

      <div className="px-3 sm:px-4 md:px-6 -mt-4 sm:-mt-6 space-y-4 sm:space-y-6">
        <div className="max-w-4xl mx-auto w-full space-y-4 sm:space-y-6">
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
              {!isPremium && (
                <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-3 sm:p-4 mt-3">
                  <div className="text-center">
                    <div className="flex justify-center gap-2 mb-2">
                      <span className="text-2xl">👨</span>
                      <span className="text-lg">+</span>
                      <span className="text-2xl">👩</span>
                    </div>
                    <p className="text-sm font-medium font-poppins text-blue-800">Random Matching Active</p>
                    <p className="text-xs text-blue-600 font-poppins">
                      Meet diverse people from all backgrounds and genders
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Match Button */}
          <Card className="shadow-card rounded-xl sm:rounded-2xl border-0 overflow-hidden">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="mb-4 sm:mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse-warm">
                  <Video className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" />
                </div>
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
         
        </div>
      </div>
    </div>
  );
}