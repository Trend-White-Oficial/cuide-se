import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface SelectOption {
  /**
   * Valor da opção
   */
  value: string;
  /**
   * Rótulo da opção
   */
  label: string;
  /**
   * Se a opção está desabilitada
   */
  disabled?: boolean;
}

export interface SelectProps {
  /**
   * Lista de opções
   */
  options: SelectOption[];
  /**
   * Valor selecionado
   */
  value?: string;
  /**
   * Função chamada quando o valor muda
   */
  onChange?: (value: string) => void;
  /**
   * Placeholder do select
   */
  placeholder?: string;
  /**
   * Se o select está desabilitado
   * @default false
   */
  disabled?: boolean;
  /**
   * Se o select está com erro
   * @default false
   */
  error?: boolean;
  /**
   * Mensagem de erro
   */
  errorMessage?: string;
  /**
   * Se o select é pesquisável
   * @default false
   */
  searchable?: boolean;
  /**
   * Estilo personalizado do container
   */
  containerStyle?: ViewStyle;
  /**
   * Estilo personalizado do select
   */
  selectStyle?: ViewStyle;
  /**
   * Estilo personalizado do texto do select
   */
  selectTextStyle?: TextStyle;
  /**
   * Estilo personalizado do modal
   */
  modalStyle?: ViewStyle;
  /**
   * Estilo personalizado da lista de opções
   */
  optionsListStyle?: ViewStyle;
  /**
   * Estilo personalizado da opção
   */
  optionStyle?: ViewStyle;
  /**
   * Estilo personalizado do texto da opção
   */
  optionTextStyle?: TextStyle;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Selecione uma opção',
  disabled = false,
  error = false,
  errorMessage,
  searchable = false,
  containerStyle,
  selectStyle,
  selectTextStyle,
  modalStyle,
  optionsListStyle,
  optionStyle,
  optionTextStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { colors, typography, spacing } = useTheme();

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;
    onChange?.(option.value);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        onPress={() => !disabled && setIsOpen(true)}
        style={[
          styles.select,
          {
            backgroundColor: disabled ? colors.disabled : colors.background,
            borderColor: error ? colors.error : colors.border,
          },
          selectStyle,
        ]}
      >
        <Text
          style={[
            styles.selectText,
            typography.body1,
            {
              color: disabled ? colors.textDisabled : colors.text,
            },
            selectTextStyle,
          ]}
        >
          {selectedOption?.label || placeholder}
        </Text>
      </TouchableOpacity>

      {error && errorMessage && (
        <Text
          style={[
            styles.errorMessage,
            typography.caption,
            { color: colors.error },
          ]}
        >
          {errorMessage}
        </Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View
            style={[
              styles.modal,
              {
                backgroundColor: colors.background,
              },
              modalStyle,
            ]}
          >
            {searchable && (
              <TextInput
                style={[
                  styles.searchInput,
                  typography.body1,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Pesquisar..."
                placeholderTextColor={colors.textDisabled}
                value={search}
                onChangeText={setSearch}
              />
            )}

            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              style={[styles.optionsList, optionsListStyle]}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  style={[
                    styles.option,
                    {
                      backgroundColor:
                        item.value === value ? colors.primary : 'transparent',
                      opacity: item.disabled ? 0.5 : 1,
                    },
                    optionStyle,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      typography.body1,
                      {
                        color:
                          item.value === value
                            ? colors.white
                            : item.disabled
                            ? colors.textDisabled
                            : colors.text,
                      },
                      optionTextStyle,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  select: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  selectText: {
    flex: 1,
  },
  errorMessage: {
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    maxHeight: '80%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  searchInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  optionsList: {
    maxHeight: 400,
  },
  option: {
    height: 48,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  optionText: {
    flex: 1,
  },
}); 