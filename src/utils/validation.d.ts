import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email?: string;
    password?: string;
}, {
    email?: string;
    password?: string;
}>;
export declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    role: z.ZodEnum<["user", "professional"]>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    role?: "professional" | "user";
}, {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    role?: "professional" | "user";
}>;
export declare const professionalSchema: z.ZodObject<{
    specialties: z.ZodArray<z.ZodString, "many">;
    description: z.ZodString;
    experience: z.ZodNumber;
    address: z.ZodObject<{
        street: z.ZodString;
        number: z.ZodString;
        complement: z.ZodOptional<z.ZodString>;
        neighborhood: z.ZodString;
        city: z.ZodString;
        state: z.ZodString;
        zipCode: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        number?: string;
        state?: string;
        city?: string;
        street?: string;
        complement?: string;
        neighborhood?: string;
        zipCode?: string;
    }, {
        number?: string;
        state?: string;
        city?: string;
        street?: string;
        complement?: string;
        neighborhood?: string;
        zipCode?: string;
    }>;
    workingHours: z.ZodRecord<z.ZodString, z.ZodObject<{
        start: z.ZodString;
        end: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        end?: string;
        start?: string;
    }, {
        end?: string;
        start?: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    specialties?: string[];
    description?: string;
    experience?: number;
    address?: {
        number?: string;
        state?: string;
        city?: string;
        street?: string;
        complement?: string;
        neighborhood?: string;
        zipCode?: string;
    };
    workingHours?: Record<string, {
        end?: string;
        start?: string;
    }>;
}, {
    specialties?: string[];
    description?: string;
    experience?: number;
    address?: {
        number?: string;
        state?: string;
        city?: string;
        street?: string;
        complement?: string;
        neighborhood?: string;
        zipCode?: string;
    };
    workingHours?: Record<string, {
        end?: string;
        start?: string;
    }>;
}>;
export declare const serviceSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    duration: z.ZodNumber;
    price: z.ZodNumber;
    category: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name?: string;
    description?: string;
    price?: number;
    duration?: number;
    category?: string;
}, {
    name?: string;
    description?: string;
    price?: number;
    duration?: number;
    category?: string;
}>;
export declare const reviewSchema: z.ZodObject<{
    rating: z.ZodNumber;
    comment: z.ZodString;
    serviceId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    rating?: number;
    serviceId?: string;
    comment?: string;
}, {
    rating?: number;
    serviceId?: string;
    comment?: string;
}>;
export declare const schedulingSchema: z.ZodObject<{
    date: z.ZodString;
    startTime: z.ZodString;
    serviceId: z.ZodString;
    professionalId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    professionalId?: string;
    serviceId?: string;
    date?: string;
    startTime?: string;
}, {
    professionalId?: string;
    serviceId?: string;
    date?: string;
    startTime?: string;
}>;
