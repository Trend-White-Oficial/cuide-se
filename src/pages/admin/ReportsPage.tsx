/**
 * Página de gerenciamento de relatórios do admin
 * Permite visualizar e gerar relatórios do sistema
 */
import React from 'react';
import { Card, Text, Button, useTheme } from 'react-native-paper';
import { ScrollView } from 'react-native';

/**
 * Componente principal da página de relatórios
 * @returns JSX.Element - Interface de gerenciamento de relatórios
 */
export default function ReportsPage() {
  const theme = useTheme();

  // TODO: Implementar lógica de carregamento e exibição de relatórios
  // TODO: Implementar funcionalidade de geração de relatórios

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Card style={{ margin: 16, elevation: 4 }}>
        <Card.Content>
          {/* Título da página */}
          <Text variant="titleLarge" style={{ marginBottom: 16 }}>
            Relatórios
          </Text>
          
          {/* Descrição da funcionalidade */}
          <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
            Visualize e gere relatórios do sistema
          </Text>
          
          {/* Botão para gerar relatório */}
          <Button 
            mode="contained" 
            onPress={() => {
              // TODO: Implementar lógica de geração de relatório
              console.log('Gerando relatório...');
            }}
            style={{ marginBottom: 16 }}
          >
            Gerar Relatório
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
