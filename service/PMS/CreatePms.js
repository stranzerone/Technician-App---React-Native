import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

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
    const siteId = parsedUserInfo.data.societyId; // Adjust this to match your API

    // Log request details for debugging
    console.log({ userId, apiToken, uuid, siteId }, 'Request Details');

    // Construct headers for authentication
    const headers = {
      'Content-Type': 'application/json',
      'ism-auth': JSON.stringify({
        'api-token': apiToken,
        'user-id': userId,
        'site-id': siteId,
      }),
    };

    // Make the API request
    const response = await axios.post(
      `${API_URL}/v3/action/createwofrompm`, // API endpoint
      { uuid }, // Payload/body
      { headers } // Authentication details
    );

    // Extract and return response data
    const data = response.data;
    console.log(data, 'Response for adding PMS');
    return data;
  } catch (error) {
    console.error('Error creating PMS:', error.message || error);
    throw error; // Rethrow error to handle it later
  }
};
