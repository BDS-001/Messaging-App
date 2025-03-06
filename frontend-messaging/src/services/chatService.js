import { API_URL } from './apiService';

export async function getUserChats() {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      return []
    }
    const response = await fetch(`${API_URL}/chats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (response.ok) {
      const result = await response.json()
      const chats = result.data
      return chats
    } else {
      console.error('Failed to fetch chats:', response.status, response.statusText)
      return []
    }
  } catch (error) {
    console.error('Get user chats failed:', error);
    return []
  }
}

export async function getChatDetails(chatId) {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      return []
    }
    const response = await fetch(`${API_URL}/chats/${chatId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (response.ok) {
      const result = await response.json()
      const details = result.data
      return details
    } else {
      console.error('Failed to fetch chat details:', response.status, response.statusText)
      return []
    }
  } catch (error) {
    console.error('Get chat details failed:', error);
    return []
  }
}