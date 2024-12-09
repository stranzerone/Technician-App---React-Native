import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import QrScanner from "./QrScannerComp";
export default function MainScannerPage() {
  const [scanned, setScanned] = useState(false);

  const handleScanned = (uuid) => {
    setScanned(true);
    console.log(`Scanned UUID: ${uuid}`);
  };

  return (
    <View style={styles.container}>
      {/* Instructions at the top */}
      <Text style={styles.instructions}>
        Point your camera at a QR code to scan it.
      </Text>

      {/* Scanner container takes up a dynamic portion of the screen height */}
      <View style={styles.cameraContainer}>
        <QrScanner onScanned={handleScanned} />
      </View>

      {scanned && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => setScanned(false)}
          >
            <Ionicons name="ios-refresh" size={24} color="#fff" />
            <Text style={styles.buttonText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {!scanned && (
        <View style={styles.scanIconContainer}>
          <Ionicons name="qr-code-outline" size={100} color="#074B7C" />
          <Text style={styles.scanText}>Scanning for QR Code</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EAF2F8", // Light background color for a modern look
    paddingHorizontal: 20, // Added padding for better layout on the sides
  },
  instructions: {
    fontSize: 18,
    color: "#074B7C",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20, // Spacing below the instructions
    paddingHorizontal: 10, // Padding for better text alignment
  },
  cameraContainer: {
    flex: 1, // This ensures the scanner takes a dynamic portion of the screen
    width: "100%",
    maxHeight: "30%", // Max height for the QR scanner
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "#074B7C", // Brand-like color
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10, // Creates a subtle shadow for better aesthetics
  },
  buttonContainer: {
    marginTop: 30,
    width: "80%",
    alignSelf: "center",
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1996D3",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25, // More rounded for a modern look
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "bold",
  },
  scanIconContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  scanText: {
    fontSize: 20,
    color: "#074B7C",
    marginTop: 15,
    fontWeight: "600",
    textAlign: "center",
  },
});
