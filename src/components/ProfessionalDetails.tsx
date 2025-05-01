// Componente ProfessionalDetails
// Componente que exibe detalhes completos de um profissional de estética
import { Star, MapPin, Calendar, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Professional } from '@/types/api';

// Interface que define as propriedades do componente
interface ProfessionalDetailsProps {
  professional: Professional; // Dados do profissional
}

export function ProfessionalDetails({ professional }: ProfessionalDetailsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        {/* Seção de avatar e informações básicas */}
        <div className="flex items-start gap-6">
          {/* Avatar do profissional */}
          <Avatar className="h-24 w-24">
            <AvatarImage src={professional.avatar} alt={professional.name} />
            <AvatarFallback>{professional.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            {/* Nome do profissional */}
            <h1 className="text-2xl font-bold mb-2">{professional.name}</h1>
            
            {/* Especialidades do profissional */}
            <div className="flex flex-wrap gap-2 mb-4">
              {professional.specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary">{specialty}</Badge>
              ))}
            </div>
            
            {/* Avaliação e localização */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              {/* Estrelas de avaliação */}
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span>{professional.rating}</span>
                <span className="ml-1">({professional.totalReviews} avaliações)</span>
              </div>
              
              {/* Localização do profissional */}
              {professional.address && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{professional.address.city}, {professional.address.state}</span>
                </div>
              )}
            </div>
            
            {/* Descrição do profissional */}
            <p className="text-gray-600 mb-6">{professional.description}</p>
            
            {/* Separador visual */}
            <Separator className="my-6" />
            
            {/* Grid de informações adicionais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="font-semibold mb-4">Horário de Atendimento</h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Segunda à Sexta</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>09:00 - 18:00</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="font-semibold mb-4">Formas de Pagamento</h2>
                <div className="flex flex-wrap gap-2">
                  {(professional.paymentMethods ?? []).map((method: string) => (
                    <Badge key={method} variant="outline">{method}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 