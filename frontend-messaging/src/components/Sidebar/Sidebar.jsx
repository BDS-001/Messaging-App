import styles from './Sidebar.module.css';
import SidebarHeader from '../SidebarHeader/SidebarHeader';

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
        <SidebarHeader></SidebarHeader>
    </aside>
  );
};

export default Sidebar;