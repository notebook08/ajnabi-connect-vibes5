import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Plus, X, Heart, ArrowRight, Sparkles, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  username: string;
  photos: string[];
  bio: string;
  interests: string[];
  matchPreference: "anyone" | "men" | "women";
}

interface OnboardingScreenProps {
  onComplete: (profile: UserProfile) => void;
  initialProfile?: Partial<UserProfile>;
  isPremium?: boolean;
  onRequestUpgrade?: () => void;
}

const availableInterests = [
  "🎵 Music", "🎬 Movies", "🏃‍♀️ Fitness", "🍳 Cooking", "📚 Reading", "✈️ Travel",
  "🎨 Art", "📸 Photography", "🎮 Gaming", "⚽ Sports", "🌱 Nature", "💻 Tech",
  "👗 Fashion", "🧘‍♀️ Yoga", "☕ Coffee", "🐕 Dogs", "🐱 Cats", "🎭 Theater",
  "🍷 Wine", "🏖️ Beach", "🏔️ Mountains", "🎪 Adventure", "📖 Writing", "🎯 Goals"
];

const steps = [
  { id: 1, title: "What's your name?", subtitle: "This is how others will see you" },
  { id: 2, title: "Add your photos", subtitle: "Show your best self with 2-6 photos" },
  { id: 3, title: "Tell us about yourself", subtitle: "Write something that represents you" },
  { id: 4, title: "What are you into?", subtitle: "Pick your interests to find better matches" },
];

