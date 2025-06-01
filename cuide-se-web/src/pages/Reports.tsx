import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { supabase, formatCurrency } from '../services/supabase';

interface ReportData {
  revenueByMonth: {
    month: string;
    revenue: number;
  }[];
  revenueByService: {
    service: string;
    revenue: number;
  }[];
  revenueByProfessional: {
    professional: string;
    revenue: number;
  }[];
  topProducts: {
    product: string;
    quantity: number;
    revenue: number;
  }[];
  totalRevenue: number;
  totalAppointments: number;
  totalOrders: number;
  averageTicket: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const Reports: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    endDate: new Date(),
  });
  const [reportType, setReportType] = useState('revenue');

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar dados de agendamentos
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          *,
          service:service_id(name, price),
          professional:professional_id(name)
        `)
        .gte('date', dateRange.startDate.toISOString())
        .lte('date', dateRange.endDate.toISOString());

      if (appointmentsError) throw appointmentsError;

      // Buscar dados de comandas
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            *,
            service:service_id(name, price),
            product:product_id(name, price)
          )
        `)
        .gte('date', dateRange.startDate.toISOString())
        .lte('date', dateRange.endDate.toISOString());

      if (ordersError) throw ordersError;

      // Processar dados
      const processedData = processReportData(
        appointmentsData || [],
        ordersData || []
      );
      setReportData(processedData);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const processReportData = (
    appointments: any[],
    orders: any[]
  ): ReportData => {
    // Processar receita por mês
    const revenueByMonth = processRevenueByMonth(appointments, orders);

    // Processar receita por serviço
    const revenueByService = processRevenueByService(appointments, orders);

    // Processar receita por profissional
    const revenueByProfessional = processRevenueByProfessional(appointments);

    // Processar produtos mais vendidos
    const topProducts = processTopProducts(orders);

    // Calcular totais
    const totalRevenue = revenueByMonth.reduce(
      (sum, item) => sum + item.revenue,
      0
    );
    const totalAppointments = appointments.length;
    const totalOrders = orders.length;
    const averageTicket =
      totalRevenue / (totalAppointments + totalOrders) || 0;

    return {
      revenueByMonth,
      revenueByService,
      revenueByProfessional,
      topProducts,
      totalRevenue,
      totalAppointments,
      totalOrders,
      averageTicket,
    };
  };

  const processRevenueByMonth = (appointments: any[], orders: any[]) => {
    const months: { [key: string]: number } = {};
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);

    // Inicializar meses
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setMonth(date.getMonth() + 1)
    ) {
      const monthKey = date.toLocaleString('pt-BR', {
        month: 'short',
        year: 'numeric',
      });
      months[monthKey] = 0;
    }

    // Somar receita de agendamentos
    appointments.forEach((appointment) => {
      const date = new Date(appointment.date);
      const monthKey = date.toLocaleString('pt-BR', {
        month: 'short',
        year: 'numeric',
      });
      months[monthKey] += appointment.service.price;
    });

    // Somar receita de comandas
    orders.forEach((order) => {
      const date = new Date(order.date);
      const monthKey = date.toLocaleString('pt-BR', {
        month: 'short',
        year: 'numeric',
      });
      order.items.forEach((item: any) => {
        months[monthKey] += item.total;
      });
    });

    return Object.entries(months).map(([month, revenue]) => ({
      month,
      revenue,
    }));
  };

  const processRevenueByService = (appointments: any[], orders: any[]) => {
    const services: { [key: string]: number } = {};

    // Somar receita de agendamentos
    appointments.forEach((appointment) => {
      const serviceName = appointment.service.name;
      services[serviceName] = (services[serviceName] || 0) + appointment.service.price;
    });

    // Somar receita de comandas
    orders.forEach((order) => {
      order.items.forEach((item: any) => {
        if (item.type === 'service') {
          const serviceName = item.service.name;
          services[serviceName] = (services[serviceName] || 0) + item.total;
        }
      });
    });

    return Object.entries(services)
      .map(([service, revenue]) => ({
        service,
        revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  };

  const processRevenueByProfessional = (appointments: any[]) => {
    const professionals: { [key: string]: number } = {};

    appointments.forEach((appointment) => {
      const professionalName = appointment.professional.name;
      professionals[professionalName] =
        (professionals[professionalName] || 0) + appointment.service.price;
    });

    return Object.entries(professionals)
      .map(([professional, revenue]) => ({
        professional,
        revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  };

  const processTopProducts = (orders: any[]) => {
    const products: {
      [key: string]: { quantity: number; revenue: number };
    } = {};

    orders.forEach((order) => {
      order.items.forEach((item: any) => {
        if (item.type === 'product') {
          const productName = item.product.name;
          if (!products[productName]) {
            products[productName] = { quantity: 0, revenue: 0 };
          }
          products[productName].quantity += item.quantity;
          products[productName].revenue += item.total;
        }
      });
    });

    return Object.entries(products)
      .map(([product, data]) => ({
        product,
        quantity: data.quantity,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Relatórios
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <DatePicker
                label="Data Inicial"
                value={dateRange.startDate}
                onChange={(date) =>
                  setDateRange({ ...dateRange, startDate: date || new Date() })
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DatePicker
                label="Data Final"
                value={dateRange.endDate}
                onChange={(date) =>
                  setDateRange({ ...dateRange, endDate: date || new Date() })
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Relatório</InputLabel>
                <Select
                  value={reportType}
                  label="Tipo de Relatório"
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <MenuItem value="revenue">Receita</MenuItem>
                  <MenuItem value="services">Serviços</MenuItem>
                  <MenuItem value="professionals">Profissionais</MenuItem>
                  <MenuItem value="products">Produtos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                fullWidth
                onClick={fetchReportData}
              >
                Atualizar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {reportData && (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Receita Total
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(reportData.totalRevenue)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total de Agendamentos
                  </Typography>
                  <Typography variant="h5">
                    {reportData.totalAppointments}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total de Comandas
                  </Typography>
                  <Typography variant="h5">
                    {reportData.totalOrders}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Ticket Médio
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(reportData.averageTicket)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Receita por Mês
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={reportData.revenueByMonth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => formatCurrency(value as number)}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          name="Receita"
                          stroke="#8884d8"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {reportType === 'services' && (
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Receita por Serviço
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={reportData.revenueByService}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="service" />
                          <YAxis />
                          <Tooltip
                            formatter={(value) => formatCurrency(value as number)}
                          />
                          <Legend />
                          <Bar
                            dataKey="revenue"
                            name="Receita"
                            fill="#8884d8"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {reportType === 'professionals' && (
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Receita por Profissional
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={reportData.revenueByProfessional}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="professional" />
                          <YAxis />
                          <Tooltip
                            formatter={(value) => formatCurrency(value as number)}
                          />
                          <Legend />
                          <Bar
                            dataKey="revenue"
                            name="Receita"
                            fill="#8884d8"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {reportType === 'products' && (
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Produtos Mais Vendidos
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={reportData.topProducts}
                            dataKey="quantity"
                            nameKey="product"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            {reportData.topProducts.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
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
            )}
          </Grid>
        </>
      )}
    </Box>
  );
}; 