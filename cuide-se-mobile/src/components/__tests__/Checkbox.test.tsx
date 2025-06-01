import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Checkbox } from '../Checkbox';
import { ThemeProvider } from '../../contexts/ThemeContext';

describe('Checkbox', () => {
  const renderCheckbox = (props = {}) => {
    return render(
      <ThemeProvider>
        <Checkbox checked={false} onChange={() => {}} {...props} />
      </ThemeProvider>
    );
  };

  it('renders correctly with default props', () => {
    const { getByTestId } = renderCheckbox({ testID: 'checkbox' });
    expect(getByTestId('checkbox')).toBeTruthy();
  });

  it('renders with label', () => {
    const { getByText } = renderCheckbox({ label: 'Test Label' });
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('renders with error message', () => {
    const { getByText } = renderCheckbox({ error: 'Test Error' });
    expect(getByText('Test Error')).toBeTruthy();
  });

  it('calls onChange when pressed', () => {
    const onChange = jest.fn();
    const { getByTestId } = renderCheckbox({
      testID: 'checkbox',
      onChange,
    });

    fireEvent.press(getByTestId('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('does not call onChange when disabled', () => {
    const onChange = jest.fn();
    const { getByTestId } = renderCheckbox({
      testID: 'checkbox',
      onChange,
      disabled: true,
    });

    fireEvent.press(getByTestId('checkbox'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('shows checkmark when checked', () => {
    const { getByTestId } = renderCheckbox({
      testID: 'checkbox',
      checked: true,
    });

    expect(getByTestId('checkmark')).toBeTruthy();
  });

  it('applies custom styles', () => {
    const containerStyle = { marginTop: 10 };
    const labelStyle = { fontSize: 20 };
    const errorStyle = { fontSize: 16 };

    const { getByTestId, getByText } = renderCheckbox({
      testID: 'checkbox',
      label: 'Test Label',
      error: 'Test Error',
      containerStyle,
      labelStyle,
      errorStyle,
    });

    const checkbox = getByTestId('checkbox');
    const label = getByText('Test Label');
    const error = getByText('Test Error');

    expect(checkbox.parent?.props.style).toContainEqual(containerStyle);
    expect(label.props.style).toContainEqual(labelStyle);
    expect(error.props.style).toContainEqual(errorStyle);
  });

  it('applies correct theme colors', () => {
    const { getByTestId, getByText } = renderCheckbox({
      testID: 'checkbox',
      label: 'Test Label',
      error: 'Test Error',
      checked: true,
    });

    const checkbox = getByTestId('checkbox');
    const label = getByText('Test Label');
    const error = getByText('Test Error');

    expect(checkbox.props.style).toContainEqual({
      backgroundColor: '#007AFF',
      borderColor: '#007AFF',
    });

    expect(label.props.style).toContainEqual({
      color: '#000000',
    });

    expect(error.props.style).toContainEqual({
      color: '#FF3B30',
    });
  });
}); 