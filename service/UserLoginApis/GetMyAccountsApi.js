import axios from 'axios';

export const GetMyAccounts = async (token) => {
  const baseUrl = 'https://api.isocietymanager.com/getmyaccounts';

  try {
    // Base URL

    // Construct the request URL with query parameters
    const requestUrl = `${baseUrl}?token=${token}`;
console.log(baseUrl+"?token="+token)
    // Make the GET request
    const response = await axios.get(requestUrl);
    console.log(response.data, "API data on OTP login get accounts");
    return response.data; // Return the data from the response
  } catch (error) {
    // Handle error
    console.error('Error fetching accounts:', error);
    throw error; // Re-throw the error for further handling
  }
};
