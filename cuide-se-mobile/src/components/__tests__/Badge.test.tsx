import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Badge } from '../Badge';
import { ThemeProvider } from '../../contexts/ThemeContext';

describe('Badge', () => {
  const renderBadge = (props = {}) => {
    return render(
      <ThemeProvider>
        <Badge label="Test" {...props} />
      </ThemeProvider>
    );
  };

  it('renders correctly with default props', () => {
    const { getByText } = renderBadge();
    expect(getByText('Test')).toBeTruthy();
  });

  it('renders with different variants', () => {
    const variants = ['primary', 'success', 'warning', 'error', 'info'] as const;
    variants.forEach((variant) => {
      const { getByText } = renderBadge({ variant });
      const badge = getByText('Test');
      expect(badge).toBeTruthy();
    });
  });

  it('renders with different sizes', () => {
    const sizes = ['small', 'medium', 'large'] as const;
    sizes.forEach((size) => {
      const { getByText } = renderBadge({ size });
      const badge = getByText('Test');
      expect(badge).toBeTruthy();
    });
  });

  it('renders as dot when dot prop is true', () => {
    const { queryByText } = renderBadge({ dot: true });
    expect(queryByText('Test')).toBeNull();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = renderBadge({ onPress });
    fireEvent.press(getByText('Test'));
    expect(onPress).toHaveBeenCalled();
  });

  it('applies custom styles', () => {
    const containerStyle = { marginTop: 10 };
    const textStyle = { fontSize: 20 };

    const { getByText } = renderBadge({
      containerStyle,
      textStyle,
    });

    const badge = getByText('Test');
    expect(badge.props.style).toContainEqual(textStyle);
  });

  it('applies correct theme colors', () => {
    const { getByText } = renderBadge({
      variant: 'success',
    });

    const badge = getByText('Test');
    expect(badge.props.style).toContainEqual({
      color: '#FFFFFF',
    });
  });

  it('applies correct size styles', () => {
    const { getByText } = renderBadge({
      size: 'large',
    });

    const badge = getByText('Test');
    expect(badge.props.style).toContainEqual({
      fontSize: 14,
    });
  });

  it('applies correct dot styles', () => {
    const { getByTestId } = renderBadge({
      dot: true,
      testID: 'badge',
    });

    const badge = getByTestId('badge');
    expect(badge.props.style).toContainEqual({
      minWidth: 12,
      minHeight: 12,
    });
  });
}); 