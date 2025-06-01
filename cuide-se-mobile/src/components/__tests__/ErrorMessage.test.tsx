import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ErrorMessage } from '../ErrorMessage';
import { ThemeProvider } from '../../contexts/ThemeContext';

describe('ErrorMessage', () => {
  const renderErrorMessage = (props = {}) => {
    return render(
      <ThemeProvider>
        <ErrorMessage message="Erro ao carregar dados" {...props} />
      </ThemeProvider>
    );
  };

  it('renders correctly with default props', () => {
    const { getByText } = renderErrorMessage();
    expect(getByText('Erro ao carregar dados')).toBeTruthy();
  });

  it('renders with retry button when onRetry is provided', () => {
    const onRetry = jest.fn();
    const { getByText } = renderErrorMessage({
      onRetry,
    });

    expect(getByText('Tentar novamente')).toBeTruthy();
    fireEvent.press(getByText('Tentar novamente'));
    expect(onRetry).toHaveBeenCalled();
  });

  it('renders with custom retry button text', () => {
    const { getByText } = renderErrorMessage({
      onRetry: () => {},
      retryButtonText: 'Recarregar',
    });
    expect(getByText('Recarregar')).toBeTruthy();
  });

  it('renders with icon', () => {
    const icon = <Text testID="error-icon">⚠️</Text>;
    const { getByTestId } = renderErrorMessage({
      icon,
    });
    expect(getByTestId('error-icon')).toBeTruthy();
  });

  it('applies custom styles', () => {
    const containerStyle = { marginTop: 10 };
    const messageStyle = { fontSize: 18 };
    const retryButtonStyle = { backgroundColor: 'red' };
    const retryButtonTextStyle = { fontSize: 16 };

    const { getByText } = renderErrorMessage({
      onRetry: () => {},
      containerStyle,
      messageStyle,
      retryButtonStyle,
      retryButtonTextStyle,
    });

    const message = getByText('Erro ao carregar dados');
    const retryButton = getByText('Tentar novamente');

    expect(message.props.style).toContainEqual(messageStyle);
    expect(retryButton.props.style).toContainEqual(retryButtonTextStyle);
  });

  it('applies correct theme colors', () => {
    const { getByText } = renderErrorMessage({
      onRetry: () => {},
    });

    const message = getByText('Erro ao carregar dados');
    const retryButton = getByText('Tentar novamente');

    expect(message.props.style).toContainEqual({
      color: '#FF3B30',
    });

    expect(retryButton.props.style).toContainEqual({
      color: '#FFFFFF',
    });
  });

  it('does not render retry button when onRetry is not provided', () => {
    const { queryByText } = renderErrorMessage();
    expect(queryByText('Tentar novamente')).toBeNull();
  });
}); 