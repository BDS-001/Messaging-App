/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import styles from './CreateChatModal.module.css';
import UserSearch from '../../components/UserSearch/UserSearch';

const CreateChatModal = ({ isOpen, onClose, type }) => {
    const [chatName, setChatName] = useState('');
    const [participants, setParticipants] = useState([]);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const inputRef = useRef(null);
    const { handleChatCreation } = useChat();
    const { showToast } = useToast();
    const { user } = useAuth();

    // Reset form and focus input when modal opens
    useEffect(() => {
        if (isOpen) {
            setChatName('');
            // Focus the input after a small delay to ensure the modal is visible
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 100);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const useChatName = type === 'group' ? chatName : null;
        const result = await handleChatCreation(
            type,
            useChatName,
            participants,
            user.id,
        );
        if (!result.success) {
            result.errors.forEach((item) => showToast(item.msg, 'error'));
        }
        console.log(result);
        onClose();
    };

    // Close modal when Escape key is pressed
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const handleAddParticipant = async (user) => {
        if (type === 'one_on_one') {
            setParticipants([user.id]);
            setSelectedParticipants([user]);
        } else {
            setParticipants((prev) => [...prev, user.id]);
            setSelectedParticipants((prev) => [...prev, user]);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.modalHeader}>
                    <h3>
                        {type === 'one_on_one'
                            ? 'New Direct Message'
                            : 'Create Group Chat'}
                    </h3>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    {type === 'group' && (
                        <div className={styles.formGroup}>
                            {selectedParticipants.length > 0 &&
                                selectedParticipants.map((user) => (
                                    <div key={user.id}>{user.username}</div>
                                ))}
                            <label htmlFor="chatName">Group Name</label>
                            <input
                                ref={inputRef}
                                type="text"
                                id="chatName"
                                value={chatName}
                                onChange={(e) => setChatName(e.target.value)}
                                placeholder="Enter a name for your group"
                                required
                            />
                            <UserSearch
                                onSelectUser={handleAddParticipant}
                                excludeUserIds={[]}
                                placeholder="Search for users to add..."
                                buttonLabel="Add"
                                noResultsMessage="No users found"
                            />
                        </div>
                    )}
                    {type === 'one_on_one' && (
                        <div className={styles.formGroup}>
                            {selectedParticipants.length > 0 &&
                                selectedParticipants.map((user) => (
                                    <div key={user.id}>{user.username}</div>
                                ))}
                            <label htmlFor="recipient">Recipient</label>
                            <UserSearch
                                onSelectUser={handleAddParticipant}
                                excludeUserIds={[]}
                                placeholder="Search for users to add..."
                                buttonLabel="Add"
                                noResultsMessage="No users found"
                            />
                        </div>
                    )}
                    <div className={styles.formActions}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={!chatName.trim()}
                        >
                            {type === 'one_on_one'
                                ? 'Start Chat'
                                : 'Create Group'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateChatModal;
