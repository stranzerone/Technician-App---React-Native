import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import styles from "../BuggyListCardComponets/InputFieldStyleSheet";
import OptionsModal from "../DynamivPopUps/DynamicOptionsPopUp";
import RemarkCard from "./RemarkCard"; // Assuming RemarkCard is available
import { UpdateInstructionApi } from "../../service/BuggyListApis/UpdateInstructionApi";

const DropdownCard = ({ item, onUpdate,editable }) => {
  const [selectedValue, setSelectedValue] = useState(item.result || "");
  const [modalVisible, setModalVisible] = useState(false);

  const handleChange = async (value) => {
    setSelectedValue(value); // Update the selected value locally

    try {
      // Prepare the payload
      const payload = {
        id: item.id,
        value: value,
        WoUuId: item.ref_uuid,
        image: false,
      };

      // Call the API to update the value
 await UpdateInstructionApi(payload);

  onUpdate()

    } catch (error) {
      console.error("Error updating option:", error);
      Alert.alert("Error", "Failed to update option.");
    }

    setModalVisible(false); // Close the modal after selection
  };

  return (
    <View
      style={[
        styles.inputContainer,
        selectedValue ? { backgroundColor: "#DFF6DD" } : null, // Light green if a value is selected
      ]}
    >
      {/* Title */}
      <Text style={styles.title}>{item.title}</Text>

      {/* Touchable dropdown button */}
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
        disabled={!editable}
          style={styles.inputContainer}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.dropdownText}>
            {selectedValue || "Select an option"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal for options */}
      <OptionsModal
        visible={modalVisible}
        options={item.options.map((option) => ({
          label: option,
          value: option,
        }))}
        onSelect={handleChange}
        onClose={() => setModalVisible(false)}
      />

      {/* RemarkCard placed below the dropdown */}
      <RemarkCard
        item={item}
        onRemarkChange={(id, newRemark) =>
          console.log(`Remark updated for ${id}: ${newRemark}`)
        }
      />
    </View>
  );
};

export default DropdownCard;
