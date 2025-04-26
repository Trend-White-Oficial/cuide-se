import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Avatar, Text, Button, Card, List, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme';

type UserProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function UserProfileScreen() {
  const navigation = useNavigation<UserProfileScreenNavigationProp>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Mock do usuário - Substituir por dados reais posteriormente
  const user = {
    name: 'Maria Silva',
    email: 'maria@email.com',
    phone: '(11) 99999-9999',
    avatar: 'https://via.placeholder.com/150',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Image
          size={100}
          source={{ uri: user.avatar }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <Card style={styles.section}>
        <Card.Content>
          <List.Section>
            <List.Subheader>Informações Pessoais</List.Subheader>
            <List.Item
              title="Nome"
              description={user.name}
              left={props => <List.Icon {...props} icon="account" />}
            />
            <List.Item
              title="E-mail"
              description={user.email}
              left={props => <List.Icon {...props} icon="email" />}
            />
            <List.Item
              title="Telefone"
              description={user.phone}
              left={props => <List.Icon {...props} icon="phone" />}
            />
          </List.Section>
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <List.Section>
            <List.Subheader>Configurações</List.Subheader>
            <List.Item
              title="Notificações"
              left={props => <List.Icon {...props} icon="bell" />}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  color={theme.colors.primary}
                />
              )}
            />
            <List.Item
              title="Privacidade"
              left={props => <List.Icon {...props} icon="lock" />}
              onPress={() => {/* Navegar para configurações de privacidade */}}
            />
            <List.Item
              title="Ajuda"
              left={props => <List.Icon {...props} icon="help-circle" />}
              onPress={() => {/* Navegar para ajuda */}}
            />
          </List.Section>
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <List.Section>
            <List.Subheader>Agendamentos</List.Subheader>
            <List.Item
              title="Meus Agendamentos"
              left={props => <List.Icon {...props} icon="calendar" />}
              onPress={() => {/* Navegar para agendamentos */}}
            />
            <List.Item
              title="Histórico"
              left={props => <List.Icon {...props} icon="history" />}
              onPress={() => {/* Navegar para histórico */}}
            />
          </List.Section>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={() => {/* Implementar logout */}}
        style={styles.logoutButton}
        icon="logout"
      >
        Sair
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.colors.primary,
  },
  avatar: {
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  section: {
    margin: 10,
  },
  logoutButton: {
    margin: 10,
    marginTop: 20,
    backgroundColor: theme.colors.error,
  },
}); 