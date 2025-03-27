/* eslint-disable react/prop-types */
import { ChatContext } from '../context/ChatContext';
import {
    getUserChats,
    getChatDetails,
    sendMessage,
    leaveGroup,
    removeParticipant,
    searchUsers,
    addParticipant,
    createNewChat,
    clearChat,
    updateChatName,
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
    const lastActiveChatRef = useRef(null);
    const heartbeat = useRef(null);

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

    async function leaveGroupChat(chatId) {
        const result = await leaveGroup(chatId);
        if (!result.success) return false;

        setChats((prev) => prev.filter((chat) => chat.id !== chatId));
        setActiveChat(null);
        return true;
    }

    async function removeGroupParticipant(chatId, userId) {
        const result = await removeParticipant(chatId, userId);
        if (!result.success) return false;

        // Update active chat details to reflect the participant removal
        if (activeChatDetails && activeChatDetails.id === chatId) {
            setActiveChatDetails((prev) => ({
                ...prev,
                participants: prev.participants.filter(
                    (participant) => participant.userId !== userId,
                ),
            }));
        }

        setChats((prevChats) =>
            prevChats.map((chat) => {
                if (chat.id === chatId) {
                    return {
                        ...chat,
                        participants: chat.participants.filter(
                            (participant) => participant.userId !== userId,
                        ),
                    };
                }
                return chat;
            }),
        );

        return true;
    }

    async function searchForUsers(searchTerm) {
        if (!searchTerm || searchTerm.trim().length < 2) {
            return {
                success: false,
                message: 'Search term must be at least 2 characters',
                data: [],
            };
        }

        return await searchUsers(searchTerm);
    }

    async function addGroupParticipant(chatId, userId) {
        const result = await addParticipant(chatId, userId);
        if (!result.success) return { success: false, message: result.message };

        // Update active chat details to reflect the new participant
        if (activeChatDetails && activeChatDetails.id === chatId) {
            setActiveChatDetails((prev) => ({
                ...prev,
                participants: [...prev.participants, result.data],
            }));
            console.log(activeChatDetails);
        }

        setChats((prev) =>
            prev.map((chat) => {
                return chat.id === chatId
                    ? {
                          ...chat,
                          participants: [...chat.participants, result.data],
                      }
                    : chat;
            }),
        );
        console.log(chats);

        return { success: true, data: result.data };
    }

    function checkExistingChat(otherUserId) {
        const chat = chats.filter(
            (chat) =>
                chat.type === 'one_on_one' &&
                chat.participants.some(
                    (user) => Number(user.userId) === Number(otherUserId),
                ),
        );
        if (chat.length < 1) return false;
        setActiveChat(chat[0].id);
        console.log('exists');
        return true;
    }

    async function handleChatCreation(
        type,
        name = null,
        participantIds,
        userId,
    ) {
        if (type === 'one_on_one') {
            const otherUserId = participantIds[0];
            if (checkExistingChat(otherUserId)) return { success: true };
        }
        const newParticipants = [userId, ...participantIds];
        const result = await createNewChat({
            type,
            name,
            participantIds: newParticipants,
        });
        if (!result.success) return { ...result, success: false };
        setChats((prev) => [...prev, result.data]);
        return result;
    }

    async function processClearChat(chatId) {
        const result = await clearChat(chatId);
        console.log('PROVIDER:', result);
        return result;
    }

    async function processUpdateChatName(chatId, chatName) {
        const result = await updateChatName(chatId, chatName);
        console.log(result);
        if (result.success) {
            setChats((prev) =>
                prev.map((chat) =>
                    chat.id === chatId ? { ...chat, name: chatName } : chat,
                ),
            );
            if (activeChat === chatId)
                setActiveChatDetails((prev) => ({ ...prev, name: chatName }));
        }
        return result;
    }

    useEffect(() => {
        if (heartbeat.current) clearInterval(heartbeat.current);
        heartbeat.current = setInterval(() => {
            //TODO: heartbeat function implementation
        }, 5000);

        return () => {
            if (heartbeat.current) clearInterval(heartbeat.current);
        };
    }, [activeChat]);

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
                leaveGroupChat,
                removeGroupParticipant,
                searchForUsers,
                addGroupParticipant,
                handleChatCreation,
                processClearChat,
                processUpdateChatName,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
