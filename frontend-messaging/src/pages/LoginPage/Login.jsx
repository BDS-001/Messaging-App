import { useEffect, useState } from "react";
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
//TODO: change classnames to use module.css

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

    function handleSubmit(e) {
        setError(null)
        e.preventDefault()
        const loginSuccess = login(loginData)
        if (!loginSuccess) setError('Incorrect Credentials, Try Again.')
    }

    return (
        <>
            {error && <div className="error-message">{error}</div>}
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={loginData.email} onChange={handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={loginData.password} onChange={handleChange} required/>
                    </div>
                    <button type="submit">Login</button>
                </form>
                <p>Dont have an account? <Link to="/signup">Sign Up</Link></p>
            </div>
        </>
    );
}

export default LoginPage;