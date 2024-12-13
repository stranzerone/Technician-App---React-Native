import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
} from 'react-native';
import { WorkOrderAddComments } from '../../service/CommentServices/WorkOrderCommentsAddApi';
import { WorkOrderComments } from "../../service/CommentServices/WorkOrderFetchCommentsApi";
import CommentCard from './WoCommentsCards';

const CommentsPage = ({ WoUuId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  // Function to fetch comments
  const loadComments = async () => {
    setLoading(true);
    try {
      const response = await WorkOrderComments(WoUuId);
      setComments(response);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();

    // Handle keyboard events
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', (e) =>
      setKeyboardOffset(e.endCoordinates.height)
    );
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardOffset(0)
    );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await WorkOrderAddComments({ newComment }, WoUuId);
      console.log(response, 'console at ui');

      if (response) {
        // Fetch comments again to refresh the list
        await loadComments();
        // Clear the input field
        setNewComment('');
      }
    } catch (error) {
      console.error('Error sending comment:', error);
    }
  };

  const renderComment = ({ item }) => (
    <CommentCard comment={item} /> // Use the CommentCard component here
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1996D3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error fetching comments: {error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderComment}
        contentContainerStyle={styles.commentsList}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text style={styles.emptyText}>No comments available</Text>
          </View>
        }
      />
<View
  style={[
    styles.commentInputContainer,
    keyboardOffset > 0 ? { marginBottom: keyboardOffset  } : {}, // Apply margin only when the keyboard is open
  ]}
>
  <TextInput
    style={styles.input}
    placeholder="Write a comment..."
    value={newComment}
    onChangeText={setNewComment}
    multiline
    numberOfLines={3}
    maxLength={200}
  />
  <TouchableOpacity style={styles.button} onPress={handleCommentSubmit}>
    <Text style={styles.buttonText}>Send</Text>
  </TouchableOpacity>
</View>


    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  commentsList: {
    paddingBottom: 16,
  },
  emptyList: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  commentInputContainer: {
    paddingBottom:110,
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
   
  },
  input: {
   
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    height:40,
    marginRight: 10,
    backgroundColor: '#f5f5f5',
    textAlignVertical: 'top',
  },
  button: {
  
    backgroundColor: '#074B7C',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CommentsPage;
