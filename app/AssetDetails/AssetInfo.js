import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import {WorkOrderInfoApi} from "../../service/WorkOrderInfoApi"

const AssetInfo = ({ WoUuId }) => {
  const [workOrder, setWorkOrder] = useState(null);
  const [loading, setLoading] = useState(true);

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
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1996D3" />
      </View>
    );
  }

  if (!workOrder) {
    return <Text>No work order data found.</Text>;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={{ ...styles.headerText, fontSize: 16 }}>{workOrder[0]?.wo?.["Sequence No"]}</Text>
          <Text style={styles.headerText}>{workOrder[0]?.wo?.Name}</Text>
        </View>

        <View style={styles.infoContainer}>
          {/* Work Order Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <DetailItem icon="assignment" text={workOrder[0]?.asset?.Name} />
              <DetailItem icon="tag" text={workOrder[0]?.asset?.["Sequence No"]} />
            </View>
            <View style={styles.detailRow}>
              <DetailItem icon="wrench" text={workOrder[0]?.wo?.Type} />
              <DetailItem icon="tag" text={workOrder[0]?.category?.Name} />
            </View>
            <View style={styles.detailRow}>
              <DetailItem icon="users" text={`Team: ${workOrder[0]?.pm?.AssignedTeam.join(', ')}`} />
              <DetailItem icon="user" text={`Assigned: ${workOrder[0]?.wo?.Assigned.join(', ')}`} />
            </View>
          </View>
        </View>

        {/* Beautified Description Section */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Work Order Description</Text>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>
              {workOrder[0]?.wo?.Description || 'No description available for this work order.'}
            </Text>
          </View>
        </View>

        {/* Parts Info */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const DetailItem = ({ icon, text }) => (
  <View style={styles.detailItem}>
    {icon === "assignment" && <MaterialIcons name={icon} size={20} color="#074B7C" />}
    {icon !== "assignment" && <FontAwesome name={icon} size={20} color="#074B7C" />}
    <Text style={styles.detailText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollViewContent: {
    padding: 16,
    flexGrow: 1, // Allow the content to take up the entire height
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#074B7C',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
    backgroundColor: '#e7f1ff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginTop: 4,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#074B7C',
    marginBottom: 8,
  },
  descriptionBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
});

export default AssetInfo;
