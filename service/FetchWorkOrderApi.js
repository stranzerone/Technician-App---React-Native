import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchServiceRequests = async (selectedFilter) => {
  try {
    // Fetch user info and uuid from AsyncStorage
    const userInfo = await AsyncStorage.getItem('userInfo');
const uuid = await AsyncStorage.getItem('uuid');


    if (!userInfo || !uuid) {
      throw new Error('User information or UUID not found in AsyncStorage');
    }

    // Parse userInfo and access data object inside it
    const parsedUserInfo = JSON.parse(userInfo);
    console.log(parsedUserInfo.data.id,"userInfo")

      // Extract user_id (id) and api_token
      const userId = parsedUserInfo.data.id; 
      const apiToken = parsedUserInfo.data.api_token;
    // const { id: userId, api_token: apiToken } = parsedUserInfo; // Corruserectly access the data object
//https://nppm-api.isocietymanager.com/v3/workorder/filter
    const apiUrl =` https://nppm-api.isocietymanager.com/v3/workorder/filter`
    // 'https://nppm-api.isocietymanager.com/v3/workorder/assigned/asset';
    
    // Log the selected filter for debugging
    console.log(selectedFilter, "Filter");

    // Define the parameters for the API call
    const params = {
      site_id: 2,
      breakdown1:false,
      breakdown2:false,
      asset_uuid: uuid,
      breakdown: false,
      Status: selectedFilter,
      page_no: 1,
      per_page: 10,
      user_id: userId,
      'api-token': apiToken,
    };


    const headers = {
      'Content-Type': 'application/json',
      'ism-auth': JSON.stringify({
        "api-token": apiToken,     // Dynamic from AsyncStorage
        "user-id": userId,         // Dynamic from AsyncStorage
        "site-id":  2     // If siteId is not available, fallback to default
      })
    };
    // Make the API request
    const response = await axios.get(apiUrl, { params,headers,withCredentials: true });

    // Check the response data
    const data = response.data.data;

    // Return the data if it's available, otherwise return false
    if (response.data.metadata.count) {
      return data;
    } else {
      return false;
    }

  } catch (error) {
    console.error('Error fetching data:', error.message || error);
    throw error; // Rethrow error to handle it later
  }
};
