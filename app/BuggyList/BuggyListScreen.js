import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { GetInstructionsApi } from '../../service/BuggyListApis/GetInstructionsApi';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BuggyListCard from "../BuggyListCardComponets/BuggyListCard";
import Loader from '../LoadingScreen/AnimatedLoader';
import ProgressPage from '../AssetDetails/ProgressBar';
import CommentsPage from '../WoComments/WoCommentsScreen';
import { FontAwesome5 } from '@expo/vector-icons';

const BuggyListPage = ({ uuid, wo }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false); // State for managing expand/collapse
  const animation = useState(new Animated.Value(0))[0]; // Initialize animation state
  const navigate = useNavigation();

  console.log(uuid, wo, "info");
  
  const loadBuggyList = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const result = await GetInstructionsApi(uuid);
      setData(result);
    } catch (error) {
      setError(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBuggyList();
  }, [uuid]);

  useFocusEffect(
    React.useCallback(() => {
      loadBuggyList(); // Call loadBuggyList when the screen is focused
    }, [uuid]) // Depend on uuid to refetch if it changes
  );

  const handleRefreshData = async () => {
    await loadBuggyList(); // Re-fetch data from API
  };

  const renderCard = ({ item, index }) => (
    <BuggyListCard
      item={item}
      onUpdateSuccess={handleRefreshData} // Pass the refresh function as a prop
      index={index} // Pass the index for displaying
      WoUuId={uuid}
    />
  );

  const toggleExpand = () => {
    const finalValue = expanded ? 0 : 1; // 0 is collapsed, 1 is expanded
    setExpanded(!expanded);

    // Animate the expansion/collapse
    Animated.timing(animation, {
      toValue: finalValue,
      duration: 300, // Animation duration in milliseconds
      useNativeDriver: false, // `false` because height is being animated
    }).start();
  };

  const commentsHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 400], // Adjust the expanded height as needed
    extrapolate: 'clamp',
  });

  const handleAddInstruction = () => {
    const lastItem = data[data.length - 1]; // Get the last item from the data array
    if (lastItem && lastItem.order) {
      navigate.navigate('AddInstructions', { order: lastItem.order }); // Pass the order of the last item
    }
  };

  

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
    return <Loader />
  }

  if(!data){
   
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No instructions available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <ProgressPage data={data} wo={wo} />
      </View>
      <FlatList
        data={data}
        renderItem={renderCard}
        keyExtractor={(item) => item.id.toString()} // Use item.id for key extraction
        contentContainerStyle={styles.listContainer}
      />
      <Animated.View style={[styles.commentsContainer, { height: commentsHeight }]}>
        <CommentsPage WoUuId={uuid} />
      </Animated.View>
      <TouchableOpacity style={styles.expandButton} onPress={toggleExpand}>
        <Text style={styles.expandText}>{expanded ? 'Collapse Comments' : 'Expand Comments'}</Text>
        <FontAwesome5
          name={expanded ? 'chevron-up' : 'chevron-down'} // Using FontAwesome5 icons
          size={20}
          color="#fff" // Set icon color to white for contrast
        />
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E1F2FE',
    paddingBottom: 100,
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
  expandButton: {
    position: 'absolute',
    bottom: 60, // Position above the bottom tab bar
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#074B7C',
    borderRadius: 8,
  },
  expandText: {
    fontSize: 16,
    color: 'white',
    marginRight: 8, // Add some space between text and icon
  },
  refreshButton: {
    padding: 10,
    backgroundColor: '#1996D3',
    borderRadius: 5,
  },
  refreshButtonText: {
    color: '#fff',
  },
  commentsContainer: {
    overflow: 'hidden', // Ensures content is hidden when collapsed
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
