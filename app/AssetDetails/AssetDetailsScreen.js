import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import AssetInfo from './AssetInfo';
import CommentsPage from '../WoComments/WoCommentsScreen';
import { FontAwesome5 } from '@expo/vector-icons'; // Import FontAwesome5

const AssetDetailsMain = ({ uuid }) => {
  const [expanded, setExpanded] = useState(false); // State for managing expand/collapse
  const animation = useState(new Animated.Value(0))[0]; // Initialize animation state

  const WoUuId = uuid;
  console.log(WoUuId, 'Uuid at infomain');

  // Toggle expansion
  const toggleExpand = () => {
    const finalValue = expanded ? 0 : 1; // 0 is collapsed, 1 is expanded
    setExpanded(!expanded);

    // Animate the expansion/collapse
    Animated.timing(animation, {
      toValue: finalValue,
      duration: 300, // Animation duration in milliseconds
      useNativeDriver: false, // `false` because height is being animated
    }).start();
  };

  const commentsHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 400], // Adjust the expanded height as needed
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <View style={styles.content}>
          {/* Info Section */}
          <AssetInfo WoUuId={WoUuId} />

          {/* Expandable Comments Section */}
          <Animated.View style={[styles.commentsContainer, { height: commentsHeight }]}>
            <CommentsPage WoUuId={WoUuId} />
          </Animated.View>

          {/* Expand/Collapse Button */}
          <TouchableOpacity style={styles.expandButton} onPress={toggleExpand}>
            <Text style={styles.expandText}>{expanded ? 'Collapse Comments' : 'Expand Comments'}</Text>
            <FontAwesome5
              name={expanded ? 'chevron-up' : 'chevron-down'} // Using FontAwesome5 icons
              size={20}
              color="#fff" // Set icon color to white for contrast
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  commentsContainer: {
    overflow: 'hidden', // Ensures content is hidden when collapsed
  },
  expandButton: {
    flexDirection: 'row',
    textAlign: 'center',
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#074B7C',
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center',
  },
  expandText: {
    fontSize: 16,
    color: 'white',
    marginRight: 8, // Add some space between text and icon
  },
});

export default AssetDetailsMain;
