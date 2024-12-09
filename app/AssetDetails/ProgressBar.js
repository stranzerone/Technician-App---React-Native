import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetInstructionsApi } from '../../service/BuggyListApis/GetInstructionsApi';
import { useFocusEffect } from '@react-navigation/native';

const ProgressPage = ({setPercentages}) => {
  const [percentage, setPercentage] = useState(0);
  const [complete, setComplete] = useState(0); // Renamed variable for clarity

  const getPercentage = async () => {
    try {
      console.log("Fetching instructions...");
      // Retrieve the UUID from local storage
      const uuid = await AsyncStorage.getItem('uuid'); // Replace 'uuid' with your actual key if different

      // Fetch instructions with UUID if available
      const items = uuid ? await GetInstructionsApi(uuid) : []; // Pass UUID to the API

      // Assuming items is an array of instruction objects
      const total = items.length;
      let completedCount = 0; // Use a local variable to count completed items
//  {"created_at": "2024-10-27 02:50:56", "created_by": "286420", "data": {"optional": true}, "file": null, "group": "Daily Morning Routine", "id": 133841894, "image": null, "options": null, "order": 7, "ref_type": "WO", "ref_uuid": "4573550f-ca12-459e-8f66-e932dcdfe939", "remarks": null, "result": "", "site_id": 2, "title": "Write down one goal for today:", "type": "text", "updated_at": null, "updated_by": "286420"} item
      items.forEach(item => {
        // Check if the item is complete based on the provided logic
        if ((item.result !== null && item.remarks.trim() !== "") ||item.image !== null || item.file !== null || (item.remarks !== null && item.remarks.trim() !== "")) {
          completedCount++; // Increment the local counter
          console.log(item,"this is the item","image:",item.image,"file:",item.file,"remarks:",item.remarks);
        }
      });

      const calculatedPercentage = total > 0 ? (completedCount / total) * 100 : 0;

      console.log(total, "total", completedCount, "completed"); // Log completed count
      setComplete(completedCount); // Update state with the completed count
      setPercentage(calculatedPercentage); // Update percentage
      setPercentages(calculatedPercentage)
    } catch (error) {
      console.error("Error fetching instructions:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getPercentage(); // Fetch percentage when the screen is focused

      // Optionally return a cleanup function if needed
      return () => {
        // Perform any cleanup if necessary when the screen is unfocused
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Progress.Circle
          size={70}
          progress={percentage / 100}
          color="#28a745"            // Green color for progress
          unfilledColor="white"      // Light gray background color
          borderWidth={0}            // No border
          thickness={10}             // Thickness of the progress ring
          showsText
          formatText={() => `${Math.round(percentage)}%`} // Display the percentage in the center
          textStyle={styles.progressText}     // Style for the center text
          animated={true}            // Enable animation
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'start',
    alignItems: 'start',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  progressContainer: {
    alignItems: 'start',
  },
  progressText: {
    fontSize: 20,
    color: '#074B7C',
    fontWeight: 'bold',
  },
});

export default ProgressPage;
