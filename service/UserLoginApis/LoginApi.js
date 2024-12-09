import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for the API
const BASE_URL = 'https://api.isocietymanager.com'; // Ensure this is the correct URL

// Login API call
export const loginApi = async (user) => {
  console.log(user);

  // Construct the payload based on the presence of userId
  let payload;
  if (user.user && user.user.user_id) {
    payload = {
      identity: user.email,
      password: user.password,
      tenant: 0,
      user_id: user.user.user_id // Make sure userId exists here
    };
  } else {
    payload = {
      identity: user.email,
      password: user.password,
      tenant: 0
    };
  }

  console.log(payload, "payload for login");

  try {
    // Call the API
    const response = await axios.post(`${BASE_URL}/login`, payload);

    // Debug: Log the full response to see the structure

    // Check if the login is successful
    if (response.data.message === 'Login Successful.') {
      // Store the token and user info in AsyncStorage
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));

      // Return the entire response, not just the status
      return response.data;
    } else {
      // Handle unsuccessful login attempts
      return response.data;
    }
  } catch (error) {
    // Handle network or API errors
    if (error.response) {
      console.error('API Error Response:', error.response);
      return {
        status: 'error',
        message: error.response.data.message || 'An error occurred during login.'
      };
    } else {
      console.error('Error Message:', error.message);
      return {
        status: 'error',
        message: 'Network error. Please try again later.'
      };
    }
  }
};
