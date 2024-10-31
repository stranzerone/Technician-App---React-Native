import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Text } from 'react-native';
import AssetSearch from './AssetSearch/AssetSearch';
import TypeSelector from './OptionsInputs/AddType';
import AssignedUserScreen from './AssignToSearch/AssignToInput';
import TaskInput from './TextInput/TextInputs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { submitWorkOrder } from '../../service/AddWorkOrderApis/CreateWorkOrderApi'; // Import your API function
import PrioritySelector from './OptionsInputs/PriorityInput';
const AddWorkOrderScreen = () => {
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedUser, setSelectedUser] = useState([]);
 const [typeSelected,setTypeSelected] = useState(null)
 const [priority,setPriority] = useState(null)
  const handleSubmit = async () => {
    // Validate inputs before sending to the API
    if (!name || !dueDate || !estimatedTime || !selectedAsset || !selectedUser) {
      Alert.alert("Error", "Please fill in all fields before submitting.");
      return;
    }

    const workOrderData = {
      name,
      dueDate,
      priority,
      estimatedTime,
      asset: selectedAsset,
      user: selectedUser,
      type:typeSelected
    };

    try {
      console.log(selectedUser)
      const response = await submitWorkOrder(workOrderData);
      Alert.alert("Success", "Work order submitted successfully!");
      resetForm();
    } catch (error) {
      Alert.alert("Error", "Failed to submit work order. Please try again.");
      console.error(error);
    }
  };

  const resetForm = () => {
    setName('');
    setDueDate('');
    setEstimatedTime('');
    setSelectedAsset(null);
    setSelectedUser(null);
  };

  const OnSelectAsset = (assetName) => {
    console.log(assetName,"testing")
    setSelectedAsset(assetName);
  };

  const onSelectStaff = (staffNames) => {
    const userIds = staffNames.map(staff => staff.user_id); // Extract user_id from each staff object
    console.log(userIds, "staff user IDs");
    setSelectedUser(userIds); // Store the array of user IDs in selectedUser state
  };
  

  const onTypeSelect = (type) => {
    setTypeSelected(type)
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.listContainer}>
          <View style={styles.formSection}>
            <AssetSearch onSelectAsset={OnSelectAsset} />
          </View>
          <View style={styles.formSection}>
            <AssignedUserScreen onSelectStaff={onSelectStaff} />
          </View>
        </View>

        <View style={styles.formSection}>
          <TypeSelector onTypeSelect={onTypeSelect} />
        </View>
        <View style={styles.formSection}>
          <PrioritySelector onPrioritySelect={(value)=>{
            setPriority(value)}} />
        </View>
        <View style={styles.formSection}>
          <TaskInput
            onChangeName={setName}
            onChangeDueDate={setDueDate}
            onChangeEstimatedTime={setEstimatedTime}
          />
        </View>

        {/* Customized Submit Button */}
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Work Order</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingBottom: 30,
    backgroundColor: '#F0F4F8',
  },

  scrollContainer: {
    paddingBottom: 40,
  },
  buttonContainer:{
width:"100%",
alignItems:'center'
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  
  },
  button: {
    backgroundColor: '#074B7C', // Light color
    paddingVertical: 12,
    paddingHorizontal: 20,
    width:"70%",
    borderRadius: 5,
    alignItems: 'center',
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginVertical: 20, // Add some vertical spacing
  },
  buttonText: {
    color: '#FFFFFF', // Text color
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddWorkOrderScreen;
