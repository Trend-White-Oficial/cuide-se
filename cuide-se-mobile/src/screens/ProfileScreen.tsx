import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabase';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';

export const ProfileScreen: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setName(data.name || '');
        setPhone(data.phone || '');
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      setError('Não foi possível carregar seu perfil.');
    }
  };

  const handleUpdateProfile = async () => {
    if (!name) {
      Alert.alert('Erro', 'Por favor, preencha seu nome.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          name,
          phone,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setError('Não foi possível atualizar seu perfil.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProfile} />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Meu Perfil</Text>

        <View style={styles.form}>
          <Input
            label="Email"
            value={user?.email || ''}
            editable={false}
            containerStyle={styles.inputContainer}
          />

          <Input
            label="Nome"
            value={name}
            onChangeText={setName}
            placeholder="Digite seu nome"
            containerStyle={styles.inputContainer}
          />

          <Input
            label="Telefone"
            value={phone}
            onChangeText={setPhone}
            placeholder="Digite seu telefone"
            keyboardType="phone-pad"
            containerStyle={styles.inputContainer}
          />

          <Button
            title="Salvar Alterações"
            onPress={handleUpdateProfile}
            style={styles.button}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
}); 