import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux'; // Import useSelector to access Redux state
import useConvertToIST from '../TimeConvertot/ConvertUtcToIst';

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
      return 'red'; // Red for Emergency
    case 'High':
      return 'orange'; // Orange for High
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
  // Access the Redux state (assuming userInfo and teams hold user data and teams data)
  const users = useSelector((state) => state.users.data);
  const teams = useSelector((state) => state.teams.data);

  // Map user IDs to names
  const getUserNames = (assignedIds) => {
    if (!assignedIds || assignedIds.length === 0) {
      return 'None';
    }
    
    return assignedIds
      .map((userId) => {
        const user = users.find((user) => user.user_id == userId);
        return user ? user.name : 'Unknown User';
      })
      .join(', ');
  };

  // Map team IDs to names
  const getTeamNames = () => {
    // Here we're hardcoding some team IDs for the example, you should replace with actual `AssignedTeam` ids
    const assignedTeamIds = workOrder.wo.AssignedTeam;
    // const assignedTeamIds = ['3804239', '14929742','14929742'];

    if (!assignedTeamIds || assignedTeamIds.length === 0) {
      return 'None';
    }

    // Map the team IDs to names
    return assignedTeamIds
      .map((teamId) => {
        const team = teams.find((team) => team.t._ID == teamId);
        return team ? team.t.Name : 'Unknown Team';
      })
      .join(', ');
  };

  return (
    <TouchableOpacity
      className="bg-white border  p-4 rounded-md my-2 shadow-lg relative "
      style={{
        borderColor:statusColor
      }}
      onPress={() => {
        navigation.navigate('BuggyListTopTabs', { workOrder: workOrder.wo.uuid, wo: workOrder.wo });
      }}
    >
      {/* Work Order ID and status in the same row */}
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-600 font-bold text-xs">WO-ID : {workOrder.wo['Sequence No']}</Text>
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
        <Text 
        style={{
          color:statusColor
        }}
        className="text-md text-lg font-bold ml-2 text-blue-800">
          {workOrder.wo.Name || 'Unnamed Work Order'}
        </Text>
      </View>




{/* Assigned To */}
<View className='flex flex-row'>


<View className="w-1/3 flex-row items-center">
<Icon name="user" size={14} color="#1996D3" />
  <Text className="ml-2  text-gray-700 font-extrabold">Assigned To : </Text>
</View>

{/* Assigned users names container, wraps the names in row and wraps them to the next line if needed */}
<View className=" flex-row w-2/3 flex-wrap">
  {getUserNames(workOrder.wo.Assigned).split(', ').map((name, index) => (
    <View
      key={index}
      className="bg-blue-100  text-blue-800 px-2 py-0.5 rounded-full text-xs mr-1 ml-1 mb-1"
    >
      <Text className="font-semibold text-xs text-blue-800">{name}</Text>
    </View>
  ))}
</View>

</View>


{/* Assinged Teams Container */}
<View className=" flex flex-row">
  {/* Assigned Team label container takes 1/3 width */}
  <View className="w-1/3 flex-row items-center">
    <Icon name="users" size={14} color="#34D399" />
    <Text className="ml-2 text-gray-700 font-extrabold">Team  :</Text>
  </View>

  {/* Team names container takes remaining width and wraps text */}
  <View className="w-2/3 flex-row items-center justify-start flex-wrap">
    {getTeamNames(workOrder.wo.AssignedTeams).split(', ').map((name, index) => (
      <View
        key={index}
        className="bg-green-200 text-green-800 px-3 py-1 rounded-full  mr-2 mb-2"
      >
        <Text className="font-semibold text-xs text-green-800">{name}</Text>
      </View>
    ))}
  </View>
</View>



      {/* Created Date */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Icon name="calendar" size={14} color="#1996D3" />
          <Text className="ml-2 text-gray-700 font-extrabold">
            {workOrder.wo.created_at
              ? useConvertToIST(workOrder.wo.created_at)
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
          minWidth:80,
          display:'flex',
          flex: 1,
          borderBottomRightRadius:5,
    justifyContent: 'center',
    alignItems: 'center',
    opacity:10
 
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
