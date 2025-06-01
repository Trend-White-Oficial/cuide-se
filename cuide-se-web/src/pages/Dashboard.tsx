import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { supabase, formatCurrency } from '../services/supabase';

interface DashboardData {
  revenue: {
    total: number;
    by_month: { month: string; value: number }[];
    by_service: { service: string; value: number }[];
    by_professional: { professional: string; value: number }[];
  };
  appointments: {
    total: number;
    completed: number;
    cancelled: number;
    by_status: { status: string; count: number }[];
  };
  clients: {
    total: number;
    new: number;
    returning: number;
    by_month: { month: string; count: number }[];
  };
  services: {
    total: number;
    popular: { name: string; count: number }[];
  };
  recent_appointments: {
    id: string;
    client_name: string;
    service_name: string;
    professional_name: string;
    date: string;
    status: string;
    value: number;
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar dados de faturamento
      const { data: revenueData, error: revenueError } = await supabase
        .from('appointments')
        .select(`
          *,
          service:service_id(name),
          professional:professional_id(name)
        `)
        .gte('date', new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString());

      if (revenueError) throw revenueError;

      // Buscar dados de clientes
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString());

      if (clientsError) throw clientsError;

      // Processar dados
      const processedData = processDashboardData(revenueData, clientsData);
      setData(processedData);
    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const processDashboardData = (revenueData: any[], clientsData: any[]): DashboardData => {
    // Processar faturamento por mês
    const revenueByMonth = revenueData.reduce((acc: any[], curr) => {
      const month = new Date(curr.date).toLocaleString('pt-BR', { month: 'short' });
      const existingMonth = acc.find((item) => item.month === month);
      if (existingMonth) {
        existingMonth.value += curr.value;
      } else {
        acc.push({ month, value: curr.value });
      }
      return acc;
    }, []);

    // Processar faturamento por serviço
    const revenueByService = revenueData.reduce((acc: any[], curr) => {
      const existingService = acc.find((item) => item.service === curr.service.name);
      if (existingService) {
        existingService.value += curr.value;
      } else {
        acc.push({ service: curr.service.name, value: curr.value });
      }
      return acc;
    }, []);

    // Processar faturamento por profissional
    const revenueByProfessional = revenueData.reduce((acc: any[], curr) => {
      const existingProfessional = acc.find((item) => item.professional === curr.professional.name);
      if (existingProfessional) {
        existingProfessional.value += curr.value;
      } else {
        acc.push({ professional: curr.professional.name, value: curr.value });
      }
      return acc;
    }, []);

    // Processar status dos agendamentos
    const appointmentsByStatus = revenueData.reduce((acc: any[], curr) => {
      const existingStatus = acc.find((item) => item.status === curr.status);
      if (existingStatus) {
        existingStatus.count += 1;
      } else {
        acc.push({ status: curr.status, count: 1 });
      }
      return acc;
    }, []);

    // Processar clientes por mês
    const clientsByMonth = clientsData.reduce((acc: any[], curr) => {
      const month = new Date(curr.created_at).toLocaleString('pt-BR', { month: 'short' });
      const existingMonth = acc.find((item) => item.month === month);
      if (existingMonth) {
        existingMonth.count += 1;
      } else {
        acc.push({ month, count: 1 });
      }
      return acc;
    }, []);

    // Processar serviços populares
    const popularServices = revenueData.reduce((acc: any[], curr) => {
      const existingService = acc.find((item) => item.name === curr.service.name);
      if (existingService) {
        existingService.count += 1;
      } else {
        acc.push({ name: curr.service.name, count: 1 });
      }
      return acc;
    }, []);

    // Ordenar e limitar dados
    const sortedRevenueByMonth = revenueByMonth.sort((a, b) => {
      const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });

    const sortedRevenueByService = revenueByService
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const sortedRevenueByProfessional = revenueByProfessional
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const sortedPopularServices = popularServices
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calcular totais
    const totalRevenue = revenueData.reduce((sum, curr) => sum + curr.value, 0);
    const totalAppointments = revenueData.length;
    const completedAppointments = revenueData.filter((curr) => curr.status === 'completed').length;
    const cancelledAppointments = revenueData.filter((curr) => curr.status === 'cancelled').length;
    const totalClients = clientsData.length;
    const newClients = clientsData.filter(
      (curr) => new Date(curr.created_at) > new Date(new Date().setMonth(new Date().getMonth() - 1))
    ).length;

    return {
      revenue: {
        total: totalRevenue,
        by_month: sortedRevenueByMonth,
        by_service: sortedRevenueByService,
        by_professional: sortedRevenueByProfessional,
      },
      appointments: {
        total: totalAppointments,
        completed: completedAppointments,
        cancelled: cancelledAppointments,
        by_status: appointmentsByStatus,
      },
      clients: {
        total: totalClients,
        new: newClients,
        returning: totalClients - newClients,
        by_month: clientsByMonth,
      },
      services: {
        total: popularServices.length,
        popular: sortedPopularServices,
      },
      recent_appointments: revenueData
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
        .map((curr) => ({
          id: curr.id,
          client_name: curr.client_name,
          service_name: curr.service.name,
          professional_name: curr.professional.name,
          date: new Date(curr.date).toLocaleDateString('pt-BR'),
          status: curr.status,
          value: curr.value,
        })),
    };
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || 'Erro ao carregar dados'}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Cards de Resumo */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Faturamento Total
              </Typography>
              <Typography variant="h5">
                {formatCurrency(data.revenue.total)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Agendamentos
              </Typography>
              <Typography variant="h5">
                {data.appointments.total} ({data.appointments.completed} concluídos)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Clientes
              </Typography>
              <Typography variant="h5">
                {data.clients.total} ({data.clients.new} novos)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Serviços
              </Typography>
              <Typography variant="h5">{data.services.total}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráficos */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Faturamento por Mês
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.revenue.by_month}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Faturamento"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Status dos Agendamentos
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.appointments.by_status}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {data.appointments.by_status.map((entry, index) => (
                        <Cell key={entry.status} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Faturamento por Serviço
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.revenue.by_service}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="service" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="value" name="Faturamento" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Faturamento por Profissional
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.revenue.by_professional}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="professional" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="value" name="Faturamento" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tabela de Agendamentos Recentes */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Agendamentos Recentes
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Cliente</TableCell>
                      <TableCell>Serviço</TableCell>
                      <TableCell>Profissional</TableCell>
                      <TableCell>Data</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Valor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.recent_appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{appointment.client_name}</TableCell>
                        <TableCell>{appointment.service_name}</TableCell>
                        <TableCell>{appointment.professional_name}</TableCell>
                        <TableCell>{appointment.date}</TableCell>
                        <TableCell>{appointment.status}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(appointment.value)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}; 