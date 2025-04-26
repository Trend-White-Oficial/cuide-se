import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Text, Searchbar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { mockProfessionals } from '../data/mockData';
import { ProfessionalCard } from '../components/ProfessionalCard';
import { theme } from '../theme';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mostrar apenas alguns profissionais em destaque
  const featuredProfessionals = mockProfessionals.slice(0, 3);

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>
          Cuide-Se: Beleza e bem-estar ao seu alcance
        </Text>
        <Text style={styles.heroSubtitle}>
          Conectamos você aos melhores profissionais de estética feminina
        </Text>
        
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Buscar profissionais..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('Search')}
            style={styles.searchButton}
          >
            Buscar
          </Button>
        </View>
      </View>

      {/* Featured Professionals */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Title>Profissionais em destaque</Title>
          <Button 
            mode="text" 
            onPress={() => navigation.navigate('Search')}
          >
            Ver todos
          </Button>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.professionalsList}
        >
          {featuredProfessionals.map((professional) => (
            <ProfessionalCard
              key={professional.id}
              professional={professional}
              onPress={() => navigation.navigate('ProfessionalProfile', { id: professional.id })}
            />
          ))}
        </ScrollView>
      </View>

      {/* How It Works */}
      <View style={styles.section}>
        <Title style={styles.sectionTitle}>Como funciona</Title>
        
        <View style={styles.stepsContainer}>
          <Card style={styles.stepCard}>
            <Card.Content>
              <Title>1. Busque profissionais</Title>
              <Paragraph>
                Encontre profissionais especializados próximos a você
              </Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.stepCard}>
            <Card.Content>
              <Title>2. Agende um horário</Title>
              <Paragraph>
                Escolha o serviço e horário que melhor se encaixa na sua agenda
              </Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.stepCard}>
            <Card.Content>
              <Title>3. Receba o serviço</Title>
              <Paragraph>
                Receba o atendimento de qualidade e avalie sua experiência
              </Paragraph>
            </Card.Content>
          </Card>
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Title style={styles.ctaTitle}>Pronta para se cuidar?</Title>
        <Paragraph style={styles.ctaText}>
          Faça parte da comunidade Cuide-Se e tenha acesso aos melhores profissionais de beleza
        </Paragraph>
        <View style={styles.ctaButtons}>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('Search')}
            style={styles.ctaButton}
          >
            Encontrar profissionais
          </Button>
          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('Auth')}
            style={styles.ctaButton}
          >
            Criar conta
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroSection: {
    padding: 20,
    backgroundColor: theme.colors.primary,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#fff',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  professionalsList: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  stepsContainer: {
    gap: 15,
  },
  stepCard: {
    marginBottom: 10,
  },
  ctaSection: {
    padding: 20,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
  },
  ctaTitle: {
    color: theme.colors.primary,
    marginBottom: 10,
  },
  ctaText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  ctaButton: {
    flex: 1,
  },
}); 