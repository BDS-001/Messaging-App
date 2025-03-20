/* eslint-disable react/prop-types */
import styles from './UserSearch.module.css';
import { useUserSearch } from '../../hooks/useUserSearch';
import UserSearchInput from './UserSearchInput';
import UserSearchResults from './UserSearchResults';

const UserSearch = ({
    onSelectUser,
    excludeUserIds = [],
    placeholder = 'Search by username...',
    buttonLabel = 'Select',
    noResultsMessage = 'No users found',
    minSearchLength = 2,
}) => {
    const {
        searchTerm,
        searchResults,
        searchError,
        isSearching,
        handleSearchChange,
    } = useUserSearch(excludeUserIds, minSearchLength);

    return (
        <div className={styles.userSearchContainer}>
            <UserSearchInput
                searchTerm={searchTerm}
                handleSearchChange={handleSearchChange}
                isSearching={isSearching}
                placeholder={placeholder}
                className={styles.searchContainer}
                inputClassName={styles.searchInput}
                loadingClassName={styles.searchingIndicator}
                loadingContainerClassName={styles.loadingContainer}
            />

            {/* Maintain consistent layout by always showing error area */}
            <div className={styles.errorArea}>
                {searchError && (
                    <div className={styles.errorMessage}>{searchError}</div>
                )}
            </div>

            <UserSearchResults
                searchResults={searchResults}
                onSelectUser={onSelectUser}
                buttonLabel={buttonLabel}
                noResultsMessage={noResultsMessage}
                searchTerm={searchTerm}
                isSearching={isSearching}
                searchError={searchError}
                minSearchLength={minSearchLength}
                className={styles.searchResults}
                listClassName={styles.userList}
                itemClassName={styles.userItem}
                avatarClassName={styles.userAvatar}
                infoClassName={styles.userInfo}
                nameClassName={styles.userName}
                emailClassName={styles.userEmail}
                buttonClassName={styles.selectButton}
                noResultsClassName={styles.noResults}
                promptClassName={styles.searchPrompt}
                resultsContainerStyle={{ minHeight: '50px' }}
            />
        </div>
    );
};

export default UserSearch;
