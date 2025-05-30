import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Linking } from 'react-native';
import { Header } from '../components/ui/Header';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

export const SupportScreen: React.FC = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSendMessage = async () => {
    if (!subject || !message) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const { error: supportError } = await supabase
        .from('support_messages')
        .insert([
          {
            user_id: user?.id,
            subject,
            message,
          },
        ]);

      if (supportError) throw supportError;

      setSubject('');
      setMessage('');
      setSuccess(true);
    } catch (err) {
      setError('Erro ao enviar mensagem.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:suporte@cuidese.com.br');
  };

  if (loading) {
    return <LoadingSpinner message="Enviando mensagem..." />;
  }

  return (
    <View style={styles.container}>
      <Header title="Suporte" />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Header title="Perguntas Frequentes" showBackButton={false} />
          <Button
            title="Como agendar um serviço?"
            onPress={() => {}}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="Como cancelar um agendamento?"
            onPress={() => {}}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="Como alterar minha senha?"
            onPress={() => {}}
            variant="outline"
            style={styles.button}
          />
        </View>

        <View style={styles.section}>
          <Header title="Contato" showBackButton={false} />
          <Button
            title="E-mail de Suporte"
            onPress={handleContactSupport}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="WhatsApp"
            onPress={() => Linking.openURL('https://wa.me/5511999999999')}
            variant="outline"
            style={styles.button}
          />
        </View>

        <View style={styles.section}>
          <Header title="Envie sua Dúvida" showBackButton={false} />
          <Input
            label="Assunto"
            value={subject}
            onChangeText={setSubject}
            style={styles.input}
          />
          <Input
            label="Mensagem"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            style={styles.input}
          />

          {error && (
            <View style={styles.errorContainer}>
              <ErrorMessage message={error} />
            </View>
          )}

          {success && (
            <View style={styles.successContainer}>
              <Header
                title="Mensagem enviada com sucesso!"
                showBackButton={false}
              />
            </View>
          )}

          <Button
            title="Enviar Mensagem"
            onPress={handleSendMessage}
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
  button: {
    marginBottom: 12,
  },
  errorContainer: {
    marginBottom: 16,
  },
  successContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
  },
}); 