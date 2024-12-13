import { useNavigation, useEffect } from '@react-navigation/native';
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';
import GetUuIdForTag from '../../service/NfcTag/GetUuId';
import { fetchServiceRequests } from '../../service/FetchWorkOrderApi';

export default NfcHandler = async()=>{
  const [nfcEnabled, setNfcEnabled] = useState(false);

const navigation = useNavigation()
try{


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
      console.log(tag.id,"this is tag id")
       const response = await GetUuIdForTag(tag.id.toLowerCase());
      console.log('NFC tag detected:', tag.id, response);

      if (response.status === 'success') {
        if(response.metadata.count =='0'){
          Alert.alert("No Asset Found Related to Tag")
        }
        navigation.navigate('ScannedWoTag', { uuid: response.data[0].site_uuid});
      } else {
        console.log('Invalid NFC tag or response');
      }
    } catch (error) {
      console.error('Error handling NFC tag:', error);
    }
  };



}catch(error){
    console.log(error)
}

}