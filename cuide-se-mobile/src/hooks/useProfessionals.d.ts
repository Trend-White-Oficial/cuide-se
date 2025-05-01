import { Professional, Filter } from '../types';
export declare function useProfessionals(filter?: Filter): {
    professionals: any;
    isLoading: boolean;
    getProfessionalById: (id: string) => Professional | undefined;
    getProfessionalsBySpecialty: (specialty: string) => Professional[];
    getProfessionalsByLocation: (location: string) => Professional[];
    getProfessionalsByRating: (minRating: number) => Professional[];
    sortProfessionalsByRating: (ascending?: boolean) => Professional[];
    sortProfessionalsByPrice: (ascending?: boolean) => Professional[];
};
