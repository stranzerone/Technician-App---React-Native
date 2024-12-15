import React, { createContext, useContext, useState, useEffect } from 'react';
import { GetNotificationsApi } from '../../service/NotificationsApis/GetNotificationsApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a context for permissions and notifications
const PermissionsContext = createContext();

// Create a provider component
export const PermissionsProvider = ({ children }) => {
  const [ppmAsstPermissions, setPpmAsstPermissions] = useState([]);
  const [notificationsCount, setNotificationCount] = useState(0); // Track notification count

  // Load permissions and notifications count from AsyncStorage and update context on mount
  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const savedPermissions = await AsyncStorage.getItem('userInfo');

        if (savedPermissions) {
          const userInfo = JSON.parse(savedPermissions); // Parse the stored string into an object
          if (userInfo.permissions) {
            const filteredPermissions = userInfo.permissions
              .filter(item => item.startsWith('PPMASST.'))
              .map(item => item.split('.')[1]);

            // setPpmAsstPermissions(filteredPermissions); // Set permissions
            setPpmAsstPermissions(["CUD"])
          }
        }

        // Fetch notifications count from the API
        const fetchNotificationCount = async () => {
          const fetchedData = await GetNotificationsApi(); // Use the API to get notifications
          if (fetchedData) {
            const newNotificationsCount = parseInt(await AsyncStorage.getItem('newNotifications'), 10);
            console.log(newNotificationsCount, "got in context new notifications");
            setNotificationCount(newNotificationsCount); // Set notification count from AsyncStorage
          }
        };

        // Initial fetch
        await fetchNotificationCount();

        // Set interval to fetch notifications every 1 minute (60000 milliseconds)
        // const intervalId = setInterval(fetchNotificationCount, 60000); 

        // Cleanup function to clear the interval when component unmounts
        return () => clearInterval(intervalId);

      } catch (error) {
        console.error('Failed to load permissions or notifications:', error);
      }
    };

    loadPermissions();
  }, []); // Empty dependency array to only run once on mount

  // Update notification count directly in context
  const updateNotificationCount = (count) => {
    setNotificationCount(count);
  };

  return (
    <PermissionsContext.Provider
      value={{
        ppmAsstPermissions,
        setPpmAsstPermissions,
        notificationsCount,
        setNotificationCount,
        updateNotificationCount,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

// Custom hook to use the Permissions and Notifications context
export const usePermissions = () => {
  return useContext(PermissionsContext);
};
