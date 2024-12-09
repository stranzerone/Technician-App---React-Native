import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GetStaff = async (text) => {
  console.log(text, "text received");
  try {
    const userInfo = await AsyncStorage.getItem('userInfo');

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

    const baseUrl = "https://api.isocietymanager.com/nonresidents";
    const response = await axios.get(baseUrl, { headers });

    // Check if text exists and is not an empty string
    if (text && text.trim()) {
      // Filter the response data based on the received text
      const filteredNames = response.data.data.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      return filteredNames; // Return the filtered names
    }

    // If no text is provided, return the full response data
    return response.data.data;

  } catch (error) {
    console.error("Error fetching assets:", error.message || error);
    throw error;
  }
};

export default GetStaff;
