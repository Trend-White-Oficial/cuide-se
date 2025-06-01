import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Header } from '../../components/ui/Header';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';

export const ProfessionalSecuritySettingsScreen: React.FC = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const errors: typeof formErrors = {};

    if (!currentPassword) {
      errors.currentPassword = 'Senha atual é obrigatória';
    }

    if (!newPassword) {
      errors.newPassword = 'Nova senha é obrigatória';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'A senha deve ter pelo menos 6 caracteres';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (confirmPassword !== newPassword) {
      errors.confirmPassword = 'As senhas não coincidem';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Primeiro, verificar a senha atual
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });

      if (signInError) {
        throw new Error('Senha atual incorreta');
      }

      // Atualizar a senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Alterando senha..." />;
  }

  return (
    <View style={styles.container}>
      <Header title="Configurações de Segurança" />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Header
            title="Alterar Senha"
            subtitle="Atualize sua senha para manter sua conta segura"
            showBackButton={false}
          />
          <Input
            label="Senha Atual"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            error={formErrors.currentPassword}
          />
          <Input
            label="Nova Senha"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            error={formErrors.newPassword}
          />
          <Input
            label="Confirmar Nova Senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={formErrors.confirmPassword}
          />
          <Button
            title="Alterar Senha"
            onPress={handleChangePassword}
            style={styles.button}
          />
        </View>

        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => {
              setError(null);
              setSuccess(false);
            }}
          />
        )}

        {success && (
          <View style={styles.successContainer}>
            <Header
              title="Senha alterada com sucesso!"
              showBackButton={false}
            />
          </View>
        )}

        <View style={styles.section}>
          <Header
            title="Autenticação em Duas Etapas"
            subtitle="Adicione uma camada extra de segurança à sua conta"
            showBackButton={false}
          />
          <Button
            title="Configurar Autenticação em Duas Etapas"
            onPress={() => {
              // TODO: Implementar configuração de 2FA
              console.log('Configurar 2FA');
            }}
            variant="secondary"
            style={styles.button}
          />
        </View>

        <View style={styles.section}>
          <Header
            title="Sessões Ativas"
            subtitle="Gerencie os dispositivos conectados à sua conta"
            showBackButton={false}
          />
          <Button
            title="Gerenciar Sessões"
            onPress={() => {
              // TODO: Implementar gerenciamento de sessões
              console.log('Gerenciar sessões');
            }}
            variant="secondary"
            style={styles.button}
          />
        </View>

        <View style={styles.section}>
          <Header
            title="Recuperação de Conta"
            subtitle="Configure métodos de recuperação para sua conta"
            showBackButton={false}
          />
          <Button
            title="Configurar Recuperação"
            onPress={() => {
              // TODO: Implementar configuração de recuperação
              console.log('Configurar recuperação');
            }}
            variant="secondary"
            style={styles.button}
          />
        </View>
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
  button: {
    marginTop: 16,
  },
  successContainer: {
    padding: 16,
    backgroundColor: '#e6ffe6',
    margin: 16,
    borderRadius: 8,
  },
}); 