import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Platform,
  Modal,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Provider } from 'react-redux';
import store from './utils/Store/Store.js'; // Path to your Redux store
import MainNavigation from './MainNavigation.js'; // Path to your MainNavigation
import NfcManager from 'react-native-nfc-manager';

// Pre-step, call this before any NFC operations
NfcManager.start();

const App = () => {
  const [nfcEnabled, setNfcEnabled] = useState(null);
  const [nfcSupported, setNfcSupported] = useState(true);

  useEffect(() => {
    const checkNfcStatus = async () => {
      try {
        const isSupported = await NfcManager.isSupported();
        setNfcSupported(isSupported);

        if (isSupported) {
          const isEnabled = await NfcManager.isEnabled();
          console.log(`NFC Enabled: ${isEnabled}`);
          setNfcEnabled(isEnabled);
        } else {
          console.log('NFC is not supported on this device.');
        }
      } catch (error) {
        console.error('Error checking NFC status:', error);
      }
    };

    checkNfcStatus();

    // Check NFC status every 5 seconds
    const intervalId = setInterval(checkNfcStatus, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleEnableNfc = () => {
    if (Platform.OS === 'android') {
      NfcManager.goToNfcSetting(); // Redirect to NFC settings on Android
    } else {
      alert('Please enable NFC from your iPhone settings.');
    }
  };

  if (!nfcSupported || nfcEnabled) {
    // If NFC is not supported or enabled, return MainNavigation
    return (
      <Provider store={store}>
        <MainNavigation />
      </Provider>
    );
  }

  if (nfcEnabled === null) {
    // While checking NFC status, show a loader
    return (
      <View style={styles.centeredContainer}>
        <Text>Checking NFC status...</Text>
      </View>
    );
  }

  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <MainNavigation />
        {!nfcEnabled && (
          <Modal
            visible={!nfcEnabled}
            transparent
            animationType="fade"
            onRequestClose={() => {}}
          >
            <View style={styles.modalBackground}>
              <View style={styles.popupContainer}>
                <Image
                  source={require('./assets/SvgImages/fm.jpg')} // Replace with the path to your NFC icon/logo
                  style={styles.logo}
                />
                <Text style={styles.popupTitle}>Enable NFC</Text>
                <Text style={styles.popupText}>
                  NFC is not enabled. Please enable it in your settings to
                  continue.
                </Text>
                <TouchableOpacity
                  style={styles.enableButton}
                  onPress={handleEnableNfc}
                >
                  <Text style={styles.buttonText}>Enable NFC</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  popupText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  enableButton: {
    backgroundColor: '#074B7C', // Replace with your preferred theme color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
