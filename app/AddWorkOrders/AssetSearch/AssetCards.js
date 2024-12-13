import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import GetAssets from '../../../service/AddWorkOrderApis/FetchAssests';

const AssetCard = ({ searchQuery, onClose, onSelect }) => {
  // State to store assets, loading, and error status
  const [assets, setAssets] = useState([]); // Always initialize as an array
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'succeeded' | 'failed'
  const [error, setError] = useState(null);

  // Log searchQuery for debugging

  useEffect(() => {
    const fetchAssetsData = async () => {
      setStatus('loading');
      try {
        // If searchQuery is empty, you can decide whether to fetch all assets or skip the fetch
        if (!searchQuery.trim()) {
          setAssets([]);  // Or decide to fetch all assets without filtering
          setStatus('succeeded');
          return;
        }

        const data = await GetAssets(searchQuery); // Pass searchQuery directly to the API
      console.log(data,"data on asset search")
        setAssets(data.data || []); // Ensure that assets is always an array
        setStatus('succeeded');
      } catch (error) {
        setError(error.message || 'Failed to fetch assets');
        setStatus('failed');
      }
    };

    fetchAssetsData(); // Fetch assets data whenever searchQuery changes
  }, [searchQuery]); // Trigger re-fetch when searchQuery changes

  // Filter assets based on the search query
  const filteredAssets = Array.isArray(assets) ? assets.filter((item) =>
    item.Name.toLowerCase().includes(searchQuery.toLowerCase())
  ) : []; // Ensure assets is an array before filtering

  const handleSelectAsset = (asset) => {
    onSelect(asset); // Call the onSelect function with the selected asset
    onClose(); // Close the card when an asset is selected
  };

  // Conditional rendering for loading, error, and assets
  if (status === 'loading') {
    return <Text>Loading assets...</Text>;
  }

  if (status === 'failed') {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.cardContainer}>
      {/* Close button with an icon on the top right */}
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <FontAwesome name="close" size={24} color="#B0BEC5" />
      </TouchableOpacity>

      {filteredAssets.length > 0 ? (
        // Map through the filtered assets array to render each item
        filteredAssets.map((item, index) => (
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
