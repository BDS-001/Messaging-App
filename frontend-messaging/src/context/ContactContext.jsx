import { createContext, useContext } from 'react';

export const ContactContext = createContext(null);

export const useContact = () => {
    const context = useContext(ContactContext);
    if (!context) {
        throw new Error('useContact must be used within a ContactProvider');
    }
    return context;
};
