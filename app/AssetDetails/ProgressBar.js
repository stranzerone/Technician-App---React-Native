import React, { useLayoutEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import * as Progress from 'react-native-progress';
import { usePermissions } from '../GlobalVariables/PermissionsContext';
import { MarkAsCompleteApi } from '../../service/BuggyListApis/MarkAsCompleteApi';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { updateWorkOrderStatus } from '../../utils/Slices/WorkOrderSlice';
const ProgressPage = ({ data, wo }) => {
  const [remark, setRemark] = useState('');
  const [count, setCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility
  const { ppmAsstPermissions } = usePermissions();
const navigation = useNavigation()
const dispatch = useDispatch()
  console.log(wo.Status, 'workorder details');
  
  useLayoutEffect(() => {
    let tempCount = 0;

    // Count completed tasks
    data &&
      data.forEach((item) => {
        if (
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
      const response = await MarkAsCompleteApi(wo,remark);
      console.log(response, 'response from API for completion');
      console.log('Marked as complete with remark:', remark);
      
      setRemark(''); // Reset the remark input
      setModalVisible(false); // Close the modal
  
      console.log(wo, 'WO');
  
      if (response) {
        // Dispatch the action to update work order status
        await dispatch(updateWorkOrderStatus({ id: wo.uuid, status: 'COMPLETED' }));
  
        // Once the status update is successful, navigate
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Work Orders' }], // Replace with the correct screen name
          })
        );
      }
    } catch (error) {
      console.error('Error marking as complete:', error);
    }
  };
  
  // Calculate progress percentage
  const progress = data.length > 0 ? count / data.length : 0; // Avoid division by zero
  const progressPercentage = count + '/' + data.length;
  const percentage = (count / data.length) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        {percentage === 100 ? (
          <TouchableOpacity
          className="flex  py-1 flex-row gap-1"
            style={[
              styles.tickContainer,
              wo.Status === 'COMPLETED' && styles.disabledTickContainer, // Apply faint style if completed
            ]}
            onPress={() => wo.Status !== 'COMPLETED' && setModalVisible(true)} // Prevent opening modal if completed
            disabled={wo.Status === 'COMPLETED'} // Disable button if completed
          >

            <View className="bg-green-500 p-1  rounded-full">
            <Icon name="check" size={30} color={wo.Status === 'COMPLETED' ? '#d4d4d4' : 'white'} />
             </View>


             <Text  className="text-white text-xs font-black">{wo.Status === 'COMPLETED'?' Completed':"Mark Complete"}</Text>

          </TouchableOpacity>
        ) : (
          <Progress.Circle
          className="ml-20 bg-[#074B7C] rounded-full mt-4"
            size={55}
            progress={progress}
            color="#00b300"
            unfilledColor="#e0e0e0"
            borderWidth={0}
            thickness={8}
            showsText
            formatText={() => `${progressPercentage}`}
            textStyle={styles.progressText}
            animated
          />
        )}
      </View>

      {/* Bottom Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Close modal on back press
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Remark</Text>
            <TextInput
              style={styles.input}
              placeholder="Add your remark"
              value={remark}
              onChangeText={setRemark}
            />
            <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
              <Text style={styles.completeButtonText}>Mark as Complete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:50,
  },
  tickContainer: {
    width: 160,
    height: 50,
    backgroundColor: '#074B7C',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'start',
  },
  disabledTickContainer: {
    backgroundColor: 'lightgreen', // Faint green for completed
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    height:200,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  completeButton: {
    backgroundColor: '#00b300',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  completeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProgressPage;
