import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ViewStyle,
  ListRenderItem,
  ListRenderItemInfo,
  RefreshControl,
} from 'react-native';
import { THEME_CONFIG } from '../config';
import { EmptyState } from './EmptyState';
import { Loading } from './Loading';
import { ErrorMessage } from './ErrorMessage';

interface ListProps<T> {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T) => string;
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
  emptyMessage?: string;
  containerStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  itemSeparator?: boolean;
  refreshing?: boolean;
}

export function List<T>({
  data,
  renderItem,
  keyExtractor,
  loading = false,
  error,
  onRefresh,
  onEndReached,
  onEndReachedThreshold = 0.5,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
  emptyMessage = 'Nenhum item encontrado',
  containerStyle,
  contentContainerStyle,
  itemSeparator = true,
  refreshing = false,
}: ListProps<T>) {
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={onRefresh}
      />
    );
  }

  const renderSeparator = () => {
    if (!itemSeparator) return null;
    return (
      <View
        style={{
          height: 1,
          backgroundColor: THEME_CONFIG.textColor + '20',
        }}
      />
    );
  };

  const renderEmpty = () => {
    if (ListEmptyComponent) {
      return ListEmptyComponent;
    }
    return (
      <EmptyState
        message={emptyMessage}
      />
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={renderSeparator}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={renderEmpty}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[THEME_CONFIG.primaryColor]}
            tintColor={THEME_CONFIG.primaryColor}
          />
        ) : undefined
      }
      style={[styles.container, containerStyle]}
      contentContainerStyle={[
        styles.contentContainer,
        contentContainerStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_CONFIG.backgroundColor,
  },
  contentContainer: {
    flexGrow: 1,
  },
}); 