import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../Input';
import { ThemeProvider } from '../../contexts/ThemeContext';

describe('Input', () => {
  const renderInput = (props = {}) => {
    return render(
      <ThemeProvider>
        <Input {...props} />
      </ThemeProvider>
    );
  };

  it('renders correctly with default props', () => {
    const { getByTestId } = renderInput({ testID: 'input' });
    expect(getByTestId('input')).toBeTruthy();
  });

  it('renders with label', () => {
    const { getByText } = renderInput({ label: 'Test Label' });
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('renders with error message', () => {
    const { getByText } = renderInput({ error: 'Test Error' });
    expect(getByText('Test Error')).toBeTruthy();
  });

  it('handles text input', () => {
    const onChangeText = jest.fn();
    const { getByTestId } = renderInput({
      testID: 'input',
      onChangeText,
    });

    fireEvent.changeText(getByTestId('input'), 'test value');
    expect(onChangeText).toHaveBeenCalledWith('test value');
  });

  it('applies custom styles', () => {
    const containerStyle = { marginTop: 10 };
    const labelStyle = { fontSize: 20 };
    const inputStyle = { height: 60 };
    const errorStyle = { fontSize: 16 };

    const { getByTestId, getByText } = renderInput({
      testID: 'input',
      label: 'Test Label',
      error: 'Test Error',
      containerStyle,
      labelStyle,
      inputStyle,
      errorStyle,
    });

    const input = getByTestId('input');
    const label = getByText('Test Label');
    const error = getByText('Test Error');

    expect(input.props.style).toContainEqual(inputStyle);
    expect(label.props.style).toContainEqual(labelStyle);
    expect(error.props.style).toContainEqual(errorStyle);
  });

  it('applies correct theme colors', () => {
    const { getByTestId, getByText } = renderInput({
      testID: 'input',
      label: 'Test Label',
      error: 'Test Error',
    });

    const input = getByTestId('input');
    const label = getByText('Test Label');
    const error = getByText('Test Error');

    expect(input.props.style).toContainEqual({
      color: '#000000',
      backgroundColor: '#FFFFFF',
      borderColor: '#FF3B30',
    });

    expect(label.props.style).toContainEqual({
      color: '#000000',
    });

    expect(error.props.style).toContainEqual({
      color: '#FF3B30',
    });
  });
}); 