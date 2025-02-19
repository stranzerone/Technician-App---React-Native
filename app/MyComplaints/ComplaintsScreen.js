import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import ComplaintCard from './ComplaintCard';
import { GetMyComplaints } from '../../service/RaiseComplaintApis/GetMyComplaintApi';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import FilterOptions from '../WorkOrders/WorkOrderFilter';
import { usePermissions } from '../GlobalVariables/PermissionsContext';
import Loader from '../LoadingScreen/AnimatedLoader';

const ComplaintsScreen = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const navigation = useNavigation();
  const { complaintPermissions, complaintFilter, setComplaintFilter } = usePermissions();

  const fetchComplaints = async () => {

    console.log("calling for fetch complaints")
    try {
      setLoading(true);
      const response = await GetMyComplaints();
      setComplaints(response.data);
      filterComplaints(response.data, complaintFilter);
    } catch (err) {
      setError('Failed to load complaints');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchComplaints();
      filterComplaints(complaints, complaintFilter);

    }, [complaintFilter])
  );



  const filterComplaints = (complaintsList, status) => {
    console.log("calling for filter complaints")
    if (status === 'All') {
      setFilteredComplaints(complaintsList);
    } else {
      setFilteredComplaints(complaintsList.filter(complaint => complaint.status === status));
    }
  };

  const handleStatusChange = (status) => {
    setComplaintFilter(status);
    filterComplaints(complaints, status);
    setShowFilter(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
  };

  if (loading && refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <Loader />
        <Text style={styles.loadingText}>Loading complaints...</Text>
      </View>
    );
  }

  else if (error || complaints.length === 0) {
    return (
      <View style={styles.noComplaintsContainer}>
        <Loader />
        <Text style={styles.loadingText}>Loading complaints...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header} className="bg-[#159BD2] p-3 rounded-sm">
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilter(!showFilter)}>
          <FontAwesome name="filter" size={18} color="#fff" />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>

        <View style={styles.selectedStatusContainer}>
          <Text className="bg-gray-300 font-bold px-3 py-2 rounded-lg"  style={styles.selectedStatus}>{complaintFilter.toUpperCase()}</Text>
        </View>

        {complaintPermissions.some(permission => permission.includes('C')) && (
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('RaiseComplaint')}>
            <FontAwesome name="plus" size={18} color="#fff" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>

      {showFilter && (
        <FilterOptions
          filters={['All', 'Open', 'Hold', 'Cancelled', 'WIP', 'Closed', 'Reopen', 'Completed', 'Resolved', 'Working']}
          selectedFilter={complaintFilter}
          applyFilter={handleStatusChange}
          closeFilter={() => setShowFilter(false)}
        />
      )}

      {filteredComplaints.length === 0 ? (
        <View style={styles.noComplaintsContainer}>
          <FontAwesome name="exclamation-circle" size={30} color="#999" />
          <Text style={styles.noComplaintsText}>No Complaints Found</Text>
        </View>
      ) : (
        complaintPermissions.some(permission => permission.includes('R')) ? (
          <FlatList
            data={filteredComplaints}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ComplaintCard data={item} />}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        ) : (
          <View style={styles.noComplaintsContainer}>
            <Text>Not Authorized to view complaints</Text>
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    width:"100vw",
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#074B7C',
    fontSize: 16,
    marginTop: 10,
  },
  noComplaintsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noComplaintsText: {
    color: '#999',
    fontSize: 16,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#074B7C',
    padding: 10,
    borderRadius: 8,
  },
  filterText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  selectedStatusContainer: {
    flex: 1,
    alignItems: 'center',
  },
  selectedStatus: {
    color: '#074B7C',
    fontSize: 15,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#074B7C',
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
});

export default ComplaintsScreen;
