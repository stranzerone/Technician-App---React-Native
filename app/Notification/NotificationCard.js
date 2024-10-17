// NotificationCard.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationCard = ({ message, createdAt }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.createdAt}>{new Date(createdAt).toLocaleString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // Increased border radius for a softer look
    padding: 20, // Added padding for better spacing
    marginBottom: 10, // Increased margin for better separation between cards
    elevation: 5, // More pronounced shadow effect
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 4 }, // Deeper shadow
    shadowOpacity: 0.2, // More visible shadow
    shadowRadius: 6, // More spread out shadow
    borderWidth: 1, // Border to enhance card appearance
    borderColor: '#1996D3', // Border color matching the theme
  },
  message: {
    fontSize: 16,
    color: '#074B7C', // Dark color for the message text
    lineHeight: 24, // Improved readability with line height
    fontWeight: '600', // Semi-bold for better emphasis
  },
  createdAt: {
    fontSize: 12,
    color: '#999', // Grey color for the timestamp
    marginTop: 8, // Increased spacing above timestamp
    alignSelf: 'flex-end', // Aligns the timestamp to the right
    fontStyle: 'italic', // Italic style for a subtle effect
  },
});

export default NotificationCard;
