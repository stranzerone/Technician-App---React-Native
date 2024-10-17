import axios from 'axios';

export const otpLoginApi = async (phoneNumber) => {
  console.log(phoneNumber, "Phone Number");

  try {
    const response = await axios.post('https://api.isocietymanager.com/generateotp', {
      identity: phoneNumber, // Use the phoneNumber passed to the function
      app_roles: ['admin', 'groundstaff', 'supervisor', 'master', 'partner', 'ism_admin'], // Correct array syntax
    });
console.log(response.data,"api data")
    return response.data; // Return the data from the response
  } catch (error) {
    console.error('OTP API Error:', error);
    throw error; // Throw the error to be caught in the calling function
  }
};