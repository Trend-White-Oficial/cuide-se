import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Text, Button, IconButton, Dialog, Portal, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../services/supabaseService';

interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit';
  last4: string;
  brand: string;
  isDefault: boolean;
}

export default function PaymentMethodsScreen() {
  const navigation = useNavigation();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvc: '',
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('isDefault', { ascending: false });

      if (error) throw error;
      setPaymentMethods(data || []);
    } catch (error) {
      console.error('Erro ao buscar formas de pagamento:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async () => {
    try {
      // Aqui você implementaria a integração com um gateway de pagamento
      // como Stripe ou PagarMe para processar o cartão
      
      const { error } = await supabase
        .from('payment_methods')
        .insert({
          type: 'credit',
          last4: newCard.number.slice(-4),
          brand: 'visa', // Isso viria da API do gateway de pagamento
          isDefault: paymentMethods.length === 0,
        });

      if (error) throw error;
      
      setDialogVisible(false);
      setNewCard({ number: '', expiry: '', cvc: '' });
      fetchPaymentMethods();
    } catch (error) {
      console.error('Erro ao adicionar cartão:', error);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .update({ isDefault: false })
        .eq('isDefault', true);

      if (error) throw error;

      const { error: updateError } = await supabase
        .from('payment_methods')
        .update({ isDefault: true })
        .eq('id', id);

      if (updateError) throw updateError;
      
      fetchPaymentMethods();
    } catch (error) {
      console.error('Erro ao definir cartão padrão:', error);
    }
  };

  const handleRemoveCard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPaymentMethods();
    } catch (error) {
      console.error('Erro ao remover cartão:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={paymentMethods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <View>
                  <Title>
                    {item.brand.charAt(0).toUpperCase() + item.brand.slice(1)} •••• {item.last4}
                  </Title>
                  <Text>
                    {item.type === 'credit' ? 'Cartão de Crédito' : 'Cartão de Débito'}
                  </Text>
                </View>
                {item.isDefault && (
                  <Chip mode="outlined">Padrão</Chip>
                )}
              </View>

              <View style={styles.cardActions}>
                {!item.isDefault && (
                  <Button
                    mode="text"
                    onPress={() => handleSetDefault(item.id)}
                  >
                    Definir como Padrão
                  </Button>
                )}
                <IconButton
                  icon="delete"
                  onPress={() => handleRemoveCard(item.id)}
                />
              </View>
            </Card.Content>
          </Card>
        )}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          <Button
            mode="contained"
            onPress={() => setDialogVisible(true)}
            style={styles.addButton}
          >
            Adicionar Novo Cartão
          </Button>
        }
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Adicionar Cartão</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Número do Cartão"
              value={newCard.number}
              onChangeText={(text) => setNewCard({ ...newCard, number: text })}
              keyboardType="numeric"
              maxLength={16}
              style={styles.input}
            />
            <View style={styles.row}>
              <TextInput
                label="Validade"
                value={newCard.expiry}
                onChangeText={(text) => setNewCard({ ...newCard, expiry: text })}
                placeholder="MM/AA"
                maxLength={5}
                style={[styles.input, styles.halfInput]}
              />
              <TextInput
                label="CVC"
                value={newCard.cvc}
                onChangeText={(text) => setNewCard({ ...newCard, cvc: text })}
                keyboardType="numeric"
                maxLength={3}
                style={[styles.input, styles.halfInput]}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancelar</Button>
            <Button onPress={handleAddCard}>Adicionar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  addButton: {
    marginTop: 16,
  },
  input: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
}); 