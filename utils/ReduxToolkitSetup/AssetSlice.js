// ./app/redux/assetsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import GetStaff from "../../service/AddWorkOrderApis/FetchStaff.js"

// Async thunk to fetch assets from an API
export const fetchAssets = createAsyncThunk('assets/fetchAssets', async () => {
  const response = await GetStaff(); // Fetch staff data
  return response; // Assumes the response is in JSON format
});

const assetsSlice = createSlice({
  name: 'assets', // Clear naming for slice
  initialState: {
    data: [],
    filteredData: [], // Array to store filtered data
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Action to filter assets based on text
    filterAssets: (state, action) => {
      const searchText = action.payload.toLowerCase();

      if (searchText) {
        // Use state.data to filter
        state.filteredData = state.data.filter(item =>
          item.name.toLowerCase().includes(searchText)
        );
      } else {
        // Reset to full data if no search text
        state.filteredData = state.data; 
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.filteredData = action.payload; // Initialize filtered data
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export the filterAssets action
export const { filterAssets } = assetsSlice.actions;

// Selectors to access data
export const selectAssets = (state) => state.assets.data;
export const selectFilteredAssets = (state) => state.assets.filteredData;

export default assetsSlice.reducer;
