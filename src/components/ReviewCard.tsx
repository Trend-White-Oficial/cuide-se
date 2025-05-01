
import { Review } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const displayDate = formatDistanceToNow(new Date(review.date), { 
    addSuffix: true, 
    locale: ptBR 
  });

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium">{review.clientName}</div>
          <div className="text-xs text-muted-foreground">{displayDate}</div>
        </div>
        
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <StarIcon 
              key={i} 
              className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
            />
          ))}
        </div>
        
        <p className="text-sm text-gray-600">{review.comment}</p>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
