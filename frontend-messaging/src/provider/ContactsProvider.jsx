/* eslint-disable react/prop-types */
import { ContactContext } from '../context/ContactContext';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    getUserContacts,
    addContact,
    removeContact,
    updateContactNickname,
} from '../services/userService';

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
                            acc[contact.contact.id] = contact;
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

    const addUserContact = async (contactUserId, nickname) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await addContact(contactUserId, nickname);
            if (result.success) {
                // Update the state directly with the new contact
                const newContact = result.data;
                setContactsArray((prevContacts) => [
                    ...prevContacts,
                    newContact,
                ]);
                setContacts((prevContacts) => ({
                    ...prevContacts,
                    [newContact.contact.id]: newContact,
                }));
                return { success: true, data: newContact };
            } else {
                setError(result.message || 'Failed to add contact');
                return { success: false, message: result.message };
            }
        } catch (error) {
            const errorMessage = 'An error occurred while adding contact';
            setError(errorMessage);
            console.error('Failed to add contact:', error);
            return { success: false, message: errorMessage };
        } finally {
            setIsLoading(false);
        }
    };

    const removeUserContact = async (contact) => {
        setIsLoading(true);
        setError(null);

        try {
            // We need to send the contactUserId (foreign key), not the contact entry id
            const contactUserId = contact.contactId;
            const result = await removeContact(contactUserId);

            if (result.success) {
                // Update the state by removing the contact
                setContactsArray((prevContacts) =>
                    prevContacts.filter((c) => c.id !== contact.id),
                );
                setContacts((prevContacts) => {
                    const updatedContacts = { ...prevContacts };
                    delete updatedContacts[contact.contact.id];
                    return updatedContacts;
                });
                return { success: true };
            } else {
                setError(result.message || 'Failed to remove contact');
                return { success: false, message: result.message };
            }
        } catch (error) {
            const errorMessage = 'An error occurred while removing contact';
            setError(errorMessage);
            console.error('Failed to remove contact:', error);
            return { success: false, message: errorMessage };
        } finally {
            setIsLoading(false);
        }
    };

    const updateUserContactNickname = async (contact, newNickname) => {
        setIsLoading(true);
        setError(null);
        try {
            // We need to send the contactUserId (foreign key), not the contact entry id
            const contactUserId = contact.contactId;
            const result = await updateContactNickname(
                contactUserId,
                newNickname,
            );

            if (result.success) {
                // Update the contact's nickname in state
                const updatedContact = result.data;
                setContactsArray((prevContacts) =>
                    prevContacts.map((c) =>
                        c.id === contact.id ? updatedContact : c,
                    ),
                );
                setContacts((prevContacts) => ({
                    ...prevContacts,
                    [updatedContact.contact.id]: updatedContact,
                }));
                return { success: true, data: updatedContact };
            } else {
                setError(result.message || 'Failed to update nickname');
                return { success: false, message: result.message };
            }
        } catch (error) {
            const errorMessage = 'An error occurred while updating nickname';
            setError(errorMessage);
            console.error('Failed to update nickname:', error);
            return { success: false, message: errorMessage };
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ContactContext.Provider
            value={{
                contacts,
                isLoading,
                error,
                contactsArray,
                addUserContact,
                removeUserContact,
                updateUserContactNickname,
            }}
        >
            {children}
        </ContactContext.Provider>
    );
};
