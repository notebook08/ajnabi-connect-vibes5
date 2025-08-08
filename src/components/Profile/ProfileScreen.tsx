import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Zap, Heart, Edit, Camera, Plus, Settings } from "lucide-react";

interface UserProfile {
  username: string;
  photos: string[];
  bio: string;
  interests: string[];
  age?: number;
}

interface ProfileScreenProps {
  profile: UserProfile;
  onEdit?: () => void;
}

export function ProfileScreen({ profile, onEdit }: ProfileScreenProps) {
  const { username, photos, bio, interests, age = 20 } = profile;

  return (
    <div className="min-h-screen bg-background pb-20 safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold font-poppins">My Profile</h1>
          <Button
            onClick={onEdit}
            variant="outline"
            size="sm"
            className="font-poppins h-10 px-4 rounded-xl"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="px-4 space-y-6 pt-4">
        {/* Photo Grid */}
        <Card className="shadow-card rounded-2xl border-0 overflow-hidden">
          <CardContent className="p-0">
            {/* Scrollable Photo Section */}
            <div className="relative">
              <div 
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {photos.map((photo, index) => (
                  <div key={index} className="w-full flex-shrink-0 snap-start relative">
                    <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-secondary/20">
                      <img 
                        src={photo} 
                        alt={`${username} photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Gradient overlay for text readability on first photo */}
                      {index === 0 && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4 text-white">
                            <h2 className="text-2xl font-bold mb-1 font-poppins">{username}, {age}</h2>
                            <div className="flex items-center gap-4 text-sm font-poppins">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>2 km away</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Zap className="w-4 h-4" />
                                <span>Recently Active</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Add Photo Button as last slide */}
                {photos.length < 6 && (
                  <div className="w-full flex-shrink-0 snap-start">
                    <div className="aspect-[4/3] bg-muted/50 flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                      <div className="text-center">
                        <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground font-poppins">Add Photo</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Photo indicators */}
              {photos.length > 1 && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {photos.map((_, index) => (
                    <div
                      key={index}
                      className="h-1 w-8 bg-white/50 rounded-full"
                    />
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="shadow-card rounded-2xl border-0 bg-gradient-primary text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold font-poppins">127</div>
              <div className="text-sm opacity-90 font-poppins">Matches</div>
            </CardContent>
          </Card>
          <Card className="shadow-card rounded-2xl border-0 bg-gradient-secondary text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold font-poppins">89%</div>
              <div className="text-sm opacity-90 font-poppins">Response Rate</div>
            </CardContent>
          </Card>
          <Card className="shadow-card rounded-2xl border-0 bg-gradient-premium text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold font-poppins">4.8</div>
              <div className="text-sm opacity-90 font-poppins">Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Bio Section */}
        <Card className="shadow-card rounded-2xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold font-poppins">About Me</h3>
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-foreground leading-relaxed font-poppins">{bio}</p>
          </CardContent>
        </Card>

        {/* Lifestyle Tags */}
        <Card className="shadow-card rounded-2xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold font-poppins">Lifestyle</h3>
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Badge variant="outline" className="justify-center py-3 font-poppins">
                🚭 Non-smoker
              </Badge>
              <Badge variant="outline" className="justify-center py-3 font-poppins">
                🍷 Social Drinker
              </Badge>
              <Badge variant="outline" className="justify-center py-3 font-poppins">
                🏃‍♀️ Active
              </Badge>
              <Badge variant="outline" className="justify-center py-3 font-poppins">
                🐕 Dog Lover
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Interests Section */}
        <Card className="shadow-card rounded-2xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold font-poppins">My Interests</h3>
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <Badge 
                  key={index}
                  variant="default"
                  className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 font-poppins px-4 py-2"
                >
                  {interest}
                </Badge>
              ))}
              <Button variant="outline" size="sm" className="rounded-full" onClick={onEdit}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="shadow-card rounded-2xl border-0">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 font-poppins">Settings</h3>
            <div className="space-y-3">
              <Button variant="ghost" className="w-full justify-start h-12 font-poppins">
                <Settings className="w-5 h-5 mr-3" />
                Account Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start h-12 font-poppins">
                <Heart className="w-5 h-5 mr-3" />
                Dating Preferences
              </Button>
              <Button variant="ghost" className="w-full justify-start h-12 font-poppins">
                <Zap className="w-5 h-5 mr-3" />
                Privacy & Safety
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}