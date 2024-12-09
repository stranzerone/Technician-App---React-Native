import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const WorkOrderAddComments = async ({ newComment },WoUuId) => {
  const userInfo = await AsyncStorage.getItem('userInfo');
  const parsedUserInfo = JSON.parse(userInfo);

  if (userInfo) {
const userId = parsedUserInfo.data.id;
const apiToken = parsedUserInfo.data.api_token
    const apiUrl = 'https://nppm-api.isocietymanager.com/v3/comment';

    const payload = {
      comment: newComment,
      data: {},
      ref_uuid: WoUuId,
      tag: "C",
      type: "WO"
    };

    const headers = {
      'Content-Type': 'application/json',
      'ism-auth': JSON.stringify({
        "api-token": apiToken,
        "user-id": userId,
        "site-id": 2
      })
    };

    try {
      const response = await axios.post(apiUrl, payload, { headers });

  console.log(response.data.status)
  return response.data.status
     

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  } else {
    throw new Error('User information not found in AsyncStorage');
  }
};
