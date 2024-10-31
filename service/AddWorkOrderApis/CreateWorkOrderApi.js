import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://your-api-url.com/api/workorders'; // Replace with your actual API URL

export const submitWorkOrder = async (workOrderData) => {
  
  try {
    const userInfo = await AsyncStorage.getItem('userInfo');
console.log(userInfo,"info")
    if (!userInfo) {
      throw new Error("User info not found");
    }

    const parsedUserInfo = JSON.parse(userInfo);
    const userId = parsedUserInfo.data.id;
    const apiToken = parsedUserInfo.data.api_token;

    const headers = {
      'Content-Type': 'application/json',
      'ism-auth': JSON.stringify({
        "api-token": apiToken,
        "user-id": userId,
        "site-id": 2
      })
    };

//{"asset": "computer 2", "dueDate": 2024-10-30T14:24:00.000Z, "estimatedTime": "5", "name": "Testing", "user": ["Sahil Mulani"]}
    const payload = {
      "Name": workOrderData.name,
      "Type": workOrderData.type,
      "Asset":workOrderData.asset.name ,
      "Assigned":workOrderData.user ,
      "Due Date":workOrderData.dueDate ,
      "Estimated Time": workOrderData.dueDate,
      "Priority": workOrderData.priority,
      "user_id": userId,
      "asset_uuid": workOrderData.asset.site_uuid,
      "breakdown": false,
      "Status": "OPEN",
      "status_uuid": "bac5f1f1-78c3-4d51-85cf-249e2f09b775",
      "site_uuid": "415a06d6-9059-4233-b89d-7953ff7ba79d",
      "created_by":userId
  }

    const response = await axios.post(API_URL, workOrderData,payload ,{ headers });
console.log(response,"response for adding")
    return response.data; // Return the response data if needed
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
