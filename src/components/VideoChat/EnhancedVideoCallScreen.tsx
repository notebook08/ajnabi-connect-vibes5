import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import io, { Socket } from 'socket.io-client';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff,
  MessageCircle,
  SkipForward,
  Flag,
  Shield,
  Monitor,
  MonitorOff,
  ArrowLeft,
  Settings,
  Users,
  Clock,
  Signal,
  X
} from "lucide-react";

// Enhanced TypeScript interfaces
interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bio?: string;
  interests: string[];
  avatar?: string;
  location?: {
    country?: string;
    city?: string;
  };
}

interface MatchFilters {
  genderPref: 'any' | 'male' | 'female' | 'other';
  ageMin: number;
  ageMax: number;
  location?: string;
  interests?: string[];
}

interface ChatMessage {
  from: string;
  message: string;
  timestamp: number;
  isOwn?: boolean;
}

interface ConnectionStats {
  bytesReceived: number;
  bytesSent: number;
  packetsLost: number;
  roundTripTime: number;
}

type CallState = 'idle' | 'waiting' | 'connecting' | 'connected' | 'reconnecting' | 'error';
type ConnectionQuality = 'excellent' | 'good' | 'fair' | 'poor' | 'unknown';

interface EnhancedVideoCallScreenProps {
  onBack?: () => void;
  onEndCall?: () => void;
  initialProfile?: Partial<UserProfile>;
  serverUrl?: string;
}

const SIGNALING_SERVER_URL = 'http://localhost:3000';

