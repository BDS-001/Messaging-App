import { useAuth } from '../../context/AuthContext';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function Homapage() {
        const navigate = useNavigate();
        const {isAuth} = useAuth()
    
        useEffect(() => {
            if (isAuth) navigate('/login')
        }, [isAuth, navigate])

    return (
        <>
            HOMEPAGE
        </>
    );
}

export default Homapage;