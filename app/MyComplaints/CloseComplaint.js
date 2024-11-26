import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Button, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
// import { getOtp, postComment, closeComplaint } from '../api/complaints';
import { GetComplaintComments } from '../../service/RaiseComplaintApis/GetComplaintComments';
import { PostMyComment } from '../../service/RaiseComplaintApis/PostMyComment';

const ComplaintCloseScreen = ({ route }) => {
  const { complaint } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [status, setStatus] = useState(complaint.status);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otp, setOtp] = useState('');
  const [isPosting, setIsPosting] = useState(false); // State to track loading

  useEffect(() => {
    // Fetch comments when the component mounts
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const fetchedComments = await GetComplaintComments(complaint.id);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      Alert.alert('Error', 'Failed to fetch comments. Please try again.');
    }
  };

  const fetchOtp = async () => {
    try {
    //   await getOtp(complaint.id); // Fetch OTP from API
      Alert.alert('OTP Sent', 'An OTP has been sent to your registered contact.');
      setIsOtpMode(true);
    } catch (error) {
      console.error('Error generating OTP:', error);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        setIsPosting(true); // Set loading to true
        // Post the new comment
        await PostMyComment(complaint.id, newComment); // Send comment to API

        // Refresh the comments list after posting a new comment
        fetchComments();
        setNewComment(''); // Clear the input field after posting
      } catch (error) {
        console.error('Error posting comment:', error);
        Alert.alert('Error', 'Failed to post comment. Please try again.');
      } finally {
        setIsPosting(false); // Set loading to false after posting
      }
    } else {
      Alert.alert('Empty Comment', 'Please enter a comment before submitting.');
    }
  };

  const handleCloseComplaint = async () => {
    if (isOtpMode) {
      try {
        const result = await closeComplaint(complaint.id, otp); // Send OTP to close complaint
        if (result.success) {
          Alert.alert('Complaint Closed', 'Complaint has been successfully closed.');
          setStatus('Closed');
          setComments([...comments, { id: comments.length + 1, text: 'Complaint closed.', username: 'System' }]);
          setIsOtpMode(false);
          setOtp('');
        } else {
          Alert.alert('Invalid OTP', result.message || 'Please enter the correct OTP.');
        }
      } catch (error) {
        console.error('Error closing complaint:', error);
        Alert.alert('Error', 'Failed to close complaint. Please try again.');
      }
    } else {
      await fetchOtp();
    }
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <FontAwesome name="comment" size={16} color="#074B7C" style={styles.commentIcon} />
      <View>
        <Text style={styles.usernameText}>{item.name}</Text>
        <Text style={styles.commentText}>{item.remarks}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.contentContainer}>
        {/* Main Complaint Info */}
        <View style={styles.mainInfo}>
          <Text style={styles.complaintTitle}>{complaint.name}</Text>
          <Text style={styles.description}>{complaint.description}</Text>
          <Text style={styles.createdDate}>Created on: {complaint.created_at}</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.status}>Status: {status}</Text>
            {status !== 'Closed' && (
              <TouchableOpacity style={styles.closeButton} onPress={handleCloseComplaint}>
                <Text style={styles.closeButtonText}>Close Complaint</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* OTP Input */}
        {isOtpMode && (
          <View style={styles.otpContainer}>
            <TextInput
              style={styles.otpInput}
              placeholder="Enter OTP"
              keyboardType="numeric"
              value={otp}
              onChangeText={setOtp}
            />
            <Button title="Submit OTP" onPress={handleCloseComplaint} color="#074B7C" />
          </View>
        )}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Comments Section */}
        <Text style={styles.sectionTitle}>Comments</Text>
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderComment}
          style={styles.commentsList}
          ListEmptyComponent={<Text style={styles.noComments}>No comments yet.</Text>}
        />
      </View>

      {/* Add New Comment */}
      <View style={styles.addCommentContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a new comment"
          value={newComment}
          onChangeText={setNewComment}
        />
        {isPosting ? (
          <ActivityIndicator size="small" color="#fff" style={styles.loadingButton} />
        ) : (
          <TouchableOpacity style={styles.postButton} onPress={handleAddComment}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    paddingBottom: 70,
  },
  mainInfo: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  complaintTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#074B7C',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  createdDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#074B7C',
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#F44336',
    borderRadius: 4,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#074B7C',
    marginVertical: 10,
  },
  commentsList: {
    flexGrow: 0,
    marginBottom: 20,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentIcon: {
    marginRight: 8,
  },
  usernameText: {
    fontSize: 14,
    color: '#333',
  },
  commentText: {
  

    fontSize: 14,
    fontWeight: 'bold',
    color: '#074B7C',
  },
  noComments: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginVertical: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  addCommentContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#333',
  },
  postButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#074B7C',
    borderRadius: 4,
    marginLeft: 12,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default ComplaintCloseScreen;
