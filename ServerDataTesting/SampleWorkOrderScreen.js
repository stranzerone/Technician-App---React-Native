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
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';
import GetUuIdForTag from '../../service/NfcTag/GetUuId';

const WorkOrderPage = () => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('OPEN');
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputNumber, setInputNumber] = useState('');
  const [refreshing, setRefreshing] = useState(false); // Track refresh state
  const navigation = useNavigation();
  const [nfcEnabled, setNfcEnabled] = useState(false);

  useEffect(() => {
    const initNfc = async () => {
      try {
        const isSupported = await NfcManager.isSupported();
        if (!isSupported) {
          console.log('NFC is not supported on this device.');
          return;
        }

        await NfcManager.start(); // Initialize NFC
        const isEnabled = await NfcManager.isEnabled();
        setNfcEnabled(isEnabled);

        if (!isEnabled) {
          console.log('NFC is not enabled on this device.');
        }

        await NfcManager.setEventListener(NfcEvents.DiscoverTag, onTagDetected);
        await NfcManager.registerTagEvent();
      } catch (error) {
        console.error('Error initializing NFC:', error);
      }
    };

    initNfc();

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      NfcManager.unregisterTagEvent().catch((err) =>
        console.error('Error unregistering NFC tag event:', err)
      );
    };
  }, []);

  const onTagDetected = async (tag) => {
    try {
      if (!tag || !tag.id) {
        console.log('Invalid or missing NFC tag.');
        return;
      }
  
      console.log(tag.id, "this is tag id");
  
      const response = await GetUuIdForTag(tag.id.toLowerCase());
      console.log('NFC tag detected:', tag.id, response);
  
      if (response.status === 'success') {
        const count = response.metadata?.count;
        if (count === '0') {
          Alert.alert("No Asset Found Related to Tag");
        } else {
          const siteUuid = response.data[0]?.uuid;
          if (!siteUuid) {
            console.log('Invalid site_uuid in response data:', response.data[0]);
            return;
          }
          navigation.navigate('ScannedWoTag', { uuid: siteUuid });
        }
      } else {
        console.log('Invalid NFC tag or response');
      }
    } catch (error) {
      console.error('Error while detecting tag:', error);
      Alert.alert('Error', 'Something went wrong while processing the tag. Please try again.');
    }
  };

  useEffect(() => {
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
          <TouchableOpacity
            onPress={() => navigation.navigate('AddWo')}
            style={styles.addButton}
          >
            <Icon name="plus" size={20} color="#074B7C" style={styles.searchIcon} />
            <Text style={styles.addButtonText}>Add WO</Text>
          </TouchableOpacity>
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
          <ActivityIndicator size="large" color="#1996D3" />
        </View>
      ) : workOrders.length === 0 ? (
        <View style={styles.noRecordsContainer}>
          <Icon name="exclamation-circle" size={50} color="#074B7C" />
          <Text style={styles.noRecordsText}>No Work Order Found</Text>
          <Text style={styles.suggestionText}>
            Try adjusting your filters or searching for a different ID.
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 10,
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRecordsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
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
