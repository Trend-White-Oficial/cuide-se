/**
 * Página de gerenciamento de mensagens do admin
 * Permite visualizar e gerenciar mensagens do sistema
 */
import React from 'react';
import { Card, Text, Button, useTheme } from 'react-native-paper';
import { ScrollView } from 'react-native';

/**
 * Componente principal da página de mensagens
 * @returns JSX.Element - Interface de gerenciamento de mensagens
 */
export default function MessagesPage() {
  const theme = useTheme();

  // TODO: Implementar lógica de carregamento e exibição de mensagens
  // TODO: Implementar funcionalidade de criação de nova mensagem

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Card style={{ margin: 16, elevation: 4 }}>
        <Card.Content>
          {/* Título da página */}
          <Text variant="titleLarge" style={{ marginBottom: 16 }}>
            Mensagens
          </Text>
          
          {/* Descrição da funcionalidade */}
          <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
            Gerencie mensagens do sistema aqui
          </Text>
          
          {/* Botão para criar nova mensagem */}
          <Button 
            mode="contained" 
            onPress={() => {
              // TODO: Implementar navegação para tela de criação de mensagem
              console.log('Criar nova mensagem');
            }}
            style={{ marginBottom: 16 }}
          >
            Nova Mensagem
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
