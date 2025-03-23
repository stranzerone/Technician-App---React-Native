import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, SafeAreaView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import accessDeniedImage from '../../assets/SvgImages/qrcode_logo.png';
import QrScanner from '../QrScanner/QrScannerComp';
import { useNavigation } from '@react-navigation/native';
const { height, width } = Dimensions.get('window');

const AccessDeniedScreen = ({onRefresh}) => {
  const [qrVisible, setQrVisible] = useState(false);
  const qrHeight = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
 const [openScaner,setOpenScaner] = useState(false)
 const navigation = useNavigation();


  const toggleQrContainer = () => {
    setOpenScaner(!openScaner)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: qrVisible ? 1 : 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: qrVisible ? 1 : 0.8,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(qrHeight, {
        toValue: qrVisible ? 0 : height * 0.45,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start(() => setQrVisible(!qrVisible));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Animated.View style={[styles.qrContainer, { height: qrHeight }]}>
          {openScaner?
          
          <QrScanner  onRefresh={onRefresh} />:null
}
        </Animated.View>

        {!qrVisible && (
          <Animated.View style={[styles.imageContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            <Image source={accessDeniedImage} style={styles.accessDeniedImage} />
          </Animated.View>
        )}

        <View style={styles.headerContainer}>
          <Text style={styles.header}>
            {qrVisible ? "Scanning..." : (
           null
            )}
          </Text>
        </View>

        <Text style={styles.message}>
          {qrVisible ? "Hold your device over the QR code to scan." : "You need to scan a QR code or touch NFC Tag to proceed."}
        </Text>

        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('QRCode')}>
          <Text>
          <MaterialIcons name="qr-code" size={24} color="#FFFFFF" />

          </Text>
          <Text style={styles.buttonText}>
            {qrVisible ? "Close Scanner" : "Scan QR Code"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imageContainer: {
    backgroundColor: 'rgba(173, 216, 230, 0.4)',
    height:'30%',
    borderTopRightRadius: 200,
    borderTopLeftRadius: 200,
    alignItems: 'center',
  },
  accessDeniedImage: {
    width: width * 0.6,
    height: height * 0.3,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#074B7C',
    marginLeft: 10,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  accessDeniedText: {
    marginLeft: 5,
  },
  message: {
    fontSize: 16,
    color: '#333',
    marginVertical: 10,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: '#074B7C',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  qrContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1996D3',
    overflow: 'hidden',
  },
});

export default AccessDeniedScreen;
