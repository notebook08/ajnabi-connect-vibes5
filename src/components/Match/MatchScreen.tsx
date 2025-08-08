import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Lock, Users, Zap, Heart, Crown, Filter, MapPin } from "lucide-react";

interface MatchScreenProps {
  onStartMatch: () => void;
  isPremium: boolean;
  matchPreference: "anyone" | "men" | "women";
  onChangePreference: (pref: "anyone" | "men" | "women") => void;
  onRequestUpgrade: () => void;
}

export function MatchScreen({
  onStartMatch,
  isPremium,
  matchPreference,
  onChangePreference,
  onRequestUpgrade,
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
        className={`relative flex-1 h-20 rounded-2xl border-2 text-sm font-medium transition-all duration-300 overflow-hidden
           ${isActive 
             ? "bg-gradient-primary text-white border-transparent shadow-warm scale-105" 
             : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
           }
           ${locked ? "opacity-60" : ""}`}
        aria-disabled={locked}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-2">
          <span className="text-2xl">{emoji}</span>
          <span className="font-poppins font-semibold">{label}</span>
          {locked && (
            <div className="absolute top-2 right-2">
              <Crown className="w-4 h-4 text-premium" />
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24 safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="bg-gradient-primary pt-16 pb-8 px-4 rounded-b-3xl shadow-warm">
        <div className="text-center text-white">
          <Video className="w-16 h-16 mx-auto mb-4 animate-float" />
          <h1 className="text-3xl font-bold mb-2 font-dancing">Find Your Match</h1>
          <p className="text-white/90 font-poppins">Connect with amazing people nearby</p>
        </div>
      </div>

      <div className="px-4 -mt-6 space-y-6">
        {/* Match Preferences Card */}
        <Card className="shadow-card rounded-2xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardTitle className="font-poppins text-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Who do you want to meet?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <PreferenceButton value="anyone" label="Everyone" emoji="🌟" />
              <PreferenceButton value="men" label="Men" emoji="👨" />
              <PreferenceButton value="women" label="Women" emoji="👩" />
            </div>
            {!isPremium && (
              <div className="bg-premium/10 border border-premium/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-premium" />
                  <div className="flex-1">
                    <p className="text-sm font-medium font-poppins">Premium Feature</p>
                    <p className="text-xs text-muted-foreground font-poppins">
                      Filter by gender with Premium
                    </p>
                  </div>
                  <Button 
                    onClick={onRequestUpgrade} 
                    variant="outline" 
                    size="sm"
                    className="border-premium text-premium hover:bg-premium hover:text-white font-poppins"
                  >
                    Upgrade
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-card rounded-2xl border-0 bg-gradient-secondary text-white">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold font-poppins">2.4K</div>
              <div className="text-sm opacity-90 font-poppins">People Online</div>
            </CardContent>
          </Card>
          <Card className="shadow-card rounded-2xl border-0 bg-gradient-premium text-white">
            <CardContent className="p-4 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold font-poppins">5km</div>
              <div className="text-sm opacity-90 font-poppins">Search Radius</div>
            </CardContent>
          </Card>
        </div>

        {/* Match Button */}
        <Card className="shadow-card rounded-2xl border-0 overflow-hidden">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-warm">
                <Heart className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-poppins">Ready to Connect?</h3>
              <p className="text-muted-foreground font-poppins">
                Start a video chat with someone new and make meaningful connections
              </p>
            </div>
            
            <Button 
              onClick={onStartMatch}
              className="w-full h-16 font-poppins font-bold text-xl rounded-2xl mb-4"
              variant="gradient"
              size="lg"
            >
              <Video className="w-8 h-8 mr-3" />
              Start Matching
            </Button>
            
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground font-poppins">
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                <span>Instant Connect</span>
              </div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full" />
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>Safe & Secure</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="shadow-card rounded-2xl border-0 border-l-4 border-l-primary">
          <CardContent className="p-6">
            <h4 className="font-semibold mb-3 font-poppins flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Pro Tips for Better Matches
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground font-poppins">
              <p>• Be yourself and smile during video calls</p>
              <p>• Ask interesting questions to break the ice</p>
              <p>• Keep conversations positive and fun</p>
              <p>• Respect others and report inappropriate behavior</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-card rounded-2xl border-0">
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 font-poppins">Recent Activity</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <div>
                    <p className="font-medium font-poppins">Sarah liked your profile</p>
                    <p className="text-sm text-muted-foreground font-poppins">2 hours ago</p>
                  </div>
                </div>
                <Badge variant="secondary" className="font-poppins">New</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-secondary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <div>
                    <p className="font-medium font-poppins">You matched with Mike</p>
                    <p className="text-sm text-muted-foreground font-poppins">1 day ago</p>
                  </div>
                </div>
                <Heart className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}