import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Header } from '../../components/ui/Header';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';

interface PaymentSettings {
  bank_name: string;
  bank_agency: string;
  bank_account: string;
  pix_key: string;
  pix_key_type: 'email' | 'cpf' | 'phone' | 'random';
  service_fee: number;
}

export const ProfessionalPaymentSettingsScreen: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<PaymentSettings>({
    bank_name: '',
    bank_agency: '',
    bank_account: '',
    pix_key: '',
    pix_key_type: 'email',
    service_fee: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<PaymentSettings>>({});

  const fetchSettings = async () => {
    try {
      setError(null);
      const { data, error: err } = await supabase
        .from('professional_settings')
        .select('payment_settings')
        .eq('professional_id', user?.id)
        .single();

      if (err) throw err;
      if (data?.payment_settings) {
        setSettings(data.payment_settings);
      }
    } catch (err) {
      setError('Erro ao carregar configurações.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const validateForm = () => {
    const errors: Partial<PaymentSettings> = {};

    if (!settings.bank_name) {
      errors.bank_name = 'Nome do banco é obrigatório';
    }

    if (!settings.bank_agency) {
      errors.bank_agency = 'Agência é obrigatória';
    }

    if (!settings.bank_account) {
      errors.bank_account = 'Conta é obrigatória';
    }

    if (!settings.pix_key) {
      errors.pix_key = 'Chave PIX é obrigatória';
    }

    if (settings.service_fee < 0 || settings.service_fee > 100) {
      errors.service_fee = 'Taxa de serviço deve estar entre 0 e 100';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError(null);

      const { error: err } = await supabase
        .from('professional_settings')
        .update({ payment_settings: settings })
        .eq('professional_id', user?.id);

      if (err) throw err;
    } catch (err) {
      setError('Erro ao salvar configurações.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Carregando configurações..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchSettings} />;
  }

  return (
    <View style={styles.container}>
      <Header title="Configurações de Pagamento" />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Header title="Dados Bancários" showBackButton={false} />
          <Input
            label="Nome do Banco"
            value={settings.bank_name}
            onChangeText={(text) =>
              setSettings({ ...settings, bank_name: text })
            }
            error={formErrors.bank_name}
          />
          <Input
            label="Agência"
            value={settings.bank_agency}
            onChangeText={(text) =>
              setSettings({ ...settings, bank_agency: text })
            }
            error={formErrors.bank_agency}
          />
          <Input
            label="Conta"
            value={settings.bank_account}
            onChangeText={(text) =>
              setSettings({ ...settings, bank_account: text })
            }
            error={formErrors.bank_account}
          />
        </View>

        <View style={styles.section}>
          <Header title="Configurações PIX" showBackButton={false} />
          <Input
            label="Chave PIX"
            value={settings.pix_key}
            onChangeText={(text) => setSettings({ ...settings, pix_key: text })}
            error={formErrors.pix_key}
          />
          <Input
            label="Tipo de Chave"
            value={settings.pix_key_type}
            onChangeText={(text) =>
              setSettings({ ...settings, pix_key_type: text as any })
            }
            error={formErrors.pix_key_type}
          />
        </View>

        <View style={styles.section}>
          <Header title="Taxa de Serviço" showBackButton={false} />
          <Input
            label="Taxa (%)"
            value={settings.service_fee.toString()}
            onChangeText={(text) =>
              setSettings({
                ...settings,
                service_fee: parseFloat(text) || 0,
              })
            }
            keyboardType="numeric"
            error={formErrors.service_fee}
          />
        </View>

        <Button
          title="Salvar Configurações"
          onPress={handleSave}
          loading={saving}
          style={styles.saveButton}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  saveButton: {
    margin: 16,
  },
}); 