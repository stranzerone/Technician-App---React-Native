import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, Dimensions, FlatList } from 'react-native';
import { GetAllMyComplaints } from '../../service/ComplaintApis/GetMyAllComplaints';
import { FontAwesome } from '@expo/vector-icons'; // Import icons from FontAwesome
import { useNavigation } from '@react-navigation/native';
import { usePermissions } from '../GlobalVariables/PermissionsContext';
const { width } = Dimensions.get('window'); // Get the screen width

const ComplaintDropdown = () => {
  const [complaints, setComplaints] = useState([]); // State to hold complaints
  const [loading, setLoading] = useState(true); // State to manage loading
  const [expandedComplaintId, setExpandedComplaintId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
 
  const { notificationsCount } = usePermissions();
    const navigation = useNavigation()
  // Fetch complaints when the component mounts
  useEffect(() => {

    console.log("fetching complaints")
    const fetchComplaints = async () => {
      try {
        const response = await GetAllMyComplaints();
        if (response && response.data) {
          const complaintsArray = Object.values(response.data);
          setComplaints(complaintsArray); // Update state with fetched complaints
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false); // Set loading to false after the API call
      }
    };

    fetchComplaints(); // Call the fetch function
  }, [notificationsCount]); // Empty dependency array to run only on mount

  // Toggle complaint expansion
  const toggleComplaint = (id) => {
    setExpandedComplaintId((prevId) => (prevId === id ? null : id));
  };

  // Filter complaints based on search query
  const filteredComplaints = complaints.filter(complaint =>
    complaint.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render a square card for each complaint category
  const renderComplaintCard = ({ item }) => {
    // Split the complaint name into two parts
    const [firstLine, secondLine] = item.name.split(' (');
    const firstLetter = firstLine.trim().charAt(0).toUpperCase(); // Get the first letter of the first line

    return (
      <TouchableOpacity key={item.id} style={styles.cardContainer} onPress={()=>navigation.navigate('subComplaint',{ subCategory: item.sub_catagory})}>
        <View style={styles.circleContainer}>
          <Text style={styles.circleText}>{firstLetter}</Text>
        </View>
        <Text style={styles.cardText}>{firstLine.trim()}</Text>
        {secondLine && (
          <Text style={styles.cardText}>
            {'(' + secondLine}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.scrollContainer}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Categroy..."
          placeholderTextColor="#B0B0B0"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FontAwesome name="search" size={20} color="#1996D3" style={styles.searchIcon} />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#1996D3" style={styles.loader} />
      ) : (
        <FlatList
          contentContainerStyle={styles.container}
          data={filteredComplaints}
          renderItem={renderComplaintCard}
          keyExtractor={(item) => item.id.toString()} // Use id as key
          ListEmptyComponent={<Text style={styles.noResultsText}>No complaints found.</Text>} // Show when no complaints match the filter
          showsVerticalScrollIndicator={false} // Hide vertical scroll indicator
          numColumns={2} // Display two cards per row
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#F9F9F9', // Light background for the whole view
  },
  container: {
    marginTop: 60, // Adjusted to reduce space above
    paddingBottom: 20, // Adjust bottom padding for a cleaner look
    paddingVertical: 10,
    paddingHorizontal: 10,
    paddingBottom:150,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'normal', // Lighter font weight
    marginBottom: 10,
    color: '#074B7C',
    textAlign: 'center',
  },
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  paddingHorizontal: 10, // Horizontal padding for the container
  },
  searchBar: {
    flex: 1,
    height: 50, // Increased height for better visibility
    backgroundColor: '#FFFFFF', // White background for the search bar
    borderColor: '#1996D3',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 40, // Added left padding for space with the icon
    fontSize: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 25, // Position the icon inside the input
    top: 15, // Center the icon vertically within the TextInput
  },
  cardContainer: {
    backgroundColor: '#FFFFFF', // White background for the card
    width: '48%', // 2 cards per row
    aspectRatio: 1, // This makes it square
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 5, // Margin between cards
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardText: {
    color: '#074B7C', // Text color matching your theme
    fontWeight: 'normal', // Lighter font weight
    textAlign: 'center',
    marginTop: 5,
    fontSize: Math.max(14, width * 0.04), // Responsive font size
    flexWrap: 'wrap', // Ensure text wraps properly
  },
  circleContainer: {
    width: 40, // Width of the circle
    height: 40, // Height of the circle
    borderRadius: 20, // Make it circular
    backgroundColor: '#1996D3', // Background color of the circle
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
    marginBottom: 5, // Space below the circle
  },
  circleText: {
    color: '#FFFFFF', // White color for the letter
    fontSize: 18, // Font size for the letter
    fontWeight: 'bold', // Bold weight for the letter
  },
  noResultsText: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    marginTop: 20,
  },
  loader: {
    marginTop: 20,
  },
});

export default ComplaintDropdown;
