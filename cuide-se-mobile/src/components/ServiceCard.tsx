import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from './Text';
import { Card } from './Card';
import { Badge } from './Badge';
import { theme } from '../theme';
import { MaterialIcons } from '@expo/vector-icons';

interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  imageUrl?: string;
  onPress?: () => void;
  onSelect?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  name,
  description,
  price,
  duration,
  category,
  imageUrl,
  onPress,
  onSelect,
}) => {
  // Formata o preço para o padrão brasileiro
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);

  // Formata a duração em horas e minutos
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `${remainingMinutes} min`;
    }

    if (remainingMinutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}min`;
  };

  return (
    <Card style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.content}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <MaterialIcons
              name="spa"
              size={32}
              color={theme.colors.textSecondary}
            />
          </View>
        )}

        <View style={styles.infoContainer}>
          <View style={styles.header}>
            <Text style={styles.name}>{name}</Text>
            <Badge
              text={category}
              color={theme.colors.primary}
              style={styles.categoryBadge}
            />
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>

          <View style={styles.details}>
            <View style={styles.detailItem}>
              <MaterialIcons
                name="schedule"
                size={16}
                color={theme.colors.textSecondary}
                style={styles.detailIcon}
              />
              <Text style={styles.detailText}>{formatDuration(duration)}</Text>
            </View>

            <View style={styles.detailItem}>
              <MaterialIcons
                name="attach-money"
                size={16}
                color={theme.colors.textSecondary}
                style={styles.detailIcon}
              />
              <Text style={styles.detailText}>{formattedPrice}</Text>
            </View>
          </View>

          {onSelect && (
            <TouchableOpacity
              onPress={onSelect}
              style={styles.selectButton}
            >
              <Text style={styles.selectButtonText}>Selecionar</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    padding: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  imagePlaceholder: {
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailIcon: {
    marginRight: 4,
  },
  detailText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  selectButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  selectButtonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
}); 