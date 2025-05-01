import { User } from 'firebase/auth';
export interface UserData {
    name: string;
    email: string;
    phone: string;
    location: string;
    role: 'client' | 'professional';
}
export declare const signUp: (userData: UserData, password: string) => Promise<User>;
export declare const signIn: (email: string, password: string) => Promise<User>;
export declare const logOut: () => Promise<void>;
export declare const getCurrentUser: () => User | null;
