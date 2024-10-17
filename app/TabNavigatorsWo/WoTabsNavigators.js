import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import WorkOrdersMainScreen from '../WorkOrderStack/WoDynamicTabScreen';
import BuggyListTopTabs from '../BuggyListTopTabs/BuggyListTopTabs';

// Placeholder components for each screen in the WorkOrderHomeTab's nested tab navigation

const Tab = createBottomTabNavigator();

// Nested tab navigator for WorkOrderHomeTab
const WorkOrderHomeTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="Work Order List"  // Set the initial tab here
      screenOptions={() => ({
    
        headerShown: false,  // Hides the header from all screens
      })}
    >
      <Tab.Screen name="Work Order List" component={WorkOrdersMainScreen} />
      <Tab.Screen name="BuggyListTopTabs" component={BuggyListTopTabs} />
    </Tab.Navigator>
  );
};

export default WorkOrderHomeTab;
