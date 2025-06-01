import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AppointmentCard } from '../AppointmentCard';
import { useNavigation } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('AppointmentCard', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  const mockAppointment = {
    id: '1',
    date: '2024-02-20',
    time: '14:00',
    status: 'pending' as const,
    service: 'Corte de Cabelo',
    professional: 'João Silva',
  };

  const mockOnCancel = jest.fn();
  const mockOnConfirm = jest.fn();
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
  });

  it('should render correctly', () => {
    const { getByText } = render(
      <AppointmentCard
        appointment={mockAppointment}
        onCancel={mockOnCancel}
        onConfirm={mockOnConfirm}
        onComplete={mockOnComplete}
      />
    );

    expect(getByText('Corte de Cabelo')).toBeTruthy();
    expect(getByText('João Silva')).toBeTruthy();
    expect(getByText('2024-02-20')).toBeTruthy();
    expect(getByText('14:00')).toBeTruthy();
  });

  it('should navigate to details when pressed', () => {
    const { getByText } = render(
      <AppointmentCard
        appointment={mockAppointment}
        onCancel={mockOnCancel}
        onConfirm={mockOnConfirm}
        onComplete={mockOnComplete}
      />
    );

    fireEvent.press(getByText('Corte de Cabelo'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('AppointmentDetails', {
      id: '1',
    });
  });

  it('should show cancel and confirm buttons for pending appointments', () => {
    const { getByText } = render(
      <AppointmentCard
        appointment={mockAppointment}
        onCancel={mockOnCancel}
        onConfirm={mockOnConfirm}
        onComplete={mockOnComplete}
      />
    );

    expect(getByText('appointments.actions.cancel')).toBeTruthy();
    expect(getByText('appointments.actions.confirm')).toBeTruthy();
  });

  it('should call onCancel when cancel button is pressed', () => {
    const { getByText } = render(
      <AppointmentCard
        appointment={mockAppointment}
        onCancel={mockOnCancel}
        onConfirm={mockOnConfirm}
        onComplete={mockOnComplete}
      />
    );

    fireEvent.press(getByText('appointments.actions.cancel'));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should call onConfirm when confirm button is pressed', () => {
    const { getByText } = render(
      <AppointmentCard
        appointment={mockAppointment}
        onCancel={mockOnCancel}
        onConfirm={mockOnConfirm}
        onComplete={mockOnComplete}
      />
    );

    fireEvent.press(getByText('appointments.actions.confirm'));
    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it('should show complete button for confirmed appointments', () => {
    const confirmedAppointment = {
      ...mockAppointment,
      status: 'confirmed' as const,
    };

    const { getByText } = render(
      <AppointmentCard
        appointment={confirmedAppointment}
        onCancel={mockOnCancel}
        onConfirm={mockOnConfirm}
        onComplete={mockOnComplete}
      />
    );

    expect(getByText('appointments.actions.complete')).toBeTruthy();
  });

  it('should call onComplete when complete button is pressed', () => {
    const confirmedAppointment = {
      ...mockAppointment,
      status: 'confirmed' as const,
    };

    const { getByText } = render(
      <AppointmentCard
        appointment={confirmedAppointment}
        onCancel={mockOnCancel}
        onConfirm={mockOnConfirm}
        onComplete={mockOnComplete}
      />
    );

    fireEvent.press(getByText('appointments.actions.complete'));
    expect(mockOnComplete).toHaveBeenCalled();
  });
}); 