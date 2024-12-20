import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, Linking } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import styles from "../BuggyListCardComponets/InputFieldStyleSheet";
import { uplodPdfToServer } from "../../service/ImageUploads/ConvertPdfToUrl";
import RemarkCard from "./RemarkCard";

const DocumentCard = ({ item ,onUpdate,editable}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false); // State to track upload status

  console.log(item, "this is card of pdf");

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      console.log(result, 'this is result pdf');

      if (!result.canceled && result.assets[0].uri) {
        setSelectedFile(result);
        const uploadResponse = await uplodPdfToServer(result.assets[0], item.id, item.ref_uuid);
        console.log(uploadResponse, 'response on uploading pdf');
        
        // Optionally handle success here if needed
        if (uploadResponse.data.status === "success") {
          onUpdate()
          setUploadSuccess(true); // Mark upload as successful
        }
      }
    } catch (error) {
      console.error("Error selecting document: ", error);
    }
  };

  const handleDownload = () => {
    if (item.result) {
      // If item.result exists, open the document URL
      Linking.openURL(item.result).catch((err) => {
        Alert.alert("Error", "Unable to open the document.");
      });
    } else {
      Alert.alert("No Document", "There is no document to download.");
    }
  };

  return (
    <View
      style={[
        styles.inputContainer,
       
        item.result || selectedFile ? { backgroundColor: "#DFF6DD" } : { backgroundColor: "white" }, // Green if item.result or upload is successful
     ]
    }
    >
      {/* Title Section */}
      <Text style={styles.title} >
        {item.title}
      </Text>

      {/* Buttons Section */}
      <View className="flex-row justify-between items-center">
        {/* Upload PDF Button */}
        <TouchableOpacity
        disabled={!editable}
          onPress={handleUpload}
          className="flex-row items-center bg-[#1996D3] px-4 py-2 rounded-md"
        >
          <FontAwesome name="upload" size={16} color="#fff" />
          <Text className="text-white ml-2 text-sm font-medium">Upload PDF</Text>
        </TouchableOpacity>

        {/* Download PDF Button */}
        <TouchableOpacity
          onPress={handleDownload}
          className={`flex-row items-center ${item.result  ? "bg-[#074B7C]" : "bg-gray-400"} px-4 py-2 rounded-md`}
          disabled={!item.result && !selectedFile}
        >
          <FontAwesome name="download" size={16} color="#fff" />
          <Text className="text-white ml-2 text-sm font-medium">
            {item.result  ? "Download PDF" : "No File"}
          </Text>
        </TouchableOpacity>
        
      </View>
      <View className="mt-4"> 
      <RemarkCard
      className="mt-4"
        item={item}
        onRemarkChange={(id, newRemark) =>
          console.log(`Remark updated for ${id}: ${newRemark}`)
        }
      />
      </View>
    

    </View>
  );
};

export default DocumentCard;
