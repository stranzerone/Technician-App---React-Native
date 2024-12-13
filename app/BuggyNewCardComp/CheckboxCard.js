import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import RemarkCard from "./RemarkCard"; // Import RemarkCard component
import styles from "../BuggyListCardComponets/InputFieldStyleSheet"
const CheckboxCard = ({ title, item }) => {
  // Set the initial checkbox state based on item.result
  const [isChecked, setIsChecked] = useState(item.result === "1");

  const handleCheckboxPress = () => {
    setIsChecked(!isChecked); // Toggle checkbox state
  };

  const handleTitlePress = () => {
    setIsChecked(!isChecked); // Toggle checkbox when title is clicked
  };

  console.log(item, title, "data");

  return (
    <View className="p-5 border border-gray-200 rounded-lg mb-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
      {/* Checkbox and title container */}
      <View className="flex-row items-center mb-5">
        {/* CircularCheckbox is clickable */}
        <CircularCheckbox isChecked={isChecked} onPress={handleCheckboxPress} />

        {/* Title is clickable */}
        <TouchableOpacity onPress={handleTitlePress} className="ml-4">
          <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
      </View>

      {/* Render the RemarkCard component */}
      <RemarkCard item={item} onRemarkChange={(id, newRemark) => console.log(id, newRemark)} />
    </View>
  );
};

const CircularCheckbox = ({ isChecked, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className="flex items-center justify-center">
      <View
        className={`w-7 h-7 rounded-full border-2 ${isChecked ? "border-[#074B7C]" : "border-[#1996D3]"} flex items-center justify-center`}
      >
        {isChecked && <View className="w-4 h-4 rounded-full bg-[#074B7C]" />}
      </View>
    </TouchableOpacity>
  );
};




export default CheckboxCard;
