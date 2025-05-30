import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface RatingProps {
  value: number;
  maxValue?: number;
  size?: number;
  showValue?: boolean;
  style?: ViewStyle;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  maxValue = 5,
  size = 20,
  showValue = true,
  style,
}) => {
  const theme = useTheme();

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(value);
    const hasHalfStar = value % 1 >= 0.5;

    for (let i = 0; i < maxValue; i++) {
      if (i < fullStars) {
        stars.push(
          <Icon
            key={i}
            name="star"
            size={size}
            color={theme.colors.primary}
            style={styles.star}
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Icon
            key={i}
            name="star-half"
            size={size}
            color={theme.colors.primary}
            style={styles.star}
          />
        );
      } else {
        stars.push(
          <Icon
            key={i}
            name="star-outline"
            size={size}
            color={theme.colors.primary}
            style={styles.star}
          />
        );
      }
    }

    return stars;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.starsContainer}>
        {renderStars()}
      </View>
      {showValue && (
        <Text style={[styles.value, { color: theme.colors.primary }]}>
          {value.toFixed(1)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 2,
  },
  value: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 