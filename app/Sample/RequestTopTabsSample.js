import  { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AddWorkOrderScreen from '../AddWorkOrders/AddWorkOrderScreen';
import ComplaintDropdown from '../RaiseComplaint/ComplaintDropdown';
import { usePermissions } from '../GlobalVariables/PermissionsContext';
import PMList from '../PmsUi/AllPms';

const RequestServiceTabs = () => {
  const [selectedTab, setSelectedTab] = useState('WorkOrder'); // Default tab is WorkOrder

  const { ppmAsstPermissions } = usePermissions();

  // Function to render the appropriate page based on selected tab
  const renderPage = () => {
    switch (selectedTab) {
      case 'WorkOrder':
        return <AddWorkOrderScreen />;
      case 'PPM':
        return <PMList />;
      case 'Complaint':
        return <ComplaintDropdown />;
      default:
        return null;
    }
  };

  // Check if the user has the required permissions for rendering the tabs
  const hasPermission = ppmAsstPermissions.some((permission) =>
    permission.includes('C')
  );

  if (hasPermission) {
    return (
      <View style={styles.container}>
        {/* Buttons for selecting the page */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'WorkOrder' && styles.activeTab,
            ]}
            onPress={() => setSelectedTab('WorkOrder')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'WorkOrder' && styles.activeTabText,
              ]}
            >
              Work Order
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 'PPM' && styles.activeTab]}
            onPress={() => setSelectedTab('PPM')}
          >
            <Text
              style={[styles.tabText, selectedTab === 'PPM' && styles.activeTabText]}
            >
              PPM
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'Complaint' && styles.activeTab,
            ]}
            onPress={() => setSelectedTab('Complaint')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'Complaint' && styles.activeTabText,
              ]}
            >
              Complaint
            </Text>
          </TouchableOpacity> */}
        </View>

        {/* Render the selected page */}
        <View style={styles.pageContainer}>{renderPage()}</View>
      </View>
    );
  } else {
    // If the user doesn't have permission, show "Not Authorized"
    return (
      <View style={styles.container}>
        <Text style={styles.notAuthorizedText}>You are not authorized to view this content.</Text>
      </View>
    );
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth:1,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabButton: {
    paddingVertical: 0,
    paddingHorizontal: 20,
    alignItems: 'center',
  
  },
  activeTab: {
    borderBottomWidth: 3, // Bottom border for the active tab
    borderBottomColor: '#074B7C', // Accent color for the active tab
  },
  tabText: {
    color: '#074B7C', // Dark color for inactive tab text
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#074B7C', // Darker text for active tab
    fontWeight: 'bold', // Emphasize the active tab text
  },
  pageContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageContent: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  notAuthorizedText: {
    fontSize: 18,
    color: '#ff0000',
    textAlign: 'center',
    marginTop: 20,
  },
});


export default RequestServiceTabs;
