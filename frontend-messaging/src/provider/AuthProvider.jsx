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

    const signup = async (userData) => {
        const result = {
          success: false,
          errors: [],
          data: null
        };
      
        if (!userData.email) result.errors.push('Email is required');
        if (!userData.password) result.errors.push('Password is required');
        if (!userData.username) result.errors.push('Username is required');
        
        if (result.errors.length > 0) {
          console.log('Validation errors:', result.errors);
          return result;
        }
      
        try {
          console.log('Sending user data:', userData);
          
          const response = await fetch('http://localhost:3000/api/v1/users', {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          const responseData = await response.json();
          console.log('Server response:', responseData);
          if (!response.ok) {
            if (responseData.errors) {
              result.errors = responseData.errors.map(err => err.msg);
              console.log('Server validation errors:', result.errors);
            } else {
              result.errors.push('Signup failed');
            }
            return result;
          }
          
          result.success = true;
          result.data = responseData;
          return result;
          
        } catch (error) {
          console.error(`Signup failed: ${error.message}`);
          result.errors.push('Network error: Could not connect to server');
          return result;
        }
      };

    return (
        {children}
    );
}