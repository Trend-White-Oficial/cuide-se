
<<<<<<< HEAD
=======
// Componente de Layout Administrativo
// Este componente serve como container para todas as páginas administrativas
// Gerencia a autenticação e fornece a navegação do painel
>>>>>>> c83d66dd46fb5daddadb7b640808220c66dc3f97
import { ReactNode, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
  Tag,
  BarChart,
  FileImage
} from 'lucide-react';

type AdminLayoutProps = {
<<<<<<< HEAD
  children: ReactNode;
  title: string;
=======
  children: ReactNode; // Conteúdo das páginas administrativas
  title: string; // Título da página atual
>>>>>>> c83d66dd46fb5daddadb7b640808220c66dc3f97
};

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const navigate = useNavigate();

<<<<<<< HEAD
  useEffect(() => {
    // Check if admin is authenticated
=======
  // Verifica se o usuário está autenticado
  useEffect(() => {
>>>>>>> c83d66dd46fb5daddadb7b640808220c66dc3f97
    const isAdminAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
    }
  }, [navigate]);

<<<<<<< HEAD
  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminLastLogin');
=======
  // Função para logout
  const handleLogout = () => {
    // Remove as credenciais do localStorage
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminLastLogin');
    // Redireciona para a página de login
>>>>>>> c83d66dd46fb5daddadb7b640808220c66dc3f97
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
<<<<<<< HEAD
      {/* Sidebar */}
=======
      {/* Barra lateral de navegação */}
>>>>>>> c83d66dd46fb5daddadb7b640808220c66dc3f97
      <div className="w-64 bg-white shadow-lg hidden md:block">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-pink">Cuide-Se Admin</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
<<<<<<< HEAD
=======
            {/* Link para o Dashboard */}
>>>>>>> c83d66dd46fb5daddadb7b640808220c66dc3f97
            <li>
              <Link to="/admin/dashboard" className="flex items-center p-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-pink">
                <LayoutDashboard size={20} className="mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="flex items-center p-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-pink">
                <Users size={20} className="mr-3" />
                Usuários
              </Link>
            </li>
            <li>
              <Link to="/admin/professionals" className="flex items-center p-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-pink">
                <Calendar size={20} className="mr-3" />
                Profissionais
              </Link>
            </li>
            <li>
              <Link to="/admin/assets" className="flex items-center p-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-pink">
                <FileImage size={20} className="mr-3" />
                Imagens & Logo
              </Link>
            </li>
            <li>
              <Link to="/admin/promotions" className="flex items-center p-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-pink">
                <Tag size={20} className="mr-3" />
                Promoções
              </Link>
            </li>
            <li>
              <Link to="/admin/analytics" className="flex items-center p-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-pink">
                <BarChart size={20} className="mr-3" />
                Estatísticas
              </Link>
            </li>
            <li>
              <Link to="/admin/settings" className="flex items-center p-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-pink">
                <Settings size={20} className="mr-3" />
                Configurações
              </Link>
            </li>
          </ul>
          <div className="mt-8 pt-4 border-t">
            <Button 
              variant="ghost" 
              className="w-full flex items-center justify-start text-gray-700 hover:text-pink"
              onClick={handleLogout}
            >
              <LogOut size={20} className="mr-3" />
              Sair
            </Button>
          </div>
        </nav>
      </div>
      
      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-10">
        <div className="flex justify-around p-2">
          <Link to="/admin/dashboard" className="p-2 text-gray-700 hover:text-pink flex flex-col items-center text-xs">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/users" className="p-2 text-gray-700 hover:text-pink flex flex-col items-center text-xs">
            <Users size={20} />
            <span>Usuários</span>
          </Link>
          <Link to="/admin/professionals" className="p-2 text-gray-700 hover:text-pink flex flex-col items-center text-xs">
            <Calendar size={20} />
            <span>Profissionais</span>
          </Link>
          <Link to="/admin/settings" className="p-2 text-gray-700 hover:text-pink flex flex-col items-center text-xs">
            <Settings size={20} />
            <span>Mais</span>
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            <Button 
              variant="outline" 
              className="md:hidden"
              onClick={handleLogout}
            >
              <LogOut size={18} />
            </Button>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
