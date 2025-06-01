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

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  appointments_count: number;
}

export const ProfessionalServicesScreen: React.FC = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchServices = async () => {
    try {
      setError(null);
      let query = supabase
        .from('services')
        .select(`
          *,
          appointments:appointments(count)
        `)
        .eq('professional_id', user?.id)
        .order('name', { ascending: true });

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error: err } = await query;

      if (err) throw err;

      const formattedServices = data?.map(service => ({
        id: service.id,
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
        appointments_count: service.appointments?.[0]?.count || 0,
      })) || [];

      setServices(formattedServices);
    } catch (err) {
      setError('Erro ao carregar serviços.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchServices();
  };

  const handleEditService = (serviceId: string) => {
    // TODO: Implementar navegação para edição do serviço
    console.log('Editar serviço:', serviceId);
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      const { error: err } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (err) throw err;
      fetchServices();
    } catch (err) {
      setError('Erro ao excluir serviço.');
      console.error(err);
    }
  };

  const handleAddService = () => {
    // TODO: Implementar navegação para adicionar serviço
    console.log('Adicionar serviço');
  };

  if (loading) {
    return <LoadingSpinner message="Carregando serviços..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchServices} />;
  }

  return (
    <View style={styles.container}>
      <Header title="Serviços" />
      <View style={styles.headerContainer}>
        <SearchBar
          placeholder="Buscar serviços..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Button
          title="Adicionar"
          onPress={handleAddService}
          variant="primary"
        />
      </View>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {services.length ? (
          services.map(service => (
            <View key={service.id} style={styles.serviceCard}>
              <Header
                title={service.name}
                subtitle={service.description}
                showBackButton={false}
              />
              <Header
                title={`${service.duration} minutos`}
                subtitle={`R$ ${service.price.toFixed(2)}`}
                showBackButton={false}
              />
              <Header
                title={`${service.appointments_count} agendamentos`}
                showBackButton={false}
              />
              <View style={styles.actionsContainer}>
                <Button
                  title="Editar"
                  onPress={() => handleEditService(service.id)}
                  variant="primary"
                />
                <Button
                  title="Excluir"
                  onPress={() => handleDeleteService(service.id)}
                  variant="secondary"
                />
              </View>
            </View>
          ))
        ) : (
          <EmptyState
            icon="spa"
            title="Nenhum serviço"
            message="Não há serviços cadastrados."
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
  headerContainer: {
    padding: 16,
    gap: 8,
  },
  content: {
    flex: 1,
  },
  serviceCard: {
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