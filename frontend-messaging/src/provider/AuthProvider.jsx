/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { checkUserAuth, loginUser, signupUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { updateUserInfo } from '../services/userService';

export const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Check authentication status when component mounts
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const result = await checkUserAuth();

            if (result.success) {
                setIsAuth(true);
                setUser(result.data);
            } else {
                localStorage.removeItem('token');
                setIsAuth(false);
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setIsAuth(false);
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (userData) => {
        const result = await signupUser(userData);
        return result;
    };

    const login = async (credentials) => {
        const result = await loginUser(credentials);

        if (result.success) {
            const { token, user } = result.data;
            localStorage.setItem('token', token);
            setIsAuth(true);
            setUser(user);
            return true;
        } else {
            console.error('Login failed:', result.message);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuth(false);
        setUser(null);
        navigate('/login');
    };

    async function updateUserData(userData) {
        const result = await updateUserInfo(user.id, userData);

        if (result.success) {
            setUser(result.data);
            return true;
        } else {
            return false;
        }
    }

    return (
        <AuthContext.Provider
            value={{
                isAuth,
                isLoading,
                login,
                logout,
                signup,
                user,
                updateUserData,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
