/* eslint-disable react/prop-types */
const UserSearchResults = ({
    searchResults,
    onSelectUser,
    buttonLabel,
    noResultsMessage = 'No users found',
    searchTerm = '',
    isSearching = false,
    searchError = null,
    minSearchLength = 2,
    className = '',
    listClassName = '',
    itemClassName = '',
    avatarClassName = '',
    infoClassName = '',
    nameClassName = '',
    emailClassName = '',
    buttonClassName = '',
    noResultsClassName = '',
    promptClassName = '',
    resultsContainerStyle = {},
}) => {
    // Always render the container to prevent layout shifts
    return (
        <div className={className} style={resultsContainerStyle}>
            {searchResults.length > 0 ? (
                <ul className={listClassName}>
                    {searchResults.map((user) => (
                        <li
                            key={user.id}
                            className={itemClassName}
                            onClick={() => onSelectUser(user)}
                        >
                            <div className={avatarClassName}>
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className={infoClassName}>
                                <span className={nameClassName}>
                                    {user.username}
                                </span>
                                <span className={emailClassName}>
                                    {user.email}
                                </span>
                            </div>
                            {buttonLabel && (
                                <button
                                    className={buttonClassName}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectUser(user);
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
                <div className={noResultsClassName}>{noResultsMessage}</div>
            ) : searchTerm.length < minSearchLength && searchTerm.length > 0 ? (
                <div className={promptClassName}>
                    Type at least {minSearchLength} characters to search
                </div>
            ) : null}
        </div>
    );
};

export default UserSearchResults;
