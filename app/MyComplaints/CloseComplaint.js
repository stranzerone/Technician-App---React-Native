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
  Keyboard,
  Image
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
import ImageViewing from "react-native-image-viewing";
const ComplaintCloseScreen = ({ route }) => {
  const { complaint,category,creator } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otp, setOtp] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupConfig, setPopupConfig] = useState({});
  const navigation = useNavigation();
  const { complaintPermissions } = usePermissions();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isImageVisible, setIsImageVisible] = useState(false);
  useEffect(() => {
    fetchComments();
  }, []);





  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
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
    if (complaint.ask_otp === 1) {
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
                onOk:() => setPopupVisible(false)
              });
              setPopupVisible(true);
            }
          } catch (error) {
            setPopupConfig({
              type: 'error',
              message: 'An error occurred. Please try again.',
              onOk:() => setPopupVisible(false)
            });
            setPopupVisible(true);
            navigation.goBack()

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
        console.log(response,"this is resonse for close complaint")
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
            message: <Text className='font-bold'>Incorrect OTP. Please check and try again.</Text>,
          });
          setPopupVisible(true);
        }
      } catch (error) {
        setPopupConfig({
          type: 'error',
          message: 'An error occurred. Please try again.',
          onOk:() => setPopupVisible(false)
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
         <ScrollView>
      <View className="flex-1 bg-gray-50 p-4 pb-48">
        {/* Complaint Details */}
        <View className="relative bg-white p-4 rounded-lg shadow-md mb-4">
        <View>

        {complaint.img_src && (
  <>
    {/* Clickable Image */}
    <TouchableOpacity onPress={() => setIsImageVisible(true)}>
      <Image 
        source={{ uri: complaint.img_src }} 
        style={{ width: '100%', height: 200, resizeMode: 'cover', borderRadius: 10 }} 
      />
    </TouchableOpacity>

    {/* Zoomable Image Modal */}
    {isImageVisible && (
      <ImageViewing
        images={[{ uri: complaint.img_src }]}
        imageIndex={0}
        visible={isImageVisible}
        onRequestClose={() => setIsImageVisible(false)}
      />
    )}
  </>
)}

</View>
<View className="flex flex-row items-center bg-gray-100 p-2 rounded-lg mt-2 justify-between">
<Text className="text-lg py-2 font-bold text-blue-500">{complaint.com_no}</Text>

<Text className=" bg-green-400 text-white font-extrabold px-2 py-1 rounded-full ">{complaint.status}</Text>

</View>



<View>


<View className="flex-row items-center mb-3">
        <Text className="text-base font-semibold text-gray-600 w-24">Category    :</Text>
        <Text className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {category}
        </Text>
      </View>
  { creator &&    <View className="flex-row items-center mb-3">
  <Text className="text-base font-semibold text-gray-600 w-24">Created By :</Text>
  
  <View className="flex-row items-center  bg-gray-600 px-3 py-1 rounded-lg">
    <FontAwesome name="user" size={14} color="white" className="mr-1" />
    <Text className="text-white font-bold text-sm ml-1">{creator}</Text>
  </View>
</View>}

</View>





{complaint && (
  <View className="flex  justify-between items-start mt-2 gap-2">
    
    {/* Display Unit */}
 { complaint?.display_unit_no &&  <View className="flex-row items-center   py-1 rounded-lg">
      {/* <FontAwesome name="map-marker" size={16} color="#D32F2F" className="mr-2" /> */}
      <Text> Display Unit : </Text>
      <Text className="text-black bg-gray-200 px-2 rounded-md ml-1 font-bold">
        {complaint.display_unit_no || 'N/A'}
      </Text>
    </View>
}
    {/* Reference Unit */}
 { complaint?.reference_unit_no  &&  <View className="flex-row items-center  py-1 rounded-lg">
      {/* <FontAwesome name="link" size={16} color="#F57C00" className="mr-2" /> */}
      <Text> Ref. Unit      : </Text>
      <Text className="text-black bg-gray-300 px-2 rounded-md ml-1 font-bold">
        {complaint.reference_unit_no ? 
        complaint.resource.reference_unit_no.slice(0, 10) + "..." : 'N/A'}
      </Text>
    </View>}

  </View>
)}




          <Text className="text-gray-600 bg-gray-100 p-2 rounded-lg font-bold mt-2">{complaint.description}</Text>
          <View className="flex-row mt-2">
            <Text className="text-gray-600">Created on: </Text>
            <Text className="text-black font-bold">{useConvertToIST(complaint.created_at)}</Text>
          </View>
          <View className="flex-row items-center justify-end mt-4">
            {complaint.status !== 'Closed' && complaintPermissions.some((permission) => permission.includes('U')) && (
              <TouchableOpacity
                className="bg-blue-500 px-4 py-2 rounded-lg"
                onPress={handleCloseComplaint}
              >
                <Text className="text-white font-extrabold">Close Complaint</Text>
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
      </ScrollView>
            {/* Comment Input */}
     
      <View style={{ 
  position: 'absolute', 
  bottom: keyboardVisible ? 0 : 55,
    left: 0, 
  right: 0, 
  padding: 8, 
  borderTopWidth: 1, 
  borderColor: '#d1d5db' 
}}>
      <CommentInput
        value={newComment}
        onChangeText={setNewComment}
        onSubmit={handleAddComment}
        isPosting={isPosting}
      />
      </View>

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
