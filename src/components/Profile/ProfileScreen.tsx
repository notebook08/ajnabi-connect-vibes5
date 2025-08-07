import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Zap, Heart, Edit } from "lucide-react";

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
    <div className="min-h-screen bg-background pb-20">
      <div className="relative">
        {/* Main Photo */}
        <div className="relative h-96 overflow-hidden rounded-b-3xl">
          <img 
            src={photos[0]} 
            alt={username}
            className="w-full h-full object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* User Info Overlay */}
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-3xl font-bold mb-1">{username}, {age}</h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>2 km away</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                <span>{interests.length} Common Interest{interests.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          {onEdit && (
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="absolute top-6 right-6 bg-white/20 border-white/30 text-white backdrop-blur-sm"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        {/* Additional Photos */}
        {photos.length > 1 && (
          <div className="px-6 mt-6">
            <div className="grid grid-cols-3 gap-2">
              {photos.slice(1).map((photo, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden">
                  <img 
                    src={photo} 
                    alt={`${username} photo ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bio Section */}
        <Card className="mx-6 mt-6 shadow-card">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-3">Bio</h2>
            <p className="text-foreground leading-relaxed">{bio}</p>
          </CardContent>
        </Card>

        {/* About Me Tags */}
        <Card className="mx-6 mt-4 shadow-card">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-3">About Me</h2>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <Badge variant="outline" className="justify-center py-2">
                👩 Woman
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                🎵 Musicians
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                ♉ Taurus
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                -- Never
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                🍺 Sometimes
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Interests Section */}
        <Card className="mx-6 mt-4 mb-6 shadow-card">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-3">Interest</h2>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <Badge 
                  key={index}
                  variant="default"
                  className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="fixed bottom-20 left-0 right-0 px-6">
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-16 h-16 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              ✕
            </Button>
            <Button
              variant="default"
              size="lg"
              className="rounded-full w-16 h-16 bg-gradient-primary border-0 text-white"
            >
              <Heart className="w-6 h-6 fill-current" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}