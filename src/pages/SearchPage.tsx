import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { mockProfessionals } from '@/data/mockData';
import { ProfessionalCard } from '@/components/ProfessionalCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Professional } from '@/types';
import { Search } from 'lucide-react';

const specialties = [
  "Todas especialidades",
  "Manicure", 
  "Cabeleireira", 
  "Especialista em Cílios", 
  "Podóloga"
];

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("Todas especialidades");
  
  // Filtrar profissionais com base na especialidade e termo de busca
  const filteredProfessionals = mockProfessionals.filter((professional) => {
    const matchesSpecialty = selectedSpecialty === "Todas especialidades" || 
                            professional.specialty === selectedSpecialty;
    
    const matchesSearch = professional.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         professional.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSpecialty && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-pink-light/30 py-8">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Buscar Profissionais</h1>
            
            <div className="flex flex-col md:flex-row gap-4 max-w-3xl">
              <Select 
                defaultValue={selectedSpecialty} 
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
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-6 py-8">
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
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchPage;
