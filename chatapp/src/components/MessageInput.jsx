// client/src/components/MessageInput.jsx
import { useState, useRef } from 'react';
import axios from 'axios';

const MessageInput = ({ onSendMessage, currentUser }) => {
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('https://chat-app-qz5o.onrender.com/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      onSendMessage({
        text: response.data.imageUrl,
        sender: currentUser,
        timestamp: new Date().toLocaleTimeString(),
        type: 'image',
        imageUrl: response.data.imageUrl
      });
    } catch (error) {
      console.error('Upload failed:', error);
      onSendMessage({
        text: 'Failed to upload image',
        sender: currentUser,
        timestamp: new Date().toLocaleTimeString(),
        type: 'text'
      });
    }
    setUploading(false);
    fileInputRef.current.value = '';
  };

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage({
        text: message.trim(),
        sender: currentUser,
        timestamp: new Date().toLocaleTimeString(),
        type: 'text'
      });
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="message-input-container">
      <div className="input-group">
        <input
          type="text"
          className="form-control border-0 py-3 px-4 rounded-pill shadow-sm"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={uploading}
        />
        
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleImageUpload(e.target.files[0])}
        />
        
        <button
          className="btn btn-outline-primary rounded-pill px-4 me-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          title="Send Image"
        >
          <i className={`fas fa-image ${uploading ? 'fa-spin' : ''}`}></i>
        </button>
        
        <button
          className="btn btn-success rounded-pill px-4"
          onClick={handleSend}
          disabled={!message.trim() || uploading}
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
