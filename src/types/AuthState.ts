import { User } from "./User";

export interface AuthState {
    token: string | null;
    isLoggedIn: boolean;
    user: User | null;
}