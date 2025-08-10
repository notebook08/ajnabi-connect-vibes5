import { useState } from "react";
import { SplashScreen } from "@/components/Onboarding/SplashScreen";
import { OnboardingScreen } from "@/components/Onboarding/OnboardingScreen";
import { ProfileScreen } from "@/components/Profile/ProfileScreen";
import { HomeScreen } from "@/components/Home/HomeScreen";
import { VideoCallScreen } from "@/components/VideoChat/VideoCallScreen";
import { PostCallProfileScreen } from "@/components/VideoChat/PostCallProfileScreen";
import { MatchScreen } from "@/components/Match/MatchScreen";
import { ChatListScreen, ChatPreview } from "@/components/Chat/ChatListScreen";
import { ChatDetailScreen, ChatData, Message } from "@/components/Chat/ChatDetailScreen";
import { PremiumModal } from "@/components/Premium/PremiumModal";
import { CoinPurchaseModal } from "@/components/Coins/CoinPurchaseModal";
import { VoiceCallScreen } from "@/components/VoiceCall/VoiceCallScreen";
import { VoiceCallActiveScreen } from "@/components/VoiceCall/VoiceCallActiveScreen";
import { SpinWheelScreen } from "@/components/SpinWheel/SpinWheelScreen";
import { LoginStreakModal } from "@/components/Rewards/LoginStreakModal";
import { MysteryBoxModal } from "@/components/Rewards/MysteryBoxModal";
import { BlurredProfilesScreen } from "@/components/Profile/BlurredProfilesScreen";
import { BottomNav } from "@/components/Layout/BottomNav";
import { useLoginStreak } from "@/hooks/useLoginStreak";
import { useMysteryBox } from "@/hooks/useMysteryBox";
import { useBlurredProfiles } from "@/hooks/useBlurredProfiles";
import { useToast } from "@/hooks/use-toast";
import { useMatching } from "@/hooks/useMatching";
import { CoinsScreen } from "@/components/Coins/CoinsScreen";
import { Video, Gem, Phone, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import heroBackground from "@/assets/hero-bg.jpg";

interface UserProfile {
  username: string;
  photos: string[];
  bio: string;
  interests: string[];
  matchPreference: "anyone" | "men" | "women";
  gender: "male" | "female" | "other";
}

const Index = () => {
  const [appState, setAppState] = useState<"splash" | "onboarding" | "main" | "spin-wheel">("splash");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentScreen, setCurrentScreen] = useState<"home" | "call" | "voice-call" | "post-call" | "chat-detail" | "blurred-profiles">("home");
  const [activeTab, setActiveTab] = useState("home");
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [coinBalance, setCoinBalance] = useState(100);
  const [showStreakModal, setShowStreakModal] = useState(false);
  
  // Login streak and mystery box hooks
  const { streakData, claimReward } = useLoginStreak();
  const { profiles: blurredProfiles, unlockProfile } = useBlurredProfiles();
  const { 
    showMysteryBox, 
    currentReward, 
    triggerMysteryBox, 
    openMysteryBox, 
    closeMysteryBox 
  } = useMysteryBox();
  
  // Matching hook
  const matching = useMatching({
    userGender: userProfile?.gender || 'male',
    userId: 'user-' + Date.now(),
    isPremium
  });
  
  // Mock profile data for post-call screen
  const mockCallPartnerProfile = {
    username: "Shafa Asadel",
    age: 20,
    photos: [
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg"
    ],
    bio: "Music enthusiast, always on the lookout for new tunes and ready to share playlists. Let's discover new sounds and enjoy the rhythm of life! ❤️",
    distance: "2 km away",
    commonInterests: 4,
    aboutMe: {
      gender: "Woman",
      religion: "Muslims",
      drinking: "Sometimes",
      smoking: "Never"
    },
    interests: ["🎵 Pop Punk", "☕ Coffee", "🥊 Boxing", "🎮 Fifa Mobile", "⚽ Real Madrid"]
  };
  
  // Mock data
  const [chats] = useState<ChatPreview[]>([
    { id: "1", name: "Sarah", lastMessage: "Hey there! 👋", time: "2m", unread: 2 },
    { id: "2", name: "Mike", lastMessage: "Nice talking to you!", time: "1h" },
    { id: "3", name: "Emma", lastMessage: "See you later", time: "3h" },
  ]);
  
  const [chatData] = useState<Record<string, ChatData>>({
    "1": {
      id: "1",
      name: "Sarah",
      messages: [
        { id: "1", sender: "them", text: "Hey there! 👋", time: "10:30" },
        { id: "2", sender: "me", text: "Hello! How are you?", time: "10:32" },
        { id: "3", sender: "them", text: "I'm doing great! Thanks for asking", time: "10:33" },
      ]
    }
  });
  
  const { toast } = useToast();

  if (appState === "splash") {
    return <SplashScreen onComplete={() => setAppState("onboarding")} />;
  }

  if (appState === "onboarding" || isEditingProfile) {
    return (
      <OnboardingScreen
        initialProfile={isEditingProfile ? userProfile : undefined}
        isPremium={isPremium}
        onRequestUpgrade={() => setShowPremiumModal(true)}
        onComplete={(profile) => {
          setUserProfile(profile);
          if (isEditingProfile) {
            setIsEditingProfile(false);
          } else {
            setAppState("main");
          }
        }}
      />
    );
  }

  if (currentScreen === "call") {
    return (
      <VideoCallScreen
        onEndCall={() => {
          setCurrentScreen("post-call");
          // Trigger mystery box chance after ending call
          setTimeout(() => {
            triggerMysteryBox();
          }, 1000);
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
        coinBalance={coinBalance}
        onSpendCoins={(amount) => {
          setCoinBalance(prev => Math.max(0, prev - amount));
        }}
      />
    );
  }

  if (currentScreen === "voice-call") {
    return (
      <VoiceCallActiveScreen
        onEndCall={() => {
          setCurrentScreen("post-call");
          // Trigger mystery box chance after ending call
          setTimeout(() => {
            triggerMysteryBox();
          }, 1000);
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
        coinBalance={coinBalance}
        onSpendCoins={(amount) => {
          setCoinBalance(prev => Math.max(0, prev - amount));
        }}
      />
    );
  }

  if (currentScreen === "post-call") {
    return (
      <PostCallProfileScreen
        profile={mockCallPartnerProfile}
        onReject={() => {
          setCurrentScreen("home");
        }}
        onAccept={() => {
          setCurrentScreen("home");
          setActiveTab("chat");
        }}
      />
    );
  }

  if (currentScreen === "chat-detail" && activeChatId) {
    const chat = chatData[activeChatId];
    if (!chat) {
      setCurrentScreen("home");
      setActiveTab("chat");
      return null;
    }
    
    return (
      <ChatDetailScreen
        chat={chat}
        onBack={() => {
          setCurrentScreen("home");
          setActiveTab("chat");
        }}
        onSend={(text) => {
          // Message sent logic here
        }}
      />
    );
  }

  if (currentScreen === "blurred-profiles") {
    return (
      <BlurredProfilesScreen
        profiles={blurredProfiles}
        coinBalance={coinBalance}
        onBack={() => {
          setCurrentScreen("home");
          setActiveTab("profile");
        }}
        onUnlockProfile={(profileId, cost) => {
          unlockProfile(profileId);
          setCoinBalance(prev => prev - cost);
        }}
        onBuyCoins={handleBuyCoins}
      />
    );
  }

  const handleStartMatch = () => {
    if (userProfile) {
      // Show matching explanation toast
      const explanation = matching.getMatchingExplanation();
      toast({
        title: explanation.title,
        description: explanation.description,
      });
      
      // Start the matching process
      matching.startMatching(userProfile.matchPreference).then((result) => {
        if (result) {
          setCurrentScreen("call");
        }
      });
    }
  };

  const handleStartVoiceCall = () => {
    if (userProfile) {
      // Show matching explanation toast
      const explanation = matching.getMatchingExplanation();
      toast({
        title: explanation.title + " (Voice)",
        description: explanation.description,
      });
      
      // Start the matching process
      matching.startMatching(userProfile.matchPreference).then((result) => {
        if (result) {
          setCurrentScreen("voice-call");
        }
      });
    }
  };

  const handleBuyCoins = () => {
    setShowCoinModal(true);
  };

  const handleUpgradePremium = () => {
    setShowPremiumModal(true);
  };

  const handleCoinPurchase = (pack: string) => {
    setShowCoinModal(false);
    // Add coins based on pack
    const coinAmounts = { small: 30, medium: 100, large: 350 };
    const amount = coinAmounts[pack as keyof typeof coinAmounts] || 0;
    setCoinBalance(prev => prev + amount);
    toast({
      title: "Coins purchased!",
      description: `${amount} coins added to your account.`,
    });
  };

  const handlePremiumSubscribe = (plan: string) => {
    setIsPremium(true);
    setShowPremiumModal(false);
    toast({
      title: "Welcome to Premium!",
      description: "You now have access to all premium features including unlimited voice calls.",
    });
  };

  const handleStreakRewardClaim = (day: number, reward: { type: 'coins' | 'premium'; amount?: number }) => {
    claimReward(day);
    
    if (reward.type === 'coins' && reward.amount) {
      setCoinBalance(prev => prev + reward.amount!);
      toast({
        title: "Streak Reward Claimed!",
        description: `You earned ${reward.amount} coins for your ${day}-day streak!`,
      });
    } else if (reward.type === 'premium') {
      setIsPremium(true);
      toast({
        title: "Premium Boost Activated!",
        description: "You've unlocked premium features for reaching a 30-day streak!",
      });
    }
  };

  const handleMysteryBoxReward = () => {
    if (currentReward) {
      if (currentReward.type === 'coins' && currentReward.amount) {
        setCoinBalance(prev => prev + currentReward.amount!);
      }
      
      toast({
        title: "Mystery Box Opened! 🎉",
        description: currentReward.description,
      });
    }
  };

  const handleOpenSpinWheel = () => {
    setAppState("spin-wheel");
  };

  // Handle coin balance click to navigate to coins tab
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#coins') {
        setActiveTab('coins');
        window.location.hash = '';
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSpinWheelBack = () => {
    setAppState("main");
  };

  const handleCoinsEarned = (amount: number) => {
    setCoinBalance(prev => prev + amount);
  };

  const handleSpendCoins = (amount: number) => {
    setCoinBalance(prev => Math.max(0, prev - amount));
    toast({
      title: "Coins spent",
      description: `${amount} coins used for voice call.`,
    });
  };

  if (appState === "spin-wheel") {
    return (
      <SpinWheelScreen
        onBack={handleSpinWheelBack}
        onCoinsEarned={handleCoinsEarned}
      />
    );
  }

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
            onOpenSpinWheel={handleOpenSpinWheel}
            matchPreference={userProfile?.matchPreference || "anyone"}
            onChangePreference={(pref) => {
              if (userProfile) {
                setUserProfile({...userProfile, matchPreference: pref});
              }
            }}
            isPremium={isPremium}
            onRequestUpgrade={() => setShowPremiumModal(true)}
          />
        )}
        
        {activeTab === "match" && userProfile && (
          <MatchScreen
            onStartMatch={handleStartMatch}
            isPremium={isPremium}
            matchPreference={userProfile.matchPreference}
            onChangePreference={(pref) => {
              setUserProfile({...userProfile, matchPreference: pref});
            }}
            onRequestUpgrade={() => setShowPremiumModal(true)}
            onBuyCoins={handleBuyCoins}
          />
        )}
        
        {activeTab === "voice" && userProfile && (
          <VoiceCallScreen
            onStartCall={handleStartVoiceCall}
            isPremium={isPremium}
            coinBalance={coinBalance}
            matchPreference={userProfile.matchPreference}
            onChangePreference={(pref) => {
              setUserProfile({...userProfile, matchPreference: pref});
            }}
            onRequestUpgrade={() => setShowPremiumModal(true)}
            onBuyCoins={handleBuyCoins}
            onSpendCoins={handleSpendCoins}
          />
        )}
        
        {activeTab === "coins" && (
          <CoinsScreen
            coinBalance={coinBalance}
            streakData={streakData}
            onBuyCoins={handleBuyCoins}
            onOpenStreakModal={() => setShowStreakModal(true)}
            onOpenSpinWheel={handleOpenSpinWheel}
          />
        )}
        
        {activeTab === "chat" && (
          <ChatListScreen
            chats={chats}
            onOpenChat={(chatId) => {
              setActiveChatId(chatId);
              setCurrentScreen("chat-detail");
            }}
            onBuyCoins={handleBuyCoins}
          />
        )}
        
        {activeTab === "profile" && userProfile && (
          <ProfileScreen 
            profile={userProfile}
            onEdit={() => setIsEditingProfile(true)}
            onUpdateProfile={(updatedProfile) => setUserProfile(updatedProfile)}
            onBuyCoins={handleBuyCoins}
            onViewBlurredProfiles={() => setCurrentScreen("blurred-profiles")}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        hasNewProfileActivity={blurredProfiles.some(p => !p.isUnlocked)}
      />

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
      
      <LoginStreakModal
        isOpen={showStreakModal}
        onClose={() => setShowStreakModal(false)}
        currentStreak={streakData.currentStreak}
        claimedDays={streakData.claimedDays}
        onClaimReward={handleStreakRewardClaim}
      />
      
      <MysteryBoxModal
        isOpen={showMysteryBox}
        onClose={() => {
          handleMysteryBoxReward();
          closeMysteryBox();
        }}
        onOpenBox={openMysteryBox}
        reward={currentReward}
      />
    </div>
  );
};

export default Index;
