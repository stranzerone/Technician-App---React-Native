import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Feather'; // Feather icons

const AddWorkOrderForm = () => {
  const [selectedType, setSelectedType] = useState('manual'); // default option
  const [manualFields, setManualFields] = useState({
    name: '',
    workOrderType: 'planned', // Default work order type
    asset: '',
    dueDate: '',
    priority: 'normal',
    estimatedTime: '',
    assignedTo: '',
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Select WO Type:</Text>
          <Picker
            selectedValue={selectedType}
            onValueChange={(itemValue) => setSelectedType(itemValue)}
            style={styles.picker}>
            <Picker.Item label="PMs" value="pm" />
            <Picker.Item label="Manual" value="manual" />
          </Picker>
        </View>

        {selectedType === 'manual' && (
          <>
            {[ 
              { placeholder: 'Enter Work Order Name', value: manualFields.name, key: 'name', icon: 'file-text' },
              { placeholder: 'Enter Asset Name', value: manualFields.asset, key: 'asset', icon: 'tool' },
              { placeholder: 'Enter Due Date', value: manualFields.dueDate, key: 'dueDate', icon: 'calendar' },
              { placeholder: 'Enter Estimated Time', value: manualFields.estimatedTime, key: 'estimatedTime', icon: 'clock' },
              { placeholder: 'Enter Assigned Person', value: manualFields.assignedTo, key: 'assignedTo', icon: 'user' },
            ].map(({ placeholder, value, key, icon }) => (
              <View key={key} style={styles.formGroupWithIcon}>
                <Icon name={icon} size={20} color="#1996D3" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder={placeholder}
                  value={value}
                  onChangeText={(text) => setManualFields({ ...manualFields, [key]: text })}
                />
              </View>
            ))}

            {/* Work Order Type Selection */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Work Order Type:</Text>
              <Picker
                selectedValue={manualFields.workOrderType}
                onValueChange={(itemValue) => setManualFields({ ...manualFields, workOrderType: itemValue })}
                style={styles.picker}>
                <Picker.Item label="Planned" value="planned" />
                <Picker.Item label="Unplanned" value="unplanned" />
              </Picker>
            </View>

            {/* Priority Selection */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Priority:</Text>
              <Picker
                selectedValue={manualFields.priority}
                onValueChange={(itemValue) => setManualFields({ ...manualFields, priority: itemValue })}
                style={styles.picker}>
                <Picker.Item label="Emergency" value="emergency" />
                <Picker.Item label="Normal" value="normal" />
                <Picker.Item label="High" value="high" />
              </Picker>
            </View>
          </>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // Handle the submission of the form
            console.log('Submitted:', selectedType === 'manual' ? manualFields : 'PM selected');
          }}>
          <Text style={styles.buttonText}>Add Work Order</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingVertical: 20,
    background: 'rgb(2,0,36)',
    background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(0,212,255,0.0967558906191871) 0%)',
  },
  scrollView: {
    padding: 20,
    flexGrow: 1,
  },
  formGroup: {
    marginBottom: 20,
  },
  formGroupWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#B0BEC5', // Light gray border color
    paddingBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold', // Made labels bold
    color: '#074B7C', // Dark color for labels
    marginBottom: 5,
    flex: 1,
  },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#1996D3', // Changed border color of inputs
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF', // White background for inputs
  },
  picker: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#1996D3', // Changed border color of picker
    borderRadius: 5,
    backgroundColor: '#FFFFFF', // White background for picker
  },
  icon: {
    marginRight: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#074B7C', // Button background color
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF', // White text color for button
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddWorkOrderForm;
