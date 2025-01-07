import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert, Modal } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { uploadImageToServer } from "../../service/ImageUploads/ConvertImageToUrlApi";
import styles from "../BuggyListCardComponets/InputFieldStyleSheet";
import RemarkCard from "./RemarkCard";
import Icon from 'react-native-vector-icons/FontAwesome';

const FileCard = ({ item,onUpdate ,editable}) => {
  const [capturedImage, setCapturedImage] = useState(item.result || null); // Use item.result as initial value
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleCaptureImage = async () => {
    if (!hasPermission) {
      Alert.alert("Permission Required", "Camera permissions are required to capture an image.");
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaType,
        allowsEditing: false,
        quality: 0.6,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        const imageUri = result.assets[0].uri;

        const fileData = {
          uri: imageUri,
          fileName: `photo_${Date.now()}.jpeg`,
          mimeType: "image/jpeg",
        };

        // Upload image to the server
        const uploadResponse = await uploadImageToServer(fileData, item.id, item.ref_uuid);

        onUpdate()
        // Update capturedImage with uploaded image URI
        setCapturedImage(imageUri);
      }
    } catch (error) {
      console.error("Error capturing image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      className={`shadow-md rounded-lg p-4 mb-4 `}
      
      style={[styles.inputContainer, item.result || capturedImage ? { backgroundColor: "#DFF6DD" } : null,]}

   >
      <Text style={styles.title} className="text-lg font-semibold text-[#074B7C]">{item.title}</Text>

      <View className="flex flex-row">
        {/* Image Preview Section */}
        <View className="w-1/2 flex items-center justify-center">
          {loading ? (
            <Text className="text-gray-500">Loading...</Text>
          ) : capturedImage ? (
            <TouchableOpacity disabled={!editable} onPress={() => setModalVisible(true)}>
              <Image style={styles.imageAttachmentContainer} source={{ uri: capturedImage }} className="w-32 h-32 rounded-md" />
            </TouchableOpacity>
          ) : (
            <View className="w-32 h-32 border border-blue-900 bg-gray-200 rounded-md flex items-center justify-center">
              <Ionicons name="image-outline" size={40} color="#CED4DA" />
              <Text className="text-gray-500 text-xs mt-2">No image selected</Text>
            </View>
          )}
        </View>

        {/* Capture Image Section */}
        <View className="w-1/2 flex items-center justify-center">
          <TouchableOpacity
          style={styles.cameraButton}
            className="bg-blue-600 py-2 px-4 rounded-md flex items-center justify-center"
            onPress={handleCaptureImage}
          >
            <Ionicons name="camera" size={24} color="white" />
            <Text className="text-white text-sm mt-1">Capture Image</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-4"> 
      <RemarkCard
      className="mt-4"
        item={item}
        onRemarkChange={(id, newRemark) =>
          console.log(`Remark updated for ${id}: ${newRemark}`)
        }
      />


        {item?.data?.optional &&   
            <View className="flex-1 bg-transparent justify-end py-4 ">
            <View className="flex-row justify-end gap-1 items-center absolute bottom-2 right-0">
           
              <Icon name="info-circle" size={16} color="red" />
              <Text className="text-sm text-black mr-2">
                Optional
              </Text>
            </View>
          </View>}
      </View>
      {/* Modal to View Full Image */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-2 rounded-lg relative w-full ">
            <TouchableOpacity
              className="absolute top-2 right-2 bg-gray-600 p-2 rounded-full"
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
            <Image
              source={{ uri: capturedImage }}
              className="w-full mt-12 h-80 object-contain"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FileCard;
