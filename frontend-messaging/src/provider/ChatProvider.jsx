/* eslint-disable react/prop-types */
import { ChatContext } from '../context/ChatContext';
import {
    getUserChats,
    getChatDetails,
    sendMessage,
} from '../services/chatService';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export const ChatProvider = ({ children }) => {
    const { isAuth } = useAuth();
    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeChat, setActiveChat] = useState(null);
    const [activeChatDetails, setActiveChatDetails] = useState(null);
    const [chatError, setChatError] = useState(null);
    const [isInitialChatLoad, setIsInitialChatLoad] = useState(true);
    // Track the last active chat to detect changes
    const lastActiveChatRef = useRef(null);

    async function fetchUserChats() {
        setIsLoading(true);
        try {
            const result = await getUserChats();
            if (result.success) {
                setChats(result.data);
                console.log('fetched user chats:', result.data);
            } else {
                console.error('Error fetching chats:', result.message);
                setChats([]);
            }
        } catch (error) {
            console.error('Error fetching chats:', error);
            setChats([]);
        } finally {
            setIsLoading(false);
        }
    }

    async function processSendMessage(messageData) {
        const result = await sendMessage(messageData);

        if (result.success) {
            setActiveChatDetails((prev) => ({
                ...prev,
                messages: [...prev.messages, result.data],
            }));
            return true;
        } else {
            setChatError(
                result.message || "Message couldn't be sent. Please try again.",
            );
            return false;
        }
    }

    const clearChatError = () => {
        setChatError(null);
    };

    const fetchChatDetails = useCallback(async () => {
        if (!activeChat) return;

        setIsLoading(true);
        // Always mark as initial load when fetching a different chat
        if (activeChat !== lastActiveChatRef.current) {
            console.log(
                `Chat changed from ${lastActiveChatRef.current} to ${activeChat} - setting initial load`,
            );
            setIsInitialChatLoad(true);
            lastActiveChatRef.current = activeChat;
        }

        try {
            const result = await getChatDetails(activeChat);
            if (result.success) {
                setActiveChatDetails(result.data);
                console.log('fetched chat details:', result.data);
            } else {
                console.error('Error fetching chat details:', result.message);
                setActiveChatDetails(null);
            }
        } catch (error) {
            console.error('Error fetching chat details:', error);
            setActiveChatDetails(null);
        } finally {
            setIsLoading(false);
        }
    }, [activeChat]);

    // Fetch user chats when auth state changes
    useEffect(() => {
        if (isAuth) {
            fetchUserChats();
        } else {
            setActiveChat(null);
            setChats([]);
            lastActiveChatRef.current = null;
        }
    }, [isAuth]);

    // Handle changing the active chat
    const changeActiveChat = useCallback(
        (chatId) => {
            if (chatId !== activeChat) {
                console.log(
                    `Changing active chat from ${activeChat} to ${chatId}`,
                );
                setActiveChat(chatId);
                // Set initial load flag as soon as we switch chats
                setIsInitialChatLoad(true);
            }
        },
        [activeChat],
    );

    // Fetch chat details when active chat changes
    useEffect(() => {
        if (isAuth && activeChat) {
            fetchChatDetails();
        } else {
            setActiveChatDetails(null);
        }
    }, [activeChat, fetchChatDetails, isAuth]);

    return (
        <ChatContext.Provider
            value={{
                chats,
                activeChatDetails,
                isLoading,
                activeChat,
                chatError,
                setActiveChat: changeActiveChat,
                fetchChatDetails,
                processSendMessage,
                clearChatError,
                isInitialChatLoad,
                setIsInitialChatLoad,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
