import React, { useState, useLayoutEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DynamicPopup from "../DynamivPopUps/DynapicPopUpScreen";

export default function QrScanner({ onRefresh }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('error');
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
    console.log(data, 'UUID data');
    const type = data.split("=")[1];
    const uuid = data.split("=")[2];
    console.log(`Scanned data: ${uuid}, type = ${type}`);

    try {
      if (data.includes('app.factech')) {
        // Store the latest UUID and type in AsyncStorage
        await AsyncStorage.setItem('uuid', uuid);
        await AsyncStorage.setItem('type', type);

        console.log(`Stored UUID: ${uuid}, type: ${type}`);

        setScanned(false); // Allow scanning again
        navigation.navigate("ScannedWoTag", { uuid, type });
      } else {
        console.log(data, "not related");
        setPopupMessage("QR Code is not related to site. Please scan a valid QR.");
        setPopupType("error");
        setPopupVisible(true);
        setScanned(false); // Allow scanning again
      }
    } catch (error) {
      console.error("Failed to store UUID:", error);
      setScanned(false); // Allow scanning again in case of an error
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


      <View ></View>
      {/* Dynamic Popup */}
      <DynamicPopup
        visible={popupVisible}
        type={popupType}
        message={popupMessage}
        onOk={() => setPopupVisible(false)}
        onClose={() => setPopupVisible(false)}
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
    height:"150%",
    marginTop:20,
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
