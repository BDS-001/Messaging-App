import { useEffect, useState } from "react";
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
//TODO: change classnames to use module.css

function SignupPage() {
    const navigate = useNavigate();
    const {signup, isAuth} = useAuth()
    const [signupData, setSignupData] = useState({email: '', username: '', password: ''});
    const [error, setError] = useState(null)

    useEffect(() => {
        if (isAuth) navigate('/signup')
    }, [isAuth, navigate])

    function handleChange(e) {
        const {name, value} = e.target
        setSignupData(prev => ({
            ...prev, [name]: value
        }))
    }

    function handleSubmit(e) {
        setError(null)
        e.preventDefault()
        const result = signup(signupData)
        if (!result.success) setError(result.errors)
    }

    return (
        <>
            {error && error.map((error) => (<div key={error} className="error-message">{error}</div>))}
            <div className="signup-container">
                <h2>signup</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" name="username" onChange={handleChange} required/>
                    </div>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" onChange={handleChange} required/>
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" onChange={handleChange} required/>
                    </div>
                    <div>
                        <button type="submit">Sign In</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default SignupPage;