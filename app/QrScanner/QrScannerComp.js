import React, { useState, useLayoutEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
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
      console.log(uuid, "UUID stored successfully!");

      // Call onRefresh if provided
      if (onRefresh) {
        onRefresh();
      }

      // Wait for a short time before navigating
      setTimeout(() => {
    // Assuming `uuid` is the variable containing your UUID
    console.log(uuid,"sending to route")
navigation.navigate("Work Order List", { paramUuId : uuid });

        setScanned(false); // Reset scanned to allow scanning again
      }, 1000); // Delay navigation to ensure smooth transition

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
