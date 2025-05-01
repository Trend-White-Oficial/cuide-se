import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfessionalCard } from '@/components/ProfessionalCard';
import { mockProfessionals } from '@/data/mockData';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const specialties = [
  "Todas especialidades",
  "Manicure", 
  "Cabeleireira", 
  "Especialista em Cílios", 
  "Podóloga"
];

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("Todas especialidades");
  
  // Mostrar apenas alguns profissionais em destaque na home
  const featuredProfessionals = mockProfessionals.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink to-pink-light text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Cuide-Se: Beleza e bem-estar ao seu alcance
            </h1>
            <p className="text-xl mb-8">
              Conectamos você aos melhores profissionais de estética feminina. Agende seu serviço com facilidade e segurança.
            </p>
            
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-xl">
              <div className="flex flex-col md:flex-row gap-4">
                <Select defaultValue={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger className="w-full">
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
                    placeholder="Buscar por localização..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Link to="/search">
                  <Button className="bg-pink hover:bg-pink/90 whitespace-nowrap">
                    Buscar
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Professionals Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Profissionais em destaque</h2>
            <Link to="/search" className="text-pink hover:underline">
              Ver todos
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProfessionals.map((professional) => (
              <ProfessionalCard key={professional.id} professional={professional} />
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-10 text-center">Como funciona</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-pink" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Busque profissionais</h3>
              <p className="text-gray-600">
                Encontre profissionais especializados próximos a você, com filtros por serviço e localização.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-pink" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 13H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 13H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 13H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 17H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Agende um horário</h3>
              <p className="text-gray-600">
                Escolha o serviço desejado e o horário que melhor se encaixa na sua agenda.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-pink" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Receba o serviço</h3>
              <p className="text-gray-600">
                Receba o atendimento de qualidade e compartilhe sua experiência através de avaliações.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-pink-light">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-pink mb-4">Pronta para se cuidar?</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Faça parte da comunidade Cuide-Se e tenha acesso aos melhores profissionais de beleza perto de você.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-pink hover:bg-pink/90 text-white">
              <Link to="/search">
                Encontrar profissionais
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-pink text-pink hover:bg-pink hover:text-white">
              <Link to="/login">
                Criar conta
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HomePage;
