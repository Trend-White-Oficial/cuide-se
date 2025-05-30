import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Card, Text, Button, useTheme } from 'react-native-paper';
import { Location } from '../../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface LocationCardProps {
  location: Location;
  selected?: boolean;
  onSelect: () => void;
  onDirections?: () => void;
  style?: ViewStyle;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  location,
  selected,
  onSelect,
  onDirections,
  style,
}) => {
  const theme = useTheme();

  return (
    <Card
      style={[
        styles.card,
        selected && styles.selected,
        style,
      ]}
      onPress={onSelect}
    >
      <Card.Content>
        <View style={styles.content}>
          <View style={styles.info}>
            <View style={styles.nameContainer}>
              <Icon
                name="map-marker"
                size={20}
                color={selected ? theme.colors.primary : '#666'}
              />
              <Text
                style={[
                  styles.name,
                  selected && styles.selectedText,
                ]}
              >
                {location.name}
              </Text>
            </View>
            <Text style={styles.address}>
              {location.address}
            </Text>
            <Text style={styles.cityState}>
              {location.city} - {location.state}
            </Text>
            <Text style={styles.zipCode}>
              CEP: {location.zipCode}
            </Text>
          </View>
          {onDirections && (
            <Button
              mode="outlined"
              onPress={onDirections}
              style={styles.directionsButton}
              icon="directions"
            >
              Como Chegar
            </Button>
          )}
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
  selected: {
    borderColor: '#1976D2',
    borderWidth: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  selectedText: {
    color: '#1976D2',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cityState: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  zipCode: {
    fontSize: 14,
    color: '#666',
  },
  directionsButton: {
    marginLeft: 16,
  },
}); 