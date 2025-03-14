/* eslint-disable react/prop-types */
import styles from './ToastNotification.module.css';

function ToastNotification({ toasts, removeToast }) {
    return (
        <div className={styles.notificationsContainer}>
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={
                        toast.type === 'error'
                            ? styles.errorMessage
                            : styles.successMessage
                    }
                >
                    <span className={styles.messageText}>{toast.message}</span>
                    <button
                        className={styles.closeButton}
                        onClick={() => removeToast(toast.id)}
                        aria-label="Close notification"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
}

export default ToastNotification;
