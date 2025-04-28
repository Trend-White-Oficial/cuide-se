export declare const formatDate: (date: string | Date, formatStr?: string) => string;
export declare const formatTime: (time: string) => string;
export declare const formatPrice: (price: number) => string;
export declare const formatPhone: (phone: string) => string;
export declare const formatCEP: (cep: string) => string;
export declare const isValidEmail: (email: string) => boolean;
export declare const isValidPassword: (password: string) => boolean;
export declare const isValidPhone: (phone: string) => boolean;
export declare const isValidCEP: (cep: string) => boolean;
export declare const truncateText: (text: string, maxLength: number) => string;
export declare const generateSlug: (text: string) => string;
export declare const calculateAverageRating: (ratings: number[]) => number;
export declare const formatDuration: (minutes: number) => string;
export declare const isTimeSlotAvailable: (time: string, bookedSlots: string[], businessHours: {
    start: string;
    end: string;
}) => boolean;
export declare const sortProfessionals: (professionals: any[], sortBy: "rating" | "price" | "distance", order?: "asc" | "desc") => any[];
