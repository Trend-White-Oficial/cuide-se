export declare const mockProfessional: {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    reviewsCount: number;
    bio: string;
    availability: {
        day: string;
        hours: string[];
    }[];
    services: {
        id: string;
        name: string;
        price: number;
    }[];
    location: {
        address: string;
        city: string;
        state: string;
        zip: string;
    };
    contact: {
        phone: string;
        email: string;
    };
    photoUrl: string;
};
