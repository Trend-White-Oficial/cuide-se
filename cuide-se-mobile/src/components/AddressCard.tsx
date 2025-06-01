import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from '../hooks/useTranslation';
import { Text } from './Text';
import { Icon } from './Icon';
import { Address } from '../services/location';

interface AddressCardProps {
  address: Address;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onPress,
  onEdit,
  onDelete,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const formatAddress = () => {
    const parts = [
      `${address.street}, ${address.number}`,
      address.complement,
      address.neighborhood,
      `${address.city} - ${address.state}`,
      address.zipCode,
    ];

    return parts.filter(Boolean).join(', ');
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: theme.colors.card },
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Icon
              name="location-on"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.title}>
              {t('address.title')}
            </Text>
            {address.isDefault && (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <Text style={styles.badgeText}>
                  {t('address.default')}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity
                onPress={onEdit}
                style={styles.actionButton}
              >
                <Icon
                  name="edit"
                  size={20}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                onPress={onDelete}
                style={styles.actionButton}
              >
                <Icon
                  name="delete"
                  size={20}
                  color={theme.colors.error}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text style={styles.address}>
          {formatAddress()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  address: {
    fontSize: 14,
    opacity: 0.7,
  },
}); 