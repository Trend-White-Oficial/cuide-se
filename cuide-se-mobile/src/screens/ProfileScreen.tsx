import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Header } from '../components/ui/Header';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';

export const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateProfile = async () => {
    try {
      setError(null);
      setLoading(true);

      const { error: updateError } = await supabase
        .from('users')
        .update({ name, email })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      if (newPassword) {
        if (newPassword !== confirmPassword) {
          setError('As senhas não coincidem.');
          return;
        }

        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (passwordError) throw passwordError;
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Erro ao atualizar perfil.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Atualizando perfil..." />;
  }

  return (
    <View style={styles.container}>
      <Header title="Meu Perfil" />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Header title="Dados Pessoais" showBackButton={false} />
          <Input
            label="Nome"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <Input
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <View style={styles.section}>
          <Header title="Alterar Senha" showBackButton={false} />
          <Input
            label="Senha Atual"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            style={styles.input}
          />
          <Input
            label="Nova Senha"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            style={styles.input}
          />
          <Input
            label="Confirmar Nova Senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <ErrorMessage message={error} />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="Salvar Alterações"
            onPress={handleUpdateProfile}
            style={styles.button}
          />
          <Button
            title="Sair"
            onPress={signOut}
            variant="outline"
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
  },
  input: {
    marginBottom: 16,
  },
  errorContainer: {
    padding: 16,
  },
  buttonContainer: {
    padding: 16,
    gap: 12,
  },
  button: {
    width: '100%',
  },
}); 