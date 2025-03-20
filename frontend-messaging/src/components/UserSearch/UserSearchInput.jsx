/* eslint-disable react/prop-types */
const UserSearchInput = ({
    searchTerm,
    handleSearchChange,
    isSearching,
    placeholder = 'Search users...',
    className = '',
    inputClassName = '',
    loadingClassName = '',
    loadingContainerClassName = '',
    autoFocus = true,
}) => {
    return (
        <div className={className}>
            <input
                type="text"
                className={inputClassName}
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleSearchChange}
                autoFocus={autoFocus}
            />
            {/* Always render loading container to prevent layout shifts */}
            <div className={loadingContainerClassName}>
                {isSearching && (
                    <div className={loadingClassName}>Searching...</div>
                )}
            </div>
        </div>
    );
};

export default UserSearchInput;
