import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, Linking, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import styles from "../BuggyListCardComponets/InputFieldStyleSheet";
import { uplodPdfToServer } from "../../service/ImageUploads/ConvertPdfToUrl";
import RemarkCard from "./RemarkCard";
import Icon from 'react-native-vector-icons/FontAwesome';

const DocumentCard = ({ item, onUpdate, editable }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false); // State to track upload status
  const [isUploading, setIsUploading] = useState(false); // State for loading spinner

  console.log(item, "this is card of pdf");

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });
  
      console.log(result, "this is result pdf");
  
      if (!result.canceled && result.assets[0].uri) {
        const fileSizeInMB = result.assets[0].size / (1024 * 1024); // Convert size from bytes to MB
  
        if (fileSizeInMB > 10) {
          Alert.alert("Error", "The selected file is too large. Please upload a file smaller than 10MB.");
          return; // Prevent further action if the file size exceeds 10MB
        }
  
        setSelectedFile(result);
        setIsUploading(true); // Show the loading spinner
        const uploadResponse = await uplodPdfToServer(result.assets[0], item.id, item.ref_uuid);
        console.log(uploadResponse, "response on uploading pdf");
  
        if (uploadResponse) {
          onUpdate();
          setUploadSuccess(true); // Mark upload as successful
        }
      }
    } catch (error) {
      console.error("Error selecting document: ", error);
      Alert.alert("Error", "An error occurred while selecting the document.");
    } finally {
      setIsUploading(false); // Hide the loading spinner once done
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

  const extractFileNameFromNewBill = (url) => {
    // Split the URL by '/' to get the last part (file name)
    const urlParts = url.split('/');
    const fileNameWithExtension = urlParts[urlParts.length - 1]; // Get the last part
    
    // Decode the URL-encoded file name (e.g., %20 to space)
    const decodedFileName = decodeURIComponent(fileNameWithExtension);
    
    // Extract the file name starting from "NEW Bill"
    const fileNameStartFromNewBill = decodedFileName.split("NEW Bill")[1]; // Extract from "NEW Bill" onward
    
    return "NEW Bill" + fileNameStartFromNewBill; // Return the full name starting from "NEW Bill"
  };
  

  return (
    <View
      style={[
        styles.inputContainer,
        item.result || selectedFile
          ? { backgroundColor: "#DFF6DD" }
          : { backgroundColor: "white" }, // Green if item.result or upload is successful
      ]}
    >
      {/* Title Section */}
      <Text style={styles.title}>{item.title}</Text>

      {/* Buttons Section */}
      <View className="flex-row justify-between items-center">
        {/* Upload PDF Button */}
        <TouchableOpacity
          disabled={!editable || isUploading} // Disable button while uploading
          onPress={handleUpload}
          className="flex-row items-center bg-[#1996D3] px-4 py-2 rounded-md"
        >
          <FontAwesome name="upload" size={16} color="#fff" />
          <Text className="text-white ml-2 text-sm font-medium">Upload PDF</Text>
        </TouchableOpacity>

        {/* Show loading spinner or Download PDF button */}
        {isUploading ? (
          <ActivityIndicator size="small" color="#1996D3" />
        ) : (
          <TouchableOpacity
            onPress={handleDownload}
            className={`flex-row items-center ${
              item.result ? "bg-[#074B7C]" : "bg-gray-400"
            } px-4 py-2 rounded-md`}
            disabled={!item.result && !selectedFile}
          >
            <FontAwesome name="download" size={16} color="#fff" />
            <Text className="text-white ml-2 text-sm font-medium">
              {item.result ? "Download PDF" : "No File"}
            </Text>
          </TouchableOpacity>
        )}
  {item?.data?.optional &&   
      <View className="flex-1 bg-transparent justify-end py-4 ">
      <View className="flex-row justify-end gap-1 items-center absolute bottom-2 right-0">
     
        <Icon name="info-circle" size={16} color="red" />
        <Text className="text-sm text-black mr-2">
          Optional
        </Text>
      </View>
    </View>}
       
      </View>

      {
  item.result && (
    <View className="flex flex-row px-4 py-3 items-center mt-2 space-x-2">
      <FontAwesome name="file-pdf-o" size={16} color="#074B7C" />
      <Text className="text-gray-500 text-sm font-medium">
        {extractFileNameFromNewBill(item.result)}
      </Text>
    </View>
  )
}

     

      <View className="mt-4">
      <RemarkCard item={item} />
      </View>
    </View>
  );
};

export default DocumentCard;
