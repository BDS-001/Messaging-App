/* eslint-disable react/prop-types */
import styles from './ToastNotification.module.css';

function ToastNotification({ toast }) {
    return (
        <div className={styles.notificationsContainer}>
            {toast.message && (
                <div
                    className={
                        toast.type === 'error'
                            ? styles.errorMessage
                            : styles.successMessage
                    }
                >
                    {toast.message}
                </div>
            )}
        </div>
    );
}

export default ToastNotification;
