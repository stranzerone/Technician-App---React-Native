import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UpdateInstructionApi } from '../BuggyListApis/UpdateInstructionApi';

const API_URL = 'https://drs-api.isocietymanager.com/v1/society/2/publicupload';

export const uploadImageToServer = async (data, itemId, WoUuId) => {
  console.log(data,itemId,WoUuId, "API called");

  try {
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
    formData.append('name', data.fileName); // Name of the file
    formData.append('type', data.mimeType); // File type (e.g., image/jpeg)
    formData.append('file', {
      uri: data.uri,
      name: data.fileName || data.name,
      type: data.mimeType,
    });

    // Append additional required fields (user-id and api-token)
    formData.append('user-id', userId);
    formData.append('api-token', apiToken);

    // Make the POST request to the API
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure proper content type for file uploads
      },
    });

    console.log(response.data, "Image response");
    if (response.data.status === 'success') {
      const updateInstResponse = await UpdateInstructionApi({
        id: itemId,
        value: response.data.data.url,
        WoUuId: WoUuId,
        type: data.mimeType
      });

      if (updateInstResponse) {
        return true;
      }
      return false;
    }
  } catch (error) {
    console.error('Error uploading image:', error.message); // Log error details
    return false;
  }
};


// // uploadApi.js
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { UpdateInstructionApi } from '../BuggyListApis/UpdateInstructionApi';

// const API_URL = 'https://drs-api.isocietymanager.com/v1/society/2/publicupload';

// export const uploadImageToServer = async (data, itemId, WoUuId) => {
//   console.log(data, itemId, WoUuId, "API called");

//   try {
//     // Fetch user information from AsyncStorage
//     const userInfo = await AsyncStorage.getItem('userInfo');
//     if (!userInfo) {
//       console.error('User information not found in AsyncStorage');
//       return false;
//     }

//     const parsedUserInfo = JSON.parse(userInfo);
//     const userId = parsedUserInfo?.data?.id;
//     const apiToken = parsedUserInfo?.data?.api_token;

//     // Validate user information
//     if (!userId || !apiToken) {
//       console.error('Invalid user data found', parsedUserInfo);
//       return false;
//     }

//     // Create FormData to hold image file data
//     const formData = new FormData();
//     formData.append('name', data.fileName); // Image name
//     formData.append('type', data.mimeType); // MIME type (e.g., image/jpeg)
//     formData.append('file', {
//       uri: data.uri,
//       name: data.fileName || data.name, // File name or fallback
//       type: data.mimeType, // MIME type (e.g., image/jpeg)
//     });

//     // Append user-id and api-token to the form data
//     formData.append('user-id', userId);
//     formData.append('api-token', apiToken);

//     // Make the POST request to upload the image
//     const response = await axios.post(API_URL, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data', // Set correct headers for file upload
//       },
//     });

//     // Handle the response
//     if (response.data.status === 'success') {
//       console.log('Image successfully uploaded:', response.data);

//       // Call UpdateInstructionApi with the image URL and metadata
//       const updateInstResponse = await UpdateInstructionApi({
//         id: itemId,
//         value: response.data.data.url, // Uploaded image URL
//         WoUuId: WoUuId,
//         type: data.mimeType, // File MIME type
//       });

//       // If UpdateInstructionApi call was successful, return true
//       if (updateInstResponse) {
//         return true;
//       }
//       return false;
//     }
//   } catch (error) {
//     console.error('Error uploading image:', error.message);
//     return false;
//   }
// };
