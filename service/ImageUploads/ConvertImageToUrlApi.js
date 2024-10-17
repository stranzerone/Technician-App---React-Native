import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL = 'https://drs-api.isocietymanager.com/v1/society/2/publicupload';

export const uploadImageToServer = async (uri) => {
  console.log("api called")
  try {

    const userInfo = await AsyncStorage.getItem('userInfo');
    

   
      const parsedUserInfo = JSON.parse(userInfo);
      const userId = parsedUserInfo.data.id;
      const apiToken = parsedUserInfo.data.api_token;

    console.log(uri,userId)
    // Create a FormData object to hold the file data
    const formData = new FormData();
    formData.append('name', "random"); // Name of the file
    formData.append('type', 'instructions'); // File type (e.g., image/jpeg)
    formData.append('file', {
      uri: uri,
      name: "random",
      type: "image",
    });

    // Append additional required fields (user-id and api-token)
    formData.append('user-id', userId);
    formData.append(
      'api-token',
       apiToken
    );

    // Make the POST request to the API
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure proper content type for file uploads
      },
    });

    console.log(response.data,"image response ")
    if(response.data.status=='success'){
    return response.data.data; // Return the server's response
    }else{
      return false
    }
  } catch (error) {
    console.error('Error uploading image:', error);
  return false
  }
};
