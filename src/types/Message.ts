export interface Message {
    senderId: string;
    roomId: string;
    message: string;
    formattedCreatedAt?: string;
} 