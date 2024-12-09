// CommentCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { format } from 'date-fns'; // Importing date-fns for date formatting

const CommentCard = ({ comment }) => {
    const formattedDateTime = format(new Date(comment.created_at), 'MMMM d, HH:mm'); 
  return (
    <View style={styles.commentCard}>
      <View style={styles.commentHeader}>
        <FontAwesome name="user-circle" size={20} color="#074B7C" />
        <Text style={styles.userId}>{comment.created_by}</Text>
      </View>
      <Text style={styles.commentText}>{comment.comment}</Text>
      <Text style={styles.commentTime}>{formattedDateTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  commentCard: {
    backgroundColor: '#f9f9f9', // Lighter background color for better contrast
    borderRadius: 8,
    padding: 12, // Reduced padding for a smaller card size
    marginBottom: 10, // Reduced margin for less space between cards
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6, // Reduced margin
  },
  userId: {
    marginLeft: 6, // Adjusted margin for a better fit
    fontSize: 14, // Slightly smaller font size
    color: '#074B7C',
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 14, // Slightly smaller font size
    color: '#333',
    marginBottom: 6, // Reduced margin
  },
  commentTime: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
});

export default CommentCard;
