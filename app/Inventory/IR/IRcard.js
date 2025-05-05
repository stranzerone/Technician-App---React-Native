import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Pressable } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const getStatusColor = (status) => {
  switch (status) {
    case "APPROVED":
      return "#22C55E";
    case "PENDING":
      return "#FACC15";
    case "DECLINED":
    case "CANCELLED":
      return "#EF4444";
    case "DRAFT":
      return "#A5B4FC";
    default:
      return "#CBD5E1";
  }
};


const IRCard = ({ item }) => {
  const issue = item.issue || {};
 
  const sequenceNo = issue["Sequence No"] || "N/A";
  const statusName = issue.Status || "Unknown";
  const createdAt = issue.created_at?.split(" ")[0] || "-";
  const statusColor = getStatusColor(statusName);
  const itemNames = item.item?.map((i) => i.Name).join(", ") || "Unnamed Item";


  const navigation = useNavigation()
  return (

    <Pressable
    onPress={()=>navigation.navigate("IrDetail", { item })}
      className="bg-white rounded-xl px-4 py-3 mb-1"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
      }}
    >
      {/* Top Row: Sequence No + Status Pill */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <FontAwesome name="hashtag" size={16} color="#64748B" />
          <Text className="ml-2 text-black text-base font-semibold">
            {sequenceNo}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: statusColor,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
          }}
        >
          <Text className="text-white text-xs font-black">{statusName}</Text>
        </View>
      </View>

      {/* Item Name */}
      <View className="flex-row items-center mb-2">
        <FontAwesome name="cube" size={16} color="#64748B" />
        <Text className="ml-2 text-gray-800 text-sm font-medium">{itemNames}</Text>
        </View>

      {/* Created At */}
      <View className="flex-row items-center">
        <FontAwesome name="calendar" size={16} color="#64748B" />
        <Text className="ml-2 text-gray-500 text-sm">Created At:</Text>
        <Text className="ml-1 text-black text-sm font-medium">{createdAt}</Text>
      </View>
    </Pressable>
  );
};

export default IRCard;
