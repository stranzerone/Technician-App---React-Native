import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

export default GetIssueItems = async () => {
  try {
    // Fetch user info from AsyncStorage
    const userInfo = await AsyncStorage.getItem('userInfo');

    if (!userInfo) {
      throw new Error('User information not found in AsyncStorage');
    }

    // Parse userInfo and extract necessary fields
    const parsedUserInfo = JSON.parse(userInfo);
    const userId = parsedUserInfo.data.id;
    const apiToken = parsedUserInfo.data.api_token;
    const societyId = parsedUserInfo.data.societyId;

    // Payload for filtering data
    const payload = {
      site_uuid: "b2126ecd-ae19-4242-a813-12a1ed70da13",
      warehouse_id:"768534e1-b0df-49fa-93c5-a842806d5d29",
    };

    // Headers
    const headers = {
      'Content-Type': 'application/json',
      'ism-auth': JSON.stringify({
        "api-token": apiToken,
        "user-id": userId,
        "site-id": societyId
      })
    };
    const response = await axios.get(`${API_URL}/v3/all/item/nodes/warehouse`, {
      headers,
      params: payload, // 👈 This is the key fix
    });

    console.log(response.data, 'this is response of data');
    return response.data;

  } catch (error) {
    console.error('Error fetching data:', error.message || error);
    throw error;
  }
};
