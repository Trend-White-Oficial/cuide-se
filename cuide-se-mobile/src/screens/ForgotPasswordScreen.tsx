import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const theme = useTheme();

  const handleSubmit = () => {
    // Implementar lógica de recuperação de senha
    console.log('Email para recuperação:', email);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Senha</Text>
      
      <Text style={styles.description}>
        Digite seu email cadastrado para receber as instruções de recuperação de senha.
      </Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.button}
      >
        Enviar instruções
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
}); 