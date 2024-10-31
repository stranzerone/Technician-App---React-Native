import axios from 'axios';

const validateOtp = async (id, otp) => {
  try {
    const response = await axios.post('https://api.isocietymanager.com/validateotp', {
      id: id,
      otp: otp,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });


    // Return the response data
    return response.data; // Adjust based on the structure of the API response
  } catch (error) {
    console.error('Error validating OTP:', error);
    throw error; // Re-throw error to handle it in the calling function
  }
};

export default validateOtp;
