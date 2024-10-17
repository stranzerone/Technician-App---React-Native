import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Notifications from '../Notification/NotificationScreen';
import { TouchableOpacity, Alert, Text, View, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import NewScanPage from '../QrScanner/NewScanPage';
import WorkOrderHomeTab from '../TabNavigatorsWo/WoTabsNavigators';
import AddWorkOrderForm from '../AddWorkOrders/AddWorkOrderScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBellConcierge, faList, faQrcode, faBell } from '@fortawesome/free-solid-svg-icons';
import DynamicPopup from '../DynamivPopUps/DynapicPopUpScreen';
import { usePermissions } from '../GlobalVariables/PermissionsContext'; // Use your PermissionsContext
import NotificationMainPage from '../Notification/NotificationScreen';
import { GetNotificationsApi } from '../../service/NotificationsApis/GetNotificationsApi';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const WorkOrderStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="WorkOrderHomeTab"
      component={WorkOrderHomeTab}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const QRCodeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="NewScanPage"
      component={NewScanPage}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const MyTabs = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [totalNotifications, setTotalNotifications] = useState(); // Initialize notification count
  const navigation = useNavigation();
  const { setPpmAsstPermissions } = usePermissions(); // Extract context permissions function

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const savedPermissions = await AsyncStorage.getItem('userInfo');
        if (savedPermissions) {
          const userInfo = JSON.parse(savedPermissions); // Parse the stored string into an object
          // Check if permissions exist in the userInfo object
          if (userInfo.data && userInfo.data.permissions) {
            // Filter permissions that start with 'PPMASST'
            const filteredPermissions = userInfo.data.permissions
              .filter(item => item.startsWith('PPMASST.')) // Get items starting with 'PPMASST'
              .map(item => item.split('.')[1]); // Split at the first dot and take the second part
            
            console.log(filteredPermissions, "Filtered and saved at Tabs"); // Log filtered permissions
            setPpmAsstPermissions(filteredPermissions); // Set permissions in context
          }
        }
      } catch (error) {
        console.error("Failed to load permissions:", error);
      }
    };

    const fetchTotalNotifications = async () => {
      try {
        const response = await GetNotificationsApi(); // Call your API to get notifications
       console.log(response.data.length,"lenght")
        setTotalNotifications(response.data.length || 0); // Update the state with the total notifications count
      } catch (error) {
        console.error("Error fetching notifications count:", error);
      }
    };

    loadPermissions(); // Call the function on mount
    fetchTotalNotifications(); // Fetch notification count on mount
  }, [setPpmAsstPermissions]); // Dependency array includes setPpmAsstPermissions

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.removeItem('uuid');
      navigation.navigate("Login");
    } catch (error) {
      console.error('Error clearing local storage', error);
      Alert.alert('Error', 'Could not log out. Please try again.');
    }
  };

  const renderLogoutButton = () => (
    <TouchableOpacity
      onPress={() => setModalVisible(true)} // Open confirmation popup
      style={styles.logoutButton}
    >
      <Text style={styles.logoutText}>
        <Icon name="power-off" size={24} color="#074B7C" />
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <StatusBar
        barStyle="default" // Options: 'default' or 'light-content'
        translucent={false} // Set to true if you want a translucent status bar
      />

      {/* Dynamic Popup for logout confirmation */}
      <DynamicPopup
        visible={modalVisible}
        type="warning"
        message="You will be logged out. Are you sure you want to log out?"
        onClose={() => setModalVisible(false)}
        onOk={() => {
          setModalVisible(false);
          handleLogout();
        }}
      />

      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#1996D3',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: Platform.OS === 'android' ? null : 10,
            height: Platform.OS === 'android' ? 50 : 70,
            ...styles.shadow,
            elevation: 5,
          },
          headerRight: renderLogoutButton,
          headerStyle: { backgroundColor: '#1996D3' },
          headerTintColor: '#FFFFFF',
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            let icon;

            if (route.name === 'Work Orders') {
              icon = faList;
            } else if (route.name === 'QRCode') {
              icon = faQrcode;
            } else if (route.name === 'ServiceRequests') {
              icon = faBellConcierge;
            } else if (route.name === 'Notifications') {
              icon = faBell;
            }

            return (
              <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
                <FontAwesomeIcon icon={icon} size={24} color={"#FFFFFF"} />
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="Work Orders" options={{ title: 'Work List' }} component={WorkOrderStack} />
        <Tab.Screen name="QRCode" options={{ title: 'QR Scanner' }} component={QRCodeStack} />
        <Tab.Screen name="ServiceRequests" options={{ title: 'Create Order' }} component={AddWorkOrderForm} />
        <Tab.Screen 
          name="Notifications" 
          component={NotificationMainPage}
          options={{
            tabBarBadge: totalNotifications > 0 ? totalNotifications : undefined, // Show badge if notifications exist
            tabBarBadgeStyle: {
              backgroundColor: 'red', // Badge background color (red in this case)
              color: '#fff', // Badge text color (white in this case)
            },
          }}
        />
      </Tab.Navigator>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logoutButton: {
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  activeIconContainer: {
    backgroundColor: '#074B7C',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default MyTabs;
