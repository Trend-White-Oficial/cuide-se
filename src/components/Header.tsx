
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { UserCircle, Settings } from "lucide-react";

const Header = () => {
  // Simular usuário logado ou não
  const isLoggedIn = false;
  
  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-pink">Cuide-Se</h1>
        </Link>
        <div className="text-sm font-medium text-muted-foreground">
          Faça por você, seja você, ame-se.
        </div>
        <nav>
          <ul className="flex gap-6 items-center">
            <li>
              <Link to="/search" className="text-foreground hover:text-pink transition-colors">
                Buscar profissionais
              </Link>
            </li>
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
              <>
                <li>
                  <Link to="/login">
                    <Button className="bg-pink hover:bg-pink/90 text-white">
                      Login / Cadastro
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/login" className="text-gray-500 text-sm hover:text-pink flex items-center">
                    <Settings size={14} className="mr-1" />
                    Área Admin
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
