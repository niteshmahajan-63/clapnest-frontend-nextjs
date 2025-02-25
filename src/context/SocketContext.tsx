"use client";

import { Chat } from "@/types/Chat";
import { ChatDetail } from "@/types/ChatDetail";
import { Message } from "@/types/Message";
import { User } from "@/types/User";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    joinRoom: (userId: string, otherUserId: string) => void;
    leaveRoom: (userId: string, roomId: string) => void;
    leaveUserRoom: () => void;
    currentRoom: string | null;
    sendMessage: (messageData: Message) => void;
    onMessageReceived: (callback: ((message: ChatDetail) => void) | null) => void;
    userStatuses: Array<{ userId: string; online: boolean; lastSeen?: string, formattedLastSeen?: string }>;
    setUserStatuses: React.Dispatch<React.SetStateAction<Array<{ userId: string; online: boolean; lastSeen?: string; formattedLastSeen?: string }>>>;
    markMessagesAsRead: (userId: string, roomId: string) => void;
    updateChatList: (messageData: Message) => void;
    chats: Chat[];
    setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [currentRoom, setCurrentRoom] = useState<string | null>(null);
    const [userStatuses, setUserStatuses] = useState<Array<{ userId: string; online: boolean; lastSeen?: string, formattedLastSeen?: string }>>([]);
    const [userData, setUserData] = useState<User | null>(null);
    const [chats, setChats] = useState<Chat[]>([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const user = localStorage.getItem("user");
            if (user) {
                setUserData(JSON.parse(user));
            }
        }
    }, []);

    useEffect(() => {
        if (!userData) return;

        const newSocket = io(SOCKET_SERVER_URL, {
            query: {
                userId: userData.id
            }
        });

        newSocket.on("connect", () => {
            setIsConnected(true);

            newSocket.emit("join_user", { userId: userData.id });
        });

        newSocket.on("disconnect", () => {
            setIsConnected(false);
            setCurrentRoom(null);
        });

        newSocket.on("roomJoined", (data: { roomId: string; message: string }) => {
            setCurrentRoom(data.roomId);
        });

        newSocket.on("userStatusUpdate", (data: { userId: string; online: boolean; lastSeen?: string, formattedLastSeen?: string }) => {
            setUserStatuses(prev => {
                const updatedStatuses = prev.filter(status => status.userId !== data.userId);
                updatedStatuses.push({ userId: data.userId, online: data.online, lastSeen: data.lastSeen, formattedLastSeen: data.formattedLastSeen });
                return updatedStatuses;
            });
        });

        newSocket.on("new_message", (data) => {
            setChats((prevChats) =>
                prevChats.map((chat) =>
                    chat.user.id === data.senderId
                        ? {
                            ...chat,
                            lastMessage: data.message,
                            lastMessageTime: data.formattedCreatedAt,
                            unreadCount: (chat.unreadCount || 0) + 1,
                        }
                        : chat
                )
            );
        });

        setSocket(newSocket);

        return () => {
            newSocket.off("new_message");
            newSocket.off("roomJoined");
            newSocket.off("userStatusUpdate");
            newSocket.off("disconnect");
            newSocket.disconnect();
        };
    }, [userData]);

    const joinRoom = (userId: string, otherUserId: string) => {
        if (socket) {
            socket.emit("joinRoom", { userId, otherUserId });
        }
    };

    const leaveRoom = (userId: string, roomId: string) => {
        if (socket) {
            socket.emit("leaveRoom", { userId, roomId });
            setCurrentRoom(null);
        }
    };

    const leaveUserRoom = () => {
        if (socket && userData) {
            socket.emit("leave_user", { userId: userData.id });
        }
    };

    const sendMessage = (messageData: Message) => {
        if (!socket || !currentRoom) return;
        socket.emit("message", { ...messageData, roomId: currentRoom });
    };

    const onMessageReceived = (callback: ((message: ChatDetail) => void) | null) => {
        if (!socket) return;
        if (callback) {
            socket.on("message", callback);
        } else {
            socket.off("message");
        }
    };

    const markMessagesAsRead = (userId: string, roomId: string) => {
        if (!socket || !userId || !roomId) return;

        if (isUserInChatRoom(userId, roomId)) {
            socket.emit("markAsRead", { userId, roomId });
        }
    };

    const isUserInChatRoom = (userId: string, roomId: string) => {
        if (!userData) return;
        return currentRoom === roomId && userId === userData.id;
    };

    const updateChatList = (messageData: Message) => {
        setChats((prevChats) =>
            prevChats.map((chat) =>
                chat.user.id === messageData.senderId
                    ? {
                        ...chat,
                        lastMessage: messageData.message,
                        lastMessageTime: messageData.formattedCreatedAt || "",
                        unreadCount: (chat.unreadCount || 0) + 1,
                    }
                    : chat
            )
        );
    };

    return <SocketContext.Provider value={{
        socket, isConnected, joinRoom, leaveRoom, currentRoom, sendMessage, onMessageReceived, userStatuses, setUserStatuses, markMessagesAsRead, updateChatList, chats, setChats, leaveUserRoom
    }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};