import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { WorkOrderAddComments } from '../../service/CommentServices/WorkOrderCommentsAddApi';
import { WorkOrderComments } from "../../service/CommentServices/WorkOrderFetchCommentsApi";
import CommentCard from './WoCommentsCards';

const CommentsPage = ({ WoUuId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [selectedButton, setSelectedButton] = useState('C'); // Track selected button
  const { height } = Dimensions.get('window');
  // Function to fetch comments
  const loadComments = async () => {
    setLoading(true);
    try {
      const response = await WorkOrderComments(WoUuId,selectedButton);
      setComments(response);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [selectedButton]);

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await WorkOrderAddComments({ newComment }, WoUuId);
      console.log(response, 'console at ui');

      if (response) {
        // Fetch comments again to refresh the list
        await loadComments();
        // Clear the input field
        setNewComment('');
      }
    } catch (error) {
      console.error('Error sending comment:', error);
    }
  };

  const renderComment = ({ item }) => (
    <CommentCard comment={item} />
  );

  const handleButtonPress = (buttonName) => {
    setSelectedButton(buttonName); // Set selected button
  };

  // if (loading) {
  //   return (
  //     <View style={styles.loaderContainer}>
  //       <ActivityIndicator size="large" color="#1996D3" />
  //     </View>
  //   );
  // }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error fetching comments: {error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
 style={{height:500}}
  >
      {/* ScrollView for comments */}
     { 
      loading ? 
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1996D3" />
      </View>       :
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderComment}
            scrollEnabled={false}
            contentContainerStyle={styles.commentsList}
            ListEmptyComponent={
              <View style={styles.emptyList}>
                <Text style={styles.emptyText}>{`No ${selectedButton == "H"?"History":"Comments"} available`}</Text>
              </View>
            }
          />
        </ScrollView>
      </View>}

      {/* Comment input section */}
    {  selectedButton === 'C' && <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.input}
          placeholder=" Enter remarks up to 250 char"
          value={newComment}
          onChangeText={setNewComment}
          multiline
          numberOfLines={3}
          maxLength={200}
        />
        <TouchableOpacity style={styles.button} onPress={handleCommentSubmit}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>}

      {/* Bottom buttons for Comments, History, and All */}
      <View style={styles.bottomButtonsContainer}>

      <View  className="flex flex-row items-center justify-center w-[70%] ml-[15%]">
        <TouchableOpacity
          style={[
            styles.bottomButton,
            selectedButton === 'C' && styles.selectedButton, // Apply selected style
          ]}
          onPress={() => handleButtonPress('C')}
        >
          <Icon name="comments" size={16} color={selectedButton === 'C' ? '#fff' : '#074B7C'} />
          <Text style={[styles.bottomButtonText, selectedButton === 'C' && { color: '#fff' }]}>
            Comments
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.bottomButton,
            selectedButton === 'H' && styles.selectedButton,
          ]}
          onPress={() => handleButtonPress('H')}
        >
          <Icon name="history" size={16} color={selectedButton === 'H' ? '#fff' : '#074B7C'} />
          <Text style={[styles.bottomButtonText, selectedButton === 'H' && { color: '#fff' }]}>
            History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.bottomButton,
            selectedButton === 'all' && styles.selectedButton,
          ]}
          onPress={() => handleButtonPress('all')}
        >
          <Icon name="list" size={16} color={selectedButton === 'all' ? '#fff' : '#074B7C'} />
          <Text style={[styles.bottomButtonText, selectedButton === 'all' && { color: '#fff' }]}>
            All
          </Text>
        </TouchableOpacity>
      </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#074B7C",
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  commentsList: {
    paddingBottom: 16,
  },
  emptyList: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: "900",
    color: '#999',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  commentInputContainer: {
    height: 70,
    borderWidth: 1,
    backgroundColor: "#f2fcff",
    borderColor: "gray",
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    height: 40,
    marginRight: 10,
    backgroundColor: 'white',
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#074B7C',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomButtonsContainer: {
    width: '100%',
  
    height:"13%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 2,
    backgroundColor: '#a6d1e0',
  },
  bottomButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,  // Reduced padding
  },
  selectedButton: {
    borderRadius:10,
    backgroundColor: '#074B7C', // Background color when selected
  },
  bottomButtonText: {
    color: '#074B7C',
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 12, // Reduced font size
  },
});

export default CommentsPage;
