/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import styles from './ParticipantsDisplay.module.css';

const ParticipantsDisplay = ({ participants, chatId }) => {
    const [showParticipants, setShowParticipants] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const { user } = useAuth();
    const { leaveGroupChat } = useChat();

    const toggleParticipants = () => {
        setShowParticipants(!showParticipants);
    };

    // Close dropdown when chat changes
    useEffect(() => {
        setShowParticipants(false);
        setShowLeaveModal(false);
    }, [chatId]);

    const handleAddParticipant = () => {
        // TODO: Implement API call to add participant to the group
        console.log('Add participant clicked');
    };

    const handleRemoveParticipant = (userId) => {
        // TODO: Implement API call to remove participant from the group
        console.log('Remove participant clicked', userId);
    };

    const handleLeaveGroup = () => {
        const res = leaveGroupChat(chatId);
        res
            ? console.log('Leave group confirmed')
            : console.log('Error leaving group');
        setShowLeaveModal(false);
    };

    return (
        <div className={styles.participantsContainer}>
            <button
                className={styles.participantsButton}
                onClick={toggleParticipants}
            >
                Participants ({participants.length})
            </button>

            {showParticipants && (
                <div className={styles.participantsDropdown}>
                    <div className={styles.participantsHeader}>
                        <h4>Group Participants</h4>
                        <button
                            className={styles.closeButton}
                            onClick={() => setShowParticipants(false)}
                        >
                            ×
                        </button>
                    </div>

                    <div className={styles.participantsActions}>
                        <button
                            className={styles.addButton}
                            onClick={handleAddParticipant}
                        >
                            Add Participant
                        </button>
                    </div>

                    <ul className={styles.participantsList}>
                        {participants.map((participant) => (
                            <li
                                key={participant.userId}
                                className={styles.participantItem}
                            >
                                <div className={styles.participantInfo}>
                                    <div className={styles.participantAvatar}>
                                        {participant.user.username.charAt(0)}
                                    </div>
                                    <span className={styles.participantName}>
                                        {participant.user.username}
                                        {participant.userId === user.id && (
                                            <span
                                                className={
                                                    styles.participantYou
                                                }
                                            >
                                                {' '}
                                                (You)
                                            </span>
                                        )}
                                    </span>
                                </div>

                                {participant.userId !== user.id && (
                                    <button
                                        className={styles.removeButton}
                                        onClick={() =>
                                            handleRemoveParticipant(
                                                participant.userId,
                                            )
                                        }
                                        aria-label="Remove participant"
                                    >
                                        ×
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>

                    <div className={styles.leaveGroupContainer}>
                        <button
                            className={styles.leaveButton}
                            onClick={() => setShowLeaveModal(true)}
                        >
                            Leave Group
                        </button>
                    </div>
                </div>
            )}

            {/* Leave Group Confirmation Modal */}
            {showLeaveModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h4 className={styles.modalTitle}>Leave Group?</h4>
                        <p className={styles.modalText}>
                            Are you sure you want to leave this group?
                            You&apos;ll no longer receive messages from this
                            chat.
                        </p>
                        <div className={styles.modalButtons}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setShowLeaveModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.confirmButton}
                                onClick={handleLeaveGroup}
                            >
                                Leave Group
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParticipantsDisplay;
