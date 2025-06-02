import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Accessibility = () => {
  const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: '#ffffff',
    },
    text: {
      fontSize: 18,
      color: '#000000',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Componente de Acessibilidade</Text>
    </View>
  );
}; 