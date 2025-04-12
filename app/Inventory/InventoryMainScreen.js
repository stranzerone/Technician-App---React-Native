import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  useWindowDimensions,
  Platform,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const options = [
  { id: "IR", label: "Issue Request", icon: "exchange", enabled: true, color: "#1996D3" },
  { id: "IO", label: "Issue Order", icon: "truck", enabled: false, color: "#F97316" },
  { id: "PO", label: "Purchase Order", icon: "shopping-cart", enabled: false, color: "#22C55E" },
  { id: "PR", label: "Purchase Request", icon: "file-text", enabled: false, color: "#E11D48" },
];


const InventoryOptionsScreen = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const cardSize = isTablet ? "30%" : "47%";

  const navigation = useNavigation();
  return (
    <ScrollView className="flex-1 bg-white px-4 pt-6">
      <Text className="text-black text-2xl font-semibold mb-6">
        Inventory Actions
      </Text>

      <View className="flex-row flex-wrap justify-between">
        {options.map((option) => (
          <Pressable
  key={option.id}
  android_ripple={{ color: `${option.color}20`, borderless: false }}
  onPress={() => navigation.navigate("IssuedRequests")}
  disabled={!option.enabled}
  style={{
    width: cardSize,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 1,
    opacity: option.enabled ? 1 : 0.4,
    elevation: Platform.OS === "android" ? 2 : 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  }}
>
  <FontAwesome name={option.icon} size={32} color={option.color} />
  <Text  className="text-2xl font-black mt-2 text-black">
    {option.id}
  </Text>
  <Text  className="text-sm text-black font-bold mt-1">
    {option.label}
  </Text>
</Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

export default InventoryOptionsScreen;
