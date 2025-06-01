import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from './Icon';
import { Avatar } from './Avatar';

interface DrawerItem {
  label: string;
  icon: string;
  route: string;
  onPress?: () => void;
}

interface DrawerProps {
  items: DrawerItem[];
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onClose?: () => void;
}

export const Drawer: React.FC<DrawerProps> = ({
  items,
  user,
  onClose,
}) => {
  const navigation = useNavigation();

  const handleItemPress = (item: DrawerItem) => {
    if (item.onPress) {
      item.onPress();
    } else {
      navigation.navigate(item.route);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {user ? (
          <View style={styles.userInfo}>
            <Avatar
              size={64}
              source={user.avatar ? { uri: user.avatar } : undefined}
              name={user.name}
            />
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        ) : (
          <View style={styles.guestInfo}>
            <Icon name="user" size={48} color="#666" />
            <Text style={styles.guestText}>Convidado</Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.content}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.item}
            onPress={() => handleItemPress(item)}
          >
            <Icon name={item.icon} size={24} color="#333" />
            <Text style={styles.itemLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >
          <Icon name="x" size={24} color="#666" />
          <Text style={styles.closeButtonText}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  guestInfo: {
    alignItems: 'center',
  },
  guestText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemLabel: {
    fontSize: 16,
    marginLeft: 16,
    color: '#333',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
}); 