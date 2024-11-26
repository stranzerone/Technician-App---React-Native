import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationCard from './NotificationCard';
import { fetchNotifications } from '../../utils/Slices/NotificationsSlice'; // Adjust path if needed
import { useFocusEffect } from '@react-navigation/native';
import { usePermissions } from '../GlobalVariables/PermissionsContext';
const NotificationMainPage = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.data);
  const error = useSelector((state) => state.notifications.error);

  const [refreshing, setRefreshing] = useState(false); // Track refreshing state
const {updateNotificationCount}  = usePermissions()
  // Fetch notifications and reset new notifications
  const initializeNotifications = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        console.log('Fetching notifications');
        dispatch(fetchNotifications());
      }
    } catch (err) {
      console.error('Error initializing notifications:', err);
    }
  };

  // Run notifications initialization and set an interval
  useEffect(() => {
    initializeNotifications();

    const interval = setInterval(() => {
      initializeNotifications();
    }, 60000); // 1 minute interval

    return () => clearInterval(interval); // Cleanup on unmount
  }, [dispatch]);

  // Reset notification count when the page is focused
  useFocusEffect(
    React.useCallback(() => {
      const resetNotifications = async () => {
        try {
          await AsyncStorage.setItem('newNotifications', '0');
          await updateNotificationCount(0)
          console.log('Opened notifications');
        } catch (err) {
          console.error('Error resetting notifications:', err);
        }
      };

      resetNotifications();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchNotifications());
    setRefreshing(false);
  };

  const renderNotification = ({ item }) => (
    <NotificationCard
      message={item.message} // Adjust according to your notification object structure
      createdAt={item.created_at} // Adjust according to your notification object structure
    />
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()} // Ensure item has an `id` field
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingTop: 5,
    marginBottom: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default NotificationMainPage;
