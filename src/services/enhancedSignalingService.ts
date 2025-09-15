import { io, Socket } from 'socket.io-client';

export interface UserProfile {
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

export interface MatchFilters {
  genderPref: 'any' | 'male' | 'female' | 'other';
  ageMin: number;
  ageMax: number;
  location?: string;
  interests?: string[];
}

export interface ChatMessage {
  from: string;
  message: string;
  timestamp: number;
  isOwn?: boolean;
}

export interface ConnectionStats {
  bytesReceived: number;
  bytesSent: number;
  packetsLost: number;
  roundTripTime: number;
}

export interface MatchData {
  peerId: string;
  peerProfile: UserProfile;
  matchScore: number;
}

export interface SignalingEvents {
  // Connection events
  connect: () => void;
  disconnect: (reason: string) => void;
  
  // Matching events
  waiting: (data: { queuePosition?: number }) => void;
  matched: (data: MatchData) => void;
  
  // WebRTC signaling
  offer: (data: { from: string; sdp: RTCSessionDescriptionInit; timestamp: number }) => void;
  answer: (data: { from: string; sdp: RTCSessionDescriptionInit; timestamp: number }) => void;
  ice: (data: { from: string; candidate: RTCIceCandidateInit }) => void;
  
  // Chat events
  'chat-message': (data: { from: string; message: string; timestamp: number }) => void;
  
  // Quality monitoring
  'peer-connection-quality': (data: { from: string; quality: string; stats: ConnectionStats }) => void;
  
  // Session events
  'peer-disconnected': (data: { id: string; sessionDuration: number }) => void;
  
  // Feedback events
  reported: (data: { target: string }) => void;
  blocked: (data: { target: string }) => void;
  
  // Error handling
  error: (error: { message: string; details?: any }) => void;
}

export class EnhancedSignalingService {
  private socket: Socket | null = null;
  private serverUrl: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(serverUrl: string = 'http://localhost:3000') {
    this.serverUrl = serverUrl;
  }

  // Initialize connection with enhanced error handling
  connect(): Promise<Socket> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve(this.socket);
        return;
      }

      this.socket = io(this.serverUrl, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay
      });

      this.socket.on('connect', () => {
        console.log('Connected to signaling server');
        this.reconnectAttempts = 0;
        resolve(this.socket!);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        this.reconnectAttempts++;
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          reject(new Error('Failed to connect to signaling server'));
        }
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected from server:', reason);
        
        if (reason === 'io server disconnect') {
          // Server initiated disconnect, try to reconnect
          this.reconnect();
        }
      });
    });
  }

  // Enhanced reconnection logic
  private async reconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff
    
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);
    
    setTimeout(() => {
      this.connect().catch(console.error);
    }, delay);
  }

  // Join matching queue
  joinQueue(profile: UserProfile, filters: MatchFilters): void {
    if (!this.socket?.connected) {
      throw new Error('Not connected to signaling server');
    }

    // Validate profile data
    if (!profile.name || profile.name.length > 50) {
      throw new Error('Invalid profile name');
    }

    if (profile.age < 18 || profile.age > 100) {
      throw new Error('Invalid age');
    }

    this.socket.emit('ready', { profile, filters });
  }

  // WebRTC signaling methods
  sendOffer(peerId: string, sdp: RTCSessionDescriptionInit): void {
    if (!this.socket?.connected) return;
    this.socket.emit('offer', { to: peerId, sdp });
  }

  sendAnswer(peerId: string, sdp: RTCSessionDescriptionInit): void {
    if (!this.socket?.connected) return;
    this.socket.emit('answer', { to: peerId, sdp });
  }

  sendIceCandidate(peerId: string, candidate: RTCIceCandidateInit): void {
    if (!this.socket?.connected) return;
    this.socket.emit('ice', { to: peerId, candidate });
  }

  // Chat messaging
  sendChatMessage(message: string): void {
    if (!this.socket?.connected) return;
    if (!message || message.length > 500) {
      throw new Error('Invalid message');
    }
    this.socket.emit('chat-message', { message });
  }

  // Connection quality reporting
  reportConnectionQuality(quality: string, stats: ConnectionStats): void {
    if (!this.socket?.connected) return;
    this.socket.emit('connection-quality', { quality, stats });
  }

  // Reporting and blocking
  reportUser(target: string, reason: string, details?: string): void {
    if (!this.socket?.connected) return;
    
    const validReasons = ['inappropriate', 'spam', 'harassment', 'fake-profile', 'other'];
    if (!validReasons.includes(reason)) {
      throw new Error('Invalid report reason');
    }

    this.socket.emit('report', { target, reason, details });
  }

  blockUser(target: string): void {
    if (!this.socket?.connected) return;
    this.socket.emit('block', { target });
  }

  // Event listeners
  on<K extends keyof SignalingEvents>(event: K, listener: SignalingEvents[K]): void {
    if (!this.socket) return;
    this.socket.on(event, listener);
  }

  off<K extends keyof SignalingEvents>(event: K, listener?: SignalingEvents[K]): void {
    if (!this.socket) return;
    if (listener) {
      this.socket.off(event, listener);
    } else {
      this.socket.off(event);
    }
  }

  // Disconnect and cleanup
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.reconnectAttempts = 0;
  }

  // Get connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Get socket ID
  getSocketId(): string | null {
    return this.socket?.id || null;
  }
}