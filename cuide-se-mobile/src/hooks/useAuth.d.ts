import { User } from '../types';
export declare function useAuth(): {
    user: User;
    token: string;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<any>;
    signOut: () => Promise<void>;
    updateUser: (userData: Partial<User>) => Promise<any>;
};
