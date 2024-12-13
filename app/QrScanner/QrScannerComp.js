import React, { useState, useLayoutEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import DynamicPopup from "../DynamivPopUps/DynapicPopUpScreen";

export default function QrScanner({onRefresh}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);  // State for popup visibility
  const [popupMessage, setPopupMessage] = useState('');     // State for popup message
  const [popupType, setPopupType] = useState('error');      // State for popup type (error, success, etc.)
  const navigation = useNavigation();

  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useLayoutEffect(() => {
    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = async ({ data }) => {
    setScanned(true);
    console.log(data,'uuid data')
    const uuid = data.split("=")[2];
    console.log(`Scanned data: ${uuid}`);

    // Store UUID in AsyncStorage
    try {
   

  
    console.log(uuid,"sending to route")

if(data.includes('app.factech')){
  setScanned(false); // Reset scanned to allow scanning again

  navigation.navigate("ScannedWo", { uuid : uuid });
}else{
console.log(data,"not contain")
setScanned(false); // Reset scanned to allow scanning again

setPopupMessage("Qr Is Not Releated to app.factech, Scan a Valid Qr ");
setPopupType("error"); // Set the popup type to 'error'
setPopupVisible(true); // Display the popup


}

    } catch (error) {
      console.error("Failed to store UUID:", error);
      setScanned(false); // Reset scanned even if an error occurs
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Camera Container */}
      <View style={styles.cameraContainer}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf419"],
          }}
          style={styles.camera}
        />
      </View>
      <DynamicPopup
      visible={popupVisible}
      type={popupType}
      message={popupMessage}
      onOk={() => setPopupVisible(false)}  // Close the popup when OK is pressed

      onClose={() => setPopupVisible(false)}  // Close the popup when OK is pressed
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#f0f0f0',
  },
  cameraContainer: {
    width: "100%", 
    aspectRatio: 1, 
    borderRadius: 20, 
    overflow: "hidden", 
    borderWidth: 2,
    borderColor: '#074B7C', 
    backgroundColor: '#fff', 
    marginBottom: 20, 
  },
  camera: {
    flex: 1,
  },
});
