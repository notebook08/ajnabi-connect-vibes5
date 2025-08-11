import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Users, Zap, Heart, Crown, Filter, MapPin, Gem, Phone, Flame, Gift, Eye, Globe, Star, Sparkles, Clock, TrendingUp } from "lucide-react";

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
  const [liveUserCount] = useState(1247832); // Simulated live count

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
        className={`relative flex-1 h-16 rounded-2xl border-2 text-sm font-medium transition-all duration-300 overflow-hidden group
           ${isActive 
             ? "bg-gradient-primary text-white border-transparent shadow-warm scale-105" 
             : "bg-white/90 text-foreground border-border hover:border-primary/50 hover:bg-primary/5 hover:scale-102"
           }
           ${locked ? "opacity-70" : ""}`}
        aria-disabled={locked}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-2">
          <span className="text-2xl">{emoji}</span>
          <span className="font-poppins font-semibold">{label}</span>
          {locked && (
            <Crown className="w-4 h-4 text-premium absolute top-2 right-2" />
          )}
        </div>
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 pb-20 safe-area-top safe-area-bottom relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-16 w-24 h-24 bg-gradient-to-br from-purple-400/5 to-pink-400/5 rounded-full blur-2xl animate-gentle-bounce" />
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-gradient-to-br from-blue-400/5 to-cyan-400/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Status Bar with Live Stats */}
      <div className="pt-12 px-4 pb-2">
        <div className="flex justify-between items-center">
          {/* Live User Count */}
          <div className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-card hover:shadow-warm transition-all duration-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <div className="text-left">
                <p className="text-green-600 text-xs font-medium font-poppins">Live Now</p>
                <p className="text-green-800 text-sm font-bold font-poppins">{liveUserCount.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2">
            {/* Activity Button */}
            <button 
              className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-card hover:shadow-warm transition-all duration-300 hover:scale-105"
              onClick={() => window.location.hash = '#recent-activity'}
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 rounded-full relative">
                  <Eye className="w-4 h-4 text-purple-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-[8px] font-bold">5</span>
                  </div>
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
      </div>

      {/* Hero Section */}
      <div className="text-center px-6 mb-8">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-2xl relative">
            <Video className="w-12 h-12 text-white animate-float" />
            {/* Pulsing rings for live effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-primary animate-ping opacity-20" />
            <div className="absolute inset-0 rounded-3xl bg-gradient-primary animate-pulse opacity-30" />
          </div>
          {/* Live indicator */}
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse shadow-lg">
            LIVE
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-2 font-dancing">AjnabiCam</h1>
        <p className="text-gray-600 font-poppins text-lg font-medium mb-4">Meet. Chat. Connect.</p>
        
        {/* Social proof */}
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-1">
            <Globe className="w-4 h-4" />
            <span className="font-poppins">190+ Countries</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span className="font-poppins">1Cr+ Users</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            <span className="font-poppins">4.8★ Rating</span>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6 max-w-md mx-auto">
        {/* Trending Now Banner */}
        <div className="bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 rounded-2xl p-1 shadow-2xl animate-pulse-warm">
          <div className="bg-white/95 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold font-poppins text-gray-800">🔥 Trending Now</p>
                  <p className="text-xs text-gray-600 font-poppins">Peak hours - More matches available!</p>
                </div>
              </div>
              <Badge className="bg-red-500 text-white animate-pulse font-poppins">HOT</Badge>
            </div>
          </div>
        </div>

        {/* Main CTA - Redesigned for maximum impact */}
        <div className="relative">
          {/* Glow effect background */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 rounded-3xl blur-2xl opacity-40 animate-pulse scale-110" />
          
          <Button 
            onClick={onStartMatch}
            className="relative w-full h-24 font-poppins font-bold text-2xl rounded-3xl bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 hover:from-red-600 hover:via-pink-600 hover:to-orange-600 text-white border-0 shadow-2xl hover:shadow-red-500/30 transition-all duration-300 hover:scale-105 overflow-hidden group"
            size="lg"
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
            
            <div className="relative flex items-center justify-center space-x-4">
              <div className="p-4 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Video className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold leading-tight">Start Matching</div>
                <div className="text-sm opacity-90 font-medium">
                  {liveUserCount.toLocaleString()} people online now
                </div>
              </div>
            </div>
          </Button>
        </div>

        {/* Voice Chat CTA - Enhanced */}
        <div className="relative">
          <Button
            onClick={() => {/* Navigate to voice tab */}}
            className="w-full h-20 rounded-3xl text-white hover:scale-105 transition-all duration-300 border-0 shadow-2xl relative overflow-hidden group bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative flex items-center justify-center space-x-4">
              <div className="p-3 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold font-poppins">Voice Only Chat</div>
                <div className="text-sm opacity-90 font-poppins flex items-center gap-2">
                  {hasUnlimitedCalls ? (
                    <>
                      <Crown className="w-4 h-4" />
                      <span>Unlimited access</span>
                    </>
                  ) : (
                    <>
                      <Gem className="w-4 h-4" />
                      <span>20 coins per call</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Button>
          
          {/* Subtle glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-20 -z-10" />
        </div>

        {/* Match Preferences - Redesigned */}
        <Card className="shadow-card rounded-3xl border-0 overflow-hidden bg-white/90 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Filter className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-poppins text-xl font-bold text-gray-800">Match Preference</h3>
                <p className="text-gray-600 font-poppins text-sm">
                  {isPremium ? "Choose who you want to meet" : "Upgrade to filter by gender"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <PreferenceButton value="anyone" label="Everyone" emoji="🌟" />
              <PreferenceButton value="men" label="Men" emoji="👨" />
              <PreferenceButton value="women" label="Women" emoji="👩" />
            </div>
            
            {!isPremium && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-gradient-premium rounded-xl">
                      <Crown className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold font-poppins text-purple-800">Unlock Gender Filters</p>
                      <p className="text-xs text-purple-600 font-poppins">Choose exactly who you want to meet</p>
                    </div>
                  </div>
                  <Button 
                    onClick={onRequestUpgrade} 
                    size="sm"
                    className="bg-gradient-premium text-white font-poppins rounded-xl shadow-warm hover:scale-105 transition-transform flex-shrink-0"
                  >
                    Upgrade
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats & Features Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Daily Spin */}
          <Card 
            className="shadow-card rounded-2xl border-0 overflow-hidden bg-white/90 backdrop-blur-md cursor-pointer hover:scale-105 transition-all duration-300 group"
            onClick={onOpenSpinWheel}
          >
            <CardContent className="p-5 text-center">
              <div className="w-12 h-12 bg-gradient-premium rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Gift className="w-6 h-6 text-white animate-float" />
              </div>
              <h4 className="font-bold font-poppins text-gray-800 text-sm mb-1">Daily Spin</h4>
              <p className="text-xs text-gray-600 font-poppins">Win up to 100 coins</p>
              <Badge className="mt-2 bg-yellow-500 text-white text-xs font-poppins">FREE</Badge>
            </CardContent>
          </Card>

          {/* Streak Rewards */}
          <Card className="shadow-card rounded-2xl border-0 overflow-hidden bg-white/90 backdrop-blur-md cursor-pointer hover:scale-105 transition-all duration-300 group">
            <CardContent className="p-5 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Flame className="w-6 h-6 text-white animate-float" />
              </div>
              <h4 className="font-bold font-poppins text-gray-800 text-sm mb-1">Login Streak</h4>
              <p className="text-xs text-gray-600 font-poppins">Day 3 - Keep going!</p>
              <Badge className="mt-2 bg-orange-500 text-white text-xs font-poppins">ACTIVE</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Success Stories Carousel */}
        <Card className="shadow-card rounded-3xl border-0 overflow-hidden bg-white/90 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-pink-100 rounded-xl">
                <Heart className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-poppins text-lg font-bold text-gray-800">Success Stories</h3>
                <p className="text-gray-600 font-poppins text-sm">Real connections made today</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-xl p-4 border border-pink-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    R
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium font-poppins text-gray-800">"Made an amazing friend from Mumbai!"</p>
                    <p className="text-xs text-gray-500 font-poppins">- Rahul, 2 hours ago</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    P
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium font-poppins text-gray-800">"Found someone who shares my love for books!"</p>
                    <p className="text-xs text-gray-500 font-poppins">- Priya, 1 hour ago</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety & Trust Indicators */}
        <Card className="shadow-card rounded-3xl border-0 overflow-hidden bg-white/90 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full" />
                </div>
              </div>
              <h3 className="font-poppins text-lg font-bold text-gray-800 mb-2">Safe & Secure</h3>
              <p className="text-gray-600 font-poppins text-sm">Your privacy and safety are our top priority</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-green-600 text-lg">🔒</span>
                </div>
                <p className="text-xs font-medium font-poppins text-gray-700">End-to-End Encrypted</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-blue-600 text-lg">🛡️</span>
                </div>
                <p className="text-xs font-medium font-poppins text-gray-700">24/7 Moderation</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-purple-600 text-lg">⚡</span>
                </div>
                <p className="text-xs font-medium font-poppins text-gray-700">Instant Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How it Works - Simplified */}
        <div className="space-y-4">
          <h4 className="text-xl font-bold text-gray-800 font-poppins text-center">How it works</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-4 bg-white/80 rounded-2xl p-4 shadow-card hover:shadow-warm transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold font-poppins text-lg shadow-lg">
                1
              </div>
              <div>
                <p className="font-bold font-poppins text-gray-800">Tap "Start Matching"</p>
                <p className="text-sm text-gray-600 font-poppins">We'll instantly connect you with someone new</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/80 rounded-2xl p-4 shadow-card hover:shadow-warm transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center text-white font-bold font-poppins text-lg shadow-lg">
                2
              </div>
              <div>
                <p className="font-bold font-poppins text-gray-800">Have a Real Conversation</p>
                <p className="text-sm text-gray-600 font-poppins">Video or voice chat for authentic connections</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/80 rounded-2xl p-4 shadow-card hover:shadow-warm transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center text-white font-bold font-poppins text-lg shadow-lg">
                3
              </div>
              <div>
                <p className="font-bold font-poppins text-gray-800">Make Lasting Connections</p>
                <p className="text-sm text-gray-600 font-poppins">Continue chatting and build meaningful relationships</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA for Premium */}
        {!isPremium && (
          <Card className="shadow-card rounded-3xl border-0 overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6 text-center">
              <Crown className="w-16 h-16 mx-auto mb-4 animate-float" />
              <h3 className="text-xl font-bold mb-2 font-dancing">Upgrade to Premium</h3>
              <p className="text-white/90 font-poppins text-sm mb-4">
                Choose your ideal matches and get priority connections
              </p>
              <div className="flex items-center justify-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  <span className="font-poppins">Gender Filters</span>
                </div>
                <div className="flex items-center gap-1">
                  <Crown className="w-4 h-4" />
                  <span className="font-poppins">Priority Queue</span>
                </div>
              </div>
              <Button 
                onClick={onRequestUpgrade}
                className="w-full h-12 bg-white text-purple-600 hover:bg-gray-50 font-poppins font-bold rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Upgrade Now - Starting ₹29
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}