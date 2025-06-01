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
  Autocomplete,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { supabase, formatCurrency } from '../services/supabase';

interface Order {
  id: string;
  client_id: string;
  professional_id: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  total: number;
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'partial';
  created_at: string;
  client: {
    name: string;
    phone: string;
  };
  professional: {
    name: string;
  };
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  order_id: string;
  type: 'service' | 'product';
  item_id: string;
  quantity: number;
  price: number;
  total: number;
  service?: {
    name: string;
  };
  product?: {
    name: string;
  };
}

interface Client {
  id: string;
  name: string;
  phone: string;
}

interface Professional {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export const OrdersManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [filters, setFilters] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
    status: 'all',
    paymentStatus: 'all',
  });

  // Estado do formulário
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [orderDate, setOrderDate] = useState<Date | null>(new Date());
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedItemType, setSelectedItemType] = useState<'service' | 'product'>('service');
  const [selectedItem, setSelectedItem] = useState<Service | Product | null>(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'partial'>('pending');

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar comandas
      let query = supabase
        .from('orders')
        .select(`
          *,
          client:client_id(name, phone),
          professional:professional_id(name),
          items:order_items(
            *,
            service:service_id(name),
            product:product_id(name)
          )
        `);

      if (filters.startDate) {
        query = query.gte('date', filters.startDate.toISOString());
      }
      if (filters.endDate) {
        query = query.lte('date', filters.endDate.toISOString());
      }
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters.paymentStatus !== 'all') {
        query = query.eq('payment_status', filters.paymentStatus);
      }

      const { data: ordersData, error: ordersError } = await query.order('date', {
        ascending: false,
      });
      if (ordersError) throw ordersError;

      // Buscar clientes
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*');
      if (clientsError) throw clientsError;

      // Buscar profissionais
      const { data: professionalsData, error: professionalsError } = await supabase
        .from('professionals')
        .select('*');
      if (professionalsError) throw professionalsError;

      // Buscar serviços
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*');
      if (servicesError) throw servicesError;

      // Buscar produtos
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*');
      if (productsError) throw productsError;

      setOrders(ordersData || []);
      setClients(clientsData || []);
      setProfessionals(professionalsData || []);
      setServices(servicesData || []);
      setProducts(productsData || []);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (order?: Order) => {
    if (order) {
      setEditingOrder(order);
      setSelectedClient(clients.find((c) => c.id === order.client_id) || null);
      setSelectedProfessional(
        professionals.find((p) => p.id === order.professional_id) || null
      );
      setOrderDate(new Date(order.date));
      setOrderItems(order.items);
      setPaymentMethod(order.payment_method);
      setPaymentStatus(order.payment_status);
    } else {
      setEditingOrder(null);
      setSelectedClient(null);
      setSelectedProfessional(null);
      setOrderDate(new Date());
      setOrderItems([]);
      setPaymentMethod('');
      setPaymentStatus('pending');
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingOrder(null);
    setSelectedClient(null);
    setSelectedProfessional(null);
    setOrderDate(new Date());
    setOrderItems([]);
    setPaymentMethod('');
    setPaymentStatus('pending');
  };

  const handleAddItem = () => {
    if (!selectedItem) return;

    const newItem: OrderItem = {
      id: Math.random().toString(),
      order_id: editingOrder?.id || '',
      type: selectedItemType,
      item_id: selectedItem.id,
      quantity: itemQuantity,
      price: selectedItem.price,
      total: selectedItem.price * itemQuantity,
      [selectedItemType]: selectedItem,
    };

    setOrderItems([...orderItems, newItem]);
    setSelectedItem(null);
    setItemQuantity(1);
  };

  const handleRemoveItem = (itemId: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== itemId));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSaveOrder = async () => {
    try {
      if (!selectedClient || !selectedProfessional || !orderDate) {
        throw new Error('Preencha todos os campos obrigatórios');
      }

      const orderData = {
        client_id: selectedClient.id,
        professional_id: selectedProfessional.id,
        date: orderDate.toISOString(),
        status: 'pending',
        total: calculateTotal(),
        payment_method: paymentMethod,
        payment_status: paymentStatus,
      };

      let orderId = editingOrder?.id;

      if (editingOrder) {
        const { error } = await supabase
          .from('orders')
          .update(orderData)
          .eq('id', editingOrder.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('orders')
          .insert([orderData])
          .select();
        if (error) throw error;
        orderId = data[0].id;
      }

      // Salvar itens
      if (orderId) {
        // Remover itens antigos
        if (editingOrder) {
          const { error } = await supabase
            .from('order_items')
            .delete()
            .eq('order_id', orderId);
          if (error) throw error;
        }

        // Inserir novos itens
        const itemsToInsert = orderItems.map((item) => ({
          order_id: orderId,
          type: item.type,
          item_id: item.item_id,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(itemsToInsert);
        if (itemsError) throw itemsError;

        // Atualizar estoque dos produtos
        for (const item of orderItems) {
          if (item.type === 'product') {
            const { error: stockError } = await supabase.rpc('update_product_stock', {
              product_id: item.item_id,
              quantity: -item.quantity,
            });
            if (stockError) throw stockError;
          }
        }
      }

      handleCloseDialog();
      fetchData();
    } catch (err) {
      console.error('Erro ao salvar comanda:', err);
      setError('Erro ao salvar comanda');
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta comanda?')) return;

    try {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Erro ao excluir comanda:', err);
      setError('Erro ao excluir comanda');
    }
  };

  const handlePrintOrder = (order: Order) => {
    // Implementar impressão da comanda
    console.log('Imprimir comanda:', order);
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
          Gestão de Comandas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nova Comanda
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

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
            <Grid item xs={12} md={3}>
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
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status do Pagamento</InputLabel>
                <Select
                  value={filters.paymentStatus}
                  label="Status do Pagamento"
                  onChange={(e) =>
                    setFilters({ ...filters, paymentStatus: e.target.value })
                  }
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="pending">Pendente</MenuItem>
                  <MenuItem value="completed">Pago</MenuItem>
                  <MenuItem value="partial">Parcial</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Profissional</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Pagamento</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {new Date(order.date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>{order.client.name}</TableCell>
                    <TableCell>{order.professional.name}</TableCell>
                    <TableCell>{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          order.status === 'completed'
                            ? 'Concluído'
                            : order.status === 'pending'
                            ? 'Pendente'
                            : 'Cancelado'
                        }
                        color={
                          order.status === 'completed'
                            ? 'success'
                            : order.status === 'pending'
                            ? 'warning'
                            : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          order.payment_status === 'completed'
                            ? 'Pago'
                            : order.payment_status === 'partial'
                            ? 'Parcial'
                            : 'Pendente'
                        }
                        color={
                          order.payment_status === 'completed'
                            ? 'success'
                            : order.payment_status === 'partial'
                            ? 'warning'
                            : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handlePrintOrder(order)}
                      >
                        <PrintIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(order)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteOrder(order.id)}
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

      {/* Diálogo de Comanda */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingOrder ? 'Editar Comanda' : 'Nova Comanda'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={clients}
                  getOptionLabel={(option) => option.name}
                  value={selectedClient}
                  onChange={(_, newValue) => setSelectedClient(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Cliente" required />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={professionals}
                  getOptionLabel={(option) => option.name}
                  value={selectedProfessional}
                  onChange={(_, newValue) => setSelectedProfessional(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Profissional" required />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Data"
                  value={orderDate}
                  onChange={(date) => setOrderDate(date)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Método de Pagamento</InputLabel>
                  <Select
                    value={paymentMethod}
                    label="Método de Pagamento"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <MenuItem value="cash">Dinheiro</MenuItem>
                    <MenuItem value="credit_card">Cartão de Crédito</MenuItem>
                    <MenuItem value="debit_card">Cartão de Débito</MenuItem>
                    <MenuItem value="pix">PIX</MenuItem>
                    <MenuItem value="transfer">Transferência</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Itens da Comanda
            </Typography>

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={selectedItemType}
                    label="Tipo"
                    onChange={(e) =>
                      setSelectedItemType(e.target.value as 'service' | 'product')
                    }
                  >
                    <MenuItem value="service">Serviço</MenuItem>
                    <MenuItem value="product">Produto</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={5}>
                <Autocomplete
                  options={
                    selectedItemType === 'service'
                      ? services
                      : products.filter((p) => p.stock > 0)
                  }
                  getOptionLabel={(option) => option.name}
                  value={selectedItem}
                  onChange={(_, newValue) => setSelectedItem(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Item" required />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  label="Quantidade"
                  type="number"
                  fullWidth
                  value={itemQuantity}
                  onChange={(e) => setItemQuantity(parseInt(e.target.value))}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleAddItem}
                  disabled={!selectedItem}
                >
                  Adicionar
                </Button>
              </Grid>
            </Grid>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>Quantidade</TableCell>
                    <TableCell>Preço</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.type === 'service' ? 'Serviço' : 'Produto'}
                      </TableCell>
                      <TableCell>
                        {item.type === 'service'
                          ? item.service?.name
                          : item.product?.name}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatCurrency(item.price)}</TableCell>
                      <TableCell>{formatCurrency(item.total)}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Typography variant="h6">
                Total: {formatCurrency(calculateTotal())}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSaveOrder}
            disabled={!selectedClient || !selectedProfessional || orderItems.length === 0}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 