/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './UserInfoSection.module.css';

const UserInfoSection = ({ user }) => {
    const [newUsername, setNewUsername] = useState(user?.username || '');
    const [isEditing, setIsEditing] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const [showMessage, setShowMessage] = useState(false);
    const { updateUserData } = useAuth();

    const handleUsernameChange = (e) => {
        setNewUsername(e.target.value);
    };

    const displayMessage = (message, type) => {
        setResponseMessage(message);
        setMessageType(type);
        setShowMessage(true);

        // Hide message after 3 seconds
        setTimeout(() => {
            setShowMessage(false);
        }, 3000);
    };

    const handleUpdateUsername = async () => {
        console.log(
            `User is trying to update username from ${user.username} to ${newUsername}`,
        );
        const res = await updateUserData({ username: newUsername });
        console.log(res);

        if (res === true) {
            displayMessage('Username updated successfully!', 'success');
        } else {
            displayMessage(
                'Failed to update username. Please try again.',
                'error',
            );
        }

        setIsEditing(false);
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        // Reset to current username if canceling edit
        if (isEditing) {
            setNewUsername(user?.username || '');
        }
    };

    // Clear message when component unmounts
    useEffect(() => {
        return () => {
            setShowMessage(false);
        };
    }, []);

    return (
        <div className={styles.section}>
            <h3 className={styles.sectionTitle}>User Information</h3>

            <div className={styles.infoGroup}>
                <label>Email Address</label>
                <div className={styles.infoValue}>{user.email}</div>
            </div>

            <div className={styles.infoGroup}>
                <label>Username</label>
                {isEditing ? (
                    <div className={styles.editField}>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={handleUsernameChange}
                            className={styles.usernameInput}
                        />
                        <div className={styles.actionButtons}>
                            <button
                                className={styles.saveButton}
                                onClick={handleUpdateUsername}
                            >
                                Save
                            </button>
                            <button
                                className={styles.cancelButton}
                                onClick={handleEditToggle}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.usernameDisplay}>
                        <span>{user.username}</span>
                        <button
                            className={styles.editButton}
                            onClick={handleEditToggle}
                        >
                            Edit
                        </button>
                    </div>
                )}

                <div
                    className={`${styles.responseMessageContainer} ${showMessage ? styles.visible : ''}`}
                >
                    <div
                        className={`${styles.responseMessage} ${styles[messageType]}`}
                    >
                        {responseMessage}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfoSection;
