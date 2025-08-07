import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Plus, X, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  username: string;
  photos: string[];
  bio: string;
  interests: string[];
}

interface OnboardingScreenProps {
  onComplete: (profile: UserProfile) => void;
}

const availableInterests = [
  "Reading", "Singing", "Dancing", "Cooking", "Photography", "Travel",
  "Music", "Movies", "Gaming", "Sports", "Art", "Writing", "Nature",
  "Technology", "Fashion", "Fitness", "Yoga", "Coffee", "Dogs", "Cats"
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [username, setUsername] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const { toast } = useToast();

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && photos.length < 4) {
      const newPhotos = Array.from(files).slice(0, 4 - photos.length);
      newPhotos.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setPhotos(prev => [...prev, result]);
        };
        reader.readAsDataURL(file);
      });
    } else if (photos.length >= 4) {
      toast({
        title: "Maximum photos reached",
        description: "You can upload a maximum of 4 photos.",
        variant: "destructive"
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = () => {
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username to continue.",
        variant: "destructive"
      });
      return;
    }

    if (photos.length === 0) {
      toast({
        title: "Photo required",
        description: "Please add at least one photo.",
        variant: "destructive"
      });
      return;
    }

    if (!bio.trim()) {
      toast({
        title: "Bio required",
        description: "Please write something about yourself.",
        variant: "destructive"
      });
      return;
    }

    if (selectedInterests.length === 0) {
      toast({
        title: "Interests required",
        description: "Please select at least one interest.",
        variant: "destructive"
      });
      return;
    }

    onComplete({
      username: username.trim(),
      photos,
      bio: bio.trim(),
      interests: selectedInterests
    });
  };

  return (
    <div className="min-h-screen bg-gradient-primary p-4 overflow-y-auto">
      <div className="max-w-md mx-auto pt-8 pb-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-12 h-12 text-white animate-float" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to AjnabiCam</h1>
          <p className="text-white/80">Let's set up your profile</p>
        </div>

        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle>Your Username</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-lg"
            />
          </CardContent>
        </Card>

        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle>Add Photos (1-4)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {photos.length < 4 && (
                <label className="aspect-square border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                  <div className="text-center">
                    <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Add Photo</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    multiple
                  />
                </label>
              )}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {photos.length}/4 photos added
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle>About You</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Write something about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <p className="text-sm text-muted-foreground text-right mt-2">
              {bio.length}/500 characters
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle>Your Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {availableInterests.map((interest) => (
                <Badge
                  key={interest}
                  variant={selectedInterests.includes(interest) ? "default" : "outline"}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                  {selectedInterests.includes(interest) && <Plus className="w-3 h-3 ml-1 rotate-45" />}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              {selectedInterests.length} interests selected
            </p>
          </CardContent>
        </Card>

        <Button
          onClick={handleSubmit}
          className="w-full"
          variant="gradient"
          size="lg"
        >
          Complete Profile
        </Button>
      </div>
    </div>
  );
}