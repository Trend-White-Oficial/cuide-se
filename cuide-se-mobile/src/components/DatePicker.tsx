import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { THEME_CONFIG } from '../config';
import { Icon } from './Icon';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  mode?: 'date' | 'time' | 'datetime';
  format?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  containerStyle?: ViewStyle;
  pickerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  placeholderStyle?: TextStyle;
  errorStyle?: TextStyle;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Selecione uma data',
  disabled = false,
  error,
  mode = 'date',
  format = 'dd/MM/yyyy',
  minimumDate,
  maximumDate,
  containerStyle,
  pickerStyle,
  labelStyle,
  placeholderStyle,
  errorStyle,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    switch (mode) {
      case 'date':
        return `${day}/${month}/${year}`;
      case 'time':
        return `${hours}:${minutes}`;
      case 'datetime':
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      default:
        return `${day}/${month}/${year}`;
    }
  };

  const handleChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      onChange(selectedDate);
      if (Platform.OS === 'ios') {
        setModalVisible(false);
      }
    }
  };

  const renderPicker = () => {
    if (Platform.OS === 'ios') {
      return (
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {label || 'Selecione uma data'}
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Icon
                    name="close"
                    size={24}
                    color={THEME_CONFIG.textColor}
                  />
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={value}
                mode={mode}
                display="spinner"
                onChange={handleChange}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                style={styles.picker}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      );
    }

    return showPicker ? (
      <DateTimePicker
        value={value}
        mode={mode}
        display="default"
        onChange={handleChange}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
      />
    ) : null;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        onPress={() => {
          if (!disabled) {
            if (Platform.OS === 'android') {
              setShowPicker(true);
            } else {
              setModalVisible(true);
            }
          }
        }}
        style={[
          styles.picker,
          {
            borderColor: error
              ? THEME_CONFIG.errorColor
              : THEME_CONFIG.textColor + '40',
            opacity: disabled ? 0.5 : 1,
          },
          pickerStyle,
        ]}
        disabled={disabled}
      >
        <Text
          style={[
            styles.text,
            !value && styles.placeholder,
            placeholderStyle,
          ]}
        >
          {value ? formatDate(value) : placeholder}
        </Text>
        <Icon
          name="calendar"
          size={20}
          color={THEME_CONFIG.textColor}
        />
      </TouchableOpacity>
      {error && (
        <Text style={[styles.error, errorStyle]}>
          {error}
        </Text>
      )}
      {renderPicker()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: THEME_CONFIG.textColor,
    marginBottom: 8,
    fontWeight: '500',
  },
  picker: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME_CONFIG.backgroundColor,
  },
  text: {
    fontSize: 16,
    color: THEME_CONFIG.textColor,
  },
  placeholder: {
    color: THEME_CONFIG.textColor + '80',
  },
  error: {
    color: THEME_CONFIG.errorColor,
    fontSize: 14,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: THEME_CONFIG.backgroundColor,
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME_CONFIG.textColor + '20',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME_CONFIG.textColor,
  },
  closeButton: {
    padding: 4,
  },
  picker: {
    width: '100%',
  },
}); 