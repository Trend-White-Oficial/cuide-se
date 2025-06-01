import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, Badge } from 'react-native-paper';
import { Professional } from '../types';
import { theme } from '../theme';
import { MaterialIcons } from '@expo/vector-icons';

interface ProfessionalCardProps {
  professional: Professional;
  onPress: () => void;
  onSchedule?: () => void;
}

export function ProfessionalCard({ professional, onPress, onSchedule }: ProfessionalCardProps) {
  // Formata a lista de especialidades
  const formattedSpecialties = professional.specialty.join(', ');

  // Formata a avaliação com uma casa decimal
  const formattedRating = professional.rating.toFixed(1);

  return (
    <Card style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {professional.avatar ? (
              <Image source={{ uri: professional.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <MaterialIcons
                  name="person"
                  size={32}
                  color={theme.colors.textSecondary}
                />
              </View>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.name}>{professional.name}</Text>
            <View style={styles.ratingContainer}>
              <MaterialIcons
                name="star"
                size={16}
                color={theme.colors.warning}
                style={styles.starIcon}
              />
              <Text style={styles.rating}>{formattedRating}</Text>
              <Text style={styles.reviews}>
                ({professional.reviews.length} {professional.reviews.length === 1 ? 'avaliação' : 'avaliações'})
              </Text>
            </View>
            <Text style={styles.experience}>
              {professional.experienceYears} {professional.experienceYears === 1 ? 'ano' : 'anos'} de experiência
            </Text>
          </View>

          <Badge
            text={professional.isAvailable ? 'Disponível' : 'Indisponível'}
            color={professional.isAvailable ? theme.colors.success : theme.colors.error}
            style={styles.availabilityBadge}
          />
        </View>

        <View style={styles.specialtiesContainer}>
          <Text style={styles.specialtiesLabel}>Especialidades:</Text>
          <Text style={styles.specialties}>{formattedSpecialties}</Text>
        </View>

        {professional.isAvailable && onSchedule && (
          <TouchableOpacity
            onPress={onSchedule}
            style={styles.scheduleButton}
          >
            <Text style={styles.scheduleButtonText}>Agendar</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarPlaceholder: {
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  starIcon: {
    marginRight: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginRight: 4,
  },
  reviews: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  experience: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  availabilityBadge: {
    marginLeft: 8,
  },
  specialtiesContainer: {
    marginTop: 16,
  },
  specialtiesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 4,
  },
  specialties: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  scheduleButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  scheduleButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
}); 