import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DeleteInstructionApi = async (item) => {
  console.log(item, "values"); // Check the values being passed

  // Fetch user info from AsyncStorage
  const userInfo = await AsyncStorage.getItem('userInfo');
  if (userInfo) {
    const { id: userId, api_token: apiToken } = JSON.parse(userInfo);
    const apiUrl = 'https://nppm-api.isocietymanager.com/v3/inst';

    // Make sure your params are set correctly
    const params = {
      ref_uuid: item.ref_uuid,
      ref_type: "WO"
    };

    const headers = {
      'Content-Type': 'application/json',
      'ism-auth': JSON.stringify({
        "api-token": apiToken, // Dynamic from AsyncStorage
        "user-id": userId,     // Dynamic from AsyncStorage
        "site-id": 2           // If siteId is not available, fallback to default
      })
    };

    try {
      // Send the DELETE request with params and headers
      const response = await axios.delete(apiUrl, {
        headers,
        params, // Include params here
        data: item // If you need to send item data, include it in the data field (optional)
      });

      console.log(response.data);

      // Check if the response is as expected
      if (response.data.message === 'Deleted') {
        return true; // Return success
      } else {
        return false; // Return failure
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Throw error to handle it later
    }
  } 
};
