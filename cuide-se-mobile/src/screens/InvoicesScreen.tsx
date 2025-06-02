import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, Card, Button, Chip, ActivityIndicator } from 'react-native-paper';
import { invoiceService, Invoice } from '../services/invoices';
import { formatCurrency } from '../utils/format';

export const InvoicesScreen: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Usuário não autenticado');

      const data = await invoiceService.getUserInvoices(session.user.id);
      setInvoices(data);
    } catch (error) {
      console.error('Erro ao carregar faturas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as faturas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadInvoices();
  };

  const handleDownload = async (invoice: Invoice) => {
    try {
      setDownloading(invoice.id);
      await invoiceService.downloadInvoice(invoice);
    } catch (error) {
      console.error('Erro ao baixar fatura:', error);
      Alert.alert('Erro', 'Não foi possível baixar a fatura');
    } finally {
      setDownloading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'cancelled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {invoices.map((invoice) => (
          <Card key={invoice.id} style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text style={styles.invoiceNumber}>
                  Fatura #{invoice.number}
                </Text>
                <Chip
                  mode="outlined"
                  style={[styles.status, { borderColor: getStatusColor(invoice.status) }]}
                  textStyle={{ color: getStatusColor(invoice.status) }}
                >
                  {getStatusText(invoice.status)}
                </Chip>
              </View>

              <View style={styles.amountContainer}>
                <Text style={styles.label}>Valor Total</Text>
                <Text style={styles.amount}>
                  {formatCurrency(invoice.amount)}
                </Text>
              </View>

              <View style={styles.datesContainer}>
                <View style={styles.dateItem}>
                  <Text style={styles.label}>Data de Emissão</Text>
                  <Text style={styles.date}>
                    {new Date(invoice.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.dateItem}>
                  <Text style={styles.label}>Vencimento</Text>
                  <Text style={styles.date}>
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <Button
                mode="contained"
                onPress={() => handleDownload(invoice)}
                loading={downloading === invoice.id}
                disabled={downloading === invoice.id || !invoice.file_url}
                style={styles.downloadButton}
              >
                Baixar Fatura
              </Button>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  invoiceNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    height: 24,
  },
  amountContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateItem: {
    flex: 1,
  },
  date: {
    fontSize: 14,
  },
  downloadButton: {
    marginTop: 8,
  },
}); 