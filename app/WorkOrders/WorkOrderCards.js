import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import useConvertToIST from '../TimeConvertot/ConvertUtcToIst';
import { getAllTeams } from '../../service/GetUsersApi/GetAllTeams';
import { GetWorkOrderInfo } from '../../service/WorkOrderApis/GetWorkOrderInfo';
import moment from 'moment';

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
      return '#FF6B6B';
    case 'High':
      return '#FFA94D';
    case 'Normal':
      return '#1996D3';
    default:
      return 'gray';
  }
};

const WorkOrderCard = React.memo(({ workOrder,previousScreen }) => {

  const navigation = useNavigation();
  const statusColor = getStatusColor(workOrder.wo.Status);
  const priorityColor = getPriorityColor(workOrder.wo.Priority);
  const users = useSelector((state) => state.users.data);
  const teams = useSelector((state) => state.teams.data);
  const [restricted,setRestricted]  = useState(false)
  const [restrictedTime,setRestrictedTime]  = useState(0)




  const getUserNames = (assignedIds) => {
    if (!assignedIds || assignedIds.length === 0) {
      return 'Team';
    }

    return assignedIds
      .map((userId) => {
        if (users[0] === 'success') {
          const user = users[1]?.find((user) => user.user_id === userId);
          return user ? user.name : 'Unknown User';
        }
        return 'User Not Found';
      })
      .join(', ');
  };



  const getTeamName = (assignedTeamIds) => {
  
    if (!assignedTeamIds || assignedTeamIds.length === 0) {
      return null;
    }
  
    return assignedTeamIds
      .map((teamId) => {
        if (teamId) {
          // Find the team in the teams array based on teamId
          const team = teams?.find((team) => team.t._ID === teamId);
          return team ? team.t.Name : 'Unknown Team';
        }
        return 'User Not Found';
      })
      .join(', ');
  };
  





  useEffect(() => {
    // Get restriction time (in hours)
    const delTime = workOrder.wo.wo_restriction_time; // Time in hours
  
    // Parse created time as UTC
    const creTime = moment.utc(workOrder.wo.created_at); // Force UTC interpretation for 'created_at'
  
    const currTime = moment(); // Get current local time
  
    const timeDiff = currTime.diff(creTime, 'minutes') / 60; // Calculate difference in minutes, then convert to hours
  
      
    if (timeDiff >= delTime) {
      setRestricted(true); // Set restricted if the time difference exceeds the restriction time
      setRestrictedTime(timeDiff)

     } else if(timeDiff < delTime){
      setRestricted(false); // Set restricted if the time difference exceeds the restriction time
      setRestrictedTime(delTime - timeDiff)
     
    }else{
      setRestrictedTime(null)

      setRestricted(false)
    }

    }, []);





  //   useEffect(() => {
  //   const fetchTeamName = async () => {
  //     try {
  //       const assignedTeamId = workOrder.wo.AssignedTeam ; // Team ID from work order
  
  //       if (workOrder.as.site_uuid && assignedTeamId ) {
  //         const response = await getAllTeams({ uuid: workOrder.as.site_uuid });

          
  //         console.log(response.data[0],workOrder.wo.AssignedTeam, "response data");
  
  //         // Match the assigned team ID with the teams fetched from the API
  //         const matchedTeam = response.data?.find(
  //           (team) => team.t._ID === workOrder.wo.AssignedTeam
  //         );
  
  //         console.log(matchedTeam,workOrder.wo.AssignedTeam,"details of matched team")
  //         if (matchedTeam) {
  //           setTeamName(matchedTeam.t.Name); // Set the team name
  //         } else {
  //           setTeamName("No team assigned");
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching team name:", error);
  //       setTeamName("Error fetching team");
  //     }
  //   };
  
  //   fetchTeamName();
  // }, [workOrder.wo.AssignedTeam, workOrder.as.site_uuid]); // Dependencies for re-running effect
  

  // const fetchWorkorder = async()=>{

  //   try{
  
  // const response = await GetWorkOrderInfo(workOrder.wo.uuid)
  
  // console.log(response[0].pm.site_uuid,'response for wo ')
  
  //   }catch(error){
  //     console.error(error)
  //   }
  
  
  // }


// useEffect(()=>{

// fetchWorkorder()
// },[])










const handleBack=()=>{



  

if(previousScreen == 'ScannedWoTag'){
  navigation.navigate('ScannedWoBuggyList',{
    workOrder: workOrder.wo.uuid,
    wo: workOrder.wo,
    previousScreen:previousScreen,
    restricted:restricted,
    restrictedTime:restrictedTime,
  })
}else{

    navigation.navigate('BuggyListTopTabs', {
      workOrder: workOrder.wo.uuid,
      wo: workOrder.wo,
      previousScreen:previousScreen,
      restricted:restricted,
      restrictedTime:restrictedTime
    });

  }


}


  const fontSize = Platform.OS === 'ios' ? 13 : 14;
  const largeFontSize = Platform.OS === 'ios' ? 16 : 18;
  return (
    <TouchableOpacity
    className="bg-white border p-4 rounded-md my-2 shadow-lg relative"
    style={{ borderColor: 'darkblue' }}
    onPress={handleBack}
  >
  
      {/* Work Order ID and status */}
      <View className="flex-row justify-between items-center">
        <View className="flex flex-row gap-4">
    

        <View className='flex flex-row '>
        <Text className="text-gray-600 font-bold" style={{ fontSize }}>
          ID : {workOrder.wo['Sequence No']} 
        </Text>
      {workOrder.wo['Sequence No'].split('-')[0] == 'BR' &&  <View className='bg-red-400 rounded-lg px-1 ml-2 text-white'>
          <Text className='text-xs text-white font-black '>BRKD</Text>
        </View>}
        {workOrder.wo['Sequence No'].split('-')[0] == 'HK' &&  <View className='bg-green-400 rounded-lg px-1 ml-2 text-white'>
          <Text className='text-xs text-white font-black '>HK</Text>
        </View>}
        </View>
        {workOrder.wo.wo_restriction_time && restricted ?

               <Icon name="flag" size={16} color="red"  />
       
       :  workOrder.wo.wo_restriction_time ?


<Icon name="clock-o" size={16} color="gray"  />:
null

}
        </View>
    
        <View className="flex-row items-center">
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

      {/* Work Order Name */}
      <View className="flex-row items-center my-2">
        <Icon name="cogs" size={fontSize} color="#074B7C" />
        <Text className="font-bold ml-2 text-blue-800" style={{ fontSize: largeFontSize }}>
          {workOrder.wo.Name || 'Unnamed Work Order'}
        </Text>
      </View>

{/* Assigned To */}
{(users[0] !== "error" && workOrder.wo.Assigned) || workOrder.wo.AssignedTeam ? (
  <View className="flex flex-row">
    <View className="w-1/3 flex-row items-center">
      <Icon name="user" size={fontSize} color="#1996D3" />
      <Text className="ml-2 text-gray-700 font-extrabold" style={{ fontSize }}>
        Assigned To :
      </Text>
    </View>
    <View className="flex-row ml-2 mt-1 w-2/3 flex-wrap">
      {/* Assigned Users */}
      {users[0] !== "error" &&
        workOrder.wo.Assigned &&
        getUserNames(workOrder.wo.Assigned).split(", ").map((name, index) => (
          <View key={`user-${index}`} className="bg-blue-100 px-2 py-0.5 rounded-full text-xs mr-1 ml-1 mb-1">
            <Text className="font-semibold" style={{ fontSize }}>
  {name.length > 15 ? name.slice(0, 15) + "..." : name}
</Text>

          </View>
        ))}
      {/* Assigned Team */}
      {workOrder.wo.AssignedTeam &&
        getTeamName(workOrder.wo.AssignedTeam).split(", ").map((name, index) => (
          <View key={`team-${index}`} className="bg-green-200 px-3  rounded-full mr-2 mb-2">
            <Text className="font-semibold text-green-800" style={{ fontSize }}>
  {name.length > 15 ? name.slice(0, 15) + "..." : name}
</Text>

          </View>
        ))}
    </View>
  </View>
) : null}
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

      {/* Priority Badge */}
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
});

export default WorkOrderCard;
