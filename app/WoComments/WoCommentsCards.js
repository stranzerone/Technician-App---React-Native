import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux'; // Importing useSelector from react-redux
import { FontAwesome } from '@expo/vector-icons';
import { format } from 'date-fns'; // Importing date-fns for date formatting

const CommentCard = ({ comment }) => {
  const users = useSelector((state) => state.users.data); // Assuming `users` slice stores user data
  // Find the user from Redux based on the `created_by` ID
const user = users.length > 1 && Array.isArray(users[1]) 
  ? users[1].find((u) => u.user_id === comment.created_by) 
  : null;
  const userName = user? user.name : 'Unknown User'; // Fallback to 'Unknown User' if not found
  const formattedDateTime = format(new Date(comment.created_at), 'MMMM d, HH:mm');

  return (
    <View style={styles.commentCard}>
      <View style={styles.commentHeader}>
        <FontAwesome name="user-circle" size={20} color="#074B7C" />
        <Text style={styles.userId}>{userName}</Text>
      </View>
      <Text style={styles.commentText}>{comment.comment}</Text>
      <Text style={styles.commentTime}>{formattedDateTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  commentCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  userId: {
    marginLeft: 6,
    fontSize: 14,
    color: '#074B7C',
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  commentTime: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
});

export default CommentCard;
