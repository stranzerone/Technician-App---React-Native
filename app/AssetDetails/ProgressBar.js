import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import * as Progress from 'react-native-progress';
import { usePermissions } from '../GlobalVariables/PermissionsContext';
import { MarkAsCompleteApi } from '../../service/BuggyListApis/MarkAsCompleteApi';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { updateWorkOrderStatus } from '../../utils/Slices/WorkOrderSlice';
import { GetWorkOrderInfo } from '../../service/WorkOrderApis/GetWorkOrderInfo';
import { GetSiteUuid } from '../../service/GetSiteInfo';

const ProgressPage = ({ data, wo,canComplete }) => {
  const [remark, setRemark] = useState('');
  const [lock,setLock] = useState(false)
  const [count, setCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [canMarkComplete, setCanMarkComplete] = useState(false); // New state to track the button visibility condition
  const { ppmAsstPermissions } = usePermissions();
  const navigation = useNavigation();




  const mandatoryItems = data?.filter((item) => item?.data?.optional === false || item?.data == null);
  useLayoutEffect(() => {
    let tempCount = 0;
    let manCount =0;

    mandatoryItems &&
      mandatoryItems.forEach((item) => {
        if (
          item.remarks ||
          (item.type !== 'checkbox' && item.result && item.result.trim() !== '') ||
          (item.type === 'checkbox' && item.result !== '0' && item.result !== '' && item.result !== null && item.result !== undefined)
        ) {
          manCount += 1;
        }

        
      });


if(mandatoryItems.length === manCount){
    setCanMarkComplete(true); // Update the state based on the condition
   canComplete(true)
}else{
  setCanMarkComplete(false)
  canComplete(false)
}
    // Count completed tasks and check if all items have optional === false
    data &&
      data.forEach((item) => {
        if (
          item.remarks ||
          (item.type !== 'checkbox' && item.result && item.result.trim() !== '') ||
          (item.type === 'checkbox' && item.result !== '0' && item.result !== '' && item.result !== null && item.result !== undefined)
        ) {
          tempCount += 1;
        }

       
      });

    setCount(tempCount);
  }, [data]);


  
  const handleComplete = async () => {


if(!remark){
  alert('Please Enter Remark To Mark As Complete')
}else{

    try {
      setLock(true)
      const response =  await MarkAsCompleteApi(wo, remark);
      setRemark(''); // Reset the remark input
      setModalVisible(false); // Close the modal


      if (response) {
        // Once the status update is successful, navigate
    
          navigation.goBack(); // Fallback if no screen is passed
        
        
      }
    } catch (error) {
      console.error('Error marking as complete:', error);
    }

  }
  };


  // Calculate progress percentage
  const progress = data.length > 0 ? count / data.length : 0; // Avoid division by zero
  const progressPercentage = count + '/' + data.length;
  const percentage = (count / data.length) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View className="flex   flex-row gap-0 items-center justify-normal fixed">
          {
            wo.Status !== 'COMPLETED' &&
            canMarkComplete ?(
            <TouchableOpacity
              className="flex bg-green-500 py-1 flex-row gap-1"
              style={[
                styles.tickContainer,
                wo.Status === 'COMPLETED' && styles.disabledTickContainer, // Apply faint style if completed
              ]}
              onPress={() => wo.Status !== 'COMPLETED' && setModalVisible(true)} // Prevent opening modal if completed
              disabled={wo.Status === 'COMPLETED'} // Disable button if completed
            >
              <Text className="text-white text-xs font-black">{wo.Status === 'COMPLETED' ? 'Completed' : 'Mark Complete'}</Text>
            </TouchableOpacity>
            ):(
               wo.Status == 'COMPLETED'?(
                <TouchableOpacity
                className="flex bg-green-500 py-1 flex-row gap-1"
                style={[
                  styles.tickContainer,
                  wo.Status === 'COMPLETED' && styles.disabledTickContainer, // Apply faint style if completed
                ]}
                onPress={() => wo.Status !== 'COMPLETED' && setModalVisible(true)} // Prevent opening modal if completed
                disabled={true} // Disable button if completed
              >
                <Text className="text-white text-xs font-black">COMPLETED</Text>
              </TouchableOpacity>

               ):null
            )
          }
          <Progress.Circle
            className="rounded-full ml-24"
            style={{  backgroundColor: '#074B7C', marginTop: 4 }}
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
        </View>
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
              placeholder="Add your remark  250 char"
              value={remark}
              onChangeText={setRemark}
              maxLength={250}
            />
            <TouchableOpacity
           
              style={styles.completeButton}
              onPress={handleComplete}
            >
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

// Styles (unchanged)
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 300,
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
    borderRadius: 50,
  },
  tickContainer: {
    width: 120,
    height: 40,
    marginLeft: 30,
    marginTop: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  disabledTickContainer: {
    backgroundColor: '#A5D6A7',
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    height: 200,
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
