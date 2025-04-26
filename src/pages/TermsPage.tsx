import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Termos de Uso</h1>
          
          <div className="prose prose-pink max-w-none">
            <p className="text-gray-600 mb-6">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
              <p className="text-gray-600 mb-4">
                Ao acessar e usar a plataforma Cuide-se, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não poderá acessar o serviço.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Descrição do Serviço</h2>
              <p className="text-gray-600 mb-4">
                O Cuide-se é uma plataforma que conecta profissionais de saúde e bem-estar a potenciais clientes. Nossa missão é facilitar o agendamento de consultas e serviços relacionados à saúde e bem-estar.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Cadastro e Conta</h2>
              <p className="text-gray-600 mb-4">
                Para utilizar nossos serviços, você precisa criar uma conta. Você é responsável por manter a confidencialidade de sua conta e senha, e por todas as atividades que ocorrem em sua conta.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Uso do Serviço</h2>
              <p className="text-gray-600 mb-4">
                Você concorda em usar o serviço apenas para fins legais e de acordo com estes termos. Você não deve usar o serviço de maneira que possa danificar, desativar, sobrecarregar ou prejudicar o serviço.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Conteúdo do Usuário</h2>
              <p className="text-gray-600 mb-4">
                Você mantém todos os direitos sobre qualquer conteúdo que enviar, publicar ou exibir na plataforma. Ao fazer upload de conteúdo, você concede ao Cuide-se uma licença mundial, não exclusiva e isenta de royalties para usar, copiar, modificar e distribuir esse conteúdo.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Privacidade</h2>
              <p className="text-gray-600 mb-4">
                Sua privacidade é importante para nós. Nossa Política de Privacidade explica como coletamos, usamos e protegemos suas informações pessoais.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Limitação de Responsabilidade</h2>
              <p className="text-gray-600 mb-4">
                O Cuide-se não será responsável por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo perda de lucros, dados, uso, boa vontade ou outras perdas intangíveis.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Modificações dos Termos</h2>
              <p className="text-gray-600 mb-4">
                Reservamos o direito de modificar estes termos a qualquer momento. Continuaremos a notificá-lo sobre quaisquer alterações publicando os novos termos nesta página.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contato</h2>
              <p className="text-gray-600 mb-4">
                Se você tiver alguma dúvida sobre estes termos, entre em contato conosco através do email cuide.se.ame@gmail.com.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage; 