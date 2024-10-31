import React, { useLayoutEffect, useState } from 'react';
import GetAssets from '../../../service/AddWorkOrderApis/FetchAssests';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const AssetCard = ({ searchQuery, onClose, onSelect }) => {
  const [assets, setAssets] = useState([]);

  // Fetch assets based on the search query
  const getAssets = async (query) => {
    const response = await GetAssets(query);
    setAssets(response.data); 
  };

  useLayoutEffect(() => {
    getAssets(searchQuery);
  }, [searchQuery]);

  const handleSelectAsset = (asset) => {
    onSelect(asset); // Call the onSelect function with the asset's name
    onClose(); // Close the card when an asset is selected
  };

  return (
    <View style={styles.cardContainer}>
      {/* Close button with an icon on the top right */}
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <FontAwesome name="close" size={24} color="#B0BEC5" />
      </TouchableOpacity>

      {assets && assets.length > 0 ? (
        // Map through the assets array to render each item
        assets.map((item) => (
          <TouchableOpacity
            key={item._ID} // Unique key for each item
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
    width:"100%",
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
