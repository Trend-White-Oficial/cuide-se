import { User } from 'firebase/auth';
interface AuthContextType {
    user: User | null;
    userData: any | null;
    loading: boolean;
<<<<<<< HEAD
    isAuthenticated: boolean;
    error: string | null;
=======
>>>>>>> c83d66dd46fb5daddadb7b640808220c66dc3f97
}
export declare const useAuth: () => AuthContextType;
export declare const AuthProvider: ({ children }: {
    children: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export {};
