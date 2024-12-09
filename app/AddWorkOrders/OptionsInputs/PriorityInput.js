import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

const PrioritySelector = ({ onPrioritySelect }) => { // Accept the onPrioritySelect prop
  const [selectedPriority, setSelectedPriority] = useState(null);

  const handleValueChange = (value) => {
    setSelectedPriority(value); // Update local state
    onPrioritySelect(value); // Call the prop function to send the selected priority to the parent
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Priority</Text>
      <View style={styles.inputContainer}>
        <RNPickerSelect
          onValueChange={handleValueChange} // Update the function to call handleValueChange
          items={[
            { label: 'Normal', value: 'Normal' },
            { label: 'High', value: 'High' },
            { label: 'Emergency', value: 'Emergency' },
          ]}
          placeholder={{
            label: 'Priority',
            value: null,
            color: '#9EA0A4',
          }}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
          Icon={() => (
            <Ionicons name="chevron-down" size={20} color="#074B7C" />
          )}
        />
      </View>
    </View>
  );
};

export default PrioritySelector;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#074B7C',
    marginRight: 10,
  },
  inputContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 8,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
  },
  selectedText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#074B7C',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    color: '#074B7C',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    color: '#074B7C',
    paddingRight: 30,
  },
  iconContainer: {
    top: Platform.OS === 'ios' ? 14 : 10,
    right: 12,
  },
  placeholder: {
    color: '#9EA0A4',
  },
});
