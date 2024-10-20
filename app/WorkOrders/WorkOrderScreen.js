import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure AsyncStorage is imported
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchServiceRequests } from '../../service/FetchWorkOrderApi';
import { usePermissions } from '../GlobalVariables/PermissionsContext';
import FilterOptions from './WorkOrderFilter';
import WorkOrderCard from './WorkOrderCards';
const WorkOrderPage = () => {
  const [filterVisible, setFilterVisible] = useState(false); // Filter options visibility
  const [selectedFilter, setSelectedFilter] = useState('OPEN'); // Selected filter state
  const [loading, setLoading] = useState(true); // Loading state
  const [workOrders, setWorkOrders] = useState([]); // Work orders data
  const [selectedWOIndex, setSelectedWOIndex] = useState(null); // Track the selected work order index
  const navigation = useNavigation();
  const { ppmAsstPermissions } = usePermissions(); // Destructure permissions from the context

  // Animation setup
  const indicatorAnim = useRef(new Animated.Value(0)).current; // Animation value

  // Filter options
  const filters = ['OPEN', 'STARTED', 'COMPLETED', 'HOLD', 'CANCELLED', 'REOPEN'];

  // Fetching work order data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true while fetching

      try {
        const id = await AsyncStorage.getItem('uuid'); // Fetch the uuid from AsyncStorage
        if (id) {
          const fetchedWorkOrders = await fetchServiceRequests(selectedFilter, id);
          setWorkOrders(fetchedWorkOrders);
        } else {
          // Handle case where uuid is not found
          setWorkOrders([]); // Reset work orders if uuid is not found
        }
      } catch (error) {
        console.error('Error fetching work orders:', error);
      }

      setLoading(false); // Set loading to false after fetching
    };

    fetchData();
  }, [selectedFilter]); // Re-fetch data when selectedFilter changes

  const applyFilter = (filter) => {
    setSelectedFilter(filter);
    setFilterVisible(false);
  };

  // Function to animate the indicator movement
  const handleWorkOrderPress = (index) => {
    setSelectedWOIndex(index);

    // Animate the indicator movement
    Animated.timing(indicatorAnim, {
      toValue: index * 70, // Assuming each Work Order card has a height of around 70px
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* Header with Add Button, Status Tile, and Filter Button */}
      <View style={styles.header}>
      
      
        {/* Status Tile */}
        <View style={styles.statusTile}>
          <Text style={styles.statusText}>{selectedFilter}</Text>
        </View>

        {/* Filter Button */}
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(!filterVisible)}>
          <Icon name="filter" size={16} color="#074B7C" />
        </TouchableOpacity>
      </View>

      {/* Loading Indicator */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#1996D3" />
        </View>
      ) : (
        <View>
          {/* Conditional rendering based on the length of workOrders */}
          {workOrders && workOrders.length > 0 ? (
            <FlatList
              data={workOrders}
              keyExtractor={(item) => item.wo['Sequence No']} // Ensure each item has a unique key
              renderItem={({ item, index }) => ( // Destructure item and index
                <TouchableOpacity onPress={() => handleWorkOrderPress(index)}>
                  <WorkOrderCard workOrder={item} />
                </TouchableOpacity>
              )}
              contentContainerStyle={[styles.contentContainer, { paddingBottom: 110 }]}
            />
          ) : (
            <View style={styles.noRecordsContainer}>
              <Icon name="exclamation-circle" size={50} color="#999" />
              <Text style={styles.noRecordsText}>No Records Found</Text>
              <Text style={styles.suggestionText}>Try adjusting your filters or adding a new work order.</Text>
            </View>
          )}

          {/* Animated Indicator */}
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

      {/* Filter Options Popup */}
      {filterVisible && (
        <FilterOptions
          filters={filters}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
   paddingRight:10,
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  statusTile: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: '#074B7C',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderTopLeftRadius: 0,  // No rounding on top left
    borderBottomLeftRadius: 0, // No rounding on bottom left
    borderTopRightRadius: -20, // Rounded on top right
    borderBottomRightRadius: 20, // Rounded on bottom right
    justifyContent: 'center',
    alignItems: 'center',
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
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderWidth:1,
    borderColor:"blue",
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
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
    bottom: 0, // Positioned at the bottom of the selected item
  },
});

export default WorkOrderPage;
