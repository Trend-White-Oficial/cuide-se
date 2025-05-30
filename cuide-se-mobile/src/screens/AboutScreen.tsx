import React from 'react';
import { StyleSheet, View, ScrollView, Linking } from 'react-native';
import { Header } from '../components/ui/Header';
import { Button } from '../components/ui/Button';
import Constants from 'expo-constants';

export const AboutScreen: React.FC = () => {
  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Header title="Sobre" />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Header title="Cuide-se" showBackButton={false} />
          <Header
            title={`Versão ${Constants.expoConfig?.version || '1.0.0'}`}
            showBackButton={false}
          />
        </View>

        <View style={styles.section}>
          <Header title="Empresa" showBackButton={false} />
          <Header
            title="Cuide-se é uma plataforma que conecta profissionais de beleza e bem-estar a clientes, facilitando o agendamento de serviços e a gestão de negócios."
            showBackButton={false}
          />
        </View>

        <View style={styles.section}>
          <Header title="Links Úteis" showBackButton={false} />
          <Button
            title="Política de Privacidade"
            onPress={() => handleOpenLink('https://cuidese.com.br/privacy')}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="Termos de Uso"
            onPress={() => handleOpenLink('https://cuidese.com.br/terms')}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="Trabalhe Conosco"
            onPress={() => handleOpenLink('https://cuidese.com.br/careers')}
            variant="outline"
            style={styles.button}
          />
        </View>

        <View style={styles.section}>
          <Header title="Contato" showBackButton={false} />
          <Button
            title="E-mail"
            onPress={() => handleOpenLink('mailto:contato@cuidese.com.br')}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="WhatsApp"
            onPress={() => handleOpenLink('https://wa.me/5511999999999')}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="Instagram"
            onPress={() => handleOpenLink('https://instagram.com/cuidese')}
            variant="outline"
            style={styles.button}
          />
        </View>

        <View style={styles.section}>
          <Header title="Desenvolvido com ❤️" showBackButton={false} />
          <Header
            title="© 2024 Cuide-se. Todos os direitos reservados."
            showBackButton={false}
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
  button: {
    marginBottom: 12,
  },
}); 