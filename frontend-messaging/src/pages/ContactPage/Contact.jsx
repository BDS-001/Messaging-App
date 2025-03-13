import { useState, useEffect } from 'react';
import { useContact } from '../../context/ContactContext';
import UserSearch from '../../components/UserSearch/UserSearch';
import styles from './Contact.module.css';

function ContactsPage() {
    const { contactsArray, isLoading, error } = useContact();
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredContacts, setFilteredContacts] = useState([]);

    useEffect(() => {
        if (contactsArray.length > 0) {
            const filtered = contactsArray.filter(
                (contact) =>
                    contact.nickname
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    contact.contact.username
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    contact.contact.email
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()),
            );
            setFilteredContacts(filtered);
        }
    }, [contactsArray, searchQuery]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAddContact = (user) => {
        // This would call an API function to add contact
        console.log('Adding contact:', user);
        setShowAddModal(false);
        // After successful addition, you would reload the contacts
        // fetchContacts();
    };

    const handleRemoveContact = (contactId) => {
        // This would call an API function to remove contact
        console.log('Removing contact:', contactId);
        // After successful removal, you would reload the contacts
        // fetchContacts();
    };

    const handleEditNickname = (contactId, newNickname) => {
        // This would call an API function to update nickname
        console.log('Updating nickname for contact:', contactId, newNickname);
        // After successful update, you would reload the contacts
        // fetchContacts();
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.contactsContainer}>
                <div className={styles.contactsHeader}>
                    <h2 className={styles.title}>Contacts</h2>
                    <button
                        className={styles.addButton}
                        onClick={() => setShowAddModal(true)}
                    >
                        Add Contact
                    </button>
                </div>

                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search contacts..."
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}

                {isLoading ? (
                    <div className={styles.loadingMessage}>
                        Loading contacts...
                    </div>
                ) : filteredContacts.length > 0 ? (
                    <ul className={`${styles.contactsList} custom-scrollbar`}>
                        {filteredContacts.map((contact) => (
                            <li key={contact.id} className={styles.contactItem}>
                                <div className={styles.contactAvatar}>
                                    {contact.contact.username
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>
                                <div className={styles.contactInfo}>
                                    <div className={styles.contactName}>
                                        {contact.nickname}
                                        <span
                                            className={styles.contactUsername}
                                        >
                                            ({contact.contact.username})
                                        </span>
                                    </div>
                                    <div className={styles.contactEmail}>
                                        {contact.contact.email}
                                    </div>
                                </div>
                                <div className={styles.contactActions}>
                                    <button
                                        className={styles.editButton}
                                        onClick={() => {
                                            const newNickname = prompt(
                                                'Enter new nickname',
                                                contact.nickname,
                                            );
                                            if (
                                                newNickname &&
                                                newNickname !== contact.nickname
                                            ) {
                                                handleEditNickname(
                                                    contact.id,
                                                    newNickname,
                                                );
                                            }
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={styles.removeButton}
                                        onClick={() =>
                                            handleRemoveContact(contact.id)
                                        }
                                    >
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className={styles.emptyState}>
                        {searchQuery
                            ? 'No contacts match your search'
                            : 'No contacts found. Add some!'}
                    </div>
                )}
            </div>

            {/* Add Contact Modal */}
            {showAddModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h4 className={styles.modalTitle}>
                                Add New Contact
                            </h4>
                            <button
                                className={styles.closeModalButton}
                                onClick={() => setShowAddModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <UserSearch
                            onSelectUser={handleAddContact}
                            excludeUserIds={contactsArray.map(
                                (c) => c.contactId,
                            )}
                            placeholder="Search for users to add..."
                            buttonLabel="Add"
                            noResultsMessage="No users found"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ContactsPage;
