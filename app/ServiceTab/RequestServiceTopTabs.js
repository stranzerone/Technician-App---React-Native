import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import AddWorkOrderScreen from '../AddWorkOrders/AddWorkOrderScreen';
import { usePermissions } from '../GlobalVariables/PermissionsContext';
import PMList from '../PmsUi/AllPms';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const RequestServiceTabs = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { ppmAsstPermissions } = usePermissions();
  const hasPermission = ppmAsstPermissions.some((permission) =>
    permission.includes('C')
  );

  const renderScene = SceneMap({
    WorkOrder: () => <AddWorkOrderScreen />,
    PPM: () => <PMList />,
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
    navigation.goBack();
  };

  if (hasPermission) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <FontAwesome name="arrow-left" size={30} color="white" />
          </TouchableOpacity>
          <TabView
            navigationState={{
              index: selectedTab,
              routes: [
                { key: 'WorkOrder', title: 'Work Order' },
                { key: 'PPM', title: 'PPM' },
              ],
            }}
            renderScene={renderScene}
            onIndexChange={setSelectedTab}
            renderTabBar={renderTabBar}
            swipeEnabled={true} // Allow swipe gestures
            animationEnabled={true} // Enable smooth animations
            initialLayout={{ width: 400 }} // Provide an initial layout to optimize rendering
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
    top: 10,
    left: 10,
    zIndex: 10,
  },
  tabBar: {
    backgroundColor: '#074B7C',
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

export default RequestServiceTabs;
