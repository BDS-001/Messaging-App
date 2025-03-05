import { useEffect, useState } from "react";
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';

function LoginPage() {
    const navigate = useNavigate();
    const {login, isAuth} = useAuth()
    const [loginData, setLoginData] = useState({email: '', password: ''});
    const [error, setError] = useState(null)

    useEffect(() => {
        if (isAuth) navigate('/')
    }, [isAuth, navigate])

    function handleChange(e) {
        const {name, value} = e.target
        setLoginData(prev => ({
            ...prev, [name]: value
        }))
    }

    async function handleSubmit(e) {
        setError(null)
        e.preventDefault()
        const loginSuccess = await login(loginData)
        if (!loginSuccess) setError('Incorrect Credentials, Try Again.')
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.loginContainer}>
                <h2 className={styles.title}>Login</h2>
                {error && <div className={styles.errorMessage}>{error}</div>}
                <form className={styles.loginForm} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={loginData.email} onChange={handleChange} required/>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={loginData.password} onChange={handleChange} required/>
                    </div>
                    <button className={styles.loginButton} type="submit">Login</button>
                </form>
                <p className={styles.bottomText}>Don&apos;t have an account? <Link to="/signup">Sign Up</Link></p>
            </div>
        </div>
    );
}

export default LoginPage;