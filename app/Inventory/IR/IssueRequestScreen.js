import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import IRCard from "./IRcard"; // adjust path as needed
import { GetAllIssueItems } from "../../../service/Inventory/GetAllissues";

const IRItemsScreen = () => {
  const navigation = useNavigation();

  const [irItems, setIrItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const response = await GetAllIssueItems();
      setIrItems(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message || error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const renderHeader = () => (
    <View className="flex-row items-center mb-4 px-4 pt-6">
      <FontAwesome name="list-alt" size={22} color="#000" />
      <Text className="text-black text-2xl font-bold ml-2">IR List</Text>
    </View>
  );

  const handleCreateIR = () => {
    navigation.navigate("CreateIssueRequest"); // adjust route name as needed
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F1F5F9] px-4 pb-32">
      {loading ? (
        <ActivityIndicator size="large" color="#074B7C" className="mt-10" />
      ) : (
        <FlatList
          data={irItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <IRCard item={item} />}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {/* Floating Button */}
      <View className="absolute bottom-16 left-4 right-4">
        <TouchableOpacity
          onPress={handleCreateIR}
          className="bg-[#074B7C] py-4 rounded-2xl flex-row items-center justify-center shadow-lg"
        >
          <FontAwesome name="plus" size={16} color="#fff" />
          <Text className="text-white font-semibold ml-2">Create New IR</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default IRItemsScreen;
