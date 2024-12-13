import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import styles from "../BuggyListCardComponets/InputFieldStyleSheet"
const DocumentCard = ({ item, onOpenDocument }) => {
  const handlePress = () => {
    if (item.file) {
      onOpenDocument(item.file);  // Trigger the document opening logic
    } else {
      Alert.alert("No Document", "There is no document attached to this item.");
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      {item.file ? (
        <TouchableOpacity onPress={handlePress}>
          <Text style={styles.link}>View Document</Text>
        </TouchableOpacity>
      ) : (
        <Text>No document attached</Text>
      )}
    </View>
  );
};

export default DocumentCard;
