import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { mockUsers, mockProfessionals, mockAppointments } from '@/data/mockData';

const stats = [
  {
    title: 'Total de Usuários',
    value: mockUsers.length,
    icon: Users,
    trend: '+12%',
    description: 'vs. mês anterior',
  },
  {
    title: 'Profissionais Ativos',
    value: mockProfessionals.length,
    icon: Calendar,
    trend: '+5%',
    description: 'vs. mês anterior',
  },
  {
    title: 'Agendamentos',
    value: mockAppointments.length,
    icon: Calendar,
    trend: '+18%',
    description: 'vs. mês anterior',
  },
  {
    title: 'Receita Total',
    value: 'R$ 15.890',
    icon: DollarSign,
    trend: '+8%',
    description: 'vs. mês anterior',
  },
];

export const Dashboard = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">{stat.trend}</span>
              <span className="ml-1">{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 