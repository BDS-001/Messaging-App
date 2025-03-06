import { useState } from 'react';
import styles from './Sidebar.module.css';
import SidebarHeader from '../SidebarHeader/SidebarHeader';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('direct');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <aside className={styles.sidebar}>
      <SidebarHeader />
      
      <div className={styles.tabContainer}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'direct' ? styles.activeTab : ''}`}
          onClick={() => handleTabChange('direct')}
        >
          Direct Messages
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'group' ? styles.activeTab : ''}`}
          onClick={() => handleTabChange('group')}
        >
          Group Chats
        </button>
      </div>

      <div className={styles.chatList}>
        {/* TODO: add chats here */}
        {activeTab === 'direct' ? (
          <div className={styles.emptyState}>No direct messages yet</div>
        ) : (
          <div className={styles.emptyState}>No group chats yet</div>
        )}
      </div>

      <div className={styles.createButtonContainer}>
        <button className={styles.createButton}>
          {activeTab === 'direct' ? 'New Message' : 'New Group Chat'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;