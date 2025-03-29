// components/BuggyListCard/BuggyListCard.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { UpdateInstructionApi } from '../../service/BuggyListApis/UpdateInstructionApi';
import { uploadImageToServer } from '../../service/ImageUploads/ConvertImageToUrlApi';

import TextInputField from '../BuggyListInputComponets/TextInputField';
import NumberInputField from '../BuggyListInputComponets/NumberInputField';
import DropdownField from '../BuggyListInputComponets/DropdownField';
import CheckboxField from '../BuggyListInputComponets/CheckboxField';
import ImageAttachmentField from '../BuggyListInputComponets/ImagePickerField';
import PdfUploadField from '../BuggyListInputComponets/PDFPickerField';
import styles from '../BuggyListInputComponets/styles';

const BuggyListCard = ({ item, onUpdateSuccess, WoUuId }) => {
  const [inputValue, setInputValue] = useState(item.result || '');
  const [remark, setRemark] = useState(item.remarks || '');
  const [editingRemark, setEditingRemark] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // State for file uploads
  const [isImageSelected, setIsImageSelected] = useState(false); // State to track if an image is selected
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // State for image preview URL

  useEffect(() => {
    setInputValue(item.result === '1' ? '1' : '0'); // Ensure checkbox reflects item.result
  }, [item.result]);

  // Fetch the image from the URL when the item changes
  useEffect(() => {
    if (item.result) { // Assuming item.result holds the image URL
      fetchImage(item.result);
    }
  }, [item.result]);

  const fetchImage = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const localUrl = URL.createObjectURL(blob);
      setImagePreviewUrl(localUrl); // Set the local URL for the image preview
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  const handleSave = async () => {
    try {
      // Prepare the payload for saving the other details
      const payload = {
        id: item.id,
        remark: remark,
        value: inputValue,
      };

      // Call your existing API to update the instruction
      await UpdateInstructionApi(payload, WoUuId); 
      onUpdateSuccess(); // Callback after saving
    } catch (error) {
      console.error('Error saving instruction:', error);
    }
  };

  const handleDocumentPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
    });
    if (result.type === 'success') {
      setSelectedFile(result); // Update the selected file
      setIsImageSelected(true); // Show OK button after image is selected
    }
  };

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      const uploadResponse = await uploadImageToServer(result.assets[0].uri);

      setInputValue(uploadResponse.url); // Update input value with the uploaded image URL
    }
  };

  const handleImageUpload = async () => {
    if (selectedFile) {
      try {
        const { uri, name, mimeType } = selectedFile;
        const uploadResponse = await uploadImageToServer(uri, name, mimeType, WoUuId);
        setIsImageSelected(false); // Hide OK button after upload
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const renderInputField = () => {
    switch (item.type) {
      case 'text':
        return <TextInputField inputValue={inputValue} setInputValue={setInputValue} />;
      case 'number':
        return <NumberInputField inputValue={inputValue} setInputValue={setInputValue} />;
      case 'dropdown':
        return <DropdownField item={item} inputValue={inputValue} setInputValue={setInputValue} />;
      case 'checkbox':
        return <CheckboxField inputValue={inputValue} setInputValue={setInputValue} />;
      case 'imageAttachment':
        return (
          <ImageAttachmentField
            handleImagePicker={handleImagePicker}
            handleDocumentPicker={handleDocumentPicker}
            imagePreviewUrl={imagePreviewUrl}
          />
        );
      case 'pdf':
        return (
          <PdfUploadField
            handleDocumentPicker={handleDocumentPicker}
            selectedFile={selectedFile}
          />
        );
      default:
        return null;
    }
  };

  const borderColor = item.result !== "" ? 'darkgreen' : 'darkred';

  return (
    <View style={[styles.cardContainer, { borderColor }]}>
      <Text style={styles.title}>{item.title}</Text>
      {renderInputField()}
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
      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BuggyListCard;
