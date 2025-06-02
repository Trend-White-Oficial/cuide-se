import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, Searchbar, Chip, Menu, Divider } from 'react-native-paper';
import { transactionService, Transaction, TransactionFilters } from '../services/transactions';
import { formatCurrency } from '../utils/format';

export const TransactionHistoryScreen: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, [filters]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.getTransactions(filters);
      setTransactions(data);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadTransactions();
  };

  const handleExport = async (format: 'pdf' | 'csv' | 'excel') => {
    try {
      const url = await transactionService.exportTransactions(format, filters);
      // Implementar download do arquivo
      console.log('Arquivo exportado:', url);
    } catch (error) {
      console.error('Erro ao exportar:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'rejected':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Buscar transações"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="contained"
              onPress={() => setMenuVisible(true)}
              style={styles.filterButton}
            >
              Filtros
            </Button>
          }
        >
          <Menu.Item
            title="Aprovados"
            onPress={() => {
              setFilters({ ...filters, status: 'approved' });
              setMenuVisible(false);
            }}
          />
          <Menu.Item
            title="Pendentes"
            onPress={() => {
              setFilters({ ...filters, status: 'pending' });
              setMenuVisible(false);
            }}
          />
          <Menu.Item
            title="Rejeitados"
            onPress={() => {
              setFilters({ ...filters, status: 'rejected' });
              setMenuVisible(false);
            }}
          />
          <Divider />
          <Menu.Item
            title="Limpar Filtros"
            onPress={() => {
              setFilters({});
              setMenuVisible(false);
            }}
          />
        </Menu>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {transactions.map((transaction) => (
          <Card key={transaction.id} style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text style={styles.amount}>
                  {formatCurrency(transaction.amount, transaction.currency)}
                </Text>
                <Chip
                  mode="outlined"
                  style={[styles.status, { borderColor: getStatusColor(transaction.status) }]}
                  textStyle={{ color: getStatusColor(transaction.status) }}
                >
                  {transaction.status}
                </Chip>
              </View>
              <Text style={styles.description}>{transaction.description}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.date}>
                  {new Date(transaction.created_at).toLocaleDateString()}
                </Text>
                <Text style={styles.method}>{transaction.payment_method}</Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <View style={styles.exportButtons}>
        <Button
          mode="outlined"
          onPress={() => handleExport('pdf')}
          style={styles.exportButton}
        >
          Exportar PDF
        </Button>
        <Button
          mode="outlined"
          onPress={() => handleExport('csv')}
          style={styles.exportButton}
        >
          Exportar CSV
        </Button>
        <Button
          mode="outlined"
          onPress={() => handleExport('excel')}
          style={styles.exportButton}
        >
          Exportar Excel
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  searchBar: {
    marginBottom: 8,
  },
  filterButton: {
    marginTop: 8,
  },
  card: {
    margin: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    height: 24,
  },
  description: {
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  date: {
    color: '#757575',
  },
  method: {
    color: '#757575',
  },
  exportButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  exportButton: {
    flex: 1,
    marginHorizontal: 4,
  },
}); 