import { useState, useEffect } from 'react';
import { useContact } from '../../context/ContactContext';
import UserSearch from '../../components/UserSearch/UserSearch';
import styles from './Contact.module.css';

function ContactsPage() {
    const {
        contactsArray,
        isLoading,
        error,
        addUserContact,
        removeUserContact,
        updateUserContactNickname,
    } = useContact();

    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [actionInProgress, setActionInProgress] = useState(false);
    const [actionError, setActionError] = useState(null);
    const [actionSuccess, setActionSuccess] = useState(null);

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
        } else {
            setFilteredContacts([]);
        }
    }, [contactsArray, searchQuery]);

    // Clear action messages after 3 seconds
    useEffect(() => {
        if (actionError || actionSuccess) {
            const timer = setTimeout(() => {
                setActionError(null);
                setActionSuccess(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [actionError, actionSuccess]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAddContact = async (user) => {
        setActionInProgress(true);
        // Use username as default nickname
        const nickname = user.username;

        const result = await addUserContact(user.id, nickname);

        if (result.success) {
            setActionSuccess(`Added ${nickname} to contacts`);
            setShowAddModal(false);
        } else {
            setActionError(result.message || 'Failed to add contact');
        }

        setActionInProgress(false);
    };

    const handleRemoveContact = async (contact) => {
        if (
            window.confirm(
                `Are you sure you want to remove ${contact.nickname} from your contacts?`,
            )
        ) {
            setActionInProgress(true);

            const result = await removeUserContact(contact);

            if (result.success) {
                setActionSuccess(`Removed ${contact.nickname} from contacts`);
            } else {
                setActionError(result.message || 'Failed to remove contact');
            }

            setActionInProgress(false);
        }
    };

    const handleEditNickname = async (contact) => {
        const newNickname = prompt('Enter new nickname', contact.nickname);

        if (newNickname && newNickname !== contact.nickname) {
            setActionInProgress(true);

            const result = await updateUserContactNickname(
                contact,
                newNickname,
            );

            if (result.success) {
                setActionSuccess(`Updated nickname to ${newNickname}`);
            } else {
                setActionError(result.message || 'Failed to update nickname');
            }

            setActionInProgress(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.contactsContainer}>
                <div className={styles.contactsHeader}>
                    <h2 className={styles.title}>Contacts</h2>
                    <button
                        className={styles.addButton}
                        onClick={() => setShowAddModal(true)}
                        disabled={actionInProgress}
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
                {actionError && (
                    <div className={styles.errorMessage}>{actionError}</div>
                )}
                {actionSuccess && (
                    <div className={styles.successMessage}>{actionSuccess}</div>
                )}

                {isLoading || actionInProgress ? (
                    <div className={styles.loadingMessage}>
                        {isLoading ? 'Loading contacts...' : 'Processing...'}
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
                                        onClick={() =>
                                            handleEditNickname(contact)
                                        }
                                        disabled={actionInProgress}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={styles.removeButton}
                                        onClick={() =>
                                            handleRemoveContact(contact)
                                        }
                                        disabled={actionInProgress}
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
                                disabled={actionInProgress}
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
