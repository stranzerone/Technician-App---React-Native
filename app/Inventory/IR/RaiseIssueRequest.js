import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const sampleItems = [
  { name: "Item 1000", purchasePrice: 480.93, tax: 10, availableQuantity: 5 },
  { name: "Item 1001", purchasePrice: 550.25, tax: 12, availableQuantity: 10 },
  { name: "Item 1002", purchasePrice: 380.0, tax: 8, availableQuantity: 2 },
];

const CreateIRScreen = () => {
  const [items, setItems] = useState([
    { id: Date.now(), item: null, quantity: "", isDropdownOpen: false, search: "" },
  ]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        item: null,
        quantity: "",
        isDropdownOpen: false,
        search: "",
      },
    ]);
  };

  const handleUpdate = (index, key, value) => {
    const updated = [...items];
    updated[index][key] = value;
    setItems(updated);
  };

  const toggleDropdown = (index) => {
    const updated = [...items];
    updated[index].isDropdownOpen = !updated[index].isDropdownOpen;
    setItems(updated);
  };

  const selectItem = (index, item) => {
    const updated = [...items];
    updated[index].item = item;
    updated[index].isDropdownOpen = false;
    updated[index].search = item.name;
    setItems(updated);
  };

  const filterItems = (search) => {
    return sampleItems.filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase())
    );
  };

  const handleSubmit = () => {
    Alert.alert("Submitted", "Your IR has been submitted successfully!");
  };

  return (
    <ScrollView className="flex-1 bg-[#F8FAFC] p-4">
      <Text className="text-black text-2xl font-bold mb-4">
        <Icon name="clipboard" size={24} /> Create New IR
      </Text>

      {items.map((entry, index) => {
        const filtered = filterItems(entry.search);
        const item = entry.item;
        const price = item?.purchasePrice || 0;
        const tax = item?.tax || 0;
        const quantity = parseInt(entry.quantity) || 0;
        const amount = price * quantity;
        const total = amount + tax;
        const available = item?.availableQuantity || 0;
        const isOverQuantity = quantity > available;

        return (
          <View
            key={entry.id}
            className="bg-white rounded-2xl p-4 mb-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            {/* Item Selector */}
            <Text className="text-sm text-gray-700 mb-1">
              <Icon name="list" size={14} /> Select Item
            </Text>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => toggleDropdown(index)}
              className="border border-gray-300 rounded-xl px-3 py-2 mb-1 flex-row justify-between items-center"
            >
              <TextInput
                className="text-black flex-1"
                placeholder="Choose item"
                value={entry.search}
                onChangeText={(text) => handleUpdate(index, "search", text)}
                onFocus={() => handleUpdate(index, "isDropdownOpen", true)}
              />
              <Icon
                name={entry.isDropdownOpen ? "chevron-up" : "chevron-down"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>

            {entry.isDropdownOpen && (
              <View className="border border-gray-300 rounded-xl max-h-40 bg-white mb-3">
                <FlatList
                  data={filtered}
                  keyExtractor={(item) => item.name}
                  keyboardShouldPersistTaps="handled"
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => selectItem(index, item)}
                      className="p-3 border-b border-gray-200"
                    >
                      <Text className="text-black text-base">
                        <Icon name="circle-thin" size={16} /> {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

            {/* Quantity Input */}
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-sm text-gray-700">
                <Icon name="sort-numeric-asc" size={14} /> Quantity
              </Text>
              {item && (
                <Text className="text-sm text-green-600 font-medium">
                  <Icon name="cubes" size={14} /> Available: {available}
                </Text>
              )}
            </View>
            <TextInput
              className={`border rounded-xl px-3 py-2 mb-2 text-black ${
                isOverQuantity ? "border-red-500" : "border-gray-300"
              }`}
              keyboardType="numeric"
              value={entry.quantity}
              onChangeText={(val) => handleUpdate(index, "quantity", val)}
            />

            {/* Summary */}
            <View className="flex-row justify-between flex-wrap mt-2">
              <Text className="text-sm w-1/2 text-gray-600">
                <Icon name="money" size={14} /> Price:{" "}
                <Text className="text-black font-medium">₹{price}</Text>
              </Text>
              <Text className="text-sm w-1/2 text-gray-600">
                <Icon name="percent" size={14} /> Tax:{" "}
                <Text className="text-black font-medium">₹{tax}</Text>
              </Text>
              <Text className="text-sm w-1/2 text-gray-600">
                <Icon name="calculator" size={14} /> Amount:{" "}
                <Text className="text-black font-medium">₹{amount}</Text>
              </Text>
              <Text className="text-sm w-1/2 text-gray-600">
                <Icon name="inr" size={14} /> Total:{" "}
                <Text className="text-black font-semibold">₹{total}</Text>
              </Text>
            </View>
          </View>
        );
      })}

      {/* Add More & Submit Buttons */}
      <View className="flex-row w-full justify-between mt-2 mb-6 space-x-2">
        <TouchableOpacity
          onPress={handleAddItem}
          className="bg-[#1996D3] w-1/2 rounded-full p-3 items-center flex-row justify-center"
        
        >
          <Icon name="plus-circle" size={20} color="#fff" />
          <Text className="text-white text-base font-semibold ml-2">
            Add Item
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-green-600 rounded-full  p-3 items-center flex-row justify-center"
        >
          <Icon name="check-circle" size={20} color="#fff" />
          <Text className="text-white text-base font-semibold ml-2">
            Submit
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

export default CreateIRScreen;
