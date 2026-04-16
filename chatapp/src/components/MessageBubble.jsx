// client/src/components/MessageBubble.jsx
import React from 'react';

const MessageBubble = ({ message, currentUser }) => {
  const isOwnMessage = message.sender === currentUser;
  
  return (
    <div className={`mb-3 d-flex ${isOwnMessage ? 'justify-content-end' : 'justify-content-start'}`}>
      <div className={`p-3 position-relative rounded-4 shadow-sm max-w-75 ${
        isOwnMessage 
          ? 'bg-gradient-primary text-white user-message' 
          : 'bg-white bot-message border'
      }`}>
        {/* Sender name (only for other users) */}
        {!isOwnMessage && (
          <div className="fw-bold small mb-1 text-primary">
            {message.sender}
          </div>
        )}
        
        {/* Message content */}
        {message.type === 'image' ? (
          <div className="text-center">
            <img 
              src={message.imageUrl || message.text} 
              alt="Chat image"
              className="img-fluid rounded-3 shadow message-image"
              style={{ maxWidth: '250px', maxHeight: '250px' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<i class="fas fa-image fa-3x text-muted"></i>';
              }}
            />
          </div>
        ) : (
          <div className="message-text">{message.text}</div>
        )}
        
        {/* Timestamp */}
        <div className={`timestamp mt-2 small opacity-75 ${
          isOwnMessage ? 'text-white-50' : 'text-muted'
        }`}>
          {message.timestamp}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;