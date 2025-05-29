import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Star,
  Settings,
  MessageSquare,
  FileText,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/admin',
  },
  {
    icon: Users,
    label: 'Usuários',
    path: '/admin/users',
  },
  {
    icon: Star,
    label: 'Profissionais',
    path: '/admin/professionals',
  },
  {
    icon: Calendar,
    label: 'Agendamentos',
    path: '/admin/appointments',
  },
  {
    icon: Settings,
    label: 'Configurações',
    path: '/admin/settings',
  },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-pink">Cuide-se</h1>
        <p className="text-sm text-gray-500">Painel Administrativo</p>
      </div>

      <nav className="px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-pink/10 text-pink'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <button
          className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors w-full"
          onClick={() => {
            // Implementar lógica de logout
            console.log('Logout');
          }}
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}; 