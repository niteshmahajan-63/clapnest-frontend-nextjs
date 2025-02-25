import { User } from "./User";

export interface ChatDetail {
    id: string;
    senderId: string;
    message: string;
    read: boolean;
    createdAt: Date;
    formattedCreatedAt: string;
    user: User
}