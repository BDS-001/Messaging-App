export async function getUserChats() {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return []
      }
      const response = await fetch('http://localhost:3000/api/v1/users/chats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const result = await response.json()
        console.log(`chat result ${JSON.stringify(result)}`)
        const chats = result.data
        return chats
      } else {
        console.error('Failed to fetch chats:', response.status, response.statusText)
        return null
      }
    } catch (error) {
      console.error('Get user chats failed:', error);
      return null
    }
  }