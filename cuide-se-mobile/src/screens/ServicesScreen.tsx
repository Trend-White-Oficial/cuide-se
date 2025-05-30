import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Header } from '../components/ui/Header';
import { SearchBar } from '../components/ui/SearchBar';
import { ServiceCard } from '../components/ui/ServiceCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { EmptyState } from '../components/ui/EmptyState';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../services/supabase';
import { Service } from '../types';

export const ServicesScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setError(null);
      let query = supabase.from('services').select('*');
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setServices(data);
    } catch (err) {
      setError('Erro ao carregar serviços. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchServices();
  };

  if (loading) {
    return <LoadingSpinner message="Carregando serviços..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchServices} />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Serviços"
        showBackButton
      />
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Buscar serviços..."
        style={styles.searchBar}
      />
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {services.length > 0 ? (
          services.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onPress={() => navigation.navigate('ServiceDetails', { service })}
            />
          ))
        ) : (
          <EmptyState
            icon="spa"
            title="Nenhum serviço encontrado"
            message="Não há serviços disponíveis no momento."
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
    padding: 16,
  },
  searchBar: {
    margin: 16,
    marginBottom: 0,
  },
}); 