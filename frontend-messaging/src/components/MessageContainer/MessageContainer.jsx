import { useRef, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useContactName } from '../../hooks/useContactName';
import Message from '../Message/Message';
import MessageSender from '../MessageSender/MessageSender';
import ParticipantsDisplay from '../ParticipantsDisplay/ParticipantsDisplay';
import styles from './MessageContainer.module.css';

const MessageContainer = () => {
    const { user } = useAuth();
    const {
        activeChatDetails,
        isLoading,
        isInitialChatLoad,
        setIsInitialChatLoad,
    } = useChat();
    const getContactName = useContactName();
    const [isEditingName, setIsEditingName] = useState(false);
    const [newChatName, setNewChatName] = useState('');

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // Auto-scroll to bottom
    const scrollToBottom = (behavior = 'smooth') => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior });
        }
    };

    // Track the previous chat ID to detect changes
    const prevChatIdRef = useRef(null);

    // Handle scrolling when messages change
    useEffect(() => {
        if (!activeChatDetails?.messages?.length) return;

        const currentChatId = activeChatDetails.id;
        const isNewChat = currentChatId !== prevChatIdRef.current;

        // Update the previous chat ID reference
        prevChatIdRef.current = currentChatId;

        console.log(
            `Messages updated. Chat ID: ${currentChatId}, isInitialChatLoad: ${isInitialChatLoad}, isNewChat: ${isNewChat}`,
        );

        if (isInitialChatLoad || isNewChat) {
            // For initial load or chat change, scroll immediately without animation
            requestAnimationFrame(() => {
                scrollToBottom('auto');
                // Only set isInitialChatLoad to false AFTER we've scrolled
                setIsInitialChatLoad(false);
            });
        } else {
            // For new messages in the current chat, use smooth scrolling
            scrollToBottom('smooth');
        }
    }, [
        activeChatDetails?.id,
        activeChatDetails?.messages,
        isInitialChatLoad,
        setIsInitialChatLoad,
    ]);

    // Update newChatName when active chat changes
    useEffect(() => {
        if (activeChatDetails && activeChatDetails.name) {
            setNewChatName(activeChatDetails.name);
        }
    }, [activeChatDetails]);

    if (isLoading) {
        return <div className={styles.emptyState}>Loading chat...</div>;
    }

    if (!activeChatDetails) {
        return (
            <div className={styles.emptyState}>
                Select a chat to start messaging
            </div>
        );
    }

    // Find the other participant in a one-on-one chat
    const otherParticipant =
        activeChatDetails.type === 'one_on_one'
            ? activeChatDetails.participants.find((p) => p.user.id !== user.id)
                  ?.user
            : null;

    const chatName =
        activeChatDetails.type === 'one_on_one'
            ? getContactName(otherParticipant?.id, otherParticipant?.username)
            : activeChatDetails.name;

    const isGroupChat = activeChatDetails.type === 'group';

    const handleEditName = () => {
        setIsEditingName(true);
    };

    const handleCancelEdit = () => {
        setIsEditingName(false);
        setNewChatName(activeChatDetails.name);
    };

    const handleSaveName = () => {
        //TODO: api privider logic here
        console.log(
            `Saving new chat name: ${newChatName} for chat ID: ${activeChatDetails.id}`,
        );
        setIsEditingName(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {isGroupChat && isEditingName ? (
                    <div className={styles.editNameContainer}>
                        <input
                            type="text"
                            value={newChatName}
                            onChange={(e) => setNewChatName(e.target.value)}
                            className={styles.editNameInput}
                            autoFocus
                        />
                        <div className={styles.editNameButtons}>
                            <button
                                onClick={handleSaveName}
                                className={styles.saveButton}
                            >
                                Save
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                className={styles.cancelButton}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.chatNameContainer}>
                        <h3>{chatName}</h3>
                        {isGroupChat && (
                            <button
                                onClick={handleEditName}
                                className={styles.editNameButton}
                            >
                                Edit Name
                            </button>
                        )}
                    </div>
                )}
                {isGroupChat && (
                    <ParticipantsDisplay
                        participants={activeChatDetails.participants}
                        chatId={activeChatDetails.id}
                    />
                )}
            </div>

            <div className={styles.messagesWrapper}>
                <div
                    className={`${styles.messages} custom-scrollbar`}
                    ref={messagesContainerRef}
                >
                    {activeChatDetails.messages.map((message) => {
                        // Find the participant whose userId matches the message's senderId
                        const participant = activeChatDetails.participants.find(
                            (p) => p.userId === message.senderId,
                        );
                        const senderName = participant
                            ? getContactName(
                                  participant.user.id,
                                  participant.user.username,
                              )
                            : 'Unknown User';

                        return (
                            <Message
                                key={message.id}
                                message={message}
                                isOwnMessage={message.senderId === user.id}
                                senderName={senderName}
                            />
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className={styles.inputArea}>
                <MessageSender chatId={activeChatDetails.id} />
            </div>
        </div>
    );
};

export default MessageContainer;
