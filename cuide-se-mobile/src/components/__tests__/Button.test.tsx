import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';
import { ThemeProvider } from '../../contexts/ThemeContext';

describe('Button', () => {
  const renderButton = (props = {}) => {
    return render(
      <ThemeProvider>
        <Button title="Test Button" onPress={() => {}} {...props} />
      </ThemeProvider>
    );
  };

  it('renders correctly with default props', () => {
    const { getByText } = renderButton();
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = renderButton({ onPress });
    fireEvent.press(getByText('Test Button'));
    expect(onPress).toHaveBeenCalled();
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = renderButton({ onPress, disabled: true });
    fireEvent.press(getByText('Test Button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows loading indicator when loading', () => {
    const { getByTestId } = renderButton({ loading: true });
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('applies correct styles for different variants', () => {
    const { getByText, rerender } = renderButton();

    // Primary variant (default)
    let button = getByText('Test Button');
    expect(button.parent?.props.style.backgroundColor).toBe('#007AFF');

    // Secondary variant
    rerender(
      <ThemeProvider>
        <Button title="Test Button" onPress={() => {}} variant="secondary" />
      </ThemeProvider>
    );
    button = getByText('Test Button');
    expect(button.parent?.props.style.backgroundColor).toBe('#5856D6');

    // Outline variant
    rerender(
      <ThemeProvider>
        <Button title="Test Button" onPress={() => {}} variant="outline" />
      </ThemeProvider>
    );
    button = getByText('Test Button');
    expect(button.parent?.props.style.backgroundColor).toBe('transparent');
    expect(button.parent?.props.style.borderColor).toBe('#007AFF');
  });

  it('applies correct styles for different sizes', () => {
    const { getByText, rerender } = renderButton();

    // Medium size (default)
    let button = getByText('Test Button');
    expect(button.props.style.fontSize).toBe(16);

    // Small size
    rerender(
      <ThemeProvider>
        <Button title="Test Button" onPress={() => {}} size="small" />
      </ThemeProvider>
    );
    button = getByText('Test Button');
    expect(button.props.style.fontSize).toBe(14);

    // Large size
    rerender(
      <ThemeProvider>
        <Button title="Test Button" onPress={() => {}} size="large" />
      </ThemeProvider>
    );
    button = getByText('Test Button');
    expect(button.props.style.fontSize).toBe(18);
  });

  it('applies custom styles', () => {
    const customStyle = { marginTop: 10 };
    const customTextStyle = { fontWeight: 'bold' };
    const { getByText } = renderButton({
      style: customStyle,
      textStyle: customTextStyle,
    });

    const button = getByText('Test Button');
    expect(button.parent?.props.style.marginTop).toBe(10);
    expect(button.props.style.fontWeight).toBe('bold');
  });
}); 