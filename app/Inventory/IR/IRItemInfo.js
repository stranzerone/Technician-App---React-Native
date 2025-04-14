import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const IRDetailScreen = ({ route }) => {
  const { item } = route.params;
  const issue = item.issue || {};
  const items = item.item || [];

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      {/* Header */}
      <View className="mb-6 border-b border-gray-200 pb-4">
        <Text className="text-2xl font-bold text-[#074B7C] mb-1">Issue Request Detail</Text>
        <Text className="text-gray-400 text-sm">
          IR Number: <Text className="text-black font-medium">{issue["Sequence No"] || "N/A"}</Text>
        </Text>
        <Text className="text-gray-400 text-sm">
          Created on: <Text className="text-black font-medium">{issue.created_at?.split(" ")[0] || "-"}</Text>
        </Text>
      </View>

      {/* Request Approval Button */}
      <TouchableOpacity
        disabled={issue.Status !== "DRAFT"}
        className="mb-4"
      >
        <View className="bg-[#074B7C] rounded-xl">
          <Text className="text-white text-center py-3 font-semibold text-base">
            {issue.Status === "APPROVED" ? "Request Approval" : issue.Status}
          </Text>
        </View>
      </TouchableOpacity>

            {/* Description */}
            <View className="mb-6">
        <SectionTitle icon="file-text" title="Description" />
        <View className="mt-2 max-h-32 overflow-hidden">
          <ScrollView>
            <Text
              className="text-gray-700 text-base leading-relaxed"
              numberOfLines={5}
            >
              {issue.Description || "No description available."}
            </Text>
          </ScrollView>
        </View>
      </View>
      {/* Item Details */}
      <View className="mb-6">
        <SectionTitle icon="cube" title="Item Details" />
        {items.length === 0 ? (
          <Text className="text-gray-500 text-sm mt-2">No items available.</Text>
        ) : (
          items.map((it, index) => (
            <View
              key={index}
              className="mt-4 border border-gray-200 rounded-2xl p-4 bg-[#F9FAFB] shadow-sm"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <Text className="font-bold text-[#074B7C] text-base mb-3">
                {it.Name || `Item ${index + 1}`}
              </Text>

              <View className="flex-row justify-between mb-2">
                <ItemInfo  label="Quantity" value={it.Quantity?.toString() || "-"} />
                <ItemInfo align={"right"} label="UOM" value={it.UOM || issue.UOM || "-"} />
              </View>

              <View className="flex-row justify-between mb-2">
                <ItemInfo label="Price" value={formatCurrency(it.Price)} />
                <ItemInfo align={"right"} label="Tax" value={formatCurrency(it.Tax)} />
              </View>

              <View className="flex-row justify-between">
                <ItemInfo label="Amount" value={formatCurrency(it.Amount)} />
                <ItemInfo align={"right"} label="Total Price" value={formatCurrency(it["Total Price"])} />
              </View>
            </View>
          ))
        )}
      </View>





      {/* Summary Info Cards */}
      <View className="flex-row flex-wrap justify-between mb-6">
        <InfoBox label="Total Quantity" value={issue["Total Quantity"]?.toString() || "0"} icon="sort-numeric-asc" />
        <InfoBox label="Total Price" value={formatCurrency(issue["Total Price"])} icon="tag" />
        <InfoBox label="Total Tax" value={formatCurrency(issue["Total Tax"])} icon="percent" />
        <InfoBox label="Total Amount" value={formatCurrency(issue["Total Amount"])} icon="money" />
        <InfoBox label="Status" value={issue.Status || "Unknown"} color={getStatusColor(issue.Status)} icon="circle" />
      </View>
    </ScrollView>
  );
};

// Info Card Box
const InfoBox = ({ label, value, icon, color = "#1E293B" }) => (
  <View className="w-[48%] bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-5 mb-3">
    <View className="flex-row items-center mb-2">
      <FontAwesome name={icon} size={16} color="#64748B" />
      <Text className="ml-2 text-sm text-gray-500">{label}</Text>
    </View>
    <Text className="text-lg font-bold" style={{ color }}>{value}</Text>
  </View>
);

// Section Title with icon
const SectionTitle = ({ title, icon }) => (
  <View className="flex-row items-center">
    <FontAwesome name={icon} size={18} color="#1996D3" />
    <Text className="ml-2 text-lg font-semibold text-[#1996D3]">{title}</Text>
  </View>
);

// Label + Value for items
const ItemInfo = ({ label, value, align }) => (
  <View style={{ alignItems: align === "right" ? "flex-end" : "flex-start" }}>
    <Text className="text-gray-400 text-xs">{label}</Text>
    <Text className="text-gray-800 font-medium text-base">{value}</Text>
  </View>
);


// Format currency
const formatCurrency = (val) => {
  if (!val && val !== 0) return "-";
  return `₹ ${parseFloat(val).toFixed(2)}`;
};

// Color based on status
const getStatusColor = (status) => {
  switch (status) {
    case "APPROVED":
      return "#22C55E";
    case "PENDING":
      return "#FACC15";
    case "DECLINED":
      return "#EF4444";
    case "DRAFT":
      return "#A5B4FC";
    default:
      return "#64748B";
  }
};

export default IRDetailScreen;
