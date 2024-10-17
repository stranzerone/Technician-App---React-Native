import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import WorkOrderPage from '../WorkOrders/WorkOrderScreen';
import AccessDeniedScreen from './AccessDeniedScreen';

const WorkOrderHomeTab = () => {
  const [uuid, setUuid] = useState(null);

  const fetchData = async () => {
    const storedUuid = await AsyncStorage.getItem('uuid');
    console.log('UUID checked');
    setUuid(storedUuid);
  };

  useEffect(() => {
   handleRefresh(); // Fetch UUID when the component mounts
  }, []);

  const handleRefresh = () => {
    fetchData(); // Refresh the UUID when the button is clicked
  };

  console.log(uuid, "UUID checked");

  return (
    <View style={styles.container}>
      {uuid ? (
        <WorkOrderPage uuid={uuid} />
      ) : (
        <AccessDeniedScreen onRefresh={handleRefresh} /> // Pass the refresh function
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Make the container take the full available space
  },
});

export default WorkOrderHomeTab;