export function OnboardingScreen({ onComplete, initialProfile, isPremium = false, onRequestUpgrade }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [username, setUsername] = useState(initialProfile?.username ?? "");
  const [photos, setPhotos] = useState<string[]>(initialProfile?.photos ?? []);
  const [bio, setBio] = useState(initialProfile?.bio ?? "");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(initialProfile?.interests ?? []);
  const [matchPreference, setMatchPreference] = useState<"anyone" | "men" | "women">(initialProfile?.matchPreference ?? "anyone");
  const { toast } = useToast();

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && photos.length < 6) {
      const newPhotos = Array.from(files).slice(0, 6 - photos.length);
      newPhotos.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setPhotos(prev => [...prev, result]);
        };
        reader.readAsDataURL(file);
      });
    } else if (photos.length >= 6) {
      toast({
        title: "Maximum photos reached",
        description: "You can upload a maximum of 6 photos.",
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
        : prev.length < 10 ? [...prev, interest] : prev
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return username.trim().length >= 2;
      case 2: return photos.length >= 2;
      case 3: return bio.trim().length >= 20;
      case 4: return selectedInterests.length >= 3;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    onComplete({
      username: username.trim(),
      photos,
      bio: bio.trim(),
      interests: selectedInterests,
      matchPreference,
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col h-full">
            <div className="text-center mb-6 lg:mb-8 flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 font-poppins">{steps[0].title}</h2>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-poppins px-4">{steps[0].subtitle}</p>
            </div>
            
            <div className="flex-1 flex flex-col justify-center space-y-4 lg:space-y-6 px-4 sm:px-6">
              <Input
                placeholder="Enter your first name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-base sm:text-lg lg:text-xl h-12 sm:h-14 lg:h-16 rounded-xl sm:rounded-2xl font-poppins text-center"
                maxLength={20}
              />
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground text-center font-poppins">
                {username.length}/20 characters
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col h-full">
            <div className="text-center mb-6 lg:mb-8 flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 font-poppins">{steps[1].title}</h2>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-poppins px-4">{steps[1].subtitle}</p>
            </div>

            <div className="flex-1 px-4 sm:px-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 max-w-2xl mx-auto">
                {photos.map((photo, index) => (
                  <div key={index} className="relative aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden">
                    <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-black/50 text-white rounded-full p-1 sm:p-1.5 backdrop-blur-sm hover:bg-black/70 transition-colors"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 bg-primary text-white px-2 py-1 rounded-full text-[10px] sm:text-xs font-poppins">
                        Main
                      </div>
                    )}
                  </div>
                ))}
                
                {photos.length < 6 && (
                  <label className="aspect-[3/4] border-2 border-dashed border-primary/30 rounded-xl sm:rounded-2xl flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors bg-primary/5 hover:bg-primary/10">
                    <div className="text-center">
                      <Plus className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-primary" />
                      <p className="text-xs sm:text-sm text-primary font-poppins font-medium">Add Photo</p>
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
              
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground text-center font-poppins mt-4">
                {photos.length}/6 photos • Minimum 2 required
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col h-full">
            <div className="text-center mb-6 lg:mb-8 flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-premium rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 font-poppins">{steps[2].title}</h2>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-poppins px-4">{steps[2].subtitle}</p>
            </div>

            <div className="flex-1 flex flex-col px-4 sm:px-6 space-y-4">
              <Textarea
                placeholder="I love exploring new places, trying different cuisines, and having deep conversations over coffee. Looking for someone who shares my passion for adventure and can make me laugh..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="flex-1 min-h-[120px] sm:min-h-[140px] lg:min-h-[160px] resize-none rounded-xl sm:rounded-2xl font-poppins text-sm sm:text-base leading-relaxed"
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-poppins">
                  {bio.length}/500 characters
                </p>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-poppins">
                  Minimum 20 characters
                </p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col h-full">
            <div className="text-center mb-6 lg:mb-8 flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 font-poppins">{steps[3].title}</h2>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-poppins px-4">{steps[3].subtitle}</p>
            </div>

            <div className="flex-1 px-4 sm:px-6 overflow-y-auto">
              <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 justify-center max-w-4xl mx-auto">
                {availableInterests.map((interest) => (
                  <Badge
                    key={interest}
                    variant={selectedInterests.includes(interest) ? "default" : "outline"}
                    className={`cursor-pointer transition-all hover:scale-105 font-poppins px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 text-xs sm:text-sm lg:text-base ${
                      selectedInterests.includes(interest) 
                        ? "bg-primary text-white shadow-warm" 
                        : "hover:bg-primary/10"
                    }`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
              
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground text-center font-poppins mt-4">
                {selectedInterests.length}/10 selected • Minimum 3 required
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex flex-col">
      {/* Status Bar Safe Area */}
      <div className="safe-area-top bg-gradient-primary" />
      
      {/* Progress Bar */}
      <div className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/80 font-poppins text-xs sm:text-sm lg:text-base">Step {currentStep} of 4</span>
          <span className="text-white/80 font-poppins text-xs sm:text-sm lg:text-base">{Math.round((currentStep / 4) * 100)}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-1.5 sm:h-2">
          <div 
            className="bg-white rounded-full h-1.5 sm:h-2 transition-all duration-500"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 min-h-0">
        <Card className="shadow-card rounded-2xl sm:rounded-3xl border-0 h-full flex flex-col max-w-4xl mx-auto">
          <CardContent className="p-6 sm:p-8 lg:p-10 flex-1 flex flex-col min-h-0">
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 space-y-3 sm:space-y-4 flex-shrink-0 max-w-4xl mx-auto w-full">
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="w-full h-12 sm:h-14 lg:h-16 rounded-xl sm:rounded-2xl font-poppins font-semibold text-base sm:text-lg lg:text-xl"
          variant="gradient"
        >
          {currentStep === 4 ? "Complete Profile" : "Continue"}
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ml-2" />
        </Button>
        
        {currentStep > 1 && (
          <Button
            onClick={() => setCurrentStep(currentStep - 1)}
            variant="outline"
            className="w-full h-10 sm:h-12 lg:h-14 rounded-xl sm:rounded-2xl font-poppins bg-white/20 border-white/30 text-white hover:bg-white/30 text-sm sm:text-base lg:text-lg"
          >
            Back
          </Button>
        )}
      </div>
      
      {/* Bottom Safe Area */}
      <div className="safe-area-bottom bg-gradient-primary" />
    </div>
  );
}