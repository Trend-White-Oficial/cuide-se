interface CreateAppointmentData {
    professionalId: string;
    serviceId: string;
    date: string;
    time: string;
    notes?: string;
}
export declare function useAppointments(): {
    appointments: any;
    isLoading: boolean;
    createAppointment: import("@tanstack/react-query").UseMutationResult<any, Error, CreateAppointmentData, unknown>;
    cancelAppointment: import("@tanstack/react-query").UseMutationResult<any, Error, string, unknown>;
    getPendingAppointments: () => any;
    getCompletedAppointments: () => any;
    getCancelledAppointments: () => any;
};
export {};
