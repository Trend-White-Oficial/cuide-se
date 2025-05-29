export declare const formatCurrency: (value: number) => string;
export declare const formatDate: (date: string | Date) => string;
export declare const formatTime: (time: string) => string;
export declare const formatDuration: (minutes: number) => string;
export declare const formatPhoneNumber: (phone: string) => string;
export declare const formatAddress: (address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
}) => string;
