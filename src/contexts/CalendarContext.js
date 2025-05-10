import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

export const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
        subscribeToEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            
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
                .order('data_inicio', { ascending: true });

            if (error) throw error;
            
            setEvents(data);
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
        } finally {
            setLoading(false);
        }
    };

    const addEvent = async (eventData) => {
        try {
            const { error } = await supabase
                .from('eventos')
                .insert({
                    ...eventData,
                    data_criacao: new Date().toISOString()
                });

            if (error) throw error;
            
            fetchEvents();
        } catch (error) {
            console.error('Erro ao adicionar evento:', error);
        }
    };

    const updateEvent = async (eventId, eventData) => {
        try {
            const { error } = await supabase
                .from('eventos')
                .update(eventData)
                .eq('id', eventId);

            if (error) throw error;
            
            fetchEvents();
        } catch (error) {
            console.error('Erro ao atualizar evento:', error);
        }
    };

    const deleteEvent = async (eventId) => {
        try {
            const { error } = await supabase
                .from('eventos')
                .delete()
                .eq('id', eventId);

            if (error) throw error;
            
            fetchEvents();
        } catch (error) {
            console.error('Erro ao deletar evento:', error);
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
