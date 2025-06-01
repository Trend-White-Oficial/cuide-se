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
  Avatar,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { supabase } from '../services/supabase';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  birth_date: string;
  address: string;
  notes: string;
  loyalty_points: number;
  active: boolean;
  created_at: string;
}

export const ClientsManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birth_date: null as Date | null,
    address: '',
    notes: '',
    loyalty_points: 0,
    active: true,
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('clients')
        .select('*')
        .order('name');

      if (fetchError) throw fetchError;

      setClients(data || []);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
      setError('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone,
        birth_date: client.birth_date ? new Date(client.birth_date) : null,
        address: client.address,
        notes: client.notes,
        loyalty_points: client.loyalty_points,
        active: client.active,
      });
    } else {
      setEditingClient(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        birth_date: null,
        address: '',
        notes: '',
        loyalty_points: 0,
        active: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingClient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      birth_date: null,
      address: '',
      notes: '',
      loyalty_points: 0,
      active: true,
    });
  };

  const handleSaveClient = async () => {
    try {
      if (!formData.name || !formData.email || !formData.phone) {
        throw new Error('Preencha todos os campos obrigatórios');
      }

      const clientData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        birth_date: formData.birth_date?.toISOString(),
        address: formData.address,
        notes: formData.notes,
        loyalty_points: formData.loyalty_points,
        active: formData.active,
      };

      if (editingClient) {
        const { error } = await supabase
          .from('clients')
          .update(clientData)
          .eq('id', editingClient.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('clients')
          .insert([clientData]);
        if (error) throw error;
      }

      handleCloseDialog();
      fetchClients();
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
      setError('Erro ao salvar cliente');
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchClients();
    } catch (err) {
      console.error('Erro ao excluir cliente:', err);
      setError('Erro ao excluir cliente');
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
          Clientes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Cliente
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
                  <TableCell>Cliente</TableCell>
                  <TableCell>Contato</TableCell>
                  <TableCell>Endereço</TableCell>
                  <TableCell>Pontos</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2 }}>
                          {client.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1">
                            {client.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {client.birth_date
                              ? new Date(client.birth_date).toLocaleDateString(
                                  'pt-BR'
                                )
                              : ''}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{client.email}</Typography>
                        <Typography variant="body2">{client.phone}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{client.address}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StarIcon sx={{ color: 'gold', mr: 0.5 }} />
                        {client.loyalty_points}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={client.active ? 'Ativo' : 'Inativo'}
                        color={client.active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(client)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClient(client.id)}
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

      {/* Diálogo de Cliente */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
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
              <Grid item xs={12} md={6}>
                <TextField
                  label="E-mail"
                  type="email"
                  fullWidth
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Telefone"
                  fullWidth
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Data de Nascimento"
                  value={formData.birth_date}
                  onChange={(date) =>
                    setFormData({ ...formData, birth_date: date })
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Pontos de Fidelidade"
                  type="number"
                  fullWidth
                  value={formData.loyalty_points}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      loyalty_points: Number(e.target.value),
                    })
                  }
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Endereço"
                  fullWidth
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Observações"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </Grid>
            </Grid>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                />
              }
              label="Cliente Ativo"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSaveClient}
            disabled={!formData.name || !formData.email || !formData.phone}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 