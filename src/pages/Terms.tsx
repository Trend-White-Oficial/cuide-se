
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const Terms = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-pink mb-8 text-center">
            Termos de Uso
          </h1>
          
          <Card className="mb-8">
            <CardContent className="p-6 space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-pink">1. Aceitação dos Termos</h2>
                <p className="text-gray-700 leading-relaxed">
                  Ao acessar e usar o aplicativo Cuide-Se, você concorda em cumprir estes Termos de Uso.
                  Se você não concordar com algum aspecto destes termos, recomendamos que não utilize nossos serviços.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-pink">2. Uso do Serviço</h2>
                <p className="text-gray-700 leading-relaxed">
                  O Cuide-Se é uma plataforma para conectar clientes a profissionais de estética. Os usuários devem:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
                  <li>Fornecer informações precisas ao criar uma conta</li>
                  <li>Respeitar os horários agendados ou cancelar com antecedência</li>
                  <li>Utilizar a plataforma de maneira respeitosa com todos</li>
                  <li>Não utilizar o serviço para atividades ilegais ou não autorizadas</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-pink">3. Contas e Responsabilidades</h2>
                <p className="text-gray-700 leading-relaxed">
                  Cada usuário é responsável pela segurança de sua conta e senha. 
                  Atividades realizadas em sua conta são de sua inteira responsabilidade.
                  Profissionais são responsáveis pelos serviços prestados e pela veracidade das informações fornecidas.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-pink">4. Cancelamentos e Reembolsos</h2>
                <p className="text-gray-700 leading-relaxed">
                  Cancelamentos devem ser realizados com pelo menos 24 horas de antecedência.
                  Reembolsos são processados de acordo com a política individual de cada profissional.
                  O Cuide-Se atua apenas como intermediário e não se responsabiliza por políticas individuais de cancelamento.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
