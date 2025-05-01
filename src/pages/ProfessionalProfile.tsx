// Componente ProfessionalProfile
// Página de perfil detalhado de um profissional de estética
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import ReviewCard from '@/components/ReviewCard';
import { Service } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { StarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/components/ui/use-toast';

// Função para buscar dados do profissional via API
async function fetchProfessional(id: string) {
  const response = await fetch(`https://api.cuide-se.com/professionals/${id}`);
  if (!response.ok) {
    throw new Error('Erro ao buscar dados do profissional');
  }
  return response.json();
}

const ProfessionalProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  // Estados do componente
  const [professional, setProfessional] = useState<any>(null); // Dados do profissional
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Erros de carregamento

  // Estados para agendamento
  const [selectedService, setSelectedService] = useState<Service | null>(null); // Serviço selecionado
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined); // Data selecionada
  const [selectedTime, setSelectedTime] = useState<string | null>(null); // Horário selecionado
  const [dialogOpen, setDialogOpen] = useState(false); // Estado do diálogo de agendamento

  // Lista de horários disponíveis para agendamento
  const availableTimes = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ];

  // Efeito que carrega os dados do profissional quando o componente é montado
  useEffect(() => {
    async function loadProfessional() {
      try {
        const data = await fetchProfessional(id!);
        setProfessional(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProfessional();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Carregando...</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Erro: {error}</h1>
            <Link to="/search" className="text-pink hover:underline">
              Voltar para busca
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Profissional não encontrado</h1>
            <Link to="/search" className="text-pink hover:underline">
              Voltar para busca
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setSelectedDate(undefined);
    setSelectedTime(null);
    setDialogOpen(true);
  };

  const handleBooking = () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      toast({
        title: "Informações incompletas",
        description: "Por favor, selecione serviço, data e horário",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Agendamento realizado com sucesso!",
      description: `Você agendou ${selectedService.name} com ${professional.name} para ${format(selectedDate, 'dd/MM/yyyy')} às ${selectedTime}.`,
    });

    setDialogOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Banner e perfil */}
        <div className="relative h-48 bg-pink-light">
          {professional.portfolio.length > 0 && (
            <img 
              src={professional.portfolio[0]} 
              alt="Portfólio" 
              className="w-full h-full object-cover opacity-30"
            />
          )}

          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden">
              <img 
                src={professional.avatar || 'https://via.placeholder.com/150'} 
                alt={professional.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 pt-20 pb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{professional.name}</h1>
            <div className="flex items-center justify-center gap-1 mb-2">
              <StarIcon className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">
                {professional.rating} ({professional.reviews.length} avaliações)
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="bg-pink-light/60 text-pink text-sm px-3 py-1 rounded-full">
                {professional.specialty}
              </span>
              <span className="text-gray-600 text-sm">{professional.location}</span>
            </div>
            <p className="max-w-2xl mx-auto text-gray-600">
              {professional.bio}
            </p>
          </div>

          {/* Galeria */}
          {professional.portfolio.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Portfólio</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {professional.portfolio.map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <img 
                      src={image} 
                      alt={`Trabalho ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Abas para Serviços e Avaliações */}
          <Tabs defaultValue="services" className="w-full max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="services">Serviços</TabsTrigger>
              <TabsTrigger value="reviews">Avaliações</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-4">
              {professional.services.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  onSelect={handleSelectService} 
                />
              ))}
            </TabsContent>

            <TabsContent value="reviews">
              {professional.reviews.length > 0 ? (
                professional.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Este profissional ainda não possui avaliações.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Dialog de Agendamento */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agendar Serviço</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {selectedService && (
              <div className="bg-pink-light/20 p-3 rounded-lg">
                <h3 className="font-medium">{selectedService.name}</h3>
                <div className="text-sm text-gray-600">
                  {selectedService.duration} minutos • R$ {selectedService.price.toFixed(2).replace('.', ',')}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium mb-3">Selecione a data:</h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={ptBR}
                className="rounded-md border p-3 pointer-events-auto"
                disabled={(date) => {
                  // Desabilitar datas passadas e fins de semana (sábado e domingo)
                  const day = date.getDay();
                  return date < new Date() || day === 0 || day === 6;
                }}
              />
            </div>

            {selectedDate && (
              <div>
                <h3 className="text-sm font-medium mb-3">
                  Selecione o horário para {format(selectedDate, 'dd/MM/yyyy')}:
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className={selectedTime === time ? "bg-pink" : ""}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleBooking}
              disabled={!selectedService || !selectedDate || !selectedTime}
              className="bg-pink hover:bg-pink/90"
            >
              Confirmar Agendamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ProfessionalProfile;
