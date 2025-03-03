import { useAuth } from '../../context/AuthContext';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import styles from './Homepage.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';

function Homapage() {
        const navigate = useNavigate();
        const {isAuth} = useAuth()
    
        useEffect(() => {
            if (isAuth) navigate('/login')
        }, [isAuth, navigate])

    return (
        <>
        <main className={styles.homepageMain}>
            <Sidebar></Sidebar>
            <div className={styles.messageContainer}></div>
        </main>
        </>
    );
}

export default Homapage;