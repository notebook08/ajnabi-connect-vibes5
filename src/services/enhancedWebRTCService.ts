export interface MediaConstraintsConfig {
  audio: {
    echoCancellation: boolean;
    noiseSuppression: boolean;
    autoGainControl: boolean;
    sampleRate: number;
  };
  video: {
    width: { ideal: number; max: number };
    height: { ideal: number; max: number };
    frameRate: { ideal: number; max: number };
    facingMode: string;
  };
}

export interface ConnectionQualityMetrics {
  bytesReceived: number;
  bytesSent: number;
  packetsLost: number;
  roundTripTime: number;
  jitter: number;
  audioLevel: number;
  videoFramesDecoded: number;
  videoFramesDropped: number;
}

export type ConnectionQuality = 'excellent' | 'good' | 'fair' | 'poor' | 'unknown';

export class EnhancedWebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private statsInterval: NodeJS.Timeout | null = null;
  private qualityCallback: ((quality: ConnectionQuality, metrics: ConnectionQualityMetrics) => void) | null = null;

  // Enhanced RTC configuration
  private readonly rtcConfig: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' }
    ],
    iceCandidatePoolSize: 10,
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require'
  };

  // Default media constraints
  private readonly defaultConstraints: MediaConstraintsConfig = {
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      sampleRate: 48000
    },
    video: {
      width: { ideal: 1280, max: 1920 },
      height: { ideal: 720, max: 1080 },
      frameRate: { ideal: 30, max: 60 },
      facingMode: 'user'
    }
  };

  // Initialize local media with enhanced constraints
  async initializeLocalMedia(audioOnly = false, customConstraints?: Partial<MediaConstraintsConfig>): Promise<MediaStream> {
    try {
      const constraints = { ...this.defaultConstraints, ...customConstraints };
      
      const mediaConstraints: MediaStreamConstraints = {
        audio: constraints.audio,
        video: audioOnly ? false : constraints.video
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      return this.localStream;
    } catch (error) {
      console.error('Failed to get local media:', error);
      throw new Error('Failed to access camera/microphone. Please check permissions.');
    }
  }

  // Create peer connection with enhanced event handling
  createPeerConnection(
    onIceCandidate: (candidate: RTCIceCandidate) => void,
    onRemoteStream: (stream: MediaStream) => void,
    onConnectionStateChange: (state: RTCPeerConnectionState) => void
  ): RTCPeerConnection {
    this.peerConnection = new RTCPeerConnection(this.rtcConfig);

    // Add local tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        this.peerConnection!.addTrack(track, this.localStream!);
      });
    }

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        onIceCandidate(event.candidate);
      }
    };

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      if (event.streams[0]) {
        this.remoteStream = event.streams[0];
        onRemoteStream(event.streams[0]);
      }
    };

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      onConnectionStateChange(this.peerConnection!.connectionState);
    };

    // Handle ICE connection state
    this.peerConnection.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', this.peerConnection!.iceConnectionState);
      
      if (this.peerConnection!.iceConnectionState === 'connected') {
        this.startQualityMonitoring();
      } else if (this.peerConnection!.iceConnectionState === 'failed') {
        this.stopQualityMonitoring();
      }
    };

    return this.peerConnection;
  }

  // Create offer
  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    const offer = await this.peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });

    await this.peerConnection.setLocalDescription(offer);
    return offer;
  }

  // Create answer
  async createAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    return answer;
  }

  // Handle answer
  async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }

  // Add ICE candidate
  async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.warn('Error adding ICE candidate:', error);
    }
  }

  // Media control methods
  toggleAudio(): boolean {
    if (!this.localStream) return false;
    
    const audioTracks = this.localStream.getAudioTracks();
    audioTracks.forEach(track => {
      track.enabled = !track.enabled;
    });
    
    return audioTracks.length > 0 ? !audioTracks[0].enabled : false;
  }

  toggleVideo(): boolean {
    if (!this.localStream) return false;
    
    const videoTracks = this.localStream.getVideoTracks();
    videoTracks.forEach(track => {
      track.enabled = !track.enabled;
    });
    
    return videoTracks.length > 0 ? !videoTracks[0].enabled : false;
  }

  // Screen sharing
  async startScreenShare(): Promise<MediaStream> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' },
        audio: true
      });

      if (this.peerConnection) {
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = this.peerConnection.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        
        if (sender) {
          await sender.replaceTrack(videoTrack);
        }

        // Handle screen share end
        videoTrack.onended = () => {
          this.stopScreenShare();
        };
      }

      return screenStream;
    } catch (error) {
      console.error('Screen sharing error:', error);
      throw new Error('Failed to start screen sharing');
    }
  }

  async stopScreenShare(): Promise<void> {
    if (!this.localStream || !this.peerConnection) return;

    const cameraTrack = this.localStream.getVideoTracks()[0];
    if (cameraTrack) {
      const sender = this.peerConnection.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );
      
      if (sender) {
        await sender.replaceTrack(cameraTrack);
      }
    }
  }

  // Quality monitoring
  startQualityMonitoring(callback?: (quality: ConnectionQuality, metrics: ConnectionQualityMetrics) => void): void {
    this.qualityCallback = callback || null;
    
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
    }

    this.statsInterval = setInterval(async () => {
      if (!this.peerConnection) return;

      try {
        const stats = await this.peerConnection.getStats();
        const metrics = this.parseConnectionStats(stats);
        const quality = this.calculateConnectionQuality(metrics);
        
        if (this.qualityCallback) {
          this.qualityCallback(quality, metrics);
        }
      } catch (error) {
        console.error('Stats collection error:', error);
      }
    }, 2000);
  }

  stopQualityMonitoring(): void {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
      this.statsInterval = null;
    }
  }

  // Parse WebRTC stats
  private parseConnectionStats(stats: RTCStatsReport): ConnectionQualityMetrics {
    let bytesReceived = 0;
    let bytesSent = 0;
    let packetsLost = 0;
    let roundTripTime = 0;
    let jitter = 0;
    let audioLevel = 0;
    let videoFramesDecoded = 0;
    let videoFramesDropped = 0;

    stats.forEach((report) => {
      switch (report.type) {
        case 'inbound-rtp':
          if (report.mediaType === 'video') {
            bytesReceived += report.bytesReceived || 0;
            packetsLost += report.packetsLost || 0;
            jitter += report.jitter || 0;
            videoFramesDecoded += report.framesDecoded || 0;
            videoFramesDropped += report.framesDropped || 0;
          } else if (report.mediaType === 'audio') {
            audioLevel = report.audioLevel || 0;
          }
          break;
        case 'outbound-rtp':
          bytesSent += report.bytesSent || 0;
          break;
        case 'candidate-pair':
          if (report.state === 'succeeded') {
            roundTripTime = report.currentRoundTripTime || 0;
          }
          break;
      }
    });

    return {
      bytesReceived,
      bytesSent,
      packetsLost,
      roundTripTime,
      jitter,
      audioLevel,
      videoFramesDecoded,
      videoFramesDropped
    };
  }

  // Calculate connection quality based on metrics
  private calculateConnectionQuality(metrics: ConnectionQualityMetrics): ConnectionQuality {
    let score = 100;

    // Penalize based on packet loss
    if (metrics.packetsLost > 100) score -= 40;
    else if (metrics.packetsLost > 50) score -= 25;
    else if (metrics.packetsLost > 20) score -= 15;

    // Penalize based on round trip time
    if (metrics.roundTripTime > 0.5) score -= 30;
    else if (metrics.roundTripTime > 0.3) score -= 20;
    else if (metrics.roundTripTime > 0.15) score -= 10;

    // Penalize based on jitter
    if (metrics.jitter > 0.1) score -= 20;
    else if (metrics.jitter > 0.05) score -= 10;

    // Penalize based on dropped frames
    const dropRate = metrics.videoFramesDropped / (metrics.videoFramesDecoded + metrics.videoFramesDropped);
    if (dropRate > 0.1) score -= 25;
    else if (dropRate > 0.05) score -= 15;

    // Determine quality level
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  }

  // Get current streams
  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  // Cleanup
  cleanup(): void {
    this.stopQualityMonitoring();
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.remoteStream = null;
  }

  // Get connection statistics
  async getDetailedStats(): Promise<RTCStatsReport | null> {
    if (!this.peerConnection) return null;
    
    try {
      return await this.peerConnection.getStats();
    } catch (error) {
      console.error('Failed to get stats:', error);
      return null;
    }
  }
}