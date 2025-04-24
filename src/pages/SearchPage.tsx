
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { mockProfessionals } from '@/data/mockData';
import ProfessionalCard from '@/components/ProfessionalCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Professional } from '@/types';
import { Search, MapPin, Star, DollarSign, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const specialties = [
  "Todas especialidades",
  "Manicure", 
  "Cabeleireira", 
  "Especialista em Cílios", 
  "Podóloga"
];

const cities = [
  "Todas localizações",
  "São Paulo", 
  "Rio de Janeiro", 
  "Belo Horizonte", 
  "Curitiba",
  "Porto Alegre"
];

const SearchPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("Todas especialidades");
  const [selectedCity, setSelectedCity] = useState("Todas localizações");
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(300);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(0);
  
  // Filtrar profissionais com base em todos os filtros
  const filteredProfessionals = mockProfessionals.filter((professional) => {
    // Filtro por especialidade
    const matchesSpecialty = selectedSpecialty === "Todas especialidades" || 
                            professional.specialty === selectedSpecialty;
    
    // Filtro por termo de busca (nome ou localização)
    const matchesSearch = professional.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         professional.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por cidade
    const matchesCity = selectedCity === "Todas localizações" ||
                        professional.location.includes(selectedCity);
    
    // Filtro por avaliação mínima
    const matchesRating = professional.rating >= minRating;
    
    // Filtro por preço máximo (assumindo que temos um serviço com preço mais baixo na lista)
    const matchesPrice = professional.services && 
                        professional.services.some(service => service.price <= maxPrice);
    
    // Filtro por disponibilidade (mock - na implementação real, verificaria agenda)
    const matchesAvailability = !showOnlyAvailable || Math.random() > 0.3; // Mock para demonstração
    
    return matchesSpecialty && matchesSearch && matchesCity && 
           matchesRating && matchesPrice && matchesAvailability;
  });

  // Atualizar contador de filtros aplicados
  useEffect(() => {
    let count = 0;
    if (selectedSpecialty !== "Todas especialidades") count++;
    if (selectedCity !== "Todas localizações") count++;
    if (minRating > 0) count++;
    if (maxPrice < 300) count++;
    if (showOnlyAvailable) count++;
    
    setFiltersApplied(count);
  }, [selectedSpecialty, selectedCity, minRating, maxPrice, showOnlyAvailable]);

  const handleClearFilters = () => {
    setSelectedSpecialty("Todas especialidades");
    setSelectedCity("Todas localizações");
    setMinRating(0);
    setMaxPrice(300);
    setShowOnlyAvailable(false);
    
    toast({
      title: "Filtros limpos",
      description: "Todos os filtros foram redefinidos",
    });
  };

  const handleApplyFilters = () => {
    toast({
      title: "Filtros aplicados",
      description: `${filteredProfessionals.length} profissionais encontrados`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-pink-light/30 py-8">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Buscar Profissionais</h1>
            
            <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
              <Select 
                value={selectedSpecialty} 
                onValueChange={setSelectedSpecialty}
              >
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Selecione uma especialidade" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome ou localização..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Mobile Filters Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden flex items-center gap-2">
                    <Filter size={18} />
                    Filtros
                    {filtersApplied > 0 && (
                      <Badge variant="secondary" className="ml-1 bg-pink text-white">
                        {filtersApplied}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Filtros de Busca</SheetTitle>
                    <SheetDescription>
                      Refine sua pesquisa com os filtros abaixo
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm flex items-center gap-2">
                        <MapPin size={16} className="text-pink" /> Localização
                      </h3>
                      <Select
                        value={selectedCity}
                        onValueChange={setSelectedCity}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma cidade" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm flex items-center gap-2">
                        <Star size={16} className="text-pink" /> Avaliação mínima
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={18}
                                className={`cursor-pointer ${star <= minRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                onClick={() => setMinRating(star)}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{minRating} estrela{minRating !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm flex items-center gap-2">
                        <DollarSign size={16} className="text-pink" /> Preço máximo
                      </h3>
                      <div className="space-y-3">
                        <Slider
                          value={[maxPrice]}
                          min={50}
                          max={300}
                          step={10}
                          onValueChange={(vals) => setMaxPrice(vals[0])}
                        />
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">R$50</span>
                          <span className="text-sm font-medium">R${maxPrice}</span>
                          <span className="text-sm text-gray-500">R$300</span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={handleClearFilters}>
                        Limpar
                      </Button>
                      <Button className="bg-pink hover:bg-pink/90" onClick={handleApplyFilters}>
                        Aplicar Filtros
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters - Desktop */}
            <div className="hidden md:block w-64 space-y-8">
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Filter size={18} className="mr-2" /> 
                  Filtros
                  {filtersApplied > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-pink text-white">
                      {filtersApplied}
                    </Badge>
                  )}
                </h2>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mb-6 text-xs"
                  onClick={handleClearFilters}
                >
                  Limpar filtros
                </Button>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <MapPin size={16} className="text-pink" /> Localização
                </h3>
                <Select
                  value={selectedCity}
                  onValueChange={setSelectedCity}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <Star size={16} className="text-pink" /> Avaliação mínima
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        className={`cursor-pointer ${star <= minRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        onClick={() => setMinRating(star)}
                      />
                    ))}
                  </div>
                  {minRating > 0 && (
                    <span className="text-sm text-gray-500 block">{minRating} estrela{minRating !== 1 ? 's' : ''} ou mais</span>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <DollarSign size={16} className="text-pink" /> Preço máximo
                </h3>
                <div className="space-y-3">
                  <Slider
                    value={[maxPrice]}
                    min={50}
                    max={300}
                    step={10}
                    onValueChange={(vals) => setMaxPrice(vals[0])}
                  />
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">R$50</span>
                    <span className="text-sm font-medium">R${maxPrice}</span>
                    <span className="text-sm text-gray-500">R$300</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <Button className="w-full bg-pink hover:bg-pink/90" onClick={handleApplyFilters}>
                Aplicar Filtros
              </Button>
            </div>
            
            {/* Results */}
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {filteredProfessionals.length} profissionais encontrados
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfessionals.length > 0 ? (
                  filteredProfessionals.map((professional) => (
                    <ProfessionalCard key={professional.id} professional={professional} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">
                      Nenhum profissional encontrado com os critérios selecionados.
                    </p>
                    <Button 
                      variant="link" 
                      onClick={handleClearFilters}
                      className="text-pink mt-2"
                    >
                      Limpar filtros
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchPage;
