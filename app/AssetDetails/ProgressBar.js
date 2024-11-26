import React, { useLayoutEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { usePermissions } from '../GlobalVariables/PermissionsContext';
import { MarkAsCompleteApi } from '../../service/BuggyListApis/MarkAsCompleteApi';

const ProgressPage = ({ data, wo }) => {
  const [remark, setRemark] = useState('');
  const [count, setCount] = useState(0);
  const { ppmAsstPermissions } = usePermissions();

  useLayoutEffect(() => {
    let tempCount = 0;

    // Count completed tasks
     data && data.forEach((item) => {
      if (
        item.file ||
        item.image ||
        item.remarks ||
        (item.type !== 'checkbox' && item.result && item.result.trim() !== '') ||
        (item.type === 'checkbox' && item.result !== '0' && item.result !== '')
      ) {
        tempCount += 1;
      }
    });

    setCount(tempCount);
  }, [data]);

  const handleComplete = async () => {
    try {
      const response = await MarkAsCompleteApi(wo);
      console.log(response, 'response from API for completion');
      console.log('Marked as complete with remark:', remark);
      setRemark(''); // Reset the remark input
    } catch (error) {
      console.error('Error marking as complete:', error);
    }
  };

  // Calculate progress percentage
  const progress = data.length > 0 ? count / data.length : 0; // Avoid division by zero
  const progressPercentage = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Progress.Circle
          size={50}
          progress={progress}
          color="#28a745"
          unfilledColor="#e0e0e0"
          borderWidth={0}
          thickness={7}
          showsText
          formatText={() => `${progressPercentage}`}
          textStyle={styles.progressText}
          animated
        />
      </View>

      <View style={styles.detailsContainer}>
        {ppmAsstPermissions.some((permission) => permission.includes('U')) && progressPercentage === 100 ? (
          <View style={styles.completeContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter remark"
              value={remark}
              onChangeText={setRemark}
              placeholderTextColor="#888"
            />
            <TouchableOpacity
              style={[
                styles.button,
                wo.Status === 'COMPLETED' && styles.disabledButton, // Apply disabled style if status is COMPLETED
              ]}
              disabled={wo.Status === 'COMPLETED'}
              onPress={handleComplete}
            >
              <Text style={styles.buttonText}>
                {wo.Status === 'COMPLETED' ? 'Completed' : 'Mark Complete'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.incompleteText}>
            Remaining tasks: {data.length - count} out of {data.length}
          </Text>
        )}
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  detailsContainer: {
    flex: 1,
  },
  completeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    borderWidth: 1,
    borderColor: '#1996D3',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#f7f7f7',
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#1996D3', // Default color
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: 'red', // Gray out the button when disabled
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  incompleteText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
});

export default ProgressPage;
