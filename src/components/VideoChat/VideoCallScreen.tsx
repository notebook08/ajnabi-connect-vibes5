import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff, 
  RotateCcw,
  Flag,
  Heart,
  ArrowLeft
} from "lucide-react";

interface VideoCallScreenProps {
  onEndCall: () => void;
  onReconnect: () => void;
  onReport: () => void;
  onBlock: () => void;
  onBack?: () => void;
}

export function VideoCallScreen({ onEndCall, onReconnect, onReport, onBlock, onBack }: VideoCallScreenProps) {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate connection
    const timer = setTimeout(() => setIsConnected(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 safe-area-top safe-area-bottom">
      {/* Video Areas */}
      <div className="relative h-full flex flex-col">
        {/* Remote Video */}
        <div className="flex-1 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-4">
          {!isConnected ? (
            <div className="text-center text-white">
              <div className="animate-spin w-10 h-10 sm:w-12 sm:h-12 border-4 border-white/30 border-t-white rounded-full mx-auto mb-3 sm:mb-4"></div>
              <p className="font-poppins text-sm sm:text-base">Connecting...</p>
            </div>
          ) : (
            <div className="text-center text-white">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-white/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                <Heart className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white animate-float" />
              </div>
              <p className="text-base sm:text-lg md:text-xl font-semibold font-poppins">Anonymous User</p>
              <p className="text-white/80 font-poppins text-sm sm:text-base">Delhi, India</p>
            </div>
          )}
        </div>

        {/* Local Video - Responsive positioning and sizing */}
        <div className="absolute top-4 sm:top-6 md:top-8 right-3 sm:right-4 md:right-6 w-20 h-24 sm:w-24 sm:h-32 md:w-28 md:h-36 bg-gray-800 rounded-lg sm:rounded-xl overflow-hidden border-2 border-white/30">
          <div className="h-full bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center">
            <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
        </div>

        {/* Call Duration and Back Button */}
        <div className="absolute top-4 sm:top-6 md:top-8 left-3 sm:left-4 md:left-6 flex items-center gap-2 sm:gap-3">
          {onBack && (
            <Button
              onClick={onBack}
              variant="outline"
              size="icon"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 border-white/30 text-white hover:bg-black/70"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          )}
          <Card className="bg-black/50 border-white/20 rounded-lg sm:rounded-xl border-0">
            <div className="px-2 sm:px-3 py-1 sm:py-2">
              <p className="text-white font-mono text-sm sm:text-base md:text-lg font-poppins">{formatTime(callDuration)}</p>
            </div>
          </Card>
        </div>

        {/* Controls - Responsive sizing and spacing */}
        <div className="absolute bottom-8 sm:bottom-10 md:bottom-12 left-0 right-0 px-4 sm:px-6">
          <div className="flex items-center justify-center space-x-3 sm:space-x-4 md:space-x-6">
            <Button
              onClick={() => setIsMuted(!isMuted)}
              variant={isMuted ? "destructive" : "outline"}
              size="icon"
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              {isMuted ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />}
            </Button>

            <Button
              onClick={() => setIsCameraOff(!isCameraOff)}
              variant={isCameraOff ? "destructive" : "outline"}
              size="icon"
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              {isCameraOff ? <CameraOff className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> : <Camera className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />}
            </Button>

            <Button
              onClick={onEndCall}
              variant="destructive"
              size="icon"
              className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full animate-pulse-warm shadow-warm"
            >
              <PhoneOff className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
            </Button>

            <Button
              onClick={onReport}
              variant="outline"
              size="icon"
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Flag className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </Button>

            <Button
              onClick={onReconnect}
              variant="outline"
              size="icon"
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}