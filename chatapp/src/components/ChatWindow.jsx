// client/src/components/ChatWindow.jsx
import MessageInput from './MessageInput';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ messages, currentUser, messagesEndRef, onSendMessage }) => {
  return (
    <div className="chat-container ">
      <div className="messages-container p-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted py-5">
            <i className="fas fa-comments fa-3x mb-3 opacity-50"></i>
            <p className="lead">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id || `${message.sender}-${Date.now()}`}
              message={message}
              currentUser={currentUser}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <MessageInput onSendMessage={onSendMessage} currentUser={currentUser} />
    </div>
  );
};

export default ChatWindow;