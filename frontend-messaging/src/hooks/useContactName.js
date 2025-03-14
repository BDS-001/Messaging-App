import { useContact } from '../context/ContactContext';

export const useContactName = () => {
    const { contacts } = useContact();

    const getContactName = (userId, username) => {
        // If userId is undefined or null, return the username
        if (!userId) return username;

        // Look up the contact directly by userId (now the key in the contacts object)
        const contact = contacts && contacts[userId];

        // Return nickname if it exists, otherwise return username
        return contact?.nickname || username;
    };

    return getContactName;
};
