import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import AddWorkOrderScreen from '../AddWorkOrders/AddWorkOrderScreen';
import { usePermissions } from '../GlobalVariables/PermissionsContext';
import PMList from '../PmsUi/AllPms';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BuggyListPage from '../BuggyList/BuggyListScreen';
import AssetDetailsMain from '../AssetDetails/AssetDetailsScreen';
import { useNavigation,CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BuggyListTopTabs = ({  route  }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { ppmAsstPermissions } = usePermissions();
  const uuid = route.params.workOrder;
  const wo = route.params.wo
  const restricted = route.params.restricted
  const [siteLogo,setSiteLogo]  = useState(null)
  
  const previousScreen = route.params.previousScreen
  const hasPermission = ppmAsstPermissions.some((permission) =>
    permission.includes('C')
  );

  const navigation = useNavigation()
  const renderScene = SceneMap({
    BuggyList: () => <BuggyListPage restricted={restricted}  uuid={uuid}  wo={wo}/>,
    Details: () => <AssetDetailsMain uuid={uuid} />,
  });


  useEffect(() => {
    // Define the fetchLogo function inside useEffect
    const fetchLogo = async () => {
      try {
        const societyString = await AsyncStorage.getItem('userInfo');
       
        if (societyString) {
          const societyData = JSON.parse(societyString); // Parse the data
          const parsedImages = JSON.parse(societyData.data.society.data)
          setSiteLogo(parsedImages.logo); // Set the logo URL
        } else {
          console.log('No society data found.');
        }
      } catch (error) {
        console.error('Error fetching society data:', error);
      }
    };

    fetchLogo(); // Call the function to fetch logo
  }, []); // Empty dependency array ensures this runs once when the component mounts



  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabIndicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
    />
  );

  const handleBackPress = () => {
 


    navigation.goBack()
//    console.log(previousScreen,"this is back previous screen")
//    if(previousScreen == 'ScannedWoTag'){
//       navigation.navigate(previousScreen);
//    }else{
//        navigation.dispatch(
//                CommonActions.reset({
//                  index: 0,
//                  routes: [{ name: 'Home' }], 
//                })
//              );
//    }
  };
  

    return (
      <GestureHandlerRootView  style={{ flex: 1 }}>
 <View className="flex bg-[#1996D3] p-2 h-16 items-center justify-start  flex-row gap-3">
     
       {siteLogo &&
 <Image
    className="w-20 h-14 rounded-lg"
    source={{ uri: siteLogo }}
    style={styles.logo}
    resizeMode="contain"
  />}
        <Text className="font-bold text-white  text-center text-lg">Instructions</Text>

    
      </View>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <FontAwesome name="arrow-left" size={25} color="white" />
          </TouchableOpacity>
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
            swipeEnabled={true} // Allow swipe gestures
            animationEnabled={true} // Enable smooth animations
            initialLayout={{ width: 200 }} // Provide an initial layout to optimize rendering
          />
        </View>
      </GestureHandlerRootView>
    );
  
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f4f7',
    height:"100%"
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 10,
    zIndex: 10,
  },
  tabBar: {
    backgroundColor: '#074B7C',
    paddingVertical:5
  },
  tabLabel: {
    color: '#FF0000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabIndicator: {
    height: 5,
    backgroundColor: 'white',
  },
  notAuthorizedText: {
    fontSize: 18,
    color: '#ff0000',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default BuggyListTopTabs;
