import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import ComplaintCard from './ComplaintCard';
import { GetMyComplaints } from '../../service/RaiseComplaintApis/GetMyComplaintApi';
import RNPickerSelect from 'react-native-picker-select';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ComplaintsScreen = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('Open');
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

  // New condition to check for no filtered complaints
  const noComplaints = filteredComplaints.length === 0;

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
      {/* Filter and Add Complaint Section */}
      <View style={styles.filterContainer}>
        {/* Dropdown for selecting status */}
        <View style={styles.dropdownContainer}>
          <RNPickerSelect
            onValueChange={handleStatusChange}
            items={statusOptions.map(option => ({
              ...option,
              style: { color: option.color, fontWeight: selectedStatus === option.value ? 'bold' : 'normal' },
            }))}
            value={selectedStatus}
            style={{
              inputIOS: [styles.pickerInput, { color: statusOptions.find(option => option.value === selectedStatus)?.color }],
              inputAndroid: [styles.pickerInput, { color: statusOptions.find(option => option.value === selectedStatus)?.color }],
              iconContainer: styles.iconContainer,
            }}
            placeholder={{}}
          />
        </View>

        {/* Button for adding new complaint */}
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('RaiseComplaint')}>
          <FontAwesome name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Show "No Complaints Found" if filtered complaints are empty */}
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
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dropdownContainer: {
    width: '70%',
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#074B7C',
    paddingLeft: 12,
  },
  pickerInput: {
    height: 50,
    fontSize: 16,
  },
  iconContainer: {
    right: 10,
    top: 15,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    height: 50,
    backgroundColor: '#074B7C',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
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
