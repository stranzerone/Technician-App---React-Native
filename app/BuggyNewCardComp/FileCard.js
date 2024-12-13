import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';  // Importing FontAwesome from react-native-vector-icons
import Ionicons from 'react-native-vector-icons/Ionicons'; // For camera icon
import { RNCamera } from 'react-native-camera'; // Importing the camera module
import styles from "../BuggyListCardComponets/InputFieldStyleSheet";
import Loader from '../LoadingScreen/AnimatedLoader'; // Importing loader

const FileCard = ({ item }) => {
  const [remark, setRemark] = useState(item.remark || '');
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false); // State for loader
  const [isCameraOpen, setIsCameraOpen] = useState(false); // State to toggle camera view
  const cameraRef = useRef(null); // Camera reference for capturing the image

  const handleRemarkChange = (text) => {
    setRemark(text);
  };

  const handleCaptureImage = async () => {
    if (cameraRef.current) {
      setLoading(true);
      try {
        const data = await cameraRef.current.takePictureAsync({ quality: 0.7 });
        setCapturedImage(data.uri); // Capture the image and update state
      } catch (error) {
        console.error("Error capturing image: ", error);
      } finally {
        setLoading(false); // Stop loader once image is captured
      }
    }
  };

  const renderFileContent = () => {
    if (capturedImage) {
      return <Image source={{ uri: capturedImage }} style={styles.image} />;
    }
    if (item.fileType === 'pdf') {
      return <FontAwesome name="file-pdf-o" size={50} color="#D32F2F" />;
    }
    if (item.fileType === 'doc') {
      return <FontAwesome name="file-word-o" size={50} color="#1976D2" />;
    }
    return <Text>No file attached</Text>;
  };

  const toggleCamera = () => {
    setIsCameraOpen(!isCameraOpen);
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageAttachmentContainer}>
        {/* Left side - Image Preview */}
        <View style={styles.imagePreviewContainer}>
          {loading ? (
            <Loader /> // Show loader while capturing image
          ) : capturedImage ? (
            <TouchableOpacity onPress={() => console.log("View Full Image")}>
              <Image source={{ uri: capturedImage }} style={styles.image} />
            </TouchableOpacity>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={50} color="#CED4DA" />
              <Text>No image selected</Text>
            </View>
          )}
        </View>

        {/* Right side - Capture Image Button */}
        <View style={styles.buttonContainer}>
          {isCameraOpen ? (
            <RNCamera
              ref={cameraRef}
              style={styles.cameraView}
              type={RNCamera.Constants.Type.back}
              captureAudio={false}
            >
              <View style={styles.captureContainer}>
                <TouchableOpacity onPress={handleCaptureImage} style={styles.cameraButton}>
                  <Ionicons name="camera" size={24} color="white" />
                  <Text style={styles.buttonText}>Capture</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleCamera} style={styles.cameraButton}>
                  <Text style={styles.buttonText}>Close Camera</Text>
                </TouchableOpacity>
              </View>
            </RNCamera>
          ) : (
            <TouchableOpacity onPress={toggleCamera} style={styles.cameraButton}>
              <Ionicons name="camera" size={24} color="white" />
              <Text style={styles.buttonText}>Open Camera</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Remarks Section */}
      <View style={styles.remarkContainer}>
        <Text style={styles.remarkLabel}>Remark</Text>
        <TextInput
          style={styles.textInput}
          value={remark}
          onChangeText={handleRemarkChange}
          placeholder="Add your remark here"
        />
      </View>
    </View>
  );
};

export default FileCard;
