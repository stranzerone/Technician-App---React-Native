import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { WorkOrderInfoApi } from "../../service/WorkOrderInfoApi";
import ProgressPage from './ProgressBar';

const AssetInfo = ({ WoUuId }) => {
  const [workOrder, setWorkOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [percentage, setPercentage] = useState(0); // Fixed spelling from precentage to percentage

  useEffect(() => {
    const loadWorkOrderData = async () => {
      try {
        const data = await WorkOrderInfoApi(WoUuId);
        setWorkOrder(data);
      } catch (error) {
        console.error('Error fetching work order:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkOrderData();
  }, [WoUuId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1996D3" />
      </View>
    );
  }

  if (!workOrder || workOrder.length === 0) {
    return <Text style={styles.errorText}>No work order data found.</Text>;
  }

  // Extracting necessary data from the work order
  const {
    asset,
    wo,
    category,
    pm,
  } = workOrder[0];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <ProgressPage setPercentages={setPercentage} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>{wo?.["Sequence No"]}</Text>
            <Text style={styles.headerSubText}>{wo?.Name}</Text>
            <View style={styles.buttonContainer}>
              <CustomButton
                icon="check-circle"
                text="Mark Complete"
                onPress={() => console.log("Mark as Complete")}
                disabled={percentage < 100} // Disable if percentage is less than 100
              />
              {/* <CustomButton icon="edit" text="Change Status" onPress={() => console.log("Change Status")} /> */}
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          {/* Work Order Details */}
          <View style={styles.detailsContainer}>
            <DetailItem icon="assignment" label="Asset Name" text={asset?.Name} />
            <DetailItem icon="hashtag" label="Asset ID" text={asset?.["Sequence No"]} />
            <DetailItem icon="calendar" label="Deadline" text={wo?.["Due Date"]} />
            <DetailItem icon="wrench" label="Type" text={wo?.Type} />
            <DetailItem icon="tags" label="Category" text={category?.Name} />
            <DetailItem icon="users" label="Team" text={pm?.AssignedTeam.join(', ')} isTag />
            <DetailItem icon="user" label="Assigned" text={wo?.Assigned.join(', ')} isTag />
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Work Order Description</Text>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>
              {wo?.Description || 'No description available for this work order.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// CustomButton component definition remains unchanged
const CustomButton = ({ icon, text, onPress, disabled }) => (
  <TouchableOpacity
    style={[styles.button, disabled && styles.disabledButton]} // Apply faint green when disabled
    onPress={!disabled ? onPress : null} // Prevent onPress when disabled
    disabled={disabled} // Disable the button to prevent touch events
  >
    <FontAwesome name={icon} size={16} color={disabled ? "#A9A9A9" : "#fff"} style={styles.buttonIcon} />
    <Text style={[styles.buttonText, disabled && styles.disabledText]}>{text}</Text>
  </TouchableOpacity>
);

const DetailItem = ({ icon, label, text, isTag }) => (
  <View style={styles.detailItem}>
    <View style={styles.iconContainer}>
      {icon === "assignment" ? (
        <MaterialIcons name={icon} size={24} color="#074B7C" />
      ) : (
        <FontAwesome name={icon} size={24} color="#074B7C" />
      )}
    </View>
    <View style={styles.detailTextContainer}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={[styles.detailText, isTag && styles.tagText]}>{text || 'N/A'}</Text>
    </View>
  </View>
);



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollViewContent: {
    padding: 16,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 16,
  },
  progressContainer: {
    width: '40%',
    justifyContent: 'center',
  },
  textContainer: {
    width: '60%',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#074B7C',
  },
  headerSubText: {
    fontSize: 16,
    color: '#1996D3',
  },
  buttonContainer: {
    flexDirection: 'column',
    marginTop: 8,
  },
  button: {
    width:120,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:  '#28a745',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 5,
   
  },
  disabledButton: {
    backgroundColor: '#d1f7e7', // Faint green background for disabled state
  },
  disabledText: {
    color: '#A9A9A9', // Gray text for disabled state
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
    color: '#FF0000',
    fontSize: 16,
    marginTop: 20,
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 16,
    padding: 16,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e7f1ff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    marginRight: 10,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#074B7C',
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  tagText: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    color: '#074B7C',
    marginLeft: 8,
    fontWeight: 'normal',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#074B7C',
    marginBottom: 8,
  },
  descriptionBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
});

export default AssetInfo;
