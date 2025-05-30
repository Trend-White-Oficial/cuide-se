import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Searchbar, useTheme } from 'react-native-paper';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Pesquisar...',
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Searchbar
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        style={styles.searchBar}
        inputStyle={styles.input}
        iconColor={theme.colors.primary}
        placeholderTextColor="#666"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  searchBar: {
    elevation: 2,
    backgroundColor: '#fff',
  },
  input: {
    fontSize: 16,
  },
}); 