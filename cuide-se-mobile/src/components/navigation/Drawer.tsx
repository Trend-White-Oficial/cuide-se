import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { THEME_CONFIG } from '../../config';
import { Icon } from '../Icon';
import { Avatar } from '../Avatar';
import { useAuth } from '../../contexts/AuthContext';

interface DrawerItem {
  key: string;
  title: string;
  icon: string;
  onPress: () => void;
}

export const Drawer: React.FC<DrawerContentComponentProps> = (props) => {
  const { user, signOut } = useAuth();

  const drawerItems: DrawerItem[] = [
    {
      key: 'home',
      title: 'Início',
      icon: 'home',
      onPress: () => props.navigation.navigate('Home'),
    },
    {
      key: 'appointments',
      title: 'Agendamentos',
      icon: 'calendar',
      onPress: () => props.navigation.navigate('Appointments'),
    },
    {
      key: 'profile',
      title: 'Perfil',
      icon: 'user',
      onPress: () => props.navigation.navigate('Profile'),
    },
    {
      key: 'settings',
      title: 'Configurações',
      icon: 'settings',
      onPress: () => props.navigation.navigate('Settings'),
    },
  ];

  return (
    <DrawerContentScrollView
      {...props}
      style={styles.container}
    >
      <View style={styles.header}>
        <Avatar
          source={user?.user_metadata?.avatar_url}
          name={user?.user_metadata?.name || user?.email}
          size={64}
        />
        <Text style={styles.name}>
          {user?.user_metadata?.name || user?.email}
        </Text>
        <Text style={styles.email}>
          {user?.email}
        </Text>
      </View>

      <View style={styles.content}>
        {drawerItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            onPress={item.onPress}
            style={styles.item}
          >
            <Icon
              name={item.icon}
              size={24}
              color={THEME_CONFIG.textColor}
            />
            <Text style={styles.itemText}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={signOut}
        style={styles.signOutButton}
      >
        <Icon
          name="close"
          size={24}
          color={THEME_CONFIG.errorColor}
        />
        <Text style={styles.signOutText}>
          Sair
        </Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_CONFIG.backgroundColor,
  },
  header: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: THEME_CONFIG.textColor + '20',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME_CONFIG.textColor,
    marginTop: 8,
  },
  email: {
    fontSize: 14,
    color: THEME_CONFIG.textColor + '80',
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
    color: THEME_CONFIG.textColor,
    marginLeft: 16,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: THEME_CONFIG.textColor + '20',
  },
  signOutText: {
    fontSize: 16,
    color: THEME_CONFIG.errorColor,
    marginLeft: 16,
    fontWeight: '600',
  },
}); 