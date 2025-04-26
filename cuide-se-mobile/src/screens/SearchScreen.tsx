import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Searchbar, Chip, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { mockProfessionals } from '../data/mockData';
import { ProfessionalCard } from '../components/ProfessionalCard';
import { theme } from '../theme';
import { Filter } from '../types';

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const specialties = [
  "Todas especialidades",
  "Manicure", 
  "Cabeleireira", 
  "Especialista em Cílios", 
  "Podóloga"
];

export default function SearchScreen() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Todas especialidades');
  const [filters, setFilters] = useState<Filter>({});
  
  // Filtrar profissionais com base na especialidade e termo de busca
  const filteredProfessionals = mockProfessionals.filter((professional) => {
    const matchesSpecialty = selectedSpecialty === 'Todas especialidades' || 
                            professional.specialty === selectedSpecialty;
    
    const matchesSearch = professional.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         professional.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSpecialty && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Buscar por nome ou localização..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.specialtiesContainer}
        >
          {specialties.map((specialty) => (
            <Chip
              key={specialty}
              selected={selectedSpecialty === specialty}
              onPress={() => setSelectedSpecialty(specialty)}
              style={styles.specialtyChip}
            >
              {specialty}
            </Chip>
          ))}
        </ScrollView>
        
        <Button 
          mode="outlined" 
          onPress={() => {/* Abrir modal de filtros */}}
          style={styles.filterButton}
        >
          Filtros
        </Button>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.resultCount}>
          {filteredProfessionals.length} profissionais encontrados
        </Text>
        
        {filteredProfessionals.length > 0 ? (
          filteredProfessionals.map((professional) => (
            <ProfessionalCard
              key={professional.id}
              professional={professional}
              onPress={() => navigation.navigate('ProfessionalProfile', { id: professional.id })}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Nenhum profissional encontrado com os critérios selecionados.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: theme.colors.primary,
  },
  searchBar: {
    marginBottom: 12,
  },
  specialtiesContainer: {
    marginBottom: 12,
  },
  specialtyChip: {
    marginRight: 8,
  },
  filterButton: {
    borderColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  resultCount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    textAlign: 'center',
    color: theme.colors.placeholder,
  },
}); 