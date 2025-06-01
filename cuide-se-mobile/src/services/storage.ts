import { supabase } from '../config/supabase';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { getSupabaseError, handleSupabaseError } from '../config/supabase';

const STORAGE_BUCKET = 'images';

export interface UploadOptions {
  maxSize?: number; // em bytes
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1
  format?: SaveFormat;
}

const defaultOptions: UploadOptions = {
  maxSize: 5 * 1024 * 1024, // 5MB
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.8,
  format: SaveFormat.JPEG,
};

export const storageService = {
  async pickImage(options: UploadOptions = {}) {
    try {
      // Solicitar permissão
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Permissão para acessar a galeria foi negada');
        }
      }

      // Selecionar imagem
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled) {
        return null;
      }

      const image = result.assets[0];
      return image;
    } catch (error) {
      handleSupabaseError(error);
      throw new Error(getSupabaseError(error));
    }
  },

  async uploadImage(
    uri: string,
    path: string,
    options: UploadOptions = {}
  ): Promise<string> {
    try {
      const mergedOptions = { ...defaultOptions, ...options };

      // Redimensionar e comprimir a imagem
      const manipulatedImage = await manipulateAsync(
        uri,
        [
          {
            resize: {
              width: mergedOptions.maxWidth,
              height: mergedOptions.maxHeight,
            },
          },
        ],
        {
          compress: mergedOptions.quality,
          format: mergedOptions.format,
        }
      );

      // Converter para blob
      const response = await fetch(manipulatedImage.uri);
      const blob = await response.blob();

      // Verificar tamanho
      if (blob.size > (mergedOptions.maxSize || defaultOptions.maxSize!)) {
        throw new Error('A imagem excede o tamanho máximo permitido');
      }

      // Upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, blob, {
          contentType: `image/${mergedOptions.format?.toLowerCase()}`,
          upsert: true,
        });

      if (error) throw error;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      handleSupabaseError(error);
      throw new Error(getSupabaseError(error));
    }
  },

  async deleteImage(path: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([path]);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
      throw new Error(getSupabaseError(error));
    }
  },

  async getImageUrl(path: string): Promise<string> {
    try {
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(path);

      return publicUrl;
    } catch (error) {
      handleSupabaseError(error);
      throw new Error(getSupabaseError(error));
    }
  },
}; 