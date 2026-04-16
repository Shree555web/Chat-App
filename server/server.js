const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// File upload storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'public/uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Users online
const onlineUsers = new Map();

// Socket connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins
  socket.on('join', (userData) => {
    onlineUsers.set(socket.id, userData);
    io.emit('userList', Array.from(onlineUsers.values()));
    console.log(`${userData.username} joined`);
  });

  // Send message
  socket.on('sendMessage', (message) => {
    io.emit('newMessage', {
      ...message,
      senderId: socket.id,
      sender: onlineUsers.get(socket.id)?.username || 'Unknown'
    });
  });

  // Send image
  socket.on('sendImage', (imageData) => {
    io.emit('newImage', {
      ...imageData,
      senderId: socket.id,
      sender: onlineUsers.get(socket.id)?.username || 'Unknown'
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    onlineUsers.delete(socket.id);
    io.emit('userList', Array.from(onlineUsers.values()));
    console.log('User disconnected:', socket.id);
  });
});

// Serve upload folder
app.use('/uploads', express.static('public/uploads'));

// Image upload API
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ 
    imageUrl: `http://localhost:3001/uploads/${req.file.filename}` 
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});