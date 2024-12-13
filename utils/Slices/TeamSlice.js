import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllTeams } from '../../service/GetUsersApi/GetAllTeams';

// Async thunk to fetch all Teams
export const fetchAllTeams = createAsyncThunk(
  'allTeams/fetchAllTeams',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllTeams();
      return response.data; // Adjust according to your API response structure
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch Teams');
    }
  }
);

const allTeamsSlice = createSlice({
  name: 'allTeams',
  initialState: {
    data: [], // Array of Team objects
    loading: false,
    error: null,
  },
  reducers: {
    clearAllTeams: (state) => {
      state.data = [];
      state.error = null;
    },
    getTeamNameById: (state, action) => {
      // Extract team_id from action.payload
      const teamId = action.payload;
      // Find the Team in the current state
      const Team = state.data.find((Team) => Team.team_id === teamId);
      // Return the Team's name or a fallback value
      return Team ? Team.name : 'Unknown Team';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAllTeams, getTeamNameById } = allTeamsSlice.actions;

export default allTeamsSlice.reducer;
