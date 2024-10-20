import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GetInstructionsApi } from '../../service/BuggyListApis/GetInstructionsApi';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
// import BuggyListCard from './BuggyListCard';
import BuggyListCard from "../BuggyListCardComponets/BuggyListCard"
import Loader from '../LoadingScreen/AnimatedLoader';

const BuggyListPage = ({ uuid }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigation();

  console.log(uuid, "uuid from buggyList");

  const loadBuggyList = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const result = await GetInstructionsApi(uuid);
      console.log("data received");
      setData(result);
    } catch (error) {
      setError(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshData = async () => {
    await loadBuggyList(); // Re-fetch data from API
  };

  useFocusEffect(
    React.useCallback(() => {
      loadBuggyList(); // Call loadBuggyList when the screen is focused
    }, [uuid]) // Depend on uuid to refetch if it changes
  );

  const renderCard = ({ item, index }) => (
    <BuggyListCard
      item={item}
      onUpdateSuccess={handleRefreshData} // Pass the refresh function as a prop
      index={index} // Pass the index for displaying
      WoUuId={uuid}
    />
  );

  const handleAddInstruction = () => {
    const lastItem = data[data.length - 1]; // Get the last item from the data array
    if (lastItem && lastItem.order) {
      navigate.navigate('AddInstructions', { order: lastItem.order }); // Pass the order of the last item
    }
    console.log('Add new instruction pressed');
  };

  // Show the Loader component while loading
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={handleRefreshData} style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No instructions available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderCard}
        keyExtractor={(item) => item.id.toString()} // Use item.id for key extraction
        contentContainerStyle={styles.listContainer}
      />
      {/* Add Button for adding new instruction */}
      {/* <TouchableOpacity style={styles.addButton} onPress={handleAddInstruction}>
        <Text style={styles.addButtonText}>Add New Instruction</Text>
      </TouchableOpacity> */}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#E1F2FE'
  },
  listContainer: {
    padding: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
  refreshButton: {
    padding: 10,
    backgroundColor: '#1996D3',
    borderRadius: 5,
  },
  refreshButtonText: {
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1996D3',
    padding: 15,
    borderRadius: 5,
    margin: 10,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
});

export default BuggyListPage;
