import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { usePermissions } from '../GlobalVariables/PermissionsContext';

// Function to get badge classes based on priority
const getPriorityBadgeClasses = (priority) => {
  switch (priority) {
    case 'Emergency':
      return 'inline-flex items-center rounded-md bg-red-300 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset font-extrabold ring-red-600/10';
    case 'High':
      return 'inline-flex items-center rounded-md bg-orange-300 px-2 py-1 text-xs font-medium text-orange-700 ring-1 font-extrabold ring-inset ring-orange-600/10';
    case 'Normal':
      return 'inline-flex items-center rounded-md bg-blue-300 px-2 py-1 text-xs font-medium text-blue-700  font-extrabold ring-1 ring-inset ring-blue-600/10';
    default:
      return 'inline-flex items-center rounded-md bg-gray-300 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10';
  }
};

// Function to get badge classes based on status
const getStatusBadgeClasses = (status) => {
  switch (status) {
    case 'OPEN':
      return 'inline-flex items-center rounded-md bg-purple-200 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10';
    case 'STARTED':
      return 'inline-flex items-center rounded-md bg-yellow-200 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20';
    case 'COMPLETED':
      return 'inline-flex items-center rounded-md bg-green-200 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20';
    case 'HOLD':
      return 'inline-flex items-center rounded-md bg-indigo-200 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10';
    case 'CANCELLED':
      return 'inline-flex items-center rounded-md bg-red-200 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10';
    case 'REOPEN':
      return 'inline-flex items-center rounded-md bg-purple-200 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10';
    default:
      return 'inline-flex items-center rounded-md bg-gray-200 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10';
  }
};

const WorkOrderCard = ({ workOrder }) => {
  const navigation = useNavigation();
  const { ppmAsstPermissions } = usePermissions(); // Destructure permissions from the context

  return (
    <TouchableOpacity
      className="bg-white p-4 my-2 rounded-lg shadow-lg"
      onPress={() => {
        if (ppmAsstPermissions[0].includes('R')) {
          navigation.navigate('BuggyListTopTabs', { workOrder: workOrder.wo.uuid });
        }
      }}
    >
      {/* Work Order ID and badges in the same row */}
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-600 text-xs">Work Order ID: {workOrder.wo['Sequence No']}</Text>
        <View className="flex-row space-x-2">
          {/* Priority Badge */}
          <View className={getPriorityBadgeClasses(workOrder.wo.Priority)}>
            <Text>{workOrder.wo.Priority}</Text>
          </View>
          {/* Status Badge */}
          <View className={getStatusBadgeClasses(workOrder.wo.Status)}>
            <Text>{workOrder.wo.Status || 'Unknown Status'}</Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center my-2">
        <Icon name="cogs" size={14} color="#074B7C" />
        <Text className="text-lg font-bold ml-2 text-gray-800">
          {workOrder.wo.Name || 'Unnamed Work Order'}
        </Text>
      </View>

      <View className="flex-row items-center my-1">
        <Icon name="users" size={14} color="#1996D3" />
        <Text className="ml-2 text-gray-700">
          Assigned Teams: {workOrder.wo.Assigned ? workOrder.wo.Assigned.join(', ') : 'None'}
        </Text>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Icon name="calendar" size={14} color="#1996D3" />
          <Text className="ml-2 text-gray-700">
            {workOrder.wo.created_at
              ? new Date(workOrder.wo.created_at).toLocaleDateString() + ' ' + new Date(workOrder.wo.created_at).toLocaleTimeString()
              : 'N/A'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default WorkOrderCard;
