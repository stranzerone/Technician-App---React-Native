import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/Feather'; // or 'MaterialIcons', 'Ionicons', etc.

const { width } = Dimensions.get('window');

const CameraScreen = ({ navigation, route }) => {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [cameraPosition, setCameraPosition] = useState('back'); // 'front' or 'back'
  const [isCapturing, setIsCapturing] = useState(false);
  const { front, back } = useCameraDevices();
  const device = hasPermission ? (cameraPosition === 'front' ? front : back) : undefined;  
  const devices = useCameraDevices();

  // Request camera permission
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized' || status === 'granted');
    })();
  }, []);

  // Debug logs for devices
  useEffect(() => {
  }, [devices, device]);

  const takePhoto = async () => {
    if (cameraRef.current && !isCapturing) {
      try {
        setIsCapturing(true);
        const photo = await cameraRef.current.takePhoto({
          flash: 'auto',
        });


        navigation.goBack();
        if (route.params?.onPictureTaken) {
          route.params.onPictureTaken(`file://${photo.path}`);
        }
      } catch (error) {
        console.error('Failed to take photo:', error);
        Alert.alert('Error', 'Failed to capture photo.');
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const switchCamera = () => {
    setCameraPosition((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!devices) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Loading camera device...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={devices[0]}
        isActive={true}
        photo={true}
        cameraPosition={cameraPosition}
      />

<View style={styles.controls}>
    {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.sideButton}>
      <Icon name="x" size={28} color="#fff" />
    </TouchableOpacity> */}

    <TouchableOpacity onPress={takePhoto} style={styles.captureButton}>
      <Icon name="camera" size={24} color="white" />
    </TouchableOpacity>

    {/* <TouchableOpacity onPress={switchCamera} style={styles.sideButton}>
      <Icon name="refresh-ccw" size={28} color="#fff" />
    </TouchableOpacity> */}
  </View>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#1e1e1e',
    height: 64,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  button: {
    padding: 10,
  },
  captureButton: {
    padding: 10,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 50,
  },
  icon: {
    fontSize: 28,
    color: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});