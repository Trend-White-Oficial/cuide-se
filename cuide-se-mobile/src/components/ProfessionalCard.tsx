import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, Badge } from 'react-native-paper';
import { Professional } from '../types';
import { theme } from '../theme';

interface ProfessionalCardProps {
  professional: Professional;
  onPress: () => void;
}

export function ProfessionalCard({ professional, onPress }: ProfessionalCardProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Card style={styles.card}>
        <Card.Cover 
          source={{ uri: professional.portfolio[0] || 'https://via.placeholder.com/300' }} 
          style={styles.cover}
        />
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            <Avatar.Image 
              size={40} 
              source={{ uri: professional.avatar || 'https://via.placeholder.com/150' }} 
            />
            <View style={styles.info}>
              <Text style={styles.name}>{professional.name}</Text>
              <Badge style={styles.badge}>
                {professional.specialty}
              </Badge>
            </View>
          </View>
          
          <View style={styles.rating}>
            <Text style={styles.ratingText}>
              ★ {professional.rating} ({professional.reviews.length} avaliações)
            </Text>
          </View>
          
          <Text style={styles.bio} numberOfLines={2}>
            {professional.bio}
          </Text>
          <Text style={styles.location}>
            {professional.location}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    marginRight: 15,
  },
  card: {
    elevation: 4,
  },
  cover: {
    height: 150,
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  badge: {
    backgroundColor: theme.colors.primaryLight,
    alignSelf: 'flex-start',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    color: '#FFB800',
    fontSize: 14,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  location: {
    fontSize: 12,
    color: '#999',
  },
}); 