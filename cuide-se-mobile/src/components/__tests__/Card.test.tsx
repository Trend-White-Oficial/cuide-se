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
      title: 'Test Title',
      subtitle: 'Test Subtitle',
    });
    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Subtitle')).toBeTruthy();
  });

  it('renders with image', () => {
    const imageSource = { uri: 'https://example.com/image.jpg' };
    const { getByTestId } = renderCard({
      testID: 'card',
      image: imageSource,
    });
    expect(getByTestId('card-image')).toBeTruthy();
  });

  it('renders with children', () => {
    const { getByText } = renderCard({
      children: <Text>Test Content</Text>,
    });
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('renders with footer', () => {
    const { getByText } = renderCard({
      footer: <Text>Test Footer</Text>,
    });
    expect(getByText('Test Footer')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = renderCard({
      testID: 'card',
      onPress,
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
      testID: 'card',
      title: 'Test Title',
      subtitle: 'Test Subtitle',
      image: { uri: 'https://example.com/image.jpg' },
      footer: <Text>Test Footer</Text>,
      containerStyle,
      titleStyle,
      subtitleStyle,
      imageStyle,
      contentStyle,
      footerStyle,
    });

    const card = getByTestId('card');
    const title = getByText('Test Title');
    const subtitle = getByText('Test Subtitle');
    const image = getByTestId('card-image');
    const footer = getByText('Test Footer');

    expect(card.props.style).toContainEqual(containerStyle);
    expect(title.props.style).toContainEqual(titleStyle);
    expect(subtitle.props.style).toContainEqual(subtitleStyle);
    expect(image.props.style).toContainEqual(imageStyle);
    expect(footer.parent?.props.style).toContainEqual(footerStyle);
  });

  it('applies correct theme colors', () => {
    const { getByTestId, getByText } = renderCard({
      testID: 'card',
      title: 'Test Title',
      subtitle: 'Test Subtitle',
      border: true,
    });

    const card = getByTestId('card');
    const title = getByText('Test Title');
    const subtitle = getByText('Test Subtitle');

    expect(card.props.style).toContainEqual({
      backgroundColor: '#FFFFFF',
      borderColor: '#E5E5E5',
      shadowColor: '#000000',
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
      testID: 'card',
      elevation: 4,
    });

    const card = getByTestId('card');
    expect(card.props.style).toContainEqual({
      elevation: 4,
    });
  });

  it('renders without border when border prop is false', () => {
    const { getByTestId } = renderCard({
      testID: 'card',
      border: false,
    });

    const card = getByTestId('card');
    expect(card.props.style).toContainEqual({
      borderColor: 'transparent',
    });
  });
}); 