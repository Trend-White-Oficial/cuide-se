
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-8 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-pink mb-4">Cuide-Se</h3>
            <p className="text-gray-600 text-sm">
              Conectando clientes a profissionais de estética feminina, oferecendo uma experiência de agendamento prática, personalizada e segura.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-pink text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-600 hover:text-pink text-sm">
                  Buscar Profissionais
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-pink text-sm">
                  Login / Cadastro
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contato</h3>
            <p className="text-gray-600 text-sm mb-2">contato@cuide-se.com</p>
            <p className="text-gray-600 text-sm">(11) 99999-9999</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6">
          <p className="text-center text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Cuide-Se. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
