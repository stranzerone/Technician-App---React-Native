import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllUsersApi } from '../../service/GetUsersApi/GetAllUsersApi';

// Async thunk to fetch all users
export const fetchAllUsers = createAsyncThunk(
  'allUsers/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      console.log('fetching all users')
      const response = await getAllUsersApi();
      return response.data; // Adjust according to your API response structure
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch users');
    }
  }
);

const allUsersSlice = createSlice({
  name: 'allUsers',
  initialState: {
    data: [], // Array of user objects
    loading: false,
    error: null,
  },
  reducers: {
    clearAllUsers: (state) => {
      state.data = [];
      state.error = null;
    },
    getUserNameById: (state, action) => {
      // Extract user_id from action.payload
      const userId = action.payload;
      // Find the user in the current state
      const user = state.data.find((user) => user.user_id === userId);
      // Return the user's name or a fallback value
      return user ? user.name : 'Unknown User';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAllUsers, getUserNameById } = allUsersSlice.actions;

export default allUsersSlice.reducer;
