import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import WorkOrderPage from '../WorkOrders/WorkOrderScreen';
import AccessDeniedScreen from './AccessDeniedScreen';

const WorkOrderHomeTab = () => {
  const [uuid, setUuid] = useState(null);

  const fetchData = async () => {
    const storedUuid = await AsyncStorage.getItem('uuid');
    console.log('UUID checked: on double', storedUuid);
    setUuid(storedUuid);
  };

  // Use useFocusEffect to fetch UUID whenever the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchData(); // Fetch UUID when the component is focused
    }, [])
  );

  const handleRefresh = () => {
    fetchData(); // Refresh the UUID when needed
  };

  console.log(uuid, "UUID checked");

  return (
    <View style={styles.container}>
      {uuid ? (
        <WorkOrderPage uuid={uuid} /> // Pass the stored UUID
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
