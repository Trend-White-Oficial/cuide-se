import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { THEME_CONFIG } from '../../config';
import { Icon } from '../Icon';
import { useTheme } from '../../hooks/useTheme';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  elevation?: number;
  transparent?: boolean;
  statusBarColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content';
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  rightComponent,
  leftComponent,
  containerStyle,
  titleStyle,
  elevation = 4,
  transparent = false,
  statusBarColor,
  statusBarStyle = 'dark-content',
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();

  const backgroundColor = transparent ? 'transparent' : theme.colors.background;
  const statusBarBackgroundColor = statusBarColor || backgroundColor;

  return (
    <>
      <StatusBar
        backgroundColor={statusBarBackgroundColor}
        barStyle={statusBarStyle}
      />
      <View
        style={[
          styles.container,
          {
            backgroundColor,
            elevation: transparent ? 0 : elevation,
            borderBottomWidth: transparent ? 0 : 1,
          },
          containerStyle,
        ]}
      >
        <View style={styles.leftContainer}>
          {leftComponent || (showBackButton && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon
                name="back"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          ))}
        </View>

        {title && (
          <Text
            style={[
              styles.title,
              { color: theme.colors.text },
              titleStyle,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}

        <View style={styles.rightContainer}>
          {rightComponent}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'ios' ? 88 : 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 32 : 0,
    borderBottomColor: THEME_CONFIG.textColor + '20',
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 4,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 16,
  },
}); 