import axios from 'axios';

const validateOtp = async (id, otp) => {
  console.log(id, otp, "payload on API validate");
  try {
    const response = await axios.post('https://api.isocietymanager.com/validateotp', {
      id: id,
      otp: otp,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(response.data, "API response"); // Log the response data

    // Return the response data
    return response.data; // Adjust based on the structure of the API response
  } catch (error) {
    console.log(response)
    console.error('Error validating OTP:', error);
    throw error; // Re-throw error to handle it in the calling function
  }
};

export default validateOtp;
