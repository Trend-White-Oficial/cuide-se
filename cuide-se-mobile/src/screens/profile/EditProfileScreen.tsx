import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '../../hooks/useProfile';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Text } from '../../components/Text';
import { Loading } from '../../components/Loading';
import { ErrorMessage } from '../../components/ErrorMessage';
import { validateName, validatePhone } from '../../utils/validation';
import * as ImagePicker from 'expo-image-picker';

export const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { profile, updateProfile, isLoading: isProfileLoading } = useProfile();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setPhone(profile.phone || '');
      setBio(profile.bio || '');
      setAvatar(profile.avatar || null);
    }
  }, [profile]);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      setError(t('profile.imagePickerError'));
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setError(null);
      setIsLoading(true);

      // Validação
      if (!validateName(name)) {
        throw new Error(t('profile.invalidName'));
      }
      if (phone && !validatePhone(phone)) {
        throw new Error(t('profile.invalidPhone'));
      }

      await updateProfile({
        name,
        phone,
        bio,
        avatar,
      });

      navigation.goBack();
    } catch (error) {
      setError(error instanceof Error ? error.message : t('profile.updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isProfileLoading || isLoading) {
    return <Loading />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('profile.editProfile')}</Text>
        </View>

        <View style={styles.form}>
          {error && <ErrorMessage message={error} />}

          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handlePickImage}
          >
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarPlaceholderText}>
                  {name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.avatarOverlay}>
              <Text style={styles.avatarOverlayText}>
                {t('profile.changePhoto')}
              </Text>
            </View>
          </TouchableOpacity>

          <Input
            label={t('profile.name')}
            value={name}
            onChangeText={setName}
            placeholder={t('profile.namePlaceholder')}
            autoCapitalize="words"
            autoComplete="name"
            textContentType="name"
          />

          <Input
            label={t('profile.phone')}
            value={phone}
            onChangeText={setPhone}
            placeholder={t('profile.phonePlaceholder')}
            keyboardType="phone-pad"
            autoComplete="tel"
            textContentType="telephoneNumber"
          />

          <Input
            label={t('profile.bio')}
            value={bio}
            onChangeText={setBio}
            placeholder={t('profile.bioPlaceholder')}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Button
            title={t('profile.save')}
            onPress={handleUpdateProfile}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  form: {
    gap: 16,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    backgroundColor: '#E1E1E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 48,
    color: '#666',
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  avatarOverlayText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 12,
  },
  button: {
    marginTop: 8,
  },
}); 