// client/src/App.jsx - FIXED
import { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import ChatWindow from './components/ChatWindow';
import './App.css';

const socket = io('http://localhost:3001');

function App() {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState('');
  const [username, setUsername] = useState('');
  const [showLogin, setShowLogin] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('newMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('newImage', (imageData) => {
      setMessages(prev => [...prev, imageData]);
    });

    socket.on('userList', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off('newMessage');
      socket.off('newImage');
      socket.off('userList');
    };
  }, []);

  const handleJoin = () => {
    const userName = username.trim() || `User${Math.floor(Math.random() * 1000)}`;
    if (userName) {
      setCurrentUser(userName);
      setShowLogin(false);
      
      // Join socket room
      socket.emit('join', { 
        username: userName,
        id: socket.id 
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleJoin(); // Only join on Enter, NOT on every keypress
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (newMessage) => {
    if (newMessage.type === 'text') {
      socket.emit('sendMessage', newMessage);
    } else {
      socket.emit('sendImage', newMessage);
    }
  };

  if (showLogin) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient">
        <div className="card p-5 shadow-lg mx-3" style={{maxWidth: '400px', width: '100%'}}>
          <div className="text-center mb-4">
            <i className="fas fa-comments fa-3x text-primary mb-3"></i>
            <h3 className="text-primary mb-1">Real-Time Chat</h3>
            <p className="text-muted">Enter your name to start chatting</p>
          </div>
          
          <div className="mb-4">
            <div className="input-group input-group-lg">
              <span className="input-group-text">
                <i className="fas fa-user"></i>
              </span>
              <input
                type="text"
                className="form-control border-primary"
                placeholder="Your name (e.g., John)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                maxLength={20}
                autoFocus
              />
            </div>
            <small className="text-muted d-block mt-1">
              Press Enter or click Join • {onlineUsers.length} online
            </small>
          </div>
          
          <button
            className="btn btn-primary w-100 btn-lg py-3"
            onClick={handleJoin}
          >
            <i className="fas fa-rocket me-2"></i>
            Join Chat
          </button>
          
          <div className="mt-3 text-center">
            <small className="text-muted">
              Demo users online: {onlineUsers.map(u => u.username).join(', ')}
            </small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column bg-gradient">
      {/* Header with Leave button */}
      <div className="bg-primary text-white p-3 shadow-sm">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h5 className="mb-0">
                <i className="fas fa-comments me-2"></i>
                {currentUser}
              </h5>
              <small>{onlineUsers.length} users online</small>
            </div>
            <button 
              className="btn btn-outline-light btn-sm"
              onClick={() => {
                setShowLogin(true);
                setUsername('');
                setCurrentUser('');
                setMessages([]);
                socket.emit('disconnect');
              }}
            >
              <i className="fas fa-sign-out-alt"></i> Leave
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow-1 container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-9 col-xl-7">
            <ChatWindow 
              messages={messages}
              currentUser={currentUser}
              messagesEndRef={messagesEndRef}
              onSendMessage={addMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;