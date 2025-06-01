import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Header } from '../../components/ui/Header';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';
import { useNavigation } from '@react-navigation/native';

export const ProfessionalAddServiceScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
  });

  const validateForm = () => {
    const errors = {
      name: '',
      description: '',
      duration: '',
      price: '',
    };

    if (!formData.name.trim()) {
      errors.name = 'Nome é obrigatório';
    }

    if (!formData.description.trim()) {
      errors.description = 'Descrição é obrigatória';
    }

    if (!formData.duration.trim()) {
      errors.duration = 'Duração é obrigatória';
    } else if (isNaN(Number(formData.duration)) || Number(formData.duration) <= 0) {
      errors.duration = 'Duração inválida';
    }

    if (!formData.price.trim()) {
      errors.price = 'Preço é obrigatório';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      errors.price = 'Preço inválido';
    }

    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError(null);

      const { error: err } = await supabase.from('services').insert({
        professional_id: user?.id,
        name: formData.name.trim(),
        description: formData.description.trim(),
        duration: Number(formData.duration),
        price: Number(formData.price),
      });

      if (err) throw err;
      navigation.goBack();
    } catch (err) {
      setError('Erro ao criar serviço.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return <ErrorMessage message={error} onRetry={() => setError(null)} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header title="Novo Serviço" />
      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Input
            label="Nome"
            value={formData.name}
            onChangeText={text => setFormData({ ...formData, name: text })}
            error={formErrors.name}
          />
          <Input
            label="Descrição"
            value={formData.description}
            onChangeText={text => setFormData({ ...formData, description: text })}
            error={formErrors.description}
            multiline
            numberOfLines={3}
          />
          <Input
            label="Duração (minutos)"
            value={formData.duration}
            onChangeText={text => setFormData({ ...formData, duration: text })}
            error={formErrors.duration}
            keyboardType="numeric"
          />
          <Input
            label="Preço (R$)"
            value={formData.price}
            onChangeText={text => setFormData({ ...formData, price: text })}
            error={formErrors.price}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title="Criar Serviço"
            onPress={handleSave}
            variant="primary"
            loading={saving}
          />
          <Button
            title="Cancelar"
            onPress={() => navigation.goBack()}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  form: {
    padding: 16,
    gap: 16,
  },
  actionsContainer: {
    padding: 16,
    gap: 8,
  },
}); 