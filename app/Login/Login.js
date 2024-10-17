import React, { useLayoutEffect, useState } from 'react';
import { SafeAreaView, View, TextInput, Image, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { loginApi } from '../../service/LoginApi';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import technicianImage from '../../assets/SvgImages/Technician.png'; // Adjust the path to your technician image
import DynamicPopup from '../DynamivPopUps/DynapicPopUpScreen';
const NewLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // For showing loading state
  const [popupVisible, setPopupVisible] = useState(false); // For controlling popup visibility
  const [popupMessage, setPopupMessage] = useState(''); // For storing popup message

  const navigation = useNavigation();

  useLayoutEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userInfo = await AsyncStorage.getItem('userInfo');
      
        if (userInfo) {
          console.log("User Exists");
          navigation.navigate("Home"); // Navigate to the Home screen if userInfo exists
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    checkLoginStatus(); // Check login status on component mount
  }, [navigation]); // Add `navigation` to the dependency array

  const handleLogin = async () => {
    // Validation for empty fields
    if (!email || !password) {
      setPopupMessage('Email and Password are required.');
      setPopupVisible(true);
      return; // Exit if validation fails
    }

    try {
      setLoading(true);
      const response = await loginApi(email, password);

      // Debug: Log the full response

      // Check the status and navigate
      if (response && response.status == 'success') {
        // Save user info to AsyncStorage
        setEmail(''); // Clear email field
        setPassword(''); // Clear password field
        navigation.navigate('Home'); // Navigate to Home
      } else {
        console.log(response.data)
        setPopupMessage(response.message);
        
        setPopupVisible(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={technicianImage} // Use the imported image from assets
          style={styles.imageBackground}
          resizeMode="contain"
        />
      </View>

      {/* Place logo below the blue header container */}
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: "https://factech.co.in/fronts/images/Final_Logo_grey.png" }} // Replace with your logo image URL
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email Or Phone Number"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Row container for "Login with OTP" and "Forgot Password" */}
        <View style={styles.linkRowContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('OtpLogin')}
            style={styles.otpLoginLink}>
            <Text style={styles.otpLinkText}>Login with OTP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPasswordLink}>
            <Text style={styles.link}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading} // Disable button when loading
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dynamic Popup for displaying messages */}
      <DynamicPopup
        visible={popupVisible}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
        type={'warning'}
        onOk={()=> setPopupVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  headerContainer: {
    height: '30%', // Height for logo and SVG image section
    borderBottomRightRadius: 0, // Apply border radius for bottom right
    borderBottomLeftRadius: 200, // Apply border radius for bottom left
    overflow: 'hidden', // Ensures the border radius is applied
    flexDirection: 'row', // Align items in a row
    alignItems: 'flex-end', // Center items vertically
    backgroundColor: '#1996D3',
  },
  imageBackground: {
    position: "relative",
    left: 140,
    height: '100%', // Ensure the image takes the full height of the container
    width: '80%', // Ensure the image takes the full width of the container
  },
  logoContainer: {
    height: '10%', // Adjust as necessary
    justifyContent: 'center', // Center the logo vertically
    alignItems: 'center', // Center the logo horizontally
  },
  logoImage: {
    width: 120, // Make the logo smaller
    height: 40, // Adjust height as necessary
  },
  formContainer: {
    width: '100%',
    height: "50%", // Adjust as necessary for the form
    alignItems: 'center',
    display: 'flex',
    justifyContent: "start",
    paddingHorizontal: 20,
  },
  linkRowContainer: {
    flexDirection: 'row', // Align items in a row
    justifyContent: 'space-between', // Spread them apart
    width: '100%',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  otpLoginLink: {
    alignSelf: 'flex-start',
  },
  otpLinkText: {
    color: '#074B7C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
  },
  input: {
    width: Platform.OS === "ios" ? '85%' : "100%",
    color: "#074B7C",
    padding: 12,
    marginBottom: 16,
    borderColor: '#1996D3',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  loginButton: {
    width: Platform.OS === "ios" ? '80%' : "100%",
    padding: 14,
    backgroundColor: '#074B7C',
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: '#074B7C',
  },
  loginButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    color: '#074B7C',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default NewLoginScreen;
