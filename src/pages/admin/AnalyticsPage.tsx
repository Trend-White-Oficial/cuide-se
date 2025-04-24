
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart as BarChartIcon, 
  TrendingUp, 
  Star, 
  Calendar,
  Users
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// Mock data
const mockAppointmentData = [
  { month: 'Jan', count: 25 },
  { month: 'Fev', count: 32 },
  { month: 'Mar', count: 37 },
  { month: 'Abr', count: 45 },
  { month: 'Mai', count: 52 },
  { month: 'Jun', count: 58 },
  { month: 'Jul', count: 64 },
];

const mockUserData = [
  { month: 'Jan', count: 18 },
  { month: 'Fev', count: 24 },
  { month: 'Mar', count: 35 },
  { month: 'Abr', count: 42 },
  { month: 'Mai', count: 48 },
  { month: 'Jun', count: 57 },
  { month: 'Jul', count: 65 },
];

const mockRatingData = [
  { rating: '5 ★', count: 45 },
  { rating: '4 ★', count: 32 },
  { rating: '3 ★', count: 18 },
  { rating: '2 ★', count: 5 },
  { rating: '1 ★', count: 2 },
];

const mockTopServices = [
  { name: 'Manicure', count: 76, growth: '+12%' },
  { name: 'Corte de Cabelo', count: 64, growth: '+8%' },
  { name: 'Limpeza de Pele', count: 48, growth: '+15%' },
  { name: 'Design de Sobrancelhas', count: 39, growth: '+5%' },
  { name: 'Maquiagem', count: 32, growth: '+3%' }
];

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  return (
    <AdminLayout title="Estatísticas e Análises">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold">Estatísticas do Aplicativo</h2>
          
          <div className="inline-flex items-center rounded-md border border-input bg-transparent p-1 text-sm">
            <Button
              variant={timeRange === 'week' ? 'default' : 'ghost'}
              onClick={() => setTimeRange('week')}
              className={timeRange === 'week' ? 'bg-pink hover:bg-pink/90' : ''}
              size="sm"
            >
              Semana
            </Button>
            <Button
              variant={timeRange === 'month' ? 'default' : 'ghost'}
              onClick={() => setTimeRange('month')}
              className={timeRange === 'month' ? 'bg-pink hover:bg-pink/90' : ''}
              size="sm"
            >
              Mês
            </Button>
            <Button
              variant={timeRange === 'year' ? 'default' : 'ghost'}
              onClick={() => setTimeRange('year')}
              className={timeRange === 'year' ? 'bg-pink hover:bg-pink/90' : ''}
              size="sm"
            >
              Ano
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Agendamentos
              </CardTitle>
              <Calendar className="h-8 w-8 text-pink" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">243</div>
              <p className="text-xs text-green-600 mt-1">+18% do mês anterior</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Usuários Ativos
              </CardTitle>
              <Users className="h-8 w-8 text-pink" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">157</div>
              <p className="text-xs text-green-600 mt-1">+12% do mês anterior</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avaliação Média
              </CardTitle>
              <Star className="h-8 w-8 text-pink" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.7</div>
              <p className="text-xs text-green-600 mt-1">+0.2 do mês anterior</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxa de Crescimento
              </CardTitle>
              <TrendingUp className="h-8 w-8 text-pink" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14%</div>
              <p className="text-xs text-green-600 mt-1">+2% do mês anterior</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointments Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Agendamentos por Mês</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockAppointmentData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#FF007F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Users Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Novos Usuários por Mês</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockUserData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#FFD1DC" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ratings Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Distribuição de Avaliações</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockRatingData}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="rating" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#FF007F" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Top Services */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Serviços Mais Populares</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {mockTopServices.map((service, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{service.name}</p>
                        <p className="text-xs text-muted-foreground">{service.count} agendamentos</p>
                      </div>
                      <p className={`text-xs ${service.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {service.growth}
                      </p>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                      <div 
                        className="h-2 rounded-full bg-pink" 
                        style={{ width: `${(service.count / mockTopServices[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;
