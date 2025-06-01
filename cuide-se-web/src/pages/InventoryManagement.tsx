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
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  AddCircle as AddCircleIcon,
  RemoveCircle as RemoveCircleIcon,
} from '@mui/icons-material';
import { supabase, formatCurrency } from '../services/supabase';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  min_stock: number;
  unit: string;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface StockMovement {
  id: string;
  product_id: string;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  date: string;
  created_at: string;
  product: Product;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`inventory-tabpanel-${index}`}
      aria-labelledby={`inventory-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const InventoryManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openMovementDialog, setOpenMovementDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState({
    category: 'all',
    lowStock: false,
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar produtos
      let query = supabase.from('products').select('*');
      if (filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters.lowStock) {
        query = query.lte('stock', 'min_stock');
      }
      const { data: productsData, error: productsError } = await query;
      if (productsError) throw productsError;

      // Buscar categorias
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');
      if (categoriesError) throw categoriesError;

      // Buscar movimentações
      const { data: movementsData, error: movementsError } = await supabase
        .from('stock_movements')
        .select(`
          *,
          product:product_id(*)
        `)
        .order('date', { ascending: false });
      if (movementsError) throw movementsError;

      setProducts(productsData || []);
      setCategories(categoriesData || []);
      setMovements(movementsData || []);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProductDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
    } else {
      setEditingProduct(null);
    }
    setOpenProductDialog(true);
  };

  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (product: Partial<Product>) => {
    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(product)
          .eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([product]);
        if (error) throw error;
      }
      handleCloseProductDialog();
      fetchData();
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
      setError('Erro ao salvar produto');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Erro ao excluir produto:', err);
      setError('Erro ao excluir produto');
    }
  };

  const handleOpenMovementDialog = (product: Product) => {
    setSelectedProduct(product);
    setOpenMovementDialog(true);
  };

  const handleCloseMovementDialog = () => {
    setOpenMovementDialog(false);
    setSelectedProduct(null);
  };

  const handleSaveMovement = async (movement: Partial<StockMovement>) => {
    try {
      const { error } = await supabase.from('stock_movements').insert([movement]);
      if (error) throw error;

      // Atualizar estoque do produto
      const quantity = movement.type === 'in' ? movement.quantity : -movement.quantity;
      const { error: updateError } = await supabase.rpc('update_product_stock', {
        product_id: movement.product_id,
        quantity: quantity,
      });
      if (updateError) throw updateError;

      handleCloseMovementDialog();
      fetchData();
    } catch (err) {
      console.error('Erro ao salvar movimentação:', err);
      setError('Erro ao salvar movimentação');
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
          Gestão de Estoque
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenProductDialog()}
        >
          Novo Produto
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
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={filters.category}
                  label="Categoria"
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <MenuItem value="all">Todas</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <FormControlLabel
                  control={
                    <Switch
                      checked={filters.lowStock}
                      onChange={(e) =>
                        setFilters({ ...filters, lowStock: e.target.checked })
                      }
                    />
                  }
                  label="Mostrar apenas produtos com estoque baixo"
                />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Produtos" />
            <Tab label="Movimentações" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Preço</TableCell>
                  <TableCell>Estoque</TableCell>
                  <TableCell>Mínimo</TableCell>
                  <TableCell>Unidade</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      {categories.find((c) => c.id === product.category)?.name}
                    </TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      <Chip
                        label={product.stock}
                        color={product.stock <= product.min_stock ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{product.min_stock}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenMovementDialog(product)}
                      >
                        <AddCircleIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenProductDialog(product)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Produto</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Quantidade</TableCell>
                  <TableCell>Motivo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>
                      {new Date(movement.date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>{movement.product.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={movement.type === 'in' ? 'Entrada' : 'Saída'}
                        color={movement.type === 'in' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{movement.quantity}</TableCell>
                    <TableCell>{movement.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Card>

      {/* Diálogo de Produto */}
      <Dialog
        open={openProductDialog}
        onClose={handleCloseProductDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingProduct ? 'Editar Produto' : 'Novo Produto'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Nome"
              fullWidth
              value={editingProduct?.name || ''}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct!,
                  name: e.target.value,
                })
              }
            />

            <TextField
              label="Descrição"
              fullWidth
              multiline
              rows={2}
              value={editingProduct?.description || ''}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct!,
                  description: e.target.value,
                })
              }
            />

            <FormControl fullWidth>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={editingProduct?.category || ''}
                label="Categoria"
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct!,
                    category: e.target.value,
                  })
                }
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Preço"
              fullWidth
              type="number"
              value={editingProduct?.price || ''}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct!,
                  price: parseFloat(e.target.value),
                })
              }
            />

            <TextField
              label="Custo"
              fullWidth
              type="number"
              value={editingProduct?.cost || ''}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct!,
                  cost: parseFloat(e.target.value),
                })
              }
            />

            <TextField
              label="Estoque Mínimo"
              fullWidth
              type="number"
              value={editingProduct?.min_stock || ''}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct!,
                  min_stock: parseInt(e.target.value),
                })
              }
            />

            <TextField
              label="Unidade"
              fullWidth
              value={editingProduct?.unit || ''}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct!,
                  unit: e.target.value,
                })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProductDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={() => handleSaveProduct(editingProduct!)}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Movimentação */}
      <Dialog
        open={openMovementDialog}
        onClose={handleCloseMovementDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Nova Movimentação</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <Typography variant="subtitle1">
              Produto: {selectedProduct?.name}
            </Typography>
            <Typography variant="subtitle2">
              Estoque Atual: {selectedProduct?.stock} {selectedProduct?.unit}
            </Typography>

            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={movementType}
                label="Tipo"
                onChange={(e) => setMovementType(e.target.value as 'in' | 'out')}
              >
                <MenuItem value="in">Entrada</MenuItem>
                <MenuItem value="out">Saída</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Quantidade"
              fullWidth
              type="number"
              value={movementQuantity}
              onChange={(e) => setMovementQuantity(parseInt(e.target.value))}
            />

            <TextField
              label="Motivo"
              fullWidth
              multiline
              rows={2}
              value={movementReason}
              onChange={(e) => setMovementReason(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMovementDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={() =>
              handleSaveMovement({
                product_id: selectedProduct?.id,
                type: movementType,
                quantity: movementQuantity,
                reason: movementReason,
                date: new Date().toISOString(),
              })
            }
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 