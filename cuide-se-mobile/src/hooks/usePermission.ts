import { useState, useCallback } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import * as Notifications from 'expo-notifications';
import * as Contacts from 'expo-contacts';
import * as Calendar from 'expo-calendar';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

type PermissionType =
  | 'location'
  | 'camera'
  | 'photoLibrary'
  | 'notifications'
  | 'contacts'
  | 'calendar'
  | 'mediaLibrary'
  | 'microphone';

interface PermissionStatus {
  granted: boolean;
  status: string;
}

interface PermissionState {
  [key: string]: PermissionStatus;
}

export const usePermission = () => {
  const [permissions, setPermissions] = useState<PermissionState>({});

  // Solicita permissão de localização
  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';

      setPermissions((prev) => ({
        ...prev,
        location: { granted, status },
      }));

      return granted;
    } catch (error) {
      console.error('Erro ao solicitar permissão de localização:', error);
      return false;
    }
  }, []);

  // Solicita permissão da câmera
  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const granted = status === 'granted';

      setPermissions((prev) => ({
        ...prev,
        camera: { granted, status },
      }));

      return granted;
    } catch (error) {
      console.error('Erro ao solicitar permissão da câmera:', error);
      return false;
    }
  }, []);

  // Solicita permissão da galeria
  const requestPhotoLibraryPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const granted = status === 'granted';

      setPermissions((prev) => ({
        ...prev,
        photoLibrary: { granted, status },
      }));

      return granted;
    } catch (error) {
      console.error('Erro ao solicitar permissão da galeria:', error);
      return false;
    }
  }, []);

  // Solicita permissão de notificações
  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      const granted = status === 'granted';

      setPermissions((prev) => ({
        ...prev,
        notifications: { granted, status },
      }));

      return granted;
    } catch (error) {
      console.error('Erro ao solicitar permissão de notificações:', error);
      return false;
    }
  }, []);

  // Solicita permissão de contatos
  const requestContactsPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      const granted = status === 'granted';

      setPermissions((prev) => ({
        ...prev,
        contacts: { granted, status },
      }));

      return granted;
    } catch (error) {
      console.error('Erro ao solicitar permissão de contatos:', error);
      return false;
    }
  }, []);

  // Solicita permissão do calendário
  const requestCalendarPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      const granted = status === 'granted';

      setPermissions((prev) => ({
        ...prev,
        calendar: { granted, status },
      }));

      return granted;
    } catch (error) {
      console.error('Erro ao solicitar permissão do calendário:', error);
      return false;
    }
  }, []);

  // Solicita permissão da biblioteca de mídia
  const requestMediaLibraryPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      const granted = status === 'granted';

      setPermissions((prev) => ({
        ...prev,
        mediaLibrary: { granted, status },
      }));

      return granted;
    } catch (error) {
      console.error('Erro ao solicitar permissão da biblioteca de mídia:', error);
      return false;
    }
  }, []);

  // Solicita permissão do microfone
  const requestMicrophonePermission = useCallback(async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }

      const { status } = await Camera.requestMicrophonePermissionsAsync();
      const granted = status === 'granted';

      setPermissions((prev) => ({
        ...prev,
        microphone: { granted, status },
      }));

      return granted;
    } catch (error) {
      console.error('Erro ao solicitar permissão do microfone:', error);
      return false;
    }
  }, []);

  // Verifica se uma permissão foi concedida
  const checkPermission = useCallback(
    async (type: PermissionType): Promise<boolean> => {
      try {
        switch (type) {
          case 'location':
            const locationStatus = await Location.getForegroundPermissionsAsync();
            return locationStatus.status === 'granted';

          case 'camera':
            const cameraStatus = await Camera.getCameraPermissionsAsync();
            return cameraStatus.status === 'granted';

          case 'photoLibrary':
            const photoStatus = await ImagePicker.getMediaLibraryPermissionsAsync();
            return photoStatus.status === 'granted';

          case 'notifications':
            const notificationStatus = await Notifications.getPermissionsAsync();
            return notificationStatus.status === 'granted';

          case 'contacts':
            const contactsStatus = await Contacts.getPermissionsAsync();
            return contactsStatus.status === 'granted';

          case 'calendar':
            const calendarStatus = await Calendar.getCalendarPermissionsAsync();
            return calendarStatus.status === 'granted';

          case 'mediaLibrary':
            const mediaStatus = await MediaLibrary.getPermissionsAsync();
            return mediaStatus.status === 'granted';

          case 'microphone':
            if (Platform.OS === 'android') {
              const granted = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
              );
              return granted;
            }
            const microphoneStatus = await Camera.getMicrophonePermissionsAsync();
            return microphoneStatus.status === 'granted';

          default:
            return false;
        }
      } catch (error) {
        console.error(`Erro ao verificar permissão ${type}:`, error);
        return false;
      }
    },
    []
  );

  // Solicita uma permissão específica
  const requestPermission = useCallback(
    async (type: PermissionType): Promise<boolean> => {
      try {
        switch (type) {
          case 'location':
            return await requestLocationPermission();

          case 'camera':
            return await requestCameraPermission();

          case 'photoLibrary':
            return await requestPhotoLibraryPermission();

          case 'notifications':
            return await requestNotificationPermission();

          case 'contacts':
            return await requestContactsPermission();

          case 'calendar':
            return await requestCalendarPermission();

          case 'mediaLibrary':
            return await requestMediaLibraryPermission();

          case 'microphone':
            return await requestMicrophonePermission();

          default:
            return false;
        }
      } catch (error) {
        console.error(`Erro ao solicitar permissão ${type}:`, error);
        return false;
      }
    },
    [
      requestLocationPermission,
      requestCameraPermission,
      requestPhotoLibraryPermission,
      requestNotificationPermission,
      requestContactsPermission,
      requestCalendarPermission,
      requestMediaLibraryPermission,
      requestMicrophonePermission,
    ]
  );

  return {
    permissions,
    checkPermission,
    requestPermission,
    requestLocationPermission,
    requestCameraPermission,
    requestPhotoLibraryPermission,
    requestNotificationPermission,
    requestContactsPermission,
    requestCalendarPermission,
    requestMediaLibraryPermission,
    requestMicrophonePermission,
  };
}; 