/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

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

      const login = async (credentials) => {
        try {
            console.log('Sending login request with email:', credentials.email);
            const response = await fetch('http://localhost:3000/api/v1/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });
      
          const result = await response.json();
          
          if (response.ok) {
            const { token, user } = result.data;
            localStorage.setItem('token', token);
            setIsAuth(true);
            setUser(user);
            return true;
          } else {
            console.error('Login failed:', result.message);
            return false;
          }
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      }
      
    const logout = () => {
        localStorage.removeItem('token');
        setIsAuth(false);
        setUser(null)
    };

    return (
      <AuthContext.Provider value={{ isAuth, isLoading, login, logout, signup, user }}>
        {children}
      </AuthContext.Provider>
    );
}