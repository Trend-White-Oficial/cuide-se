
// Componente ServiceCard
// Cartão que exibe informações de um serviço e permite agendamento
import { Service } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

// Interface que define as propriedades do componente
interface ServiceCardProps {
  service: Service; // Dados do serviço
  onSelect: (service: Service) => void; // Função chamada ao selecionar o serviço
}

const ServiceCard = ({ service, onSelect }: ServiceCardProps) => {
  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        {/* Cabeçalho com nome e preço */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg">{service.name}</h3>
          <div className="text-lg font-medium text-pink">
            R$ {service.price.toFixed(2).replace('.', ',')}
          </div>
        </div>
        
        {/* Descrição do serviço */}
        <p className="text-sm text-gray-600 mb-2">{service.description}</p>
        
        {/* Duração do serviço */}
        <div className="flex items-center gap-1 mb-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>{service.duration} minutos</span>
        </div>
      </CardContent>
      
      {/* Botão de agendamento */}
      <CardFooter className="pb-4 pt-0">
        <Button 
          onClick={() => onSelect(service)} 
          className="w-full bg-pink hover:bg-pink/90 text-white"
        >
          Agendar este serviço
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
