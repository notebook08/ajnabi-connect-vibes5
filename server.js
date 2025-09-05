const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.io
const io = socketIo(server, {
  cors: {
    origin: "*", // In production, specify your frontend domain
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Store connected users and their pairing status
const waitingUsers = new Set(); // Users waiting to be paired
const pairedUsers = new Map();  // Map of userId -> partnerId

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    connectedUsers: waitingUsers.size + pairedUsers.size,
    waitingUsers: waitingUsers.size,
    pairedUsers: pairedUsers.size / 2
  });
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining the random chat
  socket.on('join-random', () => {
    console.log(`User ${socket.id} wants to join random chat`);
    
    // If there's someone waiting, pair them
    if (waitingUsers.size > 0) {
      const waitingUser = waitingUsers.values().next().value;
      waitingUsers.delete(waitingUser);
      
      // Create the pairing
      pairedUsers.set(socket.id, waitingUser);
      pairedUsers.set(waitingUser, socket.id);
      
      // Notify both users they are paired
      socket.emit('paired', { partnerId: waitingUser });
      io.to(waitingUser).emit('paired', { partnerId: socket.id });
      
      console.log(`Paired users: ${socket.id} <-> ${waitingUser}`);
    } else {
      // Add user to waiting list
      waitingUsers.add(socket.id);
      socket.emit('waiting');
      console.log(`User ${socket.id} is now waiting`);
    }
  });

  // Handle WebRTC signaling - offer
  socket.on('offer', (data) => {
    const partnerId = pairedUsers.get(socket.id);
    if (partnerId) {
      io.to(partnerId).emit('offer', {
        offer: data.offer,
        from: socket.id
      });
      console.log(`Relaying offer from ${socket.id} to ${partnerId}`);
    }
  });

  // Handle WebRTC signaling - answer
  socket.on('answer', (data) => {
    const partnerId = pairedUsers.get(socket.id);
    if (partnerId) {
      io.to(partnerId).emit('answer', {
        answer: data.answer,
        from: socket.id
      });
      console.log(`Relaying answer from ${socket.id} to ${partnerId}`);
    }
  });

  // Handle WebRTC signaling - ICE candidates
  socket.on('ice-candidate', (data) => {
    const partnerId = pairedUsers.get(socket.id);
    if (partnerId) {
      io.to(partnerId).emit('ice-candidate', {
        candidate: data.candidate,
        from: socket.id
      });
      console.log(`Relaying ICE candidate from ${socket.id} to ${partnerId}`);
    }
  });

  // Handle user wanting to find new partner
  socket.on('next-partner', () => {
    handleUserLeaving(socket.id);
    // Rejoin the random chat
    socket.emit('join-random');
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    handleUserLeaving(socket.id);
  });

  // Helper function to clean up user connections
  function handleUserLeaving(userId) {
    // Remove from waiting list if present
    waitingUsers.delete(userId);
    
    // If user was paired, notify partner and put them back in waiting
    const partnerId = pairedUsers.get(userId);
    if (partnerId) {
      // Remove the pairing
      pairedUsers.delete(userId);
      pairedUsers.delete(partnerId);
      
      // Notify partner that user left
      io.to(partnerId).emit('partner-left');
      
      // Put partner back in waiting list
      waitingUsers.add(partnerId);
      io.to(partnerId).emit('waiting');
      
      console.log(`User ${userId} left, partner ${partnerId} is now waiting`);
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket endpoint: ws://localhost:${PORT}`);
  console.log('---');
  console.log('Frontend should connect to Socket.io using:');
  console.log(`io("http://localhost:${PORT}") for development`);
  console.log('or your deployed server URL for production');
});

/*
FRONTEND CONNECTION INSTRUCTIONS:
================================

1. Install socket.io-client in your React app:
   npm install socket.io-client

2. Connect to this server using:
   import io from 'socket.io-client';
   const socket = io('http://localhost:3000'); // For development
   // For production: const socket = io('https://your-deployed-server.com');

3. Socket events your frontend should handle:
   - Emit 'join-random' to start looking for a partner
   - Listen for 'waiting' - user is in queue
   - Listen for 'paired' - user has been paired with someone
   - Listen for 'offer', 'answer', 'ice-candidate' for WebRTC signaling
   - Listen for 'partner-left' - current partner disconnected
   - Emit 'next-partner' to find a new partner
   - Emit 'offer', 'answer', 'ice-candidate' for WebRTC signaling

4. Example frontend connection:
   socket.emit('join-random');
   socket.on('paired', ({ partnerId }) => {
     // Start WebRTC connection process
   });
*/