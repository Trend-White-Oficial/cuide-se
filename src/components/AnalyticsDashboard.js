import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AnalyticsService from '../services/AnalyticsService';
import { accessibilityConfig } from '../config/accessibility';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AnalyticsDashboard = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: subMonths(new Date(), 1),
    end: new Date()
  });
  const [metrics, setMetrics] = useState({
    appointments: null,
    revenue: null,
    customers: null,
    services: null
  });

  useEffect(() => {
    loadMetrics();
  }, [dateRange]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const [appointments, revenue, customers, services] = await Promise.all([
        AnalyticsService.getAppointmentMetrics(dateRange.start, dateRange.end),
        AnalyticsService.getRevenueMetrics(dateRange.start, dateRange.end),
        AnalyticsService.getCustomerMetrics(dateRange.start, dateRange.end),
        AnalyticsService.getServiceMetrics(dateRange.start, dateRange.end)
      ]);

      setMetrics({
        appointments,
        revenue,
        customers,
        services
      });
    } catch (error) {
      setError(t('Erro ao carregar métricas. Por favor, tente novamente.'));
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (start, end) => {
    setDateRange({ start, end });
  };

  if (loading) {
    return (
      <div style={{ padding: accessibilityConfig.spacing.medium }}>
        {t('Carregando métricas...')}
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: accessibilityConfig.spacing.medium,
          color: accessibilityConfig.colors.error
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      style={{
        padding: accessibilityConfig.spacing.medium,
        backgroundColor: accessibilityConfig.colors.background
      }}
    >
      <h1 style={{ fontSize: accessibilityConfig.typography.large }}>
        {t('Dashboard de Analytics')}
      </h1>

      <div style={{ marginBottom: accessibilityConfig.spacing.medium }}>
        <h2 style={{ fontSize: accessibilityConfig.typography.medium }}>
          {t('Métricas de Agendamentos')}
        </h2>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={Object.entries(metrics.appointments.byDay).map(([date, count]) => ({
              date,
              count
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginBottom: accessibilityConfig.spacing.medium }}>
        <h2 style={{ fontSize: accessibilityConfig.typography.medium }}>
          {t('Receita por Período')}
        </h2>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={Object.entries(metrics.revenue.byPeriod).map(([period, amount]) => ({
              period,
              amount
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginBottom: accessibilityConfig.spacing.medium }}>
        <h2 style={{ fontSize: accessibilityConfig.typography.medium }}>
          {t('Distribuição de Clientes por Nível')}
        </h2>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={Object.entries(metrics.customers.byLoyaltyLevel).map(([level, count]) => ({
                  name: level,
                  value: count
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {Object.entries(metrics.customers.byLoyaltyLevel).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: accessibilityConfig.typography.medium }}>
          {t('Serviços Mais Populares')}
        </h2>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.services.mostPopular}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="appointments" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 