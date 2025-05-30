import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

interface DividerProps {
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({ style }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.disabled },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    height: 1,
    width: '100%',
    marginVertical: 16,
  },
}); 