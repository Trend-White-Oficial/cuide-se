export declare const SERVICE_CATEGORIES: readonly ["Cabelo", "Unhas", "Maquiagem", "Depilação", "Massagem", "Estética Facial", "Estética Corporal", "Sobrancelhas", "Cílios", "Spa"];
export declare const APPOINTMENT_STATUS: {
    readonly PENDING: "pending";
    readonly CONFIRMED: "confirmed";
    readonly COMPLETED: "completed";
    readonly CANCELLED: "cancelled";
};
export declare const PAYMENT_STATUS: {
    readonly PENDING: "pending";
    readonly PAID: "paid";
    readonly REFUNDED: "refunded";
};
export declare const PAYMENT_METHODS: {
    readonly CREDIT_CARD: "credit_card";
    readonly DEBIT_CARD: "debit_card";
    readonly PIX: "pix";
    readonly BANK_TRANSFER: "bank_transfer";
};
export declare const NOTIFICATION_TYPES: {
    readonly APPOINTMENT: "appointment";
    readonly MESSAGE: "message";
    readonly PAYMENT: "payment";
    readonly SYSTEM: "system";
};
export declare const USER_ROLES: {
    readonly CLIENT: "client";
    readonly PROFESSIONAL: "professional";
};
export declare const WEEK_DAYS: readonly ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
export declare const AVAILABLE_HOURS: readonly ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
export declare const DEFAULT_SERVICE_DURATIONS: {
    readonly QUICK: 30;
    readonly SHORT: 60;
    readonly MEDIUM: 90;
    readonly LONG: 120;
    readonly EXTENDED: 180;
};
export declare const LIMITS: {
    readonly MAX_SERVICES_PER_PROFESSIONAL: 20;
    readonly MAX_APPOINTMENTS_PER_DAY: 10;
    readonly MAX_PORTFOLIO_IMAGES: 10;
    readonly MIN_PASSWORD_LENGTH: 6;
    readonly MAX_DESCRIPTION_LENGTH: 500;
    readonly MAX_REVIEW_LENGTH: 1000;
};
export declare const ERROR_MESSAGES: {
    readonly INVALID_EMAIL: "E-mail inválido";
    readonly INVALID_PASSWORD: "Senha deve ter no mínimo 6 caracteres";
    readonly INVALID_PHONE: "Telefone inválido";
    readonly INVALID_CPF: "CPF inválido";
    readonly REQUIRED_FIELD: "Campo obrigatório";
    readonly PASSWORDS_DONT_MATCH: "As senhas não coincidem";
    readonly NETWORK_ERROR: "Erro de conexão";
    readonly SERVER_ERROR: "Erro no servidor";
    readonly UNAUTHORIZED: "Não autorizado";
    readonly NOT_FOUND: "Não encontrado";
};
export declare const SUCCESS_MESSAGES: {
    readonly APPOINTMENT_CREATED: "Agendamento realizado com sucesso";
    readonly APPOINTMENT_CANCELLED: "Agendamento cancelado com sucesso";
    readonly PROFILE_UPDATED: "Perfil atualizado com sucesso";
    readonly REVIEW_CREATED: "Avaliação enviada com sucesso";
    readonly PASSWORD_CHANGED: "Senha alterada com sucesso";
};
export declare const CACHE_CONFIG: {
    readonly PROFESSIONALS: {
        readonly staleTime: number;
        readonly cacheTime: number;
    };
    readonly SERVICES: {
        readonly staleTime: number;
        readonly cacheTime: number;
    };
    readonly APPOINTMENTS: {
        readonly staleTime: number;
        readonly cacheTime: number;
    };
};
export declare const PAGINATION: {
    readonly ITEMS_PER_PAGE: 10;
    readonly MAX_PAGES: 100;
};
