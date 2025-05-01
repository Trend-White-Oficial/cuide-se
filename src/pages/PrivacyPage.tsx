import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Política de Privacidade</h1>
          
          <div className="prose prose-pink max-w-none">
            <p className="text-gray-600 mb-6">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introdução</h2>
              <p className="text-gray-600 mb-4">
                Esta Política de Privacidade descreve como o Cuide-se coleta, usa e compartilha suas informações pessoais quando você utiliza nossa plataforma. Ao usar nossos serviços, você concorda com a coleta e uso de informações de acordo com esta política.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Informações que Coletamos</h2>
              <div className="text-gray-600 mb-4">
                <p className="mb-2">Coletamos os seguintes tipos de informações:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Informações de cadastro (nome, email, telefone, endereço)</li>
                  <li>Informações de perfil profissional (especialidade, experiência, certificações)</li>
                  <li>Dados de agendamento e histórico de consultas</li>
                  <li>Informações de pagamento</li>
                  <li>Dados de uso da plataforma</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Como Usamos suas Informações</h2>
              <div className="text-gray-600 mb-4">
                <p className="mb-2">Utilizamos suas informações para:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Fornecer e manter nossos serviços</li>
                  <li>Processar seus agendamentos e pagamentos</li>
                  <li>Enviar notificações e atualizações</li>
                  <li>Melhorar nossa plataforma</li>
                  <li>Prevenir fraudes e garantir a segurança</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Compartilhamento de Informações</h2>
              <p className="text-gray-600 mb-4">
                Não vendemos suas informações pessoais. Compartilhamos suas informações apenas com terceiros que nos ajudam a operar nossa plataforma, como provedores de processamento de pagamento e serviços de hospedagem.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Segurança dos Dados</h2>
              <p className="text-gray-600 mb-4">
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais. No entanto, nenhum método de transmissão pela internet é 100% seguro.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Seus Direitos</h2>
              <div className="text-gray-600 mb-4">
                <p className="mb-2">Você tem direito a:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Acessar suas informações pessoais</li>
                  <li>Corrigir informações imprecisas</li>
                  <li>Solicitar a exclusão de seus dados</li>
                  <li>Retirar seu consentimento</li>
                  <li>Exportar seus dados</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Cookies e Tecnologias Similares</h2>
              <p className="text-gray-600 mb-4">
                Utilizamos cookies e tecnologias similares para melhorar sua experiência em nossa plataforma. Você pode controlar o uso de cookies através das configurações do seu navegador.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Alterações na Política</h2>
              <p className="text-gray-600 mb-4">
                Podemos atualizar esta política periodicamente. Notificaremos você sobre quaisquer alterações publicando a nova política nesta página.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contato</h2>
              <p className="text-gray-600 mb-4">
                Se você tiver dúvidas sobre esta política ou sobre como tratamos suas informações pessoais, entre em contato conosco através do email privacidade@cuide-se.com.br.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage; 