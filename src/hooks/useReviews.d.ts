import type { Review } from '@/types/api';
export declare const useReviews: (professionalId?: string) => {
    professionalReviews: Review[];
    userReviews: Review[];
    isLoadingProfessionalReviews: boolean;
    isLoadingUserReviews: boolean;
    professionalReviewsError: Error;
    userReviewsError: Error;
    createReview: import("@tanstack/react-query").UseMutateFunction<import("axios").AxiosResponse<import("@/types/api").ApiResponse<Review>, any>, Error, Omit<Review, "user" | "id" | "createdAt" | "updatedAt">, unknown>;
    isCreating: boolean;
    createError: Error;
};
