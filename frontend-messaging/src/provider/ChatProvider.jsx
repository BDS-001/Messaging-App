/* eslint-disable react/prop-types */
import { ChatContext } from '../context/ChatContext';
import { getUserChats } from '../services/chatService';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const ChatProvider = ({children}) => {
    const {isAuth} = useAuth()
    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeChat, setActiveChat] = useState(null);

    useEffect(() => {
        if (isAuth) {
            fetchUserChats()
        } else {
            setActiveChat(null)
            setChats([])
        }
    }, [isAuth])

    async function fetchUserChats() {
        setIsLoading(true)
        try {
            const chats = await getUserChats()
            setChats(chats)
            console.log('fetched user chats:', chats)
        } catch (error) {
            console.error('Error fetching chats:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <ChatContext.Provider 
        value={{ 
            chats,
            isLoading,
            activeChat,
            setActiveChat
        }}
      >
        {children}
      </ChatContext.Provider>
    )
}