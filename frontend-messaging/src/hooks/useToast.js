import { useState } from 'react';

export function useToast() {
    const [toast, setToast] = useState({ message: null, type: null });

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: null, type: null }), 5000);
    };

    return { toast, showToast };
}
