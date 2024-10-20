import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UpdateInstructionApi = async ({id, value , remark,type},WoUuId) => {
  console.log(id, value,remark,WoUuId, type,"values"); // Check the values being passed

  // Fetch user info from AsyncStorage
  const userInfo = await AsyncStorage.getItem('userInfo');
  const parsedUserInfo = JSON.parse(userInfo);
  if (userInfo) {
    const userId = parsedUserInfo.data.id;
    const apiToken = parsedUserInfo.data.api_token
    const apiUrl = 'https://nppm-api.isocietymanager.com/v3/inst';
console.log(WoUuId,"at Update APi")
    // Make sure your params are set correctly
    const params = {
      ref_uuid: WoUuId,
      ref_type: "WO"
    };

    console.log("Id",id,"Value",value,"Remark",remark,WoUuId,'payload')
    let payload
    // Construct the payload correctly
  

    if(type == "image/jpeg"){
       payload = {
        id: id,      // Ensure this is the correct field your API expects
        image: value ,// Ensure this is the correct field your API expects
        remarks:remark
      };
    }else{
      payload = {
        id: id,      // Ensure this is the correct field your API expects
        result: value ,// Ensure this is the correct field your API expects
        remarks:remark
      };
    }


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
      const response = await axios.put(apiUrl, payload, { params, headers, withCredentials: true });
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
