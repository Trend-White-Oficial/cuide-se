/**
 * Contexto para gerenciamento de eventos do calendário
 * 
 * Este contexto gerencia todas as operações relacionadas a eventos do calendário,
 * incluindo busca, criação, atualização e remoção de eventos.
 */
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';

export const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
    /**
     * Estado gerenciado pelo contexto:
     * - events: Array de eventos do usuário
     * - selectedDate: Data selecionada pelo usuário
     * - loading: Estado de carregamento
     * - error: Estado de erro
     */
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchEvents();
        subscribeToEvents();
    }, []);

    /**
     * Busca eventos futuros do usuário
     * 
     * @returns {Promise<void>}
     */
    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const { data, error } = await supabase
                .from('eventos')
                .select(`
                    *,
                    perfil:perfil_id (
                        nome_completo,
                        foto_perfil_url
                    )
                `)
                .gte('data_inicio', new Date().toISOString())
                .eq('usuario_id', user.id)
                .order('data_inicio', { ascending: true });

            if (error) throw error;
            
            setEvents(data || []);
        } catch (error) {
            setError(error.message);
            toast.error('Erro ao carregar eventos');
            console.error('Erro ao carregar eventos:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Cria um novo evento para o usuário
     * 
     * @param {Object} eventData - Dados do novo evento
     * @returns {Promise<void>}
     */
    const createEvent = async (eventData) => {
        try {
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const { data, error } = await supabase
                .from('eventos')
                .insert([{
                    ...eventData,
                    usuario_id: user.id
                }]);

            if (error) throw error;
            
            fetchEvents();
            toast.success('Evento criado com sucesso');
        } catch (error) {
            setError(error.message);
            toast.error('Erro ao criar evento');
            console.error('Erro ao criar evento:', error);
        }
    };

    /**
     * Atualiza um evento existente do usuário
     * 
     * @param {string} eventId - ID do evento a ser atualizado
     * @param {Object} eventData - Novos dados do evento
     * @returns {Promise<void>}
     */
    const updateEvent = async (eventId, eventData) => {
        try {
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const { error } = await supabase
                .from('eventos')
                .update({
                    ...eventData,
                    usuario_id: user.id
                })
                .eq('id', eventId)
                .eq('usuario_id', user.id);

            if (error) throw error;
            
            fetchEvents();
            toast.success('Evento atualizado com sucesso');
        } catch (error) {
            setError(error.message);
            toast.error('Erro ao atualizar evento');
            console.error('Erro ao atualizar evento:', error);
        }
    };

    /**
     * Remove um evento do usuário
     * 
     * @param {string} eventId - ID do evento a ser removido
     * @returns {Promise<void>}
     */
    const deleteEvent = async (eventId) => {
        try {
            if (!user) {
                throw new Error('Usuário não autenticado');
            }

            const { error } = await supabase
                .from('eventos')
                .delete()
                .eq('id', eventId)
                .eq('usuario_id', user.id);

            if (error) throw error;
            
            fetchEvents();
            toast.success('Evento removido com sucesso');
        } catch (error) {
            setError(error.message);
            toast.error('Erro ao remover evento');
            console.error('Erro ao remover evento:', error);
        }
    };

    const subscribeToEvents = () => {
        const channel = supabase.channel('events')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'eventos'
                },
                (payload) => {
                    fetchEvents();
                }
            )
            .subscribe();
    };

    return (
        <CalendarContext.Provider
            value={{
                events,
                selectedDate,
                loading,
                fetchEvents,
                addEvent,
                updateEvent,
                deleteEvent,
                setSelectedDate
            }}
        >
            {children}
        </CalendarContext.Provider>
    );
};
