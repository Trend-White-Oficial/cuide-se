import { supabase } from '../lib/supabase';
import * as Location from 'expo-location';
import { GOOGLE_MAPS_API_KEY } from '@env';

export interface Address {
  id: string;
  userId: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressData {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  isDefault?: boolean;
}

class LocationService {
  async requestPermissions(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  async getCurrentLocation(): Promise<Location.LocationObject> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Permissão de localização negada');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return location;
  }

  async getAddressFromCoordinates(
    latitude: number,
    longitude: number
  ): Promise<Address> {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();
    if (data.status !== 'OK') {
      throw new Error('Erro ao obter endereço');
    }

    const result = data.results[0];
    const addressComponents = result.address_components;

    const street = addressComponents.find(
      (component: any) => component.types.includes('route')
    )?.long_name;

    const number = addressComponents.find(
      (component: any) => component.types.includes('street_number')
    )?.long_name;

    const neighborhood = addressComponents.find(
      (component: any) => component.types.includes('sublocality')
    )?.long_name;

    const city = addressComponents.find(
      (component: any) => component.types.includes('administrative_area_level_2')
    )?.long_name;

    const state = addressComponents.find(
      (component: any) => component.types.includes('administrative_area_level_1')
    )?.short_name;

    const zipCode = addressComponents.find(
      (component: any) => component.types.includes('postal_code')
    )?.long_name;

    return {
      id: '',
      userId: '',
      street: street || '',
      number: number || '',
      neighborhood: neighborhood || '',
      city: city || '',
      state: state || '',
      zipCode: zipCode || '',
      latitude,
      longitude,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async searchAddresses(query: string): Promise<Address[]> {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${GOOGLE_MAPS_API_KEY}&components=country:br`
    );

    const data = await response.json();
    if (data.status !== 'OK') {
      throw new Error('Erro ao buscar endereços');
    }

    const addresses: Address[] = [];
    for (const prediction of data.predictions) {
      const placeId = prediction.place_id;
      const details = await this.getPlaceDetails(placeId);
      if (details) {
        addresses.push(details);
      }
    }

    return addresses;
  }

  private async getPlaceDetails(placeId: string): Promise<Address | null> {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();
    if (data.status !== 'OK') {
      return null;
    }

    const result = data.result;
    const { lat, lng } = result.geometry.location;

    return this.getAddressFromCoordinates(lat, lng);
  }

  async calculateDistance(
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number }
  ): Promise<number> {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();
    if (data.status !== 'OK') {
      throw new Error('Erro ao calcular distância');
    }

    const distance = data.rows[0].elements[0].distance.value;
    return distance;
  }

  async saveAddress(data: CreateAddressData): Promise<Address> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    if (data.isDefault) {
      // Remove o status de padrão de outros endereços
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('is_default', true);
    }

    const { data: address, error } = await supabase
      .from('addresses')
      .insert({
        user_id: user.id,
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
        latitude: data.latitude,
        longitude: data.longitude,
        is_default: data.isDefault || false,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapAddress(address);
  }

  async getAddresses(): Promise<Address[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });

    if (error) throw error;
    return data.map(this.mapAddress);
  }

  async updateAddress(id: string, data: Partial<CreateAddressData>): Promise<Address> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    if (data.isDefault) {
      // Remove o status de padrão de outros endereços
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('is_default', true);
    }

    const { data: address, error } = await supabase
      .from('addresses')
      .update({
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
        latitude: data.latitude,
        longitude: data.longitude,
        is_default: data.isDefault,
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return this.mapAddress(address);
  }

  async deleteAddress(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  }

  private mapAddress(data: any): Address {
    return {
      id: data.id,
      userId: data.user_id,
      street: data.street,
      number: data.number,
      complement: data.complement,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      zipCode: data.zip_code,
      latitude: data.latitude,
      longitude: data.longitude,
      isDefault: data.is_default,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

export const locationService = new LocationService(); 