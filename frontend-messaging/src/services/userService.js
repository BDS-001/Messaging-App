import { API_URL } from './apiService';

export async function updateUsername(userId, userData) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return [];
        }
        const response = await fetch(`${API_URL}/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (response.ok) {
            const result = await response.json();
            const user = result.data;
            return user;
        } else {
            console.error(
                'Failed to fetch chats:',
                response.status,
                response.statusText,
            );
            return [];
        }
    } catch (error) {
        console.error('Get user chats failed:', error);
        return [];
    }
}
