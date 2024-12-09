import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';



export const WorkOrderComments = async (WoUuId) => {
  const userInfo = await AsyncStorage.getItem('userInfo');
  const parsedUserInfo = JSON.parse(userInfo);

 


  if (userInfo) {
    const userId = parsedUserInfo.data.id
    const apiToken = parsedUserInfo.data.api_token
    const apiUrl = 'https://nppm-api.isocietymanager.com/v3/comments?';

    const params = {
 
      ref_uuid:WoUuId,
      type:"WO",
      order:"desc",
      page_no:1,
      per_page:100,
      tag:"C",
      'api-token': apiToken,
      'user-id':userId,
      'api-token': apiToken,
      'user-id':userId,
      
    };



    const headers = {
      'Content-Type': 'application/json',
      'ism-auth': JSON.stringify({
        "api-token": apiToken,     // Dynamic from AsyncStorage
        "user-id": userId,         // Dynamic from AsyncStorage
        "site-id":  2     // If siteId is not available, fallback to default
      })
    };


    try {
      const response = await axios.get(apiUrl, { params,headers,withCredentials:true});
      const data = response.data.data
console.log(response.data.data[0])

  if(response.data != null){
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



