import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';

export const LanguageSelector: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage, availableLanguages, changeLanguage } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('profile.language')}</Text>
      <View style={styles.languageList}>
        {availableLanguages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageButton,
              currentLanguage === language.code && styles.selectedLanguage,
            ]}
            onPress={() => changeLanguage(language.code)}
          >
            <Text
              style={[
                styles.languageText,
                currentLanguage === language.code && styles.selectedLanguageText,
              ]}
            >
              {language.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  languageList: {
    gap: 8,
  },
  languageButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  selectedLanguage: {
    backgroundColor: '#2196f3',
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  selectedLanguageText: {
    color: '#fff',
  },
}); 