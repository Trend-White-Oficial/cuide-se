import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ScrollView,
} from 'react-native';
import { THEME_CONFIG } from '../config';

interface Tab {
  key: string;
  title: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabPress: (key: string) => void;
  scrollable?: boolean;
  containerStyle?: ViewStyle;
  tabStyle?: ViewStyle;
  activeTabStyle?: ViewStyle;
  textStyle?: TextStyle;
  activeTextStyle?: TextStyle;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabPress,
  scrollable = false,
  containerStyle,
  tabStyle,
  activeTabStyle,
  textStyle,
  activeTextStyle,
}) => {
  const renderTabs = () => {
    return tabs.map((tab) => (
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
    ));
  };

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.scrollContainer, containerStyle]}
      >
        {renderTabs()}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {renderTabs()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: THEME_CONFIG.backgroundColor,
    borderBottomWidth: 1,
    borderBottomColor: THEME_CONFIG.textColor + '20',
  },
  scrollContainer: {
    backgroundColor: THEME_CONFIG.backgroundColor,
    borderBottomWidth: 1,
    borderBottomColor: THEME_CONFIG.textColor + '20',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: THEME_CONFIG.primaryColor,
  },
  text: {
    fontSize: 14,
    color: THEME_CONFIG.textColor + '80',
    marginTop: 4,
  },
  activeText: {
    color: THEME_CONFIG.primaryColor,
    fontWeight: '600',
  },
}); 