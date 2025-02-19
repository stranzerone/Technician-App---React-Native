import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Image, Text, View, Modal, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import useConvertToSystemTime from "../TimeConvertot/ConvertUtcToIst";

export const RenderComment = ({ item }) => {
  const [isImageModalVisible, setImageModalVisible] = useState(false);

  const toggleImageModal = () => {
    setImageModalVisible(!isImageModalVisible);
  };

  return (
    <View className="flex-row p-4 border border-blue-200 bg-white shadow-sm rounded-lg mb-3">
      <FontAwesome name="comment" size={18} color="#1996D3" className="mr-3 mt-1" />

      <View className="flex-1">
        {/* Staff Name */}
        <Text className="text-blue-700 font-semibold ml-1 mb-1">{item.name}</Text>
        
        {/* Comment */}
        <Text className="text-gray-600">{item.remarks}</Text>

        {/* Date and Time aligned to bottom-right */}
        <Text className="text-xs text-gray-500 mt-2 self-end">
          {useConvertToSystemTime(item.created_at)}
        </Text>
      </View>

      {/* Show Image Preview if img_src is available */}
      {item.img_src && (
        <TouchableOpacity onPress={toggleImageModal} className="ml-3">
          <Image
            source={{ uri: item.img_src }}
            style={{ width: 70, height: 70, borderRadius: 10 }}
          />
        </TouchableOpacity>
      )}

      {/* Image Preview Modal */}
      {isImageModalVisible && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={isImageModalVisible}
          onRequestClose={toggleImageModal}
        >
          <TouchableWithoutFeedback onPress={toggleImageModal}>
            <View className="flex-1 justify-center items-center bg-black/80">
              <Image
                source={{ uri: item.img_src }}
                className="w-11/12 h-4/5 rounded-lg"
                resizeMode="contain"
              />
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};
