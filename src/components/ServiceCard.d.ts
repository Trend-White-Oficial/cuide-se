import { Service } from "@/types";
interface ServiceCardProps {
    service: Service;
    onSelect: (service: Service) => void;
}
declare const ServiceCard: ({ service, onSelect }: ServiceCardProps) => import("react/jsx-runtime").JSX.Element;
export default ServiceCard;
