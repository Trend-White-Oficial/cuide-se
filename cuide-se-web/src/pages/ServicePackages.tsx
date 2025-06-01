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
  IconButton,
  Chip,
  Autocomplete,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { supabase, formatCurrency } from '../services/supabase';

interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  services: {
    id: string;
    name: string;
    price: number;
  }[];
  active: boolean;
  created_at: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export const ServicePackages: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 0,
    services: [] as Service[],
    active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar pacotes
      const { data: packagesData, error: packagesError } = await supabase
        .from('service_packages')
        .select(`
          *,
          services:package_services(
            service:service_id(
              id,
              name,
              price
            )
          )
        `);

      if (packagesError) throw packagesError;

      // Buscar serviços
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*');

      if (servicesError) throw servicesError;

      // Processar dados dos pacotes
      const processedPackages = packagesData?.map((pkg) => ({
        ...pkg,
        services: pkg.services.map((s: any) => s.service),
      })) || [];

      setPackages(processedPackages);
      setServices(servicesData || []);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (pkg?: ServicePackage) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        name: pkg.name,
        description: pkg.description,
        price: pkg.price,
        duration: pkg.duration,
        services: pkg.services,
        active: pkg.active,
      });
    } else {
      setEditingPackage(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        duration: 0,
        services: [],
        active: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPackage(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      duration: 0,
      services: [],
      active: true,
    });
  };

  const handleSavePackage = async () => {
    try {
      if (!formData.name || formData.services.length === 0) {
        throw new Error('Preencha todos os campos obrigatórios');
      }

      const packageData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        duration: formData.duration,
        active: formData.active,
      };

      let packageId = editingPackage?.id;

      if (editingPackage) {
        const { error } = await supabase
          .from('service_packages')
          .update(packageData)
          .eq('id', editingPackage.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('service_packages')
          .insert([packageData])
          .select();
        if (error) throw error;
        packageId = data[0].id;
      }

      // Salvar serviços do pacote
      if (packageId) {
        // Remover serviços antigos
        if (editingPackage) {
          const { error } = await supabase
            .from('package_services')
            .delete()
            .eq('package_id', packageId);
          if (error) throw error;
        }

        // Inserir novos serviços
        const servicesToInsert = formData.services.map((service) => ({
          package_id: packageId,
          service_id: service.id,
        }));

        const { error: servicesError } = await supabase
          .from('package_services')
          .insert(servicesToInsert);
        if (servicesError) throw servicesError;
      }

      handleCloseDialog();
      fetchData();
    } catch (err) {
      console.error('Erro ao salvar pacote:', err);
      setError('Erro ao salvar pacote');
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este pacote?')) return;

    try {
      const { error } = await supabase
        .from('service_packages')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Erro ao excluir pacote:', err);
      setError('Erro ao excluir pacote');
    }
  };

  const calculateTotalPrice = () => {
    return formData.services.reduce((sum, service) => sum + service.price, 0);
  };

  const calculateTotalDuration = () => {
    return formData.services.reduce((sum, service) => sum + service.duration, 0);
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
          Pacotes de Serviços
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Pacote
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
                  <TableCell>Descrição</TableCell>
                  <TableCell>Preço</TableCell>
                  <TableCell>Duração</TableCell>
                  <TableCell>Serviços</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell>{pkg.name}</TableCell>
                    <TableCell>{pkg.description}</TableCell>
                    <TableCell>{formatCurrency(pkg.price)}</TableCell>
                    <TableCell>{pkg.duration} min</TableCell>
                    <TableCell>
                      {pkg.services.map((service) => (
                        <Chip
                          key={service.id}
                          label={service.name}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={pkg.active ? 'Ativo' : 'Inativo'}
                        color={pkg.active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(pkg)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeletePackage(pkg.id)}
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

      {/* Diálogo de Pacote */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPackage ? 'Editar Pacote' : 'Novo Pacote'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Nome"
                  fullWidth
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Preço"
                  type="number"
                  fullWidth
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
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
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={services}
                  getOptionLabel={(option) => option.name}
                  value={formData.services}
                  onChange={(_, newValue) =>
                    setFormData({ ...formData, services: newValue })
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Serviços" required />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option.name}
                        {...getTagProps({ index })}
                        size="small"
                      />
                    ))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.active}
                      onChange={(e) =>
                        setFormData({ ...formData, active: e.target.checked })
                      }
                    />
                  }
                  label="Pacote Ativo"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Resumo do Pacote
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography>
                    Preço Total dos Serviços:{' '}
                    {formatCurrency(calculateTotalPrice())}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography>
                    Duração Total: {calculateTotalDuration()} minutos
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSavePackage}
            disabled={!formData.name || formData.services.length === 0}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 