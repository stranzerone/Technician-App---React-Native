import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome for profile and chevron icons

const UserCard = ({ visible, onClose, users, onSelectUser }) => {
  // Render each user in the list
  const renderUser = ({ item }) => (
    <TouchableOpacity style={styles.userCard} onPress={() => onSelectUser(item)}>
      <View style={styles.userInfo}>
        {/* Profile icon */}
        <Icon name="user-circle" size={30} color="#074B7C" style={styles.profileIcon} />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userSociety}>{item.society_name}</Text>
        </View>
      </View>
      {/* Chevron icon for navigation */}
      <Icon name="chevron-right" size={20} color="#074B7C" />
    </TouchableOpacity>
  );

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popupContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✖</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Select User</Text>

          {/* FlatList to display the list of users */}
          <FlatList
            data={users}
            renderItem={renderUser}
            keyExtractor={(item) => item.user_id.toString()}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  popupContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    alignItems: 'flex-end',
  },
  closeButton: {
    fontSize: 20,
    color: '#074B7C', // Color for the close button
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#074B7C',
  },
  userCard: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    marginRight: 15,
  },
  userDetails: {
    flexDirection: 'column',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userSociety: {
    fontSize: 14,
    color: '#666',
  },
});

export default UserCard;
