import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, Text, Image, Alert, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

const CommentInput = ({ value, onChangeText, onSubmit, isPosting }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false); // State to manage the modal visibility

  // Function to resize and reduce image quality
  const resizeImage = async (uri) => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // Resize the image to a width of 800px (adjust as needed)
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG } // Reduce quality to 50%
      );
      return manipResult.uri; // Return the URI of the resized image
    } catch (error) {
      Alert.alert('Error', 'Failed to resize the image.');
      return null;
    }
  };

  // Function to convert the resized image into Base64
  const convertToBase64 = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      // Convert blob to base64
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result.split(',')[1]); // Get only the base64 part
        reader.onerror = reject;
        reader.readAsDataURL(blob); // Convert blob to base64
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to process the image. Please try again.');
      return null;
    }
  };

  const handleImageAttachment = () => {
    launchImageLibrary(
      {
        mediaType: 'photo', // 'photo' for images, 'video' for videos
        quality: 1,
      },
      async (response) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert('Error', 'Failed to pick an image.');
          return;
        }

        const resizedUri = await resizeImage(response.assets[0].uri);
        if (resizedUri) {
          setImagePreview(resizedUri);

          const base64 = await convertToBase64(resizedUri);
          if (base64) {
            console.log("Reduced Base64 Image:", base64);
            setImageBase64(base64);
          }
        }
      }
    );
  };

  const handleCaptureImage = () => {
    launchCamera(
      {
        mediaType: 'photo', // 'photo' for images, 'video' for videos
        quality: 1,
      },
      async (response) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert('Error', 'Failed to capture an image.');
          return;
        }

        const resizedUri = await resizeImage(response.assets[0].uri);
        if (resizedUri) {
          setImagePreview(resizedUri);

          const base64 = await convertToBase64(resizedUri);
          if (base64) {
            console.log("Reduced Base64 Image:", base64);
            setImageBase64(base64);
          }
        }
      }
    );
  };

  const handleSubmit = () => {
    const object = {
      remarks: value,
      file: imageBase64,
    };
    onSubmit(object);
  };

  return (
    <View className="flex-row items-center mb-14 bg-gray-100 p-2 rounded-lg border border-gray-300">
      {/* Image Preview */}
      {imagePreview && (
        <TouchableOpacity onPress={() => setIsPreviewVisible(true)} className="mr-2">
          <Image
            source={{ uri: imagePreview }}
            className="w-12 h-12 rounded-lg"
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}

      {/* Text Input */}
      <TextInput
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
        placeholder="Add a new comment"
        value={value}
        onChangeText={onChangeText}
      />

      {/* Action Buttons */}
      <View className="flex-row items-center ml-2">
        {/* Attach Image Icon */}
        <TouchableOpacity onPress={handleImageAttachment} className="mr-2">
          <FontAwesome name="paperclip" size={24} color="#1996D3" />
        </TouchableOpacity>

        {/* Capture Image Icon */}
        <TouchableOpacity onPress={handleCaptureImage} className="mr-2">
          <FontAwesome name="camera" size={24} color="#1996D3" />
        </TouchableOpacity>

        {/* Submit Button */}
        {isPosting ? (
          <ActivityIndicator size="small" color="#fff" className="ml-2" />
        ) : (
          <TouchableOpacity
            className="bg-blue-500 px-4 py-2 rounded-lg"
            onPress={handleSubmit}
          >
            <Text className="text-white font-semibold">Post</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Image Preview Modal */}
      {isPreviewVisible && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={isPreviewVisible}
          onRequestClose={() => setIsPreviewVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsPreviewVisible(false)}>
            <View
              className="flex-1 justify-center items-center bg-black bg-opacity-50"
              style={{ flex: 1 }}
            >
              <Image
                source={{ uri: imagePreview }}
                className="w-80 h-80"
                resizeMode="contain"
              />
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};

export default CommentInput;
