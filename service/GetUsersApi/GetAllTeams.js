
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

export const getAllTeams = async ({uuid}) => {
  const userInfo = await AsyncStorage.getItem('userInfo');
console.log("get all Teams")
  if (userInfo) {

    const parsedUserInfo = JSON.parse(userInfo);
    const userId = parsedUserInfo.data.id
    const apiToken = parsedUserInfo.data.api_token
    const societyId =parsedUserInfo.data.societyId
    // const apiUrl = 'https://nppm-api.isocietymanager.com/v3/teams?';

    console.log(uuid,"uuid for team")
     const params = {
   "site_uuid":uuid,
    "user-id":userId,
    "api-token":apiToken,
      
    };

    const headers = {
        'Content-Type': 'application/json',
        'ism-auth': JSON.stringify({
          "api-token": apiToken,     // Dynamic from AsyncStorage
          "user-id": userId,         // Dynamic from AsyncStorage
          "site-id":  societyId     // If siteId is not available, fallback to default
        })
      };

    try {
      const response = await axios.get(`${API_URL}/v3/teams?`, { params,headers, withCredentials: true });
    
    console.log(response.data,'this is data for teams')
      return response.data


    } catch (error) {
      console.error('Error fetching data from teams:', error);
      throw error; // Throw error to handle it later
    }
  } else {
    throw new Error('User information not found in AsyncStorage');
  }
};



