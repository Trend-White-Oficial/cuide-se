
import { StyleSheet } from 'react-native';
import { Text, View, FlatList } from 'react-native';

// Dados de exemplo para a tela de exploração
const categories = [
  { id: '1', name: 'Estética', icon: '💅' },
  { id: '2', name: 'Massagem', icon: '💆' },
  { id: '3', name: 'Cabelo', icon: '💇' },
  { id: '4', name: 'Bem-estar', icon: '🧘' },
  { id: '5', name: 'Nutrição', icon: '🥗' },
];

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Serviços</Text>
      
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <Text style={styles.categoryIcon}>{item.icon}</Text>
            <Text style={styles.categoryName}>{item.name}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    paddingVertical: 10,
  },
  categoryItem: {
    flex: 1,
    margin: 8,
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
  },
});
