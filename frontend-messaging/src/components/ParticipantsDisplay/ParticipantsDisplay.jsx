/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import UserSearch from '../UserSearch/UserSearch';
import styles from './ParticipantsDisplay.module.css';

const ParticipantsDisplay = ({ participants, chatId }) => {
    const [showParticipants, setShowParticipants] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUsername, setSelectedUsername] = useState('');
    const [removeError, setRemoveError] = useState(null);
    const [addError, setAddError] = useState(null);
    const { user } = useAuth();
    const { leaveGroupChat, removeGroupParticipant, addGroupParticipant } = useChat();

    const toggleParticipants = () => {
        setShowParticipants(!showParticipants);
    };

    // Close dropdown when chat changes
    useEffect(() => {
        setShowParticipants(false);
        setShowLeaveModal(false);
        setShowRemoveModal(false);
        setShowAddModal(false);
        setSelectedUserId(null);
        setSelectedUsername('');
        setRemoveError(null);
        setAddError(null);
    }, [chatId]);

    const handleAddParticipant = () => {
        setShowAddModal(true);
        setAddError(null);
    };

    const handleSelectUser = async (user) => {
        setAddError(null);

        const result = await addGroupParticipant(chatId, user.id);
        if (result.success) {
            setShowAddModal(false);
        } else {
            // Handle the specific error format
            if (result.errors && Array.isArray(result.errors) && result.errors.length > 0) {
                // Get all error messages from the array
                const errorMessages = result.errors.map((err) => err.msg);
                setAddError(errorMessages.join('. '));
            } else {
                setAddError(result.message || `Failed to add ${user.username} to the group`);
            }
        }
    };

    const confirmRemoveParticipant = (userId, username) => {
        setSelectedUserId(userId);
        setSelectedUsername(username);
        setShowRemoveModal(true);
    };

    const handleRemoveParticipant = async () => {
        if (!selectedUserId) return;

        setRemoveError(null);
        const success = await removeGroupParticipant(chatId, selectedUserId);

        if (success) {
            setShowRemoveModal(false);
            setSelectedUserId(null);
            setSelectedUsername('');
        } else {
            setRemoveError('Failed to remove participant. Please try again.');
        }
    };

    const handleLeaveGroup = async () => {
        const success = await leaveGroupChat(chatId);
        if (success) {
            console.log('Left group successfully');
        } else {
            console.log('Error leaving group');
        }
        setShowLeaveModal(false);
    };

    const cancelRemoveParticipant = () => {
        setShowRemoveModal(false);
        setSelectedUserId(null);
        setSelectedUsername('');
        setRemoveError(null);
    };

    return (
        <div className={styles.participantsContainer}>
            <button className={styles.participantsButton} onClick={toggleParticipants}>
                Participants ({participants.length})
            </button>

            {showParticipants && (
                <div className={styles.participantsDropdown}>
                    <div className={styles.participantsHeader}>
                        <h4>Group Participants</h4>
                        <button className={styles.closeButton} onClick={() => setShowParticipants(false)}>
                            ×
                        </button>
                    </div>

                    <div className={styles.participantsActions}>
                        <button className={styles.addButton} onClick={handleAddParticipant}>
                            Add Participant
                        </button>
                    </div>

                    <ul className={styles.participantsList}>
                        {participants.map((participant) => (
                            <li key={participant.userId} className={styles.participantItem}>
                                <div className={styles.participantInfo}>
                                    <div className={styles.participantAvatar}>
                                        {participant.user.username.charAt(0)}
                                    </div>
                                    <span className={styles.participantName}>
                                        {participant.user.username}
                                        {participant.userId === user.id && (
                                            <span className={styles.participantYou}> (You)</span>
                                        )}
                                    </span>
                                </div>

                                {participant.userId !== user.id && (
                                    <button
                                        className={styles.removeButton}
                                        onClick={() =>
                                            confirmRemoveParticipant(participant.userId, participant.user.username)
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
                        <button className={styles.leaveButton} onClick={() => setShowLeaveModal(true)}>
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
                            Are you sure you want to leave this group? You&apos;ll no longer receive messages from this
                            chat.
                        </p>
                        <div className={styles.modalButtons}>
                            <button className={styles.cancelButton} onClick={() => setShowLeaveModal(false)}>
                                Cancel
                            </button>
                            <button className={styles.confirmButton} onClick={handleLeaveGroup}>
                                Leave Group
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Remove Participant Confirmation Modal */}
            {showRemoveModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h4 className={styles.modalTitle}>Remove Participant</h4>
                        <p className={styles.modalText}>
                            Are you sure you want to remove {selectedUsername} from this group? They will no longer be
                            able to see messages or participate in this chat.
                        </p>
                        {removeError && <div className={styles.modalError}>{removeError}</div>}
                        <div className={styles.modalButtons}>
                            <button className={styles.cancelButton} onClick={cancelRemoveParticipant}>
                                Cancel
                            </button>
                            <button className={styles.confirmButton} onClick={handleRemoveParticipant}>
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Participant Modal */}
            {showAddModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h4 className={styles.modalTitle}>Add Participant</h4>
                            <button className={styles.closeModalButton} onClick={() => setShowAddModal(false)}>
                                ×
                            </button>
                        </div>

                        {addError && <div className={styles.modalError}>{addError}</div>}

                        <UserSearch
                            onSelectUser={handleSelectUser}
                            excludeUserIds={participants.map((p) => p.userId)}
                            placeholder="Search for users to add..."
                            buttonLabel="Add"
                            noResultsMessage="No users found to add"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParticipantsDisplay;
