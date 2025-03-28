/* eslint-disable react/prop-types */
import { useState } from 'react';
import { ToastContext } from '../context/ToastContext';
import ToastNotification from '../components/ToastNotification/ToastNotification';

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        const newToast = { id, message, type };

        setToasts((currentToasts) => [...currentToasts, newToast]);

        // Auto-remove toast after 5 seconds
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    };

    const removeToast = (id) => {
        setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast, removeToast }}>
            <ToastNotification toasts={toasts} removeToast={removeToast} />
            {children}
        </ToastContext.Provider>
    );
};
