import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

// const API_URL = 'https://nppm-api.isocietymanager.com/v3/workorder';



export const submitWorkOrder = async (workOrderData) => {
  console.log(workOrderData,"recieved payload")

  try {
    const userInfo = await AsyncStorage.getItem('userInfo');
    console.log(userInfo, "info");

    if (!userInfo) {
      throw new Error("User info not found");
    }

    const parsedUserInfo = JSON.parse(userInfo);
    const userId = parsedUserInfo.data.id;
    const apiToken = parsedUserInfo.data.api_token;
    const societyId =parsedUserInfo.data.societyId
    const headers = {
      'Content-Type': 'application/json',
      'ism-auth': JSON.stringify({
        "api-token": apiToken,
        "user-id": userId,
        "site-id": societyId
      })
    };

        const payload = {
      "Name": workOrderData.name,
      "Type": workOrderData.type,
      "Asset": workOrderData.asset.Name,
      // "Assigned": workOrderData.user,
      "Due Date": workOrderData.dueDate,
      "Estimated Time": workOrderData.estimatedTime,
      "Priority": workOrderData.priority.Value,
      "user_id": userId,
      "asset_uuid": workOrderData.asset.uuid,
      "breakdown": false,
      "Status": "OPEN",
      "status_uuid": "bac5f1f1-78c3-4d51-85cf-249e2f09b775",
      "site_uuid": workOrderData.asset.site_uuid,
      "created_by": userId
    };

    console.log(payload, "payload");

    // Pass payload as the second argument and headers as the third argument
    const response = await axios.post(`${API_URL}/v3/workorder`, payload, { headers });
    console.log(response.data, "response for adding");

    return response.data; // Return the response data if needed
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
