import type { Professional } from '@/types/api';
interface UseProfessionalsOptions {
    specialty?: string;
    city?: string;
    rating?: number;
    page?: number;
    limit?: number;
}
interface UseProfessionalsResult {
    professionals: Professional[];
    isLoading: boolean;
    error: Error | null;
    total: number;
    page: number;
    totalPages: number;
}
export declare function useProfessionals(options?: UseProfessionalsOptions): UseProfessionalsResult;
export declare function useProfessionalDetails(id: string): import("@tanstack/react-query").UseQueryResult<import("axios").AxiosResponse<import("@/types/api").ApiResponse<Professional>, any>, Error>;
export declare function useProfessionalServices(id: string): import("@tanstack/react-query").UseQueryResult<import("axios").AxiosResponse<import("@/types/api").ApiResponse<import("@/types/api").Service[]>, any>, Error>;
export declare function useProfessionalReviews(id: string): import("@tanstack/react-query").UseQueryResult<import("axios").AxiosResponse<import("@/types/api").ApiResponse<import("@/types/api").Review[]>, any>, Error>;
export {};
