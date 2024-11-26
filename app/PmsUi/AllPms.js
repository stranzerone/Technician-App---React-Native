import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
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
  const [popupType, setPopupType] = useState(""); // Success, Error, etc.
  const [confirmationPopupVisible, setConfirmationPopupVisible] = useState(false);
  const [selectedUuid, setSelectedUuid] = useState(null);

  useEffect(() => {
    const fetchPMs = async () => {
      try {
        const data = await GetAllPmsApi();
        setPms(data);
        setFilteredPms(data); // Initialize filtered PMs with all data
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
      setFilteredPms(pms); // Reset to original list if search is cleared
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
      className="bg-white rounded-lg p-4 mb-6 shadow-lg border-2 border-blue-300"
      style={{ elevation: 5 }} // Add a bit of shadow for a lifted effect
    >
      {/* PM Name */}
      <View className="flex-row items-center mb-3">
        <Icon name="build" size={28} color="#1996D3" />
        <Text className="ml-3 text-black text-lg font-semibold">
          {item.Name || "Unnamed PM"}
        </Text>
      </View>

      {/* Asset */}
      <View className="flex-row items-center mb-3">
        <Icon name="precision-manufacturing" size={24} color="#4CAF50" />
        <Text className="ml-3 text-gray-800 text-sm">
          <Text className="font-medium text-black">Asset:</Text>{" "}
          {item.ass || "Not Assigned"}
        </Text>
      </View>

      {/* Category */}
      <View className="flex-row items-center mb-3">
        <Icon name="category" size={24} color="#FFA726" />
        <Text className="ml-3 text-gray-800 text-sm">
          <Text className="font-medium text-black">Category:</Text>{" "}
          {item.cat || "N/A"}
        </Text>
      </View>

      {/* Location */}
      <View className="flex-row items-center">
        <Icon name="location-on" size={24} color="#F44336" />
        <Text className="ml-3 text-gray-800 text-sm">
          <Text className="font-medium text-black">Location:</Text>{" "}
          {item.loc || "Unknown"}
        </Text>
      </View>

      {/* Create Button */}
      <TouchableOpacity
        onPress={() => showConfirmationPopup(item._ID)}
        style={{
          backgroundColor: "#1996D3",
          padding: 10,
          marginTop: 10,
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Create</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {/* Search Bar */}
      <TextInput
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search PMs by Name"
        className="bg-white p-3 rounded-lg mb-5 border-2 border-gray-300 shadow-md"
        style={{
          fontSize: 16,
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

      {/* Dynamic Popup for Confirmation */}
      <DynamicPopup
        visible={popupVisible}
        type={popupType}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
        onOk={() => setPopupVisible(false)} // Close the popup on 'OK' press
      />

      {/* Confirmation Popup */}
      <DynamicPopup
        visible={confirmationPopupVisible}
        type="alert"
        message="Are you sure you want to create this PMS?"
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
