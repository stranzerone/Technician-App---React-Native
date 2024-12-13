import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../BuggyListCardComponets/InputFieldStyleSheet"
import OptionsModal from "../DynamivPopUps/DynamicOptionsPopUp";
import RemarkCard from "./RemarkCard"; // Assuming RemarkCard is available

const DropdownCard = ({ item, onUpdate }) => {
  const [selectedValue, setSelectedValue] = useState(item.result || "");
  const [modalVisible, setModalVisible] = useState(false);

  const handleChange = (value) => {
    setSelectedValue(value);
    onUpdate(item.id, value);
    setModalVisible(false); // Close the modal after selection
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.title}>{item.title}</Text>

      {/* Touchable dropdown button */}
      <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dropdownText}>
          {item.result || selectedValue || "Select an option"}
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
      <RemarkCard item={item} onRemarkChange={(id, newRemark) => console.log(id, newRemark)} />
    </View>
  );
};

export default DropdownCard;
