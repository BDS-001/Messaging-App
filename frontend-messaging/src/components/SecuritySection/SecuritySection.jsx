import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import styles from './SecuritySection.module.css';

const SecuritySection = () => {
    const { showToast } = useToast();
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const handleChangePassword = () => {
        // For now, just show a toast notification
        // In the future, this will open a modal or form for changing password
        if (!isChangingPassword) {
            setIsChangingPassword(true);
            showToast('Password change functionality coming soon!', 'info');
            setTimeout(() => setIsChangingPassword(false), 2000);
        }
    };

    return (
        <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Account Security</h3>
            <button
                className={styles.securityButton}
                onClick={handleChangePassword}
                disabled={isChangingPassword}
            >
                Change Password
            </button>
        </div>
    );
};

export default SecuritySection;
