import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  rightAction,
  style,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <Appbar.Header style={[styles.header, style]}>
      {showBackButton && (
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color={theme.colors.primary}
        />
      )}
      <Appbar.Content
        title={title}
        titleStyle={styles.title}
      />
      {rightAction && (
        <Appbar.Action
          icon={rightAction.icon}
          onPress={rightAction.onPress}
          color={theme.colors.primary}
        />
      )}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 0,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
}); 