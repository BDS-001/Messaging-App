/* eslint-disable react/prop-types */
import { ChatContext } from '../context/ChatContext';
import { getUserChats, getChatDetails } from '../services/chatService';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export const ChatProvider = ({children}) => {
    const {isAuth} = useAuth()
    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeChat, setActiveChat] = useState(null);
    const [activeChatDetails, setActiveChatDetails] = useState(null);

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

    const fetchChatDetails = useCallback(async () => {
        if (!activeChat) return;
        
        setIsLoading(true)
        try {
            const details = await getChatDetails(activeChat)
            setActiveChatDetails(details)
            console.log('fetched chat details:', details)
        } catch (error) {
            console.error('Error fetching chat details:', error);
        } finally {
            setIsLoading(false);
        }
    }, [activeChat]);

        useEffect(() => {
        if (isAuth) {
            fetchUserChats()
        } else {
            setActiveChat(null)
            setChats([])
        }
    }, [isAuth])

    useEffect(() => {
        if (isAuth && activeChat) {
            fetchChatDetails()
        } else {
            setActiveChatDetails(null)
        }
    }, [activeChat, fetchChatDetails, isAuth])

    return (
        <ChatContext.Provider 
        value={{ 
            chats,
            activeChatDetails,
            isLoading,
            activeChat,
            setActiveChat,
            fetchChatDetails
        }}
      >
        {children}
      </ChatContext.Provider>
    )
}