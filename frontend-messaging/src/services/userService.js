import { API_URL } from './apiService';

export async function updateUserInfo(userId, userData) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'No token found', data: null };
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
        return result;
    } catch (error) {
        console.error('Update user failed:', error);
        return {
            success: false,
            message: 'Network error occurred',
            data: null,
        };
    }
}

export async function getUserContacts() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'No token found', data: null };
        }

        const response = await fetch(`${API_URL}/contacts`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Get user contacts failed:', error);
        return {
            success: false,
            message: 'Network error occurred',
            data: null,
        };
    }
}

export async function addContact(contactUserId, nickname) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'No token found', data: null };
        }

        const response = await fetch(`${API_URL}/contacts`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contactId: contactUserId,
                nickname: nickname || '',
            }),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Add contact failed:', error);
        return {
            success: false,
            message: 'Network error occurred',
            data: null,
        };
    }
}

export async function removeContact(contactUserId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'No token found' };
        }

        const response = await fetch(`${API_URL}/contacts/${contactUserId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Remove contact failed:', error);
        return {
            success: false,
            message: 'Network error occurred',
        };
    }
}

export async function updateContactNickname(contactUserId, nickname) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'No token found', data: null };
        }

        const response = await fetch(`${API_URL}/contacts/${contactUserId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nickname: nickname,
            }),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Update contact nickname failed:', error);
        return {
            success: false,
            message: 'Network error occurred',
            data: null,
        };
    }
}
