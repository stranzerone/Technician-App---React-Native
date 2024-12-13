import React, { useState, useEffect } from 'react';
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
import { useSelector } from 'react-redux';
import { WorkOrderInfoApi } from '../../service/WorkOrderInfoApi';

const AssetInfo = ({ WoUuId }) => {
  const [workOrder, setWorkOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teamInfo, setTeamInfo] = useState(null);

  // Fetch user and team data from Redux
  const users = useSelector((state) => state.users.data);
  const teams = useSelector((state) => state.teams.data);

  // Fetch work order data
  useEffect(() => {
    const loadWorkOrderData = async () => {
      try {
        const data = await WorkOrderInfoApi(WoUuId);
        setWorkOrder(data);

        if (data && data[0]?.pm?.AssignedTeam?.length && teams) {
          const teamId = data[0].pm.AssignedTeam[0];
          teams.forEach(element => {
            if (element.t?._ID == teamId) {
              setTeamInfo(element);
            }
          });
        }
      } catch (error) {
        console.error('Error fetching work order:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkOrderData();
  }, [WoUuId, teams]);

  // Function to convert UTC to system time
  const convertToSystemTime = (utcDate) => {
    const date = new Date(utcDate);
    return date.toLocaleString(); // You can format this as required
  };

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1996D3" />
      </View>
    );
  }

  // Show error message if no data is found
  if (!workOrder || workOrder.length === 0) {
    return <Text style={styles.errorText}>No work order data found.</Text>;
  }

  // Extract work order and asset details
  const { asset, wo, category } = workOrder[0];

  // Map user IDs to user names for assigned users
  const mapIdsToNames = (ids) =>
    ids
      ?.map((id) => users.find((user) => user.user_id === id)?.name || 'Unknown User')
      .join(', ') || 'None';

  const assignedNames = mapIdsToNames(wo?.Assigned);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>{wo?.['Sequence No']}</Text>
            <Text style={styles.headerSubText}>{wo?.Name}</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          {/* Work Order Details */}
          <View style={styles.detailsContainer}>
            <DetailItem icon="assignment" label="Asset Name" text={asset?.Name} />
            <DetailItem icon="hashtag" label="Asset ID" text={asset?.['Sequence No']} />
            <DetailItem icon="calendar" label="Deadline" text={convertToSystemTime(wo?.['Due Date']) || 'No Deadline Provided'} />
            <DetailItem icon="wrench" label="Type" text={wo?.Type} />
            <DetailItem icon="tags" label="Category Of Wo" text={category?.Name} />
            <DetailItem icon="users" label="Assigned Team " text={teamInfo?.t?.Name || 'Unknown Team'} />
            <DetailItem icon="info-circle" label="Team Description" text={teamInfo?.t?.Description || 'No Description'} />
            <DetailItem icon="user" label="Assigned To " text={assignedNames} isTag />
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

const DetailItem = ({ icon, label, text, isTag }) => (
  <View style={styles.detailItem}>
    <View style={styles.iconContainer}>
      {icon === 'assignment' ? (
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
  textContainer: {
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
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e7f1ff',
    borderWidth: 0.3,
    borderRadius: 1,
    padding: 12,
    marginBottom: 0,
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
    fontWeight: 'bold',
    marginTop: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#1996D3',
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#074B7C',
  },
  descriptionBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    borderColor: '#d3d3d3',
    borderWidth: 1,
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 18,
  },
});

export default AssetInfo;
