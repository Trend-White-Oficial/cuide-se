import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from './Text';
import { Card } from './Card';
import { Avatar } from './Avatar';
import { theme } from '../theme';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReviewCardProps {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isEditable?: boolean;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  id,
  userName,
  userAvatar,
  rating,
  comment,
  date,
  onPress,
  onEdit,
  onDelete,
  isEditable = false,
}) => {
  // Formata a data para o padrão brasileiro
  const formattedDate = format(new Date(date), "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  // Renderiza as estrelas baseado na avaliação
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MaterialIcons
          key={i}
          name={i <= rating ? 'star' : 'star-border'}
          size={16}
          color={i <= rating ? theme.colors.warning : theme.colors.textSecondary}
          style={styles.star}
        />
      );
    }
    return stars;
  };

  return (
    <Card style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.content}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Avatar
              size={40}
              source={userAvatar ? { uri: userAvatar } : undefined}
              style={styles.avatar}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.date}>{formattedDate}</Text>
            </View>
          </View>

          {isEditable && (
            <View style={styles.actions}>
              {onEdit && (
                <TouchableOpacity
                  onPress={onEdit}
                  style={styles.actionButton}
                >
                  <MaterialIcons
                    name="edit"
                    size={20}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>
              )}
              {onDelete && (
                <TouchableOpacity
                  onPress={onDelete}
                  style={styles.actionButton}
                >
                  <MaterialIcons
                    name="delete"
                    size={20}
                    color={theme.colors.error}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <View style={styles.ratingContainer}>
          {renderStars()}
        </View>

        <Text style={styles.comment}>{comment}</Text>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  star: {
    marginRight: 4,
  },
  comment: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
}); 