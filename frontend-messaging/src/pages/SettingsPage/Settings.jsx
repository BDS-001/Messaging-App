import { useAuth } from '../../context/AuthContext';
import styles from './SettingsPage.module.css';
import UserInfoSection from '../../components/UserInfoSection/UserInfoSection';
import SecuritySection from '../../components/SecuritySection/SecuritySection';


function SettingsPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.settingsContainer}>
        <h2 className={styles.title}>Account Settings</h2>
        <UserInfoSection user={user} />
        <SecuritySection />
      </div>
    </div>
  );
}

export default SettingsPage;