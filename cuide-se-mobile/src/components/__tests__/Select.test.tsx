import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Select } from '../Select';
import { ThemeProvider } from '../../contexts/ThemeContext';

// Mock do Picker
jest.mock('@react-native-picker/picker', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Picker: ({ selectedValue, onValueChange, children }) => (
      <View testID="picker">
        {React.Children.map(children, (child) => {
          if (child.props.value === selectedValue) {
            return React.cloneElement(child, {
              onPress: () => onValueChange(child.props.value),
            });
          }
          return null;
        })}
      </View>
    ),
    Item: ({ label, value, onPress }) => (
      <View testID={`picker-item-${value}`} onPress={onPress}>
        {label}
      </View>
    ),
  };
});

describe('Select', () => {
  const options = [
    { label: 'Opção 1', value: '1' },
    { label: 'Opção 2', value: '2' },
    { label: 'Opção 3', value: '3' },
  ];

  const renderSelect = (props = {}) => {
    return render(
      <ThemeProvider>
        <Select
          options={options}
          onChange={() => {}}
          {...props}
        />
      </ThemeProvider>
    );
  };

  it('renders correctly with default props', () => {
    const { getByText } = renderSelect();
    expect(getByText('Selecione uma opção')).toBeTruthy();
  });

  it('renders with label', () => {
    const { getByText } = renderSelect({ label: 'Test Label' });
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('renders with error message', () => {
    const { getByText } = renderSelect({ error: 'Test Error' });
    expect(getByText('Test Error')).toBeTruthy();
  });

  it('shows selected value', () => {
    const { getByText } = renderSelect({ value: '1' });
    expect(getByText('Opção 1')).toBeTruthy();
  });

  it('opens modal on press', () => {
    const { getByText } = renderSelect();
    fireEvent.press(getByText('Selecione uma opção'));
    expect(getByText('Selecione uma opção')).toBeTruthy(); // Modal title
  });

  it('calls onChange when selecting an option', () => {
    const onChange = jest.fn();
    const { getByText } = renderSelect({ onChange });
    
    // Open modal
    fireEvent.press(getByText('Selecione uma opção'));
    
    // Select option
    fireEvent.press(getByText('Opção 1'));
    
    expect(onChange).toHaveBeenCalledWith('1');
  });

  it('applies custom styles', () => {
    const containerStyle = { marginTop: 10 };
    const labelStyle = { fontSize: 20 };
    const selectStyle = { height: 60 };
    const errorStyle = { fontSize: 16 };

    const { getByText } = renderSelect({
      label: 'Test Label',
      error: 'Test Error',
      containerStyle,
      labelStyle,
      selectStyle,
      errorStyle,
    });

    const label = getByText('Test Label');
    const select = getByText('Selecione uma opção');
    const error = getByText('Test Error');

    expect(label.props.style).toContainEqual(labelStyle);
    expect(select.parent?.props.style).toContainEqual(selectStyle);
    expect(error.props.style).toContainEqual(errorStyle);
  });

  it('applies correct theme colors', () => {
    const { getByText } = renderSelect({
      label: 'Test Label',
      error: 'Test Error',
    });

    const label = getByText('Test Label');
    const select = getByText('Selecione uma opção');
    const error = getByText('Test Error');

    expect(label.props.style).toContainEqual({
      color: '#000000',
    });

    expect(select.parent?.props.style).toContainEqual({
      backgroundColor: '#FFFFFF',
      borderColor: '#FF3B30',
    });

    expect(error.props.style).toContainEqual({
      color: '#FF3B30',
    });
  });
}); 