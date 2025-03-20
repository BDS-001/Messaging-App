/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import styles from './UserSearch.module.css';

const UserSearch = ({
    onSelectUser,
    excludeUserIds = [],
    placeholder = 'Search by username...',
    buttonLabel = 'Select',
    noResultsMessage = 'No users found',
    minSearchLength = 2,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchError, setSearchError] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeoutRef = useRef(null);
    const { searchForUsers } = useChat();

    // Handle search with debouncing
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (!searchTerm || searchTerm.length < minSearchLength) {
            setSearchResults([]);
            setSearchError(null);
            return;
        }

        setIsSearching(true);
        searchTimeoutRef.current = setTimeout(async () => {
            const result = await searchForUsers(searchTerm);
            setIsSearching(false);

            if (result.success) {
                // Filter out excluded users
                const filteredResults = result.data.filter(
                    (searchUser) => !excludeUserIds.includes(searchUser.id),
                );
                setSearchResults(filteredResults);

                if (filteredResults.length === 0 && result.data.length > 0) {
                    setSearchError('All matching users are already excluded');
                } else {
                    setSearchError(null);
                }
            } else {
                setSearchResults([]);

                // Handle the specific error format
                if (
                    result.errors &&
                    Array.isArray(result.errors) &&
                    result.errors.length > 0
                ) {
                    // Get all error messages from the array
                    const errorMessages = result.errors.map((err) => err.msg);
                    setSearchError(errorMessages.join('. '));
                } else {
                    setSearchError(
                        result.message || 'Failed to search for users',
                    );
                }
            }
        }, 500);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchTerm, excludeUserIds, searchForUsers, minSearchLength]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleUserSelect = (user) => {
        if (onSelectUser) {
            onSelectUser(user);
        }
    };

    // Reset search when component unmounts
    useEffect(() => {
        return () => {
            setSearchTerm('');
            setSearchResults([]);
            setSearchError(null);
        };
    }, []);

    return (
        <div className={styles.userSearchContainer}>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    autoFocus
                />
                {isSearching && (
                    <div className={styles.searchingIndicator}>
                        Searching...
                    </div>
                )}
            </div>

            {searchError && (
                <div className={styles.errorMessage}>{searchError}</div>
            )}

            <div className={styles.searchResults}>
                {searchResults.length > 0 ? (
                    <ul className={styles.userList}>
                        {searchResults.map((user) => (
                            <li
                                key={user.id}
                                className={styles.userItem}
                                onClick={() => handleUserSelect(user)}
                            >
                                <div className={styles.userAvatar}>
                                    {user.username.charAt(0)}
                                </div>
                                <div className={styles.userInfo}>
                                    <span className={styles.userName}>
                                        {user.username}
                                    </span>
                                    <span className={styles.userEmail}>
                                        {user.email}
                                    </span>
                                </div>
                                {buttonLabel && (
                                    <button
                                        className={styles.selectButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUserSelect(user);
                                        }}
                                    >
                                        {buttonLabel}
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : searchTerm.length >= minSearchLength &&
                  !isSearching &&
                  !searchError ? (
                    <div className={styles.noResults}>{noResultsMessage}</div>
                ) : searchTerm.length < minSearchLength ? (
                    <div className={styles.searchPrompt}>
                        Type at least {minSearchLength} characters to search
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default UserSearch;
