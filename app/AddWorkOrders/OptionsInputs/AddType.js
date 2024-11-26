import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

const TypeSelector = ({ onTypeSelect }) => { // Accept the onTypeSelect prop
  const [selectedType, setSelectedType] = useState(null);

  const handleValueChange = (value) => {
    setSelectedType(value); // Update local state
    onTypeSelect(value); // Call the prop function to send the selected type to the parent
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Type</Text>
      <View style={styles.inputContainer}>
        <RNPickerSelect
          onValueChange={handleValueChange} // Update the function to call handleValueChange
          items={[
            { label: 'Planned', value: 'Planned' },
            { label: 'Unplanned', value: 'Unplanned' },
          ]}
          placeholder={{
            label: 'Type',
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

export default TypeSelector;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,

    flexDirection: 'row', // Set direction to row
    alignItems: 'center', // Center items vertically
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#074B7C',
    marginRight: 10, // Add space between label and input
  },
  inputContainer: {
    flex: 1, // Take remaining space
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
    paddingRight: 30, // for icon space
  },
  inputAndroid: {
    fontSize: 16,
    color: '#074B7C',
    paddingRight: 30, // for icon space
  },
  iconContainer: {
    top: Platform.OS === 'ios' ? 14 : 10,
    right: 12,
  },
  placeholder: {
    color: '#9EA0A4',
  },
});
