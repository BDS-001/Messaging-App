/* eslint-disable react/prop-types */
import { useAuth } from '../../context/AuthContext';
import { useContactName } from '../../hooks/useContactName';
import styles from './ChatItem.module.css';

const ChatItem = ({ chat, handleOnClick, isActive }) => {
    const { user } = useAuth();
    const getContactName = useContactName();

    const isGroupChat = chat.type === 'group';
    const otherUser = !isGroupChat
        ? chat.participants.find((participant) => participant.user.id !== user.id)?.user
        : null;

    const participantCount = isGroupChat ? chat.participants.length : 0;
    const lastActive = new Date(chat.updatedAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div
            className={`${styles.chatItem} ${isActive ? styles.active : ''}`}
            onClick={(e) => handleOnClick(e, chat.id)}
        >
            <div className={styles.avatarContainer}>
                {isGroupChat ? (
                    <div className={styles.groupAvatar}>
                        <span>{chat.name.charAt(0)}</span>
                    </div>
                ) : (
                    <div className={styles.userAvatar}>
                        <span>{otherUser?.username.charAt(0)}</span>
                    </div>
                )}
            </div>

            <div className={styles.chatInfo}>
                <div className={styles.chatHeader}>
                    <h4 className={styles.chatName}>
                        {isGroupChat ? chat.name : getContactName(otherUser?.id, otherUser?.username)}
                    </h4>
                    <span className={styles.timeStamp}>{lastActive}</span>
                </div>

                <div className={styles.chatMeta}>
                    {isGroupChat ? (
                        <span className={styles.participantCount}>{participantCount} participants</span>
                    ) : (
                        <span className={styles.lastMessage}>Click to start chatting</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatItem;
