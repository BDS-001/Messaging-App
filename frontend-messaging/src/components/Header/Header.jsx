import styles from './Header.module.css';
import { useAuth } from '../../context/AuthContext';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Header = () => {
    const { isAuth, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleUsernameClick = () => {
        navigate('/settings');
    };

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link to="/">ChatSphere</Link>
            </div>

            {isAuth && (
                <nav className={styles.navigation}>
                    <NavLink to="/" className={({ isActive }) => (isActive ? styles.activeNavLink : styles.navLink)}>
                        Home
                    </NavLink>

                    <NavLink
                        to="/contacts"
                        className={({ isActive }) => (isActive ? styles.activeNavLink : styles.navLink)}
                    >
                        Contacts
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className={({ isActive }) => (isActive ? styles.activeNavLink : styles.navLink)}
                    >
                        Settings
                    </NavLink>
                </nav>
            )}

            <div className={styles.userSection}>
                {isAuth ? (
                    <div className={styles.userInfo}>
                        <span className={styles.username} onClick={handleUsernameClick}>
                            {user.username}
                        </span>
                        <button className={styles.logoutButton} onClick={logout}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className={styles.authLinks}>
                        <Link to="/login" className={styles.authLink}>
                            Login
                        </Link>
                        <span className={styles.divider}>|</span>
                        <Link to="/signup" className={styles.authLink}>
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
