import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Header } from '../../components/ui/Header';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';

interface DashboardData {
  todayAppointments: number;
  weekAppointments: number;
  totalClients: number;
  totalServices: number;
  recentAppointments: any[];
}

export const ProfessionalHomeScreen: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));

      const [
        todayAppointmentsRes,
        weekAppointmentsRes,
        clientsRes,
        servicesRes,
        recentAppointmentsRes,
      ] = await Promise.all([
        supabase
          .from('appointments')
          .select('id')
          .eq('professional_id', user?.id)
          .gte('date', new Date().toISOString().split('T')[0])
          .lt('date', new Date(Date.now() + 86400000).toISOString().split('T')[0]),
        supabase
          .from('appointments')
          .select('id')
          .eq('professional_id', user?.id)
          .gte('date', weekStart.toISOString().split('T')[0]),
        supabase
          .from('clients')
          .select('id')
          .eq('professional_id', user?.id),
        supabase
          .from('services')
          .select('id')
          .eq('professional_id', user?.id),
        supabase
          .from('appointments')
          .select(`
            *,
            client:clients(*),
            service:services(*)
          `)
          .eq('professional_id', user?.id)
          .order('date', { ascending: true })
          .limit(5),
      ]);

      if (todayAppointmentsRes.error) throw todayAppointmentsRes.error;
      if (weekAppointmentsRes.error) throw weekAppointmentsRes.error;
      if (clientsRes.error) throw clientsRes.error;
      if (servicesRes.error) throw servicesRes.error;
      if (recentAppointmentsRes.error) throw recentAppointmentsRes.error;

      setData({
        todayAppointments: todayAppointmentsRes.data.length,
        weekAppointments: weekAppointmentsRes.data.length,
        totalClients: clientsRes.data.length,
        totalServices: servicesRes.data.length,
        recentAppointments: recentAppointmentsRes.data,
      });
    } catch (err) {
      setError('Erro ao carregar dados do dashboard.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return <LoadingSpinner message="Carregando dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchDashboardData} />;
  }

  return (
    <View style={styles.container}>
      <Header title="Dashboard" />
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Header title="Agendamentos Hoje" showBackButton={false} />
            <Header
              title={data?.todayAppointments.toString() || '0'}
              showBackButton={false}
            />
          </View>
          <View style={styles.statCard}>
            <Header title="Agendamentos da Semana" showBackButton={false} />
            <Header
              title={data?.weekAppointments.toString() || '0'}
              showBackButton={false}
            />
          </View>
          <View style={styles.statCard}>
            <Header title="Total de Clientes" showBackButton={false} />
            <Header
              title={data?.totalClients.toString() || '0'}
              showBackButton={false}
            />
          </View>
          <View style={styles.statCard}>
            <Header title="Total de Serviços" showBackButton={false} />
            <Header
              title={data?.totalServices.toString() || '0'}
              showBackButton={false}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Header title="Próximos Agendamentos" showBackButton={false} />
          {data?.recentAppointments.length ? (
            data.recentAppointments.map(appointment => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <Header
                  title={appointment.client.name}
                  showBackButton={false}
                />
                <Header
                  title={appointment.service.name}
                  showBackButton={false}
                />
                <Header
                  title={`${new Date(appointment.date).toLocaleDateString()} ${new Date(
                    appointment.time
                  ).toLocaleTimeString()}`}
                  showBackButton={false}
                />
              </View>
            ))
          ) : (
            <EmptyState
              icon="calendar"
              title="Nenhum agendamento"
              message="Você não tem agendamentos próximos."
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  section: {
    padding: 16,
  },
  appointmentCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
}); 