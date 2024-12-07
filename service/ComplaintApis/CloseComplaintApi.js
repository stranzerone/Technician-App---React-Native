import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CloseComplaintApi = async (data,otp) => {
  const userInfo = await AsyncStorage.getItem('userInfo');

  console.log(data,"data for closing complaint")
  if (userInfo) {

    const parsedUserInfo = JSON.parse(userInfo);
    const userId = parsedUserInfo.data.id
    const apiToken = parsedUserInfo.data.api_token
    const societyId =parsedUserInfo.data.societyId

    const apiUrl = 'https://api.isocietymanager.com/staff/updatecomplaint';

     const params = {
    "user-id":userId,
    "api-token":apiToken,
      
    };

const payload ={
ask_otp: 0,
"amount": data.amount,
"createdDate": data.createdDate,
"description": data.description,
"id": data.id,
"name": data.name,
otp:otp,
status: "Closed",
}

console.log(payload,"payload")
console.log(data,'data')
    const headers = {
        'Content-Type': 'application/json',
        'ism-auth': JSON.stringify({
          "api-token": apiToken,     // Dynamic from AsyncStorage
          "user-id": userId,         // Dynamic from AsyncStorage
          "site-id":  societyId     // If siteId is not available, fallback to default
        })
      };

    try {
      const response = await axios.put(apiUrl,payload,{ params,headers});

     console.log(response.data,"this is response for closing")
      return response.data


    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Throw error to handle it later
    }
  } else {
    throw new Error('User information not found in AsyncStorage');
  }
};



