import { useState } from "react";
import { SplashScreen } from "@/components/Onboarding/SplashScreen";
import { OnboardingScreen } from "@/components/Onboarding/OnboardingScreen";
import { ProfileScreen } from "@/components/Profile/ProfileScreen";
import { HomeScreen } from "@/components/Home/HomeScreen";
import { VideoCallScreen } from "@/components/VideoChat/VideoCallScreen";
import { PremiumModal } from "@/components/Premium/PremiumModal";
import { CoinPurchaseModal } from "@/components/Coins/CoinPurchaseModal";
import { BottomNav } from "@/components/Layout/BottomNav";
import { useToast } from "@/hooks/use-toast";
import { Video, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-bg.jpg";

interface UserProfile {
  username: string;
  photos: string[];
  bio: string;
  interests: string[];
}

const Index = () => {
  const [appState, setAppState] = useState<"splash" | "onboarding" | "main">("splash");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentScreen, setCurrentScreen] = useState<"home" | "call">("home");
  const [activeTab, setActiveTab] = useState("home");
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showCoinModal, setShowCoinModal] = useState(false);
  const { toast } = useToast();

  if (appState === "splash") {
    return <SplashScreen onComplete={() => setAppState("onboarding")} />;
  }

  if (appState === "onboarding") {
    return (
      <OnboardingScreen
        onComplete={(profile) => {
          setUserProfile(profile);
          setAppState("main");
          toast({
            title: "Profile created!",
            description: "Welcome to AjnabiCam! Your profile looks amazing.",
          });
        }}
      />
    );
  }

  if (currentScreen === "call") {
    return (
      <VideoCallScreen
        onEndCall={() => {
          setCurrentScreen("home");
          toast({
            title: "Call ended",
            description: "Thanks for chatting! Rate your experience.",
          });
        }}
        onReconnect={() => {
          toast({
            title: "Reconnecting...",
            description: "Looking for your previous chat partner.",
          });
        }}
        onReport={() => {
          toast({
            title: "Report submitted",
            description: "Thank you for keeping our community safe.",
          });
        }}
        onBlock={() => {
          toast({
            title: "User blocked",
            description: "You won't be matched with this user again.",
          });
        }}
      />
    );
  }

  const handleStartMatch = () => {
    setCurrentScreen("call");
    toast({
      title: "Finding someone for you...",
      description: "This may take a few seconds.",
    });
  };

  const handleBuyCoins = () => {
    setShowCoinModal(true);
  };

  const handleUpgradePremium = () => {
    setShowPremiumModal(true);
  };

  const handleCoinPurchase = (pack: string) => {
    setShowCoinModal(false);
    toast({
      title: "Purchase successful!",
      description: "Coins have been added to your account.",
    });
  };

  const handlePremiumSubscribe = (plan: string) => {
    setShowPremiumModal(false);
    toast({
      title: "Welcome to Premium!",
      description: "All premium features are now unlocked.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Background */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Main Content */}
      <div className="relative z-10">
        {activeTab === "home" && (
          <HomeScreen
            onStartMatch={handleStartMatch}
            onBuyCoins={handleBuyCoins}
            onUpgradePremium={handleUpgradePremium}
          />
        )}
        
        {activeTab === "match" && (
          <div className="min-h-screen bg-background pb-24 px-4 pt-12">
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 font-poppins text-foreground">Find Your Match</h2>
                <p className="text-muted-foreground mb-6 font-poppins">Set your preferences and start matching</p>
              </div>
              <div className="space-y-4">
                <Button 
                  onClick={handleStartMatch}
                  className="w-full h-14 font-poppins font-semibold text-lg"
                  variant="gradient"
                >
                  <Video className="w-6 h-6 mr-3" />
                  Start Random Chat
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "coins" && (
          <div className="min-h-screen bg-background pb-24 px-4 pt-12">
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 font-dancing text-foreground">Your Treasure</h2>
                <div className="bg-gradient-secondary p-6 rounded-2xl text-center mb-6">
                  <Gem className="w-12 h-12 text-white mx-auto mb-4" />
                  <p className="text-4xl font-bold text-white font-poppins">100</p>
                  <p className="text-white/80 font-poppins">Available Coins</p>
                </div>
              </div>
              <Button 
                onClick={handleBuyCoins}
                className="w-full h-14 font-poppins font-semibold text-lg"
                variant="gradient"
              >
                <Gem className="w-6 h-6 mr-3" />
                Buy More Coins
              </Button>
            </div>
          </div>
        )}
        
        {activeTab === "chat" && (
          <div className="min-h-screen bg-background pb-24 px-4 pt-12">
            <div className="max-w-lg mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4 font-poppins text-foreground">Chat History</h2>
              <p className="text-muted-foreground font-poppins">Your recent conversations will appear here</p>
            </div>
          </div>
        )}
        
        {activeTab === "profile" && userProfile && (
          <ProfileScreen 
            profile={userProfile}
            onEdit={() => setAppState("onboarding")}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Modals */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onSubscribe={handlePremiumSubscribe}
      />
      
      <CoinPurchaseModal
        isOpen={showCoinModal}
        onClose={() => setShowCoinModal(false)}
        onPurchase={handleCoinPurchase}
      />
    </div>
  );
};

export default Index;
