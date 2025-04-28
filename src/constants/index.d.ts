export declare const SPECIALTIES: readonly ["Cabeleireira", "Manicure", "Podóloga", "Esteticista", "Maquiadora", "Designer de Sobrancelhas", "Barbeira", "Massoterapeuta"];
export declare const BRAZILIAN_STATES: readonly ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
export declare const WEEKDAYS: readonly ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
export declare const BUSINESS_HOURS: {
    readonly start: "08:00";
    readonly end: "18:00";
};
export declare const SCHEDULING_STATUS: {
    readonly PENDING: "pending";
    readonly CONFIRMED: "confirmed";
    readonly CANCELLED: "cancelled";
    readonly COMPLETED: "completed";
};
export declare const PAGINATION: {
    readonly DEFAULT_PAGE: 1;
    readonly DEFAULT_LIMIT: 10;
    readonly MAX_LIMIT: 50;
};
export declare const RATING: {
    readonly MIN: 1;
    readonly MAX: 5;
    readonly STEP: 1;
};
export declare const CACHE: {
    readonly AUTH_TOKEN: "auth_token";
    readonly USER_DATA: "user_data";
    readonly THEME: "theme";
};
export declare const ROUTES: {
    readonly HOME: "/";
    readonly LOGIN: "/login";
    readonly REGISTER: "/register";
    readonly PROFILE: "/profile";
    readonly SEARCH: "/search";
    readonly PROFESSIONAL: (id: string) => string;
    readonly NOT_FOUND: "*";
};
export declare const API: {
    readonly BASE_URL: any;
    readonly TIMEOUT: 10000;
    readonly HEADERS: {
        readonly 'Content-Type': "application/json";
    };
};
export declare const VALIDATION: {
    readonly PASSWORD_MIN_LENGTH: 8;
    readonly NAME_MIN_LENGTH: 3;
    readonly PHONE_REGEX: RegExp;
    readonly EMAIL_REGEX: RegExp;
    readonly CEP_REGEX: RegExp;
};
export declare const UPLOAD: {
    readonly MAX_SIZE: number;
    readonly ALLOWED_TYPES: readonly ["image/jpeg", "image/png", "image/webp"];
    readonly MAX_FILES: 5;
};
export declare const NOTIFICATION: {
    readonly DURATION: 5000;
    readonly POSITION: "top-right";
};
export declare const APP_NAME = "Cuide-Se";
export declare const API_ENDPOINTS: {
    readonly AUTH: {
        readonly LOGIN: "/auth/login";
        readonly REGISTER: "/auth/register";
        readonly LOGOUT: "/auth/logout";
    };
    readonly PROFESSIONALS: {
        readonly BASE: "/professionals";
        readonly SERVICES: (id: string) => string;
        readonly REVIEWS: (id: string) => string;
    };
    readonly SCHEDULING: {
        readonly BASE: "/scheduling";
        readonly USER: "/scheduling/user";
        readonly PROFESSIONAL: "/scheduling/professional";
        readonly CANCEL: (id: string) => string;
    };
    readonly REVIEWS: {
        readonly BASE: "/reviews";
        readonly PROFESSIONAL: (id: string) => string;
        readonly USER: "/reviews/user";
    };
};
export declare const USER_ROLES: {
    readonly USER: "user";
    readonly PROFESSIONAL: "professional";
};
export declare const CACHE_TIME: {
    readonly STALE_TIME: number;
    readonly GC_TIME: number;
};
export declare const LOCAL_STORAGE_KEYS: {
    readonly AUTH_TOKEN: "auth_token";
    readonly USER_DATA: "user_data";
};
