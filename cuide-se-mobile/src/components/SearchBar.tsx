import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { THEME_CONFIG } from '../config';
import { Icon } from './Icon';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  placeholderStyle?: TextStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Pesquisar...',
  onClear,
  containerStyle,
  inputStyle,
  placeholderStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Icon
        name="search"
        size={20}
        color={THEME_CONFIG.textColor + '80'}
        style={styles.icon}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={THEME_CONFIG.textColor + '80'}
        style={[styles.input, inputStyle]}
        placeholderStyle={placeholderStyle}
      />
      {value ? (
        <TouchableOpacity
          onPress={() => {
            onChangeText('');
            onClear?.();
          }}
          style={styles.clearButton}
        >
          <Icon
            name="close"
            size={20}
            color={THEME_CONFIG.textColor + '80'}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_CONFIG.backgroundColor,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME_CONFIG.textColor + '40',
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: THEME_CONFIG.textColor,
  },
  clearButton: {
    padding: 4,
  },
}); 