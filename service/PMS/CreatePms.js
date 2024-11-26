import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CreatePmsApi = async ({ uuid }) => {
  console.log(uuid, 'UUID for API call');
  try {
    // Fetch user info from AsyncStorage
    const userInfo = await AsyncStorage.getItem('userInfo');
    if (!userInfo) {
      throw new Error('User information not found in AsyncStorage');
    }

    // Parse userInfo and extract necessary details
    const parsedUserInfo = JSON.parse(userInfo);
    const userId = parsedUserInfo.data.id;
    const apiToken = parsedUserInfo.data.api_token;
    const societyId = parsedUserInfo.data.societyId;

    // API endpoint
    const apiUrl = 'https://nppm-api.isocietymanager.com/v3/action/createwofrompm';

    // Query parameters for the API call
    const params = {
      'user-id': userId,
      'api-token': apiToken,
      uuid: uuid,
    };

    // Define headers
    const headers = {
      'ism-auth': JSON.stringify({
        'api-token': apiToken,
        'user-id': userId,
        'site-id': societyId,
      }),
    };

    // Log request details for debugging
    console.log(apiUrl, params, headers, 'This is the sent call');

    // Make API request
    const response = await axios.post(apiUrl, { params, headers });

    // Extract and return response data
    const data = response.data;
    console.log(data, 'Response for adding PMS');
    return data;
  } catch (error) {
    console.error('Error creating PMS:', error.message || error);
    throw error; // Rethrow error to handle it later
  }
};
