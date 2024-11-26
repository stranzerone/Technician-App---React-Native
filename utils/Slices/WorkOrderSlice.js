// ./app/redux/workOrdersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GetAllWorkOrders } from '../../service/WorkOrderApis/GetAllWorkOrderApi';

// Async thunk to fetch work orders with hardcoded statuses
export const fetchWorkOrders = createAsyncThunk('workOrders/fetchWorkOrders', async (_, { rejectWithValue }) => {
  // Define the statuses array directly in the thunk
  const filters = ['OPEN', 'STARTED', 'COMPLETED', 'HOLD', 'CANCELLED', 'REOPEN'];
  let allWorkOrders = [];

  for (const status of filters) {
    try {
      const response = await GetAllWorkOrders(status); // Fetch work orders for each status

      // If no data is returned, skip to the next status
      if (!response || response.length === 0) {
        continue; // Skip to the next status
      }

      allWorkOrders = [...allWorkOrders, ...response]; // Add each response to the array
    } catch (error) {
      console.error(`Error fetching work orders for status: ${status}`, error);
      continue; // Skip to the next status if there's an error
    }
  }

  // If no work orders were fetched after all attempts, reject the thunk
  if (allWorkOrders.length === 0) {
    return rejectWithValue('No work orders could be fetched.');
  }

  return allWorkOrders; // Return the combined array of work orders
});

const workOrdersSlice = createSlice({
  name: 'workOrders',
  initialState: {
    data: [],
    filteredData: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    filterWorkOrders: (state, action) => {
      const status = action.payload;
     console.log(status,"pauload")
      if (status) {
        // Use state.data to filter
        state.filteredData = state.data.filter(item =>
          item.wo.status == status
        );
      } else {
        // Reset to full data if no search text
        state.filteredData = state.data; 
      }

    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWorkOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.filteredData = action.payload;
      })
      .addCase(fetchWorkOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Set custom error message if no data fetched
      });
  },
});

// Export the filterWorkOrders action
export const { filterWorkOrders } = workOrdersSlice.actions;

// Selectors to access data
export const selectWorkOrders = (state) => state.workOrders.data;
export const selectFilteredWorkOrders = (state) => state.workOrders.filteredData;

export default workOrdersSlice.reducer;
