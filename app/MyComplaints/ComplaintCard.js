import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import useConvertToSystemTime from '../TimeConvertot/ConvertUtcToIst';
const getStatusStyle = (status) => {
  switch (status) {
    case 'Open': return { backgroundColor: '#4CAF50' };
    case 'Hold': return { backgroundColor: '#FFC107' };
    case 'Cancelled': return { backgroundColor: '#F44336' };
    case 'WIP': return { backgroundColor: '#2196F3' };
    case 'Closed': return { backgroundColor: '#9E9E9E' };
    case 'Reopen': return { backgroundColor: '#FF9800' };
    case 'Completed': return { backgroundColor: '#673AB7' };
    case 'Resolved': return { backgroundColor: '#009688' };
    case 'Working': return { backgroundColor: '#3F51B5' };
    default: return { backgroundColor: '#074B7C' };
  }
};

const getStatusBorderColor = (status) => {
  switch (status) {
    case 'Open': return '#4CAF50';
    case 'Hold': return '#FFC107';
    case 'Cancelled': return '#F44336';
    case 'WIP': return '#2196F3';
    case 'Closed': return '#9E9E9E';
    case 'Reopen': return '#FF9800';
    case 'Completed': return '#673AB7';
    case 'Resolved': return '#009688';
    case 'Working': return '#3F51B5';
    default: return '#074B7C';
  }
};

const ComplaintCard = (data) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('CloseComplaint', {
      complaint:data.data
    });
  };



  return (
    <TouchableOpacity onPress={handlePress} style={[styles.card, { borderColor: getStatusBorderColor(data.data.status) }]}>
      <View style={styles.headerContainer}>
        <Text style={styles.name}>{data.data.com_no}</Text>
        <View style={[styles.statusContainer, getStatusStyle(data.data.status)]}>
          <Text style={styles.status}>{data.data.status}</Text>
        </View>
      </View>

      <Text style={styles.description}>{data.data.description}</Text>
      <Text style={styles.units}>Amount: {data.data.amount}</Text>
      <Text style={styles.date}>Created on: {useConvertToSystemTime(data.data.created_at)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderLeftWidth: 6,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  name: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333',
  },
  description: { 
    fontSize: 14, 
    color: '#666', 
    marginBottom: 10, 
    lineHeight: 20,
  },
  statusContainer: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  status: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#fff',
  },
  units: { 
    fontSize: 16, 
    fontWeight: '600',
    color: '#074B7C',
    marginBottom: 8,
  },
  date: { 
    fontSize: 14, 
    color: '#1996D3',
    marginTop: 10,
  },
});

export default ComplaintCard;
