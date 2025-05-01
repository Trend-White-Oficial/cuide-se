
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const Privacy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-pink mb-8 text-center">
            Política de Privacidade
          </h1>
          
          <Card className="mb-8">
            <CardContent className="p-6 space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-pink">1. Informações Coletadas</h2>
                <p className="text-gray-700 leading-relaxed">
                  Coletamos apenas as informações necessárias para fornecer nossos serviços, incluindo nome, 
                  e-mail, número de telefone e preferências de agendamento. Todas as informações são protegidas 
                  e utilizadas apenas para melhorar sua experiência no Cuide-Se.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-pink">2. Uso das Informações</h2>
                <p className="text-gray-700 leading-relaxed">
                  Suas informações são utilizadas para:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
                  <li>Facilitar o agendamento de serviços</li>
                  <li>Melhorar nossos serviços e experiência do usuário</li>
                  <li>Enviar confirmações de agendamento</li>
                  <li>Comunicar promoções e novidades (mediante sua autorização)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-pink">3. Proteção de Dados</h2>
                <p className="text-gray-700 leading-relaxed">
                  Implementamos medidas de segurança para proteger suas informações pessoais contra acesso, 
                  alteração ou divulgação não autorizada. Seus dados são criptografados e armazenados com 
                  segurança em nossos servidores.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-pink">4. Seus Direitos</h2>
                <p className="text-gray-700 leading-relaxed">
                  Você tem direito a:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
                  <li>Acessar seus dados pessoais</li>
                  <li>Solicitar correção de informações incorretas</li>
                  <li>Solicitar a exclusão de seus dados</li>
                  <li>Retirar consentimento para comunicações</li>
                </ul>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
