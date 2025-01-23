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
    <View className="flex-row p-3 border border-blue-200 bg-white shadow-sm rounded-lg mb-3 relative">
      <FontAwesome name="comment" size={18} color="#1996D3" className="mr-2" />
      <View className="flex-1">
        <Text className="text-blue-700 ml-2 font-semibold">{item.name}</Text>
        <Text className="text-gray-600 ml-2">{item.remarks}</Text>
      </View>

      {/* Show Image Preview if img_src is available */}
      {item.img_src && (
        <TouchableOpacity onPress={toggleImageModal}>
          <Image
            source={{ uri: item.img_src }}
            style={{ width: 70, height: 70, borderRadius: 10 }}
          />
        </TouchableOpacity>
      )}

      {/* Display created_at at the bottom-left corner */}
      <Text className="absolute bottom-0 left-0 text-xs text-gray-500 ml-2">
        {useConvertToSystemTime(item.created_at)}
      </Text>

      {/* Image Preview Modal */}
      {isImageModalVisible && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={isImageModalVisible}
          onRequestClose={toggleImageModal}
        >
          <TouchableWithoutFeedback onPress={toggleImageModal}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
              }}
            >
              <Image
                source={{ uri: item.img_src }}
                style={{
                  width: "90%",
                  height: "80%",
                  borderRadius: 10,
                }}
                resizeMode="contain"
              />
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};
