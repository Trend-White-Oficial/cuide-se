export type RootStackParamList = {
    Main: undefined;
    Auth: undefined;
    ProfessionalProfile: {
        id: string;
    };
    Appointment: {
        professionalId: string;
        serviceId: string;
    };
    AppointmentConfirmation: {
        professionalId: string;
        serviceId: string;
        date: string;
        time: string;
        notes?: string;
        paymentMethod: string;
    };
};
export default function App(): import("react/jsx-runtime").JSX.Element;
