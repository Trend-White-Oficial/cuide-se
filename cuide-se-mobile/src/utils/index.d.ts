export declare const formatDate: (date: string | Date) => string;
export declare const formatTime: (time: string) => string;
export declare const formatDateTime: (date: string | Date) => string;
export declare const formatCurrency: (value: number) => string;
export declare const isValidEmail: (email: string) => boolean;
export declare const isValidPhone: (phone: string) => boolean;
export declare const formatPhone: (phone: string) => string;
export declare const calculateAverageRating: (ratings: number[]) => number;
export declare const sortByDate: <T extends {
    createdAt: string;
}>(array: T[], ascending?: boolean) => T[];
export declare const sortByRating: <T extends {
    rating: number;
}>(array: T[], ascending?: boolean) => T[];
export declare const sortByPrice: <T extends {
    price: number;
}>(array: T[], ascending?: boolean) => T[];
export declare const generateId: () => string;
export declare const truncateText: (text: string, maxLength: number) => string;
export declare const isValidPassword: (password: string) => boolean;
export declare const isValidCPF: (cpf: string) => boolean;
export declare const formatCPF: (cpf: string) => string;
