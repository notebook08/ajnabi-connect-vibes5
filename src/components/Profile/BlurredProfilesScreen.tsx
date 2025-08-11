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
      <Card className="shadow-card rounded-xl border-0 overflow-hidden h-full">
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
              
              {/* Minimal overlay for locked profiles */}
              {!isUnlocked && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                      <Unlock className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-3">
            {isUnlocked ? (
              <div className="mb-3">
                <h3 className="font-semibold text-sm font-poppins text-gray-800">{profile.username}, {profile.age}</h3>
                <p className="text-xs text-gray-500 font-poppins">{profile.distance} • {profile.timeAgo}</p>
              </div>
            ) : (
              <div className="mb-3">
                <div className="h-4 bg-gray-100 rounded mb-1.5 animate-pulse" />
                <div className="h-3 bg-gray-100 rounded w-2/3 animate-pulse" />
              </div>
            )}
            
            {!isUnlocked && (
              <Button
                onClick={() => handleUnlock(profile)}
                disabled={coinBalance < profile.unlockCost}
                className="w-full h-9 rounded-lg font-poppins font-medium text-sm"
                variant="gradient"
              >
                <Gem className="w-3 h-3 mr-1.5" />
                Unlock ({profile.unlockCost})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 safe-area-top safe-area-bottom">
      {/* Gradient Header */}
      <div className="bg-gradient-primary pt-16 pb-6 px-4 rounded-b-3xl shadow-warm">
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full w-12 h-12"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 text-center">
            <h1 className="font-dancing text-3xl font-bold text-white mb-1">
              Profile Activity
            </h1>
            <p className="text-white/90 font-poppins text-sm">See who's interested in you</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/20 rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-white" />
              <span className="text-white font-semibold font-poppins text-sm">{coinBalance}</span>
            </div>
            <Button 
              onClick={onBuyCoins}
              variant="outline"
              size="icon"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-full w-10 h-10"
            >
              <Gem className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 pb-24">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Stats Cards - Clean, equally spaced layout */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="shadow-card rounded-xl border-0 bg-white">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Heart className="w-5 h-5 text-red-500" />
                </div>
                <div className="text-2xl font-bold font-poppins text-gray-800">{likedProfiles.length}</div>
                <div className="text-xs text-gray-500 font-poppins font-medium">Liked You</div>
              </CardContent>
            </Card>
            <Card className="shadow-card rounded-xl border-0 bg-white">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Eye className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-2xl font-bold font-poppins text-gray-800">{viewedProfiles.length}</div>
                <div className="text-xs text-gray-500 font-poppins font-medium">Viewed You</div>
              </CardContent>
            </Card>
          </div>

          {/* Liked Profiles Section */}
          {likedProfiles.length > 0 && (
            <Card className="bg-white rounded-xl border-0 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center">
                    <Heart className="w-3 h-3 text-red-500" />
                  </div>
                  <h2 className="text-lg font-semibold font-poppins text-gray-800">
                    People who liked you
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {likedProfiles.map((profile) => (
                    <ProfileCard key={profile.id} profile={profile} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Viewed Profiles Section */}
          {viewedProfiles.length > 0 && (
            <Card className="bg-white rounded-xl border-0 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">
                    <Eye className="w-3 h-3 text-blue-500" />
                  </div>
                  <h2 className="text-lg font-semibold font-poppins text-gray-800">
                    People who viewed you
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {viewedProfiles.map((profile) => (
                    <ProfileCard key={profile.id} profile={profile} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {profiles.length === 0 && (
            <Card className="bg-white rounded-xl border-0 shadow-card">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 font-poppins text-gray-800">No activity yet</h3>
                <p className="text-gray-500 font-poppins text-sm mb-6">
                  When people like or view your profile, they'll appear here
                </p>
                <Button 
                  onClick={onBack}
                  variant="gradient"
                  className="font-poppins h-10 px-6 rounded-xl"
                >
                  Start Matching
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Low coins warning */}
          {coinBalance < 10 && profiles.some(p => !p.isUnlocked && !unlockedProfiles.has(p.id)) && (
            <Card className="border border-orange-200 bg-orange-50 rounded-xl shadow-card">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Gem className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-orange-800 font-poppins text-sm">Running low on coins?</h4>
                    <p className="text-sm text-orange-700 font-poppins mb-3">
                      You need more coins to unlock profiles and see who's interested in you.
                    </p>
                    <Button 
                      onClick={onBuyCoins}
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 text-white font-poppins h-8 px-4 rounded-lg"
                    >
                      <Gem className="w-3 h-3 mr-1.5" />
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