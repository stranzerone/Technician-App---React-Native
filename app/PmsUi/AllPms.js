import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

import { GetAllPmsApi } from "../../service/PMS/GetAllPms";
import { CreatePmsApi } from "../../service/PMS/CreatePms";
import DynamicPopup from "../DynamivPopUps/DynapicPopUpScreen";

const PMList = () => {
  const [pms, setPms] = useState([]);
  const [filteredPms, setFilteredPms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState(""); 
  const [confirmationPopupVisible, setConfirmationPopupVisible] = useState(false);
  const [selectedUuid, setSelectedUuid] = useState(null);

  useLayoutEffect(() => {
    const fetchPMs = async () => {
      try {
        const data = await GetAllPmsApi();
        setPms(data);
        setFilteredPms(data); 
      } catch (error) {
        console.error("Error fetching PMs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPMs();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filteredData = pms.filter((item) =>
        item.Name?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPms(filteredData);
    } else {
      setFilteredPms(pms); 
    }
  };

  const handleCreatePms = async (uuid) => {
    try {
      const response = await CreatePmsApi({ uuid });
      setPopupType(response.status);
      setPopupMessage(response.message);
      setPopupVisible(true);
    } catch (error) {
      setPopupType("error");
      setPopupMessage("Failed to create PMS. Please try again.");
      setPopupVisible(true);
    }
  };

  const showConfirmationPopup = (uuid) => {
    setSelectedUuid(uuid);
    setConfirmationPopupVisible(true);
  };

  const renderItem = ({ item }) => (
    <View
      className="bg-white rounded-lg p-3 mb-4 shadow-md border-2 border-blue-300"
      style={{ elevation: 4 }}
    >
      <View className="flex-row items-center mb-2">
        <Icon name="file-text" size={24} color="#1996D3" />
        <Text className="ml-2 text-black text-base font-semibold">
          {item.Name || "Unnamed PM"}
        </Text>
      </View>

      <View className="flex-row items-center mb-2">
        <Icon name="cogs" size={20} color="#4CAF50" />
        <Text className="ml-2 text-gray-800 text-xs">
          <Text className="font-medium text-black">Asset:</Text>{" "}
          {item.ass || "Not Assigned"}
        </Text>
      </View>

      <View className="flex-row items-center mb-2">
        <Icon name="tags" size={20} color="#FFA726" />
        <Text className="ml-2 text-gray-800 text-xs">
          <Text className="font-medium text-black">Category:</Text>{" "}
          {item.cat || "N/A"}
        </Text>
      </View>

      <View className="flex-row items-center mb-2">
        <Icon name="map-marker" size={20} color="#F44336" />
        <Text className="ml-2 text-gray-800 text-xs">
          <Text className="font-medium text-black">Location:</Text>{" "}
          {item.loc || "Unknown"}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => showConfirmationPopup(item._ID)}
        style={{
          backgroundColor: "#1996D3",
          padding: 8,
          marginTop: 8,
          borderRadius: 4,
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 14 }}>
          Create
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 p-4 pb-0">
      <TextInput
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search PMs by Name"
        className="bg-white p-3 rounded-lg mb-5 border-2 border-gray-300 shadow-sm"
        style={{
          fontSize: 14,
          color: "#333",
        }}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1996D3" />
      ) : (
        <FlatList
          data={filteredPms}
          renderItem={renderItem}
          keyExtractor={(item) => item.uuid}
        />
      )}

      <DynamicPopup
        visible={popupVisible}
        type={popupType}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
        onOk={() => setPopupVisible(false)}
      />

      <DynamicPopup
        visible={confirmationPopupVisible}
        type="alert"
        message="Are you sure you want to create WO from this PM?"
        onClose={() => setConfirmationPopupVisible(false)}
        onOk={() => {
          setConfirmationPopupVisible(false);
          handleCreatePms(selectedUuid);
        }}
      />
    </View>
  );
};

export default PMList;
