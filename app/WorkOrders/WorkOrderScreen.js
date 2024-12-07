import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Animated,
  TextInput,
  Modal,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FilterOptions from './WorkOrderFilter';
import WorkOrderCard from './WorkOrderCards';
import { fetchWorkOrders, selectWorkOrders } from '../../utils/Slices/WorkOrderSlice';
import { fetchServiceRequests } from '../../service/FetchWorkOrderApi';
import { fetchAllUsers } from '../../utils/Slices/UsersSlice';
import { fetchAllTeams } from '../../utils/Slices/TeamSlice';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { fetchAssets } from '../../utils/Slices/AssetSlice';
import { fetchAllPms } from '../../utils/Slices/PmsSlice';
import { fetchAllReduxData } from '../AllReduxCall/MakeReduxCallsLogin';
import { usePermissions } from '../GlobalVariables/PermissionsContext';
const WorkOrderPage = ({ route, nullUuId }) => {
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('OPEN');
  const [selectedWOIndex, setSelectedWOIndex] = useState(null);
  const [inputNumber, setInputNumber] = useState('');
  const [filteredWorkOrders, setFilteredWorkOrders] = useState([]);
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const { notificationsCount } = usePermissions();
  const uuid = route?.params?.uuid || nullUuId;

  let workOrders = useSelector(selectWorkOrders);
  const loading = useSelector((state) => state.workOrders.status === 'loading');

  console.log('Page got refreshed');

  // Fetch work orders when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        if (workOrders.length === 0) {
          await fetchServiceRequests(selectedFilter);
          await fetchAllReduxData(dispatch);
        }
      };

      fetchData();
    }, [dispatch, workOrders,selectedFilter])
  );

  useEffect(() => {
    let filterData;

    if (uuid) {
      filterData = workOrders.filter((order) => order.wo.asset_uuid === uuid);
    } else {
      filterData = workOrders.filter((order) => order.wo.Status === selectedFilter);
    }

    if (inputNumber) {
      filterData = filterData.filter((order) =>
        order.wo['Sequence No'].includes(inputNumber)
      );
    }

    setFilteredWorkOrders(filterData);
  }, [workOrders, uuid, selectedFilter, inputNumber]);

  const applyFilter = (filter) => {
    setSelectedFilter(filter);
    setFilterVisible(false);
  };

  const handleWorkOrderPress = (index) => {
    setSelectedWOIndex(index);
    Animated.timing(indicatorAnim, {
      toValue: index * 70,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleRefresh = async () => {
    setRefreshing(true); // Set the refreshing state to true
    try {
      console.log("refreshed the whole page")
      // await fetchServiceRequests(selectedFilter);
      // await fetchAllReduxData(dispatch);
       dispatch(fetchWorkOrders())
     } catch (error) {
      console.error('Error refreshing work orders:', error);
    } finally {
      setRefreshing(false); // Ensure refreshing is set to false after data is fetched
    }
  };


  useEffect(()=>{
console.log("handle refresh called to refresh page")
    handleRefresh()
  },[notificationsCount])

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {!uuid && (
        <>
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

              <TouchableOpacity
                onPress={() => navigation.navigate('AddWo')}
                style={styles.addButton}
              >
                <Icon name="plus" size={20} color="#074B7C" style={styles.searchIcon} />
                <Text style={styles.addButtonText}>Add WO</Text>
              </TouchableOpacity>
            </View>
          </View>

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
        </>
      )}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#1996D3" />
        </View>
      ) : (
        <FlatList
          data={filteredWorkOrders}
          keyExtractor={(item) => item.wo['Sequence No']}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => handleWorkOrderPress(index)}>
              <WorkOrderCard workOrder={item} />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.contentContainer}
          refreshing={refreshing} // Add refreshing state to FlatList
          onRefresh={handleRefresh} // Add onRefresh callback
        />
      )}
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
    paddingBottom:60,
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
    paddingVertical: 5,
    width: 120,
    paddingHorizontal: 10,
    borderTopLeftRadius: 0,
    borderBottomStartRadius: 0,
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
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1996D3',
    width: 100,
    paddingVertical: 5,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  addButtonText: {
    marginLeft: 8,
    fontWeight: 'bold',
    color: '#fff',
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
  contentContainer: {
    padding: 10,
  },
  noRecordsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noRecordsText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
  },
  suggestionText: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
    textAlign: 'center',
  },
  indicator: {
    position: 'absolute',
    width: '100%',
    height: 5,
    backgroundColor: '#1996D3',
  },
});

export default WorkOrderPage;
