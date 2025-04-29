import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Button, Card, Avatar, Chip, Divider } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { theme } from '../theme';

// Função para buscar dados do profissional
async function fetchProfessional(id: string) {
  const response = await fetch(`https://api.cuide-se.com/professionals/${id}`);
  if (!response.ok) {
    throw new Error('Erro ao buscar dados do profissional');
  }
  return response.json();
}

type ProfessionalProfileScreenRouteProp = RouteProp<RootStackParamList, 'ProfessionalProfile'>;
type ProfessionalProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function ProfessionalProfileScreen() {
  const route = useRoute<ProfessionalProfileScreenRouteProp>();
  const navigation = useNavigation<ProfessionalProfileScreenNavigationProp>();
  const [professional, setProfessional] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfessional() {
      try {
        const data = await fetchProfessional(route.params.id);
        setProfessional(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProfessional();
  }, [route.params.id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Erro: {error}</Text>
      </View>
    );
  }

  if (!professional) {
    return (
      <View style={styles.container}>
        <Text>Profissional não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: professional.portfolio[0] || 'https://via.placeholder.com/400x200' }}
          style={styles.coverImage}
        />
        <View style={styles.profileInfo}>
          <Avatar.Image
            size={80}
            source={{ uri: professional.avatar || 'https://via.placeholder.com/80' }}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{professional.name}</Text>
            <Chip style={styles.specialtyChip}>{professional.specialty}</Chip>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Sobre</Text>
            <Text style={styles.bio}>{professional.bio}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Serviços</Text>
            {professional.services.map((service: any) => (
              <View key={service.id} style={styles.serviceItem}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDuration}>{service.duration} min</Text>
                </View>
                <Text style={styles.servicePrice}>
                  R$ {service.price.toFixed(2)}
                </Text>
                <Button
                  mode="contained"
                  onPress={() => {
                    navigation.navigate('Appointment', {
                      professionalId: professional.id,
                      serviceId: service.id,
                    });
                  }}
                  style={styles.bookButton}
                >
                  Agendar
                </Button>
              </View>
            ))}
          </Card.Content>
        </Card>

        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Avaliações</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>{professional.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>
                ({professional.reviews.length} avaliações)
              </Text>
            </View>
            {professional.reviews.map((review: any) => (
              <View key={review.id} style={styles.reviewItem}>
                <Text style={styles.reviewComment}>{review.comment}</Text>
                <Text style={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: -40,
  },
  nameContainer: {
    marginLeft: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  specialtyChip: {
    marginTop: 4,
    backgroundColor: theme.colors.primary,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
  },
  serviceItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  serviceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  serviceDuration: {
    color: theme.colors.placeholder,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  bookButton: {
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  reviewCount: {
    color: theme.colors.placeholder,
  },
  reviewItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  reviewComment: {
    fontSize: 16,
    marginBottom: 8,
  },
  reviewDate: {
    color: theme.colors.placeholder,
    fontSize: 12,
  },
});