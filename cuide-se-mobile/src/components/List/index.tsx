import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ViewStyle,
  FlatListProps,
  ListRenderItem,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface ListProps<T> extends Omit<FlatListProps<T>, 'renderItem'> {
  /**
   * Função para renderizar cada item da lista
   */
  renderItem: ListRenderItem<T>;
  /**
   * Se a lista tem divisores entre os itens
   * @default true
   */
  withDividers?: boolean;
  /**
   * Se a lista tem padding
   * @default true
   */
  withPadding?: boolean;
  /**
   * Estilo personalizado do container
   */
  containerStyle?: ViewStyle;
  /**
   * Estilo personalizado do conteúdo
   */
  contentStyle?: ViewStyle;
}

export const List = <T extends any>({
  renderItem,
  withDividers = true,
  withPadding = true,
  containerStyle,
  contentStyle,
  ...rest
}: ListProps<T>) => {
  const { colors, spacing } = useTheme();

  const renderItemWithDivider: ListRenderItem<T> = (info) => {
    const item = renderItem(info);
    if (!withDividers || info.index === rest.data?.length - 1) {
      return item;
    }

    return (
      <View>
        {item}
        <View
          style={[
            styles.divider,
            { backgroundColor: colors.border },
          ]}
        />
      </View>
    );
  };

  return (
    <FlatList
      {...rest}
      renderItem={renderItemWithDivider}
      contentContainerStyle={[
        withPadding && styles.content,
        contentStyle,
      ]}
      style={[
        styles.container,
        { backgroundColor: colors.background },
        containerStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
}); 