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
  Keyboard,
  Dimensions
} from 'react-native';
import { GetInstructionsApi } from '../../service/BuggyListApis/GetInstructionsApi';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Loader from '../LoadingScreen/AnimatedLoader';
import ProgressPage from '../AssetDetails/ProgressBar';
import CommentsPage from '../WoComments/WoCommentsScreen';
import { FontAwesome5 } from '@expo/vector-icons';
import { WorkOrderInfoApi } from '../../service/WorkOrderInfoApi';
import CardRenderer from '../BuggyNewCardComp/CardsMainScreen';
import { Platform } from 'react-native';
import InfoCard from './InstructionDetails';

const BuggyListPage = ({ uuid, wo ,restricted,restrictedTime}) => {
  const [data, setData] = useState([]);
  const [assetDescription, setAssetDescription] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false); 
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const animation = useState(new Animated.Value(0))[0];
  const [canComplete,setCancomplete]  = useState(false)
  const navigate = useNavigation();
 
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);


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






  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardOpen(true);
    });

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardOpen(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  console.log(restrictedTime,'restrictedTime on bl list')
  const toggleExpand = () => {
    const finalValue = expanded ? 0 : 1; 
    setExpanded(!expanded);

    Animated.timing(animation, {
      toValue: finalValue,
      duration: 100,
      useNativeDriver: false, 
    }).start();
  };

  const {height}  = Dimensions.get('window')
  const commentsHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height * 0.75], 
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


  if(data){
    console.log(data.length,'true')
  }else{
    console.log(data.length,'in else')
  }


  return (
    <View
    style={{ flex: 1}}
    >
  
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContainer}>
       

          <View>
            <InfoCard  wo={wo} restricted={restricted} restrictedTime={restrictedTime}  description={assetDescription}/>
          </View>
          {/* List of Cards */}

          {data.length !== 0?
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
      <View style={[styles.expandButtonContainer,{bottom:isKeyboardOpen?0:65}]}  >
      
        <Animated.View style={[styles.commentsContainer, { height: commentsHeight,overflow:"scroll" }]}>
        <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    > 
            <CommentsPage WoUuId={uuid} />
</KeyboardAvoidingView>

        </Animated.View>
     
        <TouchableOpacity style={styles.expandButton} onPress={toggleExpand}>
          <FontAwesome5 name={expanded ? 'comments' : 'comments'} size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    { !expanded && <View    className="w-[70%] "  style={[styles.progressBarContainer, { right:canComplete?70:10,bottom: isKeyboardOpen?0: 57 }]}>
      <ProgressPage 
        data={data}
        wo={wo}
        canComplete={setCancomplete}
      />
      </View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
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
// bottom: 80,
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
    bottom: 5,
    height:"100%",
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
    flex:1,
    textAlign:'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign:"center",
    color: 'red',
    textAlignVertical:'center'
  },
});

export default BuggyListPage;