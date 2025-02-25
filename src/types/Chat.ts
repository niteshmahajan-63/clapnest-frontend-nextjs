import { User } from "./User";

export interface Chat {
    user: User;
    roomId: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount?: number;
}