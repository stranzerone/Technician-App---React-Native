import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import RemarkCard from "./RemarkCard"; // Import RemarkCard component
import styles from "../BuggyListCardComponets/InputFieldStyleSheet";
import { UpdateInstructionApi } from "../../service/BuggyListApis/UpdateInstructionApi";

const CheckboxCard = ({ title, item, onUpdate,editable }) => {
  // Set the initial checkbox state based on item.result
  const [isChecked, setIsChecked] = useState(item.result === "1");

  const handleCheckboxPress = async () => {
    const newState = !isChecked;
    setIsChecked(newState);

    // Prepare payload
    const payload = {
      id: item.id,
      value: newState ? "1" : "0", // Send '1' if checked, '0' if unchecked
      WoUuId: item.ref_uuid,
      image: false,
    };

    try {
    const response =  await UpdateInstructionApi(payload); // Call API to update state
       
    onUpdate()
    } catch (error) {
      console.error("Error updating instruction:", error);
    }
  };

  const handleTitlePress = () => {
    handleCheckboxPress(); // Trigger the same action as clicking the checkbox
  };

  return (
    <View
      style={[
        styles.inputContainer,
        isChecked && { backgroundColor: "#DFF6DD" }, // Light green if checked
      ]}
      className="p-5 border border-gray-200 rounded-lg mb-4 bg-white shadow-md"
    >
      {/* Checkbox and title container */}
      <View className="flex-row items-center mb-5">
        {/* Circular Checkbox */}
        <CircularCheckbox editable={editable} isChecked={isChecked} onPress={handleCheckboxPress} />

        {/* Title */}
        <TouchableOpacity disabled={!editable} onPress={handleTitlePress} className="ml-4">
          <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
      </View>

      {/* Render the RemarkCard component */}
      <RemarkCard
        item={item}
        onRemarkChange={(id, newRemark) =>
          console.log(`Remark updated for ${id}: ${newRemark}`)
        }
      />
    </View>
  );
};

const CircularCheckbox = ({ isChecked, onPress,editable }) => {
  console.log(editable,'editable for checkbox')
  return (
    <TouchableOpacity disabled={!editable} onPress={onPress} className="flex items-center justify-center">
      <View
        className={`w-7 h-7 rounded-full border-2 ${
          isChecked ? "border-[#074B7C]" : "border-[#1996D3]"
        } flex items-center justify-center`}
      >
        {isChecked && <View className="w-4 h-4 rounded-full bg-[#074B7C]" />}
      </View>
    </TouchableOpacity>
  );
};

export default CheckboxCard;
