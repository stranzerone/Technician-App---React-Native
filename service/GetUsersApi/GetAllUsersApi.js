import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL2 } from '@env';

export const getAllUsersApi = async () => {
  const userInfo = await AsyncStorage.getItem('userInfo');
console.log("get all users",userInfo)
  if (userInfo) {

    const parsedUserInfo = JSON.parse(userInfo);
    const userId = parsedUserInfo.data.id
    const apiToken = parsedUserInfo.data.api_token
    const societyId =parsedUserInfo.data.societyId
    // const apiUrl = 'https://api.isocietymanager.com/nonresidents?';

     const params = {
    "user-id":userId,
    "api-token":apiToken,
      
    };
console.log(params,"api parmas for redux complaint call")

    const headers = {
        'Content-Type': 'application/json',
        'ism-auth': JSON.stringify({
          "api-token": apiToken,     // Dynamic from AsyncStorage
          "user-id": userId,         // Dynamic from AsyncStorage
          "site-id":  societyId     // If siteId is not available, fallback to default
        })
      };

    try {
      const response = await axios.get(`${API_URL2}/nonresidents`, { params,headers, withCredentials: true });
      console.log("data from sers api ",response.data,'data from api users')
      return response.data


    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Throw error to handle it later
    }
  } else {
    throw new Error('User information not found in AsyncStorage');
  }
};



