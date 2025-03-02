import styles from './Header.module.css';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const {isAuth} = useAuth()
  return (
    <header className={styles.header}>
      <div className={styles.navbarLogo}>Messenging</div>
      <div className={styles.navbarMenu}>something</div>
      <div className={styles.navbarUser}>
      {isAuth ?
        <div className="authenticated-user">user</div> :
        <div className="user-verification">
          <Link to='/login'>Login/Sign Up</Link>
        </div>
      }
      </div>
    </header>
  );
};

export default Header;