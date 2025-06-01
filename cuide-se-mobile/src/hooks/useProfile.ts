import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { useAnalytics } from './useAnalytics';
import { useCrashlytics } from './useCrashlytics';
import { useStorage } from './useStorage';
import { useLocation } from './useLocation';

interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
    latitude?: number;
    longitude?: number;
  };
  preferences?: {
    notifications: boolean;
    email_marketing: boolean;
    dark_mode: boolean;
    language: string;
  };
  social_media?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  created_at: string;
  updated_at: string;
}

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: Error | null;
}

interface UpdateProfileData {
  name?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  address?: Profile['address'];
  preferences?: Profile['preferences'];
  social_media?: Profile['social_media'];
}

export const useProfile = () => {
  const [state, setState] = useState<ProfileState>({
    profile: null,
    loading: false,
    error: null,
  });

  const { user } = useAuth();
  const { showToast } = useToast();
  const { logEvent } = useAnalytics();
  const { recordError } = useCrashlytics();
  const { getItem, setItem } = useStorage();
  const { getCurrentLocation } = useLocation();

  // Carrega o perfil do usuário
  const loadProfile = useCallback(async (): Promise<void> => {
    if (!user) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Tenta carregar do cache primeiro
      const cachedProfile = await getItem('@CuideSe:profile');
      if (cachedProfile) {
        setState(prev => ({
          ...prev,
          profile: cachedProfile as Profile,
          loading: false,
        }));
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        throw error;
      }

      setState(prev => ({
        ...prev,
        profile: data as Profile,
        loading: false,
      }));

      // Salva no cache
      await setItem('@CuideSe:profile', data);

      // Registra o evento
      await logEvent('profile_loaded', {
        user_id: user.id,
      });
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      recordError(error instanceof Error ? error : new Error('Erro ao carregar perfil'));
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Erro ao carregar perfil'),
        loading: false,
      }));

      showToast({
        type: 'error',
        message: 'Erro ao carregar perfil',
        description: 'Tente novamente mais tarde',
      });
    }
  }, [user, getItem, setItem, logEvent, showToast, recordError]);

  // Atualiza o perfil do usuário
  const updateProfile = useCallback(
    async (updates: UpdateProfileData): Promise<void> => {
      if (!user) return;

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        // Se houver atualização de endereço, obtém as coordenadas
        if (updates.address) {
          const location = await getCurrentLocation();
          if (location) {
            updates.address.latitude = location.latitude;
            updates.address.longitude = location.longitude;
          }
        }

        const { data, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setState(prev => ({
          ...prev,
          profile: data as Profile,
          loading: false,
        }));

        // Atualiza o cache
        await setItem('@CuideSe:profile', data);

        // Registra o evento
        await logEvent('profile_updated', {
          user_id: user.id,
          updates: Object.keys(updates),
        });

        showToast({
          type: 'success',
          message: 'Perfil atualizado',
          description: 'Suas informações foram atualizadas com sucesso',
        });
      } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao atualizar perfil'));
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Erro ao atualizar perfil'),
          loading: false,
        }));

        showToast({
          type: 'error',
          message: 'Erro ao atualizar perfil',
          description: 'Tente novamente mais tarde',
        });
      }
    },
    [user, getCurrentLocation, setItem, logEvent, showToast, recordError]
  );

  // Atualiza o avatar do usuário
  const updateAvatar = useCallback(
    async (avatarUrl: string): Promise<void> => {
      if (!user) return;

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const { data, error } = await supabase
          .from('profiles')
          .update({ avatar: avatarUrl })
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setState(prev => ({
          ...prev,
          profile: data as Profile,
          loading: false,
        }));

        // Atualiza o cache
        await setItem('@CuideSe:profile', data);

        // Registra o evento
        await logEvent('avatar_updated', {
          user_id: user.id,
        });

        showToast({
          type: 'success',
          message: 'Avatar atualizado',
          description: 'Sua foto foi atualizada com sucesso',
        });
      } catch (error) {
        console.error('Erro ao atualizar avatar:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao atualizar avatar'));
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Erro ao atualizar avatar'),
          loading: false,
        }));

        showToast({
          type: 'error',
          message: 'Erro ao atualizar avatar',
          description: 'Tente novamente mais tarde',
        });
      }
    },
    [user, setItem, logEvent, showToast, recordError]
  );

  // Atualiza as preferências do usuário
  const updatePreferences = useCallback(
    async (preferences: Profile['preferences']): Promise<void> => {
      if (!user) return;

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const { data, error } = await supabase
          .from('profiles')
          .update({ preferences })
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setState(prev => ({
          ...prev,
          profile: data as Profile,
          loading: false,
        }));

        // Atualiza o cache
        await setItem('@CuideSe:profile', data);

        // Registra o evento
        await logEvent('preferences_updated', {
          user_id: user.id,
          preferences: Object.keys(preferences),
        });

        showToast({
          type: 'success',
          message: 'Preferências atualizadas',
          description: 'Suas preferências foram atualizadas com sucesso',
        });
      } catch (error) {
        console.error('Erro ao atualizar preferências:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao atualizar preferências'));
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Erro ao atualizar preferências'),
          loading: false,
        }));

        showToast({
          type: 'error',
          message: 'Erro ao atualizar preferências',
          description: 'Tente novamente mais tarde',
        });
      }
    },
    [user, setItem, logEvent, showToast, recordError]
  );

  // Atualiza as redes sociais do usuário
  const updateSocialMedia = useCallback(
    async (socialMedia: Profile['social_media']): Promise<void> => {
      if (!user) return;

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const { data, error } = await supabase
          .from('profiles')
          .update({ social_media: socialMedia })
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setState(prev => ({
          ...prev,
          profile: data as Profile,
          loading: false,
        }));

        // Atualiza o cache
        await setItem('@CuideSe:profile', data);

        // Registra o evento
        await logEvent('social_media_updated', {
          user_id: user.id,
          platforms: Object.keys(socialMedia),
        });

        showToast({
          type: 'success',
          message: 'Redes sociais atualizadas',
          description: 'Suas redes sociais foram atualizadas com sucesso',
        });
      } catch (error) {
        console.error('Erro ao atualizar redes sociais:', error);
        recordError(error instanceof Error ? error : new Error('Erro ao atualizar redes sociais'));
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Erro ao atualizar redes sociais'),
          loading: false,
        }));

        showToast({
          type: 'error',
          message: 'Erro ao atualizar redes sociais',
          description: 'Tente novamente mais tarde',
        });
      }
    },
    [user, setItem, logEvent, showToast, recordError]
  );

  return {
    ...state,
    loadProfile,
    updateProfile,
    updateAvatar,
    updatePreferences,
    updateSocialMedia,
  };
}; 