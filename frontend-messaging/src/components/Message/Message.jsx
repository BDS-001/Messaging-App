/* eslint-disable react/prop-types */
import styles from './Message.module.css';

const Message = ({ message, isOwnMessage, senderName }) => {
    const formattedTime = new Date(message.sentAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className={`${styles.messageWrapper} ${isOwnMessage ? styles.ownMessage : styles.otherMessage}`}>
            {!isOwnMessage && <div className={styles.senderName}>{senderName}</div>}
            <div className={styles.messageContent}>
                {message.isDeleted ? (
                    <p className={styles.deletedMessage}>This message was deleted</p>
                ) : (
                    <p>{message.content}</p>
                )}
                <span className={styles.messageTime}>{formattedTime}</span>
            </div>
        </div>
    );
};

export default Message;
