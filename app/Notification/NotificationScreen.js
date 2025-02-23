import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationCard from './NotificationCard';
import { fetchNotifications } from '../../utils/Slices/NotificationsSlice'; // Adjust path if needed
import { useFocusEffect } from '@react-navigation/native';
import { usePermissions } from '../GlobalVariables/PermissionsContext';
import { GetNotificationsApi } from '../../service/NotificationsApis/GetNotificationsApi';
import Loader from '../LoadingScreen/AnimatedLoader';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome for the bell icon

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
        if (response?.data) {
          setNotifications(response.data);
        } else {
          setNotifications([]);
        }
      }
    } catch (err) {
      console.error('Error initializing notifications:', err);
    }
  };

  // Reset notification count when the page is focused and refresh notifications
useEffect(()=>{
initializeNotifications()
},[])
  const renderNotification = ({ item }) => (
    <NotificationCard
      message={item.message || 'No message available'} // Add default value to avoid crashes
      createdAt={item.created_at}
    />
  );

  return (
    <ScrollView style={styles.container}>
      {/* Heading with Bell Icon and Yellow Dot */}
      <View  style={styles.headerContainer}>
        <FontAwesome name="bell" size={24} color="black" style={styles.bellIcon} />
        <Text style={styles.headerText}>Notifications</Text>
      </View>

      {/* Display error message if any */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {/* Show loader if notifications are being fetched */}
      {status === 'loading' || notifications.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>
            <Loader />
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()} // Ensure a fallback key
          contentContainerStyle={styles.listContainer}
          scrollEnabled={false}
          ListEmptyComponent={
            notifications.length === 0 && !status ? (
              <Text style={styles.emptyText}>No notifications available</Text>
            ) : null
          }
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    
    marginBottom: 35,
  },
  headerContainer: {
    borderRadius:20,
    flexDirection: 'row',
    alignItems: 'center',

    paddingLeft:10,
    padding:4,
   
    marginBottom: 5,
  },
  bellIcon: {
    marginRight: 10, // Add space between the bell and yellow dot
  },
  yellowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'yellow',
    marginRight: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
