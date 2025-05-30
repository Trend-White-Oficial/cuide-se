import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Card, Text, RadioButton, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'pix' | 'bank_transfer';
  name: string;
  lastDigits?: string;
  isDefault?: boolean;
}

interface PaymentMethodCardProps {
  method: PaymentMethod;
  selected: boolean;
  onSelect: () => void;
  style?: ViewStyle;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  method,
  selected,
  onSelect,
  style,
}) => {
  const theme = useTheme();

  const getIcon = () => {
    switch (method.type) {
      case 'credit_card':
        return 'credit-card';
      case 'pix':
        return 'qrcode';
      case 'bank_transfer':
        return 'bank';
      default:
        return 'cash';
    }
  };

  const getIconColor = () => {
    switch (method.type) {
      case 'credit_card':
        return '#1976D2';
      case 'pix':
        return '#2E7D32';
      case 'bank_transfer':
        return '#F57C00';
      default:
        return '#666';
    }
  };

  return (
    <Card
      style={[styles.card, style]}
      onPress={onSelect}
    >
      <Card.Content>
        <View style={styles.content}>
          <View style={styles.leftContent}>
            <View style={styles.iconContainer}>
              <Icon
                name={getIcon()}
                size={24}
                color={getIconColor()}
              />
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{method.name}</Text>
              {method.lastDigits && (
                <Text style={styles.digits}>
                  •••• {method.lastDigits}
                </Text>
              )}
              {method.isDefault && (
                <Text style={styles.default}>Padrão</Text>
              )}
            </View>
          </View>
          <RadioButton
            value={method.id}
            status={selected ? 'checked' : 'unchecked'}
            onPress={onSelect}
            color={theme.colors.primary}
          />
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  digits: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  default: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
}); 