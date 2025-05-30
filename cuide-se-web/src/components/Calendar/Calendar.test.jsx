import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Calendar } from './Calendar';
import { CalendarContext } from '../../contexts/CalendarContext';
import { AuthContext } from '../../contexts/AuthContext';
import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockEvents = [
    {
        id: 1,
        titulo: 'Consulta de Manutenção',
        data_inicio: '2024-05-10T14:00:00.000Z',
        data_fim: '2024-05-10T15:00:00.000Z',
        perfil: {
            nome_completo: 'Profissional Teste',
            foto_perfil_url: 'https://example.com/profile.jpg'
        }
    },
    {
        id: 2,
        titulo: 'Manicure',
        data_inicio: '2024-05-12T10:00:00.000Z',
        data_fim: '2024-05-12T11:00:00.000Z',
        perfil: {
            nome_completo: 'Manicure Teste',
            foto_perfil_url: 'https://example.com/manicure.jpg'
        }
    }
];

const mockCalendarService = {
    fetchEvents: vi.fn(),
    addEvent: vi.fn(),
    updateEvent: vi.fn(),
    deleteEvent: vi.fn(),
    setSelectedDate: vi.fn()
};

describe('Calendar Component', () => {
    const mockUser = {
        id: '123',
        nome_completo: 'Test User'
    };

    const mockContext = {
        events: mockEvents,
        selectedDate: new Date('2024-05-10'),
        loading: false,
        fetchEvents: mockCalendarService.fetchEvents,
        addEvent: mockCalendarService.addEvent,
        updateEvent: mockCalendarService.updateEvent,
        deleteEvent: mockCalendarService.deleteEvent,
        setSelectedDate: mockCalendarService.setSelectedDate
    };

    const mockAuthContext = {
        user: mockUser
    };

    const renderComponent = () => {
        return render(
            <AuthContext.Provider value={mockAuthContext}>
                <CalendarContext.Provider value={mockContext}>
                    <Calendar />
                </CalendarContext.Provider>
            </AuthContext.Provider>
        );
    };

    it('should render calendar with events', () => {
        renderComponent();
        
        expect(screen.getByText('Consulta de Manutenção')).toBeInTheDocument();
        expect(screen.getByText('Manicure')).toBeInTheDocument();
    });

    it('should show correct date selection', () => {
        renderComponent();
        
        expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    });

    it('should call setSelectedDate when date is changed', () => {
        renderComponent();
        
        const dateInput = screen.getByDisplayValue('10');
        fireEvent.change(dateInput, { target: { value: '12' } });
        
        expect(mockContext.setSelectedDate).toHaveBeenCalledWith(new Date('2024-05-12'));
    });

    it('should call addEvent when new event is created', async () => {
        renderComponent();
        
        const addEventButton = screen.getByText('Adicionar Evento');
        fireEvent.click(addEventButton);
        
        const tituloInput = screen.getByLabelText('Título');
        fireEvent.change(tituloInput, { target: { value: 'Novo Evento' } });

        const saveButton = screen.getByText('Salvar');
        fireEvent.click(saveButton);
        
        await waitFor(() => {
            expect(mockContext.addEvent).toHaveBeenCalledWith({
                titulo: 'Novo Evento',
                data_inicio: expect.any(String),
                data_fim: expect.any(String)
            });
        });
    });

    it('should show loading state', () => {
        const loadingContext = { ...mockContext, loading: true };
        
        render(
            <AuthContext.Provider value={mockAuthContext}>
                <CalendarContext.Provider value={loadingContext}>
                    <Calendar />
                </CalendarContext.Provider>
            </AuthContext.Provider>
        );
        
        expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });
});
