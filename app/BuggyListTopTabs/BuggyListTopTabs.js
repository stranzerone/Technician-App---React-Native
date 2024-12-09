import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import BuggyListPage from '../BuggyList/BuggyListScreen';
import AssetDetailsMain from '../AssetDetails/AssetDetailsScreen';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const WorkOrderTopTabs = ({ route }) => {
  const navigation = useNavigation(); // Initialize navigation
  const [activeTab, setActiveTab] = useState('instructions');
  const uuid = route.params.workOrder;

  console.log(uuid, "uuid at top tabs");

  // Function to render content based on the active tab
  const renderContent = () => {
    if (activeTab === 'instructions') {
      return <BuggyListPage uuid={uuid} />;
    } else if (activeTab === 'details') {
      return <AssetDetailsMain uuid={uuid} />;
    }
  };

  return (
    <View style={styles.container}>
    

      {/* Tab Section */}
      <View style={styles.tabContainer}>
          {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#074B7C" />
      </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'instructions' && styles.activeTab]}
          onPress={() => setActiveTab('instructions')}
        >
          <Text style={[styles.tabText, activeTab === 'instructions' && styles.activeTabText]}>Instructions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'details' && styles.activeTab]}
          onPress={() => setActiveTab('details')}
        >
          <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>Details</Text>
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      {renderContent()}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  backButton: {
    padding: 10,
    alignItems: 'flex-start',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 4,
    borderBottomColor: '#074B7C',
  },
  tabText: {
    fontSize: 16,
    color: '#888888',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#074B7C', // Color of the active tab text
    fontWeight: 'bold',
  },
  contentContainer: {
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#074B7C',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
});

export default WorkOrderTopTabs;
