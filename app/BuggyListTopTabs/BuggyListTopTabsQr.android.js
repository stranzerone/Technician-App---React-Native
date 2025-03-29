import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { usePermissions } from '../GlobalVariables/PermissionsContext';
import BuggyListPage from '../BuggyList/BuggyListScreen';
import AssetDetailsMain from '../AssetDetails/AssetDetailsScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BuggyListTopTabs = ({ route }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [siteLogo, setSiteLogo] = useState(null);
  const navigation = useNavigation();

  const uuid = route.params.workOrder;
  const type = route.params.type;
  const id = route.params.uuid
  const wo = route.params.wo;
  const restricted = route.params.restricted;
  const restrictedTime = route.params.restrictedTime;


  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const societyString = await AsyncStorage.getItem('userInfo');
        if (societyString) {
          const societyData = JSON.parse(societyString);
          const parsedImages = JSON.parse(societyData.data.society.data);
          setSiteLogo(parsedImages.logo);
        }
      } catch (error) {
        console.error('Error fetching society data:', error);
      }
    };
    fetchLogo();
  }, []);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'BuggyList':
        return <BuggyListPage sequence={wo['Sequence No']?.split('-')[0]} restricted={restricted} restrictedTime={restrictedTime} uuid={uuid} wo={wo} id={id} type={type} />;
      case 'Details':
        return <AssetDetailsMain uuid={uuid} />;
      default:
        return null;
    }
  };

  const renderTabBar = (props) => (
        <View style={styles.tabBarContainer}>
    
    <TabBar
      {...props}
      indicatorStyle={styles.tabIndicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
    />
    </View>
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Header with Logo */}
      <View style={styles.header}>
        {siteLogo && <Image   className="w-24 h-32"
  source={{ uri: siteLogo }}
  style={[styles.logo, { borderRadius: 48, overflow: 'hidden' }]} 
  resizeMode="contain" />}
        <Text style={styles.headerText}>Instructions</Text>
      </View>

      {/* Main Content */}
      <View style={styles.container}>
       <View style={styles.backButton} >
               <TouchableOpacity className='bg-white rounded-md h-6  py-1 px-3'  onPress={handleBackPress}>
                 <FontAwesome name="arrow-left" size={15} color="black" />
               </TouchableOpacity>
       
               </View>

        <TabView
          navigationState={{
            index: selectedTab,
            routes: [
              { key: 'BuggyList', title: 'Instructions' },
              { key: 'Details', title: 'Asset Details' },
            ],
          }}
          renderScene={renderScene}
          onIndexChange={setSelectedTab}
          renderTabBar={renderTabBar}
          swipeEnabled={true}
          animationEnabled={true}
          initialLayout={{ width: 200 }}
        />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f4f7',
    height: '100%',
  },
  header: {
    backgroundColor: '#1996D3',
    padding: 10,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    maxWidth: 80,
    maxHeight: 80,
    borderRadius: 5,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  backButton: {
    position: 'absolute',
   width:"20%",
   paddingVertical:15,
    left: 0, // Keeps it at the left
    top: 0,  
    backgroundColor: '#074B7C',
    justifyContent: 'center', // Center vertically
    textAlign:"center",
    alignItems: 'center', // Center horizontally
    zIndex: 10, // Ensures it's above other elements
 
  },
  
  tabViewContainer: {
    flex: 1,
    width: '100%', // Ensure TabView takes full width
  },
  tabBarContainer: {
    width: '80%', // Limit width to 70%
    alignSelf: 'flex-end', // Move it to the right end
  },
  tabBar: {
    backgroundColor: '#074B7C',
    paddingVertical: 5,
  },
  tabLabel: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabIndicator: {
    height: 4,
    backgroundColor: 'white',
  },
});

export default BuggyListTopTabs;
