import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import { securityService } from '../services/security';
import QRCode from 'react-native-qrcode-svg';

interface TwoFactorAuthProps {
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({
  userId,
  onSuccess,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [secret, setSecret] = useState<string | null>(null);
  const [token, setToken] = useState('');
  const [step, setStep] = useState<'setup' | 'verify'>('setup');

  useEffect(() => {
    if (step === 'setup') {
      setup2FA();
    }
  }, [step]);

  const setup2FA = async () => {
    try {
      setLoading(true);
      const secretKey = await securityService.setup2FA(userId);
      setSecret(secretKey);
    } catch (error) {
      console.error('Erro ao configurar 2FA:', error);
      Alert.alert('Erro', 'Não foi possível configurar a autenticação em duas etapas');
      onCancel();
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      const isValid = await securityService.verify2FA(userId, token);
      
      if (isValid) {
        Alert.alert('Sucesso', 'Autenticação em duas etapas configurada com sucesso!');
        onSuccess();
      } else {
        Alert.alert('Erro', 'Código inválido. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      Alert.alert('Erro', 'Não foi possível verificar o código');
    } finally {
      setLoading(false);
    }
  };

  const handleScan = () => {
    setStep('verify');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          {step === 'setup' ? (
            <>
              <Text style={styles.title}>Configurar Autenticação em Duas Etapas</Text>
              
              {secret && (
                <View style={styles.qrContainer}>
                  <QRCode
                    value={`otpauth://totp/Cuide-se:${userId}?secret=${secret}&issuer=Cuide-se`}
                    size={200}
                  />
                  <Text style={styles.secretText}>
                    Chave secreta: {secret}
                  </Text>
                  <Text style={styles.instructions}>
                    Escaneie o QR Code com seu aplicativo autenticador ou insira a chave manualmente.
                  </Text>
                </View>
              )}

              <Button
                mode="contained"
                onPress={handleScan}
                style={styles.button}
              >
                Já escaneei o QR Code
              </Button>
            </>
          ) : (
            <>
              <Text style={styles.title}>Verificar Código</Text>
              <Text style={styles.instructions}>
                Digite o código de 6 dígitos gerado pelo seu aplicativo autenticador.
              </Text>

              <TextInput
                label="Código de Verificação"
                value={token}
                onChangeText={setToken}
                keyboardType="number-pad"
                maxLength={6}
                style={styles.input}
              />

              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={onCancel}
                  style={[styles.button, styles.cancelButton]}
                >
                  Cancelar
                </Button>
                <Button
                  mode="contained"
                  onPress={handleVerify}
                  style={[styles.button, styles.verifyButton]}
                >
                  Verificar
                </Button>
              </View>
            </>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  secretText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'monospace',
  },
  instructions: {
    textAlign: 'center',
    color: '#757575',
    marginTop: 16,
    marginBottom: 24,
  },
  input: {
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    borderColor: '#757575',
  },
  verifyButton: {
    backgroundColor: '#2196F3',
  },
}); 