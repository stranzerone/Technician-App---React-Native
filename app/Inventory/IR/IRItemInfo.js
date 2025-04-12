import React from "react";
import { View, Text, ScrollView } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const IRDetailScreen = ({ route }) => {
  const { item } = route.params;
  const issue = item.issue || {};
  const items = item.item || [];

  return (
    <ScrollView className="flex-1 bg-[#F1F5F9] px-4 py-6">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-3xl font-bold text-[#074B7C]">IR #{issue["Sequence No"] || "N/A"}</Text>
        <Text className="text-gray-500 mt-1">Issued on {issue.created_at?.split(" ")[0] || "-"}</Text>
      </View>

      {/* Issue Summary Card */}
      <View className="bg-white rounded-2xl shadow-sm px-5 py-5 mb-6">
        <SectionHeader icon="info-circle" title="Issue Summary" />

        <InfoRow icon="barcode" label="Sequence No" value={issue["Sequence No"] || "N/A"} />
        <InfoRow icon="file-text" label="Description" value={issue.Description || "-"} />
        <InfoRow icon="calendar" label="Created At" value={issue.created_at?.split(" ")[0] || "-"} />
        <InfoRow
          icon="circle"
          label="Status"
          value={issue.Status || "Unknown"}
          color={getStatusColor(issue.Status)}
        />
      </View>

      {/* Item List */}
      <View className="bg-white rounded-2xl shadow-sm px-5 py-5">
        <SectionHeader icon="cube" title="Item Details" />
        {items.length === 0 ? (
          <Text className="text-gray-500 text-sm mt-2">No items available.</Text>
        ) : (
          items.map((it, index) => (
            <View
              key={index}
              className={`mb-4 pb-4 ${index !== items.length - 1 ? 'border-b border-gray-200' : ''}`}
            >
              <InfoRow icon="cubes" label="Item Name" value={it.Name || "-"} />
              <InfoRow icon="hashtag" label="Quantity" value={it.Quantity?.toString() || "-"} />
              <InfoRow icon="balance-scale" label="UOM" value={it.UOM || "-"} />
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const InfoRow = ({ icon, label, value, color = "#1E293B" }) => (
  <View className="flex-row items-start mb-3">
    <FontAwesome name={icon} size={18} color="#64748B" style={{ marginTop: 4 }} />
    <View className="ml-3 flex-1">
      <Text className="text-gray-500 text-xs uppercase tracking-wide">{label}</Text>
      <Text className="text-base font-semibold" style={{ color }}>{value}</Text>
    </View>
  </View>
);

const SectionHeader = ({ title, icon }) => (
  <View className="flex-row items-center mb-4">
    <FontAwesome name={icon} size={18} color="#074B7C" />
    <Text className="ml-2 text-lg font-bold text-[#074B7C]">{title}</Text>
  </View>
);

const getStatusColor = (status) => {
  switch (status) {
    case "Approved":
      return "#22C55E";
    case "Pending":
      return "#FACC15";
    case "Rejected":
    case "Cancelled":
      return "#EF4444";
    case "Draft":
    case "DRAFT":
      return "#A5B4FC";
    default:
      return "#94A3B8";
  }
};

export default IRDetailScreen;
