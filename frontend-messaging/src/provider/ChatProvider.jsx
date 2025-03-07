/* eslint-disable react/prop-types */
import { ChatContext } from '../context/ChatContext';
import { getUserChats, getChatDetails, sendMessage } from '../services/chatService';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export const ChatProvider = ({children}) => {
    const {isAuth} = useAuth()
    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeChat, setActiveChat] = useState(null);
    const [activeChatDetails, setActiveChatDetails] = useState(null);
    const [chatError, setChatError] = useState(null);
    const [isInitialChatLoad, setIsInitialChatLoad] = useState(true);

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

    async function processSendMessage(messageData) {
        try {
            const newMessage = await sendMessage(messageData)
            if (newMessage) {
                setActiveChatDetails(prev => ({
                    ...prev,
                    messages: [...prev.messages, newMessage]
                }));
                return true; // Return success
            } else {
                setChatError("Message couldn't be sent. Please try again.");
                return false; // Return failure
            }
        } catch (error) {
            console.error('Error sending message', error);
            setChatError("Network error. Please check your connection and try again.");
            return false; // Return failure
        }
    }

    const clearChatError = () => {
        setChatError(null);
    };

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

    useEffect(() => {
        if (activeChat) {
          setIsInitialChatLoad(true);
        }
      }, [activeChat]);

    return (
        <ChatContext.Provider 
        value={{ 
            chats,
            activeChatDetails,
            isLoading,
            activeChat,
            chatError,
            setActiveChat,
            fetchChatDetails,
            processSendMessage,
            clearChatError,
            isInitialChatLoad,
            setIsInitialChatLoad
        }}
      >
        {children}
      </ChatContext.Provider>
    )
}