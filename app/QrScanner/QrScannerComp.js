import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DynamicPopup from "../DynamivPopUps/DynapicPopUpScreen";

export default function QrScanner({ onRefresh }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("error");
  const [showCamera, setShowCamera] = useState(false);
  const navigation = useNavigation();

  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useEffect(() => {
    getCameraPermissions();
   setShowCamera(true); // Delay camera rendering
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setScanned(false); // Reset scanning state when returning to screen
      setTimeout(() => setShowCamera(true), 2000); // Ensure camera shows after delay
    }, [])
  );

  const handleBarcodeScanned = async ({ data }) => {
    setScanned(true);
    const type = data.split("=")[1];
    const uuid = data.split("=")[2];

    try {
      if (data.includes("app.factech")) {
        await AsyncStorage.setItem("uuid", uuid);
        await AsyncStorage.setItem("type", type);


        setScanned(false);
        navigation.navigate("ScannedWoTag", { uuid, type });
      } else {
        setPopupMessage("QR Code is not related to site. Please scan a valid QR.");
        setPopupType("error");
        setPopupVisible(true);
        setScanned(false);
      }
    } catch (error) {
      console.error("Failed to store UUID:", error);
      setScanned(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showCamera ? (
        <View style={styles.cameraContainer}>
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "pdf419"],
            }}
            style={styles.camera}
          />
        </View>
      ) : (
        <Text>Loading Camera...</Text>
      )}

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
    backgroundColor: "#f0f0f0",
  },
  cameraContainer: {
    width: "100%",
    height: "150%",
    marginTop: 20,
    aspectRatio: 1,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#074B7C",
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
});
