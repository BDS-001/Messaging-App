import { API_URL } from './apiService';

export async function checkUserAuth() {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            return { success: false, data: null };
        }

        const response = await fetch(`${API_URL}/users/auth`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const result = await response.json();
            console.log(`authentication result ${JSON.stringify(result)}`);
            return { success: true, data: result.data };
        } else {
            return { success: false, data: null };
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        return { success: false, data: null };
    }
}

export async function signupUser(userData) {
    const result = {
        success: false,
        errors: [],
        data: null,
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

        const response = await fetch(`${API_URL}/users`, {
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
                result.errors = responseData.errors.map((err) => err.msg);
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
}

export async function loginUser(credentials) {
    try {
        console.log('Sending login request with email:', credentials.email);
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const result = await response.json();

        if (response.ok) {
            return { success: true, data: result.data };
        } else {
            console.error('Login failed:', result.message);
            return { success: false, error: result.message };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}
