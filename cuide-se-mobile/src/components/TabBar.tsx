import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { THEME_CONFIG } from '../config';

interface TabBarProps {
  tabs: {
    key: string;
    title: string;
    icon?: React.ReactNode;
  }[];
  activeTab: string;
  onTabPress: (key: string) => void;
  containerStyle?: ViewStyle;
  tabStyle?: ViewStyle;
  activeTabStyle?: ViewStyle;
  textStyle?: TextStyle;
  activeTextStyle?: TextStyle;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabPress,
  containerStyle,
  tabStyle,
  activeTabStyle,
  textStyle,
  activeTextStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => onTabPress(tab.key)}
          style={[
            styles.tab,
            tabStyle,
            activeTab === tab.key && styles.activeTab,
            activeTab === tab.key && activeTabStyle,
          ]}
        >
          {tab.icon}
          <Text
            style={[
              styles.text,
              textStyle,
              activeTab === tab.key && styles.activeText,
              activeTab === tab.key && activeTextStyle,
            ]}
          >
            {tab.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: THEME_CONFIG.backgroundColor,
    borderTopWidth: 1,
    borderTopColor: THEME_CONFIG.textColor + '20',
  },
  tab: {
    flex: 1,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: THEME_CONFIG.primaryColor,
  },
  text: {
    fontSize: 12,
    color: THEME_CONFIG.textColor + '80',
    marginTop: 4,
  },
  activeText: {
    color: THEME_CONFIG.primaryColor,
    fontWeight: '600',
  },
}); 