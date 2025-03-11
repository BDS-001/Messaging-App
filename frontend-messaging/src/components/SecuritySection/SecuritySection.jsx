import styles from './SecuritySection.module.css';

const SecuritySection = () => {
    return (
        <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Account Security</h3>
            <button className={styles.securityButton}>Change Password</button>
        </div>
    );
};

export default SecuritySection;
