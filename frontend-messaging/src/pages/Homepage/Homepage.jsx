import { useAuth } from '../../context/AuthContext';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import styles from './Homepage.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';

function Homapage() {
        const navigate = useNavigate();
        const {isAuth} = useAuth()
    
        useEffect(() => {
            if (!isAuth) navigate('/login')
            console.log(isAuth, 'here')
        }, [isAuth, navigate])

    return (
        <>
        <main className={styles.homepageMain}>
            <Sidebar></Sidebar>
            <div className={styles.mainContent}>
                <h2>Welcome to ChatSphere</h2>
                <p>Select a chat from the sidebar or create a new conversation</p>
            </div>
        </main>
        </>
    );
}

export default Homapage;