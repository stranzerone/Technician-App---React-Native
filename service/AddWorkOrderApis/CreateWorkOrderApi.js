import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

// const API_URL = 'https://nppm-api.isocietymanager.com/v3/workorder';



export const submitWorkOrder = async (workOrderData) => {

  try {
    const userInfo = await AsyncStorage.getItem('userInfo');
    const societyInfo = await AsyncStorage.getItem('societyInfo');


    if (!userInfo) {
      throw new Error("User info not found");
    }

    const parsedUserInfo = JSON.parse(userInfo);
    const userId = parsedUserInfo.data.id;
    const apiToken = parsedUserInfo.data.api_token;
    const societyId =parsedUserInfo.data.societyId
    const site_uuid =  JSON.parse(societyInfo);

    
    const headers = {
      'Content-Type': 'application/json',
      'ism-auth': JSON.stringify({
        "api-token": apiToken,
        "user-id": userId,
        "site-id": societyId
      })
    };

    console.log(workOrderData.dueDate,'this is the due date')
        const payload = {
      "Name": workOrderData.name,
      "Type": workOrderData.type,
      "Asset": workOrderData.asset?.Name || "", // If undefined, set it to an empty string
          // "Assigned": workOrderData.user,
      "Due Date": workOrderData.dueDate,
      "Estimated Time": workOrderData.estimatedTime,
      "Priority": workOrderData.priority,
      "user_id": userId,
      "asset_uuid": workOrderData.asset?.uuid || '',
      "breakdown": workOrderData.woType === "breakdown", 
      "Status": "OPEN",
      "status_uuid": "bac5f1f1-78c3-4d51-85cf-249e2f09b775",
      "site_uuid":site_uuid,
      "created_by": userId
    };


    // Pass payload as the second argument and headers as the third argument
    const response = await axios.post(`${API_URL}/v3/`+workOrderData.woType, payload, { headers });

    console.log(response.data,'this is response for adding wo')
    return response.data; // Return the response data if needed
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
