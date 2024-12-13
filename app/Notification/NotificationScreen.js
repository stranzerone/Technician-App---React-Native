import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationCard from './NotificationCard';
import { fetchNotifications } from '../../utils/Slices/NotificationsSlice'; // Adjust path if needed
import { useFocusEffect } from '@react-navigation/native';
import { usePermissions } from '../GlobalVariables/PermissionsContext';
import { GetNotificationsApi } from '../../service/NotificationsApis/GetNotificationsApi';

const NotificationMainPage = () => {
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const notifications2 = useSelector((state) => state.notifications.data);
  const status = useSelector((state) => state.notifications.status); // To handle loading states
  const error = useSelector((state) => state.notifications.error);

  const { updateNotificationCount } = usePermissions();

  // Fetch notifications and reset new notifications
  const initializeNotifications = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        console.log('Fetching notifications');
        const response = await GetNotificationsApi();
        setNotifications(response.data);
      }
    } catch (err) {
      console.error('Error initializing notifications:', err);
    }
  };

  // Reset notification count when the page is focused and refresh notifications
  useFocusEffect(
    React.useCallback(() => {
      const resetNotifications = async () => {
        try {
          await AsyncStorage.setItem('newNotifications', '0');
          updateNotificationCount(0); // Update local notification count
          console.log('Opened notifications');
          await initializeNotifications(); // Fetch notifications when the page is focused
        } catch (err) {
          console.error('Error resetting notifications:', err);
        }
      };

      resetNotifications();

      return () => {};
    }, [updateNotificationCount, dispatch]) // Include dispatch to avoid stale closures
  );

  const renderNotification = ({ item }) => (
    <NotificationCard
      message={item.message || 'No message available'} // Add default value to avoid crashes
      createdAt={item.created_at}
    />
  );

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {/* Show loader if notifications are being fetched */}
      {status === 'loading' ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()} // Ensure a fallback key
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            status === 'loading' ? (
              <Text style={styles.loadingText}>Loading notifications...</Text>
            ) : (
              <Text style={styles.emptyText}>No notifications available</Text>
            )
          }
        />
      )}
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
  loadingText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationMainPage;
