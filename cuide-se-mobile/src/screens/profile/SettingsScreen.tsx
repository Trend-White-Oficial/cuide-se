import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../contexts/AuthContext';
import { Text } from '../../components/Text';
import { Switch } from '../../components/Switch';
import { Divider } from '../../components/Divider';
import { Icon } from '../../components/Icon';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, toggleTheme } = useTheme();
  const { t, changeLanguage } = useTranslation();
  const { signOut } = useAuth();

  const handleLanguageChange = () => {
    const newLanguage = t('language') === 'pt-BR' ? 'en' : 'pt-BR';
    changeLanguage(newLanguage);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('settings.title')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.appearance')}</Text>
        
        <View style={styles.setting}>
          <View style={styles.settingInfo}>
            <Icon name="moon" size={24} />
            <Text style={styles.settingLabel}>{t('settings.darkMode')}</Text>
          </View>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
          />
        </View>

        <Divider />

        <TouchableOpacity
          style={styles.setting}
          onPress={handleLanguageChange}
        >
          <View style={styles.settingInfo}>
            <Icon name="globe" size={24} />
            <Text style={styles.settingLabel}>{t('settings.language')}</Text>
          </View>
          <View style={styles.settingValue}>
            <Text style={styles.settingValueText}>
              {t('language') === 'pt-BR' ? 'Português' : 'English'}
            </Text>
            <Icon name="chevron-right" size={24} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.notifications')}</Text>
        
        <View style={styles.setting}>
          <View style={styles.settingInfo}>
            <Icon name="bell" size={24} />
            <Text style={styles.settingLabel}>
              {t('settings.pushNotifications')}
            </Text>
          </View>
          <Switch value={true} />
        </View>

        <Divider />

        <View style={styles.setting}>
          <View style={styles.settingInfo}>
            <Icon name="mail" size={24} />
            <Text style={styles.settingLabel}>
              {t('settings.emailNotifications')}
            </Text>
          </View>
          <Switch value={true} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.account')}</Text>
        
        <TouchableOpacity
          style={styles.setting}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <View style={styles.settingInfo}>
            <Icon name="user" size={24} />
            <Text style={styles.settingLabel}>
              {t('settings.editProfile')}
            </Text>
          </View>
          <Icon name="chevron-right" size={24} />
        </TouchableOpacity>

        <Divider />

        <TouchableOpacity
          style={styles.setting}
          onPress={handleSignOut}
        >
          <View style={styles.settingInfo}>
            <Icon name="log-out" size={24} color="#FF3B30" />
            <Text style={[styles.settingLabel, styles.signOutText]}>
              {t('settings.signOut')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValueText: {
    fontSize: 16,
    opacity: 0.6,
  },
  signOutText: {
    color: '#FF3B30',
  },
}); 