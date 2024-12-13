import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Image,
  Modal,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { uploadImageToServer } from '../../service/ImageUploads/ConvertImageToUrlApi';
import handleDownload from './FileDownloader'; // Import your file download logic
import Loader from '../LoadingScreen/AnimatedLoader';
import { usePermissions } from '../GlobalVariables/PermissionsContext';
import styles from './InputFieldStyleSheet';
import { uplodPdfToServer } from '../../service/ImageUploads/ConvertPdfToUrl';
import OptionsModal from '../DynamivPopUps/DynamicOptionsPopUp';


const InputField = ({ item, inputValue, setInputValue, imagePreviewUrl, WoUuId, onUpdateSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState(inputValue);
  const [isEditing, setIsEditing] = useState(false);
  const { ppmAsstPermissions } = usePermissions();
  const [isModalVisible,setIsModalVisible] = useState(false)
  const [options,setOptions]  = useState([])


     // Mapping the options properly to pass them as an array of objects
     const listOptions = item.options?.map((option) => ({
      label: option,
      value: option,
    }));
  
    // Setting the options to the state
    setOptions(listOptions);

  const renderTextOrNumberInput = ({
    item,
    inputText,
    setInputText,
    isEditing,
    setIsEditing,
    setInputValue,
    ppmAsstPermissions,
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{item.label || 'Input:'}</Text>
      {isEditing ? (
        <TextInput
          style={styles.remarkInput}
          placeholder={`Enter ${item.type === 'text' ? 'text' : 'number'}`}
          value={inputText}
          onChangeText={setInputText}
          placeholderTextColor="#888"
          keyboardType={item.type === 'number' ? 'numeric' : 'default'}
          onBlur={() => {
            setIsEditing(false);
            if (inputText.trim()) {
              setInputValue(inputText);
            }
          }}
          autoFocus
        />
      ) : (
        <TouchableOpacity
          onPress={() => {
            if (ppmAsstPermissions.some(permission => permission.includes('U'))) {
              setIsEditing(true);
            }
          }}
        >
          <Text style={styles.remarkText}>{inputText || 'Enter Value or Text'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  




  const handleTypeSelect = (type) => {
    setSelectedType(type);
    onTypeSelect(type);
    setIsModalVisible(false);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };


  const renderField = () => {
    switch (item.type) {
      case 'text':
        case 'number':
          return renderTextOrNumberInput({
            item,
            inputText,
            setInputText,
            isEditing,
            setIsEditing,
            setInputValue,
            ppmAsstPermissions,
          });
        
     

          
          case 'dropdown':
       
          
            return item.options && item.options.length > 0 ? (
              <View style={styles.inputContainer}>
                <View style={styles.dropdownContainer}>
                  <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                    <View style={styles.dropdown}>
                      <Text>Select Option</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconContainer}>
                    <Ionicons name="chevron-down" size={24} color="#1996D3" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text style={styles.errorText}>No options available</Text>
            );
          




      case 'checkbox':
        return renderCheckbox();

      case 'file':
        return renderImageAttachment();

      case 'document':
        return renderFileAttachment();

      default:
        return null;
    }
  };


 

  const renderCheckbox = () => (
    <TouchableOpacity
      disabled={!ppmAsstPermissions.some(permission => permission.includes('U'))}
      style={styles.checkboxContainer}
      onPress={() => setInputValue(inputValue === '1' ? '0' : '1')}
    >
      <View className="flex flex-row gap-2">
      <View style={styles.middleCircle}>
        <View
          style={[styles.innerCircle, inputValue === '1' ? styles.checked : styles.unchecked]}
        />

       
      </View>
      <Text className='mx-2' style={styles.title}>{item.title}</Text>

     </View>
    </TouchableOpacity>
  );

  const renderImageAttachment = () => (
    <View style={styles.imageAttachmentContainer}>
      <View style={styles.imagePreviewContainer}>
        {loading ? (
          <Loader />
        ) : imagePreviewUrl ? (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image source={{ uri: imagePreviewUrl }} style={styles.image} />
          </TouchableOpacity>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={50} color="#CED4DA" />
            <Text>No image selected</Text>
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleImagePicker} style={styles.cameraButton}>
          <Ionicons name="camera" size={24} color="white" />
          <Text style={styles.buttonText}>Camera</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={handleDocumentPicker} style={[styles.cameraButton]}>
          <Ionicons name="folder-open-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Choose Image</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );

  const renderFileAttachment = () => (
    <View style={styles.inputContainer}>
      {selectedFile && (
        <Text style={styles.selectedFileText}>PDF Selected: {selectedFile.name}</Text>
      )}
      <View style={styles.pdfButtonsContainer}>
        <TouchableOpacity onPress={handleDocumentPicker} style={[styles.button, styles.pdfButton]}>
          <Text style={styles.buttonText}>
            <FontAwesome name='file-pdf-o' size={20}  />
            &nbsp;
            Choose PDF</Text>
        </TouchableOpacity>
        {item.file && (
          <TouchableOpacity
            onPress={() => handleDownload({ file: item.file })}
            style={[styles.button, styles.pdfButton]}
          >
            <Ionicons name="download-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Download PDF</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const handleDocumentPicker = async () => {
    console.log('document picker called',ppmAsstPermissions)
    if (!ppmAsstPermissions.some(permission => permission.includes('U'))) return;
console.log("clicked to upload pdf")
    setLoading(true);
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
    });

    console.log(result.assets[0].uri,'uri')
    if (!result.canceled && result.assets[0].uri) {
      console.log(result,'result')
      setSelectedFile(result);
      const uploadResponse = await uplodPdfToServer(result.assets[0], item.id, WoUuId);
      if (uploadResponse) onUpdateSuccess();
    }
    setLoading(false);
  };

  const handleImagePicker = async () => {
    if (!ppmAsstPermissions.some(permission => permission.includes('U'))) return;

    setLoading(true);
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      const imageUri = result.assets[0].uri;
      const fileData = {
        uri: imageUri,
        fileName: `photo_${Date.now()}.jpeg`,
        mimeType: 'image/jpeg',
      };
      const uploadResponse = await uploadImageToServer(fileData, item.id, WoUuId);
      if (uploadResponse) onUpdateSuccess();
    }
    setLoading(false);
  };

  return (
    <>
      {renderField()}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={[styles.modalCloseButton, { zIndex: 1 }]}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
          {imagePreviewUrl && (
            <Image source={{ uri: imagePreviewUrl }} style={styles.modalImage} resizeMode="contain" />
          )}
        </View>
      </Modal>
      <OptionsModal
        visible={isModalVisible}
        options={options}
        onSelect={handleTypeSelect}
        onClose={closeModal}
      />
    </>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#1996D3',
    borderRadius: 8,
    color: 'black',
    backgroundColor: '#f0f0f0',
    marginTop: 8,
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#1996D3',
    borderRadius: 8,
    color: 'black',
    backgroundColor: '#f0f0f0',
    marginTop: 8,
    paddingRight: 30,
  },
});

export default InputField; 