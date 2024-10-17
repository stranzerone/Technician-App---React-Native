import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GetInstructionsApi = async (WoUuId) => {
  const userInfo = await AsyncStorage.getItem('userInfo');

  console.log(WoUuId,"from api of getinst")
  if (userInfo) {

    const parsedUserInfo = JSON.parse(userInfo);
    const userId = parsedUserInfo.data.id
    const apiToken = parsedUserInfo.data.api_token
    const apiUrl = 'https://nppm-api.isocietymanager.com/v3/insts';
    const params = {
        ref_uuid:WoUuId,
        ref_type:"WO"
      
    };
console.log(params,"api parmas")

    const headers = {
        'Content-Type': 'application/json',
        'ism-auth': JSON.stringify({
          "api-token": apiToken,     // Dynamic from AsyncStorage
          "user-id": userId,         // Dynamic from AsyncStorage
          "site-id":  2     // If siteId is not available, fallback to default
        })
      };

    try {
      const response = await axios.get(apiUrl, { params,headers, withCredentials: true });
      const data = response.data.data
     console.log(data.type,"api")
  if(response.data.metadata.count){
    return data; // Return the relevant data

  }else{
    return  false
  }

    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Throw error to handle it later
    }
  } else {
    throw new Error('User information not found in AsyncStorage');
  }
};



