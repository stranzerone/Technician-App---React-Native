import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { selectAssets } from '../../../utils/Slices/AssetSlice';

const AssetCard = ({ searchQuery, onClose, onSelect }) => {
  // Access assets data from Redux
  const assets = useSelector(selectAssets);


  console.log(assets,'assets')
  // Filter assets based on the search query
  const filteredAssets = assets.data.filter((item) =>

     item.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAsset = (asset) => {
    onSelect(asset); // Call the onSelect function with the selected asset
    onClose(); // Close the card when an asset is selected
  };

  return (
    <View style={styles.cardContainer}>
      {/* Close button with an icon on the top right */}
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <FontAwesome name="close" size={24} color="#B0BEC5" />
      </TouchableOpacity>

      {filteredAssets && filteredAssets.length > 0 ? (
        // Map through the filtered assets array to render each item
        filteredAssets.map((item,index) => (
          <TouchableOpacity
            key={index} // Unique key for each item
            style={styles.assetItem}
            onPress={() => handleSelectAsset(item)} // Handle asset selection
          >
            <Text style={styles.assetText}>{item.Name}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noAssetsText}>No assets found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    zIndex: 10000,
    position: 'absolute', // Keep it positioned above other components
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: '#1996D3',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  assetItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginVertical: 5,
  },
  assetText: {
    color: '#074B7C',
    fontSize: 16,
    fontWeight: '500',
  },
  noAssetsText: {
    color: '#B0BEC5',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default AssetCard;
