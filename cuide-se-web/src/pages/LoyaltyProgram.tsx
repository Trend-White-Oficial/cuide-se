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
  Star as StarIcon,
} from '@mui/icons-material';
import { supabase, formatCurrency } from '../services/supabase';

interface LoyaltyRule {
  id: string;
  name: string;
  description: string;
  points_required: number;
  reward_type: 'discount' | 'service' | 'product';
  reward_value: number;
  active: boolean;
  created_at: string;
}

interface ClientPoints {
  id: string;
  client_id: string;
  points: number;
  total_spent: number;
  last_activity: string;
  client: {
    name: string;
    phone: string;
  };
}

export const LoyaltyProgram: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rules, setRules] = useState<LoyaltyRule[]>([]);
  const [clientPoints, setClientPoints] = useState<ClientPoints[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<LoyaltyRule | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    points_required: 0,
    reward_type: 'discount' as 'discount' | 'service' | 'product',
    reward_value: 0,
    active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar regras
      const { data: rulesData, error: rulesError } = await supabase
        .from('loyalty_rules')
        .select('*')
        .order('points_required');

      if (rulesError) throw rulesError;

      // Buscar pontos dos clientes
      const { data: pointsData, error: pointsError } = await supabase
        .from('client_points')
        .select(`
          *,
          client:client_id(name, phone)
        `)
        .order('points', { ascending: false });

      if (pointsError) throw pointsError;

      setRules(rulesData || []);
      setClientPoints(pointsData || []);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (rule?: LoyaltyRule) => {
    if (rule) {
      setEditingRule(rule);
      setFormData({
        name: rule.name,
        description: rule.description,
        points_required: rule.points_required,
        reward_type: rule.reward_type,
        reward_value: rule.reward_value,
        active: rule.active,
      });
    } else {
      setEditingRule(null);
      setFormData({
        name: '',
        description: '',
        points_required: 0,
        reward_type: 'discount',
        reward_value: 0,
        active: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRule(null);
    setFormData({
      name: '',
      description: '',
      points_required: 0,
      reward_type: 'discount',
      reward_value: 0,
      active: true,
    });
  };

  const handleSaveRule = async () => {
    try {
      if (!formData.name || formData.points_required <= 0) {
        throw new Error('Preencha todos os campos obrigatórios');
      }

      const ruleData = {
        name: formData.name,
        description: formData.description,
        points_required: formData.points_required,
        reward_type: formData.reward_type,
        reward_value: formData.reward_value,
        active: formData.active,
      };

      if (editingRule) {
        const { error } = await supabase
          .from('loyalty_rules')
          .update(ruleData)
          .eq('id', editingRule.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('loyalty_rules')
          .insert([ruleData]);
        if (error) throw error;
      }

      handleCloseDialog();
      fetchData();
    } catch (err) {
      console.error('Erro ao salvar regra:', err);
      setError('Erro ao salvar regra');
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta regra?')) return;

    try {
      const { error } = await supabase
        .from('loyalty_rules')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Erro ao excluir regra:', err);
      setError('Erro ao excluir regra');
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
          Programa de Fidelidade
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nova Regra
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Regras de Fidelidade
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nome</TableCell>
                      <TableCell>Pontos</TableCell>
                      <TableCell>Recompensa</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell>{rule.name}</TableCell>
                        <TableCell>{rule.points_required}</TableCell>
                        <TableCell>
                          {rule.reward_type === 'discount' ? (
                            `${rule.reward_value}% de desconto`
                          ) : rule.reward_type === 'service' ? (
                            'Serviço gratuito'
                          ) : (
                            'Produto gratuito'
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={rule.active ? 'Ativa' : 'Inativa'}
                            color={rule.active ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(rule)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteRule(rule.id)}
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
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ranking de Clientes
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Cliente</TableCell>
                      <TableCell align="right">Pontos</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clientPoints.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {client.client.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {client.client.phone}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <StarIcon sx={{ color: 'gold', mr: 0.5 }} />
                            {client.points}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Diálogo de Regra */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingRule ? 'Editar Regra' : 'Nova Regra'}
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
            <TextField
              label="Pontos Necessários"
              type="number"
              fullWidth
              value={formData.points_required}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  points_required: Number(e.target.value),
                })
              }
              required
              inputProps={{ min: 1 }}
            />
            <FormControl fullWidth>
              <InputLabel>Tipo de Recompensa</InputLabel>
              <Select
                value={formData.reward_type}
                label="Tipo de Recompensa"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reward_type: e.target.value as 'discount' | 'service' | 'product',
                  })
                }
              >
                <MenuItem value="discount">Desconto</MenuItem>
                <MenuItem value="service">Serviço Gratuito</MenuItem>
                <MenuItem value="product">Produto Gratuito</MenuItem>
              </Select>
            </FormControl>
            {formData.reward_type === 'discount' && (
              <TextField
                label="Valor do Desconto (%)"
                type="number"
                fullWidth
                value={formData.reward_value}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reward_value: Number(e.target.value),
                  })
                }
                required
                inputProps={{ min: 1, max: 100 }}
              />
            )}
            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                />
              }
              label="Regra Ativa"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSaveRule}
            disabled={!formData.name || formData.points_required <= 0}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 