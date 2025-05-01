import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Sobre o Cuide-Se</h1>
          
          <div className="prose prose-pink max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              O Cuide-Se é uma plataforma que conecta clientes a profissionais de estética feminina, 
              oferecendo uma experiência de agendamento prática, personalizada e segura.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Nossa Missão</h2>
            <p className="text-gray-700 mb-6">
              Nossa missão é facilitar o acesso a serviços de beleza e bem-estar de qualidade, 
              conectando profissionais talentosos a clientes que buscam cuidar de si mesmas.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Como Funcionamos</h2>
            <p className="text-gray-700 mb-6">
              O Cuide-Se funciona como uma ponte entre profissionais de estética e clientes. 
              Nossa plataforma permite que os profissionais divulguem seus serviços e portfólio, 
              enquanto os clientes podem encontrar, avaliar e agendar serviços com facilidade.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Nossos Valores</h2>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li className="mb-2">Qualidade e excelência em todos os serviços</li>
              <li className="mb-2">Transparência e confiança entre profissionais e clientes</li>
              <li className="mb-2">Inovação constante para melhorar a experiência do usuário</li>
              <li className="mb-2">Compromisso com a satisfação do cliente</li>
              <li className="mb-2">Respeito e valorização dos profissionais</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Nossa Equipe</h2>
            <p className="text-gray-700 mb-6">
              Somos uma equipe apaixonada por beleza e tecnologia, dedicada a criar uma plataforma 
              que transforme a forma como as pessoas acessam serviços de estética.
            </p>
            
            <div className="bg-pink-light p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold text-pink mb-3">Junte-se a nós!</h3>
              <p className="text-gray-700 mb-4">
                Se você é um profissional de estética ou está buscando serviços de qualidade, 
                o Cuide-Se é o lugar perfeito para você.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/search" 
                  className="inline-block bg-pink text-white px-6 py-2 rounded-md hover:bg-pink/90 text-center"
                >
                  Encontrar profissionais
                </a>
                <a 
                  href="/login" 
                  className="inline-block border border-pink text-pink px-6 py-2 rounded-md hover:bg-pink hover:text-white text-center"
                >
                  Cadastre-se como profissional
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage; 