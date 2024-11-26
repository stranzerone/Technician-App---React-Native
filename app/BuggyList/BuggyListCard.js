import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { UpdateInstructionApi } from '../../service/BuggyListApis/UpdateInstructionApi';
import InputField from './InputField';
import convertUrlToBase64 from '../../service/ImageUploads/BlobImageConvert';
import { uploadImageToServer } from '../../service/ImageUploads/ConvertImageToUrlApi';
import convertPdfUrlToBase64 from "./ConvertToPdfDownload";
import Loader from '../LoadingScreen/AnimatedLoader';

const BuggyListCard = ({ item, onUpdateSuccess, WoUuId }) => {
  const [inputValue, setInputValue] = useState(item.result || '');
  const [remark, setRemark] = useState(item.remarks || '');
  const [editingRemark, setEditingRemark] = useState(false);
  const [preview, setPreview] = useState(null); // Use one state to manage preview type and URL
  const [loading, setLoading] = useState(true);
  // Function to handle image and document picking
  const handleFilePick = useCallback(async (pickerType) => {
    try {
      let result;
      if (pickerType === 'image') {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      } else if (pickerType === 'document') {
        result = await DocumentPicker.getDocumentAsync({
          type: ['application/pdf', 'image/*'],
        });
      }

      if (result && result.uri) {
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
      console.error(`Error during ${pickerType} pick/uploading:`, error);
    }
  }, [item.id, WoUuId, onUpdateSuccess]);

  // Effect to load the image or PDF preview
  useEffect(() => {
    const fetchPreview = async () => {
      setLoading(true);
      try {
        if (item.image) {
          const base64Url = await convertUrlToBase64(item.image);
          setPreview({ type: 'image', url: base64Url });
        } else if (item.fileAttachment) {
          const base64Url = await convertPdfUrlToBase64(item.file);
          setPreview({ type: 'pdf', url: base64Url });
        } else {
          setPreview(null);
        }
      } catch (error) {
        console.error('Error fetching preview:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [item.image, item.fileAttachment]);

  // Save instruction when inputValue or remark changes
  useEffect(() => {
    const saveInstruction = async () => {
      if (inputValue !== item.result || remark !== item.remarks) {
        try {
          const payload = {
            id: item.id,
            remark,
            value: inputValue,
            WoUuId,
            image: false,
          };
          await UpdateInstructionApi(payload);
          onUpdateSuccess();
        } catch (error) {
          console.error('Error saving instruction:', error);
        }
      }
    };

    saveInstruction();
  }, [inputValue, remark, item.result, item.remarks, WoUuId, onUpdateSuccess]);

  // Handle remark input blur to save
  const handleRemarkBlur = useCallback(async () => {
    try {
      const payload = {
        id: item.id,
        remark,
        value: inputValue,
        WoUuId,
        image: false,
      };
      await UpdateInstructionApi(payload);
      onUpdateSuccess(); // Call the success callback
    } catch (error) {
      console.error('Error saving remark:', error);
    }
  }, [item.id, inputValue, remark, WoUuId, onUpdateSuccess]);

  // Determine background color based on item properties
  const cardBackgroundColor = item.result || item.image || item.file ? '#e6ffe6' : 'white'; // Faint green

  return (
    <View style={[styles.cardContainer, { backgroundColor: cardBackgroundColor }]}>
      <Text style={styles.title}>{item.title}</Text>

      <InputField
        WoUuId={WoUuId}
        item={item}
        inputValue={inputValue}
        setInputValue={setInputValue}
        onImagePick={() => handleFilePick('image')}
        onDocumentPick={() => handleFilePick('document')}
        imagePreviewUrl={preview?.type === 'image' ? preview.url : null}
        pdfPreviewUrl={preview?.type === 'pdf' ? preview.url : null}
        onUpdateSuccess={onUpdateSuccess}
      />

      <View style={styles.remarkContainer}>
        <Text style={styles.label}>Remark:</Text>
        {editingRemark ? (
          <TextInput
            style={styles.remarkInput}
            placeholder="Enter remark"
            value={remark}
            onChangeText={setRemark}
            placeholderTextColor="#888"
            onBlur={handleRemarkBlur} // Call the API when input loses focus
          />
        ) : (
          <TouchableOpacity onPress={() => setEditingRemark(true)}>
            <Text style={styles.remarkText}>{remark || 'No remarks provided'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <Loader text="Loading preview..." />
      ) : (
        <>
          {preview?.type === 'image' && (
            <Image source={{ uri: preview.url }} style={styles.previewImage} />
          )}
          {preview?.type === 'pdf' && (
            <View style={styles.pdfPreviewContainer}>
              <Text style={styles.pdfPreviewText}>PDF Preview: Unable to display directly.</Text>
              <Text style={styles.pdfPreviewUrl}>{preview.url}</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
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
  previewImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  pdfPreviewContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  pdfPreviewText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  pdfPreviewUrl: {
    fontSize: 12,
    color: '#1996D3',
    textDecorationLine: 'underline',
  },
});

export default BuggyListCard;
