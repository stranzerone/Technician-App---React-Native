import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

const RemarkCard = ({  item, onRemarkChange }) => {
  // Initialize the remark state based on item.remark, if exists
  const [isEditing, setIsEditing] = useState(false);
  const [remark, setRemark] = useState(item.remarks || ""); // Default to empty string if no remark

  // Handle click on title to activate the input
  const handleTitleClick = () => {
    setIsEditing(true); // Activate the input field
  };

  // Handle text input change
  const handleRemarkChange = (text) => {
    setRemark(text);
    onRemarkChange(item.id, text); // Update the remark in the parent component (if needed)
  };

  return (
    <View className="flex-row items-center p-3 border border-gray-300 rounded-lg mb-3 bg-white shadow-sm">
      {/* Render title */}
    

      {/* Render remark input or text based on isEditing state */}
      <View className="ml-4 flex-grow">
        {isEditing ? (
          <TextInput
            value={remark}
            onChangeText={handleRemarkChange}
            placeholder="Enter your remark"
            className="border border-gray-300 rounded p-2 mt-2"
            autoFocus
          />
        ) : (
          <TouchableOpacity onPress={handleTitleClick}>
            <Text className="text-sm text-gray-600 mt-2">{remark || "Click to add remark"}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default RemarkCard;
