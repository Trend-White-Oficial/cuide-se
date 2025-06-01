import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { useLocation } from '../../hooks/useLocation';
import { AddressCard } from '../../components/AddressCard';
import { Loading } from '../../components/Loading';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { Icon } from '../../components/Icon';

export const AddressListScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const {
    addresses,
    isLoading,
    error,
    fetchAddresses,
    deleteAddress,
  } = useLocation();

  const handleRefresh = () => {
    fetchAddresses();
  };

  const handleAddAddress = () => {
    navigation.navigate('AddressForm');
  };

  const handleEditAddress = (addressId: string) => {
    navigation.navigate('AddressForm', { addressId });
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteAddress(addressId);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={handleRefresh}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AddressCard
            address={item}
            onPress={() => handleEditAddress(item.id)}
            onEdit={() => handleEditAddress(item.id)}
            onDelete={() => handleDeleteAddress(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="location-off"
            title={t('address.empty.title')}
            message={t('address.empty.message')}
          />
        }
      />

      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: theme.colors.primary },
        ]}
        onPress={handleAddAddress}
      >
        <Icon
          name="add"
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
}); 