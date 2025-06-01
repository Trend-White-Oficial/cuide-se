import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Drawer } from '../Drawer';

// Mock do useNavigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe('Drawer Component', () => {
  const mockItems = [
    { label: 'Início', icon: 'home', route: 'Home' },
    { label: 'Perfil', icon: 'user', route: 'Profile' },
  ];

  const mockUser = {
    name: 'João Silva',
    email: 'joao@email.com',
    avatar: 'https://example.com/avatar.jpg',
  };

  it('deve renderizar corretamente com itens básicos', () => {
    const { getByText } = render(<Drawer items={mockItems} />);
    expect(getByText('Início')).toBeTruthy();
    expect(getByText('Perfil')).toBeTruthy();
  });

  it('deve exibir informações do usuário quando fornecido', () => {
    const { getByText } = render(<Drawer items={mockItems} user={mockUser} />);
    expect(getByText('João Silva')).toBeTruthy();
    expect(getByText('joao@email.com')).toBeTruthy();
  });

  it('deve exibir estado de convidado quando usuário não é fornecido', () => {
    const { getByText } = render(<Drawer items={mockItems} />);
    expect(getByText('Convidado')).toBeTruthy();
  });

  it('deve chamar onClose quando o botão de fechar é pressionado', () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <Drawer items={mockItems} onClose={onClose} />
    );
    
    fireEvent.press(getByText('Fechar'));
    expect(onClose).toHaveBeenCalled();
  });

  it('deve navegar para a rota correta quando um item é pressionado', () => {
    const { getByText } = render(<Drawer items={mockItems} />);
    const navigation = require('@react-navigation/native').useNavigation();
    
    fireEvent.press(getByText('Início'));
    expect(navigation.navigate).toHaveBeenCalledWith('Home');
  });

  it('deve chamar onPress personalizado quando fornecido', () => {
    const customOnPress = jest.fn();
    const itemsWithCustomPress = [
      { ...mockItems[0], onPress: customOnPress },
      mockItems[1],
    ];
    
    const { getByText } = render(<Drawer items={itemsWithCustomPress} />);
    fireEvent.press(getByText('Início'));
    
    expect(customOnPress).toHaveBeenCalled();
  });

  it('deve chamar onClose após navegação', () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <Drawer items={mockItems} onClose={onClose} />
    );
    
    fireEvent.press(getByText('Início'));
    expect(onClose).toHaveBeenCalled();
  });
}); 