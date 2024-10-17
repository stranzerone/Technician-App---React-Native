import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AddInstructionApi = async (instructionData) => {
  console.log(instructionData, "values"); // Check the values being passed

  // Fetch user info from AsyncStorage
  const userInfo = await AsyncStorage.getItem('userInfo');
  const uuid = await AsyncStorage.getItem('uuid');
  const parsedUserInfo = JSON.parse(userInfo);

 


  if (userInfo) {
    const userId = parsedUserInfo.data.id
    const apiToken = parsedUserInfo.data.api_token
    const apiUrl = 'https://nppm-api.isocietymanager.com/v3/inst';

    // Make sure your params are set correctly
    const params = {
      ref_uuid: "e9bd2c33-eb04-4da1-95fb-545c5a318731",
      ref_type: "WO"
    };


    // Construct the payload correctly
    const payload = {
      options:instructionData.options,
        created_by: userId,
        order:instructionData.order + 1,
        ref_type: "WO",
       ref_uuid: "3cf20c8a-38b8-4778-8135-b2578cd7ce08",
        result: "",
        title:instructionData.title,
        type : instructionData.type,
        wo_uuid :  "3cf20c8a-38b8-4778-8135-b2578cd7ce08",
        remarks:''
    };
    console.log(payload,'payload')


    const headers = {
      'Content-Type': 'application/json',
      'ism-auth': JSON.stringify({
        "api-token": apiToken, // Dynamic from AsyncStorage
        "user-id": userId,     // Dynamic from AsyncStorage
        "site-id": 2           // If siteId is not available, fallback to default
      })
    };

    try {
      // Send the PUT request
      const response = await axios.post(apiUrl, payload, { params, headers, withCredentials: true });
console.log(response.data)
      // Check if the response is as expected
      if (response.data.status === 'success') {
        return true; // Return success
      } else {
        console.error('API response status was not success:', response.data);
        return false; // Return failure
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Throw error to handle it later
    }
  } else {
    throw new Error('User information not found in AsyncStorage');
  }
};
