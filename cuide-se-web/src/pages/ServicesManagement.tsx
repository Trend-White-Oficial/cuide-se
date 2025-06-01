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
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { supabase, formatCurrency } from '../services/supabase';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  active: boolean;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

export const ServicesManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 30,
    category: '',
    active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar serviços
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (servicesError) throw servicesError;

      // Buscar categorias
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('service_categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      setServices(servicesData || []);
      setCategories(categoriesData || []);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        category: service.category,
        active: service.active,
      });
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        duration: 30,
        category: '',
        active: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      duration: 30,
      category: '',
      active: true,
    });
  };

  const handleSaveService = async () => {
    try {
      if (!formData.name || !formData.category || formData.price <= 0) {
        throw new Error('Preencha todos os campos obrigatórios');
      }

      const serviceData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        duration: formData.duration,
        category: formData.category,
        active: formData.active,
      };

      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('services')
          .insert([serviceData]);
        if (error) throw error;
      }

      handleCloseDialog();
      fetchData();
    } catch (err) {
      console.error('Erro ao salvar serviço:', err);
      setError('Erro ao salvar serviço');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este serviço?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Erro ao excluir serviço:', err);
      setError('Erro ao excluir serviço');
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
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
          Serviços
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Serviço
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Preço</TableCell>
                  <TableCell>Duração</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body1">{service.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {service.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {categories.find((c) => c.id === service.category)?.name}
                    </TableCell>
                    <TableCell>{formatCurrency(service.price)}</TableCell>
                    <TableCell>{formatDuration(service.duration)}</TableCell>
                    <TableCell>
                      <Chip
                        label={service.active ? 'Ativo' : 'Inativo'}
                        color={service.active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(service)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteService(service.id)}
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

      {/* Diálogo de Serviço */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingService ? 'Editar Serviço' : 'Novo Serviço'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Nome"
              fullWidth
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <TextField
              label="Descrição"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Preço"
                  type="number"
                  fullWidth
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  required
                  InputProps={{
                    startAdornment: 'R$',
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Duração (minutos)"
                  type="number"
                  fullWidth
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: Number(e.target.value) })
                  }
                  required
                  inputProps={{ min: 15, step: 15 }}
                />
              </Grid>
            </Grid>
            <FormControl fullWidth>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={formData.category}
                label="Categoria"
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                />
              }
              label="Serviço Ativo"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSaveService}
            disabled={!formData.name || !formData.category || formData.price <= 0}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 