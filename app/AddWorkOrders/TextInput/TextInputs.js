import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library

const TaskInput = ({onChangeName,onChangeDueDate,onChangeEstimatedTime}) => {
  const [name, setName] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDueDate, setSelectedDueDate] = useState(new Date());

  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'set' && selectedDate) {
      setSelectedDueDate(selectedDate); // Update selectedDueDate state
      onChangeDueDate(selectedDate)
    }
    setShowDatePicker(false); // Hide the date picker
  };

  // Function to format and validate estimated time input
  const handleEstimatedTimeChange = (value) => {
    // Allow only numbers and hyphen
    const formattedValue = value.replace(/[^0-9-]/g, '');
    
    // Split the input by hyphen
    const parts = formattedValue.split('-');

    // Validate the input format (HH-MM)
    if (parts.length <= 2) {
      setEstimatedTime(formattedValue); // Update estimated time state
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter task name"
            value={name}
            onChangeText={setName} // Update local state
            onBlur={()=>onChangeName(name)}
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.label}>Due Date</Text>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>
                {selectedDueDate.toISOString().split('T')[0]} {/* Display formatted date */}
              </Text>
              <Text>
                <Icon name="calendar-today" size={24} color="#1996D3" /> {/* Calendar icon */}
              </Text>
            </View>
          </TouchableOpacity>
          {/* Render DateTimePicker only if showDatePicker is true */}
          {showDatePicker && (
            <DateTimePicker
              value={selectedDueDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()} // Set minimum date to today
            />
          )}

          <Text style={styles.label}>Estimated Time (HH-MM)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter estimated time (HH-MM)"
            value={estimatedTime}
            onChangeText={handleEstimatedTimeChange} // Update local state
            keyboardType="default" // Allow text input
            onBlur={()=>onChangeEstimatedTime(estimatedTime)}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight:"bold",
    color: '#074B7C',
  },
  input: {
    height: 40,
    borderColor: '#1996D3',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#1996D3',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: '#FFFFFF',
    marginBottom: 15,
  },
  dateText: {
    color: '#074B7C',
  },
});

export default TaskInput;
