import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Animated, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FilterOptions from './WorkOrderFilter';
import WorkOrderCard from './WorkOrderCards';
import { fetchWorkOrders, selectWorkOrders } from '../../utils/Slices/WorkOrderSlice';
import { fetchServiceRequests } from '../../service/FetchWorkOrderApi';
import { fetchAllUsers } from '../../utils/Slices/UsersSlice';
import { fetchAllTeams } from '../../utils/Slices/TeamSlice';
const WorkOrderPage = ({ route, nullUuId }) => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('OPEN');
  const [selectedWOIndex, setSelectedWOIndex] = useState(null);
  const [inputNumber, setInputNumber] = useState('');
  const [filteredWorkOrders, setFilteredWorkOrders] = useState([]);
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();

  // Check if `uuid` is provided from `route.params` or fallback to `nullUuId`
  const uuid = route?.params?.uuid || nullUuId;

  let workOrders = useSelector(selectWorkOrders);
  const loading = useSelector((state) => state.workOrders.status === 'loading');

  console.log(uuid,'recied for dynamic one or two')
  useEffect(() => {
    if (workOrders.length === 0) {

  const fetchApiWorkOrders = async()=>{
console.log("Fetching through api")
        workOrders = await fetchServiceRequests(selectedFilter)
      }
      fetchApiWorkOrders()
      console.log("dispatch started")

      dispatch(fetchWorkOrders());
      dispatch(fetchAllTeams());
      dispatch(fetchAllUsers());
   
    }
  }, [dispatch, workOrders]);





  useEffect(() => {
    let filterData;
  
    // Check if uuid is present; if so, filter based on uuid and selectedFilter
    if (uuid) {
      filterData = workOrders.filter((order) => {
        return order.wo.asset_uuid === uuid ;
      });
    } else {
      // If uuid is not present, filter based only on selectedFilter
      filterData = workOrders.filter((order) => order.wo.Status === selectedFilter);
    }
  
    // Apply search filter if inputNumber is present
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

  return (
    <View style={styles.container}>
    {
      !uuid &&
      <View style={styles.header}>
      <View style={{ backgroundColor: '#074B7C' }} className="w-[60vw] h-11 flex flex-row items-center justify-start shadow-md">
        <TouchableOpacity
          onPress={() => setFilterVisible((prev) => !prev)}
          className="w-[52%] h-full bg-white border border-gray-600 shadow-lg rounded-r-full flex-row items-center justify-center"
        >
          <Icon name="filter" size={20} color="#000" />
          <Text className="text-black font-bold ml-2">Status</Text>
        </TouchableOpacity>
        <View className="flex-1 h-full rounded-l-full flex items-center justify-center">
          <Text className="text-white font-bold text-md">{selectedFilter}</Text>
        </View>
      </View>
      <TextInput
        className="h-full border-black border"
        style={styles.numberInput}
        onChangeText={(text) => setInputNumber(text)}
        value={inputNumber}
        placeholder="Search Wo ID"
        keyboardType="numeric"
        placeholderTextColor="#888"
      />
    </View>
}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#1996D3" />
        </View>
      ) : (
        <View>
          {filteredWorkOrders && filteredWorkOrders.length > 0 ? (
            <FlatList
              data={filteredWorkOrders}
              keyExtractor={(item) => item.wo['Sequence No']}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => handleWorkOrderPress(index)}>
                  <WorkOrderCard workOrder={item} />
                </TouchableOpacity>
              )}
              contentContainerStyle={[styles.contentContainer, { paddingBottom: 110 }]}
            />
          ) : (
            <View style={styles.noRecordsContainer}>
              <Text>
                <Icon name="exclamation-circle" size={50} color="#999" />
              </Text>
              <Text style={styles.noRecordsText}>No Records Found</Text>
              <Text style={styles.suggestionText}>Try adjusting your filters or adding a new work order.</Text>
            </View>
          )}

          {selectedWOIndex !== null && (
            <Animated.View
              style={[
                styles.indicator,
                {
                  transform: [{ translateY: indicatorAnim }],
                },
              ]}
            />
          )}
        </View>
      )}

      {filterVisible && (
        <FilterOptions
          filters={['OPEN', 'STARTED', 'COMPLETED', 'HOLD', 'CANCELLED', 'REOPEN']}
          selectedFilter={selectedFilter}
          applyFilter={applyFilter}
          closeFilter={() => setFilterVisible(false)}
        />
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  numberInput: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    color: '#000',
  },
  header: {
    backgroundColor: '#074B7C',
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  noRecordsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '40%',
  },
  noRecordsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#074B7C',
    marginTop: 10,
  },
  suggestionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    marginTop: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  indicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: '#074B7C',
    bottom: 0,
  },
});

export default WorkOrderPage;
