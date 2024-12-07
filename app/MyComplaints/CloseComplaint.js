import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { GetComplaintComments } from '../../service/RaiseComplaintApis/GetComplaintComments';
import { PostMyComment } from '../../service/RaiseComplaintApis/PostMyComment';
import { CloseComplaintApi } from '../../service/ComplaintApis/CloseComplaintApi';
import { useNavigation, CommonActions } from '@react-navigation/native';
import DynamicPopup from '../DynamivPopUps/DynapicPopUpScreen';

const ComplaintCloseScreen = ({ route }) => {
  const { complaint } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otp, setOtp] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false); // For controlling popup visibility
  const [popupConfig, setPopupConfig] = useState({}); // For configuring the popup
  const navigation = useNavigation();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const fetchedComments = await GetComplaintComments(complaint.id);
      setComments(fetchedComments);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch comments. Please try again.');
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        setIsPosting(true);
        await PostMyComment(complaint.id, newComment);
        fetchComments();
        setNewComment('');
      } catch (error) {
        Alert.alert('Error', 'Failed to post comment. Please try again.');
      } finally {
        setIsPosting(false);
      }
    } else {
      Alert.alert('Empty Comment', 'Please enter a comment before submitting.');
    }
  };

  const renderComment = ({ item }) => (
    <View className="flex-row p-3 bg-white shadow-sm rounded-lg mb-3">
      <FontAwesome name="comment" size={18} color="#1996D3" className="mr-2" />
      <View>
        <Text className="text-blue-700 font-semibold">{item.name}</Text>
        <Text className="text-gray-600">{item.remarks}</Text>
      </View>
    </View>
  );

  const handleCloseComplaint = () => {
    setIsOtpMode(true);
  };

  const handleOtpSubmit = async () => {
    if (otp.length === 4) {
      setIsOtpMode(false);
      try {
        const response = await CloseComplaintApi(complaint, otp);
        if (response.status === 'success') {
          // Show success popup
          setPopupConfig({
            type: 'success',
            message: 'Complaint closed successfully!',
          });
          setPopupVisible(true);

          // Navigate to "Service Request" without back navigation
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Service Request' }],
            })
          );
        } else {
          // Show error popup
          setPopupConfig({
            type: 'error',
            message:response.message,
          });
          setPopupVisible(true);
        }
      } catch (error) {
        // Show error popup for unexpected issues
        setPopupConfig({
          type: 'error',
          message: 'An error occurred. Please try again.',
        });
        setPopupVisible(true);
      }
    } else {
      Alert.alert('Error', 'Please enter a valid 4-digit OTP.');
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 bg-gray-50 p-4">
        <View className="bg-white p-4 rounded-lg shadow-md mb-4">
          <Text className="text-lg font-bold text-gray-900">{complaint.name}</Text>
          <Text className="text-gray-600 mt-2">{complaint.description}</Text>
          <Text className="text-gray-400 mt-2">Created on: {complaint.createdDate}</Text>
          <View className="flex-row items-center justify-between mt-4">
            <Text className="text-gray-700 font-semibold">Status: {complaint.status}</Text>
            {complaint.status !== 'Closed' && (
              <TouchableOpacity
                className="bg-blue-500 px-4 py-2 rounded-lg"
                onPress={handleCloseComplaint}
              >
                <Text className="text-white font-semibold">Close Complaint</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900 mb-4">Comments</Text>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderComment}
            ListEmptyComponent={
              <Text className="text-gray-500 text-center mt-4">No comments yet.</Text>
            }
          />
        </View>
      </View>

      <View className="flex-row items-center mb-[50] bg-gray-100 p-4">
        <TextInput
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
          placeholder="Add a new comment"
          value={newComment}
          onChangeText={setNewComment}
        />
        {isPosting ? (
          <ActivityIndicator size="small" color="#fff" className="ml-2" />
        ) : (
          <TouchableOpacity
            className="ml-2 bg-blue-500 px-4 py-2 rounded-lg"
            onPress={handleAddComment}
          >
            <Text className="text-white font-semibold">Post</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* OTP Modal */}
      <Modal visible={isOtpMode} transparent animationType="slide">
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
          <View className="bg-white w-4/5 p-5 rounded-lg shadow-lg">
            <Text className="text-lg font-bold mb-4">Enter OTP</Text>
            <TextInput
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 text-center"
              placeholder="Enter 4-digit OTP"
              keyboardType="numeric"
              maxLength={4}
              value={otp}
              onChangeText={setOtp}
            />
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-blue-500 flex-1 mr-2 py-2 rounded-lg"
                onPress={handleOtpSubmit}
              >
                <Text className="text-white text-center font-semibold">Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-500 flex-1 ml-2 py-2 rounded-lg"
                onPress={() => setIsOtpMode(false)}
              >
                <Text className="text-white text-center font-semibold">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Dynamic Popup */}
      {popupVisible && (
        <DynamicPopup
          type={popupConfig.type} // success, error, warning, etc.
          message={popupConfig.message}
          onClose={() => setPopupVisible(false)} // Close popup when dismissed
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ComplaintCloseScreen;
