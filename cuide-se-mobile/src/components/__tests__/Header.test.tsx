import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Header } from '../Header';

// Mock do useNavigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
}));

describe('Header Component', () => {
  const defaultProps = {
    title: 'Título do Header',
  };

  it('deve renderizar corretamente com as props básicas', () => {
    const { getByText } = render(<Header {...defaultProps} />);
    expect(getByText('Título do Header')).toBeTruthy();
  });

  it('deve exibir o botão de voltar por padrão', () => {
    const { getByTestId } = render(<Header {...defaultProps} />);
    expect(getByTestId('back-button')).toBeTruthy();
  });

  it('não deve exibir o botão de voltar quando showBackButton é false', () => {
    const { queryByTestId } = render(
      <Header {...defaultProps} showBackButton={false} />
    );
    expect(queryByTestId('back-button')).toBeNull();
  });

  it('deve chamar onBackPress quando o botão de voltar é pressionado', () => {
    const onBackPress = jest.fn();
    const { getByTestId } = render(
      <Header {...defaultProps} onBackPress={onBackPress} />
    );
    
    fireEvent.press(getByTestId('back-button'));
    expect(onBackPress).toHaveBeenCalled();
  });

  it('deve chamar navigation.goBack quando onBackPress não é fornecido', () => {
    const { getByTestId } = render(<Header {...defaultProps} />);
    const navigation = require('@react-navigation/native').useNavigation();
    
    fireEvent.press(getByTestId('back-button'));
    expect(navigation.goBack).toHaveBeenCalled();
  });

  it('deve renderizar o componente direito quando fornecido', () => {
    const rightComponent = <Text testID="right-component">Right</Text>;
    const { getByTestId } = render(
      <Header {...defaultProps} rightComponent={rightComponent} />
    );
    
    expect(getByTestId('right-component')).toBeTruthy();
  });

  it('deve aplicar as cores personalizadas corretamente', () => {
    const { getByTestId } = render(
      <Header
        {...defaultProps}
        backgroundColor="#000"
        textColor="#fff"
      />
    );
    
    const container = getByTestId('header-container');
    const title = getByTestId('header-title');
    
    expect(container.props.style.backgroundColor).toBe('#000');
    expect(title.props.style.color).toBe('#fff');
  });
}); 