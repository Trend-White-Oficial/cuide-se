import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Card, Text, Button, useTheme } from 'react-native-paper';
import { Availability } from '../../types';
import { formatTime } from '../../utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface AvailabilityCardProps {
  availability: Availability;
  selected?: boolean;
  onSelect: () => void;
  style?: ViewStyle;
}

export const AvailabilityCard: React.FC<AvailabilityCardProps> = ({
  availability,
  selected,
  onSelect,
  style,
}) => {
  const theme = useTheme();

  const getDayName = (dayOfWeek: number) => {
    const days = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ];
    return days[dayOfWeek];
  };

  return (
    <Card
      style={[
        styles.card,
        selected && styles.selected,
        !availability.isAvailable && styles.unavailable,
        style,
      ]}
      onPress={availability.isAvailable ? onSelect : undefined}
    >
      <Card.Content>
        <View style={styles.content}>
          <View style={styles.info}>
            <View style={styles.dayContainer}>
              <Icon
                name="calendar"
                size={20}
                color={selected ? theme.colors.primary : '#666'}
              />
              <Text
                style={[
                  styles.day,
                  selected && styles.selectedText,
                ]}
              >
                {getDayName(availability.dayOfWeek)}
              </Text>
            </View>
            <View style={styles.timeContainer}>
              <Icon
                name="clock-outline"
                size={20}
                color={selected ? theme.colors.primary : '#666'}
              />
              <Text
                style={[
                  styles.time,
                  selected && styles.selectedText,
                ]}
              >
                {formatTime(availability.startTime)} - {formatTime(availability.endTime)}
              </Text>
            </View>
          </View>
          {availability.isAvailable && (
            <Button
              mode={selected ? 'contained' : 'outlined'}
              onPress={onSelect}
              style={styles.button}
            >
              {selected ? 'Selecionado' : 'Selecionar'}
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
  unavailable: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
  },
  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  day: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  selectedText: {
    color: '#1976D2',
  },
  button: {
    marginLeft: 16,
  },
}); 