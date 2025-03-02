import { useAuth } from '../../context/AuthContext';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import styles from './Homepage.module.css';

function Homapage() {
        const navigate = useNavigate();
        const {isAuth} = useAuth()
    
        useEffect(() => {
            if (isAuth) navigate('/login')
        }, [isAuth, navigate])

    return (
        <>
        <main className={styles.homepageMain}>
            <aside className={styles.sidebar}></aside>
            <div className={styles.messageContainer}></div>
        </main>
        </>
    );
}

export default Homapage;