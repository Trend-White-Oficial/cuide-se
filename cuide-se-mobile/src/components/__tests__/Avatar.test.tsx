import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Avatar } from '../Avatar';
import { ThemeProvider } from '../../contexts/ThemeContext';

describe('Avatar', () => {
  const renderAvatar = (props = {}) => {
    return render(
      <ThemeProvider>
        <Avatar {...props} />
      </ThemeProvider>
    );
  };

  it('renders correctly with default props', () => {
    const { getByTestId } = renderAvatar({ testID: 'avatar' });
    expect(getByTestId('avatar')).toBeTruthy();
  });

  it('renders with image', () => {
    const imageSource = { uri: 'https://example.com/avatar.jpg' };
    const { getByTestId } = renderAvatar({
      source: imageSource,
      testID: 'avatar',
    });
    expect(getByTestId('avatar')).toBeTruthy();
  });

  it('renders with initials when name is provided', () => {
    const { getByText } = renderAvatar({
      name: 'João Silva',
    });
    expect(getByText('JS')).toBeTruthy();
  });

  it('renders with custom size', () => {
    const { getByTestId } = renderAvatar({
      size: 60,
      testID: 'avatar',
    });
    const avatar = getByTestId('avatar');
    expect(avatar.props.style).toContainEqual({
      width: 60,
      height: 60,
      borderRadius: 30,
    });
  });

  it('renders with border when showBorder is true', () => {
    const { getByTestId } = renderAvatar({
      showBorder: true,
      testID: 'avatar',
    });
    const avatar = getByTestId('avatar');
    expect(avatar.props.style).toContainEqual({
      borderWidth: 2,
    });
  });

  it('renders with custom border color', () => {
    const { getByTestId } = renderAvatar({
      showBorder: true,
      borderColor: 'red',
      testID: 'avatar',
    });
    const avatar = getByTestId('avatar');
    expect(avatar.props.style).toContainEqual({
      borderColor: 'red',
    });
  });

  it('renders with custom border width', () => {
    const { getByTestId } = renderAvatar({
      showBorder: true,
      borderWidth: 4,
      testID: 'avatar',
    });
    const avatar = getByTestId('avatar');
    expect(avatar.props.style).toContainEqual({
      borderWidth: 4,
    });
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = renderAvatar({
      onPress,
      testID: 'avatar',
    });

    fireEvent.press(getByTestId('avatar'));
    expect(onPress).toHaveBeenCalled();
  });

  it('applies custom styles', () => {
    const containerStyle = { marginTop: 10 };
    const imageStyle = { opacity: 0.8 };
    const textStyle = { fontSize: 20 };

    const { getByTestId, getByText } = renderAvatar({
      name: 'João Silva',
      containerStyle,
      imageStyle,
      textStyle,
      testID: 'avatar',
    });

    const avatar = getByTestId('avatar');
    const text = getByText('JS');

    expect(avatar.props.style).toContainEqual(containerStyle);
    expect(text.props.style).toContainEqual(textStyle);
  });

  it('applies correct theme colors', () => {
    const { getByTestId, getByText } = renderAvatar({
      name: 'João Silva',
      showBorder: true,
      testID: 'avatar',
    });

    const avatar = getByTestId('avatar');
    const text = getByText('JS');

    expect(avatar.props.style).toContainEqual({
      backgroundColor: '#007AFF',
      borderColor: '#E5E5E5',
    });

    expect(text.props.style).toContainEqual({
      color: '#FFFFFF',
    });
  });
}); 