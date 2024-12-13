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
import Loader from '../LoadingScreen/AnimatedLoader';
import useConvertToIST from '../TimeConvertot/ConvertUtcToIst';
import { usePermissions } from '../GlobalVariables/PermissionsContext';
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
const {ppmAsstPermissions} = usePermissions()

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
        <Text className="text-blue-700 ml-2 font-semibold">{item.name}</Text>
        <Text className="text-gray-600 ml-2">{item.remarks}</Text>
      </View>
    </View>
  );

  const handleCloseComplaint = () => {
    if (complaint.ask_otp == '1') {
      // Show OTP modal
      setIsOtpMode(true);
    } else {
      // Show confirmation popup using DynamicPopup
      setPopupConfig({
        type: 'alert',
        message: 'Are you sure you want to close this complaint?',
        onOk: async () => {
          try {
            const response = await CloseComplaintApi(complaint);
            if (response.status === 'success') {
              // Show success popup
            
              setPopupConfig({
                type: 'success',
                message: 'Complaint closed successfully!',
                onOk:async ()=>{
                  console.log("ok CLicked on success")
                }
              });
              setPopupVisible(true);


              setTimeout(() => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Service Request' }],
                  })
                );
              }, 3000); // 3000ms = 3 seconds
              
            } else {
              // Show error popup
              setPopupConfig({
                type: 'error',
                message: response.message || 'Failed to close the complaint.',
                onOk: async () => {
                  console.log("OK clicked on error");
                  setPopupVisible(false); // Close the popup when OK is clicked
                }
              });
              setPopupVisible(true);
            }
          } catch (error) {
            // Show error popup for unexpected issues
            setPopupConfig({
              type: 'error',
              message: 'An error occurred. Please try again.',
              onOk:async ()=>{
                console.log("ok CLicked on ")
              }
            });
            setPopupVisible(true);
          }
        },
        onCancel: () => setPopupVisible(false), // Close the popup if canceled
      });
      setPopupVisible(true); // Show the confirmation popup
    }
  };
  const handleOtpSubmit = async () => {
    console.log(otp,'this is otp')
    if (otp.length === 4) {
      setIsOtpMode(false);
    
      try {
        // Start submitting OTP
        console.log('sending complaint')
        const response = await CloseComplaintApi(complaint, otp);
  
        console.log(response,"response for closing complaint")
        if (response.status === 'success') {
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
          setPopupConfig({
            type: 'error',
            message: response.message || 'Failed to close the complaint.',
            onOk: async () => {
              console.log("OK clicked on error");
              setPopupVisible(false); // Close the popup when OK is clicked
            }
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
        <View className="relative bg-white p-4 rounded-lg shadow-md mb-4">
          <Text className="text-lg font-bold text-gray-900">{complaint.com_no}</Text>
          <Text className="text-gray-600  font-bold mt-2">{complaint.description}</Text>
          <View className="flex flex-row mt-2">
          <Text className="text-gray-600 ">Created on : </Text>
          <Text className="text-black font-bold">{useConvertToIST(complaint.created_at)}</Text>
          </View>
          <View className="flex-row items-center justify-between mt-4">
            <View className="flex flex-row mt-2">
          <Text className="text-gray-600 ">Status : </Text>
          <Text className="text-black font-bold">{complaint.status}</Text>
          </View>
            {complaint.status !== 'Closed' && ppmAsstPermissions.some((permission) => permission.includes('U')) && (
              <TouchableOpacity
                className="bg-blue-500 px-4 py-2 rounded-lg"
                onPress={handleCloseComplaint}
              >
                <Text className="text-white font-semibold">Close Complaint</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* OTP Badge */}
          {complaint.ask_otp == 1 && (
         <View className="absolute top-2 right-2">
         <View className="flex-row items-center p-2 gap-1 rounded-full">
           <FontAwesome name="info-circle" size={18} color="red" className="mr-2" />
           <Text className="text-red-500 text-xs font-semibold">OTP Required</Text>
         </View>
       </View>
          )}
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
      {popupVisible && <DynamicPopup {...popupConfig} visible={popupVisible} onClose={() => setPopupVisible(false)} />}
    </KeyboardAvoidingView>
  );
};

export default ComplaintCloseScreen;
