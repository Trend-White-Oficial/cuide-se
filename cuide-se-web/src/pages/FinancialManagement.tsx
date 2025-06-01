import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { supabase, formatCurrency, formatDate } from '../services/supabase';

interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  value: number;
  payment_method: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
}

interface FinancialSummary {
  total_income: number;
  total_expenses: number;
  balance: number;
  pending_income: number;
  pending_expenses: number;
}

export const FinancialManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
    type: 'all',
    category: 'all',
    status: 'all',
  });

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('transactions').select('*');

      if (filters.startDate) {
        query = query.gte('date', filters.startDate.toISOString());
      }
      if (filters.endDate) {
        query = query.lte('date', filters.endDate.toISOString());
      }
      if (filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }
      if (filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      const { data, error: fetchError } = await query.order('date', { ascending: false });

      if (fetchError) throw fetchError;

      setTransactions(data || []);
      calculateSummary(data || []);
    } catch (err) {
      console.error('Erro ao buscar transações:', err);
      setError('Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (data: Transaction[]) => {
    const summary: FinancialSummary = {
      total_income: 0,
      total_expenses: 0,
      balance: 0,
      pending_income: 0,
      pending_expenses: 0,
    };

    data.forEach((transaction) => {
      if (transaction.status === 'completed') {
        if (transaction.type === 'income') {
          summary.total_income += transaction.value;
        } else {
          summary.total_expenses += transaction.value;
        }
      } else if (transaction.status === 'pending') {
        if (transaction.type === 'income') {
          summary.pending_income += transaction.value;
        } else {
          summary.pending_expenses += transaction.value;
        }
      }
    });

    summary.balance = summary.total_income - summary.total_expenses;
    setSummary(summary);
  };

  const handleOpenDialog = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
    } else {
      setEditingTransaction(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTransaction(null);
  };

  const handleSaveTransaction = async (transaction: Partial<Transaction>) => {
    try {
      if (editingTransaction) {
        const { error } = await supabase
          .from('transactions')
          .update(transaction)
          .eq('id', editingTransaction.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('transactions').insert([transaction]);
        if (error) throw error;
      }
      handleCloseDialog();
      fetchTransactions();
    } catch (err) {
      console.error('Erro ao salvar transação:', err);
      setError('Erro ao salvar transação');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta transação?')) return;

    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
      fetchTransactions();
    } catch (err) {
      console.error('Erro ao excluir transação:', err);
      setError('Erro ao excluir transação');
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gestão Financeira
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nova Transação
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Resumo Financeiro */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Receitas
              </Typography>
              <Typography variant="h5" color="success.main">
                {formatCurrency(summary?.total_income || 0)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Pendente: {formatCurrency(summary?.pending_income || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Despesas
              </Typography>
              <Typography variant="h5" color="error.main">
                {formatCurrency(summary?.total_expenses || 0)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Pendente: {formatCurrency(summary?.pending_expenses || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Saldo
              </Typography>
              <Typography
                variant="h5"
                color={summary && summary.balance >= 0 ? 'success.main' : 'error.main'}
              >
                {formatCurrency(summary?.balance || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <DatePicker
                label="Data Inicial"
                value={filters.startDate}
                onChange={(date) => setFilters({ ...filters, startDate: date })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DatePicker
                label="Data Final"
                value={filters.endDate}
                onChange={(date) => setFilters({ ...filters, endDate: date })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={filters.type}
                  label="Tipo"
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="income">Receita</MenuItem>
                  <MenuItem value="expense">Despesa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="pending">Pendente</MenuItem>
                  <MenuItem value="completed">Concluído</MenuItem>
                  <MenuItem value="cancelled">Cancelado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => fetchTransactions()}
              >
                Filtrar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabela de Transações */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Método</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.type === 'income' ? 'Receita' : 'Despesa'}
                        color={transaction.type === 'income' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{formatCurrency(transaction.value)}</TableCell>
                    <TableCell>{transaction.payment_method}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          transaction.status === 'completed'
                            ? 'Concluído'
                            : transaction.status === 'pending'
                            ? 'Pendente'
                            : 'Cancelado'
                        }
                        color={
                          transaction.status === 'completed'
                            ? 'success'
                            : transaction.status === 'pending'
                            ? 'warning'
                            : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(transaction)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Diálogo de Transação */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={editingTransaction?.type || 'income'}
                label="Tipo"
                onChange={(e) =>
                  setEditingTransaction({
                    ...editingTransaction!,
                    type: e.target.value as 'income' | 'expense',
                  })
                }
              >
                <MenuItem value="income">Receita</MenuItem>
                <MenuItem value="expense">Despesa</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Categoria"
              fullWidth
              value={editingTransaction?.category || ''}
              onChange={(e) =>
                setEditingTransaction({
                  ...editingTransaction!,
                  category: e.target.value,
                })
              }
            />

            <TextField
              label="Descrição"
              fullWidth
              multiline
              rows={2}
              value={editingTransaction?.description || ''}
              onChange={(e) =>
                setEditingTransaction({
                  ...editingTransaction!,
                  description: e.target.value,
                })
              }
            />

            <TextField
              label="Valor"
              fullWidth
              type="number"
              value={editingTransaction?.value || ''}
              onChange={(e) =>
                setEditingTransaction({
                  ...editingTransaction!,
                  value: parseFloat(e.target.value),
                })
              }
            />

            <FormControl fullWidth>
              <InputLabel>Método de Pagamento</InputLabel>
              <Select
                value={editingTransaction?.payment_method || ''}
                label="Método de Pagamento"
                onChange={(e) =>
                  setEditingTransaction({
                    ...editingTransaction!,
                    payment_method: e.target.value,
                  })
                }
              >
                <MenuItem value="cash">Dinheiro</MenuItem>
                <MenuItem value="credit_card">Cartão de Crédito</MenuItem>
                <MenuItem value="debit_card">Cartão de Débito</MenuItem>
                <MenuItem value="pix">PIX</MenuItem>
                <MenuItem value="transfer">Transferência</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={editingTransaction?.status || 'pending'}
                label="Status"
                onChange={(e) =>
                  setEditingTransaction({
                    ...editingTransaction!,
                    status: e.target.value as 'pending' | 'completed' | 'cancelled',
                  })
                }
              >
                <MenuItem value="pending">Pendente</MenuItem>
                <MenuItem value="completed">Concluído</MenuItem>
                <MenuItem value="cancelled">Cancelado</MenuItem>
              </Select>
            </FormControl>

            <DatePicker
              label="Data"
              value={editingTransaction?.date ? new Date(editingTransaction.date) : null}
              onChange={(date) =>
                setEditingTransaction({
                  ...editingTransaction!,
                  date: date?.toISOString() || '',
                })
              }
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={() => handleSaveTransaction(editingTransaction!)}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 