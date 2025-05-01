import { User } from 'firebase/auth';
interface AuthContextType {
    user: User | null;
    userData: any | null;
    loading: boolean;
}
export declare const useAuth: () => AuthContextType;
export declare const AuthProvider: ({ children }: {
    children: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export {};
