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
  useEffect(() => {
    setShowCamera(true); // Delay camera rendering

    return () => {
      setShowCamera(false); // Delay camera rendering
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setShowCamera(true); // Delay camera rendering

      return () => {
        setShowCamera(false); // Delay camera rendering
      };
    }, [])
  );
  
  const isUUID = (str) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    console.log(uuidRegex.test(str),'this is uuid')
    return uuidRegex.test(str);
  };
  
  const handleBarcodeScanned = async ({ data }) => {
    setScanned(true);
    console.log(data,"this is data")
    console.log(data.v, "this is data.v")
    const type = data.split("=")[1];
    const uuid = data.split("=")[2];
    try {
      if (data.includes("app.factech")) {
        await AsyncStorage.setItem("uuid", uuid);
        await AsyncStorage.setItem("type", type);


        setScanned(false);
        navigation.navigate("ScannedWoTag", { uuid, type });
      } else if(isUUID(data)) {
        await AsyncStorage.setItem("uuid", data);
        await AsyncStorage.setItem("type", "AS");
        setScanned(false);

        navigation.navigate("ScannedWoTag", { uuid:data, type:"AS" });

      } else if(JSON.parse(data).v == "1"){
          if(JSON.parse(data).t==="warehouse"){
            navigation.navigate("InventoryOptionsScreen", { uuid:data.uuid, type:"warehouse" });
          }
      }else{
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
