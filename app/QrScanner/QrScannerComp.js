import React, { useState, useLayoutEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function QrScanner({onRefresh}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
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
    const uuid = data.split("=")[2];
    console.log(`Scanned data: ${uuid}`);

    // Store UUID in AsyncStorage
    try {
      await AsyncStorage.setItem('uuid', uuid);
      console.log(uuid,"UUID stored successfully!");
      onRefresh();
      console.log("page refreshed")
    } catch (error) {
      console.error("Failed to store UUID:", error);
    }

    // Navigate to WorkOrders screen
    navigation.navigate("Work Orders");
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
      {scanned && (
        <View style={styles.buttonContainer}>
          <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
        </View>
      )}
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
  buttonContainer: {
    marginTop: 20, 
    width: "60%", 
    alignSelf: "center", 
  },
});
