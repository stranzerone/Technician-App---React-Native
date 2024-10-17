import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';




export const WorkOrderInfoApi = async (WoUuId) => {
  // Retrieve user information from AsyncStorage
  const userInfo = await AsyncStorage.getItem('userInfo');

  const parsedUserInfo = JSON.parse(userInfo);

 


  if (userInfo) {
    const userId = parsedUserInfo.data.id
    const apiToken = parsedUserInfo.data.api_token
    console.log(userId,apiToken,"ifo4")
    
    // Define the API endpoint
    const apiUrl = 'https://nppm-api.isocietymanager.com/v4/workorder';

    // Prepare the parameters for the API request
    const params = {
   
    
      uuid:WoUuId,
      site_id: 2,
      'api-token': apiToken,
      'user-id ':userId,
      'api-token': apiToken,
     'user-id ':userId,
    };

    try {
      // Make the API request using axios
      const response = await axios.get(apiUrl, { params});
     console.log(response)
      if(response){
        return response.data.data
      }

      // Log the count of metadata for debugging
    
    } catch (error) {
      console.error('Error fetching mm', error);
    }
  } 
};
