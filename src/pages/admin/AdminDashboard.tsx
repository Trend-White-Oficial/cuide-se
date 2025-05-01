
// Componente principal do Dashboard Administrativo
// Este componente exibe as principais métricas e atividades do sistema
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Star, Tag } from 'lucide-react';

const AdminDashboard = () => {
  // Dados estatísticos do dashboard (em produção, estes dados viriam de uma API)
  const stats = [
    { id: 1, title: 'Usuários ativos', value: '157', icon: <Users className="h-8 w-8 text-pink" />, change: '+12%' },
    { id: 2, title: 'Agendamentos', value: '243', icon: <Calendar className="h-8 w-8 text-pink" />, change: '+18%' },
    { id: 3, title: 'Avaliações', value: '89', icon: <Star className="h-8 w-8 text-pink" />, change: '+7%' },
    { id: 4, title: 'Cupons Ativos', value: '5', icon: <Tag className="h-8 w-8 text-pink" />, change: '0' },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Seção de Visão Geral */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Visão Geral</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Cards estatísticos */}
            {stats.map((stat) => (
              <Card key={stat.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  {/* Exibe a variação percentual com cores diferentes */}
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.change.startsWith('+') ? (
                      <span className="text-green-600">{stat.change} do mês anterior</span>
                    ) : stat.change === '0' ? (
                      <span className="text-gray-500">Sem alteração</span>
                    ) : (
                      <span className="text-red-600">{stat.change} do mês anterior</span>
                    )}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Seção de Atividade Recente */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Ana Silva agendou manicure para 15/05', 
                  'Carlos Gomes avaliou com 5 estrelas',
                  'Maria Souza cancelou agendamento',
                  'Novo profissional cadastrado: Juliana'].map((activity, i) => (
                  <div key={i} className="flex items-center pb-2 border-b last:border-0">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{activity}</p>
                      <p className="text-xs text-muted-foreground">{`${2 * i} horas atrás`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Serviços Populares</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { service: 'Manicure', count: 45 },
                  { service: 'Corte de Cabelo', count: 38 },
                  { service: 'Limpeza de Pele', count: 32 },
                  { service: 'Design de Sobrancelha', count: 28 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between pb-2 border-b last:border-0">
                    <span>{item.service}</span>
                    <span className="bg-pink-light text-pink rounded-full px-2 py-1 text-xs">
                      {item.count} agendamentos
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
