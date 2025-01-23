import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Modal,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FilterOptions from './WorkOrderFilter';
import WorkOrderCard from './WorkOrderCards';
import { getLocationWorkOrder } from '../../service/WorkOrderApis/GetLocationWo';
import { GetSingleWorkOrders } from '../../service/WorkOrderApis/GetSingleWorkOrderApi';
import Loader from '../LoadingScreen/AnimatedLoader';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../../utils/Slices/UsersSlice';
import { fetchAllTeams } from '../../utils/Slices/TeamSlice';
import { usePermissions } from '../GlobalVariables/PermissionsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-web';
import { getLocationHk } from '../../service/HouseKeepingApis/GetHkOnScan';

const ScannedWorkOrderPage = ({ route, uuids: passedUuid }) => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('OPEN'); // Default filter
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputNumber, setInputNumber] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const type = route?.params?.type || null;
  const uuid = route?.params?.uuid || passedUuid || null;

  console.log(uuid,type,"here on scanned wo screen")
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.data);
  const teams = useSelector((state) => state.teams.data);
  const { ppmAsstPermissions } = usePermissions();
  const [siteLogo,setSiteLogo]  = useState(null)
 const [listType,setListType] = useState(true)
  useEffect(() => {
    if (!users || !teams || users.length === 0 || teams.length === 0) {
      dispatch(fetchAllUsers());
      dispatch(fetchAllTeams());
    }
  }, [dispatch]);




  useFocusEffect(
    React.useCallback(() => {
      fetchWorkOrders();
    }, [uuid, type, selectedFilter, listType])
  );
  const fetchWorkOrders = async () => {
    setLoading(true);
    try {
      let response;
      if (type === 'LC') {
          console.log(listType,'list type')
        if(listType){
          response = await getLocationWorkOrder(uuid, selectedFilter); // Fetch based on location


        }else{ 
          response = await getLocationWorkOrder(uuid, selectedFilter); // Fetch based on location
           console.log(response,'for hk')
        }
      } else {
        response = await GetSingleWorkOrders(uuid, selectedFilter); // Fetch based on single work order
      }
      setWorkOrders(response || []); // Ensure response is an array
    } catch (error) {
      setWorkOrders([])
      console.error('Error fetching work orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (filter) => {
    setSelectedFilter(filter); // Apply selected filter
    setFilterVisible(false);
  };

  const filteredWorkOrders = workOrders.filter((order) => {
    // Filter work orders based on search input and selectedFilter
    const matchesFilter = order.wo?.Status === selectedFilter;
    const matchesSearch = !inputNumber || order.wo['Sequence No'].includes(inputNumber);
    return matchesFilter && matchesSearch;
  });

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorkOrders();
    setRefreshing(false);
  };


  useEffect(() => {
    // Define the fetchLogo function inside useEffect
    const fetchLogo = async () => {
      try {
        const societyString = await AsyncStorage.getItem('userInfo');
       
        if (societyString) {
          const societyData = JSON.parse(societyString); // Parse the data
          const parsedImages = JSON.parse(societyData.data.society.data)
          setSiteLogo(parsedImages.logo); // Set the logo URL
        } else {
          console.log('No society data found.');
        }
      } catch (error) {
        console.error('Error fetching society data:', error);
      }
    };

    fetchLogo(); // Call the function to fetch logo
  }, []); // Empty dependency array ensures this runs once when the component mounts



  return (
    <View style={styles.container}className="text-center">
      <View className="flex bg-[#1996D3] p-2 h-14 items-center justify-start  flex-row gap-3">
     
       {siteLogo &&
 <Image
    className="w-20 h-14 rounded-lg"
    source={{ uri: siteLogo }}
    style={styles.logo}
    resizeMode="contain"
  />}
        <Text className="font-bold text-white  text-center text-lg">{listType?"Work Orders":"Housekeeping WO"}</Text>

    
      </View>

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>

          <TouchableOpacity
            onPress={() => setFilterVisible((prev) => !prev)}
            style={styles.statusButton}
          >
            <Icon name="filter" size={20} color="#074B7C" style={styles.searchIcon} />
            <Text style={styles.statusButtonText}>Status</Text>
          </TouchableOpacity>

          <View style={styles.statusTextContainer}>
            <Text style={styles.statusText}>{selectedFilter}</Text>
          </View>
          {ppmAsstPermissions.some((permission) => permission.includes('C')) && (
            <TouchableOpacity
              onPress={() => navigation.navigate('AddWo')}
              style={styles.addButton}
            >
              <Icon name="plus" size={20} color="#074B7C" style={styles.searchIcon} />
              <Text style={styles.addButtonText}>Add WO</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Input */}
      <View className="flex gap-2  my-1 flex-row items-center justify-center w-full">
    <View className="w=[20%]">
      <TouchableOpacity
          className="bg-blue-500 p-2 rounded-md flex flex-row justify-center gap-1 "
          onPress={() => navigation.goBack()}
        
        >
          <Icon name="arrow-left" size={20} color="white" className="bg-blue-500" />
          <Text className="text-white text-center  font-bold">Back</Text>
        </TouchableOpacity>
</View>

<View className="flex flex-row w-[50%]">



      <View 
      className=" w-full"
      style={styles.inputContainer}>
        <Icon name="search" size={20} color="#074B7C" style={styles.searchIcon} />
        <TextInput
          style={styles.numberInput}
          onChangeText={(text) => setInputNumber(text)}
          value={inputNumber}
          placeholder="Search WO ID"
          keyboardType="numeric"
          placeholderTextColor="#888"
        />
      </View>



   </View>


   <View className="w=[20%] ">
      <TouchableOpacity
      onPress={()=>setListType(!listType)}
          className="bg-green-500 p-2 rounded-md flex flex-row justify-center gap-1 "
        
        
        >
          {
            listType?
          
 <Icon   name="home" size={20} color="white" className="bg-blue-500" />
:
<Icon   name="desktop" size={20} color="white" className="bg-blue-500" />

}
          <Text className="text-white text-center  font-bold">{listType?"HK":"WO"}</Text>
        </TouchableOpacity>
</View>

      </View>


      {/* Content */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      ) : filteredWorkOrders.length === 0 ? (
        <View style={styles.noRecordsContainer}>
          <Icon name="exclamation-circle" size={50} color="#074B7C" />
          <Text style={styles.noRecordsText}>No Work Order Found</Text>
        </View>
      ) : (
        <View className='px-4'> 
        <FlatList
          data={filteredWorkOrders}
          keyExtractor={(item) => item.wo['Sequence No']}
          renderItem={({ item }) => (
            <WorkOrderCard workOrder={item} previousScreen="ScannedWoTag" />
          )}
          contentContainerStyle={styles.contentContainer}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />

        </View>
      )}

      {/* Filter Modal */}
      {filterVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={filterVisible}
          onRequestClose={() => setFilterVisible(false)}
        >
          <FilterOptions
            filters={['OPEN', 'STARTED', 'COMPLETED', 'HOLD', 'CANCELLED', 'REOPEN']}
            selectedFilter={selectedFilter}
            applyFilter={applyFilter}
            closeFilter={() => setFilterVisible(false)}
          />
        </Modal>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    backgroundColor: '#074B7C',
    paddingVertical: 10,
    padding:10
  },
  backButton: {
    width: 90,
    textAlign: 'center',
  
    borderRadius: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 5,
  },
  statusButtonText: {
    marginLeft: 5,
    color: '#074B7C',
  },
  statusTextContainer: {
    paddingHorizontal: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 5,
  },
  addButtonText: {
    marginLeft: 5,
    color: '#074B7C',
  },
  inputContainer: {
    flexDirection: 'row',
    gap:10,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    width:"90%",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  numberInput: {
    flex: 1,
    height: 40,
    color: '#333',
  },

  noRecordsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRecordsText: {
    color: '#333',
    fontSize: 18,
    marginTop: 10,
  },
  contentContainer: {
    paddingBottom: 10,
  },
});

export default ScannedWorkOrderPage;
