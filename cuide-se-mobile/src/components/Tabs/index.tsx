import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface TabItem {
  /**
   * Identificador único da aba
   */
  id: string;
  /**
   * Título da aba
   */
  title: string;
  /**
   * Ícone da aba (opcional)
   */
  icon?: React.ReactNode;
  /**
   * Conteúdo da aba
   */
  content: React.ReactNode;
}

export interface TabsProps {
  /**
   * Lista de abas
   */
  tabs: TabItem[];
  /**
   * Índice da aba inicial
   * @default 0
   */
  initialIndex?: number;
  /**
   * Se as abas são scrolláveis
   * @default false
   */
  scrollable?: boolean;
  /**
   * Se as abas são fixas
   * @default false
   */
  fixed?: boolean;
  /**
   * Se as abas são preenchidas
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Estilo personalizado do container
   */
  containerStyle?: ViewStyle;
  /**
   * Estilo personalizado do header
   */
  headerStyle?: ViewStyle;
  /**
   * Estilo personalizado da aba
   */
  tabStyle?: ViewStyle;
  /**
   * Estilo personalizado do texto da aba
   */
  tabTextStyle?: TextStyle;
  /**
   * Estilo personalizado do conteúdo
   */
  contentStyle?: ViewStyle;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  initialIndex = 0,
  scrollable = false,
  fixed = false,
  fullWidth = false,
  containerStyle,
  headerStyle,
  tabStyle,
  tabTextStyle,
  contentStyle,
}) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const { colors, typography, spacing } = useTheme();

  const renderTab = (tab: TabItem, index: number) => {
    const isActive = index === activeIndex;

    return (
      <TouchableOpacity
        key={tab.id}
        onPress={() => setActiveIndex(index)}
        style={[
          styles.tab,
          {
            backgroundColor: isActive ? colors.primary : 'transparent',
            borderBottomColor: isActive ? colors.primary : colors.border,
            flex: fullWidth ? 1 : undefined,
          },
          tabStyle,
        ]}
      >
        {tab.icon}
        <Text
          style={[
            styles.tabText,
            typography.body1,
            {
              color: isActive ? colors.white : colors.text,
              marginLeft: tab.icon ? spacing.small : 0,
            },
            tabTextStyle,
          ]}
        >
          {tab.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const TabHeader = scrollable ? ScrollView : View;

  return (
    <View style={[styles.container, containerStyle]}>
      <TabHeader
        horizontal={scrollable}
        showsHorizontalScrollIndicator={false}
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
            position: fixed ? 'absolute' : 'relative',
            top: fixed ? 0 : undefined,
            left: fixed ? 0 : undefined,
            right: fixed ? 0 : undefined,
            zIndex: fixed ? 1 : undefined,
          },
          headerStyle,
        ]}
      >
        {tabs.map(renderTab)}
      </TabHeader>
      <View
        style={[
          styles.content,
          {
            marginTop: fixed ? 48 : 0,
          },
          contentStyle,
        ]}
      >
        {tabs[activeIndex].content}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
  },
  tabText: {
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
}); 