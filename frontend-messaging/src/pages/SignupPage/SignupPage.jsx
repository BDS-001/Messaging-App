import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import styles from './SignupPage.module.css';

function SignupPage() {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [signupData, setSignupData] = useState({
        email: '',
        username: '',
        password: '',
    });
    const [error, setError] = useState(null);

    function handleChange(e) {
        const { name, value } = e.target;
        setSignupData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        setError(null);
        e.preventDefault();
        const result = await signup(signupData);
        result.success
            ? navigate('/login', {
                  state: { fromSignup: true, email: signupData.email },
              })
            : setError(result.errors);
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.signupContainer}>
                <h2 className={styles.title}>Sign Up</h2>
                {error && (
                    <div className={styles.errorContainer}>
                        {error.map((errorMsg) => (
                            <div key={errorMsg} className={styles.errorMessage}>
                                {errorMsg}
                            </div>
                        ))}
                    </div>
                )}
                <form className={styles.signupForm} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={signupData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={signupData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={signupData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button className={styles.signupButton} type="submit">
                        Sign Up
                    </button>
                </form>
                <p className={styles.bottomText}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default SignupPage;
