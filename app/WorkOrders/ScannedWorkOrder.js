import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import WorkOrderCard from './WorkOrderCards';
import { GetSingleWorkOrders } from '../../service/WorkOrderApis/GetSingleWorkOrderApi';
import DynamicPopup from '../DynamivPopUps/DynapicPopUpScreen';
import Loader from '../LoadingScreen/AnimatedLoader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const FilteredWorkOrderPage = ({ route, uuids: passedUuid }) => {
  const [loading, setLoading] = useState(false);
  const [filteredWorkOrders, setFilteredWorkOrders] = useState([]);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const uuid = route?.params?.uuid || passedUuid;
  const navigation = useNavigation();

  console.log(uuid, 'this is the uuid received in wororder screen');

  // Fetch work orders if not present in Redux
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await GetSingleWorkOrders(uuid);
      console.log(response, 'this is response for scanned wo');

      if (response && response.length > 0) {
        setFilteredWorkOrders(response);
      } else {
        setPopupVisible(true); // Show popup if no work orders are found
      }
    } catch (error) {
      console.error('Error fetching work orders:', error);
      setPopupVisible(true); // Show popup in case of an error
    } finally {
      setLoading(false);
    }
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
    navigation.goBack(); // Navigate back to the previous screen
  };

  useEffect(() => {
    fetchData();
  }, [uuid]);

  return (
    <View style={styles.container}>
      {/* Custom Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <FontAwesome name="arrow-left" size={20} color="white" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      ) : (
        <FlatList
          data={filteredWorkOrders}
          keyExtractor={(item) => item.wo['Sequence No']}
          renderItem={({ item }) => <WorkOrderCard workOrder={item} />}
          contentContainerStyle={styles.contentContainer}
        />
      )}

      {/* Dynamic Popup for No Work Orders */}
      <DynamicPopup
        visible={isPopupVisible}
        type="warning" // Example type, adjust as needed
        message={`No work orders found for this Asset`}
        onClose={handlePopupClose}
        onOk={handlePopupClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    width:100,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#1996D3', // Light theme color
    borderRadius: 8,
  },
  backButtonText: {
    
    marginLeft: 8,
    fontSize: 16,
    color: '#fff', // White text for contrast
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 10,
  },
});

export default FilteredWorkOrderPage;
