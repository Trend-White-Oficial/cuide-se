
import { Professional } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface ProfessionalCardProps {
  professional: Professional;
}

const ProfessionalCard = ({ professional }: ProfessionalCardProps) => {
  return (
    <Link to={`/professional/${professional.id}`}>
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md cursor-pointer">
        <CardHeader className="p-0">
          <div className="relative h-40 overflow-hidden">
            {professional.portfolio.length > 0 ? (
              <img 
                src={professional.portfolio[0]} 
                alt={`Trabalho de ${professional.name}`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-pink-light flex items-center justify-center">
                <span className="text-pink font-medium">Sem imagens no portfólio</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
              <img 
                src={professional.avatar || 'https://via.placeholder.com/150'} 
                alt={professional.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">{professional.name}</h3>
              <Badge className="bg-pink-light/60 text-pink hover:bg-pink-light">
                {professional.specialty}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-1 mb-3">
            <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-sm">
              {professional.rating} ({professional.reviews.length} avaliações)
            </span>
          </div>
          
          <div className="text-sm text-gray-600 line-clamp-2">
            {professional.bio}
          </div>
          
          <div className="flex items-center gap-1 mt-3 text-sm text-gray-500">
            <span>{professional.location}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProfessionalCard;
