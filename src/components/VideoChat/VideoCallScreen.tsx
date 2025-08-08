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
        <div className="flex-1 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          {!isConnected ? (
            <div className="text-center text-white">
              <div className="animate-spin w-12 h-12 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
              <p className="font-poppins">Connecting...</p>
            </div>
          ) : (
            <div className="text-center text-white">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Heart className="w-16 h-16 text-white animate-float" />
              </div>
              <p className="text-lg font-semibold font-poppins">Anonymous User</p>
              <p className="text-white/80 font-poppins">Delhi, India</p>
            </div>
          )}
        </div>

        {/* Local Video */}
        <div className="absolute top-8 right-4 w-24 h-32 bg-gray-800 rounded-xl overflow-hidden border-2 border-white/30">
          <div className="h-full bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center">
            <Camera className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Call Duration */}
        <div className="absolute top-8 left-4 flex items-center gap-3">
          {onBack && (
            <Button
              onClick={onBack}
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full bg-black/50 border-white/30 text-white hover:bg-black/70"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <Card className="bg-black/50 border-white/20 rounded-xl border-0">
            <div className="px-3 py-2">
              <p className="text-white font-mono text-lg font-poppins">{formatTime(callDuration)}</p>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <div className="absolute bottom-12 left-0 right-0 px-4">
          <div className="flex items-center justify-center space-x-4">
            <Button
              onClick={() => setIsMuted(!isMuted)}
              variant={isMuted ? "destructive" : "outline"}
              size="icon"
              className="w-14 h-14 rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>

            <Button
              onClick={() => setIsCameraOff(!isCameraOff)}
              variant={isCameraOff ? "destructive" : "outline"}
              size="icon"
              className="w-14 h-14 rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              {isCameraOff ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
            </Button>

            <Button
              onClick={onEndCall}
              variant="destructive"
              size="icon"
              className="w-18 h-18 rounded-full animate-pulse-warm shadow-warm"
            >
              <PhoneOff className="w-6 h-6" />
            </Button>

            <Button
              onClick={onReport}
              variant="outline"
              size="icon"
              className="w-14 h-14 rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Flag className="w-5 h-5" />
            </Button>

            <Button
              onClick={onReconnect}
              variant="outline"
              size="icon"
              className="w-14 h-14 rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}