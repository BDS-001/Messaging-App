/* eslint-disable react/prop-types */
import styles from './ToastNotification.module.css';

function ToastNotification({ toasts, removeToast }) {
    // Function to determine the CSS class based on toast type
    const getToastClassName = (type) => {
        switch (type) {
            case 'error':
                return styles.errorMessage;
            case 'warning':
                return styles.warningMessage;
            case 'info':
                return styles.infoMessage;
            case 'success':
            default:
                return styles.successMessage;
        }
    };

    return (
        <div className={styles.notificationsContainer}>
            {toasts.map((toast) => (
                <div key={toast.id} className={getToastClassName(toast.type)}>
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
