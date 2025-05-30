import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Header } from '../components/ui/Header';
import { SearchBar } from '../components/ui/SearchBar';
import { ProfessionalCard } from '../components/ui/ProfessionalCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { EmptyState } from '../components/ui/EmptyState';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../services/supabase';
import { Professional } from '../types';

export const ProfessionalsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfessionals = async () => {
    try {
      setError(null);
      let query = supabase.from('professionals').select('*');
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,specialty.ilike.%${searchQuery}%`);
      }
      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setProfessionals(data);
    } catch (err) {
      setError('Erro ao carregar profissionais. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfessionals();
  };

  if (loading) {
    return <LoadingSpinner message="Carregando profissionais..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchProfessionals} />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Profissionais"
        showBackButton
      />
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Buscar profissionais..."
        style={styles.searchBar}
      />
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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