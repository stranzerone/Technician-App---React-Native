import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const TaskInput = ({ onChangeName, onChangeDueDate, onChangeEstimatedTime }) => {
  const [name, setName] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDueDate, setSelectedDueDate] = useState(new Date());

  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'set' && selectedDate) {
      setSelectedDueDate(selectedDate);
      onChangeDueDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  const handleEstimatedTimeChange = (value) => {
    let formattedValue = value.replace(/[^0-9]/g, '');

    if (formattedValue.length > 2) {
      formattedValue = `${formattedValue.slice(0, 2)}-${formattedValue.slice(2, 4)}`;
    }

    setEstimatedTime(formattedValue);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Name</Text>
            <TextInput
      style={[styles.input, styles.inputRow, { height: 50, width: 160 }]}
      placeholder="Enter task name"
      value={name}
      onChangeText={setName}
      onBlur={() => onChangeName(name)}
      returnKeyType="done"  // Helps to close the keyboard
    />
          </View>

          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <View style={styles.row}>
              <Text style={styles.label}>Due Date</Text>
              
              <View
      style={[styles.dateContainer, styles.inputRow, { height: 50, width: 160 }]}
      >
                <Text style={styles.dateText}>
                  {selectedDueDate.toISOString().split('T')[0]}
                </Text>


                <FontAwesome name="calendar" size={18} color="#1996D3" />
              </View>
            </View>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDueDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          <View className="" style={styles.row}>
            <Text style={styles.label}>Est Time</Text>
            <TextInput
              style={[styles.input, styles.inputRow, { height: 40, width: 160 }]}
              placeholder="HH-MM"
              value={estimatedTime}
              onChangeText={handleEstimatedTimeChange}
              keyboardType="numeric"
              onBlur={() => onChangeEstimatedTime(estimatedTime)}
            />
            
          </View>
          
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    padding: 0,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    width: '40%',
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#074B7C',
  },
  input: {
    borderColor: '#1996D3',
    borderWidth: 1,
    width: '60%',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  inputRow: {
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  justifyContent: 'space-between',
    borderColor: '#1996D3',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 40,
    backgroundColor: '#FFFFFF',
  },
  dateText: {
    color: '#074B7C',
  },
});

export default TaskInput;
