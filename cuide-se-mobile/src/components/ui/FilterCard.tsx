import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Card, Text, Chip, useTheme } from 'react-native-paper';
import { Filter } from '../../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface FilterCardProps {
  filter: Filter;
  onRemove: (key: keyof Filter) => void;
  style?: ViewStyle;
}

export const FilterCard: React.FC<FilterCardProps> = ({
  filter,
  onRemove,
  style,
}) => {
  const theme = useTheme();

  const renderFilterValue = (key: keyof Filter, value: any) => {
    switch (key) {
      case 'specialty':
        return value;
      case 'location':
        return value;
      case 'priceRange':
        return `R$ ${value.min} - R$ ${value.max}`;
      case 'rating':
        return `${value} estrelas`;
      case 'availability':
        return `${value.date} às ${value.time}`;
      default:
        return String(value);
    }
  };

  const getFilterIcon = (key: keyof Filter) => {
    switch (key) {
      case 'specialty':
        return 'tag';
      case 'location':
        return 'map-marker';
      case 'priceRange':
        return 'currency-usd';
      case 'rating':
        return 'star';
      case 'availability':
        return 'calendar';
      default:
        return 'filter';
    }
  };

  return (
    <Card style={[styles.card, style]}>
      <Card.Content>
        <View style={styles.content}>
          {Object.entries(filter).map(([key, value]) => {
            if (!value) return null;
            return (
              <Chip
                key={key}
                icon={getFilterIcon(key as keyof Filter)}
                onClose={() => onRemove(key as keyof Filter)}
                style={styles.chip}
                textStyle={styles.chipText}
              >
                {renderFilterValue(key as keyof Filter, value)}
              </Chip>
            );
          })}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
    elevation: 1,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 12,
  },
}); 