import { useState, useEffect } from 'react';
import { useContact } from '../../context/ContactContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import ToastNotification from '../../components/ToastNotification/ToastNotification';
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
    const { user } = useAuth();
    const { toast, showToast } = useToast();

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [actionInProgress, setActionInProgress] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [newNickname, setNewNickname] = useState('');

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

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAddContact = async (user) => {
        setActionInProgress(true);
        // Use username as default nickname
        const nickname = user.username;

        const result = await addUserContact(user.id, nickname);

        if (result.success) {
            showToast(`Added ${nickname} to contacts`);
            setShowAddModal(false);
        } else {
            showToast(result.message || 'Failed to add contact', 'error');
        }

        setActionInProgress(false);
    };

    const openRemoveModal = (contact) => {
        setSelectedContact(contact);
        setShowRemoveModal(true);
    };

    const handleRemoveContact = async () => {
        if (!selectedContact) return;

        setActionInProgress(true);
        const result = await removeUserContact(selectedContact);

        if (result.success) {
            showToast(`Removed ${selectedContact.nickname} from contacts`);
        } else {
            showToast(result.message || 'Failed to remove contact', 'error');
        }

        setActionInProgress(false);
        setShowRemoveModal(false);
        setSelectedContact(null);
    };

    const openEditModal = (contact) => {
        setSelectedContact(contact);
        setNewNickname(contact.nickname);
        setShowEditModal(true);
    };

    const handleEditNickname = async () => {
        if (!selectedContact || !newNickname.trim()) return;

        if (newNickname === selectedContact.nickname) {
            setShowEditModal(false);
            setSelectedContact(null);
            setNewNickname('');
            return;
        }

        setActionInProgress(true);
        const result = await updateUserContactNickname(
            selectedContact,
            newNickname.trim(),
        );

        if (result.success) {
            showToast(`Updated nickname to ${newNickname.trim()}`);
        } else {
            showToast(result.message || 'Failed to update nickname', error);
        }

        setActionInProgress(false);
        setShowEditModal(false);
        setSelectedContact(null);
        setNewNickname('');
    };

    // Handle key press in modals
    const handleKeyDown = (e, callback) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            callback();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            if (showEditModal) {
                setShowEditModal(false);
                setSelectedContact(null);
                setNewNickname('');
            } else if (showRemoveModal) {
                setShowRemoveModal(false);
                setSelectedContact(null);
            } else if (showAddModal) {
                setShowAddModal(false);
            }
        }
    };

    // Get IDs to exclude from search (current contacts and current user)
    const excludedIds = [
        ...contactsArray.map((c) => c.contactId),
        user?.id, // Add current user ID
    ].filter(Boolean); // Filter out undefined values

    return (
        <div className={styles.pageContainer}>
            <ToastNotification toast={toast} />

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
                                        onClick={() => openEditModal(contact)}
                                        disabled={actionInProgress}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={styles.removeButton}
                                        onClick={() => openRemoveModal(contact)}
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
                <div
                    className={styles.modalOverlay}
                    onClick={() => !actionInProgress && setShowAddModal(false)}
                >
                    <div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
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
                            excludeUserIds={excludedIds}
                            placeholder="Search for users to add..."
                            buttonLabel="Add"
                            noResultsMessage="No users found"
                        />
                    </div>
                </div>
            )}

            {/* Edit Nickname Modal */}
            {showEditModal && selectedContact && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => !actionInProgress && setShowEditModal(false)}
                >
                    <div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h4 className={styles.modalTitle}>Edit Nickname</h4>
                            <button
                                className={styles.closeModalButton}
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedContact(null);
                                    setNewNickname('');
                                }}
                                disabled={actionInProgress}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.modalContent}>
                            <p>
                                Update nickname for{' '}
                                {selectedContact.contact.username}
                            </p>
                            <div className={styles.inputGroup}>
                                <input
                                    type="text"
                                    value={newNickname}
                                    onChange={(e) =>
                                        setNewNickname(e.target.value)
                                    }
                                    onKeyDown={(e) =>
                                        handleKeyDown(e, handleEditNickname)
                                    }
                                    className={styles.modalInput}
                                    placeholder="Enter new nickname"
                                    autoFocus
                                />
                            </div>
                            <div className={styles.modalButtons}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedContact(null);
                                        setNewNickname('');
                                    }}
                                    disabled={actionInProgress}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.confirmButton}
                                    onClick={handleEditNickname}
                                    disabled={
                                        actionInProgress || !newNickname.trim()
                                    }
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Remove Contact Confirmation Modal */}
            {showRemoveModal && selectedContact && (
                <div
                    className={styles.modalOverlay}
                    onClick={() =>
                        !actionInProgress && setShowRemoveModal(false)
                    }
                >
                    <div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h4 className={styles.modalTitle}>
                                Remove Contact
                            </h4>
                            <button
                                className={styles.closeModalButton}
                                onClick={() => {
                                    setShowRemoveModal(false);
                                    setSelectedContact(null);
                                }}
                                disabled={actionInProgress}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.modalContent}>
                            <p>
                                Are you sure you want to remove{' '}
                                <strong>{selectedContact.nickname}</strong> from
                                your contacts?
                            </p>
                            <div className={styles.modalButtons}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => {
                                        setShowRemoveModal(false);
                                        setSelectedContact(null);
                                    }}
                                    disabled={actionInProgress}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={`${styles.confirmButton} ${styles.removeConfirmButton}`}
                                    onClick={handleRemoveContact}
                                    disabled={actionInProgress}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ContactsPage;
