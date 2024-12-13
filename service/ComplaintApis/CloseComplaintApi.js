import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL2 } from '@env';

export const CloseComplaintApi = async (data, otp) => {
  const userInfo = await AsyncStorage.getItem('userInfo');

  if (userInfo) {
    const parsedUserInfo = JSON.parse(userInfo);
    const userId = parsedUserInfo.data.id;
    const apiToken = parsedUserInfo.data.api_token;
    const societyId = parsedUserInfo.data.societyId;


    const params = {
      "user-id": userId,
      "api-token": apiToken,
    };


    
    console.log(data.ask_otp,"check otp required or not")

let payload
if(data.ask_otp == -1){
console.log("no otp required")
   payload = {
    ...data, 
    status: "Closed",
   
  };
}else{

   payload = {
    ...data, 
    status: "Closed",
    otp
  };
}

    console.log(otp, "otp");
    console.log(payload, 'data after adding otp as a separate field');

    const headers = {
      'Content-Type': 'application/json',
      'ism-auth': JSON.stringify({
        "api-token": apiToken,  
        "user-id": userId,     
        "site-id": societyId 
      }),
    };
    // const apiUrl = 'https://api.isocietymanager.com/staff/updatecomplaint';

    try {
      const response = await axios.put(`${API_URL2}/staff/updatecomplaint`, payload, { params, headers });
      console.log(response.data, "this is response for closing");
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Throw error to handle it later
    }
  } else {
    throw new Error('User information not found in AsyncStorage');
  }
};
