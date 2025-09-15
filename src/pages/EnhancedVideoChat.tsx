import { EnhancedVideoCallScreen } from "@/components/VideoChat/EnhancedVideoCallScreen";
import { useNavigate } from "react-router-dom";

export default function EnhancedVideoChat() {
  const navigate = useNavigate();

  return (
    <EnhancedVideoCallScreen
      onBack={() => navigate('/')}
      onEndCall={() => navigate('/')}
      initialProfile={{
        name: 'Anonymous User',
        age: 25,
        gender: 'other',
        bio: 'Nice to meet you!',
        interests: ['music', 'movies', 'travel']
      }}
    />
  );
}