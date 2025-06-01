import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Header } from '../../components/ui/Header';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { EmptyState } from '../../components/ui/EmptyState';
import { SearchBar } from '../../components/ui/SearchBar';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  appointments_count: number;
  last_appointment: string | null;
}

export const ProfessionalClientsScreen: React.FC = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchClients = async () => {
    try {
      setError(null);
      let query = supabase
        .from('clients')
        .select(`
          *,
          appointments:appointments(count),
          last_appointment:appointments(date)
        `)
        .eq('professional_id', user?.id)
        .order('name', { ascending: true });

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      const { data, error: err } = await query;

      if (err) throw err;

      const formattedClients = data?.map(client => ({
        id: client.id,
        name: client.name,
        phone: client.phone,
        email: client.email,
        appointments_count: client.appointments?.[0]?.count || 0,
        last_appointment: client.last_appointment?.[0]?.date || null,
      })) || [];

      setClients(formattedClients);
    } catch (err) {
      setError('Erro ao carregar clientes.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchClients();
  };

  const handleViewClientDetails = (clientId: string) => {
    // TODO: Implementar navegação para detalhes do cliente
    console.log('Ver detalhes do cliente:', clientId);
  };

  if (loading) {
    return <LoadingSpinner message="Carregando clientes..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchClients} />;
  }

  return (
    <View style={styles.container}>
      <Header title="Clientes" />
      <SearchBar
        placeholder="Buscar clientes..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {clients.length ? (
          clients.map(client => (
            <View key={client.id} style={styles.clientCard}>
              <Header
                title={client.name}
                subtitle={client.phone}
                showBackButton={false}
              />
              <Header
                title={client.email}
                subtitle={`${client.appointments_count} agendamentos`}
                showBackButton={false}
              />
              {client.last_appointment && (
                <Header
                  title="Último agendamento"
                  subtitle={new Date(client.last_appointment).toLocaleDateString()}
                  showBackButton={false}
                />
              )}
              <View style={styles.actionsContainer}>
                <Button
                  title="Ver Detalhes"
                  onPress={() => handleViewClientDetails(client.id)}
                  variant="primary"
                />
              </View>
            </View>
          ))
        ) : (
          <EmptyState
            icon="account"
            title="Nenhum cliente"
            message="Não há clientes cadastrados."
          />
        )}
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
  clientCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  },
}); 