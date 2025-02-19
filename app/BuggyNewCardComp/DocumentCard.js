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
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const fileSizeInMB = (result.assets?.[0]?.size || 0) / (1024 * 1024);
        if (fileSizeInMB > 10) {
          Alert.alert("Error", "The selected file is too large. Please upload a file smaller than 10MB.");
          return;
        }

        setSelectedFile(result);
        setIsUploading(true);

        const uploadResponse = await uplodPdfToServer(result.assets[0], item.id, item.ref_uuid);
        if (uploadResponse) {
          onUpdate();
          setUploadSuccess(true);
        }
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while selecting the document.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!item.result) {
      Alert.alert("No Document", "There is no document to download.");
      return;
    }

    try {
      const supported = await Linking.canOpenURL(item.result);
      if (supported) {
        Linking.openURL(item.result);
      } else {
        Alert.alert("Error", "Unable to open the document.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while attempting to download the file.");
    }
  };

  const extractFileNameFromNewBill = (url) => {
    const fileName = decodeURIComponent(url.split('/').pop());
    const nameOfFile = fileName.split('_')[2];
    console.log(nameOfFile,'this is name of file')
    return nameOfFile || "No name for PDF";
  };

  return (
    <View
      style={[
        styles.inputContainer,
        item.result || selectedFile ? { backgroundColor: "#DFF6DD" } :editable? { backgroundColor: "white" }:{backgroundColor:"#FEB2B2"},
      ]}
    >
      <Text style={styles.title}>{item.title}</Text>

      <View className="flex-row justify-between items-center">
        <TouchableOpacity
          disabled={!editable || isUploading}
          onPress={handleUpload}
          className="flex-row items-center bg-[#1996D3] px-4 py-2 rounded-md"
        >
          <FontAwesome name="upload" size={16} color="#fff" />
          <Text className="text-white ml-2 text-sm font-medium">Upload File</Text>
        </TouchableOpacity>

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
              {item.result ? "Download File" : "No File"}
            </Text>
          </TouchableOpacity>
        )}
        
        {item?.data?.optional && (
          <View className="flex-1 bg-transparent justify-end py-4">
            <View className="flex-row justify-end gap-1 items-center absolute bottom-2 right-0">
              <Icon name="info-circle" size={16} color="red" />
              <Text className="text-sm text-black mr-2">Optional</Text>
            </View>
          </View>
        )}
      </View>

      {item.result && (
        <View className="flex flex-row px-4 py-3 items-center mt-2 space-x-2">
          <FontAwesome name="file-pdf-o" size={16} color="#074B7C" />
          <Text className="text-gray-500 text-sm font-medium">
            {extractFileNameFromNewBill(item.result)}
          </Text>
        </View>
      )}

      <View className="mt-4">
        <RemarkCard item={item} editable={editable} />
      </View>
    </View>
  );
};

export default DocumentCard;
