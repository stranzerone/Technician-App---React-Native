import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GetNotificationsApi = async (page = 1) => { // Default page to 1 if not provided
  try {
    const userInfo = await AsyncStorage.getItem('userInfo');
    

    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      const userId = parsedUserInfo.data.id;
      const apiToken = parsedUserInfo.data.api_token;

      const apiUrl = 'https://api.isocietymanager.com/getmynotifications';
      
      // Set up query parameters
      const params = {
        "api-token": apiToken,
        "user-id": userId,
        "site-id": 2, // If siteId is not available, fallback to default
        "per_page": 10,
        "page_no": page // Use the page parameter passed to the function
      };

      // Make the API request
      const response = await axios.get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
        params, // Use params to set query parameters
        withCredentials: true
      });

      const data = response.data;
      return data; // Return the relevant data
    } else {
      console.error("User info not found in AsyncStorage");
      throw new Error("User info not found");
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Throw error to handle it later
  }
};
