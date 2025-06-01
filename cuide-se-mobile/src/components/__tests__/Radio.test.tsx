import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Radio } from '../Radio';
import { ThemeProvider } from '../../contexts/ThemeContext';

describe('Radio', () => {
  const renderRadio = (props = {}) => {
    return render(
      <ThemeProvider>
        <Radio value="test" onChange={() => {}} {...props} />
      </ThemeProvider>
    );
  };

  it('renders correctly with default props', () => {
    const { getByTestId } = renderRadio({ testID: 'radio' });
    expect(getByTestId('radio')).toBeTruthy();
  });

  it('renders with label', () => {
    const { getByText } = renderRadio({ label: 'Test Label' });
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('renders with error message', () => {
    const { getByText } = renderRadio({ error: 'Test Error' });
    expect(getByText('Test Error')).toBeTruthy();
  });

  it('calls onChange when pressed', () => {
    const onChange = jest.fn();
    const { getByTestId } = renderRadio({
      testID: 'radio',
      onChange,
    });

    fireEvent.press(getByTestId('radio'));
    expect(onChange).toHaveBeenCalledWith('test');
  });

  it('does not call onChange when disabled', () => {
    const onChange = jest.fn();
    const { getByTestId } = renderRadio({
      testID: 'radio',
      onChange,
      disabled: true,
    });

    fireEvent.press(getByTestId('radio'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('shows selected state when value matches selectedValue', () => {
    const { getByTestId } = renderRadio({
      testID: 'radio',
      selectedValue: 'test',
    });

    expect(getByTestId('selected')).toBeTruthy();
  });

  it('applies custom styles', () => {
    const containerStyle = { marginTop: 10 };
    const labelStyle = { fontSize: 20 };
    const errorStyle = { fontSize: 16 };

    const { getByTestId, getByText } = renderRadio({
      testID: 'radio',
      label: 'Test Label',
      error: 'Test Error',
      containerStyle,
      labelStyle,
      errorStyle,
    });

    const radio = getByTestId('radio');
    const label = getByText('Test Label');
    const error = getByText('Test Error');

    expect(radio.parent?.props.style).toContainEqual(containerStyle);
    expect(label.props.style).toContainEqual(labelStyle);
    expect(error.props.style).toContainEqual(errorStyle);
  });

  it('applies correct theme colors', () => {
    const { getByTestId, getByText } = renderRadio({
      testID: 'radio',
      label: 'Test Label',
      error: 'Test Error',
      selectedValue: 'test',
    });

    const radio = getByTestId('radio');
    const label = getByText('Test Label');
    const error = getByText('Test Error');

    expect(radio.props.style).toContainEqual({
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