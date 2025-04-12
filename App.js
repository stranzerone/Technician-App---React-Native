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
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './utils/Store/Store.js';
import MainNavigation from './MainNavigation.js';
import NfcManager from 'react-native-nfc-manager';
NfcManager.start();

const App = () => {
  const [nfcEnabled, setNfcEnabled] = useState(null);
  const [showNfcModal, setShowNfcModal] = useState(false);

  useEffect(() => {
    const checkNfcStatus = async () => {
      try {
        const isSupported = await NfcManager.isSupported();
        if (!isSupported) {
          return;
        }

        const isEnabled = await NfcManager.isEnabled();
        setNfcEnabled(isEnabled);

        if (!isEnabled) {
          setShowNfcModal(true); // Show the modal if NFC is not enabled
        }

      } catch (error) {
        console.error('Error checking NFC status:', error);
      }
    };

    checkNfcStatus();

    // Cleanup NFC manager when component unmounts
    return () => {
     
    };
  }, []);

 
  const handleEnableNfc = () => {
    if (Platform.OS === 'android') {
      NfcManager.goToNfcSetting();
      setShowNfcModal(false); // Close the modal after opening NFC settings
    } else {
      setShowNfcModal(false); // Close the modal after showing the alert
    }
  };

  const handleProceedWithoutNfc = () => {
    setShowNfcModal(false); // Close the modal if the user chooses to proceed without NFC
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <View style={{ flex: 1 }}>
          <MainNavigation />
          {showNfcModal && (
            <Modal
              visible={showNfcModal}
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
                    Please enable NFC to continue or proceed without it.
                  </Text>
                  <TouchableOpacity
                    style={styles.enableButton}
                    onPress={handleEnableNfc}
                  >
                    <Text style={styles.buttonText}>Enable NFC</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.enableButton, { backgroundColor: '#1996D3', marginTop: 10 }]} // Alternate button style
                    onPress={handleProceedWithoutNfc}
                  >
                    <Text style={styles.buttonText}>Proceed Without NFC</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </View>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker background for better contrast
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 30,
    elevation: 10, // Shadow for Android
    shadowColor: '#000', // iOS Shadow
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 10 },
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#1996D3',
  },
  popupTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#074B7C', // Dark color for title
    marginBottom: 15,
  },
  popupText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 25,
  },
  enableButton: {
    backgroundColor: '#074B7C', // Dark blue
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
