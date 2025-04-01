import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import styles from './SecuritySection.module.css';

const SecuritySection = () => {
    const { showToast } = useToast();
    const { resetUserPassword } = useAuth();
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleChangePassword = () => {
        setIsChangingPassword(!isChangingPassword);
        // Reset form data when toggling
        if (!isChangingPassword) {
            setPasswordData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if new password and confirm password match
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast('New password and confirm password do not match!', 'error');
            return;
        }

        const result = await resetUserPassword(passwordData.oldPassword, passwordData.newPassword);

        if (result.success) showToast('Password validation successful!', 'success');
        else {
            result.errors.forEach((error) => {
                showToast(`${error.msg}`, 'error');
            });
        }
    };

    return (
        <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Account Security</h3>
            {!isChangingPassword ? (
                <button className={styles.securityButton} onClick={handleChangePassword}>
                    Change Password
                </button>
            ) : (
                <div className={styles.passwordForm}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="oldPassword">Current Password</label>
                            <input
                                type="password"
                                id="oldPassword"
                                name="oldPassword"
                                value={passwordData.oldPassword}
                                onChange={handleInputChange}
                                required
                                className={styles.inputField}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handleInputChange}
                                required
                                className={styles.inputField}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                className={styles.inputField}
                            />
                        </div>
                        <div className={styles.buttonGroup}>
                            <button type="submit" className={styles.securityButton}>
                                Save Changes
                            </button>
                            <button
                                type="button"
                                className={styles.cancelButton}
                                onClick={handleChangePassword}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default SecuritySection;
