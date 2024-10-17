import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import otpSvg from "../../../assets/SvgImages/otp.png";
import validateOtp from '../../../service/LoginWithOtp/ValidateOtpApi'; // Adjust the path accordingly
import { useNavigation } from '@react-navigation/native';
import DynamicPopup from '../../DynamivPopUps/DynapicPopUpScreen';
const OtpPage = ({ route }) => {
  const data = route.params.response.data;
  const [otp, setOtp] = useState(['', '', '', '']);
  const [activeInputIndex, setActiveInputIndex] = useState(null);
  const [timeLeft, setTimeLeft] = useState(data.expire_in); // Set timeLeft to expire_in
  const [attemptsRemaining, setAttemptsRemaining] = useState(data.try); // Set attemptsRemaining to data.try
  const [popupVisible, setPopupVisible] = useState(false); // For controlling DynamicPopup visibility
  const [popupData, setPopupData] = useState({ type: '', message: '' }); // Pop-up type and message
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0; // Stop countdown at 0
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, []);

  const handleChangeText = (text, index) => {
    if (text.length > 1) return; // Only allow single character input
    const newOtp = [...otp];
    newOtp[index] = text;

    setOtp(newOtp);

    if (text && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length === 4) {
      try {
        const response = await validateOtp(data.id, otpString); // Call validateOtp function
      
        console.log(response,"enter otp response ui")
        if (response.status === 'success') {
          setPopupData({
            type: 'success',
            message: 'OTP Verified Successfully!',
          });
        
            navigation.navigate('Home'); // Navigate after successful verification
        
        } else {
          setPopupData({
            type: 'error',
            message: 'Invalid OTP. Please try again.',
          });
          setPopupVisible(true);
          setAttemptsRemaining((prev) => Math.max(prev - 1, 0)); // Decrease attempts
        }
      } catch (error) {
        setPopupData({
          type: 'error',
          message: 'Failed to verify OTP. Please try again later.',
        });
        setPopupVisible(true);
      }
    } else {
      setPopupData({
        type: 'warning',
        message: 'Please enter a valid 4-digit OTP.',
      });
      setPopupVisible(true);
      setAttemptsRemaining((prev) => Math.max(prev - 1, 0)); // Decrease attempts
    }
  };

  const formatTimeLeft = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer} />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.imageUriContainer}>
            <Image source={otpSvg} style={styles.imageUri} resizeMode="contain" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.headingOTP}>ENTER OTP</Text>
            <Text style={styles.paraOTP}>
              Please enter the OTP sent to your phone number: {data.phoneNumber}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                style={[styles.input, activeInputIndex === index && styles.inputActive]}
                placeholder="-"
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChangeText(text, index)}
                onFocus={() => {
                  setActiveInputIndex(index);
                  if (!digit) setOtp((prev) => {
                    const newOtp = [...prev];
                    newOtp[index] = ''; // Clear input if focused
                    return newOtp;
                  });
                }}
                onBlur={() => setActiveInputIndex(null)}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.verifyOtpButton}
            onPress={handleVerifyOtp}
            disabled={timeLeft === 0 || attemptsRemaining === 0} // Disable if time expired or attempts are over
          >
            <Text style={styles.verifyOtpButtonText}>Verify OTP</Text>
          </TouchableOpacity>

          <View style={styles.textContainer}>
            <Text style={styles.timerText}>Expires in: {formatTimeLeft(timeLeft)}</Text>
            <Text style={styles.attemptsText}>Attempts remaining: {attemptsRemaining}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.bottomContainer} />

      {/* Dynamic Popup for OTP Verification */}
      <DynamicPopup
        visible={popupVisible}
        type={popupData.type}
        message={popupData.message}
        onClose={() => setPopupVisible(false)}
        onOk={() => setPopupVisible(false)}
      />
    </SafeAreaView>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  topContainer: {
    height: '10%',
    borderBottomEndRadius: 70,
    width: '100%', // Full width
    backgroundColor: '#1996D3',
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  bottomContainer: {
    height: '10%',
    width: '100%', // Full width
    borderTopLeftRadius: 70,
    backgroundColor: '#1996D3',
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: -1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '10%',
    paddingBottom: '10%',
  },
  imageUriContainer: {
    height: '25%', // Adjusted size for better proportions
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageUri: {
    width: 150, // Adjusted size
    height: 150, // Adjusted size
    borderRadius: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20, // Reduced margin for compactness
  },
  headingOTP: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#074B7C',
  },
  paraOTP: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6c757d',
    marginTop: 8,
  },
  timerText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#FF5722', // Color for the timer
    marginTop: 8,
  },
  attemptsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#FF5722', // Color for attempts remaining
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    width: '80%', // Adjust as necessary
    marginBottom: 20,
  },
  input: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#1996D3',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 24,
    backgroundColor: 'white',
  },
  inputActive: {
    borderWidth: 2,
    borderColor: '#1996D3',
  },
  verifyOtpButton: {
    width: '80%',
    padding: 14,
    alignSelf: 'center',
    backgroundColor: '#1996D3',
    borderRadius: 12,
    alignItems: 'center',
  },
  verifyOtpButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default OtpPage;
