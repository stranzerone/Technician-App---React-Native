// import React, { useState } from 'react';
// import { Button, View, Text, Image } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { uploadImageToServer } from '../../service/ImageUploads/ConvertImageToUrlApi'; // Adjust the path

// const ImageUploader = ({ itemId, WoUuId }) => {
//   const [imageUri, setImageUri] = useState(null);

//   // Function to pick an image from the device
//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImageUri(result.uri); // Store the image URI locally
//       handleImageUpload(result); // Pass the image data for upload
//     }
//   };

//   // Handle image upload
//   const handleImageUpload = async (image) => {
//     const fileData = {
//       uri: image.uri,
//       fileName: `photo_${Date.now()}.jpeg`, // Create a unique filename
//       mimeType: 'image/jpeg', // Specify the type as JPEG
//     };

//     const success = await uploadImageToServer(fileData, itemId, WoUuId);

//     if (success) {
//       console.log('Image uploaded and instruction updated');
//     } else {
//       console.log('Image upload failed');
//     }
//   };

//   return (
//     <View>
//       <Button title="Pick Image" onPress={pickImage} />
//       {imageUri && (
//         <Image
//           source={{ uri: imageUri }}
//           style={{ width: 200, height: 200 }}
//         />
//       )}
//     </View>
//   );
// };

// export default ImageUploader;


import React, { useState } from 'react';
import { Button, View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToServer } from '../../service/ImageUploads/ConvertImageToUrlApi'; // Adjust the path

const ImageUploader = ({ itemId, WoUuId }) => {
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false); // Track upload state
  const [uploadStatus, setUploadStatus] = useState(null); // Success or failure message

  // Function to pick an image from the device
  const pickImage = async () => {
    setUploadStatus(null); // Reset status on new image selection
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.uri); // Store the image URI locally
      handleImageUpload(result); // Pass the image data for upload
    }
  };

  // Handle image upload
  const handleImageUpload = async (image) => {
    setUploading(true);
    const fileData = {
      uri: image.uri,
      fileName: `photo_${Date.now()}.jpeg`, // Unique filename
      mimeType: 'image/jpeg', // Specify type as JPEG
    };

    try {
      const success = await uploadImageToServer(fileData, itemId, WoUuId);
      if (success) {
        setUploadStatus('Image uploaded successfully');
      } else {
        setUploadStatus('Failed to upload image');
      }
    } catch (error) {
      setUploadStatus('An error occurred during upload');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Select Image" onPress={pickImage} color="#1996D3" />
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.imagePreview}
          resizeMode="cover"
        />
      )}
      {uploading ? (
        <ActivityIndicator size="large" color="#074B7C" style={styles.loader} />
      ) : (
        <Text style={styles.statusText}>{uploadStatus}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1996D3',
  },
  loader: {
    marginTop: 20,
  },
  statusText: {
    marginTop: 20,
    fontSize: 16,
    color: '#074B7C',
  },
});

export default ImageUploader;
