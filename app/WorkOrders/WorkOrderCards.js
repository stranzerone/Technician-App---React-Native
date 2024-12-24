import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux'; // Import useSelector to access Redux state
import useConvertToIST from '../TimeConvertot/ConvertUtcToIst';

const getStatusColor = (status) => {
  switch (status) {
    case 'OPEN':
      return '#4299E1'; 
    case 'STARTED':
      return '#ED8936'; 
    case 'COMPLETED':
      return '#48BB78'; 
    case 'HOLD':
      return '#ECC94B'; 
    case 'CANCELLED':
      return '#F56565'; 
    case 'REOPEN':
      return '#9F7AEA'; 
    default:
      return '#A0AEC0'; 
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Emergency':
      return '#FF6B6B'; // Soft red for emergency
    case 'High':
      return '#FFA94D'; // Muted orange for high priority
    case 'Normal':
      return '#1996D3'; // Faint blue for normal priority
    default:
      return '#CBD5E0'; // Neutral gray for default
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
   
      
      if(users[0]=="success"){
        const user = users[1]?.find(user => user.user_id == userId);
        console.log(user,userId,"this is the user on card ")
        return user ? user.name : 'Unknown User';
      }else{
        return 'User Not Found'
      }
 
    })
    .join(', ');
  
      
  };

  const getTeamNames = () => {
    const assignedTeamIds = workOrder.wo.AssignedTeam;

    if (!assignedTeamIds || assignedTeamIds.length === 0) {
      return 'None';
    }

    return assignedTeamIds
      .map((teamId) => {
        const team = teams?.find((team) => team.t._ID == teamId);
        return team ? team.t.Name : 'Unknown Team';
      })
      .join(', ');
  };

  const fontSize = Platform.OS === 'ios' ? 13 : 14; 
  const largeFontSize = Platform.OS === 'ios' ? 16 : 18; 

  return (
    <TouchableOpacity
      className="bg-white border p-4 rounded-md my-2 shadow-lg relative"
      style={{
        borderColor: "darkblue",
      }}
      onPress={() => {
        navigation.navigate('BuggyListTopTabs', { workOrder: workOrder.wo.uuid, wo: workOrder.wo });
      }}
    >
      {/* Work Order ID and status in the same row */}
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-600 font-bold" style={{ fontSize }}>WO-ID : {workOrder.wo['Sequence No']}</Text>
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
          <Text className="font-extrabold" style={{ fontSize, color: statusColor }}>
            {workOrder.wo.Status}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center my-2">
        <Icon name="cogs" size={fontSize} color="#074B7C" />
        <Text
          className="font-bold ml-2 text-blue-800"
          style={{
            fontSize: largeFontSize,
           
          }}
        >
          {workOrder.wo.Name || 'Unnamed Work Order'}
        </Text>
      </View>

      <View className="flex flex-row">
        <View className="w-1/3 flex-row items-center">
          <Icon name="user" size={fontSize} color="#1996D3" />
          <Text className="ml-2 text-gray-700 font-extrabold" style={{ fontSize }}>Assigned To : </Text>
        </View>

        <View className="flex-row ml-2 mt-1 w-2/3 flex-wrap">
          {getUserNames(workOrder.wo.Assigned).split(', ').map((name, index) => (
            <View
              key={index}
              className="bg-blue-100 px-2 py-0.5 rounded-full text-xs mr-1 ml-1 mb-1"
            >
              <Text className="font-semibold" style={{ fontSize }}>{name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Assigned Teams */}
      <View className="flex flex-row">
        <View className="w-1/3 flex-row items-center">
          <Icon name="users" size={fontSize} color="#34D399" />
          <Text className="ml-2 text-gray-700 font-extrabold" style={{ fontSize }}>Team :</Text>
        </View>

        <View className="w-2/3 ml- flex-row items-center justify-start flex-wrap">
          {getTeamNames(workOrder.wo.AssignedTeams).split(', ').map((name, index) => (
            <View
              key={index}
              className="bg-green-200 px-3 py-1 rounded-full mr-2 mb-2"
            >
              <Text className="font-semibold text-green-800" style={{ fontSize }}>{name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Created Date */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Icon name="calendar" size={fontSize} color="#1996D3" />
          <Text className="ml-2 text-gray-700 font-extrabold" style={{ fontSize }}>
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
          minWidth: 80,
          borderBottomRightRadius: 5,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text className="font-black" style={{ fontSize, color: '#FFF' }}>
          {workOrder.wo.Priority || 'Unknown Priority'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default WorkOrderCard;
