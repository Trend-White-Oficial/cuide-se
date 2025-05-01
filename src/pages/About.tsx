
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-pink mb-8 text-center">
            Sobre o Cuide-Se
          </h1>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-pink">Nossa Missão</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Empoderar mulheres por meio do autocuidado e da autoestima, conectando-as aos melhores profissionais 
                de beleza e bem-estar. Acreditamos que cuidar de si é um ato de amor próprio e uma forma de 
                celebrar nossa singularidade.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 text-pink">Nossos Valores</h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="h-2 w-2 rounded-full bg-pink mt-2 mr-3"></span>
                  <span>Excelência no atendimento e qualidade dos serviços</span>
                </li>
                <li className="flex items-start">
                  <span className="h-2 w-2 rounded-full bg-pink mt-2 mr-3"></span>
                  <span>Respeito à individualidade e necessidades de cada cliente</span>
                </li>
                <li className="flex items-start">
                  <span className="h-2 w-2 rounded-full bg-pink mt-2 mr-3"></span>
                  <span>Compromisso com a segurança e bem-estar</span>
                </li>
                <li className="flex items-start">
                  <span className="h-2 w-2 rounded-full bg-pink mt-2 mr-3"></span>
                  <span>Valorização dos profissionais e suas especialidades</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-pink">Como Funciona</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-light/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-pink">1</span>
                  </div>
                  <h3 className="font-medium mb-2">Busque Profissionais</h3>
                  <p className="text-sm text-gray-600">
                    Encontre os melhores profissionais da sua região
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-light/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-pink">2</span>
                  </div>
                  <h3 className="font-medium mb-2">Agende Serviços</h3>
                  <p className="text-sm text-gray-600">
                    Escolha o serviço e horário que melhor te atende
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-light/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-pink">3</span>
                  </div>
                  <h3 className="font-medium mb-2">Avalie e Compartilhe</h3>
                  <p className="text-sm text-gray-600">
                    Contribua com sua experiência e indique para amigas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
