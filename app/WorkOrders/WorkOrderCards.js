import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Function to get color based on status
const getStatusColor = (status) => {
  switch (status) {
    case 'OPEN':
      return '#4299E1';  // Light Blue for OPEN
    case 'STARTED':
      return '#ED8936'; // Orange for STARTED
    case 'COMPLETED':
      return '#48BB78'; // Green for COMPLETED
    case 'HOLD':
      return '#ECC94B'; // Yellow for HOLD
    case 'CANCELLED':
      return '#F56565'; // Red for CANCELLED
    case 'REOPEN':
      return '#9F7AEA'; // Purple for REOPEN
    default:
      return '#A0AEC0'; // Gray for unknown statuses
  }
};

// Function to get color based on priority
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Emergency':
      return '#f56565'; // Red for Emergency
    case 'High':
      return '#ed8936'; // Orange for High
    case 'Normal':
      return '#3182ce'; // Blue for Normal
    default:
      return '#a0aec0'; // Gray for unknown priorities
  }
};

const WorkOrderCard = ({ workOrder }) => {
  const navigation = useNavigation();
  const statusColor = getStatusColor(workOrder.wo.Status);
  const priorityColor = getPriorityColor(workOrder.wo.Priority);

  return (
    <TouchableOpacity
      className="bg-white border p-4 rounded-md my-2 shadow-lg relative"
      onPress={() => {
        console.log("padiding to buggylist")
          navigation.navigate('BuggyList', { workOrder: workOrder.wo.uuid,wo:workOrder.wo });
        
      }}
    >
      {/* Work Order ID and status in the same row */}
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-600 text-xs">WO-ID : {workOrder.wo['Sequence No']}</Text>
        <View className="flex-row items-center">
          {/* Status Dot with Glowing Effect */}
          <View
            style={{
              width: 7,
              height: 7,
              borderRadius: 6,
              backgroundColor: statusColor,
              marginRight: 4,
              shadowColor: statusColor,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.7,
              shadowRadius: 6,
              elevation: 4,
            }}
          />
          <Text className="text-xs font-extrabold" style={{ color: statusColor }}>
            {workOrder.wo.Status}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center my-2">
        <Icon name="cogs" size={14} color="#074B7C" />
        <Text className="text-md font-bold ml-2 text-gray-800">
          {workOrder.wo.Name || 'Unnamed Work Order'}
        </Text>
      </View>

      <View className="flex-row items-center my-1">
        <Icon name="users" size={14} color="#1996D3" />
        <Text className="ml-2 text-gray-700">
          Assigned To: {workOrder.wo.Assigned ? workOrder.wo.Assigned.join(', ') : 'None'}
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

      {/* Priority Badge at the bottom right corner */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          backgroundColor: priorityColor,
          paddingVertical: 4,
          paddingHorizontal: 8,
      
        }}
      >
        <Text className="text-md font-black" style={{ color: '#FFF' }}>
          {workOrder.wo.Priority || 'Unknown Priority'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default WorkOrderCard;
