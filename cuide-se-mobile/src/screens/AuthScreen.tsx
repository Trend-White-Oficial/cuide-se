import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, SegmentedButtons, Icon, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../theme';

type AuthScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

export default function AuthScreen() {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const { signIn } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  
  const theme = useTheme();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (mode === 'register') {
      if (!formData.name) {
        newErrors.name = 'Nome é obrigatório';
      }
      if (!formData.phone) {
        newErrors.phone = 'Telefone é obrigatório';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
    }

    if (!formData.email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'A senha deve ter no mínimo 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        await signIn(formData.email, formData.password);
        navigation.replace('Main');
      } else {
        // Implementar registro
        const response = await fetch('https://api.cuide-se.com/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Erro ao criar conta');
        }

        // Fazer login após registro bem-sucedido
        await signIn(formData.email, formData.password);
        navigation.replace('Main');
      }
    } catch (err) {
      setError('Ocorreu um erro. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Cuide-Se</Text>
        <Text style={styles.subtitle}>
          {mode === 'login' ? 'Bem-vinda de volta!' : 'Crie sua conta'}
        </Text>
      </View>

      <SegmentedButtons
        value={mode}
        onValueChange={value => setMode(value as 'login' | 'register')}
        buttons={[
          { value: 'login', label: 'Login' },
          { value: 'register', label: 'Criar Conta' },
        ]}
        style={styles.segmentedButtons}
      />

      <View style={styles.form}>
        {mode === 'register' && (
          <>
            <TextInput
              label="Nome"
              value={formData.name}
              onChangeText={text => setFormData(prev => ({ ...prev, name: text }))}
              mode="outlined"
              error={!!errors.name}
              style={styles.input}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <TextInput
              label="Telefone"
              value={formData.phone}
              onChangeText={text => setFormData(prev => ({ ...prev, phone: text }))}
              mode="outlined"
              error={!!errors.phone}
              style={styles.input}
              keyboardType="phone-pad"
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </>
        )}

        <TextInput
          label="E-mail"
          value={formData.email}
          onChangeText={text => setFormData(prev => ({ ...prev, email: text }))}
          mode="outlined"
          error={!!errors.email}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <TextInput
          label="Senha"
          value={formData.password}
          onChangeText={text => setFormData(prev => ({ ...prev, password: text }))}
          mode="outlined"
          error={!!errors.password}
          style={styles.input}
          secureTextEntry
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        {mode === 'register' && (
          <>
            <TextInput
              label="Confirmar Senha"
              value={formData.confirmPassword}
              onChangeText={text => setFormData(prev => ({ ...prev, confirmPassword: text }))}
              mode="outlined"
              error={!!errors.confirmPassword}
              style={styles.input}
              secureTextEntry
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </>
        )}

        {error && <Text style={styles.error}>{error}</Text>}

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
        >
          {mode === 'login' ? 'Entrar' : 'Criar Conta'}
        </Button>

        {mode === 'login' && (
          <Button
            mode="text"
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.textButton}
          >
            Esqueceu sua senha?
          </Button>
        )}

        <Button
          mode="text"
          onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
          style={styles.textButton}
        >
          {mode === 'login'
            ? 'Não tem uma conta? Cadastre-se'
            : 'Já tem uma conta? Entre'}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  segmentedButtons: {
    marginBottom: 24,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 16,
  },
  textButton: {
    marginTop: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
}); 