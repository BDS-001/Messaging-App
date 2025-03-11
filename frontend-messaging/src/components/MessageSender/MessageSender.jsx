/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import styles from './MessageSender.module.css';

const MessageSender = ({ chatId }) => {
    const { processSendMessage, chatError, clearChatError } = useChat();
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setMessage(e.target.value);
        // Clear error when user starts typing again
        if (chatError) {
            clearChatError();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        const messageData = {
            chatId,
            content: message,
        };

        const success = await processSendMessage(messageData);
        if (success) {
            setMessage('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className={styles.container}>
            {chatError && (
                <div className={styles.errorMessage}>
                    {chatError}
                    <button onClick={clearChatError} aria-label="Dismiss error">
                        ×
                    </button>
                </div>
            )}
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
