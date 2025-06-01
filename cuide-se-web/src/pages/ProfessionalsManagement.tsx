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
  Autocomplete,
  FormControlLabel,
  Switch,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { supabase } from '../services/supabase';

interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  working_hours: {
    day: number;
    start: string;
    end: string;
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

const DAYS_OF_WEEK = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
];

export const ProfessionalsManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialties: [] as string[],
    working_hours: [] as { day: number; start: string; end: string }[],
    active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar profissionais
      const { data: professionalsData, error: professionalsError } = await supabase
        .from('professionals')
        .select('*')
        .order('name');

      if (professionalsError) throw professionalsError;

      // Buscar serviços
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (servicesError) throw servicesError;

      setProfessionals(professionalsData || []);
      setServices(servicesData || []);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (professional?: Professional) => {
    if (professional) {
      setEditingProfessional(professional);
      setFormData({
        name: professional.name,
        email: professional.email,
        phone: professional.phone,
        specialties: professional.specialties,
        working_hours: professional.working_hours,
        active: professional.active,
      });
    } else {
      setEditingProfessional(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        specialties: [],
        working_hours: [],
        active: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProfessional(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialties: [],
      working_hours: [],
      active: true,
    });
  };

  const handleAddWorkingHours = () => {
    setFormData({
      ...formData,
      working_hours: [
        ...formData.working_hours,
        { day: 1, start: '09:00', end: '18:00' },
      ],
    });
  };

  const handleRemoveWorkingHours = (index: number) => {
    const newWorkingHours = [...formData.working_hours];
    newWorkingHours.splice(index, 1);
    setFormData({
      ...formData,
      working_hours: newWorkingHours,
    });
  };

  const handleUpdateWorkingHours = (
    index: number,
    field: 'day' | 'start' | 'end',
    value: string | number
  ) => {
    const newWorkingHours = [...formData.working_hours];
    newWorkingHours[index] = {
      ...newWorkingHours[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      working_hours: newWorkingHours,
    });
  };

  const handleSaveProfessional = async () => {
    try {
      if (!formData.name || !formData.email || !formData.phone) {
        throw new Error('Preencha todos os campos obrigatórios');
      }

      const professionalData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialties: formData.specialties,
        working_hours: formData.working_hours,
        active: formData.active,
      };

      if (editingProfessional) {
        const { error } = await supabase
          .from('professionals')
          .update(professionalData)
          .eq('id', editingProfessional.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('professionals')
          .insert([professionalData]);
        if (error) throw error;
      }

      handleCloseDialog();
      fetchData();
    } catch (err) {
      console.error('Erro ao salvar profissional:', err);
      setError('Erro ao salvar profissional');
    }
  };

  const handleDeleteProfessional = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este profissional?')) return;

    try {
      const { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Erro ao excluir profissional:', err);
      setError('Erro ao excluir profissional');
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
          Profissionais
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Profissional
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
                  <TableCell>Profissional</TableCell>
                  <TableCell>Especialidades</TableCell>
                  <TableCell>Horário de Trabalho</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {professionals.map((professional) => (
                  <TableRow key={professional.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2 }}>
                          {professional.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1">
                            {professional.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {professional.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {professional.specialties.map((specialty) => (
                        <Chip
                          key={specialty}
                          label={specialty}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </TableCell>
                    <TableCell>
                      {professional.working_hours.map((hours, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <AccessTimeIcon sx={{ mr: 0.5, fontSize: 16 }} />
                          <Typography variant="caption">
                            {DAYS_OF_WEEK[hours.day]}: {hours.start} - {hours.end}
                          </Typography>
                        </Box>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={professional.active ? 'Ativo' : 'Inativo'}
                        color={professional.active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(professional)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteProfessional(professional.id)}
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

      {/* Diálogo de Profissional */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProfessional ? 'Editar Profissional' : 'Novo Profissional'}
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
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={services.map((service) => service.name)}
                  value={formData.specialties}
                  onChange={(_, newValue) =>
                    setFormData({ ...formData, specialties: newValue })
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Especialidades" />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                        size="small"
                      />
                    ))
                  }
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Horário de Trabalho
              </Typography>
              {formData.working_hours.map((hours, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Dia da Semana</InputLabel>
                    <Select
                      value={hours.day}
                      label="Dia da Semana"
                      onChange={(e) =>
                        handleUpdateWorkingHours(
                          index,
                          'day',
                          Number(e.target.value)
                        )
                      }
                    >
                      {DAYS_OF_WEEK.map((day, dayIndex) => (
                        <MenuItem key={dayIndex} value={dayIndex}>
                          {day}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Início"
                    type="time"
                    value={hours.start}
                    onChange={(e) =>
                      handleUpdateWorkingHours(index, 'start', e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Fim"
                    type="time"
                    value={hours.end}
                    onChange={(e) =>
                      handleUpdateWorkingHours(index, 'end', e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveWorkingHours(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddWorkingHours}
                sx={{ mt: 1 }}
              >
                Adicionar Horário
              </Button>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                />
              }
              label="Profissional Ativo"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSaveProfessional}
            disabled={!formData.name || !formData.email || !formData.phone}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 