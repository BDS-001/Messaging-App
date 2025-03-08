import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './SettingsPage.module.css';

function SettingsPage() {
    const navigate = useNavigate();
    const { user, isAuth } = useAuth();
    const [newUsername, setNewUsername] = useState(user?.username || '');
    const [isEditing, setIsEditing] = useState(false);
    
    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuth) navigate('/login');
    }, [isAuth, navigate]);

    const handleUsernameChange = (e) => {
        setNewUsername(e.target.value);
    };

    const handleUpdateUsername = () => {
        console.log(`User is trying to update username from ${user.username} to ${newUsername}`);
        // This is where you would add the logic to update the username
        setIsEditing(false);
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        // Reset to current username if canceling edit
        if (isEditing) {
            setNewUsername(user?.username || '');
        }
    };

    if (!user) return null;

    return (
        <div className={styles.pageContainer}>
            <div className={styles.settingsContainer}>
                <h2 className={styles.title}>Account Settings</h2>
                
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
                    </div>
                </div>
                
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Account Security</h3>
                    <button className={styles.securityButton}>
                        Change Password
                    </button>
                </div>
                

            </div>
        </div>
    );
}

export default SettingsPage;