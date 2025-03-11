import styles from './SidebarHeader.module.css';

const SidebarHeader = () => {
    return (
        <header className={styles.sidebarHeader}>
            <h2 className={styles.title}>Chats</h2>
        </header>
    );
};

export default SidebarHeader;
