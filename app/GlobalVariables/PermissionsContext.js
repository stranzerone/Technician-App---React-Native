import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a context for permissions
const PermissionsContext = createContext();

// Create a provider component
export const PermissionsProvider = ({ children }) => {
  const [ppmAsstPermissions, setPpmAsstPermissions] = useState([]);

  // Load permissions from AsyncStorage on component mount
  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const savedPermissions = await AsyncStorage.getItem('userInfo');

        if (savedPermissions) {
          const userInfo = JSON.parse(savedPermissions); // Parse the stored string into an object
          // Check if permissions exist in the userInfo object
          if (userInfo.permissions) {
            // Filter permissions that start with 'PPMASST'
            const filteredPermissions = userInfo.permissions
              .filter(item => item.startsWith('PPMASST.')) // Get items starting with 'PPMASST'
              .map(item => item.split('.')[1]); // Split at the first dot and take the second part
            
            console.log(filteredPermissions, "Filtered Permissions"); // Log filtered permissions
            setPpmAsstPermissions(filteredPermissions); // Set permissions
          }
        }
      } catch (error) {
        console.error("Failed to load permissions:", error);
      }
    };

    loadPermissions();
  }, []);

  return (
    <PermissionsContext.Provider value={{ ppmAsstPermissions,setPpmAsstPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};

// Custom hook to use the Permissions context
export const usePermissions = () => {
  return useContext(PermissionsContext);
};
