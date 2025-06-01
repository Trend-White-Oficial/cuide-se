import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { THEME_CONFIG } from '../../config';
import { Icon } from '../Icon';

export const TabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title || route.name;
        const isFocused = state.index === index;

        const icon = options.tabBarIcon
          ? options.tabBarIcon({ focused: isFocused, color: '', size: 0 })
          : null;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tab}
          >
            {icon || (
              <Icon
                name={route.name.toLowerCase()}
                size={24}
                color={isFocused ? THEME_CONFIG.primaryColor : THEME_CONFIG.textColor + '80'}
              />
            )}
            <Text
              style={[
                styles.label,
                isFocused && styles.labelFocused,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: THEME_CONFIG.backgroundColor,
    borderTopWidth: 1,
    borderTopColor: THEME_CONFIG.textColor + '20',
    height: 56,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    color: THEME_CONFIG.textColor + '80',
    marginTop: 4,
  },
  labelFocused: {
    color: THEME_CONFIG.primaryColor,
    fontWeight: '600',
  },
}); 