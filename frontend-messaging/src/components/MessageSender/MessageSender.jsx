/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import styles from './MessageSender.module.css';

const MessageSender = ({ chatId }) => {
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // TODO: Implement message sending logic
    // 1. Call the API to send the message
    // 2. Add the message to the chat context or trigger a refetch
    // 3. Handle potential errors
    
    // Reset the input field after sending
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea 
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className={styles.input}
          rows={1}
        />
        <button 
          type="submit" 
          className={styles.sendButton}
          disabled={!message.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageSender;