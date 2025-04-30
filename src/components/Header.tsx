
// Componente Header
// Barra de navegação principal do site
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";

const Header = () => {
  // Estado que simula se o usuário está logado ou não
  const isLoggedIn = false;
  
  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo e nome do site */}
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-pink">Cuide-Se</h1>
        </Link>
        {/* Slogan do site */}
        <div className="text-sm font-medium text-muted-foreground">
          Faça por você, seja você, ame-se.
        </div>
        {/* Menu de navegação */}
        <nav>
          <ul className="flex gap-6 items-center">
            {/* Link para busca de profissionais */}
            <li>
              <Link to="/search" className="text-foreground hover:text-pink transition-colors">
                Buscar profissionais
              </Link>
            </li>
            {/* Botão de perfil/login */}
            {isLoggedIn ? (
              <li>
                <Link to="/profile">
                  <Button variant="outline" className="gap-2">
                    <UserCircle className="h-4 w-4" />
                    Meu Perfil
                  </Button>
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/login">
                  <Button className="bg-pink hover:bg-pink/90 text-white">
                    Login / Cadastro
                  </Button>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
