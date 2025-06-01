import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { supabase } from '../services/supabase';

interface Settings {
  business: {
    name: string;
    cnpj: string;
    phone: string;
    email: string;
    address: string;
    logo_url: string;
  };
  schedule: {
    interval_minutes: number;
    allow_same_day: boolean;
    max_days_ahead: number;
    cancellation_policy: number;
  };
  notifications: {
    email_notifications: boolean;
    sms_notifications: boolean;
    push_notifications: boolean;
    reminder_before: number;
  };
  payments: {
    payment_methods: string[];
    installments: number;
    min_installment_value: number;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    primary_color: string;
    secondary_color: string;
  };
}

export const Settings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [settings, setSettings] = useState<Settings>({
    business: {
      name: '',
      cnpj: '',
      phone: '',
      email: '',
      address: '',
      logo_url: '',
    },
    schedule: {
      interval_minutes: 30,
      allow_same_day: true,
      max_days_ahead: 30,
      cancellation_policy: 24,
    },
    notifications: {
      email_notifications: true,
      sms_notifications: false,
      push_notifications: true,
      reminder_before: 24,
    },
    payments: {
      payment_methods: ['credit_card', 'debit_card', 'pix'],
      installments: 12,
      min_installment_value: 50,
    },
    appearance: {
      theme: 'system',
      primary_color: '#1976d2',
      secondary_color: '#dc004e',
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (fetchError) throw fetchError;

      if (data) {
        setSettings(data as Settings);
      }
    } catch (err) {
      console.error('Erro ao buscar configurações:', err);
      setError('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const { error: updateError } = await supabase
        .from('settings')
        .upsert([settings]);

      if (updateError) throw updateError;

      setSuccess('Configurações salvas com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
      setError('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
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
      <Typography variant="h4" component="h1" gutterBottom>
        Configurações
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Empresa" />
            <Tab label="Agendamento" />
            <Tab label="Notificações" />
            <Tab label="Pagamentos" />
            <Tab label="Aparência" />
          </Tabs>

          {currentTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nome da Empresa"
                  fullWidth
                  value={settings.business.name}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      business: { ...settings.business, name: e.target.value },
                    })
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="CNPJ"
                  fullWidth
                  value={settings.business.cnpj}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      business: { ...settings.business, cnpj: e.target.value },
                    })
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Telefone"
                  fullWidth
                  value={settings.business.phone}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      business: { ...settings.business, phone: e.target.value },
                    })
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={settings.business.email}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      business: { ...settings.business, email: e.target.value },
                    })
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Endereço"
                  fullWidth
                  multiline
                  rows={2}
                  value={settings.business.address}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      business: { ...settings.business, address: e.target.value },
                    })
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="URL do Logo"
                  fullWidth
                  value={settings.business.logo_url}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      business: { ...settings.business, logo_url: e.target.value },
                    })
                  }
                />
              </Grid>
            </Grid>
          )}

          {currentTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Intervalo entre Horários (minutos)"
                  type="number"
                  fullWidth
                  value={settings.schedule.interval_minutes}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      schedule: {
                        ...settings.schedule,
                        interval_minutes: parseInt(e.target.value),
                      },
                    })
                  }
                  inputProps={{ min: 15, step: 15 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Dias para Agendamento Futuro"
                  type="number"
                  fullWidth
                  value={settings.schedule.max_days_ahead}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      schedule: {
                        ...settings.schedule,
                        max_days_ahead: parseInt(e.target.value),
                      },
                    })
                  }
                  inputProps={{ min: 1 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Política de Cancelamento (horas)"
                  type="number"
                  fullWidth
                  value={settings.schedule.cancellation_policy}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      schedule: {
                        ...settings.schedule,
                        cancellation_policy: parseInt(e.target.value),
                      },
                    })
                  }
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.schedule.allow_same_day}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          schedule: {
                            ...settings.schedule,
                            allow_same_day: e.target.checked,
                          },
                        })
                      }
                    />
                  }
                  label="Permitir Agendamento no Mesmo Dia"
                />
              </Grid>
            </Grid>
          )}

          {currentTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.email_notifications}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            email_notifications: e.target.checked,
                          },
                        })
                      }
                    />
                  }
                  label="Notificações por Email"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.sms_notifications}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            sms_notifications: e.target.checked,
                          },
                        })
                      }
                    />
                  }
                  label="Notificações por SMS"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.push_notifications}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            push_notifications: e.target.checked,
                          },
                        })
                      }
                    />
                  }
                  label="Notificações Push"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Lembretes Antecipados (horas)"
                  type="number"
                  fullWidth
                  value={settings.notifications.reminder_before}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        reminder_before: parseInt(e.target.value),
                      },
                    })
                  }
                  inputProps={{ min: 1 }}
                />
              </Grid>
            </Grid>
          )}

          {currentTab === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Métodos de Pagamento</InputLabel>
                  <Select
                    multiple
                    value={settings.payments.payment_methods}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        payments: {
                          ...settings.payments,
                          payment_methods: e.target.value as string[],
                        },
                      })
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Typography key={value} variant="body2">
                            {value === 'credit_card'
                              ? 'Cartão de Crédito'
                              : value === 'debit_card'
                              ? 'Cartão de Débito'
                              : value === 'pix'
                              ? 'PIX'
                              : value === 'cash'
                              ? 'Dinheiro'
                              : value}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  >
                    <MenuItem value="credit_card">Cartão de Crédito</MenuItem>
                    <MenuItem value="debit_card">Cartão de Débito</MenuItem>
                    <MenuItem value="pix">PIX</MenuItem>
                    <MenuItem value="cash">Dinheiro</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Número de Parcelas"
                  type="number"
                  fullWidth
                  value={settings.payments.installments}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payments: {
                        ...settings.payments,
                        installments: parseInt(e.target.value),
                      },
                    })
                  }
                  inputProps={{ min: 1, max: 12 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Valor Mínimo da Parcela"
                  type="number"
                  fullWidth
                  value={settings.payments.min_installment_value}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payments: {
                        ...settings.payments,
                        min_installment_value: parseFloat(e.target.value),
                      },
                    })
                  }
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
            </Grid>
          )}

          {currentTab === 4 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tema</InputLabel>
                  <Select
                    value={settings.appearance.theme}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        appearance: {
                          ...settings.appearance,
                          theme: e.target.value as 'light' | 'dark' | 'system',
                        },
                      })
                    }
                  >
                    <MenuItem value="light">Claro</MenuItem>
                    <MenuItem value="dark">Escuro</MenuItem>
                    <MenuItem value="system">Sistema</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Cor Primária"
                  type="color"
                  fullWidth
                  value={settings.appearance.primary_color}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      appearance: {
                        ...settings.appearance,
                        primary_color: e.target.value,
                      },
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Cor Secundária"
                  type="color"
                  fullWidth
                  value={settings.appearance.secondary_color}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      appearance: {
                        ...settings.appearance,
                        secondary_color: e.target.value,
                      },
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          )}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}; 