import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';

export const ResponsiveLayout = ({ children }: { children: React.ReactNode }) => {
  const { width } = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: width < 600 ? 10 : 20,
    },
    text: {
      fontSize: width < 600 ? 16 : 20,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Layout Responsivo</Text>
      {children}
    </View>
  );
}; 