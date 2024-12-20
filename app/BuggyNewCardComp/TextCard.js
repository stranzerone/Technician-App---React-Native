import React, { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import RemarkCard from "./RemarkCard"; // Assuming you have a RemarkCard component
import styles from "../BuggyListCardComponets/InputFieldStyleSheet";
import { UpdateInstructionApi } from "../../service/BuggyListApis/UpdateInstructionApi";

const TextCard = ({ item, onUpdate , editable }) => {
  const [value, setValue] = useState(item.result || "");

  const handleBlur = async () => {
    try {
      // Prepare the payload
      const payload = {
        id: item.id,
        value: value.trim(), // Send trimmed value
        WoUuId: item.ref_uuid,
        image: false,
      };

      // Call the API to update the value
      await UpdateInstructionApi(payload);
      onUpdate()
    } catch (error) {
      console.error("Error updating instruction:", error);
      Alert.alert("Error", "Failed to update instruction.");
    }
  };

  return (
    <View
      style={[
        styles.inputContainer,
        value ? { backgroundColor: "#DFF6DD" } : null, // Light green if value is not empty
      ]}
    >
      {/* Title */}
      <Text style={styles.title}>{item.title}</Text>

      {/* Text input for value */}

    {editable?
    
  
      <TextInput
        style={styles.inputContainer}
        value={value}
        onChangeText={setValue}
        onBlur={handleBlur} // Call API when input loses focus
        placeholder="Enter your text"
      />
:
<Text style={styles.inputContainer}>
  {item.result}
</Text>
}
      {/* RemarkCard placed below the text input */}
      <RemarkCard
        item={item}
        onRemarkChange={(id, newRemark) =>
          console.log(`Remark updated for ${id}: ${newRemark}`)
        }
      />
    </View>
  );
};

export default TextCard;
