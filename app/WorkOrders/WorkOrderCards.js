import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { usePermissions } from '../GlobalVariables/PermissionsContext';

// Function to get color based on priority
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Emergency':
      return '#f56565'; // Red
    case 'High':
      return '#ed8936'; // Orange
    case 'Normal':
      return '#3182ce'; // Blue
    default:
      return '#a0aec0'; // Gray
  }
};

// Function to get badge classes based on status
const getStatusBadgeClasses = (status) => {
  switch (status) {
    case 'OPEN':
      return 'bg-blue-100 text-blue-700';  // Light Blue for OPEN
    case 'STARTED':
      return 'bg-orange-100 text-orange-800'; // Light Orange for STARTED
    case 'COMPLETED':
      return 'bg-green-100 text-green-700'; // Light Green for COMPLETED
    case 'HOLD':
      return 'bg-yellow-100 text-yellow-800'; // Light Yellow for HOLD
    case 'CANCELLED':
      return 'bg-red-100 text-red-700'; // Light Red for CANCELLED
    case 'REOPEN':
      return 'bg-purple-100 text-purple-700'; // Light Purple for REOPEN
    default:
      return 'bg-gray-100 text-gray-600'; // Light Gray for unknown statuses
  }
};

const WorkOrderCard = ({ workOrder }) => {
  const navigation = useNavigation();
  const { ppmAsstPermissions } = usePermissions(); // Destructure permissions from the context

  const priorityColor = getPriorityColor(workOrder.wo.Priority);

  const statusBadgeClasses = getStatusBadgeClasses(workOrder.wo.Status);

  return (
    <TouchableOpacity
      className="bg-white p-4 my-2 shadow-lg relative"
      onPress={() => {
        if (ppmAsstPermissions[0].includes('R')) {
          navigation.navigate('BuggyList', { workOrder: workOrder.wo.uuid });
        }
      }}
    >
      {/* Work Order ID and priority in the same row */}
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-600 text-xs">Work Order ID: {workOrder.wo['Sequence No']}</Text>
        <View className="flex-row items-center">
          {/* Priority Dot with Glowing Effect */}
          <View
            style={{
              width: 7, // Increase size for the glow
              height: 7, // Increase size for the glow
              borderRadius: 6, // Make it a perfect circle
              backgroundColor: priorityColor,
              marginRight: 4,
              // Shadow properties for glowing effect
              shadowColor: priorityColor, // Match the glow color
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.7,
              shadowRadius: 6, // Increase for a more pronounced glow
              elevation: 4, // For Android shadow
            }}
          />
          <Text className="text-xs font-extrabold" style={{ color: priorityColor }}>
            {workOrder.wo.Priority}
          </Text>
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

      {/* Status Badge at the bottom right corner */}
      <View className={`absolute bottom-0 right-0 inline-flex items-center px-6 py-1 text-xs font-medium ${statusBadgeClasses}`}>
        <Text className="text-md font-black" style={{ color: statusBadgeClasses.includes('text') ? 'inherit' : '#000' }}>
          {workOrder.wo.Status || 'Unknown Status'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default WorkOrderCard;
