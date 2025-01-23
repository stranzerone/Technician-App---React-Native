import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { GetComplaintComments } from '../../service/RaiseComplaintApis/GetComplaintComments';
import { PostMyComment } from '../../service/RaiseComplaintApis/PostMyComment';
import { CloseComplaintApi } from '../../service/ComplaintApis/CloseComplaintApi';
import { useNavigation, CommonActions } from '@react-navigation/native';
import DynamicPopup from '../DynamivPopUps/DynapicPopUpScreen';
import useConvertToIST from '../TimeConvertot/ConvertUtcToIst';
import { usePermissions } from '../GlobalVariables/PermissionsContext';
import CommentInput from './CommentInput';
import { RenderComment } from './CommentCards';

const ComplaintCloseScreen = ({ route }) => {
  const { complaint } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otp, setOtp] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupConfig, setPopupConfig] = useState({});
  const navigation = useNavigation();
  const { complaintPermissions } = usePermissions();

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

  const handleAddComment = async (data) => {
    if (newComment.trim()) {
      try {
        setIsPosting(true);
        console.log(data,'on handleAddComment')
        await PostMyComment(complaint.id, data.remarks, data.file);
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

  const handleCloseComplaint = () => {
    if (complaint.ask_otp === '1') {
      setIsOtpMode(true);
    } else {
      setPopupConfig({
        type: 'alert',
        message: 'Are you sure you want to close this complaint?',
        onOk: async () => {
          try {
            const response = await CloseComplaintApi(complaint);
            if (response.status === 'success') {
              setPopupConfig({
                type: 'success',
                message: 'Complaint closed successfully!',
              });
              setPopupVisible(true);
              setTimeout(() => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Service Request' }],
                  })
                );
              }, 3000);
            } else {
              setPopupConfig({
                type: 'error',
                message: response.message || 'Failed to close the complaint.',
              });
              setPopupVisible(true);
            }
          } catch (error) {
            setPopupConfig({
              type: 'error',
              message: 'An error occurred. Please try again.',
            });
            setPopupVisible(true);
          }
        },
        onCancel: () => setPopupVisible(false),
      });
      setPopupVisible(true);
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.length === 4) {
      setIsOtpMode(false);
      try {
        const response = await CloseComplaintApi(complaint, otp);
        if (response.status === 'success') {
          setPopupConfig({
            type: 'success',
            message: 'Complaint closed successfully!',
          });
          setPopupVisible(true);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Service Request' }],
            })
          );
        } else {
          setPopupConfig({
            type: 'error',
            message: response.message || 'Failed to close the complaint.',
          });
          setPopupVisible(true);
        }
      } catch (error) {
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
        {/* Complaint Details */}
        <View className="relative bg-white p-4 rounded-lg shadow-md mb-4">
          <Text className="text-lg font-bold text-gray-900">{complaint.com_no}</Text>
          <Text className="text-gray-600 font-bold mt-2">{complaint.description}</Text>
          <View className="flex-row mt-2">
            <Text className="text-gray-600">Created on: </Text>
            <Text className="text-black font-bold">{useConvertToIST(complaint.created_at)}</Text>
          </View>
          <View className="flex-row items-center justify-between mt-4">
            <Text className="text-gray-600">Status: </Text>
            <Text className="text-black font-bold">{complaint.status}</Text>
            {complaint.status !== 'Closed' && complaintPermissions.some((permission) => permission.includes('U')) && (
              <TouchableOpacity
                className="bg-blue-500 px-4 py-2 rounded-lg"
                onPress={handleCloseComplaint}
              >
                <Text className="text-white font-semibold">Close Complaint</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Comments List */}
        <ScrollView className="flex-1">
          <Text className="text-lg font-bold text-gray-900 mb-2">Comments</Text>

          {/* Map over comments instead of FlatList */}
          {comments.length > 0 ? (
            comments.map((item, index) => (
              <View key={index}>
                <RenderComment item={item} />
              </View>
            ))
          ) : (
            <Text className="text-gray-500 text-center mt-4">No comments yet.</Text>
          )}
        </ScrollView>
      </View>

      {/* Comment Input */}
      <CommentInput
        value={newComment}
        onChangeText={setNewComment}
        onSubmit={handleAddComment}
        isPosting={isPosting}
      />

      {/* OTP Modal */}
      <Modal visible={isOtpMode} transparent animationType="slide">
        <View className="flex-1 bg-transparent bg-opacity-20 justify-center items-center">
          <View className="bg-[#094879] w-4/5 p-5 rounded-lg shadow-lg">
            <Text className="text-lg text-white font-bold mb-4">Enter OTP</Text>
            <TextInput
              className="w-full border bg-white border-gray-300 rounded-lg px-3 py-2 mb-4 text-center"
              placeholder="Enter 4-digit OTP"
              keyboardType="numeric"
              maxLength={4}
              value={otp}
              onChangeText={setOtp}
            />
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-gray-500 px-4 py-2 rounded-lg"
                onPress={() => setIsOtpMode(false)}
              >
                <Text className="text-white font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-500 px-4 py-2 rounded-lg"
                onPress={handleOtpSubmit}
              >
                <Text className="text-white font-semibold">Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Popup */}
      {popupVisible && (
        <DynamicPopup
          {...popupConfig}
          onClose={() => setPopupVisible(false)}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ComplaintCloseScreen;
