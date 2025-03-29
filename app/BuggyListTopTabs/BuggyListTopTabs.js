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

const BuggyListTopTabs = ({  route  }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { ppmAsstPermissions } = usePermissions();
  const uuid = route.params.workOrder;
  const wo = route.params.wo

  console.log(siteUuid,'this is uuid on btoptabs')
  const hasPermission = ppmAsstPermissions.some((permission) =>
    permission.includes('C')
  );

  const navigation = useNavigation()
  const renderScene = SceneMap({
    BuggyList: () => <BuggyListPage siteUuid={siteUuid}  uuid={uuid}  wo={wo}/>,
    Details: () => <AssetDetailsMain uuid={uuid} />,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabIndicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
    />
  );

  const handleBackPress = () => {
    navigation.navigate('ScannedWoTag');
  };

  if (hasPermission) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
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
  } else {
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
    position: 'relative',
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
