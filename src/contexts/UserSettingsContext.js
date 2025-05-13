/**
 * Contexto para gerenciamento de configurações do usuário
 * 
 * Este contexto gerencia todas as operações relacionadas às preferências e configurações do usuário.
 */

import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';

export const UserSettingsContext = createContext();

export const UserSettingsProvider = ({ children }) => {
    /**
     * Estado gerenciado pelo contexto:
     * - settings: Configurações do usuário
     * - loading: Estado de carregamento
     * - error: Estado de erro
     */
    const [settings, setSettings] = useState({
        theme: 'light',
        notifications: {
            email: true,
            push: true,
            sms: false
        },
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        currency: 'BRL',
        distanceUnit: 'km'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchSettings();
    }, []);

    /**
     * Busca configurações do usuário
     * 
     * @returns {Promise<void>}
     */
    const fetchSettings = async () => {
        try {
            setLoading(true);
            setError(null);
            
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const { data, error } = await supabase
                .from('configuracoes_usuario')
                .select('*')
                .eq('usuario_id', user.id)
                .single();

            if (error) throw error;
            
            setSettings(data || settings);
        } catch (error) {
            setError(error.message);
            toast.error('Erro ao carregar configurações');
            console.error('Erro ao carregar configurações:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Atualiza configurações do usuário
     * 
     * @param {Object} updates - Novas configurações
     * @returns {Promise<void>}
     */
    const updateSettings = async (updates) => {
        try {
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const { error } = await supabase
                .from('configuracoes_usuario')
                .upsert({
                    usuario_id: user.id,
                    ...updates
                });

            if (error) throw error;
            
            setSettings(prev => ({
                ...prev,
                ...updates
            }));
            
            toast.success('Configurações atualizadas com sucesso');
        } catch (error) {
            setError(error.message);
            toast.error('Erro ao atualizar configurações');
            console.error('Erro ao atualizar configurações:', error);
        }
    };

    /**
     * Atualiza tema
     * 
     * @param {string} theme - 'light' ou 'dark'
     * @returns {Promise<void>}
     */
    const updateTheme = async (theme) => {
        await updateSettings({ theme });
    };

    /**
     * Atualiza configurações de notificações
     * 
     * @param {Object} notificationSettings - Novas configurações de notificações
     * @returns {Promise<void>}
     */
    const updateNotificationSettings = async (notificationSettings) => {
        await updateSettings({ notifications: notificationSettings });
    };

    /**
     * Atualiza idioma
     * 
     * @param {string} language - Código do idioma (ex: 'pt-BR', 'en-US')
     * @returns {Promise<void>}
     */
    const updateLanguage = async (language) => {
        await updateSettings({ language });
    };

    /**
     * Atualiza fuso horário
     * 
     * @param {string} timezone - Fuso horário (ex: 'America/Sao_Paulo')
     * @returns {Promise<void>}
     */
    const updateTimezone = async (timezone) => {
        await updateSettings({ timezone });
    };

    /**
     * Atualiza moeda
     * 
     * @param {string} currency - Código da moeda (ex: 'BRL', 'USD')
     * @returns {Promise<void>}
     */
    const updateCurrency = async (currency) => {
        await updateSettings({ currency });
    };

    /**
     * Atualiza unidade de distância
     * 
     * @param {string} distanceUnit - Unidade de distância ('km' ou 'mi')
     * @returns {Promise<void>}
     */
    const updateDistanceUnit = async (distanceUnit) => {
        await updateSettings({ distanceUnit });
    };

    return (
        <UserSettingsContext.Provider
            value={{
                settings,
                loading,
                error,
                fetchSettings,
                updateSettings,
                updateTheme,
                updateNotificationSettings,
                updateLanguage,
                updateTimezone,
                updateCurrency,
                updateDistanceUnit
            }}
        >
            {children}
        </UserSettingsContext.Provider>
    );
};
