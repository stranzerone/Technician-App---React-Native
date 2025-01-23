import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { GetInstructionsApi } from '../../service/BuggyListApis/GetInstructionsApi';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BuggyListCard from "../BuggyListCardComponets/BuggyListCard";
import Loader from '../LoadingScreen/AnimatedLoader';
import ProgressPage from '../AssetDetails/ProgressBar';
import CommentsPage from '../WoComments/WoCommentsScreen';
import { FontAwesome5 } from '@expo/vector-icons';
import { WorkOrderInfoApi } from '../../service/WorkOrderInfoApi';
import CardRenderer from '../BuggyNewCardComp/CardsMainScreen';
import { Platform } from 'react-native';

const BuggyListPage = ({ uuid, wo ,restricted}) => {
  const [data, setData] = useState([]);
  const [assetDescription, setAssetDescription] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false); 
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const animation = useState(new Animated.Value(0))[0];
  const [canComplete,setCancomplete]  = useState(false)
  const navigate = useNavigation();

  // Function to fetch buggy list data
  const loadBuggyList = async () => {
    try {
      const result = await GetInstructionsApi(uuid);
      if(result){
        setData(result);

      }else{
        setData([])
      }
    } catch (error) {
      setError(error.message || 'Something went wrong');
    } finally {
      setLoading(false)
    }
  };

  // Function to fetch asset description
  const loadAssetDescription = async () => {
    try {
      const response = await WorkOrderInfoApi(uuid); 
      setAssetDescription(response[0].wo.Description || 'No description available.');
    } catch (error) {
      setError(error.message || 'Error fetching asset description.');
    }
  };

  useEffect(() => {
    setLoading(true)
    loadBuggyList();
    loadAssetDescription(); 
  }, [uuid]);

  useFocusEffect(
    React.useCallback(() => {
      loadBuggyList(); 
      loadAssetDescription(); 
    }, [uuid])
  );

  const handleRefreshData = async () => {
    await loadBuggyList(); 
  };

  const renderCard = ({ item, index }) => (
    <CardRenderer
    restricted={restricted}
      item={item}
      onUpdateSuccess={handleRefreshData} 
      index={index}
      WoUuId={uuid}
      wo={wo}
    />
  );

  const toggleExpand = () => {
    const finalValue = expanded ? 0 : 1; 
    setExpanded(!expanded);

    Animated.timing(animation, {
      toValue: finalValue,
      duration: 300,
      useNativeDriver: false, 
    }).start();
  };

  const commentsHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 400], 
    extrapolate: 'clamp',
  });


  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={handleRefreshData} style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }




  if (loading) {
    return <Loader />;
  }



  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContainer}>
          {/* Description Section */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.assetDescription}>{assetDescription}</Text>
          </View>
      { restricted &&   <View className="flex flex-row gap-1 items-center justify-center">
        <FontAwesome5 name='stop-circle' size={20} color="red" />
                   <Text className="text-red-500 text-center">restriction applied</Text>
          </View>}
          {/* List of Cards */}

          {data?
          <FlatList
            data={data}
            renderItem={renderCard}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false} 
            contentContainerStyle={styles.listContainer}
          />
          : 
          
          
          <View style={styles.emptyContainer}>
          
                <Text style={styles.emptyText}>No instructions available.</Text>
           </View>
          }
          
          {/* Comments Section */}
      

          {/* Bottom Controls */}
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Comment input button */}
      <View style={styles.expandButtonContainer}>
      
        <Animated.View style={[styles.commentsContainer, { height: commentsHeight,overflow:"scroll" }]}>
           
            <CommentsPage WoUuId={uuid} />


        </Animated.View>
     
        <TouchableOpacity style={styles.expandButton} onPress={toggleExpand}>
          <FontAwesome5 name={expanded ? 'comments' : 'comments'} size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <View    className="w-[70%] "  style={[styles.progressBarContainer, { right:canComplete?70:10,bottom:70 }]}>
      <ProgressPage 
        data={data}
        wo={wo}
        canComplete={setCancomplete}
      />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E1F2FE',
    paddingBottom:100
  },
  scrollViewContainer: {
    paddingBottom: 100,
  },
  listContainer: {
    padding: 10,
    paddingBottom: 0,
  },
  expandButtonContainer: {
bottom: 80,
left:10,
  },
  expandButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#074B7C',
    borderRadius: 25,
  },
  commentsContainer: {
    position: 'absolute',
    bottom: 80,
    width: '95%',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  descriptionContainer: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
  },
  assetDescription: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  emptyContainer: {
    flex: 1,
    textAlign:'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign:"center",
    color: 'red',
  },
});

export default BuggyListPage;