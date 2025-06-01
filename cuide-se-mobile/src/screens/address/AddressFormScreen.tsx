import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { useLocation } from '../../hooks/useLocation';
import { Text } from '../../components/Text';
import { TextInput } from '../../components/TextInput';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { ErrorMessage } from '../../components/ErrorMessage';
import { Icon } from '../../components/Icon';
import { Address } from '../../services/location';

export const AddressFormScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const {
    addresses,
    isLoading,
    error,
    getCurrentLocation,
    searchAddresses,
    saveAddress,
    updateAddress,
  } = useLocation();

  const [formData, setFormData] = useState({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Address[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const addressId = route.params?.addressId;
  const isEditing = !!addressId;

  useEffect(() => {
    if (isEditing) {
      const address = addresses.find((a) => a.id === addressId);
      if (address) {
        setFormData({
          street: address.street,
          number: address.number,
          complement: address.complement || '',
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          isDefault: address.isDefault,
        });
      }
    }
  }, [addressId, addresses]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchAddresses(searchQuery);
      setSearchResults(results);
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectAddress = (address: Address) => {
    setFormData({
      street: address.street,
      number: address.number,
      complement: address.complement || '',
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      isDefault: formData.isDefault,
    });
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleUseCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation();
      const address = await searchAddresses(
        `${location.latitude},${location.longitude}`
      );
      if (address.length > 0) {
        handleSelectAddress(address[0]);
      }
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await updateAddress(addressId, formData);
      } else {
        await saveAddress(formData);
      }
      navigation.goBack();
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
        onRetry={() => navigation.goBack()}
      />
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('address.search.placeholder')}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity
            style={styles.locationButton}
            onPress={handleUseCurrentLocation}
          >
            <Icon
              name="my-location"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        {isSearching ? (
          <Loading />
        ) : searchResults.length > 0 ? (
          <View style={styles.searchResults}>
            {searchResults.map((address) => (
              <TouchableOpacity
                key={address.id}
                style={[
                  styles.searchResult,
                  { backgroundColor: theme.colors.card },
                ]}
                onPress={() => handleSelectAddress(address)}
              >
                <Text style={styles.searchResultText}>
                  {`${address.street}, ${address.number} - ${address.neighborhood}, ${address.city} - ${address.state}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        <View style={styles.form}>
          <TextInput
            value={formData.street}
            onChangeText={(text) => setFormData({ ...formData, street: text })}
            placeholder={t('address.street')}
          />

          <View style={styles.row}>
            <TextInput
              value={formData.number}
              onChangeText={(text) => setFormData({ ...formData, number: text })}
              placeholder={t('address.number')}
              style={styles.numberInput}
            />
            <TextInput
              value={formData.complement}
              onChangeText={(text) => setFormData({ ...formData, complement: text })}
              placeholder={t('address.complement')}
              style={styles.complementInput}
            />
          </View>

          <TextInput
            value={formData.neighborhood}
            onChangeText={(text) => setFormData({ ...formData, neighborhood: text })}
            placeholder={t('address.neighborhood')}
          />

          <View style={styles.row}>
            <TextInput
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
              placeholder={t('address.city')}
              style={styles.cityInput}
            />
            <TextInput
              value={formData.state}
              onChangeText={(text) => setFormData({ ...formData, state: text })}
              placeholder={t('address.state')}
              style={styles.stateInput}
            />
          </View>

          <TextInput
            value={formData.zipCode}
            onChangeText={(text) => setFormData({ ...formData, zipCode: text })}
            placeholder={t('address.zipCode')}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={styles.defaultContainer}
            onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
          >
            <Icon
              name={formData.isDefault ? 'check-box' : 'check-box-outline-blank'}
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.defaultText}>
              {t('address.default')}
            </Text>
          </TouchableOpacity>

          <Button
            title={isEditing ? t('common.save') : t('common.add')}
            onPress={handleSubmit}
            style={styles.submitButton}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationButton: {
    marginLeft: 8,
    padding: 8,
  },
  searchResults: {
    marginBottom: 16,
  },
  searchResult: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  searchResultText: {
    fontSize: 14,
  },
  form: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  numberInput: {
    flex: 1,
  },
  complementInput: {
    flex: 2,
  },
  cityInput: {
    flex: 2,
  },
  stateInput: {
    flex: 1,
  },
  defaultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  defaultText: {
    fontSize: 16,
  },
  submitButton: {
    marginTop: 16,
  },
}); 