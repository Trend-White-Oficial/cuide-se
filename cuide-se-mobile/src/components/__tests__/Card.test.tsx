import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Card } from '../Card';
import { ThemeProvider } from '../../contexts/ThemeContext';

describe('Card', () => {
  const renderCard = (props = {}) => {
    return render(
      <ThemeProvider>
        <Card {...props} />
      </ThemeProvider>
    );
  };

  it('renders correctly with default props', () => {
    const { getByTestId } = renderCard({ testID: 'card' });
    expect(getByTestId('card')).toBeTruthy();
  });

  it('renders with title and subtitle', () => {
    const { getByText } = renderCard({
      title: 'Título do Card',
      subtitle: 'Subtítulo do Card',
    });

    expect(getByText('Título do Card')).toBeTruthy();
    expect(getByText('Subtítulo do Card')).toBeTruthy();
  });

  it('renders with image', () => {
    const imageSource = { uri: 'https://example.com/image.jpg' };
    const { getByTestId } = renderCard({
      image: imageSource,
      testID: 'card',
    });

    const card = getByTestId('card');
    expect(card).toBeTruthy();
  });

  it('renders with children', () => {
    const { getByText } = renderCard({
      children: <Text>Conteúdo do Card</Text>,
    });

    expect(getByText('Conteúdo do Card')).toBeTruthy();
  });

  it('renders with footer', () => {
    const { getByText } = renderCard({
      footer: <Text>Rodapé do Card</Text>,
    });

    expect(getByText('Rodapé do Card')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = renderCard({
      onPress,
      testID: 'card',
    });

    fireEvent.press(getByTestId('card'));
    expect(onPress).toHaveBeenCalled();
  });

  it('applies custom styles', () => {
    const containerStyle = { marginTop: 10 };
    const titleStyle = { fontSize: 20 };
    const subtitleStyle = { fontSize: 16 };
    const imageStyle = { height: 300 };
    const contentStyle = { padding: 20 };
    const footerStyle = { padding: 20 };

    const { getByTestId, getByText } = renderCard({
      title: 'Título',
      subtitle: 'Subtítulo',
      containerStyle,
      titleStyle,
      subtitleStyle,
      imageStyle,
      contentStyle,
      footerStyle,
      testID: 'card',
    });

    const card = getByTestId('card');
    const title = getByText('Título');
    const subtitle = getByText('Subtítulo');

    expect(card.props.style).toContainEqual(containerStyle);
    expect(title.props.style).toContainEqual(titleStyle);
    expect(subtitle.props.style).toContainEqual(subtitleStyle);
  });

  it('applies correct theme colors', () => {
    const { getByTestId, getByText } = renderCard({
      title: 'Título',
      subtitle: 'Subtítulo',
      testID: 'card',
    });

    const card = getByTestId('card');
    const title = getByText('Título');
    const subtitle = getByText('Subtítulo');

    expect(card.props.style).toContainEqual({
      backgroundColor: '#FFFFFF',
      borderColor: '#E5E5E5',
    });

    expect(title.props.style).toContainEqual({
      color: '#000000',
    });

    expect(subtitle.props.style).toContainEqual({
      color: '#666666',
    });
  });

  it('applies correct elevation', () => {
    const { getByTestId } = renderCard({
      elevation: 4,
      testID: 'card',
    });

    const card = getByTestId('card');
    expect(card.props.style).toContainEqual({
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    });
  });

  it('renders without border when border prop is false', () => {
    const { getByTestId } = renderCard({
      border: false,
      testID: 'card',
    });

    const card = getByTestId('card');
    expect(card.props.style).toContainEqual({
      borderWidth: 0,
    });
  });
}); 