import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker'; // Correct import for DocumentPicker
import { UpdateInstructionApi } from '../../service/BuggyListApis/UpdateInstructionApi';
import InputField from './InputField'; // Ensure the path is correct
import convertUrlToBase64 from '../../service/ImageUploads/BlobImageConvert';
import { uploadImageToServer } from '../../service/ImageUploads/ConvertImageToUrlApi';
import convertPdfUrlToBase64 from "./ConvertToPdfDownload";
import { Ionicons } from '@expo/vector-icons'; // Add this import
import Loader from '../LoadingScreen/AnimatedLoader';

const BuggyListCard = ({ item, onUpdateSuccess, WoUuId }) => {
  const [inputValue, setInputValue] = useState(item.result || '');
  const [remark, setRemark] = useState(item.remarks || '');
  const [editingRemark, setEditingRemark] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfPreview, setPdfPreview] = useState(null);
console.log(item.type,"item")
  // Convert image URL to base64 for preview
  useEffect(() => {
    if (item.image) {
      setLoading(true);
      convertUrlToBase64(item.image)
        .then((base64Url) => {
          if (base64Url) {
            setImagePreviewUrl(base64Url);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else if (item.fileAttachment) {
      setLoading(true);
      convertPdfUrlToBase64(item.file)
        .then((base64Url) => {
          if (base64Url) {
            console.log(base64Url, 'pdf');
            setPdfPreview(base64Url);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [item.image]);

  // Save the instruction
  const handleSave = async () => {
    try {
      const payload = {
        id: item.id,
        remark: remark,
        value: inputValue,
        WoUuId: WoUuId,
        image: false,
      };
      await UpdateInstructionApi(payload);
      onUpdateSuccess(); // Call the success callback
    } catch (error) {
      console.error('Error saving instruction:', error);
    }
  };

  // Image picker using the camera
  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled && result.assets[0]) {
        const uploadResponse = await uploadImageToServer(
          result.assets[0].uri,
          item.id,
          WoUuId,
          result.assets[0].mimeType
        );
        if (uploadResponse) {
          onUpdateSuccess();
        }
      }
    } catch (error) {
      console.error('Error during image picking/uploading:', error);
    }
  };

  // Document picker for browsing files
  const handleBrowseImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
      });
      if (result.type !== 'cancel' && result.uri) {
        const uploadResponse = await uploadImageToServer(
          result.uri,
          item.id,
          WoUuId,
          result.mimeType
        );
        if (uploadResponse) {
          onUpdateSuccess();
        }
      }
    } catch (error) {
      console.error('Error during document browsing/uploading:', error);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <InputField
        WoUuId={WoUuId}
        item={item}
        inputValue={inputValue}
        setInputValue={setInputValue}
        onImagePick={handleImagePicker} // Image picker handler
        onDocumentPick={handleBrowseImage} // Document picker handler
        imagePreviewUrl={imagePreviewUrl}
        pdfPreviewUrl={pdfPreview}
        onUpdateSuccess={onUpdateSuccess}
      />
      <Text style={styles.title}>{item.title}</Text>

      <View style={styles.remarkContainer}>
        <Text style={styles.label}>Remark:</Text>
        {editingRemark ? (
          <TextInput
            style={styles.remarkInput}
            placeholder="Enter remark"
            value={remark}
            onChangeText={setRemark}
            placeholderTextColor="#888"
          />
        ) : (
          <TouchableOpacity onPress={() => setEditingRemark(true)}>
            <Text style={styles.remarkText}>{remark || 'No remarks provided'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading && <Loader />}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Ionicons name="save-outline" size={24} color="white" />
        <Text style={styles.buttonText}> Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    flex: 1,
    position: 'relative',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  remarkContainer: {
    marginTop: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#074B7C',
  },
  remarkInput: {
    borderWidth: 1,
    borderColor: '#1996D3',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#f0f0f0',
  },
  remarkText: {
    color: '#666',
    marginTop: 8,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#074B7C',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    width: '100%', // Full width for the button
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  bookmarkButton: {
    position: 'absolute',
    top: 10,
    right: 0,
    zIndex: 1,
  },
  bookmarkIcon: {
    width: 24,
    height: 24,
  },
});

export default BuggyListCard;
