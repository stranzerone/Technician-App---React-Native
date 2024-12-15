
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import AddWorkOrderScreen from '../AddWorkOrders/AddWorkOrderScreen';
import { usePermissions } from '../GlobalVariables/PermissionsContext';
import PMList from '../PmsUi/AllPms';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BuggyListPage from '../BuggyList/BuggyListScreen';
import AssetDetailsMain from '../AssetDetails/AssetDetailsScreen';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
const TabNavigationPage = ({route}) => {
  const [selectedTab, setSelectedTab] = useState(0); 
  const { ppmAsstPermissions } = usePermissions();
  const uuid = route.params.workOrder;
  const wo = route.params.wo
  const hasPermission = ppmAsstPermissions.some((permission) =>
    permission.includes('C')
  );

  const navigation = useNavigation()
  const handleBackPress = () => {
    navigation.goBack(); 
  };

  console.log(uuid,wo,hasPermission,"this is ios data")
  const renderContent = () => {
    if (selectedTab === 0) {
      return  <BuggyListPage   uuid={uuid}  wo={wo}/>; 
    } else if (selectedTab === 1) {
      return   <AssetDetailsMain uuid={uuid} /> ; 
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View  style={styles.tabBarContainer}>
      <View className="w-[15%] p-2">
      <TouchableOpacity onPress={handleBackPress}>
        <Icon name="arrow-left" size={30} color="white" /> 
      </TouchableOpacity>
    </View>
        <TouchableOpacity
        className='w-[85%]' 
          style={[styles.tab, selectedTab === 0 && styles.activeTab]}
          onPress={() => setSelectedTab(0)}
        >
          <Text style={[styles.tabText, selectedTab === 0 && styles.activeTabText]}>
            Buggy List
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 1 && styles.activeTab]}
          onPress={() => setSelectedTab(1)}
        >
          <Text style={[styles.tabText, selectedTab === 1 && styles.activeTabText]}>
            Asset Details
          </Text>
        </TouchableOpacity>
      </View>

      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#074B7C', // Your theme color (Dark)
    paddingVertical: 10,
    paddingBottom:0,
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical:10,
  },
  activeTab: {
    borderBottomWidth: 8,
    borderBottomColor: 'white',
  },
  tabText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#1996D3', // Your theme color (Light) for active tab text
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentText: {
    fontSize: 18,
    color: '#333',
  },
});

export default TabNavigationPage;
