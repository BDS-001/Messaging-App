import { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import styles from './Sidebar.module.css';
import SidebarHeader from '../SidebarHeader/SidebarHeader';
import ChatItem from '../ChatItem/ChatItem';
import CreateChatModal from '../CreateChatModal/CreateChatModal';

const Sidebar = () => {
    const [activeTab, setActiveTab] = useState('one_on_one');
    const [displayedChats, setDisplayedChats] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { chats, activeChat, setActiveChat } = useChat();

    useEffect(() => {
        const filteredChats = chats.filter((chat) => chat.type === activeTab);
        setDisplayedChats(filteredChats);
    }, [activeTab, chats]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleOnClick = (e, id) => {
        setActiveChat(id);
    };

    const openCreateChatModal = () => {
        setIsModalOpen(true);
    };

    const closeCreateChatModal = () => {
        setIsModalOpen(false);
    };

    return (
        <aside className={styles.sidebar}>
            <SidebarHeader />

            <div className={styles.tabContainer}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'one_on_one' ? styles.activeTab : ''}`}
                    onClick={() => handleTabChange('one_on_one')}
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

            <div className={`${styles.chatList} custom-scrollbar`}>
                {displayedChats.length > 0 ? (
                    displayedChats.map((chat) => (
                        <ChatItem
                            key={chat.id}
                            chat={chat}
                            handleOnClick={handleOnClick}
                            isActive={activeChat === chat.id}
                        />
                    ))
                ) : activeTab === 'one_on_one' ? (
                    <div className={styles.emptyState}>
                        No direct messages yet
                    </div>
                ) : (
                    <div className={styles.emptyState}>No group chats yet</div>
                )}
            </div>

            <div className={styles.createButtonContainer}>
                <button
                    className={styles.createButton}
                    onClick={openCreateChatModal}
                >
                    {activeTab === 'one_on_one'
                        ? 'New Message'
                        : 'New Group Chat'}
                </button>
            </div>

            <CreateChatModal
                isOpen={isModalOpen}
                onClose={closeCreateChatModal}
                type={activeTab}
            />
        </aside>
    );
};

export default Sidebar;
