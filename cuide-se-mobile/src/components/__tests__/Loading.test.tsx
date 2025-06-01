import React from 'react';
import { render } from '@testing-library/react-native';
import { Loading } from '../Loading';
import { ThemeProvider } from '../../contexts/ThemeContext';

describe('Loading', () => {
  const renderLoading = (props = {}) => {
    return render(
      <ThemeProvider>
        <Loading visible={true} {...props} />
      </ThemeProvider>
    );
  };

  it('renders correctly with default props', () => {
    const { getByTestId } = renderLoading({ testID: 'loading' });
    expect(getByTestId('loading')).toBeTruthy();
  });

  it('renders with message', () => {
    const { getByText } = renderLoading({
      message: 'Carregando...',
    });
    expect(getByText('Carregando...')).toBeTruthy();
  });

  it('renders with small size', () => {
    const { getByTestId } = renderLoading({
      testID: 'loading',
      size: 'small',
    });
    const activityIndicator = getByTestId('loading');
    expect(activityIndicator.props.size).toBe('small');
  });

  it('renders with custom color', () => {
    const { getByTestId } = renderLoading({
      testID: 'loading',
      color: 'red',
    });
    const activityIndicator = getByTestId('loading');
    expect(activityIndicator.props.color).toBe('red');
  });

  it('renders with custom overlay color', () => {
    const { getByTestId } = renderLoading({
      testID: 'loading',
      overlayColor: 'rgba(0, 0, 0, 0.7)',
    });
    const container = getByTestId('loading');
    expect(container.props.style).toContainEqual({
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    });
  });

  it('applies custom styles', () => {
    const containerStyle = { marginTop: 10 };
    const messageStyle = { fontSize: 18 };

    const { getByTestId, getByText } = renderLoading({
      testID: 'loading',
      message: 'Carregando...',
      containerStyle,
      messageStyle,
    });

    const container = getByTestId('loading');
    const message = getByText('Carregando...');

    expect(container.props.style).toContainEqual(containerStyle);
    expect(message.props.style).toContainEqual(messageStyle);
  });

  it('applies correct theme colors', () => {
    const { getByTestId, getByText } = renderLoading({
      testID: 'loading',
      message: 'Carregando...',
    });

    const container = getByTestId('loading');
    const message = getByText('Carregando...');

    expect(container.props.style).toContainEqual({
      backgroundColor: '#FFFFFF',
    });

    expect(message.props.style).toContainEqual({
      color: '#000000',
    });
  });

  it('does not render when visible is false', () => {
    const { queryByTestId } = renderLoading({
      testID: 'loading',
      visible: false,
    });
    expect(queryByTestId('loading')).toBeNull();
  });
}); 