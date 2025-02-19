import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL2 } from '@env';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL2,
  timeout: 5000, // Set a timeout for the request
});

// Login API call
export const loginApi = async (user) => {
  // Construct the payload based on the presence of userId
  const payload = {
    identity: user.email,
    password: user.password,
    tenant: 0,
    ...(user.user?.user_id && { user_id: user.user.user_id }),
  };


  console.log(user,payload,'this is login issue')
  try {
    const { data } = await axios.post(API_URL2+'/login', payload);

    if (data.message === 'Login Successful.') {
      const { role } = data.data;

      // Check authorization for specific roles
      if (
        ['groundstaff', 'admin', 'supervisor'].includes(role)
      ) {
        // Store token and user info asynchronously
        await AsyncStorage.setItem('userInfo', JSON.stringify(data));

        return data; // Return the successful response
      }

      // Unauthorized access
      return {
        message: 'You are not authorized to log in. Only Admins or Staff members are allowed.',
      };
    }

    // Handle unsuccessful login attempts
    return data;
  } catch (error) {
    // Handle network or API errors
  console.error(error)
    return {
      status: 'error',
      message: error,
    };
  }
};
