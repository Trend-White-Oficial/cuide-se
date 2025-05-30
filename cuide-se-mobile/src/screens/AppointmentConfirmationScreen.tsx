import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Button, Divider } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCart } from '../contexts/CartContext';

export default function AppointmentConfirmationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { checkout } = useCart();
  const {
    professionalId,
    serviceId,
    date,
    time,
    notes,
    paymentMethod,
  } = route.params as {
    professionalId: string;
    serviceId: string;
    date: string;
    time: string;
    notes?: string;
    paymentMethod: string;
  };

  const handleFinish = async () => {
    try {
      await checkout();
      navigation.navigate('Main');
    } catch (error) {
      console.error('Erro ao finalizar agendamento:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Confirme seu Agendamento</Title>
          
          <View style={styles.section}>
            <Text variant="titleMedium">Data e Hora</Text>
            <Text>{new Date(date).toLocaleDateString()}</Text>
            <Text>{new Date(time).toLocaleTimeString()}</Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Text variant="titleMedium">Forma de Pagamento</Text>
            <Text>{paymentMethod}</Text>
          </View>

          {notes && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.section}>
                <Text variant="titleMedium">Observações</Text>
                <Text>{notes}</Text>
              </View>
            </>
          )}

          <Button
            mode="contained"
            onPress={handleFinish}
            style={styles.button}
          >
            Finalizar Agendamento
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
  },
  section: {
    marginVertical: 8,
  },
  divider: {
    marginVertical: 16,
  },
  button: {
    marginTop: 24,
  },
});