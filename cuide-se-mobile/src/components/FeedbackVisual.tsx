import React from 'react';
import { View, Text, ActivityIndicator, Animated } from 'react-native';

export const SkeletonLoading = () => (
  <View style={{ padding: 20 }}>
    <ActivityIndicator size="large" color="#0000ff" />
    <Text>Carregando...</Text>
  </View>
);

export const SmoothTransition = ({ children }: { children: React.ReactNode }) => {
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {children}
    </Animated.View>
  );
};

export const MicroInteraction = ({ onPress }: { onPress: () => void }) => (
  <View onTouchEnd={onPress} style={{ padding: 10, backgroundColor: '#e0e0e0' }}>
    <Text>Clique para interagir</Text>
  </View>
); 