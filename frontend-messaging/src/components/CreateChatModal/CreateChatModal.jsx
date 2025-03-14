/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import styles from './CreateChatModal.module.css';

const CreateChatModal = ({ isOpen, onClose, type }) => {
    const [chatName, setChatName] = useState('');
    const inputRef = useRef(null);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        // This will be implemented later with API functionality
        console.log('Creating new chat:', { type, chatName });
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
                        </div>
                    )}
                    {type === 'one_on_one' && (
                        <div className={styles.formGroup}>
                            <label htmlFor="recipient">Recipient</label>
                            <input
                                ref={inputRef}
                                type="text"
                                id="recipient"
                                value={chatName}
                                onChange={(e) => setChatName(e.target.value)}
                                placeholder="Enter username to start chatting"
                                required
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
