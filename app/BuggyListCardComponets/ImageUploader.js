// src/components/BuggyListCard/ImageUploader.js
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, ActivityIndicator, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import convertUrlToBase64 from '../../service/ImageUploads/BlobImageConvert';
import styles from './styles';

const ImageUploader = ({ item, WoUuId, onUpdateSuccess }) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (item.image) {
      setLoading(true);
      convertUrlToBase64(item.image).then((base64Url) => {
        if (base64Url) {
          setImagePreviewUrl(base64Url);
        }
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [item.image]);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets[0]) {
      const uploadResponse = await uploadImageToServer(result.assets[0].uri, item.id, WoUuId);
      if (uploadResponse) {
        onUpdateSuccess();
      }
    }
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Upload Image:</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleImagePicker} style={styles.cameraButton}>
          <Ionicons name="camera" size={24} color="white" />
          <Text style={styles.buttonText}>Camera</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="small" color="#074B7C" style={styles.loadingIndicator} />
      ) : imagePreviewUrl ? (
        <Image source={{ uri: imagePreviewUrl }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text>No image selected</Text>
        </View>
      )}
    </View>
  );
};

export default ImageUploader;
