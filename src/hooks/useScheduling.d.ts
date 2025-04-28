import type { Scheduling } from '@/types/api';
export declare const useScheduling: () => {
    userScheduling: Scheduling[];
    professionalScheduling: Scheduling[];
    isLoadingUserScheduling: boolean;
    isLoadingProfessionalScheduling: boolean;
    userSchedulingError: Error;
    professionalSchedulingError: Error;
    createScheduling: import("@tanstack/react-query").UseMutateFunction<import("axios").AxiosResponse<import("@/types/api").ApiResponse<Scheduling>, any>, Error, Omit<Scheduling, "professional" | "user" | "id" | "createdAt" | "updatedAt" | "service">, unknown>;
    cancelScheduling: import("@tanstack/react-query").UseMutateFunction<import("axios").AxiosResponse<import("@/types/api").ApiResponse<Scheduling>, any>, Error, string, unknown>;
    isCreating: boolean;
    isCancelling: boolean;
    createError: Error;
    cancelError: Error;
};
