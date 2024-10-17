import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox';
import RNPickerSelect from 'react-native-picker-select';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons'; // Import icons
import { UpdateInstructionApi } from '../../service/BuggyListApis/UpdateInstructionApi'; // Import your existing API
import { uploadImageToServer } from '../../service/ImageUploads/ConvertImageToUrlApi';

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

  const handleInputChange = (text) => {
    setInputValue(text); // Update input value state
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

      console.log(uploadResponse, "response for image in UI URL");
      setInputValue(uploadResponse.url); // Update input value with the uploaded image URL
    
    }
  };

  const handleImageUpload = async () => {
    if (selectedFile) {
      try {
        const { uri, name, mimeType } = selectedFile;
        const uploadResponse = await uploadImageToServer(uri, name, mimeType, WoUuId);
        console.log('Image uploaded:', uploadResponse);
        setIsImageSelected(false); // Hide OK button after upload
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const renderInputField = () => {
    switch (item.type) {
      case 'text':
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Text Input:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter text"
              value={inputValue}
              onChangeText={handleInputChange}
              placeholderTextColor="#888"
            />
          </View>
        );
      case 'number':
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Number Input:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter number"
              value={inputValue}
              keyboardType="numeric"
              onChangeText={handleInputChange}
              placeholderTextColor="#888"
            />
          </View>
        );
      case 'dropdown':
        if (!item.options || item.options.length === 0) {
          return <Text style={styles.errorText}>No options are present.</Text>;
        }
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Dropdown:</Text>
            <RNPickerSelect
              onValueChange={(value) => setInputValue(value)}
              items={item.options.map((option) => ({ label: option, value: option }))}
              placeholder={{ label: item.result || 'Select an option', value: null }}
              value={inputValue}
              useNativeAndroidPickerStyle={false}
              style={pickerSelectStyles}
            />
          </View>
        );
      case 'checkbox':
        return (
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={inputValue === '1'}
              onValueChange={(checked) => setInputValue(checked ? '1' : '0')} // Send 1 or 0 based on checkbox state
              color={inputValue === '1' ? '#074B7C' : undefined}
            />
          </View>
        );
      case 'imageAttachment':
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Upload Image:</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleImagePicker} style={styles.cameraButton}>
                <Ionicons name="camera" size={24} color="white" />
                <Text style={styles.buttonText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDocumentPicker} style={styles.button}>
                <Text style={styles.buttonText}>Choose Image</Text>
              </TouchableOpacity>
            </View>
            {/* Displaying the image preview */}
            {imagePreviewUrl && (
              <Image
                source={{ uri: imagePreviewUrl }} // Use the local URL for the image
                style={styles.image}
              />
            )}
          </View>
        );
      case 'pdf':
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Upload PDF:</Text>
            <TouchableOpacity onPress={handleDocumentPicker} style={styles.button}>
              <Text style={styles.buttonText}>Choose PDF</Text>
            </TouchableOpacity>
            {selectedFile && selectedFile.uri.endsWith('.pdf') && (
              <Text style={styles.selectedFileText}>PDF Selected: {selectedFile.name}</Text>
            )}
          </View>
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

// Styles for the dropdown picker
const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#1996D3',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#1996D3',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    color: 'black',
    paddingRight: 30,
  },
};

const styles = StyleSheet.create({
  cardContainer: {
    borderLeftWidth: 6,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    width: '100%',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#074B7C',
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#074B7C',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#1996D3',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#f0f0f0',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#1996D3',
    padding: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  cameraButton: {
    backgroundColor: '#074B7C',
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  okButton: {
    backgroundColor: 'green',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  remarkContainer: {
    marginTop: 16,
  },
  remarkInput: {
    borderWidth: 1,
    borderColor: '#1996D3',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#f0f0f0',
  },
  remarkText: {
    color: '#888',
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#074B7C',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 8,
    borderRadius: 8,
  },
  selectedFileText: {
    marginTop: 8,
    color: '#074B7C',
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 8,
  },
});

export default BuggyListCard;
