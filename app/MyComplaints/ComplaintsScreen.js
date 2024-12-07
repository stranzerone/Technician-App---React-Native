import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import ComplaintCard from './ComplaintCard';
import { GetMyComplaints } from '../../service/RaiseComplaintApis/GetMyComplaintApi';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import FilterOptions from '../WorkOrders/WorkOrderFilter';

const ComplaintsScreen = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
  const navigation = useNavigation();

  const statusOptions = [
    { label: 'All', value: 'All', color: '#999' },
    { label: 'Open', value: 'Open', color: '#4CAF50' },
    { label: 'Hold', value: 'Hold', color: '#FFC107' },
    { label: 'Cancelled', value: 'Cancelled', color: '#F44336' },
    { label: 'WIP', value: 'WIP', color: '#2196F3' },
    { label: 'Closed', value: 'Closed', color: '#9E9E9E' },
    { label: 'Reopen', value: 'Reopen', color: '#FF9800' },
    { label: 'Completed', value: 'Completed', color: '#673AB7' },
    { label: 'Resolved', value: 'Resolved', color: '#009688' },
    { label: 'Working', value: 'Working', color: '#3F51B5' },
  ];

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await GetMyComplaints();
        setComplaints(response);
        setFilteredComplaints(response);
      } catch (err) {
        setError('Failed to load complaints');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    if (status === 'All') {
      setFilteredComplaints(complaints);
    } else {
      const filtered = complaints.filter(complaint => complaint.status === status);
      setFilteredComplaints(filtered);
    }
    setShowFilter(false);  // Close the filter after selection
  };

  const renderComplaintCard = ({ item }) => (
    <ComplaintCard
      id={item.complaint_id}
      name={item.com_no}
      description={item.description}
      createdDate={item.created_at}
      status={item.status}
      amount={item.amount}
    />
  );

  const noComplaints = filteredComplaints?.length === 0;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#074B7C" />
        <Text style={styles.loadingText}>Loading complaints...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No Complaints Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Filter button on the left */}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilter(!showFilter)}
        >
          <FontAwesome name="filter" size={18} color="#fff" />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>

        {/* Selected filter status in the center */}
        <View style={styles.selectedStatusContainer}>
          <Text  className="bg-blue-300 px-5 py-1   rounded-lg" style={styles.selectedStatus}>{selectedStatus.toUpperCase()}</Text>
        </View>

        {/* Add button on the right */}
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('RaiseComplaint')}>
          <FontAwesome name="plus" size={18} color="#fff" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {showFilter && (
        <FilterOptions
          filters={statusOptions.map(option => option.value)}
          selectedFilter={selectedStatus}
          applyFilter={handleStatusChange}
          closeFilter={() => setShowFilter(false)}  // Close the filter when the option is selected
        />
      )}

      {noComplaints ? (
        <View style={styles.noComplaintsContainer}>
          <FontAwesome name="exclamation-circle" size={30} color="#999" />
          <Text style={styles.noComplaintsText}>No Complaints Found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredComplaints}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderComplaintCard}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 60,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    color: '#074B7C',
    fontSize: 16,
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#074B7C',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  filterText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  selectedStatusContainer: {
    flex: 1,
    alignItems: 'center',
  },
  selectedStatus: {
    color: '#074B7C',
    fontSize: 15,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#074B7C',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  noComplaintsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  noComplaintsText: {
    color: '#999',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default ComplaintsScreen;
