import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { GetInstructionsApi } from '../../service/BuggyListApis/GetInstructionsApi';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BuggyListCard from "../BuggyListCardComponets/BuggyListCard";
import Loader from '../LoadingScreen/AnimatedLoader';
import ProgressPage from '../AssetDetails/ProgressBar';
import CommentsPage from '../WoComments/WoCommentsScreen';
import { FontAwesome5 } from '@expo/vector-icons';
import {WorkOrderInfoApi} from '../../service/WorkOrderInfoApi';

const BuggyListPage = ({ uuid, wo }) => {
  const [data, setData] = useState([]);
  const [assetDescription, setAssetDescription] = useState(''); // State for asset description
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false); // State for managing expand/collapse
  const animation = useState(new Animated.Value(0))[0]; // Initialize animation state
  const navigate = useNavigation();
  // Function to fetch buggy list data
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

  // Function to fetch asset description
  const loadAssetDescription = async () => {
    try {
      const response = await WorkOrderInfoApi(uuid); // Call the asset info API using uuid
      setAssetDescription(response[0].wo.Description || 'No description available.');
    } catch (error) {
      setError(error.message || 'Error fetching asset description.');
    }
  };

  useEffect(() => {
    loadBuggyList();
    loadAssetDescription(); // Fetch asset description on mount
  }, [uuid]);

  useFocusEffect(
    React.useCallback(() => {
      loadBuggyList(); // Call loadBuggyList when the screen is focused
      loadAssetDescription(); // Re-fetch description when screen is focused
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
    outputRange: [0, 500], // Adjust the expanded height as needed
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
    return <Loader />;
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
      <View style={styles.descriptionContainer}>
        <Text style={styles.assetDescription}>{assetDescription}</Text>
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

      {/* Comments Expand Button */}
      <TouchableOpacity style={styles.expandButton} onPress={toggleExpand}>
        <FontAwesome5
          name={expanded ? 'comments' : 'comments'} // Using FontAwesome5 icons
          size={20}
          color="#fff" // Set icon color to white for contrast
        />
      </TouchableOpacity>

      {/* Progress Bar Container */}
      <View style={styles.progressBarContainer}>
      <ProgressPage 
      data={data}
      wo={wo}
       
       />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E1F2FE',
  },
  listContainer: {
    padding: 10,
    paddingBottom: 80, // Ensure space for the expand button
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
  descriptionContainer: {
    borderTopWidth:.1,
    borderBottomWidth:.5,
    padding: 10, // Increased padding for better spacing
    backgroundColor: '#fff', // White background for clarity
    marginBottom: 0, // Space between description and next component
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 4 }, // Shadow offset for iOS
    shadowOpacity: 0.1, // Light shadow opacity for subtle effect
    shadowRadius: 6, // Blur radius for the shadow
    elevation: 5, // Shadow for Android
  },
  assetDescription: {
    fontSize: 14, // Slightly larger font size for readability
    fontWeight: '600', // Make the text bolder
    color: '#333', // Darker text color for contrast
    textAlign: 'center', // Center-align the text
    lineHeight: 24, // Improved line height for readability
  },
  expandButton: {
    marginBottom: 60,
    position: 'absolute',
    bottom: 10, // Attach to the bottom with a small margin
    left: 10, // Attach to the left with a small margin
    width: 50, // Set width equal to height for a perfect circle
    height: 50, // Set height equal to width for a perfect circle
    justifyContent: 'center',
    alignItems: 'center', // Center the content inside the button
    backgroundColor: '#074B7C',
    borderRadius: 25, // Half of the width/height for a circular shape
    elevation: 5, // Add shadow for better visibility (on Android)
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.25, // Shadow opacity for iOS
    shadowRadius: 3.84, // Shadow blur radius for iOS
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
  progressBarContainer: {
   
    position: 'relative',
    bottom: 70, // Attach to the bottom
    left: 180, // Attach to the right
    height: 50,
    width:200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  
  },
  progressButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default BuggyListPage;
