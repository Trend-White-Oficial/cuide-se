import React from 'react';
import { StyleSheet, View, Image, ViewStyle } from 'react-native';
import { Card, Title, Text, Button, Avatar, useTheme } from 'react-native-paper';
import { Professional } from '../../types';
import { calculateAverageRating } from '../../utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ProfessionalCardProps {
  professional: Professional;
  onPress: () => void;
  style?: ViewStyle;
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  professional,
  onPress,
  style,
}) => {
  const theme = useTheme();
  const averageRating = calculateAverageRating(
    professional.reviews.map(review => review.rating)
  );

  return (
    <Card
      style={[styles.card, style]}
      onPress={onPress}
    >
      <Card.Content>
        <View style={styles.header}>
          <Avatar.Image
            source={{ uri: professional.avatar || 'https://via.placeholder.com/100' }}
            size={60}
            style={styles.avatar}
          />
          <View style={styles.info}>
            <Title style={styles.name}>{professional.name}</Title>
            <Text style={styles.specialty}>{professional.specialty}</Text>
            <View style={styles.rating}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>
                {averageRating.toFixed(1)} ({professional.reviews.length} avaliações)
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.bio} numberOfLines={2}>
          {professional.bio}
        </Text>
        <View style={styles.services}>
          <Text style={styles.servicesTitle}>Serviços:</Text>
          {professional.services.slice(0, 2).map(service => (
            <Text key={service.id} style={styles.service}>
              • {service.name}
            </Text>
          ))}
          {professional.services.length > 2 && (
            <Text style={styles.moreServices}>
              +{professional.services.length - 2} outros serviços
            </Text>
          )}
        </View>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          onPress={onPress}
          style={styles.button}
        >
          Ver Perfil
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  bio: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  services: {
    marginTop: 8,
  },
  servicesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  service: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  moreServices: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  button: {
    flex: 1,
  },
}); 