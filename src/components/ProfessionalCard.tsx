import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Professional } from '@/types/api';

interface ProfessionalCardProps {
  professional: Professional;
}

export function ProfessionalCard({ professional }: ProfessionalCardProps) {
  return (
    <Card className="overflow-hidden">
      <Link to={`/professionals/${professional.id}`}>
        <CardHeader className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={professional.avatar} alt={professional.name} />
              <AvatarFallback>{professional.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{professional.name}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{professional.specialties[0]}</Badge>
                <div className="flex items-center text-yellow-500">
                  <Star className="h-4 w-4" />
                  <span className="ml-1">{professional.rating}</span>
                  <span className="text-gray-500 text-sm ml-1">({professional.totalReviews} avaliações)</span>
                </div>
              </div>
              {professional.address && (
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{professional.address.city}, {professional.address.state}</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-gray-600 text-sm line-clamp-2">{professional.description}</p>
        </CardContent>
      </Link>
    </Card>
  );
}
