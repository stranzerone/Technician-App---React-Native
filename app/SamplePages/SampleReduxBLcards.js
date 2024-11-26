import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataByUuid, selectBuggyList } from '../../utils/Slices/BuggyListSlice';
import { View, Text, FlatList } from 'react-native';

const BuggyListComponent = () => {
  const buggyList = useSelector(selectBuggyList);

  useEffect(() => {
console.log(buggyList)
  }, []);

  return (
    <View>
      <Text>Buggy List</Text>
  
    </View>
  );
};

export default BuggyListComponent;
