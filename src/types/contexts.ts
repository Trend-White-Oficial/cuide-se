/**
 * Tipos para os contextos React
 */

export interface CartContextType {
    items: Array<{
        id: string;
        servico: {
            id: string;
            nome: string;
            preco: number;
            duracao: number;
        };
        profissional: {
            id: string;
            nome_completo: string;
            foto_perfil_url: string;
        };
        created_at: string;
    }>;
    total: number;
    loading: boolean;
    error: string | null;
    fetchCart: () => Promise<void>;
    addToCart: (item: {
        servicoId: string;
        profissionalId: string;
    }) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    checkout: () => Promise<void>;
}

export interface PaymentContextType {
    transactions: Array<{
        id: string;
        valor: number;
        status: 'pendente' | 'pago' | 'cancelado' | 'reembolsado';
        agendamento: {
            id: string;
            servico: {
                id: string;
                nome: string;
                preco: number;
            };
            profissional: {
                id: string;
                nome_completo: string;
                foto_perfil_url: string;
            };
        };
        created_at: string;
    }>;
    loading: boolean;
    error: string | null;
    fetchTransactions: () => Promise<void>;
    createTransaction: (transactionData: {
        agendamentoId: string;
        amount: number;
    }) => Promise<void>;
    cancelTransaction: (transactionId: string) => Promise<void>;
    refundTransaction: (transactionId: string) => Promise<void>;
}

export interface UserSettingsContextType {
    settings: {
        theme: 'light' | 'dark';
        notifications: {
            email: boolean;
            push: boolean;
            sms: boolean;
        };
        language: string;
        timezone: string;
        currency: string;
        distanceUnit: 'km' | 'mi';
    };
    loading: boolean;
    error: string | null;
    fetchSettings: () => Promise<void>;
    updateSettings: (updates: Partial<UserSettingsContextType['settings']>) => Promise<void>;
    updateTheme: (theme: 'light' | 'dark') => Promise<void>;
    updateNotificationSettings: (notificationSettings: UserSettingsContextType['settings']['notifications']) => Promise<void>;
    updateLanguage: (language: string) => Promise<void>;
    updateTimezone: (timezone: string) => Promise<void>;
    updateCurrency: (currency: string) => Promise<void>;
    updateDistanceUnit: (distanceUnit: 'km' | 'mi') => Promise<void>;
}

export interface NotificationsContextType {
    notifications: Array<{
        id: string;
        mensagem: string;
        tipo: 'info' | 'warning' | 'error' | 'success';
        lida: boolean;
        created_at: string;
    }>;
    unreadCount: number;
    loading: boolean;
    error: string | null;
    fetchNotifications: () => Promise<void>;
    markAsRead: (notificationId: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

export interface CalendarContextType {
    events: Array<{
        id: string;
        titulo: string;
        descricao: string;
        data_inicio: string;
        data_fim: string;
        local: string;
        created_at: string;
    }>;
    loading: boolean;
    error: string | null;
    fetchEvents: () => Promise<void>;
    createEvent: (eventData: Partial<CalendarContextType['events'][0]>) => Promise<void>;
    updateEvent: (eventId: string, eventData: Partial<CalendarContextType['events'][0]>) => Promise<void>;
    deleteEvent: (eventId: string) => Promise<void>;
}

export interface FollowContextType {
    following: Array<{
        id: string;
        seguido: {
            id: string;
            nome_completo: string;
            foto_perfil_url: string;
            especialidade: string;
        };
        created_at: string;
    }>;
    loading: boolean;
    error: string | null;
    fetchFollowing: () => Promise<void>;
    followProfessional: (professionalId: string) => Promise<void>;
    unfollowProfessional: (professionalId: string) => Promise<void>;
}

export interface PromotionsContextType {
    promotions: Array<{
        id: string;
        titulo: string;
        descricao: string;
        desconto: number;
        data_inicio: string;
        data_fim: string;
        created_at: string;
    }>;
    loading: boolean;
    error: string | null;
    fetchPromotions: () => Promise<void>;
    createPromotion: (promotionData: Partial<PromotionsContextType['promotions'][0]>) => Promise<void>;
    updatePromotion: (promotionId: string, promotionData: Partial<PromotionsContextType['promotions'][0]>) => Promise<void>;
    deletePromotion: (promotionId: string) => Promise<void>;
}
