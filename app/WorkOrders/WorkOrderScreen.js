import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FilterOptions from './WorkOrderFilter';
import WorkOrderCard from './WorkOrderCards';
import { fetchServiceRequests } from '../../service/FetchWorkOrderApi';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Loader from '../LoadingScreen/AnimatedLoader';
import { fetchAllUsers } from '../../utils/Slices/UsersSlice';
import { fetchAllTeams } from '../../utils/Slices/TeamSlice';
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector to access Redux state
import { usePermissions } from '../GlobalVariables/PermissionsContext';

const WorkOrderPage = () => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('OPEN');
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputNumber, setInputNumber] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [flag, setFlag] = useState(false); // New state to manage flag
  const navigation = useNavigation();

  const dispatch = useDispatch(); // Use dispatch to dispatch actions
  const users = useSelector((state) => state.users.data);
  const teams = useSelector((state) => state.teams.data);
  const { ppmAsstPermissions,ppmWorkorder } = usePermissions();



  useEffect(() => {
    if (!users || !teams || users.length === 0 || teams.length === 0) {
      dispatch(fetchAllTeams());

      dispatch(fetchAllUsers());
    }
  }, []);




  const fetchWorkOrders = async () => {
    setLoading(true);
    try {
      // Fetch work orders based on the selected filter and flag
      const data = await fetchServiceRequests(selectedFilter, flag); // Pass flag to the API call
      setWorkOrders(data || []);
    } catch (error) {
      console.error('Error fetching work orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop refreshing
    }
  };


  const permissionToAdd = ppmWorkorder.some((permission) => permission.includes('C'))


  useEffect(()=>{
      fetchWorkOrders();
  
  },[selectedFilter, flag]
  );



  // useEffect(() => {
  //   fetchWorkOrders();
  // }, [selectedFilter, flag]); // Also trigger fetchWorkOrders when flag changes

  const applyFilter = (filter) => {
    setSelectedFilter(filter);
    setFilterVisible(false);
  };

  const filteredWorkOrders = inputNumber
    ? workOrders.filter((order) =>
        order.wo['Sequence No'].includes(inputNumber)
      )
    : workOrders;

  // Pull-to-refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchWorkOrders();
  };

  const toggleFlag = () => {
    setFlag((prevFlag) => !prevFlag); // Toggle the flag between true and false
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.headerContainer}>
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
          {ppmWorkorder.some((permission) => permission.includes('C')) && (
            <TouchableOpacity
              onPress={() => navigation.navigate('AddWo',{qr:"no",type:null,uuid:null})}
              style={[styles.addButton,{backgroundColor:permissionToAdd ? '#1996D3' : '#52B0E0'}]}
              disabled={!permissionToAdd}
              
            >
              <Icon name="plus" size={20} color="#074B7C" style={styles.searchIcon} />
              <Text style={styles.addButtonText}>Add WO</Text>
            </TouchableOpacity>
          )}
        </View>

                {/* <Icon name="search" size={20} color="#074B7C" style={styles.searchIcon} />
        <TextInput
          style={styles.numberInput}
          onChangeText={(text) => setInputNumber(text)}
          value={inputNumber}
          placeholder="Search WO ID"
          keyboardType="numeric"
          placeholderTextColor="#888"
        /> 
      </View> */}

      {/* Search Input */}
      <View className="flex flex-row items-center justify-between p-3 mt-1 bg-[#074B7C] rounded-md shadow-md">
  {/* Left Side: Flag & Filter */}
  <View className="flex flex-row items-center space-x-3">
    {/* Flag Button */}
    <TouchableOpacity
      className="py-1 px-2 rounded-md border border-gray-400 bg-[#f8f9fa] shadow-md flex items-center justify-center"
      onPress={toggleFlag}
    >
      <Icon name="flag" size={17} color={flag ? 'red' : '#074B7C'} />
    </TouchableOpacity>

    {/* Filter Button */}
    <TouchableOpacity
      onPress={() => setFilterVisible((prev) => !prev)}
      className="flex flex-row  items-center px-2 py-1 bg-[#f8f9fa] rounded-md shadow-md"
    >
      <Icon name="filter" size={17} color="#074B7C" className="mr-2" />
      <Text className="text-[#074B7C] font-semibold">Filter</Text>
    </TouchableOpacity>
  </View>

  {/* Center: Current Status */}
  <Text className="text-white font-semibold text-lg">{selectedFilter}</Text>

  {/* Right Side: Add Button */}
  {ppmWorkorder.some((permission) => permission.includes('C')) && (
    <TouchableOpacity
      onPress={() => navigation.navigate('AddWo', { qr: "no", type: null, uuid: null })}
      className={`flex flex-row items-center px-4 py-1 rounded-md shadow-md ${
        permissionToAdd ? 'bg-white' : 'bg-gray-300'
      }`}
      disabled={!permissionToAdd}
    >
      <Icon name="plus" size={17} color={permissionToAdd ? '#074B7C' : 'gray'} className="mr-2" />
      <Text className={`font-semibold ${permissionToAdd ? 'text-[#074B7C]' : 'text-gray-500'}`}>
        Add
      </Text>
    </TouchableOpacity>
  )}
</View>

      {/* Content */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      ) : workOrders.length === 0 || filteredWorkOrders.length === 0 ? (
        <View style={styles.noRecordsContainer}>
          <Icon name="exclamation-circle" size={50} color="#074B7C" />
          <Text style={styles.noRecordsText}>No Work Order Found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredWorkOrders}
          keyExtractor={(item) => item.wo['Sequence No']}
          renderItem={({ item }) => <WorkOrderCard workOrder={item} previousScreen="Work Orders" />}
          contentContainerStyle={styles.contentContainer}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
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
    backgroundColor: '#f8f9fa',
    paddingBottom: 70,
  },
  headerContainer: {
    backgroundColor: '#074B7C',
    paddingVertical: 10,
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
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    paddingVertical: 5,
    width: 100,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statusButtonText: {
    marginLeft: 8,
    fontWeight: 'bold',
    color: '#000',
  },
  statusTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  statusText: {
    fontWeight: '900',
    fontSize: 16,
    color: '#fff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 90,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  addButtonText: {
    marginLeft: 8,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchIcon: {
    color: '#074B7C',
  },
  numberInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    width: '75%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"flex-end",
    gap: 10,
    paddingHorizontal: 25,
    paddingTop: 10,
  },
  flagButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRecordsContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 0,
    alignItems: 'center',
  },
  noRecordsText: {
    fontSize: 18,
    color: '#074B7C',
    marginTop: 20,
    fontWeight: 'bold',
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
});

export default WorkOrderPage;
