import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar as ReactCalendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Calendar = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        start: new Date(),
        end: new Date()
    });
    const [showAddEvent, setShowAddEvent] = useState(false);

    useEffect(() => {
        fetchEvents();
        subscribeToEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data, error } = await supabase
                .from('eventos')
                .select(`
                    *,
                    perfil:perfil_id (
                        nome_completo,
                        foto_perfil_url
                    )
                `)
                .eq('perfil_id', user.id);

            if (error) throw error;
            setEvents(data);
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
        }
    };

    const subscribeToEvents = () => {
        const channel = supabase.channel('events')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'eventos',
                    filter: `perfil_id=eq.${user.id}`
                },
                (payload) => {
                    fetchEvents();
                }
            )
            .subscribe();
    };

    const addEvent = async () => {
        try {
            const { error } = await supabase
                .from('eventos')
                .insert({
                    perfil_id: user.id,
                    titulo: newEvent.title,
                    descricao: newEvent.description,
                    data_inicio: newEvent.start,
                    data_fim: newEvent.end
                });

            if (error) throw error;
            
            setNewEvent({
                title: '',
                description: '',
                start: new Date(),
                end: new Date()
            });
            setShowAddEvent(false);
            fetchEvents();
        } catch (error) {
            console.error('Erro ao adicionar evento:', error);
        }
    };

    const addCalendarEvent = (event) => {
        const start = new Date(event.data_inicio);
        const end = new Date(event.data_fim);
        
        // Adicionar ao calendário do dispositivo
        if (navigator.userAgent.indexOf('iPhone') > -1 || 
            navigator.userAgent.indexOf('iPad') > -1) {
            // iOS
            window.location.href = `webcal://${window.location.origin}/event/${event.id}`;
        } else if (navigator.userAgent.indexOf('Android') > -1) {
            // Android
            window.location.href = `content://com.android.calendar/events/${event.id}`;
        } else {
            // Desktop
            window.location.href = `webcal://${window.location.origin}/event/${event.id}`;
        }
    };

    const formatEventTime = (date) => {
        return new Date(date).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <h1>Meu Calendário</h1>
                <button onClick={() => setShowAddEvent(true)}>
                    Adicionar Evento
                </button>
            </div>

            {showAddEvent && (
                <div className="add-event-modal">
                    <div className="modal-content">
                        <h2>Adicionar Evento</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            addEvent();
                        }}>
                            <div className="form-group">
                                <label>Título</label>
                                <input
                                    type="text"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Descrição</label>
                                <textarea
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Data de Início</label>
                                <input
                                    type="datetime-local"
                                    value={newEvent.start.toISOString().slice(0, 16)}
                                    onChange={(e) => {
                                        setNewEvent({
                                            ...newEvent,
                                            start: new Date(e.target.value)
                                        });
                                    }}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Data de Término</label>
                                <input
                                    type="datetime-local"
                                    value={newEvent.end.toISOString().slice(0, 16)}
                                    onChange={(e) => {
                                        setNewEvent({
                                            ...newEvent,
                                            end: new Date(e.target.value)
                                        });
                                    }}
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit">Salvar</button>
                                <button type="button" onClick={() => setShowAddEvent(false)}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="calendar-content">
                <ReactCalendar
                    value={selectedDate}
                    onChange={setSelectedDate}
                    selectRange={true}
                    minDetail="month"
                    onClickDay={(date) => {
                        setSelectedDate(date);
                        fetchEvents();
                    }}
                />

                <div className="events-list">
                    <h2>Eventos do Dia</h2>
                    <div className="events-grid">
                        {events
                            .filter(event => {
                                const eventDate = new Date(event.data_inicio);
                                return eventDate.toDateString() === selectedDate.toDateString();
                            })
                            .map((event) => (
                                <div key={event.id} className="event-card">
                                    <div className="event-header">
                                        <h3>{event.titulo}</h3>
                                        <span className="event-time">
                                            {formatEventTime(event.data_inicio)} - {formatEventTime(event.data_fim)}
                                        </span>
                                    </div>
                                    <p>{event.descricao}</p>
                                    <div className="event-actions">
                                        <button onClick={() => addCalendarEvent(event)}>
                                            Adicionar ao Calendário
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .calendar-container {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .calendar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .calendar-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .add-event-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }

                .modal-content {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    width: 100%;
                    max-width: 500px;
                }

                .form-group {
                    margin-bottom: 15px;
                }

                label {
                    display: block;
                    margin-bottom: 5px;
                }

                input,
                textarea {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }

                textarea {
                    height: 100px;
                    resize: vertical;
                }

                .form-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }

                .events-list {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .events-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }

                .event-card {
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 4px;
                }

                .event-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }

                .event-time {
                    font-size: 12px;
                    color: #666;
                }

                .event-actions {
                    margin-top: 10px;
                }

                @media (max-width: 768px) {
                    .calendar-content {
                        grid-template-columns: 1fr;
                    }

                    .events-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default Calendar;
