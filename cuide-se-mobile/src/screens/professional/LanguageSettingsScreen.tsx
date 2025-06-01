import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../components/ui/Header';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'pt-BR', name: 'Português (Brasil)', nativeName: 'Português' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
];

export const ProfessionalLanguageSettingsScreen: React.FC = () => {
  const { user } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('pt-BR');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLanguage = async () => {
    try {
      setError(null);
      const { data, error: err } = await supabase
        .from('professional_settings')
        .select('language')
        .eq('professional_id', user?.id)
        .single();

      if (err) throw err;
      if (data?.language) {
        setSelectedLanguage(data.language);
      }
    } catch (err) {
      setError('Erro ao carregar configurações de idioma.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguage();
  }, []);

  const handleSelectLanguage = async (languageCode: string) => {
    try {
      setSaving(true);
      setError(null);

      const { error: err } = await supabase
        .from('professional_settings')
        .update({ language: languageCode })
        .eq('professional_id', user?.id);

      if (err) throw err;
      setSelectedLanguage(languageCode);
    } catch (err) {
      setError('Erro ao atualizar idioma.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Carregando configurações..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchLanguage} />;
  }

  return (
    <View style={styles.container}>
      <Header title="Configurações de Idioma" />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Header
            title="Selecione o Idioma"
            subtitle="Escolha o idioma que você prefere usar no aplicativo"
            showBackButton={false}
          />
          {AVAILABLE_LANGUAGES.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageOption,
                selectedLanguage === language.code && styles.selectedLanguage,
              ]}
              onPress={() => handleSelectLanguage(language.code)}
              disabled={saving}
            >
              <View style={styles.languageInfo}>
                <Header
                  title={language.name}
                  subtitle={language.nativeName}
                  showBackButton={false}
                />
              </View>
              {selectedLanguage === language.code && (
                <View style={styles.checkmark} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Header
            title="Contribuir com Traduções"
            subtitle="Ajude a melhorar as traduções do aplicativo"
            showBackButton={false}
          />
          <TouchableOpacity
            style={styles.contributeButton}
            onPress={() => {
              // TODO: Implementar navegação para página de contribuição
              console.log('Contribuir com traduções');
            }}
          >
            <Header
              title="Contribuir"
              subtitle="Envie sugestões de tradução"
              showBackButton={false}
            />
          </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginVertical: 8,
  },
  selectedLanguage: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  languageInfo: {
    flex: 1,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
  },
  contributeButton: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginTop: 8,
  },
}); 