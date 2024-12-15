import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { GetComplaintLocations } from '../../service/ComplaintApis/GetComplaintLocations';
import { ComplaintImageUploadApi } from '../../service/ComplaintApis/ComplaintImageUpload';
import { CreateComplaintApi } from '../../service/ComplaintApis/CreateComplaintApi';
import { useNavigation } from '@react-navigation/native';
import DynamicPopup from "../DynamivPopUps/DynapicPopUpScreen"
const NewComplaintPage = ({ route }) => {
  const { subCategory } = route.params;
  const [location, setLocation] = useState('');
  const [allLocations, setAllLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState('');
  const [isInputActive, setInputActive] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const navigation = useNavigation();
  // Fetch all location options on mount
  useLayoutEffect(() => {
    const fetchAllLocations = async () => {
      try {
        setLoading(true);
        const response = await GetComplaintLocations();
        setAllLocations(response); // Store all locations
        setFilteredLocations(response); // Display all options initially
      } catch (error) {
        setError('Error fetching location options');
      } finally {
        setLoading(false);
      }
    };
    fetchAllLocations();
  }, []);

  // Filter locations based on input
  const handleLocationInput = (text) => {
    setLocation(text);
    if (text) {
      const filtered = allLocations.filter((loc) =>
        loc.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(allLocations); // Show all options if input is empty
    }
  };


  const pickImage = async () => {
    setImageLoading(true); // Start the loading indicator when the user selects an image
  
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.6,
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri); // Immediately show the image preview
  
      try {
        // Upload image and get the URL
        const ImageResponse = await ComplaintImageUploadApi(result.assets[0]);
        setImageUrl(ImageResponse.data.url); // Set image URL after successful upload
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        Alert.alert('Error', 'Failed to upload the image.');
      } finally {
        setImageLoading(false); // End loading once the process is complete
      }
    } else {
      setImageLoading(false); // End loading if no image was selected
    }
  };
    

  
  const submitComplaint = async () => {
    setLoading(true); // Show loader during API request
    setPopupVisible(false); // Ensure popup is hidden before submission
  
    const data = {
      data: subCategory,
      society: location.id,
      description: description,
      image: imageUrl,
    };
  
    try {
      const response = await CreateComplaintApi(data);
  
      if (response.status === 'success') {
        setPopupType('success');
        setPopupMessage('Complaint submitted successfully!');
        setPopupVisible(true);
  
        // Navigate after a delay to allow user to see the success message
        setTimeout(() => {
          setPopupVisible(false);
          navigation.navigate('Service Request');
        }, 2000);
      } else {
        throw new Error('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setPopupType('error');
      setPopupMessage('Failed to submit complaint. Please try again.');
      setPopupVisible(true);
    } finally {
      setLoading(false); // Hide loader after API request
    }
  };
  

  // Disable submit button if any field is missing
  const isSubmitDisabled = !location || !description || !imageUrl;

  const locationClicked = (item) => {
    setLocation(item); // Dynamically set the selected location
    setInputActive(false); // Hide the dropdown list
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 40} // Adjust this value to move input above keyboard
      >
        <ScrollView style={styles.container}>
          {/* Category Section */}
          <View style={styles.section}>
            <Text style={styles.label}>Category</Text>
            <Text style={styles.valueText}>
              {subCategory.complaint_category || 'Not selected'}
            </Text>
          </View>

          {/* Sub-Category Section */}
          <View style={styles.section}>
            <Text style={styles.label}>Sub Category</Text>
            <Text style={styles.valueText}>
              {subCategory.name || 'Not selected'}
            </Text>
          </View>

          {/* Location Section */}
          <View style={styles.section}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter location"
              value={location.name || location}
              onFocus={() => setInputActive(true)}
              onChangeText={handleLocationInput}
            />
            {loading && (
              <ActivityIndicator
                size="small"
                color="#1996D3"
                style={styles.loader}
              />
            )}

            {isInputActive && (
              <View style={styles.locationList}>
                {filteredLocations.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => locationClicked(item)}
                  >
                    <Text style={styles.locationOption}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
                {filteredLocations.length === 0 && (
                  <Text style={styles.locationOption}>
                    No location options found
                  </Text>
                )}
              </View>
            )}
          </View>

          {/* Description Section */}
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Enter description"
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          {/* Image Section */}
{/* Image Section */}
<View className="flex flex-row items-center justify-between p-2 space-x-4 bg-white border-b border-gray-300">
  {image ? (
    // Display the locally captured image preview
    <Image source={{ uri: image }} className="w-24 h-24 rounded-lg" />
  ) : (
    <Text className="text-sm text-[#074B7C]">No image selected</Text>
  )}
  <TouchableOpacity
    className="flex flex-row items-center justify-center px-4 py-2 border border-[#1996D3] rounded-lg"
    onPress={pickImage}
    disabled={imageLoading}
  >
    {imageLoading ? (
      <ActivityIndicator size="small" color="#1996D3" />
    ) : (
      <>
        <Text className="mr-2 text-sm text-[#1996D3]">Capture Image</Text>
        <FontAwesome name="camera" size={20} color="#1996D3" />
      </>
    )}
  </TouchableOpacity>
</View>

          {/* Submit Button */}
         {/* Submit Button */}
<View style={styles.section}>
  <TouchableOpacity
    style={[
      styles.submitButton,
      isSubmitDisabled && styles.submitButtonDisabled,
    ]}
    onPress={submitComplaint}
    disabled={isSubmitDisabled || loading}
  >
    {loading ? (
      <ActivityIndicator color="#fff" />
    ) : (
      <Text style={styles.submitText}>Submit</Text>
    )}
  </TouchableOpacity>
</View>

{/* Dynamic Popup */}
{popupVisible && (
  <DynamicPopup
    type={popupType} // 'success' or 'error'
    message={popupMessage}
    onClose={() => setPopupVisible(false)} // Close popup handler
  />
)}

          {/* Error Message */}
          {error && <Text style={styles.errorMessage}>{error}</Text>}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingBottom:40,
    backgroundColor: '#FFFFFF', // White background
  },
  container: {
    padding: 10,
    paddingBottom:30
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000', // Black font color
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF', // White background
    padding: 8,
    borderBottomWidth: .5,
    borderBottomColor: 'gray', // Black border color
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000', // Black font color
  },
  valueText: {
    fontSize: 16,
    color: '#1996D3', // Glowing blue for value text
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#1996D3', // Glowing blue for the input border
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    backgroundColor: '#FFFFFF', // White background for input
    marginBottom: 10,
    color: '#000000', // Black text in input
  },
  textarea: {
    height: 70,
    textAlignVertical: 'top',
    color: '#000000', // Black font color
  },
  locationList: {
    maxHeight: 200,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#1996D3', // Glowing blue for location list border
    borderRadius: 8,
    backgroundColor: '#FFF', // White background
  },
  locationOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD', // Light gray border for options
    color: '#1996D3', // Glowing blue color for text
  },
  imagePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width:160,
    padding: 10,
    backgroundColor: '#FFFFFF', // White background
    borderWidth: 1,
    borderColor: '#1996D3', // Glowing blue border for image picker
    borderRadius: 8,
  },
  imagePickerText: {
    color: '#1996D3', // Glowing blue text
    marginRight: 10,
  },
  previewImage: {
    backgroundColor:"red",
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 8,
  },
  imageLoading: {
    marginTop: 10,
  },
  noImageText: {
    color: '#074B7C', // Dark blue color for "No image selected" text
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#074B7C', // Glowing blue button color
    borderRadius: 8,
    marginBottom:20,
    paddingVertical: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#D3D3D3', // Light gray for disabled button
  },
  submitText: {
    color: '#FFFFFF', // White text for the submit button
    fontSize: 18,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default NewComplaintPage;