import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Header } from '../components/ui/Header';
import { SearchBar } from '../components/ui/SearchBar';
import { ServiceCard } from '../components/ui/ServiceCard';
import { ProfessionalCard } from '../components/ui/ProfessionalCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { EmptyState } from '../components/ui/EmptyState';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../services/supabase';
import { Service, Professional } from '../types';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const [servicesResponse, professionalsResponse] = await Promise.all([
        supabase.from('services').select('*').limit(5),
        supabase.from('professionals').select('*').limit(5),
      ]);

      if (servicesResponse.error) throw servicesResponse.error;
      if (professionalsResponse.error) throw professionalsResponse.error;

      setServices(servicesResponse.data);
      setProfessionals(professionalsResponse.data);
    } catch (err) {
      setError('Erro ao carregar dados. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return <LoadingSpinner message="Carregando..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={fetchData}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Cuide-se"
        showBackButton={false}
        rightAction={{
          icon: 'bell-outline',
          onPress: () => navigation.navigate('Notifications'),
        }}
      />
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar serviços ou profissionais..."
        />

        <View style={styles.section}>
          <Header
            title="Serviços em Destaque"
            showBackButton={false}
            rightAction={{
              icon: 'chevron-right',
              onPress: () => navigation.navigate('Services'),
            }}
          />
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
        </View>

        <View style={styles.section}>
          <Header
            title="Profissionais em Destaque"
            showBackButton={false}
            rightAction={{
              icon: 'chevron-right',
              onPress: () => navigation.navigate('Professionals'),
            }}
          />
          {professionals.length > 0 ? (
            professionals.map(professional => (
              <ProfessionalCard
                key={professional.id}
                professional={professional}
                onPress={() => navigation.navigate('ProfessionalDetails', { professional })}
              />
            ))
          ) : (
            <EmptyState
              icon="account-group"
              title="Nenhum profissional encontrado"
              message="Não há profissionais disponíveis no momento."
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
  section: {
    padding: 16,
  },
});