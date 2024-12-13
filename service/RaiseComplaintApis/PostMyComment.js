import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL2 } from '@env';

export const PostMyComment = async (id, remark) => {
  const userInfo = await AsyncStorage.getItem('userInfo');
  console.log(id, remark, "info");

  if (userInfo) {
    const parsedUserInfo = JSON.parse(userInfo);
    const userId = parsedUserInfo.data.id;
    const apiToken = parsedUserInfo.data.api_token;
    const societyId =parsedUserInfo.data.societyId

    // const apiUrl = 'https://api.isocietymanager.com/staff/addcomment';

    // Set URL parameters
    const params = {
      'api-token': apiToken,
      'user-id': userId,
    };

    // Create FormData for payload
    const formData = new FormData();
    formData.append('remarks', remark);
    formData.append('comp_id', id);

    try {
      const response = await axios.post(`${API_URL2}/staff/addcomment`, formData, {
        params, 
        headers: {
          'Content-Type': 'multipart/form-data',
          'ism-auth': JSON.stringify({
            "api-token": apiToken,
            "user-id": userId,
            "site-id": societyId,
          }),
        },
        withCredentials: true
      });

      const data = response.data;
      console.log(response.data)
      return data.status; // Return the relevant data

    } catch (error) {
      console.error('Error posting comment:', error);
      throw error; // Throw error to handle it later
    }
  } else {
    throw new Error('User information not found in AsyncStorage');
  }
};
