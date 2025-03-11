import { API_URL } from './apiService';

export async function updateUserInfo(userId, userData) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return null;
        }
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        const result = await response.json();
        if (response.ok) {
            const user = result.data;
            return user;
        } else {
            console.error(
                'Failed to update user:',
                response.status,
                response.statusText,
                result.message,
            );
            return null;
        }
    } catch (error) {
        console.error('update user failed:', error);
        return null;
    }
}
