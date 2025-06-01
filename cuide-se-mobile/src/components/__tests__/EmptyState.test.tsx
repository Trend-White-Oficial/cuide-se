import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EmptyState } from '../EmptyState';
import { ThemeProvider } from '../../contexts/ThemeContext';

describe('EmptyState', () => {
  const renderEmptyState = (props = {}) => {
    return render(
      <ThemeProvider>
        <EmptyState
          title="Nenhum item encontrado"
          description="Tente novamente mais tarde"
          {...props}
        />
      </ThemeProvider>
    );
  };

  it('renders correctly with default props', () => {
    const { getByText } = renderEmptyState();
    expect(getByText('Nenhum item encontrado')).toBeTruthy();
    expect(getByText('Tente novamente mais tarde')).toBeTruthy();
  });

  it('renders with image', () => {
    const imageSource = { uri: 'https://example.com/empty.png' };
    const { getByTestId } = renderEmptyState({
      image: imageSource,
      testID: 'empty-state-image',
    });
    expect(getByTestId('empty-state-image')).toBeTruthy();
  });

  it('renders with button when buttonText and onPress are provided', () => {
    const onPress = jest.fn();
    const { getByText } = renderEmptyState({
      buttonText: 'Tentar novamente',
      onPress,
    });

    expect(getByText('Tentar novamente')).toBeTruthy();
    fireEvent.press(getByText('Tentar novamente'));
    expect(onPress).toHaveBeenCalled();
  });

  it('does not render button when only buttonText is provided', () => {
    const { queryByText } = renderEmptyState({
      buttonText: 'Tentar novamente',
    });
    expect(queryByText('Tentar novamente')).toBeNull();
  });

  it('does not render button when only onPress is provided', () => {
    const { queryByText } = renderEmptyState({
      onPress: () => {},
    });
    expect(queryByText('Tentar novamente')).toBeNull();
  });

  it('applies custom styles', () => {
    const containerStyle = { marginTop: 10 };
    const titleStyle = { fontSize: 24 };
    const descriptionStyle = { fontSize: 18 };
    const buttonStyle = { backgroundColor: 'red' };
    const buttonTextStyle = { fontSize: 18 };
    const imageStyle = { width: 300 };

    const { getByText, getByTestId } = renderEmptyState({
      image: { uri: 'https://example.com/empty.png' },
      buttonText: 'Tentar novamente',
      onPress: () => {},
      containerStyle,
      titleStyle,
      descriptionStyle,
      buttonStyle,
      buttonTextStyle,
      imageStyle,
      testID: 'empty-state-image',
    });

    const title = getByText('Nenhum item encontrado');
    const description = getByText('Tente novamente mais tarde');
    const button = getByText('Tentar novamente');
    const image = getByTestId('empty-state-image');

    expect(title.props.style).toContainEqual(titleStyle);
    expect(description.props.style).toContainEqual(descriptionStyle);
    expect(button.props.style).toContainEqual(buttonTextStyle);
    expect(image.props.style).toContainEqual(imageStyle);
  });

  it('applies correct theme colors', () => {
    const { getByText } = renderEmptyState({
      buttonText: 'Tentar novamente',
      onPress: () => {},
    });

    const title = getByText('Nenhum item encontrado');
    const description = getByText('Tente novamente mais tarde');
    const button = getByText('Tentar novamente');

    expect(title.props.style).toContainEqual({
      color: '#000000',
    });

    expect(description.props.style).toContainEqual({
      color: '#666666',
    });

    expect(button.props.style).toContainEqual({
      color: '#FFFFFF',
    });
  });
}); 