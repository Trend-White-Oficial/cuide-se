import React from 'react';
import { StyleSheet, View, Image, ViewStyle } from 'react-native';
import { Card, Title, Text, Button, useTheme } from 'react-native-paper';
import { Service } from '../../types';
import { formatCurrency } from '../../utils';

interface ServiceCardProps {
  service: Service;
  onPress: () => void;
  style?: ViewStyle;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onPress,
  style,
}) => {
  const theme = useTheme();

  return (
    <Card
      style={[styles.card, style]}
      onPress={onPress}
    >
      <Card.Content>
        <Title style={styles.title}>{service.name}</Title>
        <Text style={styles.description} numberOfLines={2}>
          {service.description}
        </Text>
        <View style={styles.details}>
          <Text style={styles.price}>
            {formatCurrency(service.price)}
          </Text>
          <Text style={styles.duration}>
            {service.duration} min
          </Text>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          onPress={onPress}
          style={styles.button}
        >
          Agendar
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  duration: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    flex: 1,
  },
}); 