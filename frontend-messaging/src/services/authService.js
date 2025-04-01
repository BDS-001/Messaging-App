import { API_URL } from './apiService';

export async function checkUserAuth() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'No token found', data: null };
        }

        const response = await fetch(`${API_URL}/users/auth`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Auth check failed:', error);
        return {
            success: false,
            message: 'Network error occurred',
            data: null,
        };
    }
}

export async function signupUser(userData) {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`Signup failed: ${error.message}`);
        return {
            success: false,
            message: 'Network error: Could not connect to server',
            errors: [error.message],
        };
    }
}

export async function loginUser(credentials) {
    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Network error occurred' };
    }
}

export async function resetPassword(passwordData) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'No token found' };
        }
        const response = await fetch(`${API_URL}/users/password-reset`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(passwordData),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Reset password error:', error);
        return { success: false, message: 'Network error occurred' };
    }
}
