/* eslint-disable react/prop-types */
import { useState } from 'react';
import styles from './ClearChatButton.module.css';

const ClearChatButton = ({ chatId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleClearChat = () => {
        // TODO: implement clear messages
        console.log(`Clearing chat for chat ID: ${chatId}`);
        closeModal();
    };

    return (
        <>
            <button onClick={openModal} className={styles.clearChatButton}>
                Clear Chat
            </button>

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3 className={styles.modalTitle}>
                            Clear Chat History
                        </h3>
                        <p className={styles.modalText}>
                            Are you sure you want to clear the chat?
                        </p>
                        <p className={styles.modalSubtext}>
                            This will not delete messages and will not affect
                            other users
                        </p>
                        <div className={styles.modalButtons}>
                            <button
                                onClick={handleClearChat}
                                className={styles.confirmButton}
                            >
                                Clear
                            </button>
                            <button
                                onClick={closeModal}
                                className={styles.cancelButton}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ClearChatButton;
