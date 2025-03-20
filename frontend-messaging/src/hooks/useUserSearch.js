import { useState, useEffect, useRef, useCallback } from 'react';
import { useChat } from '../context/ChatContext';

export const useUserSearch = (excludeUserIds = [], minSearchLength = 2) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchError, setSearchError] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeoutRef = useRef(null);
    const { searchForUsers } = useChat();

    // Function to perform the search - memoized with useCallback
    const performSearch = useCallback(
        async (term) => {
            if (!term || term.length < minSearchLength) {
                setSearchResults([]);
                setSearchError(null);
                return;
            }

            setIsSearching(true);
            try {
                const result = await searchForUsers(term);

                if (result.success) {
                    // Filter out excluded users
                    const filteredResults = result.data.filter(
                        (searchUser) => !excludeUserIds.includes(searchUser.id),
                    );
                    setSearchResults(filteredResults);

                    if (
                        filteredResults.length === 0 &&
                        result.data.length > 0
                    ) {
                        setSearchError(
                            'All matching users are already excluded',
                        );
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
                        const errorMessages = result.errors.map(
                            (err) => err.msg,
                        );
                        setSearchError(errorMessages.join('. '));
                    } else {
                        setSearchError(
                            result.message || 'Failed to search for users',
                        );
                    }
                }
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
                setSearchError('An error occurred while searching');
            } finally {
                setIsSearching(false);
            }
        },
        [excludeUserIds, minSearchLength, searchForUsers],
    );

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

        searchTimeoutRef.current = setTimeout(() => {
            performSearch(searchTerm);
        }, 500);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchTerm, minSearchLength, performSearch]); // Added performSearch to dependencies

    // Effect to reset results when excludeUserIds changes
    useEffect(() => {
        if (searchResults.length > 0) {
            // Re-filter results when excluded users change
            const filteredResults = searchResults.filter(
                (searchUser) => !excludeUserIds.includes(searchUser.id),
            );

            if (filteredResults.length !== searchResults.length) {
                setSearchResults(filteredResults);

                if (filteredResults.length === 0) {
                    setSearchError('All matching users are already excluded');
                }
            }
        }
    }, [excludeUserIds, searchResults]);

    // Reset search when component unmounts
    useEffect(() => {
        return () => {
            setSearchTerm('');
            setSearchResults([]);
            setSearchError(null);
        };
    }, []);

    return {
        searchTerm,
        setSearchTerm,
        searchResults,
        searchError,
        isSearching,
        handleSearchChange: (e) => setSearchTerm(e.target.value),
    };
};
