
<<<<<<< HEAD
=======
// Componente ReviewCard
// Cartão que exibe avaliações de clientes para um profissional
>>>>>>> c83d66dd46fb5daddadb7b640808220c66dc3f97
import { Review } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

<<<<<<< HEAD
interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
=======
// Interface que define as propriedades do componente
interface ReviewCardProps {
  review: Review; // Dados da avaliação
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  // Formata a data da avaliação para exibir há quanto tempo foi feita
>>>>>>> c83d66dd46fb5daddadb7b640808220c66dc3f97
  const displayDate = formatDistanceToNow(new Date(review.date), { 
    addSuffix: true, 
    locale: ptBR 
  });

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
<<<<<<< HEAD
=======
        {/* Cabeçalho com nome do cliente e data */}
>>>>>>> c83d66dd46fb5daddadb7b640808220c66dc3f97
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium">{review.clientName}</div>
          <div className="text-xs text-muted-foreground">{displayDate}</div>
        </div>
        
<<<<<<< HEAD
=======
        {/* Estrelas de avaliação */}
>>>>>>> c83d66dd46fb5daddadb7b640808220c66dc3f97
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <StarIcon 
              key={i} 
              className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
            />
          ))}
        </div>
        
<<<<<<< HEAD
=======
        {/* Comentário da avaliação */}
>>>>>>> c83d66dd46fb5daddadb7b640808220c66dc3f97
        <p className="text-sm text-gray-600">{review.comment}</p>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