export function EnhancedVideoCallScreen({ 
  onBack, 
  onEndCall,
  initialProfile,
  serverUrl = SIGNALING_SERVER_URL
}: EnhancedVideoCallScreenProps) {
  // Refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const statsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Core state
  const [callState, setCallState] = useState<CallState>('idle');
  const [statusText, setStatusText] = useState('Ready to connect');
  const [connectionQuality, setConnectionQuality] = useState<ConnectionQuality>('unknown');
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);

  // Media controls
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Chat system
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Profile and matching
  const [profile, setProfile] = useState<UserProfile>({
    name: initialProfile?.name || 'Anonymous',
    age: initialProfile?.age || 25,
    gender: initialProfile?.gender || 'other',
    bio: initialProfile?.bio || 'Nice to meet you!',
    interests: initialProfile?.interests || ['music', 'movies', 'travel'],
    location: { country: 'India' }
  });

  const [filters, setFilters] = useState<MatchFilters>({
    genderPref: 'any',
    ageMin: 18,
    ageMax: 50,
    interests: []
  });

  // Settings
  const [showSettings, setShowSettings] = useState(false);
  const [currentPeerId, setCurrentPeerId] = useState<string | null>(null);

  const { toast } = useToast();

  // Enhanced RTC configuration
  const rtcConfig: RTCConfiguration = useMemo(() => ({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' }
    ],
    iceCandidatePoolSize: 10,
    bundlePolicy: 'max-bundle' as RTCBundlePolicy,
    rtcpMuxPolicy: 'require' as RTCRtcpMuxPolicy
  }), []);

  // Session duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionStartTime && callState === 'connected') {
      interval = setInterval(() => {
        setSessionDuration(Math.floor((Date.now() - sessionStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionStartTime, callState]);

  // Enhanced local media setup
  const startLocalMedia = useCallback(async (audioOnly = false) => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000
        },
        video: audioOnly ? false : {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 60 },
          facingMode: 'user'
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setStatusText('Media ready');
      return stream;
    } catch (error) {
      setStatusText('Camera/microphone access denied');
      setCallState('error');
      toast({
        title: "Media Access Error",
        description: "Please allow camera and microphone access to continue.",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  // Enhanced peer connection setup
  const createPeerConnection = useCallback((peerId: string) => {
    const pc = new RTCPeerConnection(rtcConfig);
    pcRef.current = pc;

    // Add local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('ice', {
          to: peerId,
          candidate: event.candidate
        });
      }
    };

    // Handle remote stream
    pc.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Enhanced connection state handling
    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      console.log('Connection state:', state);

      switch (state) {
        case 'connected':
          setCallState('connected');
          setStatusText('Connected');
          setSessionStartTime(Date.now());
          startStatsCollection();
          toast({
            title: "Connected!",
            description: "You're now connected with your match.",
          });
          break;
        case 'connecting':
          setCallState('connecting');
          setStatusText('Connecting...');
          break;
        case 'disconnected':
          setCallState('reconnecting');
          setStatusText('Connection lost, attempting to reconnect...');
          attemptReconnection();
          break;
        case 'failed':
        case 'closed':
          cleanup();
          setCallState('idle');
          setStatusText('Call ended');
          break;
      }
    };

    // Handle ICE connection state
    pc.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', pc.iceConnectionState);
      if (pc.iceConnectionState === 'failed') {
        toast({
          title: "Connection Issues",
          description: "Experiencing connection problems. Trying to reconnect...",
          variant: "destructive"
        });
      }
    };

    return pc;
  }, [rtcConfig, toast]);

  // Connection quality monitoring
  const startStatsCollection = useCallback(() => {
    if (statsIntervalRef.current) clearInterval(statsIntervalRef.current);
    
    statsIntervalRef.current = setInterval(async () => {
      if (!pcRef.current) return;

      try {
        const stats = await pcRef.current.getStats();
        let bytesReceived = 0;
        let bytesSent = 0;
        let packetsLost = 0;
        let roundTripTime = 0;

        stats.forEach((report) => {
          if (report.type === 'inbound-rtp') {
            bytesReceived += report.bytesReceived || 0;
            packetsLost += report.packetsLost || 0;
          }
          if (report.type === 'outbound-rtp') {
            bytesSent += report.bytesSent || 0;
          }
          if (report.type === 'candidate-pair' && report.state === 'succeeded') {
            roundTripTime = report.currentRoundTripTime || 0;
          }
        });

        // Determine connection quality
        let quality: ConnectionQuality = 'excellent';
        if (packetsLost > 100 || roundTripTime > 0.5) quality = 'poor';
        else if (packetsLost > 50 || roundTripTime > 0.3) quality = 'fair';
        else if (packetsLost > 20 || roundTripTime > 0.15) quality = 'good';

        setConnectionQuality(quality);

        // Send stats to peer
        if (socketRef.current) {
          socketRef.current.emit('connection-quality', {
            quality,
            stats: { bytesReceived, bytesSent, packetsLost, roundTripTime }
          });
        }
      } catch (error) {
        console.error('Stats collection error:', error);
      }
    }, 2000);
  }, []);

  // Reconnection logic
  const attemptReconnection = useCallback(() => {
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('ready', { profile, filters });
        setCallState('waiting');
        setStatusText('Searching for new match...');
        toast({
          title: "Reconnecting",
          description: "Looking for a new match...",
        });
      }
    }, 3000);
  }, [profile, filters, toast]);

  // Socket initialization
  const initializeSocket = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.disconnect();
    }

    const socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      forceNew: true
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setStatusText('Connected to server');
      console.log('Connected to signaling server');
    });

    socket.on('disconnect', (reason) => {
      setStatusText(`Disconnected: ${reason}`);
      setCallState('error');
      toast({
        title: "Connection Lost",
        description: "Lost connection to server. Please try again.",
        variant: "destructive"
      });
    });

    socket.on('waiting', (data) => {
      setCallState('waiting');
      setQueuePosition(data.queuePosition || null);
      setStatusText(`Waiting for match... ${data.queuePosition ? `(Position: ${data.queuePosition})` : ''}`);
    });

    socket.on('matched', async (data) => {
      setStatusText('Match found! Connecting...');
      setCallState('connecting');
      setCurrentPeerId(data.peerId);
      setQueuePosition(null);
      
      toast({
        title: "Match Found!",
        description: `Connected with ${data.peerProfile?.name || 'someone new'}`,
      });
      
      try {
        const pc = createPeerConnection(data.peerId);
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true
        });
        await pc.setLocalDescription(offer);
        socket.emit('offer', { to: data.peerId, sdp: offer });
      } catch (error) {
        console.error('Error creating offer:', error);
        setStatusText('Connection failed');
        setCallState('error');
        toast({
          title: "Connection Failed",
          description: "Failed to establish connection. Please try again.",
          variant: "destructive"
        });
      }
    });

    socket.on('offer', async (data) => {
      setCallState('connecting');
      setStatusText('Incoming call...');
      setCurrentPeerId(data.from);

      try {
        const pc = createPeerConnection(data.from);
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', { to: data.from, sdp: answer });
      } catch (error) {
        console.error('Error handling offer:', error);
        setStatusText('Connection failed');
        setCallState('error');
      }
    });

    socket.on('answer', async (data) => {
      try {
        if (pcRef.current) {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
        }
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    });

    socket.on('ice', async (data) => {
      try {
        if (pcRef.current) {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
      } catch (error) {
        console.warn('Error adding ICE candidate:', error);
      }
    });

    socket.on('chat-message', (data) => {
      setChatMessages(prev => [...prev, {
        from: data.from,
        message: data.message,
        timestamp: data.timestamp,
        isOwn: false
      }]);
      
      if (!showChat) {
        setUnreadMessages(prev => prev + 1);
      }
    });

    socket.on('peer-connection-quality', (data) => {
      console.log('Peer connection quality:', data.quality);
    });

    socket.on('peer-disconnected', (data) => {
      setStatusText('Peer disconnected');
      cleanup();
      setCallState('idle');
      toast({
        title: "Call Ended",
        description: `Session lasted ${formatDuration(data.sessionDuration / 1000)}`,
      });
    });

    socket.on('reported', (data) => {
      toast({
        title: "Report Submitted",
        description: "Thank you for helping keep our community safe.",
      });
    });

    socket.on('blocked', (data) => {
      toast({
        title: "User Blocked",
        description: "You won't be matched with this user again.",
      });
    });

    socket.on('error', (error) => {
      setStatusText(`Error: ${error.message}`);
      setCallState('error');
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    });
  }, [createPeerConnection, profile, filters, showChat, toast, serverUrl]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
      statsIntervalRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    setSessionStartTime(null);
    setSessionDuration(0);
    setConnectionQuality('unknown');
    setChatMessages([]);
    setCurrentPeerId(null);
    setQueuePosition(null);
    setUnreadMessages(0);
  }, []);

  // Media control functions
  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(prev => !prev);
      
      toast({
        title: isMuted ? "Microphone On" : "Microphone Off",
        description: isMuted ? "You can now speak" : "You are now muted",
      });
    }
  }, [isMuted, toast]);

  const toggleCamera = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCameraOff(prev => !prev);
      
      toast({
        title: isCameraOff ? "Camera On" : "Camera Off",
        description: isCameraOff ? "Your video is now visible" : "Your video is now hidden",
      });
    }
  }, [isCameraOff, toast]);

  const toggleScreenShare = useCallback(async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { mediaSource: 'screen' },
          audio: true
        });
        
        const videoTrack = screenStream.getVideoTracks()[0];
        if (pcRef.current) {
          const sender = pcRef.current.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          if (sender) {
            await sender.replaceTrack(videoTrack);
          }
        }

        videoTrack.onended = () => {
          setIsScreenSharing(false);
          // Switch back to camera
          if (localStreamRef.current) {
            const cameraTrack = localStreamRef.current.getVideoTracks()[0];
            if (pcRef.current && cameraTrack) {
              const sender = pcRef.current.getSenders().find(s => 
                s.track && s.track.kind === 'video'
              );
              if (sender) {
                sender.replaceTrack(cameraTrack);
              }
            }
          }
        };

        setIsScreenSharing(true);
        toast({
          title: "Screen Sharing Started",
          description: "Your screen is now being shared",
        });
      } else {
        // Switch back to camera
        if (localStreamRef.current && pcRef.current) {
          const cameraTrack = localStreamRef.current.getVideoTracks()[0];
          const sender = pcRef.current.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          if (sender && cameraTrack) {
            await sender.replaceTrack(cameraTrack);
          }
        }
        setIsScreenSharing(false);
        toast({
          title: "Screen Sharing Stopped",
          description: "Switched back to camera view",
        });
      }
    } catch (error) {
      console.error('Screen sharing error:', error);
      toast({
        title: "Screen Share Error",
        description: "Failed to start screen sharing",
        variant: "destructive"
      });
    }
  }, [isScreenSharing, toast]);

  // Chat functions
  const sendMessage = useCallback(() => {
    if (!newMessage.trim() || !socketRef.current || callState !== 'connected') return;

    const message: ChatMessage = {
      from: 'me',
      message: newMessage,
      timestamp: Date.now(),
      isOwn: true
    };

    setChatMessages(prev => [...prev, message]);
    socketRef.current.emit('chat-message', { message: newMessage });
    setNewMessage('');
  }, [newMessage, callState]);

  // Main control functions
  const startCall = useCallback(async () => {
    try {
      setCallState('connecting');
      setStatusText('Initializing...');
      
      await startLocalMedia();
      initializeSocket();
      
      if (socketRef.current) {
        socketRef.current.emit('ready', { profile, filters });
        setCallState('waiting');
        setStatusText('Searching for match...');
      }
    } catch (error) {
      console.error('Start call error:', error);
      setStatusText('Failed to start - check permissions');
      setCallState('error');
    }
  }, [startLocalMedia, initializeSocket, profile, filters]);

  const endCall = useCallback(() => {
    cleanup();
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setCallState('idle');
    setStatusText('Ready to connect');
    
    if (onEndCall) {
      onEndCall();
    }
  }, [cleanup, onEndCall]);

  const skipToNext = useCallback(() => {
    cleanup();
    
    if (socketRef.current?.connected) {
      socketRef.current.emit('ready', { profile, filters });
      setCallState('waiting');
      setStatusText('Searching for next match...');
      
      toast({
        title: "Finding Next Match",
        description: "Looking for someone new to chat with...",
      });
    }
  }, [cleanup, profile, filters, toast]);

  // Reporting and blocking
  const reportUser = useCallback((reason: string, details?: string) => {
    if (socketRef.current && currentPeerId) {
      socketRef.current.emit('report', { 
        target: currentPeerId,
        reason, 
        details 
      });
      setStatusText('User reported');
    }
  }, [currentPeerId]);

  const blockUser = useCallback(() => {
    if (socketRef.current && currentPeerId) {
      socketRef.current.emit('block', { target: currentPeerId });
      setStatusText('User blocked');
      skipToNext();
    }
  }, [currentPeerId, skipToNext]);

  // Format session duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get connection quality color
  const getQualityColor = (quality: ConnectionQuality) => {
    switch (quality) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'fair': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  // Get quality indicator
  const getQualityIndicator = (quality: ConnectionQuality) => {
    switch (quality) {
      case 'excellent': return '●●●●';
      case 'good': return '●●●○';
      case 'fair': return '●●○○';
      case 'poor': return '●○○○';
      default: return '○○○○';
    }
  };

  // Handle chat toggle
  const toggleChat = useCallback(() => {
    setShowChat(prev => !prev);
    if (!showChat) {
      setUnreadMessages(0);
    }
  }, [showChat]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [cleanup]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 safe-area-top safe-area-bottom">
      <div className="w-full max-w-7xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                onClick={onBack}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 font-dancing">AjnabiCam Enhanced</h1>
              <p className="text-white/70 font-poppins">Connect with strangers worldwide</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-white">
            {sessionDuration > 0 && (
              <div className="bg-white/20 px-4 py-2 rounded-full flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-mono">{formatDuration(sessionDuration)}</span>
              </div>
            )}
            
            <div className={`flex items-center gap-2 ${getQualityColor(connectionQuality)}`}>
              <Signal className="w-4 h-4" />
              <span className="text-sm font-mono">{getQualityIndicator(connectionQuality)}</span>
              <span className="capitalize text-sm">{connectionQuality}</span>
            </div>
            
            <Badge className={`px-4 py-2 text-sm font-medium ${
              callState === 'connected' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
              callState === 'waiting' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
              callState === 'connecting' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
              'bg-gray-500/20 text-gray-300 border-gray-500/30'
            }`}>
              {callState.toUpperCase()}
            </Badge>

            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Video Section */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Main Video Container */}
            <div className="relative bg-black/50 rounded-2xl overflow-hidden aspect-video">
              {/* Remote Video */}
              <video 
                ref={remoteVideoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
                style={{ display: callState === 'connected' ? 'block' : 'none' }}
              />
              
              {/* Placeholder when not connected */}
              {callState !== 'connected' && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                      {callState === 'waiting' ? (
                        <div className="animate-spin w-8 h-8 border-4 border-white/30 border-t-white rounded-full" />
                      ) : callState === 'connecting' ? (
                        <div className="animate-pulse">
                          <Users className="w-16 h-16" />
                        </div>
                      ) : (
                        <Users className="w-16 h-16" />
                      )}
                    </div>
                    <p className="text-lg font-medium font-poppins">{statusText}</p>
                    {queuePosition && (
                      <p className="text-sm text-white/70 mt-2 font-poppins">
                        Position in queue: {queuePosition}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Local Video (Picture-in-Picture) */}
              <div className="absolute top-4 right-4 w-48 h-36 bg-black/50 rounded-xl overflow-hidden border-2 border-white/30">
                <video 
                  ref={localVideoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover"
                />
                {isCameraOff && (
                  <div className="absolute inset-0 flex items-center justify-center text-white bg-black/70">
                    <CameraOff className="w-8 h-8" />
                  </div>
                )}
                {isScreenSharing && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-poppins">
                    Sharing
                  </div>
                )}
              </div>

              {/* Controls Overlay */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3">
                
                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  size="icon"
                  className={`w-12 h-12 rounded-full transition-all ${
                    isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'
                  } text-white backdrop-blur-sm`}
                  disabled={callState === 'idle'}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>

                <Button
                  onClick={toggleCamera}
                  variant="ghost"
                  size="icon"
                  className={`w-12 h-12 rounded-full transition-all ${
                    isCameraOff ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'
                  } text-white backdrop-blur-sm`}
                  disabled={callState === 'idle'}
                >
                  {isCameraOff ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                </Button>

                <Button
                  onClick={toggleScreenShare}
                  variant="ghost"
                  size="icon"
                  className={`w-12 h-12 rounded-full transition-all ${
                    isScreenSharing ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white/20 hover:bg-white/30'
                  } text-white backdrop-blur-sm`}
                  disabled={callState !== 'connected'}
                >
                  {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                </Button>

                <Button
                  onClick={toggleChat}
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all relative"
                  disabled={callState !== 'connected'}
                >
                  <MessageCircle className="w-5 h-5" />
                  {unreadMessages > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-poppins">
                      {unreadMessages}
                    </div>
                  )}
                </Button>

                {callState === 'connected' && (
                  <Button
                    onClick={skipToNext}
                    variant="ghost"
                    size="icon"
                    className="w-12 h-12 rounded-full bg-purple-500 hover:bg-purple-600 text-white backdrop-blur-sm transition-all"
                  >
                    <SkipForward className="w-5 h-5" />
                  </Button>
                )}

                <Button
                  onClick={callState === 'idle' ? startCall : endCall}
                  variant="ghost"
                  size="icon"
                  className={`w-14 h-14 rounded-full transition-all text-white backdrop-blur-sm ${
                    callState === 'idle' 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {callState === 'idle' ? <Camera className="w-6 h-6" /> : <PhoneOff className="w-6 h-6" />}
                </Button>
              </div>
            </div>

            {/* Chat Panel */}
            {showChat && callState === 'connected' && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-semibold font-poppins">Chat</h3>
                    <Button 
                      onClick={() => setShowChat(false)}
                      variant="ghost"
                      size="icon"
                      className="text-white/70 hover:text-white hover:bg-white/20 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="h-32 overflow-y-auto mb-4 space-y-2 scrollbar-hide">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`px-3 py-2 rounded-lg max-w-xs ${
                          msg.isOwn 
                            ? 'bg-purple-500 text-white' 
                            : 'bg-white/20 text-white'
                        }`}>
                          <p className="text-sm font-poppins">{msg.message}</p>
                          <p className="text-xs opacity-70 mt-1 font-poppins">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 bg-white/10 border-white/30 text-white placeholder-white/50 focus:ring-purple-500 rounded-full font-poppins"
                      maxLength={500}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      variant="gradient"
                      className="rounded-full px-6 font-poppins"
                    >
                      Send
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            
            {/* Profile Card */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-3 font-poppins">Your Profile</h3>
                
                <div className="space-y-3">
                  <Input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-white/10 border-white/30 text-white placeholder-white/50 focus:ring-purple-500 font-poppins"
                    placeholder="Your name"
                    maxLength={50}
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      value={profile.age}
                      onChange={(e) => setProfile(prev => ({ ...prev, age: parseInt(e.target.value) || 18 }))}
                      min="18"
                      max="100"
                      className="bg-white/10 border-white/30 text-white focus:ring-purple-500 font-poppins"
                    />
                    
                    <select
                      value={profile.gender}
                      onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value as any }))}
                      className="px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-poppins"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    className="bg-white/10 border-white/30 text-white placeholder-white/50 focus:ring-purple-500 resize-none font-poppins"
                    placeholder="Tell others about yourself..."
                    maxLength={200}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-3 font-poppins">Match Preferences</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-white/70 text-sm block mb-1 font-poppins">Gender Preference</label>
                    <select
                      value={filters.genderPref}
                      onChange={(e) => setFilters(prev => ({ ...prev, genderPref: e.target.value as any }))}
                      className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-poppins"
                    >
                      <option value="any">Any</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-white/70 text-sm block mb-1 font-poppins">Age Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        value={filters.ageMin}
                        onChange={(e) => setFilters(prev => ({ ...prev, ageMin: parseInt(e.target.value) || 18 }))}
                        min="18"
                        max="100"
                        className="bg-white/10 border-white/30 text-white focus:ring-purple-500 font-poppins"
                        placeholder="Min"
                      />
                      <Input
                        type="number"
                        value={filters.ageMax}
                        onChange={(e) => setFilters(prev => ({ ...prev, ageMax: parseInt(e.target.value) || 100 }))}
                        min="18"
                        max="100"
                        className="bg-white/10 border-white/30 text-white focus:ring-purple-500 font-poppins"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {callState === 'connected' && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold mb-3 font-poppins">Actions</h3>
                  
                  <div className="space-y-2">
                    <Button
                      onClick={() => reportUser('inappropriate', 'Inappropriate behavior')}
                      variant="outline"
                      className="w-full border-orange-500/50 text-orange-300 hover:bg-orange-500/20 font-poppins"
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      Report User
                    </Button>
                    
                    <Button
                      onClick={blockUser}
                      variant="outline"
                      className="w-full border-red-500/50 text-red-300 hover:bg-red-500/20 font-poppins"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Block & Skip
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Statistics */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-3 font-poppins">Session Stats</h3>
                
                <div className="space-y-2 text-sm text-white/70">
                  <div className="flex justify-between">
                    <span className="font-poppins">Status:</span>
                    <span className="text-white capitalize font-poppins">{callState}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-poppins">Quality:</span>
                    <span className={getQualityColor(connectionQuality) + ' capitalize font-poppins'}>{connectionQuality}</span>
                  </div>
                  {sessionDuration > 0 && (
                    <div className="flex justify-between">
                      <span className="font-poppins">Duration:</span>
                      <span className="text-white font-mono">{formatDuration(sessionDuration)}</span>
                    </div>
                  )}
                  {queuePosition && (
                    <div className="flex justify-between">
                      <span className="font-poppins">Queue:</span>
                      <span className="text-white font-poppins">#{queuePosition}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Settings Panel */}
            {showSettings && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-white font-semibold font-poppins">Settings</h3>
                    <Button
                      onClick={() => setShowSettings(false)}
                      variant="ghost"
                      size="icon"
                      className="text-white/70 hover:text-white hover:bg-white/20 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-white/70">
                      <span className="font-poppins">Server:</span>
                      <span className="text-white font-poppins">{serverUrl}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span className="font-poppins">WebRTC:</span>
                      <span className="text-white font-poppins">
                        {pcRef.current ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span className="font-poppins">Socket:</span>
                      <span className="text-white font-poppins">
                        {socketRef.current?.connected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}