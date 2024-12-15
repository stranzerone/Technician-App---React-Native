import React, { useState, useEffect, useRef } from 'react';
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
import { useNavigation } from '@react-navigation/native';
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
  const [refreshing, setRefreshing] = useState(false); // Track refresh state
  const navigation = useNavigation();


  const dispatch = useDispatch(); // Use dispatch to dispatch actions
  const users = useSelector((state) => state.users.data);
  const teams = useSelector((state) => state.teams.data);
  const { ppmAsstPermissions } = usePermissions();
  console.log(ppmAsstPermissions,"this are the permissions")
  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchAllUsers());
    } 

    if (teams.length === 0) {
      dispatch(fetchAllTeams());
    } 
  }, [users, teams, dispatch]);
  const fetchWorkOrders = async () => {
    setLoading(true);
    try {
      // Fetch work orders based on the selected filter
      const data = await fetchServiceRequests(selectedFilter);
      setWorkOrders(data || []); // Set to an empty array if no data is returned
    } catch (error) {
      console.error('Error fetching work orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop refreshing
    }
  };

  useEffect(() => {
  
    fetchWorkOrders();
  }, [selectedFilter]);

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
    setRefreshing(true); // Trigger refresh
    fetchWorkOrders(); // Reload data
  };

  return (
    <View style={styles.container}>
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
          {ppmAsstPermissions.some((permission) => permission.includes('C'))&&
          <TouchableOpacity
            onPress={() => navigation.navigate('AddWo')}
            style={styles.addButton}
          >
            <Icon name="plus" size={20} color="#074B7C" style={styles.searchIcon} />
            <Text style={styles.addButtonText}>Add WO</Text>
          </TouchableOpacity>
}
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.inputContainer}>
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

      {/* Content */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      ) : workOrders.length === 0 ? (
        <View style={styles.noRecordsContainer}>
          <Icon name="exclamation-circle" size={50} color="#074B7C" />
          <Text style={styles.noRecordsText}>No Work Order Found</Text>
          <Text style={styles.suggestionText}>
         For {selectedFilter} filter
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredWorkOrders}
          keyExtractor={(item) => item.wo['Sequence No']}
          renderItem={({ item }) => <WorkOrderCard workOrder={item} />}
          contentContainerStyle={styles.contentContainer}
          refreshing={refreshing} // Pass refreshing state to FlatList
          onRefresh={onRefresh} // Set up the pull-to-refresh functionality
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
    paddingBottom:70
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
    backgroundColor: '#1996D3',
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
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#074B7C',
    padding: 8,
    fontSize: 16,
    color: '#074B7C',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  numberInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    width: '80%',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRecordsContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom:30,
    marginTop:0,
    alignItems: 'center',
    marginTop: 0,
  },
  noRecordsText: {
    fontSize: 18,
    color: '#074B7C',
    marginTop: 20,
    fontWeight: 'bold',
  },
  suggestionText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
});

export default WorkOrderPage;
