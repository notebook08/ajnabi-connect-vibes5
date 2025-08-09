import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Gem, Eye, Heart, Unlock, Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface BlurredProfile {
  id: string;
  blurredPhoto: string;
  originalPhoto: string;
  username: string;
  age: number;
  distance: string;
  actionType: "liked" | "viewed";
  timeAgo: string;
  unlockCost: number;
  isUnlocked: boolean;
}

interface BlurredProfilesScreenProps {
  profiles: BlurredProfile[];
  coinBalance: number;
  onBack: () => void;
  onUnlockProfile: (profileId: string, cost: number) => void;
  onBuyCoins: () => void;
}

export function BlurredProfilesScreen({ 
  profiles, 
  coinBalance, 
  onBack, 
  onUnlockProfile, 
  onBuyCoins 
}: BlurredProfilesScreenProps) {
  const [unlockedProfiles, setUnlockedProfiles] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleUnlock = (profile: BlurredProfile) => {
    if (coinBalance < profile.unlockCost) {
      toast({
        title: "Not enough coins",
        description: `You need ${profile.unlockCost} coins to unlock this profile.`,
        variant: "destructive"
      });
      return;
    }

    setUnlockedProfiles(prev => new Set([...prev, profile.id]));
    onUnlockProfile(profile.id, profile.unlockCost);
    
    toast({
      title: "Profile unlocked! 🎉",
      description: `You can now see ${profile.username}'s full profile.`,
    });
  };

  const likedProfiles = profiles.filter(p => p.actionType === "liked");
  const viewedProfiles = profiles.filter(p => p.actionType === "viewed");

  const ProfileCard = ({ profile }: { profile: BlurredProfile }) => {
    const isUnlocked = unlockedProfiles.has(profile.id) || profile.isUnlocked;
    
    return (
      <Card className="shadow-card rounded-2xl border-0 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden">
              <img 
                src={isUnlocked ? profile.originalPhoto : profile.blurredPhoto}
                alt={isUnlocked ? `${profile.username}'s profile` : "Blurred profile"}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  !isUnlocked ? 'filter blur-md' : ''
                }`}
              />
              
              {/* Overlay for locked profiles */}
              {!isUnlocked && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Unlock className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                    <p className="text-sm font-semibold font-poppins">Tap to Unlock</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Gem className="w-3 h-3" />
                      <span className="text-xs font-poppins">{profile.unlockCost}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Action type badge */}
            <div className="absolute top-2 left-2">
              <Badge 
                className={`${
                  profile.actionType === "liked" 
                    ? "bg-red-500 hover:bg-red-600" 
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white border-0 font-poppins`}
              >
                {profile.actionType === "liked" ? (
                  <><Heart className="w-3 h-3 mr-1" /> Liked</>
                ) : (
                  <><Eye className="w-3 h-3 mr-1" /> Viewed</>
                )}
              </Badge>
            </div>
          </div>
          
          <div className="p-4">
            {isUnlocked ? (
              <div>
                <h3 className="font-semibold text-lg font-poppins">{profile.username}, {profile.age}</h3>
                <p className="text-sm text-muted-foreground font-poppins">{profile.distance} • {profile.timeAgo}</p>
              </div>
            ) : (
              <div>
                <div className="h-6 bg-muted rounded mb-2 animate-pulse" />
                <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
              </div>
            )}
            
            {!isUnlocked && (
              <Button
                onClick={() => handleUnlock(profile)}
                disabled={coinBalance < profile.unlockCost}
                className="w-full mt-3 h-10 rounded-xl font-poppins font-semibold"
                variant="gradient"
              >
                <Gem className="w-4 h-4 mr-2" />
                Unlock for {profile.unlockCost} coins
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="bg-gradient-primary pt-16 pb-8 px-4 rounded-b-3xl shadow-warm">
        <div className="flex items-center justify-between mb-4">
          <Button 
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 text-center">
            <h1 className="font-dancing text-4xl font-bold text-white mb-1">
              Profile Unlocks
            </h1>
            <p className="text-white/90 font-poppins text-sm">See who's interested in you</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/20 rounded-full px-3 py-1 flex items-center gap-1">
              <Coins className="w-4 h-4 text-white" />
              <span className="text-white font-semibold font-poppins text-sm">{coinBalance}</span>
            </div>
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

      <div className="px-4 -mt-6 pb-24 space-y-6">
        <div className="max-w-4xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="shadow-card rounded-2xl border-0 bg-gradient-secondary text-white">
              <CardContent className="p-4 text-center">
                <Heart className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold font-poppins">{likedProfiles.length}</div>
                <div className="text-sm opacity-90 font-poppins">Liked You</div>
              </CardContent>
            </Card>
            <Card className="shadow-card rounded-2xl border-0 bg-gradient-premium text-white">
              <CardContent className="p-4 text-center">
                <Eye className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold font-poppins">{viewedProfiles.length}</div>
                <div className="text-sm opacity-90 font-poppins">Viewed You</div>
              </CardContent>
            </Card>
          </div>

          {/* Liked Profiles Section */}
          {likedProfiles.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 font-poppins flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                People who liked you
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {likedProfiles.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            </div>
          )}

          {/* Viewed Profiles Section */}
          {viewedProfiles.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 font-poppins flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-500" />
                People who viewed you
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {viewedProfiles.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {profiles.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-poppins">No profile activity yet</h3>
              <p className="text-muted-foreground font-poppins mb-6">
                When people like or view your profile, they'll appear here
              </p>
              <Button 
                onClick={onBack}
                variant="gradient"
                className="font-poppins"
              >
                Go back to matching
              </Button>
            </div>
          )}

          {/* Low coins warning */}
          {coinBalance < 10 && profiles.some(p => !p.isUnlocked && !unlockedProfiles.has(p.id)) && (
            <Card className="border-2 border-orange-200 bg-orange-50 rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Gem className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-orange-800 font-poppins">Running low on coins?</h4>
                    <p className="text-sm text-orange-700 font-poppins mb-3">
                      You need more coins to unlock profiles. Get coins to see who's interested in you!
                    </p>
                    <Button 
                      onClick={onBuyCoins}
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 text-white font-poppins"
                    >
                      <Gem className="w-4 h-4 mr-2" />
                      Buy Coins
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}