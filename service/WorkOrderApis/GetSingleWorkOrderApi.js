import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GetSingleWorkOrders = async (uuid) => {
  console.log(uuid,"get single workOrders")
  try {
    // Fetch user info and uuid from AsyncStorage
    const userInfo = await AsyncStorage.getItem('userInfo');
// const uuid = await AsyncStorage.getItem('uuid');


    if (!userInfo) {
      throw new Error('User information or UUID not found in AsyncStorage');
    }

    // Parse userInfo and access data object inside it
    const parsedUserInfo = JSON.parse(userInfo);

      // Extract user_id (id) and api_token
      const userId = parsedUserInfo.data.id; 
      const apiToken = parsedUserInfo.data.api_token;
      const societyId =parsedUserInfo.data.societyId

      //
    const apiUrl ='https://nppm-api.isocietymanager.com/v3/workorder/assigned/asset';
    
    // Log the selected filter for debugging
//https://nppm-api.isocietymanager.com/v3/workorder/assigned/asset?asset_uuid=bac558c2-356c-424b-8e8e-552df3c56d05&breakdown=false&Status=OPEN&page_no=1&per_page=5
    // Define the parameters for the API call
    const params = {
      asset_uuid:uuid,
      breakdown: false,
      Status: "OPEN",
      page_no: 1,
      per_page: 10,
      user_id: userId,
      "api-token": apiToken,
     " user-id": userId,
      "api-token": apiToken,
      "user-id": userId
    };


    const headers = {
      'Content-Type': 'application/json',
      'ism-auth': JSON.stringify({
        "api-token": apiToken,     // Dynamic from AsyncStorage
        "user-id": userId,         // Dynamic from AsyncStorage
        "site-id":  societyId     // If siteId is not available, fallback to default
      })
    };
    // Make the API request
    const response = await axios.get(apiUrl, { params,headers,withCredentials: true });
    // Check the response data
    console.log(response.data,"api called")
    const data = response.data.data;

  return data

  } catch (error) {
    console.error('Error fetching data:', error.message || error);
    throw error; // Rethrow error to handle it later
  }
};
