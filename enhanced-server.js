const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

const server = http.createServer(app);
const io = new Server(server, { 
  cors: { 
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Enhanced data structures
const activeConnections = new Map(); // socketId -> { profile, filters, matchedWith, sessionStart, lastSeen }
const waitingQueue = new Map(); // socketId -> { profile, filters, queueTime, priority }
const blockedPairs = new Set(); // Set of "userId1|userId2" pairs
const reports = []; // Array of report objects
const sessionStats = new Map(); // socketId -> { duration, quality, messages }

// Enhanced validation functions
function validateProfile(profile) {
  if (!profile) return { valid: false, error: 'Profile is required' };
  if (!profile.name || profile.name.length < 1 || profile.name.length > 50) {
    return { valid: false, error: 'Name must be 1-50 characters' };
  }
  if (!profile.age || profile.age < 18 || profile.age > 100) {
    return { valid: false, error: 'Age must be between 18-100' };
  }
  if (!['male', 'female', 'other'].includes(profile.gender)) {
    return { valid: false, error: 'Invalid gender' };
  }
  if (profile.bio && profile.bio.length > 200) {
    return { valid: false, error: 'Bio must be under 200 characters' };
  }
  return { valid: true };
}

function validateFilters(filters) {
  if (!filters) return { valid: false, error: 'Filters are required' };
  if (!['any', 'male', 'female', 'other'].includes(filters.genderPref)) {
    return { valid: false, error: 'Invalid gender preference' };
  }
  if (filters.ageMin < 18 || filters.ageMax > 100 || filters.ageMin > filters.ageMax) {
    return { valid: false, error: 'Invalid age range' };
  }
  return { valid: true };
}

// Enhanced matching algorithm with scoring
function calculateMatchScore(userA, userB) {
  let score = 0;
  const { profile: profileA, filters: filtersA } = userA;
  const { profile: profileB, filters: filtersB } = userB;

  // Gender preference matching (high weight)
  if (filtersA.genderPref === 'any' || filtersA.genderPref === profileB.gender) score += 30;
  if (filtersB.genderPref === 'any' || filtersB.genderPref === profileA.gender) score += 30;

  // Age range matching (medium weight)
  if (profileA.age >= filtersB.ageMin && profileA.age <= filtersB.ageMax) score += 20;
  if (profileB.age >= filtersA.ageMin && profileB.age <= filtersA.ageMax) score += 20;

  // Common interests (medium weight)
  if (profileA.interests && profileB.interests) {
    const commonInterests = profileA.interests.filter(i => profileB.interests.includes(i));
    score += commonInterests.length * 10;
  }

  // Location proximity (low weight)
  if (profileA.location?.country === profileB.location?.country) score += 15;
  if (profileA.location?.city === profileB.location?.city) score += 10;

  // Queue time bonus (encourages matching for waiting users)
  const waitTimeA = Date.now() - (userA.queueTime || Date.now());
  const waitTimeB = Date.now() - (userB.queueTime || Date.now());
  const avgWaitTime = (waitTimeA + waitTimeB) / 2;
  score += Math.min(avgWaitTime / 10000, 20); // Max 20 points for wait time

  return score;
}

function findBestMatch(newUser) {
  let bestMatch = null;
  let bestScore = 50; // Minimum threshold for matching

  for (const [socketId, candidate] of waitingQueue) {
    // Skip if users have blocked each other
    const pairKey = [newUser.socketId, socketId].sort().join('|');
    if (blockedPairs.has(pairKey)) continue;

    const score = calculateMatchScore(newUser, candidate);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = { socketId, ...candidate, matchScore: score };
    }
  }

  return bestMatch;
}

// Rate limiting middleware
const rateLimitMap = new Map();
function rateLimit(socketId, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(socketId) || [];
  
  // Remove old requests outside the window
  const validRequests = userRequests.filter(time => now - time < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return false; // Rate limit exceeded
  }
  
  validRequests.push(now);
  rateLimitMap.set(socketId, validRequests);
  return true;
}

// Socket.io connection handling with enhanced security
io.use((socket, next) => {
  // Basic rate limiting
  if (!rateLimit(socket.handshake.address, 5, 60000)) {
    return next(new Error('Rate limit exceeded'));
  }
  next();
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id} from ${socket.handshake.address}`);
  
  // Initialize session stats
  sessionStats.set(socket.id, {
    connectTime: Date.now(),
    messageCount: 0,
    quality: 'unknown'
  });

  socket.on('ready', async (payload) => {
    try {
      // Rate limiting for ready events
      if (!rateLimit(socket.id, 3, 10000)) {
        socket.emit('error', { message: 'Too many requests. Please wait.' });
        return;
      }

      // Validate input
      const profileValidation = validateProfile(payload.profile);
      if (!profileValidation.valid) {
        socket.emit('error', { message: profileValidation.error });
        return;
      }

      const filtersValidation = validateFilters(payload.filters);
      if (!filtersValidation.valid) {
        socket.emit('error', { message: filtersValidation.error });
        return;
      }

      // Remove from existing queue if present
      waitingQueue.delete(socket.id);
      
      const userData = {
        socketId: socket.id,
        profile: payload.profile,
        filters: payload.filters,
        queueTime: Date.now(),
        priority: 0 // Can be used for premium users
      };

      // Try to find a match
      const match = findBestMatch(userData);
      
      if (match) {
        // Remove matched user from queue
        waitingQueue.delete(match.socketId);
        
        // Store active connections
        const sessionStart = Date.now();
        activeConnections.set(socket.id, { 
          ...userData, 
          matchedWith: match.socketId, 
          sessionStart,
          lastSeen: sessionStart
        });
        activeConnections.set(match.socketId, { 
          ...match, 
          matchedWith: socket.id, 
          sessionStart,
          lastSeen: sessionStart
        });
        
        // Notify both users with match details
        socket.emit('matched', { 
          peerId: match.socketId, 
          peerProfile: match.profile,
          matchScore: match.matchScore
        });
        
        io.to(match.socketId).emit('matched', { 
          peerId: socket.id, 
          peerProfile: payload.profile,
          matchScore: match.matchScore
        });
        
        console.log(`Match found: ${socket.id} <-> ${match.socketId} (Score: ${match.matchScore})`);
      } else {
        // Add to waiting queue with position
        waitingQueue.set(socket.id, userData);
        const queuePosition = Array.from(waitingQueue.keys()).indexOf(socket.id) + 1;
        socket.emit('waiting', { queuePosition });
        console.log(`User ${socket.id} added to queue (position: ${queuePosition})`);
      }
    } catch (error) {
      console.error('Ready event error:', error);
      socket.emit('error', { message: 'Server error occurred' });
    }
  });

  // Enhanced signaling with validation
  socket.on('offer', (data) => {
    if (!data.to || !data.sdp) {
      socket.emit('error', { message: 'Invalid offer data' });
      return;
    }

    // Verify the connection exists
    const connection = activeConnections.get(socket.id);
    if (!connection || connection.matchedWith !== data.to) {
      socket.emit('error', { message: 'Invalid connection state' });
      return;
    }

    io.to(data.to).emit('offer', { 
      from: socket.id, 
      sdp: data.sdp,
      timestamp: Date.now()
    });
    console.log(`Offer relayed: ${socket.id} -> ${data.to}`);
  });

  socket.on('answer', (data) => {
    if (!data.to || !data.sdp) {
      socket.emit('error', { message: 'Invalid answer data' });
      return;
    }

    const connection = activeConnections.get(socket.id);
    if (!connection || connection.matchedWith !== data.to) {
      socket.emit('error', { message: 'Invalid connection state' });
      return;
    }

    io.to(data.to).emit('answer', { 
      from: socket.id, 
      sdp: data.sdp,
      timestamp: Date.now()
    });
    console.log(`Answer relayed: ${socket.id} -> ${data.to}`);
  });

  socket.on('ice', (data) => {
    if (!data.to || !data.candidate) {
      socket.emit('error', { message: 'Invalid ICE candidate' });
      return;
    }

    const connection = activeConnections.get(socket.id);
    if (!connection || connection.matchedWith !== data.to) {
      socket.emit('error', { message: 'Invalid connection state' });
      return;
    }

    io.to(data.to).emit('ice', { 
      from: socket.id, 
      candidate: data.candidate 
    });
  });

  // Enhanced chat messaging with validation
  socket.on('chat-message', (data) => {
    const connection = activeConnections.get(socket.id);
    if (!connection || !connection.matchedWith) {
      socket.emit('error', { message: 'Not in active call' });
      return;
    }
    
    if (!data.message || typeof data.message !== 'string' || data.message.length > 500) {
      socket.emit('error', { message: 'Invalid message' });
      return;
    }

    // Rate limiting for messages
    if (!rateLimit(socket.id + '_msg', 30, 60000)) {
      socket.emit('error', { message: 'Message rate limit exceeded' });
      return;
    }

    // Update session stats
    const stats = sessionStats.get(socket.id);
    if (stats) {
      stats.messageCount++;
    }

    io.to(connection.matchedWith).emit('chat-message', {
      from: socket.id,
      message: data.message,
      timestamp: Date.now()
    });

    console.log(`Message relayed: ${socket.id} -> ${connection.matchedWith}`);
  });

  // Connection quality reporting
  socket.on('connection-quality', (data) => {
    const connection = activeConnections.get(socket.id);
    if (connection && connection.matchedWith) {
      // Update session stats
      const stats = sessionStats.get(socket.id);
      if (stats) {
        stats.quality = data.quality;
      }

      io.to(connection.matchedWith).emit('peer-connection-quality', {
        from: socket.id,
        quality: data.quality,
        stats: data.stats
      });
    }
  });

  // Enhanced reporting system with validation
  socket.on('report', (data) => {
    const validReasons = ['inappropriate', 'spam', 'harassment', 'fake-profile', 'other'];
    
    if (!data.target || !data.reason || !validReasons.includes(data.reason)) {
      socket.emit('error', { message: 'Invalid report data' });
      return;
    }

    if (data.details && data.details.length > 500) {
      socket.emit('error', { message: 'Report details too long' });
      return;
    }

    const report = {
      id: uuidv4(),
      reporter: socket.id,
      target: data.target,
      reason: data.reason,
      details: data.details || '',
      timestamp: Date.now(),
      reporterIP: socket.handshake.address
    };

    reports.push(report);
    socket.emit('reported', { target: data.target });
    
    console.log(`Report filed: ${socket.id} -> ${data.target} (${data.reason})`);
    
    // Auto-action for severe reports (in production, this would be more sophisticated)
    if (data.reason === 'harassment' || data.reason === 'inappropriate') {
      const targetConnection = activeConnections.get(data.target);
      if (targetConnection) {
        // Temporarily reduce target's priority in matching
        console.log(`Reducing priority for reported user: ${data.target}`);
      }
    }
  });

  socket.on('block', (data) => {
    if (!data.target) {
      socket.emit('error', { message: 'Invalid block data' });
      return;
    }
    
    const pairKey = [socket.id, data.target].sort().join('|');
    blockedPairs.add(pairKey);
    socket.emit('blocked', { target: data.target });
    
    console.log(`Block added: ${pairKey}`);
  });

  // Heartbeat to track active connections
  socket.on('heartbeat', () => {
    const connection = activeConnections.get(socket.id);
    if (connection) {
      connection.lastSeen = Date.now();
    }
  });

  // Enhanced disconnect handling
  socket.on('disconnect', (reason) => {
    console.log(`User disconnected: ${socket.id} (${reason})`);
    
    // Clean up active connection and notify peer
    const connection = activeConnections.get(socket.id);
    if (connection && connection.matchedWith) {
      const sessionDuration = Date.now() - connection.sessionStart;
      
      // Update session statistics
      const stats = sessionStats.get(socket.id);
      if (stats) {
        stats.duration = sessionDuration;
        console.log(`Session stats for ${socket.id}:`, stats);
      }
      
      // Notify peer about disconnection
      io.to(connection.matchedWith).emit('peer-disconnected', { 
        id: socket.id,
        sessionDuration,
        reason: reason
      });
      
      // Clean up peer's connection
      const peerConnection = activeConnections.get(connection.matchedWith);
      if (peerConnection) {
        peerConnection.matchedWith = null;
        // Put peer back in queue if they want to continue
        waitingQueue.set(connection.matchedWith, {
          socketId: connection.matchedWith,
          profile: peerConnection.profile,
          filters: peerConnection.filters,
          queueTime: Date.now(),
          priority: 1 // Give priority to users whose peers disconnected
        });
      }
      
      activeConnections.delete(connection.matchedWith);
    }
    
    // Remove from all data structures
    activeConnections.delete(socket.id);
    waitingQueue.delete(socket.id);
    sessionStats.delete(socket.id);
    
    // Clean up rate limiting data
    rateLimitMap.delete(socket.id);
    rateLimitMap.delete(socket.id + '_msg');
  });
});

// Enhanced REST endpoints with better error handling
app.get('/api/stats', (req, res) => {
  try {
    const stats = {
      activeConnections: activeConnections.size,
      waitingQueue: waitingQueue.size,
      totalReports: reports.length,
      blockedPairs: blockedPairs.size,
      serverUptime: process.uptime(),
      timestamp: Date.now()
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Stats endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/health', (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: Date.now(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      connections: {
        active: activeConnections.size,
        waiting: waitingQueue.size
      }
    };
    
    res.json(health);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// Admin endpoint for reports (in production, this should be secured)
app.get('/api/admin/reports', (req, res) => {
  try {
    // In production, add authentication middleware here
    const recentReports = reports
      .slice(-50) // Last 50 reports
      .map(report => ({
        ...report,
        reporterIP: undefined // Don't expose IP in response
      }));
    
    res.json(recentReports);
  } catch (error) {
    console.error('Reports endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cleanup inactive connections periodically
setInterval(() => {
  const now = Date.now();
  const timeout = 5 * 60 * 1000; // 5 minutes

  for (const [socketId, connection] of activeConnections) {
    if (now - connection.lastSeen > timeout) {
      console.log(`Cleaning up inactive connection: ${socketId}`);
      
      if (connection.matchedWith) {
        io.to(connection.matchedWith).emit('peer-disconnected', {
          id: socketId,
          sessionDuration: now - connection.sessionStart,
          reason: 'timeout'
        });
      }
      
      activeConnections.delete(socketId);
    }
  }

  // Clean up old queue entries
  for (const [socketId, queueData] of waitingQueue) {
    if (now - queueData.queueTime > timeout) {
      console.log(`Cleaning up stale queue entry: ${socketId}`);
      waitingQueue.delete(socketId);
    }
  }
}, 60000); // Run every minute

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Express error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Enhanced AjnabiCam server running on port ${PORT}`);
  console.log(`WebSocket endpoint: ws://localhost:${PORT}`);
  console.log('---');
  console.log('Features enabled:');
  console.log('✓ Enhanced matching algorithm');
  console.log('✓ Connection quality monitoring');
  console.log('✓ Chat messaging system');
  console.log('✓ Rate limiting and security');
  console.log('✓ Session statistics');
  console.log('✓ Report and block system');
  console.log('✓ Automatic cleanup');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});