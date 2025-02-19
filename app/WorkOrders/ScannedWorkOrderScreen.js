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
 const [breakdownActive,setBreakdownActive] = useState(false)
  useEffect(() => {
    if (!users || !teams || users.length === 0 || teams.length === 0) {
      dispatch(fetchAllUsers());
      dispatch(fetchAllTeams());
    }
  }, [dispatch]);




  useFocusEffect(
    React.useCallback(() => {
      fetchWorkOrders();
    }, [uuid, type, selectedFilter, listType,breakdownActive])
  );
  const fetchWorkOrders = async () => {
    console.log('fetching work orders',selectedFilter,breakdownActive);
    setLoading(true);
    try {
      let hk = [];
      let work =[];
      let breakWork =[]
      if (type === 'LC') {
      
        work = await getLocationWorkOrder(uuid, selectedFilter,false); // Fetch based on location
        breakWork = await getLocationWorkOrder(uuid, selectedFilter,true); // Fetch based on location


          hk = await getLocationHk(uuid, selectedFilter,false); 
          setWorkOrders([...work,...breakWork,...hk]); // Ensure response is an array


      } else {
        breakWork = await GetSingleWorkOrders(uuid, selectedFilter,true); // Fetch based on single work order
        work = await GetSingleWorkOrders(uuid, selectedFilter,false); // Fetch based on single work order
        setWorkOrders([...work,...breakWork]); // Ensure response is an array

      }
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


  const hkClicked = () =>{

    setListType(!listType)
    onRefresh()

  }


  const breakdownClicked = () =>{
    console.log('breakdown clicked',breakdownActive)
    setBreakdownActive(!breakdownActive)
  
  }
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




      <View className="flex flex-row  gap-4 items-center justify-start w-full p-2">
  {/* Back Button */}
  <TouchableOpacity
    className="bg-blue-500 p-2 rounded-md w-[15vw] flex flex-row justify-center items-center"
    onPress={() => navigation.goBack()}
  >
    <Icon name="arrow-left" size={20} color="white" />
  </TouchableOpacity>

  {/* Search Input */}
  <View className="flex flex-row gap-1 items-center w-[70vw] border border-gray-500 rounded-md px-1">
    <Icon name="search" size={18} color="#074B7C" className="mr-2" />
    <TextInput
      style={styles.numberInput}
      onChangeText={(text) => setInputNumber(text)}
      value={inputNumber}
      placeholder="Search WO ID"
      keyboardType="numeric"
      placeholderTextColor="#888"
      className="flex-1"
    />
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
