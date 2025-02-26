/* eslint-disable no-unused-vars */
//TODO: implement auth provider
import { useState, useEffect } from 'react';

export const AuthProvider = ({children}) => {
    const [isAuth, setIsAuth] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkAuth();
    }, [])

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token')

            if (!token) {
                setIsAuth(false)
                setIsLoading(false)
                return
            }

            const response = await fetch('http://localhost:3000/api/v1/users/auth', {
                headers: {
                    'Authorization': `Bearer ${token}`
                  }
            })

            if (response.ok) {
                const result = await response.json()
                console.log(`authentication result ${JSON.stringify(result)}`)
                const user = result.data
                setIsAuth(true);
                setUser(user)
            } else {
                localStorage.removeItem('token');
                setIsAuth(false);
            }

        } catch (error) {
            console.error('Auth check failed:', error);
            setIsAuth(false);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        {children}
    );
}