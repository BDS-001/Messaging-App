import { API_URL } from './apiService';

export async function getUserChats() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'No token found', data: [] };
        }

        const response = await fetch(`${API_URL}/chats`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Get user chats failed:', error);
        return { success: false, message: 'Network error occurred', data: [] };
    }
}

export async function getChatDetails(chatId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'No token found', data: null };
        }

        const response = await fetch(`${API_URL}/chats/${chatId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Get chat details failed:', error);
        return {
            success: false,
            message: 'Network error occurred',
            data: null,
        };
    }
}

export async function sendMessage(messageData) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'No token found', data: null };
        }

        const response = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Send message failed:', error);
        return {
            success: false,
            message: 'Network error occurred',
            data: null,
        };
    }
}

export async function leaveGroup(chatId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'No token found' };
        }

        const response = await fetch(`${API_URL}/chats/${chatId}/leave`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Leave group chat failed:', error);
        return { success: false, message: 'Network error occurred' };
    }
}

export async function removeParticipant(chatId, userId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'No token found' };
        }

        const response = await fetch(
            `${API_URL}/chats/${chatId}/users/${userId}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Remove participant failed:', error);
        return { success: false, message: 'Network error occurred' };
    }
}

export async function searchUsers(searchTerm) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'No token found', data: [] };
        }

        const response = await fetch(
            `${API_URL}/users/search?q=${encodeURIComponent(searchTerm)}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error('Search users failed:', error);
        return { success: false, message: 'Network error occurred', data: [] };
    }
}

export async function addParticipant(chatId, userId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'No token found' };
        }
        const response = await fetch(
            `${API_URL}/chats/${chatId}/users/${userId}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error('Add participant failed:', error);
        return { success: false, message: 'Network error occurred' };
    }
}

export async function createNewChat(chatData) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'No token found' };
        }
        const response = await fetch(`${API_URL}/chats`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(chatData),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Create Chat failed:', error);
        return { success: false, message: 'Network error occurred' };
    }
}

export async function clearChat(chatId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'No token found' };
        }
        const response = await fetch(`${API_URL}/chats/${chatId}/clear`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Create Chat failed:', error);
        return { success: false, message: 'Network error occurred' };
    }
}
