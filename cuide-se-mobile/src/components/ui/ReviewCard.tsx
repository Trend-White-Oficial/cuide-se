import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Card, Text, Avatar, useTheme } from 'react-native-paper';
import { Review } from '../../types';
import { formatDateTime } from '../../utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ReviewCardProps {
  review: Review;
  clientName: string;
  clientAvatar?: string;
  style?: ViewStyle;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  clientName,
  clientAvatar,
  style,
}) => {
  const theme = useTheme();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Icon
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={16}
        color="#FFD700"
        style={styles.star}
      />
    ));
  };

  return (
    <Card style={[styles.card, style]}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.clientInfo}>
            <Avatar.Image
              source={{ uri: clientAvatar || 'https://via.placeholder.com/40' }}
              size={40}
              style={styles.avatar}
            />
            <View style={styles.clientDetails}>
              <Text style={styles.clientName}>{clientName}</Text>
              <Text style={styles.date}>
                {formatDateTime(review.createdAt)}
              </Text>
            </View>
          </View>
          <View style={styles.rating}>
            {renderStars(review.rating)}
          </View>
        </View>
        <Text style={styles.comment}>{review.comment}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    marginRight: 12,
  },
  clientDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginLeft: 2,
  },
  comment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
}); 