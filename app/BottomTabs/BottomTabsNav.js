import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
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
import { faBellConcierge, faList, faQrcode, faBell, faPager, faFileLines, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import DynamicPopup from '../DynamivPopUps/DynapicPopUpScreen';
import { usePermissions } from '../GlobalVariables/PermissionsContext'; // Use your PermissionsContext
import NotificationMainPage from '../Notification/NotificationScreen';
import { GetNotificationsApi } from '../../service/NotificationsApis/GetNotificationsApi';
import ImageUploadScreen from '../SamplePges/UploadImage';
import LogWorkOrders from '../../service/BuggyListApis/GetReduxAllInstructions';
import BuggyListComponent from '../SamplePages/SampleReduxBLcards';
import ComplaintDropdown from '../RaiseComplaint/ComplaintDropdown';
import ComplaintsScreen from '../MyComplaints/ComplaintsScreen';
import RequestServiceTabs from '../ServiceTab/RequestServiceTopTabs';
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
  const { setPpmAsstPermissions,notificationsCount } = usePermissions(); // Extract context permissions function
  const [user,setUser] = useState({})
  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const savedPermissions = await AsyncStorage.getItem('userInfo');
        const user = await AsyncStorage.getItem('user')
        if (savedPermissions) {
          const userInfo = JSON.parse(savedPermissions); // Parse the stored string into an object
          const userData = JSON.parse(user); // Parse the stored string into an object
console.log(userData,'from aync user')
setUser(userData)
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

    console.log(user,'stored user')

 

    loadPermissions(); // Call the function on mount




  }, [setPpmAsstPermissions]); // Dependency array includes setPpmAsstPermissions



  const fetchTotalNotifications = async () => {
    try {
      const response = notificationsCount; // Call your API to get notifications
     console.log(response,"this is fetch badge of new notifications")
      setTotalNotifications(response || 0); // Update the state with the total notifications count
    } catch (error) {
      console.error("Error fetching notifications count:", error);
    }
  };
  useEffect(() => {
    // Fetch notifications initially
    fetchTotalNotifications();

    // Set up an interval to call the function every 10 minutes (600000 milliseconds)
    const intervalId = setInterval(() => {
      fetchTotalNotifications();
    }, 1 * 60 * 1000); // 10 minutes

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [notificationsCount]);

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
    <View
      className="flex flex-row items-center gap-4 p-4  rounded-lg shadow-md"
    >
      <View className="flex flex-row items-center bg-slate-700 rounded-lg p-2">
        {Platform.OS === "android" && ( // Conditionally render society name for Android
          <Text className="truncate w-24 h-5 text-white ml-2 text-sm font-semibold">
            <Icon name="building" size={20} color="white" />
            {user?.society_name}
          </Text>
        )}
      </View>
  
      {/* Power-off icon (only clickable) */}
      <TouchableOpacity 
       
        onPress={() => setModalVisible(true)} // Open confirmation popup

        className="p-2 bg-red-600 rounded-full"
      >
        <Icon name="power-off" size={16} color="white" />
      </TouchableOpacity>
    </View>
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
            height: Platform.OS === 'android' ? 60 : 70,
            ...styles.shadow,
            elevation: 5,
          },
          headerRight: renderLogoutButton,
          headerLeft: Platform.OS === 'ios' ? () => (
            <View style={styles.societyNameContainer}>
              <Text style={styles.societyNameText}>{user?.society_name}</Text>
            </View>
          ) : undefined,
          headerStyle: { backgroundColor: '#1996D3' },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold', // Make text bold
          },
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
           } else if (route.name === 'MyComplaints') {
              icon = faFileAlt;
            }

            //MyComplaints
            return (
              <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
                <FontAwesomeIcon icon={icon} size={24} color={"#FFFFFF"} />
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="Work Orders" options={{ title: 'Work List' }} component={WorkOrderStack} />
        <Tab.Screen name="MyComplaints" options={{ title: 'Complaints' }} component={ComplaintsScreen} />

        <Tab.Screen name="QRCode" options={{ title: 'QR Scanner' }} component={QRCodeStack} />
        <Tab.Screen name="ServiceRequests" options={{ title: 'Create Order' }} component={RequestServiceTabs} />

        <Tab.Screen 
          name="Notifications" 
          // component={NotificationMainPage}
          component={NotificationMainPage}
          options={{
            tabBarBadge: totalNotifications, // Show badge only if there's unread notifications
            tabBarBadgeStyle: {
              backgroundColor: 'red',    // Badge color
              color: 'white',            // Text color of the badge
              fontSize: 14,              // Badge font size
              fontWeight: 'bold',        // Badge font weight
              borderRadius: 15,         // Make badge circular
              minWidth: 20,             // Ensure the badge width is large enough for one or two digits
              height: 20,               // Ensure the badge height accommodates the text
              justifyContent: 'center', // Vertically center the text
              alignItems: 'center',     // Horizontally center the text
              padding: 1,               // Padding for badge
              textAlign: 'center',      // Ensure the text is centered inside the badge
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
  societyNameContainer: {
    marginLeft: 15,
  },
  societyNameText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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