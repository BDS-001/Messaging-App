/* eslint-disable react/prop-types */
import { ContactContext } from '../context/ContactContext';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserContacts } from '../services/userService';

export const ContactProvider = ({ children }) => {
    const { user } = useAuth();
    const [contacts, setContacts] = useState({});
    const [contactsArray, setContactsArray] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;

        const processUserContacts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await getUserContacts();
                if (result.success) {
                    setContactsArray(result.data);
                    setContacts(
                        result.data.reduce((acc, contact) => {
                            acc[contact.id] = contact;
                            return acc;
                        }, {}),
                    );
                } else {
                    setError(result.message || 'Failed to load contacts');
                }
            } catch (error) {
                setError('An error occurred while fetching contacts');
                console.error('Failed to fetch contacts:', error);
            } finally {
                setIsLoading(false);
            }
        };

        processUserContacts();
    }, [user]);

    return (
        <ContactContext.Provider
            value={{
                contacts,
                isLoading,
                error,
                contactsArray,
            }}
        >
            {children}
        </ContactContext.Provider>
    );
};
