import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
        className={`relative flex-1 h-12 rounded-2xl border-2 text-sm font-medium transition-all duration-300 overflow-hidden
           ${isActive 
             ? "bg-gradient-primary text-white border-transparent shadow-warm scale-105" 
             : "bg-white text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
           }
           ${locked ? "opacity-60" : ""}`}
        aria-disabled={locked}
      >
        <div className="flex items-center justify-center h-full space-x-2">
          <span className="text-lg">{emoji}</span>
          <span className="font-poppins font-semibold">{label}</span>
          {locked && (
            <Crown className="w-4 h-4 text-premium" />
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20 safe-area-top safe-area-bottom">
      {/* Top Bar */}
      <div className="pt-12 px-6 pb-4">
        <div className="flex justify-end gap-3">
          {/* Activity Button */}
          <button 
            className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-card hover:shadow-warm transition-all duration-300 hover:scale-105"
            onClick={() => window.location.hash = '#recent-activity'}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-100 rounded-full">
                <Eye className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="text-purple-600 text-xs font-medium font-poppins">Activity</p>
                <p className="text-purple-800 text-sm font-bold font-poppins">5 new</p>
              </div>
            </div>
          </button>
          
          {/* Coins Button */}
          <button 
            className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-card hover:shadow-warm transition-all duration-300 hover:scale-105"
            onClick={() => window.location.hash = '#coins'}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-100 rounded-full">
                <Gem className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-left">
                <p className="text-orange-600 text-xs font-medium font-poppins">Coins</p>
                <p className="text-orange-800 text-sm font-bold font-poppins">{coinBalance}</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Logo & Tagline */}
      <div className="text-center px-6 mb-12">
        <div className="w-16 h-16 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-warm">
          <Video className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2 font-dancing">AjnabiCam</h1>
        <p className="text-gray-600 font-poppins text-base font-medium">Connect. Chat. Care.</p>
      </div>

      <div className="px-6 space-y-8 max-w-md mx-auto">
        {/* Primary Actions */}
        <div className="space-y-4">
          <Button
            onClick={onStartMatch}
            className="w-full h-16 rounded-3xl bg-gradient-secondary text-white hover:scale-105 transition-all duration-300 border-0 shadow-warm"
          >
            <div className="flex items-center justify-center space-x-3">
              <Video className="w-7 h-7" />
              <div className="text-left">
                <div className="text-lg font-bold font-poppins">Video Call</div>
                <div className="text-sm opacity-90 font-poppins">Face-to-face conversations</div>
              </div>
            </div>
          </Button>
          
          <Button
            onClick={() => {/* Navigate to voice tab */}}
            className={`w-full h-16 rounded-3xl text-white hover:scale-105 transition-all duration-300 border-0 shadow-warm ${
              hasUnlimitedCalls 
                ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                : "bg-gradient-to-r from-purple-500 to-pink-500"
            }`}
          >
            <div className="flex items-center justify-center space-x-3">
              <Phone className="w-7 h-7" />
              <div className="text-left">
                <div className="text-lg font-bold font-poppins">Voice Only</div>
                <div className="text-sm opacity-90 font-poppins">
                  {hasUnlimitedCalls ? "Unlimited access" : "Audio conversations"}
                </div>
              </div>
            </div>
          </Button>
        </div>

        {/* Match Preferences */}
        <Card className="shadow-card rounded-3xl border-0 overflow-hidden bg-white/80 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary" />
              <h3 className="font-poppins text-lg font-semibold text-gray-800">Match Preference</h3>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <PreferenceButton value="anyone" label="Everyone" emoji="🌟" />
              <PreferenceButton value="men" label="Men" emoji="👨" />
              <PreferenceButton value="women" label="Women" emoji="👩" />
            </div>
            
            {!isPremium && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Crown className="w-5 h-5 text-premium flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium font-poppins text-purple-800">Premium Feature</p>
                      <p className="text-xs text-purple-600 font-poppins">Choose your preferred gender</p>
                    </div>
                  </div>
                  <Button 
                    onClick={onRequestUpgrade} 
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-poppins rounded-xl flex-shrink-0"
                  >
                    Upgrade
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main CTA Button */}
        <Button 
          onClick={onStartMatch}
          className="w-full h-16 font-poppins font-bold text-xl rounded-3xl shadow-warm"
          variant="gradient"
          size="lg"
        >
          <Video className="w-7 h-7 mr-3" />
          {isPremium ? "Start Targeted Matching" : "Start Random Matching"}
        </Button>

        {/* Daily Spin Wheel */}
        <Card 
          className="shadow-card rounded-3xl border-0 overflow-hidden bg-white/80 backdrop-blur-md cursor-pointer hover:scale-105 transition-all duration-300 animate-float"
          onClick={onOpenSpinWheel}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-premium rounded-2xl shadow-warm">
                  <Gift className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div>
                  <h4 className="font-semibold font-poppins text-gray-800">Daily Spin Wheel</h4>
                  <p className="text-sm text-gray-600 font-poppins">Win coins and rewards</p>
                </div>
              </div>
              <Button 
                size="sm"
                className="bg-gradient-secondary text-white font-poppins rounded-2xl shadow-card hover:shadow-warm"
              >
                Spin Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}