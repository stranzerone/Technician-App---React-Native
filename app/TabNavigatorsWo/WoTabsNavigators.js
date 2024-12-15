import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import WorkOrdersMainScreen from '../WorkOrderStack/WoDynamicTabScreen';
import BuggyListTopTabs from '../BuggyListTopTabs/BuggyListTopTabs';
import WorkOrderHomeTab from '../WorkOrderStack/WoDynamicTabScreen';
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';
import GetUuIdForTag from '../../service/NfcTag/GetUuId';
import { useEffect,useState } from 'react';
const Stack = createStackNavigator();

// Main stack navigator for your application
const WorkOrderStack = () => {

  const navigation = useNavigation();
  const [nfcEnabled, setNfcEnabled] = useState(false);
  useEffect(() => {
    const initNfc = async () => {
      try {
        const isSupported = await NfcManager.isSupported();
        if (!isSupported) {
          console.log('NFC is not supported on this device.');
          return;
        }

        await NfcManager.start(); // Initialize NFC
        const isEnabled = await NfcManager.isEnabled();
        setNfcEnabled(isEnabled);

        if (!isEnabled) {
          console.log('NFC is not enabled on this device.');
        }

        await NfcManager.setEventListener(NfcEvents.DiscoverTag, onTagDetected);
        await NfcManager.registerTagEvent();
      } catch (error) {
        console.error('Error initializing NFC:', error);
      }
    };

    initNfc();

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      NfcManager.unregisterTagEvent().catch((err) =>
        console.error('Error unregistering NFC tag event:', err)
      );
    };
  }, []);

  const onTagDetected = async (tag) => {
    try {
      if (!tag || !tag.id) {
        console.log('Invalid or missing NFC tag.');
        return;
      }
  
      console.log(tag.id, "this is tag id");
  
      const response = await GetUuIdForTag(tag.id.toLowerCase());
      console.log('NFC tag detected:', tag.id, response);
  
      if (response.status === 'success') {
        const count = response.metadata?.count;
        if (count === '0') {
          Alert.alert("No Asset Found Related to Tag");
        } else {
          const siteUuid = response.data[0]?.uuid;
          if (!siteUuid) {
            console.log('Invalid site_uuid in response data:', response.data[0]);
            return;
          }
          navigation.navigate('ScannedWoTag', { uuid:siteUuid });
        }
      } else {
        console.log('Invalid NFC tag or response');
      }
    } catch (error) {
      console.error('Error while detecting tag:', error);
      Alert.alert('Error', 'Something went wrong while processing the tag. Please try again.');
    }
  };














  
  return (
      <Stack.Navigator
        initialRouteName="Work Order List" // Set the initial screen here
        screenOptions={{
          headerShown: false, // Hide header if not needed
        }}
      >
        <Stack.Screen name="Work Order List" component={WorkOrdersMainScreen} />
        <Stack.Screen name="BuggyList" component={BuggyListTopTabs} />
        
        <Stack.Screen name="DynamicWo" component={WorkOrderHomeTab} />

      </Stack.Navigator>

  );
};

export default WorkOrderStack;
