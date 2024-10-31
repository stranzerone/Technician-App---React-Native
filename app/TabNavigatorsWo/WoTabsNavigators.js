import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import WorkOrdersMainScreen from '../WorkOrderStack/WoDynamicTabScreen';
import BuggyListTopTabs from '../BuggyListTopTabs/BuggyListTopTabs';
import WorkOrderHomeTab from '../WorkOrderStack/WoDynamicTabScreen';

const Stack = createStackNavigator();

// Main stack navigator for your application
const WorkOrderStack = () => {
  return (
      <Stack.Navigator
        initialRouteName="Work Order List" // Set the initial screen here
        screenOptions={{
          headerShown: false, // Hide header if not needed
        }}
      >
        <Stack.Screen name="Work Order List" component={WorkOrdersMainScreen} />
        <Stack.Screen name="BuggyList" component={BuggyListTopTabs} />
        
        <Stack.Screen name="DynamicWo" component={WorkOrderHomeTab} />

      </Stack.Navigator>

  );
};

export default WorkOrderStack;
