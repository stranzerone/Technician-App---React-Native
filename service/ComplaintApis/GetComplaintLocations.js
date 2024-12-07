import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GetComplaintLocations = async () => {
  const userInfo = await AsyncStorage.getItem('userInfo');
console.log("getting complaint locations")
  if (userInfo) {

    const parsedUserInfo = JSON.parse(userInfo);
    const userId = parsedUserInfo.data.id
    const apiToken = parsedUserInfo.data.api_token
    const apiUrl = 'https://api.isocietymanager.com/getAllCustomAndCommonArea';

    const params = {
    "user-id":userId,
    "api-token":apiToken,
    };


    try {
      const response = await axios.get(apiUrl, { params });

      console.log("api call for complaints",response)
      return response.data


    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Throw error to handle it later
    }
  } else {
    throw new Error('User information not found in AsyncStorage');
  }
};



