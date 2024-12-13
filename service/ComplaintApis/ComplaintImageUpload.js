import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL3 } from '@env';


export const ComplaintImageUploadApi = async (data) => {
  console.log(data, "API called for complaint image");

  try {
    // Validate input data
    if (!data.uri || !data.mimeType) {
      console.error('Invalid data provided for image upload:', data);
      return false;
    }

    // Retrieve user information from AsyncStorage
    const userInfo = await AsyncStorage.getItem('userInfo');
    if (!userInfo) {
      console.error('User information not found in AsyncStorage');
      return false;
    }

    const parsedUserInfo = JSON.parse(userInfo);
    const userId = parsedUserInfo?.data?.id;
    const apiToken = parsedUserInfo?.data?.api_token;

    if (!userId || !apiToken) {
      console.error('Invalid user data found', parsedUserInfo);
      return false;
    }

    // Create a FormData object to hold the file data
    const formData = new FormData();
    const fileName = data.fileName || `${Date.now()}.jpg`; // Use provided fileName or generate one

    formData.append('name', fileName); // Name of the file
    formData.append('type', data.mimeType); // File type (e.g., image/jpeg)
    formData.append('file', {
      uri: data.uri,
      name: fileName,
      type: data.mimeType,
    });

    // Append additional required fields (user-id and api-token)
    formData.append('user-id', userId);
    formData.append('api-token', apiToken);
    // const API_URL = 'https://drs-api.isocietymanager.com/v1/society/2/publicupload';

    // Make the POST request to the API
    const response = await axios.post(`${API_URL3}/v1/society/2/publicupload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure proper content type for file uploads
      },
    });

    console.log('Image uploaded successfully:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response from server:', error.response.data);
    } else {
      console.error('Error uploading image:', error.message);
    }
    return false;
  }
};
